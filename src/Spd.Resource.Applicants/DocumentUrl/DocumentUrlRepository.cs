using AutoMapper;
using Spd.Utilities.Dynamics;

namespace Spd.Resource.Applicants.DocumentUrl;
internal class DocumentUrlRepository : IDocumentUrlRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public DocumentUrlRepository(IDynamicsContextFactory ctx, IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }
    public async Task<DocumentUrlListResp> QueryAsync(DocumentUrlQry qry, CancellationToken ct)
    {
        var documents = _context.bcgov_documenturls.Where(d => d.statecode != DynamicsConstants.StateCode_Inactive);
        if (qry.ApplicantId != null) 
            documents = documents.Where(d => d._spd_submittedbyid_value == qry.ApplicantId);

        if (qry.ApplicationId != null)
            documents = documents.Where(d => d._spd_applicationid_value == qry.ApplicationId);

        if (qry.ClearanceId != null)
            documents = documents.Where(d => d._spd_clearanceid_value == qry.ClearanceId);

        if (qry.ReportId != null)
            documents = documents.Where(d => d._spd_pdfreportid_value == qry.ReportId);

        if (qry.FileType != null)
        {
            DynamicsContextLookupHelpers.BcGovTagDictionary.TryGetValue(qry.FileType.ToString(), out Guid tagId);
            documents = documents.Where(d => d._bcgov_tag1id_value == tagId || d._bcgov_tag2id_value == tagId || d._bcgov_tag3id_value == tagId);
        }

        var result = await documents.GetAllPagesAsync(ct);
        return new DocumentUrlListResp
        {
            Items = _mapper.Map<IEnumerable<DocumentUrlResp>>(result)
        };
    }
}


