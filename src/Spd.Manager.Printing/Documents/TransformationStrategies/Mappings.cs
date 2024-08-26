using AutoMapper;
using Spd.Resource.Repository.Application;
using Spd.Resource.Repository.Contact;
using Spd.Resource.Repository.Licence;
using Spd.Resource.Repository.Org;
using Spd.Resource.Repository.PersonLicApplication;

namespace Spd.Manager.Printing.Documents.TransformationStrategies
{
    public class Mappings : Profile
    {
        public Mappings()
        {
            CreateMap<ApplicationResult, FingerprintLetter>()
                .ForMember(d => d.Date, opt => opt.MapFrom(s => DateTime.Now.ToString("yyyy-MM-dd")))
                .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.ApplicationNumber))
                .ForMember(d => d.ServiceType, opt => opt.MapFrom(s => s.ServiceType.ToString()));

            CreateMap<ContactResp, Applicant>()
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.FullName))
                .ForMember(d => d.Sex, opt => opt.MapFrom(s => s.Gender))
                .ForMember(d => d.DateoOfBirth, opt => opt.MapFrom(s => s.BirthDate.ToString("yyyy-MM-dd")))
                .ForMember(d => d.PlaceOfBirth, opt => opt.MapFrom(s => s.BirthPlace))
                .ForMember(d => d.MailingAddress1, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.AddressLine1))
                .ForMember(d => d.MailingAddress2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.AddressLine2))
                .ForMember(d => d.City, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.City))
                .ForMember(d => d.ProvinceState, opt => opt.MapFrom(s => s.MailingAddress == null ? null : GetProvinceStateAbbr(s.MailingAddress.Province)))
                .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.PostalCode))
                .ForMember(d => d.Country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : s.MailingAddress.Country));

            CreateMap<OrgResult, Organization>()
                .ForMember(d => d.Name, opt => opt.MapFrom(s => s.OrganizationName))
                .ForMember(d => d.MailingAddress1, opt => opt.MapFrom(s => s.AddressLine1))
                .ForMember(d => d.MailingAddress2, opt => opt.MapFrom(s => s.AddressLine2))
                .ForMember(d => d.City, opt => opt.MapFrom(s => s.AddressCity))
                .ForMember(d => d.ProvinceState, opt => opt.MapFrom(s => s.AddressProvince))
                .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.AddressPostalCode))
                .ForMember(d => d.Country, opt => opt.MapFrom(s => s.AddressCountry));

            CreateMap<LicenceResp, LicencePreviewJson>()
                .ForMember(d => d.ApplicantName, opt => opt.MapFrom(s => $"{s.NameOnCard}"))
                .ForMember(d => d.LicenceNumber, opt => opt.MapFrom(s => s.LicenceNumber))
                .ForMember(d => d.LicenceType, opt => opt.MapFrom(s => s.WorkerLicenceTypeCode))
                .ForMember(d => d.IssuedDate, opt => opt.MapFrom(s => DateTime.Now.ToString("yyyy-MM-dd")))
                .ForMember(d => d.ExpiryDate, opt => opt.MapFrom(s => s.ExpiryDate.ToString("yyyy-MM-dd")))
                .ForMember(d => d.LicenceCategories, opt => opt.MapFrom(s => s.CategoryCodes));

            CreateMap<LicenceApplicationResp, LicencePreviewJson>()
                .ForMember(d => d.ApplicantName, opt => opt.Ignore())
                .ForMember(d => d.LicenceNumber, opt => opt.Ignore())
                .ForMember(d => d.LicenceType, opt => opt.Ignore())
                .ForMember(d => d.IssuedDate, opt => opt.Ignore())
                .ForMember(d => d.ExpiryDate, opt => opt.Ignore())
                .ForMember(d => d.Photo, opt => opt.Ignore())
                .ForMember(d => d.Conditions, opt => opt.Ignore())
                .ForMember(d => d.LicenceCategories, opt => opt.Ignore())
                .ForMember(d => d.MailingAddress1, opt => opt.MapFrom(s => s.MailingAddressData == null ? null : s.MailingAddressData.AddressLine1))
                .ForMember(d => d.MailingAddress2, opt => opt.MapFrom(s => s.MailingAddressData == null ? null : s.MailingAddressData.AddressLine2))
                .ForMember(d => d.City, opt => opt.MapFrom(s => s.MailingAddressData == null ? null : s.MailingAddressData.City))
                .ForMember(d => d.ProvinceState, opt => opt.MapFrom(s => s.MailingAddressData == null ? null : s.MailingAddressData.Province))
                .ForMember(d => d.Country, opt => opt.MapFrom(s => s.MailingAddressData == null ? null : s.MailingAddressData.Country))
                .ForMember(d => d.PostalCode, opt => opt.MapFrom(s => s.MailingAddressData == null ? null : s.MailingAddressData.PostalCode));

            CreateMap<LicenceApplicationResp, SPD_CARD>()
                 .ForMember(d => d.Eyes, opt => opt.MapFrom(s => s.EyeColourCode))
                 .ForMember(d => d.Hair, opt => opt.MapFrom(s => s.HairColourCode))
                 .ForMember(d => d.Height, opt => opt.MapFrom(s => GetHeightStr(s)))
                 .ForMember(d => d.Weight, opt => opt.MapFrom(s => GetWeightStr(s)))
                 .ForMember(d => d.CardType, opt => opt.MapFrom(s => "SECURITY-WORKER-AND-ARMOUR"));
        }

        private string GetHeightStr(LicenceApplicationResp resp)
        {
            return resp.HeightUnitCode switch
            {
                HeightUnitEnum.Centimeters => $"{resp.Height}cm",
                HeightUnitEnum.Inches => $"{Convert.ToInt32(resp.Height * 2.54)}cm"
            };
        }

        private string GetWeightStr(LicenceApplicationResp resp)
        {
            return resp.WeightUnitCode switch
            {
                WeightUnitEnum.Kilograms => $"{resp.Weight}kg",
                WeightUnitEnum.Pounds => $"{Convert.ToInt32(resp.Weight * 0.454)}kg"
            };
        }

        private string GetProvinceStateAbbr(string province)
        {
            bool existed = NorthAmericaProvinceStateDict.TryGetValue(province, out var abbr);
            if (existed) { return abbr; }
            else return province;
        }

        private static readonly Dictionary<string, string> NorthAmericaProvinceStateDict = new(StringComparer.InvariantCultureIgnoreCase)
        {
            //canada
            {"British Columbia", "BC" },
            {"Alberta", "AB"},
            {"Manitoba", "MB"},
            {"New Brunswick", "NB"},
            {"Newfoundland and Labrador", "NL"},
            {"Northwest Territories", "NT" },
            {"Nova Scotia", "NS" },
            {"Nunavut", "NU" },
            {"Ontario", "ON" },
            {"Prince Edward Island", "PE"},
            {"Québec", "QC" },
            {"Saskatchewan", "SK" },
            {"Yukon Territory", "YT" },
            //usa
            {"Alaska", "AK"},
            {"Alabama", "AL"},
            {"Arizona", "AZ"},
            {"Arkansas", "AR"},
            {"California", "CA"},
            {"Colorado", "CO"},
            {"Connecticut", "CT"},
            {"Delaware", "DE"},
            {"District of Columbia", "DC"},
            {"Florida", "FL"},
            {"Georgia", "GA"},
            {"Hawaii", "HI"},
            {"Idaho", "ID"},
            {"Illinois", "IL"},
            {"Indiana", "IN"},
            {"Iowa", "IA"},
            {"Kansas", "KS"},
            {"Kentucky", "KY"},
            {"Louisiana", "LA"},
            {"Maine", "ME"},
            {"Maryland", "MD"},
            {"Massachusetts", "MA"},
            {"Michigan", "MI"},
            {"Minnesota", "MN"},
            {"Mississippi", "MS"},
            {"Missouri", "MO"},
            {"Montana", "MT"},
            {"Nebraska", "NE"},
            {"Nevada", "NV"},
            {"New Hampshire", "NH"},
            {"New Jersey", "NJ"},
            {"New Mexico", "NM"},
            {"New York", "NY"},
            {"North Carolina", "NC"},
            {"North Dakota", "ND"},
            {"Ohio", "OH"},
            {"Oklahoma", "OK"},
            {"Oregon", "OR"},
            {"Pennsylvania", "PA"},
            {"Puerto Rico", "PR"},
            {"Rhode Island", "RI"},
            {"South Carolina", "SC"},
            {"South Dakota", "SD"},
            {"Tennessee", "TN"},
            {"Texas", "TX"},
            {"Utah", "UT"},
            {"Vermont", "VT"},
            {"Virginia", "VA"},
            {"Washington", "WA"},
            {"West Virginia", "WV"},
            {"Wisconsin", "WI"},
            {"Wyoming", "WY"},
        };
    }
}
