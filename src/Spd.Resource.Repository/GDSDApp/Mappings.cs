using AutoMapper;
using Microsoft.Dynamics.CRM;
using Spd.Utilities.Dynamics;
using Spd.Utilities.Shared.Tools;

namespace Spd.Resource.Repository.GDSDApp;
internal class Mappings : Profile
{
    public Mappings()
    {
        _ = CreateMap<GDSDApp, spd_application>()
        .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.spd_licenceapplicationtype, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeOptionSet(s.ApplicationTypeCode)))
        .ForMember(d => d.spd_firstname, opt => opt.MapFrom(s => s.GivenName))
        .ForMember(d => d.spd_lastname, opt => opt.MapFrom(s => s.Surname))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => s.MiddleName))
        .ForMember(d => d.spd_dateofbirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
        .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
        .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.PhoneNumber))
        .ForMember(d => d.spd_origin, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<ApplicationOriginTypeEnum, ApplicationOriginOptionSet>(s.ApplicationOriginTypeCode)))
        .ForMember(d => d.statecode, opt => opt.MapFrom(s => DynamicsConstants.StateCode_Active))
        .ForMember(d => d.spd_nameofapplicantorlegalguardian, opt => opt.MapFrom(s => s.ApplicantOrLegalGuardianName))
        .ForMember(d => d.spd_dogstrainingaccredited, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsDogTrainedByAccreditedSchool)))
        .ForMember(d => d.spd_addressline1, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine1)))
        .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine2)))
        .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.City)))
        .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.PostalCode)))
        .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Province)))
        .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Country)))
        .ForMember(d => d.spd_submittedon, opt => opt.Ignore())
        .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
        .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<LicenceTermEnum, LicenceTermOptionSet>(s.LicenceTermCode)))
        .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDeclarationDate(s.AgreeToCompleteAndAccurate)))
        .ForMember(d => d.spd_identityconfirmed, opt => opt.MapFrom(s => SharedMappingFuncs.GetIdentityConfirmed(s.ApplicationOriginTypeCode, s.ApplicationTypeCode.Value)))
        .AfterMap((s, d, context) =>
        {
            context.Mapper.Map<DogInfo, spd_application>(s.DogInfo, d);
        })
        .ReverseMap()
        .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
        .ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeEnum>(s.spd_origin)))
        .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
        .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
        .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.spd_dateofbirth)))
        .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)))
        .ForMember(d => d.DogInfo, opt => opt.MapFrom((src, dest, destMember, context) => GetDogInfo(src, context)))
        .ForMember(d => d.IsDogTrainedByAccreditedSchool, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_dogstrainingaccredited)));

        _ = CreateMap<GDSDApp, contact>()
        .ForMember(d => d.contactid, opt => opt.Condition((src, dest, srcMember) => dest.contactid == null))
        .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName)))
        .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
        .ForMember(d => d.middlename, opt => opt.Ignore())
        .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.EmailAddress))
        .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
        .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.PhoneNumber))
        .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine1)))
        .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine2)))
        .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.City)))
        .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.PostalCode)))
        .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Province)))
        .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Country)))
        .ReverseMap()
        .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.birthdate)))
        .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)));

        _ = CreateMap<AccreditedSchoolQuestions, spd_application>()
        .ForMember(d => d.spd_dogtype, opt => opt.MapFrom(s => GetDogTypeOptionSet(s.IsGuideDog)))
        .ForMember(d => d.spd_dogsassistanceindailyliving, opt => opt.MapFrom(s => (s.IsGuideDog != null && s.IsGuideDog.Value) ? null : s.ServiceDogTasks))
        .ForMember(d => d.spd_dogspayedorneutered, opt => opt.MapFrom(s => (int)YesNoOptionSet.Yes))
        .ReverseMap()
        .ForMember(d => d.IsGuideDog, opt => opt.MapFrom(s => GetBoolFromDogType(s.spd_dogtype)))
        .ForMember(d => d.ServiceDogTasks, opt => opt.MapFrom(s => GetBoolFromDogType(s.spd_dogtype) == true ? null : s.spd_dogsassistanceindailyliving))
        .ForMember(d => d.GraduationInfo, opt => opt.MapFrom((src, dest, destMember, context) => GetGraduationInfo(src, context)));

        _ = CreateMap<NonAccreditedSchoolQuestions, spd_application>()
        .ForMember(d => d.spd_dogtype, opt => opt.MapFrom(s => (int)DogTypeOptionSet.ServiceDog))
        .ForMember(d => d.spd_dogsinoculationsuptodate, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.AreInoculationsUpToDate))) //refine
        .ForMember(d => d.spd_dogspayedorneutered, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsDogSterilized)))
        .ForMember(d => d.spd_doctorisprovidinggdsdmedicalform, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.DoctorIsProvidingNeedDogMedicalForm)))
        .ReverseMap()
        .ForMember(d => d.AreInoculationsUpToDate, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_dogsinoculationsuptodate)))
        .ForMember(d => d.TrainingInfo, opt => opt.MapFrom((src, dest, destMember, context) => GetTrainingInfol(src, context)))
        .ForMember(d => d.DoctorIsProvidingNeedDogMedicalForm, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_doctorisprovidinggdsdmedicalform)))
        ;

        _ = CreateMap<DogInfo, spd_application>()
        .ForMember(d => d.spd_dogname, opt => opt.MapFrom(s => s.DogName))
        .ForMember(d => d.spd_dogsdateofbirth, opt => opt.MapFrom(s => s.DogDateOfBirth))
        .ForMember(d => d.spd_dogbreed, opt => opt.MapFrom(s => s.DogBreed))
        .ForMember(d => d.spd_dogcolourandmarkings, opt => opt.MapFrom(s => s.DogColorAndMarkings))
        .ForMember(d => d.spd_dogsgender, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<GenderEnum, GenderOptionSet>(s.DogGender)))
        .ForMember(d => d.spd_microchipnumber, opt => opt.MapFrom(s => s.MicrochipNumber))
        .ReverseMap()
        .ForMember(d => d.DogGender, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<GenderOptionSet, GenderEnum>(s.spd_dogsgender)))
        ;

        _ = CreateMap<GraduationInfo, spd_dogtrainingschool>()
         .ForMember(d => d.spd_trainingschoolname, opt => opt.MapFrom(s => s.AccreditedSchoolName))
         .ForMember(d => d.spd_contactsurname, opt => opt.MapFrom(s => s.SchoolContactSurname))
         .ForMember(d => d.spd_contactfirstname, opt => opt.MapFrom(s => s.SchoolContactGivenName))
         .ForMember(d => d.spd_contactphone, opt => opt.MapFrom(s => s.SchoolContactPhoneNumber))
         .ForMember(d => d.spd_contactemail, opt => opt.MapFrom(s => s.SchoolContactEmailAddress))
         .ReverseMap()
         .ForMember(d => d.AccreditedSchoolId, opt => opt.MapFrom(s => s._spd_organizationid_value));

        _ = CreateMap<TrainingSchoolInfo, spd_dogtrainingschool>()
           .ForMember(d => d.spd_trainingschoolname, opt => opt.MapFrom(s => s.TrainingBizName))
           .ForMember(d => d.spd_contactfirstname, opt => opt.MapFrom(s => s.ContactGivenName))
           .ForMember(d => d.spd_contactsurname, opt => opt.MapFrom(s => s.ContactSurname))
           .ForMember(d => d.spd_contactemail, opt => opt.MapFrom(s => s.ContactEmailAddress))
           .ForMember(d => d.spd_contactphone, opt => opt.MapFrom(s => s.ContactPhoneNumber))
           .ForMember(d => d.spd_traininghours, opt => opt.MapFrom(s => s.TotalTrainingHours))
           .ForMember(d => d.spd_startdate, opt => opt.MapFrom(s => s.TrainingStartDate))
           .ForMember(d => d.spd_enddate, opt => opt.MapFrom(s => s.TrainingEndDate))
           .ForMember(d => d.spd_name, opt => opt.MapFrom(s => s.TrainingName))
           .ForMember(d => d.spd_trainingschooltype, opt => opt.MapFrom(s => (int)DogTrainingSchoolTypeOptionSet.UnAccreditedSchool))
           .ForMember(d => d.spd_trainingdetails, opt => opt.MapFrom(s => s.WhatLearned))
           .ForMember(d => d.spd_street1, opt => opt.MapFrom(s => s.TrainingBizMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainingBizMailingAddress.AddressLine1)))
            .ForMember(d => d.spd_street2, opt => opt.MapFrom(s => s.TrainingBizMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainingBizMailingAddress.AddressLine2)))
            .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.TrainingBizMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainingBizMailingAddress.City)))
            .ForMember(d => d.spd_postalzipcode, opt => opt.MapFrom(s => s.TrainingBizMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainingBizMailingAddress.PostalCode)))
            .ForMember(d => d.spd_provincestate, opt => opt.MapFrom(s => s.TrainingBizMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainingBizMailingAddress.Province)))
            .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.TrainingBizMailingAddress == null ? null : StringHelper.SanitizeEmpty(s.TrainingBizMailingAddress.Country)))
            .ReverseMap()
            .ForMember(d => d.TrainingId, opt => opt.MapFrom(s => s.spd_dogtrainingschoolid))
            .ForMember(d => d.TrainingBizMailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)))
            ;

        _ = CreateMap<OtherTraining, spd_dogtrainingschool>()
           .ForMember(d => d.spd_trainingdetails, opt => opt.MapFrom(s => s.TrainingDetail))
           .ForMember(d => d.spd_trainingschooltype, opt => opt.MapFrom(s => (int)DogTrainingSchoolTypeOptionSet.Other))
            .ForMember(d => d.spd_useapersonaldogtrainer, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.UsePersonalDogTrainer)))
            .ForMember(d => d.spd_personaldogtrainercredentials, opt => opt.MapFrom(s => s.DogTrainerCredential))
            .ForMember(d => d.spd_howmuchtimewasspenttraining, opt => opt.MapFrom(s => s.TrainingTime))
            .ForMember(d => d.spd_contactsurname, opt => opt.MapFrom(s => s.TrainerSurname))
            .ForMember(d => d.spd_contactfirstname, opt => opt.MapFrom(s => s.TrainerGivenName))
            .ForMember(d => d.spd_contactemail, opt => opt.MapFrom(s => s.TrainerEmailAddress))
            .ForMember(d => d.spd_contactphone, opt => opt.MapFrom(s => s.TrainerPhoneNumber))
            .ForMember(d => d.spd_hoursspentpracticingskills, opt => opt.MapFrom(s => s.HoursPracticingSkill))
            .ReverseMap()
            .ForMember(d => d.TrainingId, opt => opt.MapFrom(s => s.spd_dogtrainingschoolid))
            .ForMember(d => d.UsePersonalDogTrainer, opt => opt.MapFrom(s => SharedMappingFuncs.GetBool(s.spd_useapersonaldogtrainer)))
            ;

        CreateMap<SaveGDSDAppCmd, spd_application>()
         .ForMember(d => d.statuscode, opt => opt.MapFrom(s => SharedMappingFuncs.GetApplicationStatus(s.ApplicationStatusEnum)))
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => s.LicenceAppId ?? Guid.NewGuid()))
         .IncludeBase<GDSDApp, spd_application>();

        CreateMap<CreateGDSDAppCmd, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .ForMember(d => d.spd_dogsrequiredfordisabilityorimpairment, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.IsAssistanceStillRequired)))
         .IncludeBase<GDSDApp, spd_application>();

        _ = CreateMap<spd_application, GDSDAppResp>()
         .IncludeBase<spd_application, GDSDApp>()
          .ForMember(d => d.ApplicationPortalStatus, opt => opt.MapFrom(s => s.spd_portalstatus == null ? null : ((ApplicationPortalStatus)s.spd_portalstatus.Value).ToString()))
          .ForMember(d => d.CaseNumber, opt => opt.MapFrom(s => s.spd_name))
          .ForMember(d => d.LicenceAppId, opt => opt.MapFrom(s => s.spd_applicationid))
          .ForMember(d => d.AccreditedSchoolQuestions, opt => opt.MapFrom((src, dest, destMember, context) => GetAccreditedSchoolQuestions(src, context)))
          .ForMember(d => d.NonAccreditedSchoolQuestions, opt => opt.MapFrom((src, dest, destMember, context) => GetNonAccreditedSchoolQuestions(src, context)))
          ;
    }



    private static int? GetDogTypeOptionSet(bool? isGuidDog)
    {
        if (isGuidDog == null) return null;
        else
            return isGuidDog.Value ? (int)DogTypeOptionSet.GuideDog : (int)DogTypeOptionSet.ServiceDog;
    }

    private static bool? GetBoolFromDogType(int? dogType)
    {
        if (dogType == null) return null;
        else
            return dogType == (int)DogTypeOptionSet.GuideDog ? true : false;
    }

    private static DogInfo? GetDogInfo(spd_application app, ResolutionContext context)
    {
        return context.Mapper.Map<DogInfo>(app);
    }

    private static GraduationInfo? GetGraduationInfo(spd_application app, ResolutionContext context)
    {
        if (app.spd_dogstrainingaccredited != null && app.spd_dogstrainingaccredited.Value == (int)YesNoOptionSet.Yes)
        {
            if (app.spd_application_spd_dogtrainingschool_ApplicationId.Any())
            {
                return context.Mapper.Map<GraduationInfo>(app.spd_application_spd_dogtrainingschool_ApplicationId.FirstOrDefault(s => s.spd_trainingschooltype == (int)DogTrainingSchoolTypeOptionSet.AccreditedSchool));
            }
        }
        return null;
    }

    private static AccreditedSchoolQuestions? GetAccreditedSchoolQuestions(spd_application app, ResolutionContext context)
    {
        if (app.spd_dogstrainingaccredited != null && app.spd_dogstrainingaccredited.Value == (int)YesNoOptionSet.Yes)
        {
            return context.Mapper.Map<AccreditedSchoolQuestions>(app);
        }
        return null;
    }

    private static NonAccreditedSchoolQuestions? GetNonAccreditedSchoolQuestions(spd_application app, ResolutionContext context)
    {
        if (app.spd_dogstrainingaccredited != null && app.spd_dogstrainingaccredited.Value == (int)YesNoOptionSet.No)
        {
            return context.Mapper.Map<NonAccreditedSchoolQuestions>(app);
        }
        return null;
    }

    private static TrainingInfo? GetTrainingInfol(spd_application app, ResolutionContext context)
    {
        if (app.spd_dogstrainingaccredited != null && app.spd_dogstrainingaccredited.Value == (int)YesNoOptionSet.No)
        {
            TrainingInfo ti = new TrainingInfo();
            ti.SpecializedTasksWhenPerformed = app.spd_dogsassistanceindailyliving;
            if (app.spd_application_spd_dogtrainingschool_ApplicationId.Any(s => s.spd_trainingschooltype == (int)DogTrainingSchoolTypeOptionSet.UnAccreditedSchool))
            {
                ti.HasAttendedTrainingSchool = true;
                ti.SchoolTrainings = context.Mapper.Map<List<TrainingSchoolInfo>>(app.spd_application_spd_dogtrainingschool_ApplicationId.Where(d => d.spd_trainingschooltype == (int)DogTrainingSchoolTypeOptionSet.UnAccreditedSchool).ToList());
            }
            else
            {
                ti.HasAttendedTrainingSchool = false;
                ti.OtherTrainings = context.Mapper.Map<List<OtherTraining>>(app.spd_application_spd_dogtrainingschool_ApplicationId.Where(d => d.spd_trainingschooltype == (int)DogTrainingSchoolTypeOptionSet.Other).ToList());

            }
            return ti;
        }
        return null;
    }
}
