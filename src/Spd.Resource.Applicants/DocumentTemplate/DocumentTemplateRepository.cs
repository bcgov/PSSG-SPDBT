using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Exceptions;
using System.Net;

namespace Spd.Resource.Applicants.DocumentTemplate;
internal class DocumentTemplateRepository : IDocumentTemplateRepository
{
    private readonly DynamicsContext _context;
    private readonly IMapper _mapper;

    public DocumentTemplateRepository(IDynamicsContextFactory ctx,
        IMapper mapper)
    {
        _context = ctx.Create();
        _mapper = mapper;
    }

    public async Task<string> ManageAsync(DocumentTemplateCmd cmd, CancellationToken ct)
    {
        return cmd switch
        {
            GenerateDocBasedOnTemplateCmd c => await GenerateDocBasedOnTemplateAsync(c, ct),
            _ => throw new NotSupportedException($"{cmd.GetType().Name} is not supported")
        };
    }

    private async Task<string> GenerateDocBasedOnTemplateAsync(GenerateDocBasedOnTemplateCmd cmd, CancellationToken ct)
    {
        string templateName = cmd.DocTemplateType switch
        {
            DocTemplateTypeEnum.ManualPaymentForm => "Manual Payment Form",
            DocTemplateTypeEnum.MonthlyReport => "Monthly Report",
            DocTemplateTypeEnum.StatutoryDeclaration => "Statutory Declaration",
            DocTemplateTypeEnum.ClearanceLetter => "Clearance Letter",
            _ => throw new NotSupportedException()
        };
        bcgov_template? template = await _context.bcgov_templates.Where(t => t.statecode != DynamicsConstants.StateCode_Inactive)
            .Where(t => t.bcgov_name == templateName)
            .FirstOrDefaultAsync(ct);

        if (template == null)
        {
            throw new ApiException(HttpStatusCode.BadRequest, "Cannot find document template.");
        }

        bcgov_GenerateDocumentWithAEMResponse response = await template.bcgov_GenerateDocumentWithAEM(cmd.RegardingObjectId.ToString()).GetValueAsync(ct);
        return null;
    }

}


