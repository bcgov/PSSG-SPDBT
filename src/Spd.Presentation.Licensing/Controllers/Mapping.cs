using AutoMapper;
using Spd.Manager.Licence;
using Spd.Presentation.Licensing.Services;

namespace Spd.Presentation.Licensing.Controllers;

internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<UploadFileInfo, UploadFileRequest>()
           .ForMember(d => d.FileTypeCode, opt => opt.MapFrom(s => GetFileTypeCode(s.FileKey)))
        ;
    }

    private static LicenceDocumentTypeCode GetFileTypeCode(string fileKey)
    {
        //fileKey should be like "Doc.{LicenceDocumentTypeCode}", such as Doc.BcServicesCard
        string s = fileKey.Replace("Doc.", string.Empty);
        return Enum.Parse<LicenceDocumentTypeCode>(s);
    }

}

