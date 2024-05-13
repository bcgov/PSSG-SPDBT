using AutoMapper;
using Spd.Manager.Licence;
using Spd.Manager.Payment;
using Spd.Presentation.Licensing.Services;
using System.Globalization;

namespace Spd.Presentation.Licensing.Controllers;

internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<UploadFileInfo, UploadFileRequest>()
           .ForMember(d => d.FileTypeCode, opt => opt.MapFrom(s => GetFileTypeCode(s.FileKey)));

        CreateMap<PaybcPaymentResultViewModel, PaybcPaymentResult>()
           .ForMember(d => d.Success, opt => opt.MapFrom(s => s.trnApproved == 1))
           .ForMember(d => d.MessageText, opt => opt.MapFrom(s => s.messageText))
           .ForMember(d => d.TransOrderId, opt => opt.MapFrom(s => s.trnOrderId))
           .ForMember(d => d.TransAmount, opt => opt.MapFrom(s => Decimal.Parse(s.trnAmount)))
           .ForMember(d => d.TransDateTime, opt => opt.MapFrom(s => DateTimeOffset.ParseExact(s.trnDate, "yyyy-MM-dd", CultureInfo.InvariantCulture)))
           .ForMember(d => d.PaymentMethod, opt => opt.MapFrom(s => PaymentMethodCode.CreditCard))
           .ForMember(d => d.PaymentAuthCode, opt => opt.MapFrom(s => s.paymentAuthCode))
           .ForMember(d => d.TransNumber, opt => opt.MapFrom(s => s.pbcTxnNumber))
           .ForMember(d => d.CardType, opt => opt.MapFrom(s => s.cardType))
           .ForMember(d => d.PaymentId, opt => opt.MapFrom(s => GetPaymentId(s.ref2)))
           .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => GetAppicationId(s.ref2)))
           .ForMember(d => d.IsFromSecurePaymentLink, opt => opt.MapFrom(s => !string.IsNullOrWhiteSpace(s.ref3) && Boolean.Parse(s.ref3)));
    }

    private static LicenceDocumentTypeCode GetFileTypeCode(string fileKey)
    {
        //fileKey should be like "Doc.{LicenceDocumentTypeCode}", such as Doc.BcServicesCard
        string s = fileKey.Replace("Doc.", string.Empty);
        return Enum.Parse<LicenceDocumentTypeCode>(s);
    }

    private static Guid GetPaymentId(string ref2)
    {
        return Guid.Parse(ref2.Split("*")[0]);
    }

    private static Guid GetAppicationId(string ref2)
    {
        return Guid.Parse(ref2.Split("*")[1]);
    }
}

