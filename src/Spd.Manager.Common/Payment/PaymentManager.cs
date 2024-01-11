using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Polly;
using Polly.Retry;
using Spd.Manager.Common.ManagerContract;
using Spd.Resource.Applicants.Application;
using Spd.Resource.Applicants.Document;
using Spd.Resource.Applicants.DocumentTemplate;
using Spd.Resource.Applicants.Invoice;
using Spd.Resource.Applicants.LicenceApplication;
using Spd.Resource.Applicants.LicenceFee;
using Spd.Resource.Applicants.Payment;
using Spd.Resource.Organizations.Config;
using Spd.Utilities.Cache;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Payment;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using Spd.Utilities.Shared.ResourceContracts;
using System.Net;

namespace Spd.Manager.Common.Payment
{
    internal class PaymentManager :
        IRequestHandler<PaymentLinkCreateCommand, PaymentLinkResponse>,
        IRequestHandler<PaymenCreateCommand, Guid>,
        IRequestHandler<PaymentQuery, PaymentResponse>,
        IRequestHandler<PaymentFailedAttemptCountQuery, int>,
        IRequestHandler<PrePaymentLinkCreateCommand, PrePaymentLinkResponse>,
        IRequestHandler<PaymentReceiptQuery, FileResponse>,
        IRequestHandler<ManualPaymentFormQuery, FileResponse>,
        IRequestHandler<PaymentRefundCommand, PaymentRefundResponse>,
        IRequestHandler<CreateInvoicesInCasCommand, CreateInvoicesInCasResponse>,
        IRequestHandler<CreateOneInvoiceInCasCommand, CreateOneInvoiceInCasResponse>,
        IRequestHandler<UpdateInvoicesFromCasCommand, UpdateInvoicesFromCasResponse>,
        IPaymentManager
    {
        private readonly IPaymentService _paymentService;
        private readonly IConfigRepository _configRepository;
        private readonly IDistributedCache _cache;
        private readonly IPaymentRepository _paymentRepository;
        private readonly IMapper _mapper;
        private readonly IApplicationRepository _appRepository;
        private readonly IDocumentRepository _documentRepository;
        private readonly IDocumentTemplateRepository _documentTemplateRepository;
        private readonly IFileStorageService _fileStorageService;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly ILicenceFeeRepository _licFeeRepository;
        private readonly ILicenceApplicationRepository _licAppRepository;
        private readonly ILogger<IPaymentManager> _logger;
        private readonly ITimeLimitedDataProtector _dataProtector;

        public PaymentManager(IPaymentService paymentService,
            IConfigRepository configRepository,
            IDistributedCache cache,
            IPaymentRepository paymentRepository,
            IMapper mapper,
            IApplicationRepository appRepository,
            IDataProtectionProvider dpProvider,
            IDocumentRepository documentRepository,
            IDocumentTemplateRepository documentTemplateRepository,
            IFileStorageService fileStorageService,
            IInvoiceRepository invoiceRepository,
            ILicenceFeeRepository licFeeRepository,
            ILicenceApplicationRepository licAppRepository,
            ILogger<IPaymentManager> logger)
        {
            _paymentService = paymentService;
            _configRepository = configRepository;
            _cache = cache;
            _paymentRepository = paymentRepository;
            _mapper = mapper;
            _appRepository = appRepository;
            _documentRepository = documentRepository;
            _documentTemplateRepository = documentTemplateRepository;
            _fileStorageService = fileStorageService;
            _invoiceRepository = invoiceRepository;
            _licFeeRepository = licFeeRepository;
            _licAppRepository = licAppRepository;
            _logger = logger;
            _dataProtector = dpProvider.CreateProtector(nameof(PrePaymentLinkCreateCommand)).ToTimeLimitedDataProtector();
        }

        public async Task<PrePaymentLinkResponse> Handle(PrePaymentLinkCreateCommand command, CancellationToken ct)
        {
            _logger.LogInformation("PaymentManager get PrePaymentLinkCreateCommand");
            var app = await _appRepository.QueryApplicationAsync(new ApplicationQry(command.ApplicationId), ct);
            if (app == null)
                throw new ApiException(HttpStatusCode.BadRequest, "application does not exist.");
            if (app.PaidOn != null)
                throw new ApiException(HttpStatusCode.BadRequest, "application has already been paid.");

            //todo, the valid days needs to get from biz, current days is temporary
            var encryptedApplicationId = WebUtility.UrlEncode(_dataProtector.Protect(command.ApplicationId.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.APPLICATION_INVITE_VALID_DAYS)));

            var paymentId = Guid.NewGuid();
            var encryptedPaymentId = WebUtility.UrlEncode(_dataProtector.Protect(paymentId.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.APPLICATION_INVITE_VALID_DAYS)));
            return new PrePaymentLinkResponse($"{command.ScreeningAppPaymentUrl}?encodedAppId={encryptedApplicationId}&encodedPaymentId={encryptedPaymentId}");
        }

        public async Task<PaymentLinkResponse> Handle(PaymentLinkCreateCommand command, CancellationToken ct)
        {
            Guid applicationId;
            Guid paymentId;
            bool isFromSecurePaymentLink;
            _logger.LogInformation("PaymentManager get PaymentLinkCreateCommand");
            if (command.PaymentLinkCreateRequest is PaymentLinkFromSecureLinkCreateRequest request)
            {
                try
                {
                    string appIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(request.EncodedApplicationId));
                    applicationId = Guid.Parse(appIdStr);
                    string paymentIdStr = _dataProtector.Unprotect(WebUtility.UrlDecode(request.EncodedPaymentId));
                    paymentId = Guid.Parse(paymentIdStr);
                }
                catch
                {
                    throw new ApiException(HttpStatusCode.BadRequest, "The payment link is no longer valid.");
                }
                isFromSecurePaymentLink = true;
                //secure payment link can only be used once.
                var existingPayment = await _paymentRepository.QueryAsync(new PaymentQry(applicationId, paymentId), ct);
                if (existingPayment.Items.Any())
                    throw new ApiException(HttpStatusCode.BadRequest, "The payment link has already been used.");
            }
            else
            {
                applicationId = (Guid)command.PaymentLinkCreateRequest.ApplicationId;
                paymentId = Guid.NewGuid();
                isFromSecurePaymentLink = false;
            }

            //validation
            var app = await _appRepository.QueryApplicationAsync(new ApplicationQry(applicationId), ct);
            if (app.PaidOn != null)
                throw new ApiException(HttpStatusCode.BadRequest, "application has already been paid.");
            if (app.NumberOfAttempts > command.MaxFailedTimes && !isFromSecurePaymentLink)
                throw new ApiException(HttpStatusCode.BadRequest, $"Payment can only be tried no more than {command.MaxFailedTimes} times.");

            //get config from cache or Dynamics
            SpdPaymentConfig spdPaymentConfig = await GetSpdPaymentInfoAsync(app, ct);
            Guid transNumber = Guid.NewGuid();

            //generate the link string 
            //payment utility
            var linkResult = (CreateDirectPaymentLinkResult)await _paymentService.HandleCommand(
                new CreateDirectPaymentLinkCommand
                {
                    RevenueAccount = spdPaymentConfig.PaybcRevenueAccount,
                    TransNumber = transNumber.ToString(),
                    PbcRefNumber = spdPaymentConfig.PbcRefNumber,
                    Amount = spdPaymentConfig.ServiceCost,
                    Description = command.PaymentLinkCreateRequest.Description,
                    PaymentMethod = Spd.Utilities.Payment.PaymentMethodEnum.CC,
                    RedirectUrl = command.RedirectUrl,
                    Ref2 = paymentId.ToString() + "*" + applicationId.ToString(), //paymentId+"*"+applicationId to ref2 //ref1 is recalled by paybc for their internal use.
                    Ref3 = isFromSecurePaymentLink.ToString()
                });

            return new PaymentLinkResponse(linkResult.PaymentLinkUrl);
        }

        public async Task<Guid> Handle(PaymenCreateCommand command, CancellationToken ct)
        {
            _logger.LogInformation("PaymentManager get PaymenCreateCommand");
            //validate hashcode
            PaymentValidationResult validated = (PaymentValidationResult)await _paymentService.HandleCommand(new ValidatePaymentResultStrCommand() { QueryStr = command.QueryStr });
            if (!validated.ValidationPassed)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "payment result from paybc is not validated.");
            }

            var createCmd = _mapper.Map<CreatePaymentCmd>(command.PaybcPaymentResult);
            await _paymentRepository.ManageAsync(createCmd, ct);
            var updateCmd = _mapper.Map<UpdatePaymentCmd>(command.PaybcPaymentResult);
            updateCmd.PaymentStatus = command.PaybcPaymentResult.Success ? PaymentStatusEnum.Successful : PaymentStatusEnum.Failure;
            return await _paymentRepository.ManageAsync(updateCmd, ct);
        }

        public async Task<PaymentRefundResponse> Handle(PaymentRefundCommand command, CancellationToken ct)
        {
            _logger.LogInformation("PaymentManager get PaymentRefundCommand");
            var paymentList = await _paymentRepository.QueryAsync(new PaymentQry(null, command.PaymentId), ct);
            if (!paymentList.Items.Any())
                throw new ApiException(HttpStatusCode.BadRequest, "cannot find the payment");
            if (!paymentList.Items.First().PaidSuccess || paymentList.Items.First().Refunded == true)
                throw new ApiException(HttpStatusCode.BadRequest, "cannot do refund for non-successful or refunded payment.");

            //ask paybc to do direct refund
            var app = await _appRepository.QueryApplicationAsync(new ApplicationQry(paymentList.Items.First().ApplicationId), ct);
            SpdPaymentConfig spdPaymentConfig = await GetSpdPaymentInfoAsync(app, ct);
            var cmd = _mapper.Map<RefundPaymentCmd>(paymentList.Items.First());
            cmd.PbcRefNumber = spdPaymentConfig.PbcRefNumber;
            var result = (RefundPaymentResult)await _paymentService.HandleCommand(cmd);

            UpdatePaymentCmd updatePaymentCmd = new UpdatePaymentCmd()
            {
                PaymentId = command.PaymentId,
                Success = result.Approved,
                RefundId = result.RefundId,
                RefundTxnDateTime = result.Approved ? result.RefundTxnDateTime : null,
                RefundErrorMsg = result.Approved ? null : result.Message,
                PaymentStatus = result.Approved ? PaymentStatusEnum.Refunded : PaymentStatusEnum.Failure
            };
            await _paymentRepository.ManageAsync(updatePaymentCmd, ct);

            var resp = _mapper.Map<PaymentRefundResponse>(result);
            resp.PaymentId = command.PaymentId;
            return resp;
        }

        public async Task<PaymentResponse> Handle(PaymentQuery query, CancellationToken ct)
        {
            var respList = await _paymentRepository.QueryAsync(new PaymentQry(null, query.PaymentId), ct);
            return _mapper.Map<PaymentResponse>(respList.Items.First());
        }

        public async Task<int> Handle(PaymentFailedAttemptCountQuery query, CancellationToken ct)
        {
            var respList = await _paymentRepository.QueryAsync(new PaymentQry(query.ApplicationId), ct);
            return respList.Items.Count(i => !i.PaidSuccess && i.PaymentType == PaymentTypeEnum.PayBC_OnSubmission);
        }

        public async Task<FileResponse> Handle(PaymentReceiptQuery query, CancellationToken ct)
        {
            //receipt generation is async operation to payment, so, needs wait for a while to get the receipt. Here we add
            //retry 8 times, everytime wait for 5 seconds
            DocumentQry qry = new DocumentQry(ApplicationId: query.ApplicationId, FileType: DocumentTypeEnum.PaymentReceipt);
            DocumentListResp docList = null;
            RetryPolicy<Task<bool>> retryIfNoFound = Policy.HandleResult<Task<bool>>(b => !b.Result)
                .WaitAndRetry(8, waitSec => TimeSpan.FromSeconds(5));

            await retryIfNoFound.Execute(async () =>
            {
                docList = await _documentRepository.QueryAsync(qry, ct);
                if (docList == null || !docList.Items.Any())
                    return false;
                return true;
            });

            if (docList == null || !docList.Items.Any()) return new FileResponse();

            var docUrl = docList.Items.OrderByDescending(f => f.UploadedDateTime).FirstOrDefault();
            FileQueryResult fileResult = (FileQueryResult)await _fileStorageService.HandleQuery(
                new FileQuery { Key = docUrl.DocumentUrlId.ToString(), Folder = $"spd_application/{docUrl.ApplicationId}" },
                ct);
            return new FileResponse
            {
                Content = fileResult.File.Content,
                ContentType = fileResult.File.ContentType,
                FileName = fileResult.File.FileName
            };
        }

        public async Task<FileResponse> Handle(ManualPaymentFormQuery query, CancellationToken ct)
        {
            var docResp = await _documentTemplateRepository.ManageAsync(
                new GenerateDocBasedOnTemplateCmd()
                {
                    RegardingObjectId = query.ApplicationId,
                    DocTemplateType = DocTemplateTypeEnum.ManualPaymentForm
                }, ct);
            return new FileResponse
            {
                Content = docResp.Content,
                ContentType = docResp.ContentType,
                FileName = docResp.FileName
            };
        }

        public async Task<CreateInvoicesInCasResponse> Handle(CreateInvoicesInCasCommand command, CancellationToken ct)
        {
            _logger.LogInformation("PaymentManager get CreateInvoicesInCasCommand");
            var invoiceList = await _invoiceRepository.QueryAsync(new InvoiceQry() { InvoiceStatus = InvoiceStatusEnum.Pending }, ct);
            foreach (var invoice in invoiceList.Items)
            {
                var createInvoice = _mapper.Map<CreateInvoiceCmd>(invoice);
                var result = (InvoiceResult)await _paymentService.HandleCommand(createInvoice);
                UpdateInvoiceCmd update = new UpdateInvoiceCmd()
                {
                    InvoiceId = invoice.Id,
                    CasResponse = result.Message
                };
                if (result.IsSuccess)
                {
                    update.InvoiceNumber = result.InvoiceNumber;
                    update.InvoiceStatus = InvoiceStatusEnum.Sent;
                    update.CasResponse = CutOffResponse(update.CasResponse); // dynamics team do not want full json, as it is too big and no use.
                    await _invoiceRepository.ManageAsync(update, ct);
                }
                else
                {
                    update.InvoiceStatus = InvoiceStatusEnum.Failed;
                    await _invoiceRepository.ManageAsync(update, ct);
                }
            }
            return new CreateInvoicesInCasResponse(true);
        }

        public async Task<CreateOneInvoiceInCasResponse> Handle(CreateOneInvoiceInCasCommand command, CancellationToken ct)
        {
            _logger.LogInformation("PaymentManager get CreateOneInvoiceInCasCommand");
            var invoiceList = await _invoiceRepository.QueryAsync(new InvoiceQry() { InvoiceId = command.InvoiceId, InvoiceStatus = InvoiceStatusEnum.Pending }, ct);
            var invoice = invoiceList.Items.FirstOrDefault();
            if (invoice == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "invoice is not found or not in pending state.");
            }

            var createInvoice = _mapper.Map<CreateInvoiceCmd>(invoice);
            var result = (InvoiceResult)await _paymentService.HandleCommand(createInvoice);
            UpdateInvoiceCmd update = new UpdateInvoiceCmd()
            {
                InvoiceId = invoice.Id,
                CasResponse = result.Message
            };
            if (result.IsSuccess)
            {
                update.InvoiceNumber = result.InvoiceNumber;
                update.InvoiceStatus = InvoiceStatusEnum.Sent;
                update.CasResponse = CutOffResponse(update.CasResponse); // dynamics team do not want full json, as it is too big and no use.
                await _invoiceRepository.ManageAsync(update, ct);
            }
            else
            {
                update.InvoiceStatus = InvoiceStatusEnum.Failed;
                await _invoiceRepository.ManageAsync(update, ct);
            }
            return new CreateOneInvoiceInCasResponse(true);
        }

        public async Task<UpdateInvoicesFromCasResponse> Handle(UpdateInvoicesFromCasCommand command, CancellationToken ct)
        {
            _logger.LogInformation("PaymentManager get UpdateInvoicesFromCasCommand");

            var invoiceList = await _invoiceRepository.QueryAsync(new InvoiceQry() { InvoiceStatus = InvoiceStatusEnum.Sent }, ct);
            int successCount = 0;
            foreach (var invoice in invoiceList.Items)
            {
                var queryInvoice = _mapper.Map<InvoiceStatusQuery>(invoice);
                var result = (InvoiceResult)await _paymentService.HandleQuery(queryInvoice);
                if (result.IsSuccess)
                {
                    if (result.AmountDue == 0)
                    {
                        UpdateInvoiceCmd update = new UpdateInvoiceCmd()
                        {
                            InvoiceId = invoice.Id,
                            InvoiceStatus = InvoiceStatusEnum.Paid,
                            InvoiceNumber = result.InvoiceNumber,
                        };
                        await _invoiceRepository.ManageAsync(update, ct);
                    }
                    successCount++;
                }
            }
            if (successCount != invoiceList.Items.Count())
                return new UpdateInvoicesFromCasResponse(false);
            return new UpdateInvoicesFromCasResponse(true);
        }

        private async Task<SpdPaymentConfig> GetSpdPaymentInfoAsync(ApplicationResult app, CancellationToken ct)
        {
            if (IApplicationRepository.ScreeningServiceTypes.Contains((ServiceTypeEnum)app.ServiceType))
            {
                //screening price and payment setting
                SpdPaymentConfig? spdPaymentConfig = await _cache.Get<SpdPaymentConfig>("spdPaymentConfig");
                if (spdPaymentConfig != null) return spdPaymentConfig;

                var configs = await _configRepository.Query(new ConfigQuery(null, IConfigRepository.PAYBC_GROUP), ct);
                var pbcRefnumberConfig = configs.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_PBCREFNUMBER_KEY);
                if (pbcRefnumberConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set pbcRefNumber correctly.");

                var PaybcRevenueAccountConfig = configs.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_REVENUEACCOUNT_KEY);
                if (PaybcRevenueAccountConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set paybc revenue account correctly.");

                var serviceCostConfig = configs.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBCS_SERVICECOST_KEY);
                if (serviceCostConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set service cost correctly.");

                spdPaymentConfig = new SpdPaymentConfig()
                {
                    PbcRefNumber = pbcRefnumberConfig.Value,
                    PaybcRevenueAccount = PaybcRevenueAccountConfig.Value,
                    ServiceCost = Decimal.Round(Decimal.Parse(serviceCostConfig.Value), 2)
                };
                await _cache.Set<SpdPaymentConfig>("spdPaymentConfig", spdPaymentConfig, new TimeSpan(1, 0, 0));
                return spdPaymentConfig;
            }
            else
            {
                var licApp = await _licAppRepository.GetLicenceApplicationAsync(app.Id, ct);
                //licensing price and payment setting
                var configs = await _configRepository.Query(new ConfigQuery(null, IConfigRepository.PAYBC_GROUP), ct);

                //todo, get to know if there will be a new setting in config entity.
                var pbcRefnumberConfig = configs.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_PBCREFNUMBER_KEY);
                if (pbcRefnumberConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set pbcRefNumber correctly.");

                var PaybcRevenueAccountConfig = configs.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_REVENUEACCOUNT_KEY);
                if (PaybcRevenueAccountConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set paybc revenue account correctly.");

                LicenceFeeListResp feeList = await _licFeeRepository.QueryAsync(
                    new LicenceFeeQry
                    {
                        WorkerLicenceTypeEnum = licApp.WorkerLicenceTypeCode,
                        ApplicationTypeEnum = licApp.ApplicationTypeCode,
                        LicenceTermEnum = licApp.LicenceTermCode,
                    },
                    ct);

                decimal? price = feeList.LicenceFees.First()?.Amount;
                if(price == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, $"The price for {licApp.WorkerLicenceTypeCode} {licApp.ApplicationTypeCode} {licApp.LicenceTermCode} is not set correctly in dynamics.");
                SpdPaymentConfig spdPaymentConfig = new()
                {
                    PbcRefNumber = "10016",
                    PaybcRevenueAccount = PaybcRevenueAccountConfig.Value,
                    ServiceCost = Decimal.Round((decimal)price, 2)
                };
                return spdPaymentConfig;
            }
        }

        private record SpdPaymentConfig
        {
            public string PbcRefNumber { get; set; }
            public string PaybcRevenueAccount { get; set; }
            public decimal ServiceCost { get; set; }
        }

        private string CutOffResponse(string response)
        {
            try
            {
                var result = JsonConvert.DeserializeObject<CasInvoiceCreateRespCompact>(response);
                return JsonConvert.SerializeObject(result);
            }
            catch
            {
                return response;
            }
        }


    }

    internal class CasInvoiceCreateRespCompact
    {
        public string invoice_number { get; set; }
        public string pbc_ref_number { get; set; }
        public string party_number { get; set; }
        public string party_name { get; set; }
        public string account_name { get; set; }
        public string account_number { get; set; }
        public string customer_site_id { get; set; }
        public string site_number { get; set; }
        public string cust_trx_type { get; set; }
        public DateTimeOffset transaction_date { get; set; }
        public string batch_source { get; set; }
        public string term_name { get; set; }
        public DateTimeOffset term_due_date { get; set; }
        public string comments { get; set; }
        public object late_charges_flag { get; set; }
        public double total { get; set; }
        public double amount_due { get; set; }
        public object amount_adjusted { get; set; }
        public object amount_adjusted_pending { get; set; }
        public string status { get; set; }
        public string provider { get; set; }
    }
}