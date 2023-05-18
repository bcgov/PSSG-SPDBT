using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using Spd.Utilities.FileStorage;
using Spd.Utilities.TempFileStorage;

namespace Spd.Resource.Applicants.Application;
internal partial class ApplicationRepository : IApplicationRepository
{
     public async Task<ApplicationStatisticsResp> QueryApplicationStatisticsAsync(ApplicationStatisticsQry query, CancellationToken ct)
    {
        var organization = await _context.GetOrgById(query.OrganizationId, ct);
        if (organization == null) return new ApplicationStatisticsResp();
        var organizationStatistics = await organization.spd_GetOrganizationStatistics().GetValueAsync(ct);
        var statisticsDictionary = new Dictionary<ApplicationPortalStatisticsCd, int>();
        if (organizationStatistics.AwaitingApplicant.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingApplicant, organizationStatistics.AwaitingApplicant.Value);
        if (organizationStatistics.AwaitingPayment.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingPayment, organizationStatistics.AwaitingPayment.Value);
        if (organizationStatistics.AwaitingThirdParty.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.AwaitingThirdParty, organizationStatistics.AwaitingThirdParty.Value);
        if (organizationStatistics.CancelledByApplicant.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.CancelledByApplicant, organizationStatistics.CancelledByApplicant.Value);
        if (organizationStatistics.ClosedJudicialReview.HasValue) statisticsDictionary.Add(ApplicationPortalStatisticsCd.ClosedJudicialReview, organizationStatistics.ClosedJudicialReview.Value);
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


}


