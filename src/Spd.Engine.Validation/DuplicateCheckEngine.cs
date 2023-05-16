using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;

namespace Spd.Engine.Validation
{
    internal class DuplicateCheckEngine : IDuplicateCheckEngine
    {
        private readonly DynamicsContext _context;
        private readonly IMapper _mapper;
        public DuplicateCheckEngine(IDynamicsContextFactory context, IMapper mapper)
        {
            _context = context.CreateReadOnly();
            _mapper = mapper;
        }
        public async Task<DuplicateCheckResponse> DuplicateCheckAsync(DuplicateCheckRequest qry, CancellationToken ct)
        {
            return qry switch
            {
                BulkUploadAppDuplicateCheckRequest q => await BulkUploadAppDuplicateCheckAsync(q, ct),
                _ => throw new NotSupportedException($"{qry.GetType().Name} is not supported")
            };
        }

        public async Task<BulkUploadAppDuplicateCheckResponse> BulkUploadAppDuplicateCheckAsync(BulkUploadAppDuplicateCheckRequest bulkCheckRequest, CancellationToken ct)
        {
            List<AppBulkDuplicateCheckResult> results = new List<AppBulkDuplicateCheckResult>();
            IList<DataServiceRequest> queriesInApp = new List<DataServiceRequest>();
            IList<DataServiceRequest> queriesInCase = new List<DataServiceRequest>();
            foreach (var check in bulkCheckRequest.BulkDuplicateChecks)
            {
                //check duplicates in tsv
                var duplicatedInTsv = bulkCheckRequest.BulkDuplicateChecks
                    .FirstOrDefault(c => c.GivenName == check.GivenName &&
                        c.SurName == check.SurName &&
                        c.DateOfBirth == check.DateOfBirth &&
                        c.OrgId == check.OrgId &&
                        c.LineNumber != check.LineNumber);
                if (duplicatedInTsv != null)
                {
                    var result = _mapper.Map<AppBulkDuplicateCheckResult>(check);
                    result.HasPotentialDuplicate = true;
                    result.Msg = $"this is duplicate to line {duplicatedInTsv.LineNumber}";
                    results.Add(result);
                }

                //add query to list for batch query.
                queriesInApp.Add(GetAppDuplicateCheckInAppQuery(check));
                queriesInCase.Add(GetAppDuplicateCheckInCaseQuery(check));
            }

            DataServiceResponse checkAppResponse = await _context.ExecuteBatchAsync(queriesInApp.ToArray());

            DataServiceResponse checkCaseResponse = _context.ExecuteBatch(queriesInCase.ToArray());
            return new BulkUploadAppDuplicateCheckResponse(results);
        }

        private DataServiceQuery<spd_application> GetAppDuplicateCheckInAppQuery(AppDuplicateCheck check)
        {
            return (DataServiceQuery<spd_application>)_context.spd_applications.Where(a =>
                    a.spd_OrganizationId.accountid == check.OrgId &&
                    a.spd_firstname == check.GivenName &&
                    a.spd_lastname == check.SurName &&
                    a.spd_dateofbirth == new Microsoft.OData.Edm.Date(check.DateOfBirth.Year, check.DateOfBirth.Month, check.DateOfBirth.Day) &&
                    a.statecode != DynamicsConstants.StateCode_Inactive);
        }

        //private DataServiceQuery<incident> GetAppDuplicateCheckInCaseQuery(AppDuplicateCheck check)
        //{
        //    DateTimeOffset completedAppTimeCutoff = DateTimeOffset.UtcNow.AddDays(-28);
        //    return (DataServiceQuery<incident>)_context.incidents
        //        .Expand(i => i.spd_ApplicationId)
        //        .Where(o =>
        //            o.spd_OrganizationId.accountid == check.OrgId &&
        //            o.spd_ApplicationId.spd_firstname == check.GivenName &&
        //            o.spd_ApplicationId.spd_lastname == check.SurName &&
        //            o.spd_ApplicationId.spd_dateofbirth == new Microsoft.OData.Edm.Date(check.DateOfBirth.Year, check.DateOfBirth.Month, check.DateOfBirth.Day) &&
        //            (o.statecode == DynamicsConstants.StatusCode_Active || ((o.statuscode == (int)CaseStatusCode.Cancelled || o.statuscode == (int)CaseStatusCode.Completed) && o.modifiedon > completedAppTimeCutoff)));
        //}

        private DataServiceQuery<incident> GetAppDuplicateCheckInCaseQuery(AppDuplicateCheck check)
        {
            DateTimeOffset completedAppTimeCutoff = DateTimeOffset.UtcNow.AddDays(-28);
            var incidents = (DataServiceQuery<incident>)_context.incidents
            .Expand(i => i.spd_ApplicationId);
            //.Where(o =>
            //    o.spd_OrganizationId.accountid == check.OrgId &&
            //    (o.statecode == DynamicsConstants.StatusCode_Active || ((o.statuscode == (int)CaseStatusCode.Cancelled || o.statuscode == (int)CaseStatusCode.Completed) && o.modifiedon > completedAppTimeCutoff)));
            //incidents = incidents.AddQueryOption("$filter", $"spd_ApplicationId/spd_firstname eq '{check.GivenName}'");
            incidents = incidents.AddQueryOption("$filter", $"contains(spd_ApplicationId/spd_firstname,'{check.GivenName}')");
            return incidents;
        }
    }
}