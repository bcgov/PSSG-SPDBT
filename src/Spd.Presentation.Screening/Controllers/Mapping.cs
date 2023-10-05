using AutoMapper;
using Spd.Manager.Cases.Application;
using Spd.Manager.Cases.Payment;
using Spd.Manager.Membership.Org;
using Spd.Manager.Membership.UserProfile;
using Spd.Utilities.LogonUser;
using System.Globalization;

namespace Spd.Presentation.Screening.Controllers;

internal class Mappings : Profile
{
    public Mappings()
    {
        CreateMap<BceidIdentityInfo, PortalUserIdentity>();
        CreateMap<IdirUserIdentityInfo, IdirUserIdentity>();
        CreateMap<OrgResponse, AppOrgResponse>()
           .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s.Id))
           .ForMember(d => d.OrgName, opt => opt.MapFrom(s => s.OrganizationName))
           .ForMember(d => d.OrgPhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
           .ForMember(d => d.OrgEmail, opt => opt.MapFrom(s => s.Email))
           .ForMember(d => d.OrgAddressLine1, opt => opt.MapFrom(s => s.AddressLine1))
           .ForMember(d => d.OrgAddressLine2, opt => opt.MapFrom(s => s.AddressLine2))
           .ForMember(d => d.OrgCity, opt => opt.MapFrom(s => s.AddressCity))
           .ForMember(d => d.OrgProvince, opt => opt.MapFrom(s => s.AddressProvince))
           .ForMember(d => d.OrgCountry, opt => opt.MapFrom(s => s.AddressCountry))
           .ForMember(d => d.OrgPostalCode, opt => opt.MapFrom(s => s.AddressPostalCode))
           .ForMember(d => d.WorksWith, opt => opt.MapFrom(s => s.EmployeeInteractionType))
           .ForMember(d => d.GivenName, opt => opt.Ignore())
           .ForMember(d => d.Surname, opt => opt.Ignore())
           .ForMember(d => d.EmailAddress, opt => opt.Ignore())
           .ForMember(d => d.JobTitle, opt => opt.Ignore())
           .ForMember(d => d.PayeeType, opt => opt.MapFrom(s => s.PayerPreference))
           .ForMember(d => d.ScreeningType, opt => opt.Ignore())
           .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => s.ServiceTypes.FirstOrDefault()));

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
           .ForMember(d => d.PaymentId, opt => opt.MapFrom(s => s.ref1))
           .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s.ref2))
           .ForMember(d => d.IsFromSecurePaymentLink, opt => opt.MapFrom(s => !string.IsNullOrWhiteSpace(s.ref3) && Boolean.Parse(s.ref3)));

    }
}

