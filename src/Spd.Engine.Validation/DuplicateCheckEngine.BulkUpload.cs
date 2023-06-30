using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;
using System.Net;

namespace Spd.Engine.Validation
{
    internal partial class DuplicateCheckEngine : IDuplicateCheckEngine
    {
        public async Task<BulkUploadAppDuplicateCheckResponse> BulkUploadAppDuplicateCheckAsync(BulkUploadAppDuplicateCheckRequest bulkCheckRequest, CancellationToken ct)
        {
            List<AppBulkDuplicateCheckResult> results = new List<AppBulkDuplicateCheckResult>();
            List<DataServiceRequest> queries = new List<DataServiceRequest>();
            foreach (var check in bulkCheckRequest.BulkDuplicateChecks)
            {
                //check duplicates in tsv
                var duplicatedInTsv = bulkCheckRequest.BulkDuplicateChecks
                    .FirstOrDefault(c => c.FirstName == check.FirstName &&
                        c.LastName == check.LastName &&
                        c.DateOfBirth == check.DateOfBirth &&
                        c.OrgId == check.OrgId &&
                        c.LineNumber != check.LineNumber);

                var result = _mapper.Map<AppBulkDuplicateCheckResult>(check);
                if (duplicatedInTsv != null)
                {
                    result.HasPotentialDuplicateInTsv = true;
                    result.HasPotentialDuplicate = true;
                    result.Msg = $"this is duplicate to line {duplicatedInTsv.LineNumber}; ";
                }
                results.Add(result);

                //add query to list for batch query.
                queries.Add(GetAppDuplicateCheckQuery(check));
            }

            //check duplicates in existing apps
            int begin = 0;
            int oneBatchMaxQuery = 100; // A maximum number of '100' query operations and change sets are allowed in a batch message
            while (begin < queries.Count)
            {
                int len = queries.Count - begin;
                if (len > oneBatchMaxQuery)
                    len = oneBatchMaxQuery;
                List<DataServiceRequest> exeQueries = queries.GetRange(begin, len);

                DataServiceResponse checkAppResponse = await _context.ExecuteBatchAsync(exeQueries.ToArray());
                int lineNumber = begin + 1;
                if (checkAppResponse.BatchStatusCode == (int)HttpStatusCode.OK)
                {
                    foreach (OperationResponse r in checkAppResponse)
                    {
                        QueryOperationResponse<spd_application>? apps = r as QueryOperationResponse<spd_application>;
                        var list = apps.ToList();
                        if (list != null && list.Any() && MeetDuplicateStatusCriteria(list))
                        {
                            //if duplicate
                            var temp = results.FirstOrDefault(r => r.LineNumber == lineNumber);
                            if (temp != null)
                            {
                                temp.HasPotentialDuplicate = true;
                                temp.HasPotentialDuplicateInDb = true;
                                temp.Msg = $"{temp.Msg}there is potential duplicates in existing application.";
                            }
                        }
                        lineNumber++;
                    }
                }
                begin += len;
            }

            return new BulkUploadAppDuplicateCheckResponse(results.Where(r => r.HasPotentialDuplicate).ToList());
        }

        private DataServiceQuery<spd_application> GetAppDuplicateCheckQuery(AppDuplicateCheck check)
        {
            return (DataServiceQuery<spd_application>)_context.spd_applications.Where(a =>
                    a.spd_OrganizationId.accountid == check.OrgId &&
                    a.spd_firstname == check.FirstName &&
                    a.spd_lastname == check.LastName &&
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
                        (c.modifiedon > completedAppCutOffTime && (c.statuscode == (int)CaseStatusOptionSet.Cancelled || c.statuscode == (int)CaseStatusOptionSet.Completed))))
                    return true;
            }
            return false;
        }

    }
}