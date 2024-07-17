using AutoMapper;
using MediatR;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Polly;
using Polly.Retry;
using Spd.Manager.Shared;
using Spd.Resource.Repository;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Config;
using Spd.Resource.Repository.Document;
using Spd.Resource.Repository.DocumentTemplate;
using Spd.Resource.Repository.Invoice;
using Spd.Resource.Repository.LicenceFee;
using Spd.Resource.Repository.Payment;
using Spd.Resource.Repository.PersonLicApplication;
using Spd.Resource.Repository.ServiceTypes;
using Spd.Utilities.Cache;
using Spd.Utilities.FileStorage;
using Spd.Utilities.Payment;
using Spd.Utilities.Shared;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Manager.Payment
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
        private readonly IMainFileStorageService _fileStorageService;
        private readonly IInvoiceRepository _invoiceRepository;
        private readonly ILicenceFeeRepository _licFeeRepository;
        private readonly IPersonLicApplicationRepository _personLicAppRepository;
        private readonly IServiceTypeRepository _serviceTypeRepository;
        private readonly ILogger<IPaymentManager> _logger;
        private readonly IConfiguration _configuration;
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
            IMainFileStorageService fileStorageService,
            IInvoiceRepository invoiceRepository,
            ILicenceFeeRepository licFeeRepository,
            IPersonLicApplicationRepository personLicAppRepository,
            IServiceTypeRepository serviceTypeRepository,
            ILogger<IPaymentManager> logger,
            IConfiguration configuration)
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
            _personLicAppRepository = personLicAppRepository;
            _serviceTypeRepository = serviceTypeRepository;
            _logger = logger;
            _configuration = configuration;
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

            var encryptedApplicationId = WebUtility.UrlEncode(_dataProtector.Protect(command.ApplicationId.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.PrePaymentLinkValidDays)));

            var paymentId = Guid.NewGuid();
            var encryptedPaymentId = WebUtility.UrlEncode(_dataProtector.Protect(paymentId.ToString(), DateTimeOffset.UtcNow.AddDays(SpdConstants.PrePaymentLinkValidDays)));
            if (IApplicationRepository.ScreeningServiceTypes.Contains((ServiceTypeEnum)app.ServiceType))
                //if it is screening application
                return new PrePaymentLinkResponse($"{command.ScreeningAppPaymentUrl}?encodedAppId={encryptedApplicationId}&encodedPaymentId={encryptedPaymentId}");
            else
                return new PrePaymentLinkResponse($"{command.LicensingAppPaymentUrl}?encodedAppId={encryptedApplicationId}&encodedPaymentId={encryptedPaymentId}");
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

            UpdatePaymentCmd updatePaymentCmd = new()
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
            DocumentQry qry = new(ApplicationId: query.ApplicationId, FileType: DocumentTypeEnum.PaymentReceipt);
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
                await CreateOneInvoice(invoice, ct);
            }
            return new CreateInvoicesInCasResponse(true);
        }

        public async Task<CreateOneInvoiceInCasResponse> Handle(CreateOneInvoiceInCasCommand command, CancellationToken ct)
        {
            _logger.LogInformation("PaymentManager get CreateOneInvoiceInCasCommand");
            //var invoiceList = await _invoiceRepository.QueryAsync(new InvoiceQry() { InvoiceId = command.InvoiceId, InvoiceStatus = InvoiceStatusEnum.Pending }, ct);
            var invoiceList = await _invoiceRepository.QueryAsync(new InvoiceQry() { InvoiceId = command.InvoiceId }, ct);
            var invoice = invoiceList.Items.FirstOrDefault();
            if (invoice == null)
            {
                throw new ApiException(HttpStatusCode.BadRequest, "invoice is not found or not in pending state.");
            }
            await CreateOneInvoice(invoice, ct);
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
                        UpdateInvoiceCmd update = new()
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
            ConfigResult? configResult = await _cache.Get<ConfigResult>("spdPayBCConfigs");
            if (configResult == null)
            {
                configResult = await _configRepository.Query(new ConfigQuery(null, IConfigRepository.PAYBC_GROUP), ct);
                await _cache.Set<ConfigResult>("spdPayBCConfigs", configResult, new TimeSpan(1, 0, 0));
            }
            if (IApplicationRepository.ScreeningServiceTypes.Contains((ServiceTypeEnum)app.ServiceType))
            {
                //screening price and payment setting
                var pbcRefnumberConfig = configResult.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_PBCREFNUMBER_KEY);
                if (pbcRefnumberConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set pbcRefNumber correctly.");

                var PaybcRevenueAccountConfig = configResult.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_REVENUEACCOUNT_KEY);
                if (PaybcRevenueAccountConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set paybc revenue account correctly.");

                var serviceTypeListResp = await _serviceTypeRepository.QueryAsync(new ServiceTypeQry(null, app.ServiceType), ct);
                if (serviceTypeListResp == null || !serviceTypeListResp.Items.Any())
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set service type correctly.");

                SpdPaymentConfig spdPaymentConfig = new()
                {
                    PbcRefNumber = pbcRefnumberConfig.Value,
                    PaybcRevenueAccount = PaybcRevenueAccountConfig.Value,
                    ServiceCost = Decimal.Round(serviceTypeListResp.Items.First().ScreeningCost ?? 0, 2)
                };
                return spdPaymentConfig;
            }
            else
            {
                //licensing price and payment setting
                var pbcRefnumberLicConfig = configResult.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_PBCREFNUMBER_LICENSING_KEY);
                if (pbcRefnumberLicConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set pbcRefNumberLicensing correctly.");

                var PaybcRevenueAccountLicConfig = configResult.ConfigItems.FirstOrDefault(c => c.Key == IConfigRepository.PAYBC_REVENUEACCOUNT_LICENSING_KEY);
                if (PaybcRevenueAccountLicConfig == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, "Dynamics did not set paybc revenue account licensing correctly.");

                var licApp = await _personLicAppRepository.GetLicenceApplicationAsync(app.Id, ct);
                LicenceFeeListResp feeList = await _licFeeRepository.QueryAsync(
                    new LicenceFeeQry
                    {
                        WorkerLicenceTypeEnum = licApp.WorkerLicenceTypeCode,
                        ApplicationTypeEnum = licApp.ApplicationTypeCode,
                        LicenceTermEnum = licApp.LicenceTermCode,
                        BizTypeEnum = licApp.BizTypeCode ?? BizTypeEnum.None,
                        HasValidSwl90DayLicence = licApp.OriginalLicenceTermCode == LicenceTermEnum.NinetyDays &&
                            licApp.WorkerLicenceTypeCode == WorkerLicenceTypeEnum.SecurityWorkerLicence &&
                            licApp.ApplicationTypeCode == ApplicationTypeEnum.Renewal
                    },
                    ct);

                decimal? price = feeList.LicenceFees.First()?.Amount;
                if (price == null)
                    throw new ApiException(HttpStatusCode.InternalServerError, $"The price for {licApp.WorkerLicenceTypeCode} {licApp.ApplicationTypeCode} {licApp.LicenceTermCode} is not set correctly in dynamics.");
                SpdPaymentConfig spdPaymentConfig = new()
                {
                    PbcRefNumber = pbcRefnumberLicConfig.Value,
                    PaybcRevenueAccount = PaybcRevenueAccountLicConfig.Value,
                    ServiceCost = Decimal.Round((decimal)price, 2)
                };
                return spdPaymentConfig;
            }
        }

        private async Task CreateOneInvoice(InvoiceResp invoice, CancellationToken ct)
        {
            var createInvoice = _mapper.Map<CreateInvoiceCmd>(invoice);
            createInvoice = UpdateCmd(createInvoice);

            var result = (InvoiceResult)await _paymentService.HandleCommand(createInvoice);
            UpdateInvoiceCmd update = new()
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

        private CreateInvoiceCmd UpdateCmd(CreateInvoiceCmd cmd)
        {
            cmd.BatchSource = _configuration.GetValue<string>("PayBC:ARInvoice:BatchSource") ?? "SECURITY PROGRAMS";
            cmd.CustTrxType = _configuration.GetValue<string>("PayBC:ARInvoice:CustTransactionType") ?? "Security Screening";
            foreach (InvoiceLine line in cmd.Lines)
            {
                line.MemoLineName = _configuration.GetValue<string>("PayBC:ARInvoice:MemoLineName") ?? "Security Screening";
                line.Description = _configuration.GetValue<string>("PayBC:ARInvoice:Description") ?? string.Empty;
            }
            return cmd;
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