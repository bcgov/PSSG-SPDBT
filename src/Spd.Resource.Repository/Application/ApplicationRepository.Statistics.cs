using Spd.Utilities.Dynamics;

namespace Spd.Resource.Repository.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
    public async Task<ApplicationStatisticsResp> QueryApplicationStatisticsAsync(ApplicationStatisticsQry query, CancellationToken ct)
    {
        if (query.OrganizationId != null)
        {
            var organization = await _context.GetOrgById((Guid)query.OrganizationId, ct);
            if (organization == null) return new ApplicationStatisticsResp();
            var organizationStatistics = await organization.spd_GetOrganizationStatistics().GetValueAsync(ct);
            var statisticsDictionary = new Dictionary<ApplicationPortalStatisticsCd, int>();
            if (organizationStatistics.AwaitingApplicant.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingApplicant, organizationStatistics.AwaitingApplicant.Value);
            if (organizationStatistics.AwaitingPayment.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingPayment, organizationStatistics.AwaitingPayment.Value);
            if (organizationStatistics.AwaitingThirdParty.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingThirdParty, organizationStatistics.AwaitingThirdParty.Value);
            if (organizationStatistics.CancelledByApplicant.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.CancelledByApplicant, organizationStatistics.CancelledByApplicant.Value);
            if (organizationStatistics.ClosedNoConsent.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClosedNoConsent, organizationStatistics.ClosedNoConsent.Value);
            if (organizationStatistics.ClosedNoResponse.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClosedNoResponse, organizationStatistics.ClosedNoResponse.Value);
            if (organizationStatistics.Incomplete.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.Incomplete, organizationStatistics.Incomplete.Value);
            if (organizationStatistics.InProgress.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.InProgress, organizationStatistics.InProgress.Value);
            if (organizationStatistics.RiskFound.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.RiskFound, organizationStatistics.RiskFound.Value);
            if (organizationStatistics.UnderAssessment.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.UnderAssessment, organizationStatistics.UnderAssessment.Value);
            if (organizationStatistics.VerifyIdentity.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.VerifyIdentity, organizationStatistics.VerifyIdentity.Value);
            if (organizationStatistics.ClearedLastSevenDays.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClearedLastSevenDays, organizationStatistics.ClearedLastSevenDays.Value);
            if (organizationStatistics.NotClearedLastSevenDays.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.NotClearedLastSevenDays, organizationStatistics.NotClearedLastSevenDays.Value);

            return new ApplicationStatisticsResp { Statistics = statisticsDictionary };
        }
        if (query.DelegateUserId != null)
        {
            var user = await _context.GetUserById((Guid)query.DelegateUserId, ct);
            if (user == null) return new ApplicationStatisticsResp();
            var pssoUserStatistics = await user.spd_GetPSSOOrganizationStatistics().GetValueAsync(ct);
            var statisticsDictionary = new Dictionary<ApplicationPortalStatisticsCd, int>();
            if (pssoUserStatistics.AwaitingApplicant.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingApplicant, pssoUserStatistics.AwaitingApplicant.Value);
            if (pssoUserStatistics.AwaitingPayment.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingPayment, pssoUserStatistics.AwaitingPayment.Value);
            if (pssoUserStatistics.AwaitingThirdParty.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingThirdParty, pssoUserStatistics.AwaitingThirdParty.Value);
            if (pssoUserStatistics.CancelledByApplicant.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.CancelledByApplicant, pssoUserStatistics.CancelledByApplicant.Value);
            if (pssoUserStatistics.ClosedNoConsent.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClosedNoConsent, pssoUserStatistics.ClosedNoConsent.Value);
            if (pssoUserStatistics.ClosedNoResponse.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClosedNoResponse, pssoUserStatistics.ClosedNoResponse.Value);
            if (pssoUserStatistics.Incomplete.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.Incomplete, pssoUserStatistics.Incomplete.Value);
            if (pssoUserStatistics.InProgress.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.InProgress, pssoUserStatistics.InProgress.Value);
            if (pssoUserStatistics.RiskFound.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.RiskFound, pssoUserStatistics.RiskFound.Value);
            if (pssoUserStatistics.UnderAssessment.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.UnderAssessment, pssoUserStatistics.UnderAssessment.Value);
            if (pssoUserStatistics.VerifyIdentity.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.VerifyIdentity, pssoUserStatistics.VerifyIdentity.Value);
            return new ApplicationStatisticsResp { Statistics = statisticsDictionary };
        }
        return null;
    }


}


