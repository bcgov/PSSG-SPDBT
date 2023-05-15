using Microsoft.Dynamics.CRM;
using Microsoft.OData.Client;
using Spd.Utilities.Dynamics;

namespace Spd.Engine.Validation
{
    internal class DuplicateCheckEngine : IDuplicateCheckEngine
    {
        private readonly DynamicsContext _context;
        public DuplicateCheckEngine(IDynamicsContextFactory context)
        {
            _context = context.CreateReadOnly();
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
            //do batch query
            IList<DataServiceRequest> requests = new List<DataServiceRequest>();
            foreach (var check in bulkCheckRequest.BulkDuplicateChecks)
            {
                requests.Add(GetAppDuplicateCheckQuery(check));
            }
            DataServiceResponse batchResponse = _context.ExecuteBatch(requests.ToArray());

            return null;
        }

        private DataServiceQuery<spd_application> GetAppDuplicateCheckQuery(AppDuplicateCheck check)
        {
            DateTimeOffset completedAppTimeCutoff = DateTimeOffset.UtcNow.AddMonths(-4);
            return (DataServiceQuery<spd_application>)_context.spd_applications
                    .Where(o =>
                    o.spd_OrganizationId.accountid == check.OrgId &&
                    o.spd_firstname == check.GivenName &&
                    o.spd_lastname == check.SurName &&
                    o.spd_dateofbirth == new Microsoft.OData.Edm.Date(check.DateOfBirth.Year, check.DateOfBirth.Month, check.DateOfBirth.Day) &&
                    (o.statecode != DynamicsConstants.StateCode_Inactive ||
                    ((o.spd_casestatus == "Completed" || o.spd_casestatus == "Cancelled") && o.modifiedon > completedAppTimeCutoff)));
        }
    }
}