using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ServiceReference;

namespace Spd.Utilities.BCeIDWS
{
    internal partial class BCeIDService : IBCeIDService
    {
        private readonly BCeIDSettings _config;
        private readonly BCeIDServiceSoap _client;
        private readonly ILogger<BCeIDService> _logger;

        public BCeIDService(IOptions<BCeIDSettings> config, BCeIDServiceSoap client, ILogger<BCeIDService> logger)
        {
            _config = config.Value;
            _client = client;
            _logger = logger;
        }

        public async Task<BCeIDResult?> HandleQuery(BCeIDQuery qry)
        {
            return qry switch
            {
                IDIRUserDetailQuery q => await GetIDIRUserDetailsAsync(q),
                BCeIDAccountDetailQuery q => await GetBCeIDAccountDetailAsync(q),
                _ => throw new NotSupportedException($"{qry.GetType().Name} is not supported")
            };
        }

        public async Task<IDIRUserDetailResult?> GetIDIRUserDetailsAsync(IDIRUserDetailQuery qry)
        {
            try
            {
                AccountDetailResponse accountDetailResp = await _client.getAccountDetailAsync(new AccountDetailRequest()
                {
                    onlineServiceId = _config.OnlineServiceId,
                    requesterAccountTypeCode = BCeIDAccountTypeCode.Internal,
                    requesterUserGuid = qry.RequesterGuid,
                    userGuid = qry.UserGuid,
                    accountTypeCode = BCeIDAccountTypeCode.Internal,
                });

                InternalUserGroupInfoResponse groupResp = await _client.getInternalUserGroupInfoAsync(new InternalUserGroupInfoRequest()
                {
                    onlineServiceId = _config.OnlineServiceId,
                    requesterAccountTypeCode = BCeIDAccountTypeCode.Internal,
                    requesterUserGuid = qry.RequesterGuid,
                    userGuid = qry.UserGuid,
                    groupMatches = new BCeIDInternalGroupMatch[]
                    {
                    new() {
                        groupName="Portal_Service_Account"//"MY_IDIR_SECURITY_GROUP"
                    }
                    }
                });
                return new IDIRUserDetailResult
                {
                    MinistryCode = accountDetailResp.account.internalIdentity.organizationCode.value,
                    MinistryName = accountDetailResp.account.internalIdentity.company.value,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "getAccountDetailAsync or getInternalUserGroupInfoAsync failed.");
                return null;
            }
        }

        public async Task<BCeIDUserDetailResult?> GetBCeIDAccountDetailAsync(BCeIDAccountDetailQuery qry)
        {
            try
            {
                string userGuidStr = qry.UserGuid.ToString().Replace("-", string.Empty);

                AccountDetailResponse accountDetailResp = await _client.getAccountDetailAsync(new AccountDetailRequest()
                {
                    onlineServiceId = _config.OnlineServiceId,
                    requesterAccountTypeCode = BCeIDAccountTypeCode.Business,
                    requesterUserGuid = userGuidStr,
                    userGuid = userGuidStr,
                    accountTypeCode = BCeIDAccountTypeCode.Business
                });

                return new BCeIDUserDetailResult
                {
                    TradeName = accountDetailResp.account.business.doingBusinessAs.value,
                    LegalName = accountDetailResp.account.business.legalName.value,
                    MailingAddress = new Address
                    {
                        AddressLine1 = accountDetailResp.account.business.address.addressLine1.value,
                        AddressLine2 = accountDetailResp.account.business.address.addressLine2.value,
                        City = accountDetailResp.account.business.address.city.value,
                        Country = accountDetailResp.account.business.address.country.value,
                        PostalCode = accountDetailResp.account.business.address.postal.value,
                        Province = accountDetailResp.account.business.address.province.value,
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "searchBCeIDAccountAsync failed.");
                return null;
            }
        }
    }
}
