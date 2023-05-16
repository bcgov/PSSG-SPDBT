using AutoMapper;
using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using System.Net;

namespace Spd.Engine.Validation
{
    internal class DuplicateCheckEngine : IDuplicateCheckEngine
    {
        private readonly DynamicsContext _context;
        private readonly IMapper _mapper;
        public DuplicateCheckEngine(IDynamicsContextFactory context, IMapper mapper)
        {
            _context = context.Create();
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
            IList<DataServiceRequest> queries = new List<DataServiceRequest>();
            foreach (var check in bulkCheckRequest.BulkDuplicateChecks)
            {
                //check duplicates in tsv
                var duplicatedInTsv = bulkCheckRequest.BulkDuplicateChecks
                    .FirstOrDefault(c => c.GivenName == check.GivenName &&
                        c.SurName == check.SurName &&
                        c.DateOfBirth == check.DateOfBirth &&
                        c.OrgId == check.OrgId &&
                        c.LineNumber != check.LineNumber);

                var result = _mapper.Map<AppBulkDuplicateCheckResult>(check);
                if (duplicatedInTsv != null)
                {
                    result.HasPotentialDuplicate = true;
                    result.Msg = $"this is duplicate to line {duplicatedInTsv.LineNumber}; ";
                }
                results.Add(result);

                //add query to list for batch query.
                queries.Add(GetAppDuplicateCheckQuery(check));
            }

            DataServiceResponse checkAppResponse = await _context.ExecuteBatchAsync(queries.ToArray());
            int lineNumber = 1;
            if (checkAppResponse.BatchStatusCode == (int)HttpStatusCode.OK)
            {
                foreach (OperationResponse r in checkAppResponse)
                {
                    QueryOperationResponse<spd_application>? app = r as QueryOperationResponse<spd_application>;
                    var list = app.ToList();
                    if (list != null && list.Any() && MeetDuplicateStatusCriteria(list))
                    {
                        //if duplicate
                        var temp = results.FirstOrDefault(r => r.LineNumber == lineNumber);
                        if (temp != null)
                        {
                            temp.HasPotentialDuplicate = true;
                            temp.Msg = $"{temp.Msg}there is potential duplicates in existing application.";
                        }
                    }
                    lineNumber++;
                }
            }
            return new BulkUploadAppDuplicateCheckResponse(results);
        }

        private DataServiceQuery<spd_application> GetAppDuplicateCheckQuery(AppDuplicateCheck check)
        {
            return (DataServiceQuery<spd_application>)_context.spd_applications.Where(a =>
                    a.spd_OrganizationId.accountid == check.OrgId &&
                    a.spd_firstname == check.GivenName &&
                    a.spd_lastname == check.SurName &&
                    a.spd_dateofbirth == new Microsoft.OData.Edm.Date(check.DateOfBirth.Year, check.DateOfBirth.Month, check.DateOfBirth.Day));
        }

        private bool MeetDuplicateStatusCriteria(List<spd_application> apps)
        {
            if (apps.Any(a => a.statecode == DynamicsConstants.StateCode_Active)) return true;

            DateTimeOffset completedAppCutOffTime = DateTimeOffset.UtcNow.AddDays(-28);
            foreach (spd_application app in apps)
            {
                _context.LoadPropertyAsync(app, nameof(spd_application.spd_spd_application_incident));
                var relatedCases = app.spd_spd_application_incident.ToList();
                if (relatedCases.Any(c => c.statecode == DynamicsConstants.StateCode_Active || 
                        (c.modifiedon > completedAppCutOffTime && (c.statuscode == (int)CaseStatusCode.Cancelled || c.statuscode == (int)CaseStatusCode.Completed))))
                    return true;
            }
            return false;
        }

    }
}