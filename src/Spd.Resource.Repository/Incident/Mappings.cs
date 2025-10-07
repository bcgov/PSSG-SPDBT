using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using System.Text.RegularExpressions;

namespace Spd.Resource.Repository.Incident
{
    internal class Mappings : Profile
    {
        public Mappings()
        {
            _ = CreateMap<incident, IncidentResp>()
            .ForMember(d => d.ApplicationId, opt => opt.MapFrom(s => s._spd_applicationid_value))
            .ForMember(d => d.IncidentId, opt => opt.MapFrom(s => s.incidentid))
            .ForMember(d => d.OrgId, opt => opt.MapFrom(s => s._spd_organizationid_value))
            .ForMember(d => d.Conditions, opt => opt.MapFrom(s => s.spd_incident_spd_licencecondition))
            .ForMember(d => d.Title, opt => opt.MapFrom(s => s.title))
            .ForMember(d => d.ApproverName, opt => opt.MapFrom(s => GetApproverName(s.spd_DSGApprover.spd_firstname, s.spd_DSGApprover.spd_surname)))
            .ForMember(d => d.ApproverTitle, opt => opt.MapFrom(s => s.spd_DSGApprover.spd_title != null ? GetApproverTitleType(s.spd_DSGApprover.spd_title) : null));

            _ = CreateMap<spd_licencecondition, Condition>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.spd_licenceconditionid))
            .ForMember(d => d.Name, opt => opt.MapFrom(s => s.spd_conditionname));
        }

        private static string GetApproverName(string firstName, string lastName)
        {
            string fn = firstName == null ? string.Empty : firstName.Trim();
            string ln = lastName == null ? string.Empty : lastName.Trim();
            return $"{fn} {ln}".Trim();
        }

        private static string? GetApproverTitleType(int? code)
        {
            if (code == null) return null;
            var approverTitleName = Enum.GetName(typeof(ApproverTitleTypeOptionSet), code);
            return ConvertToCamelCaseWithSpaces(approverTitleName);
        }

        private static string ConvertToCamelCaseWithSpaces(string input)
        {
            if (input == null) return "";
            var words = Regex.Matches(input, @"[A-Z][a-z]*", RegexOptions.None, TimeSpan.FromSeconds(1));
            return string.Join(" ", words);
        }
    }
}
