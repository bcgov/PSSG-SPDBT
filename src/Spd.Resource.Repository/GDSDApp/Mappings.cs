﻿using AutoMapper;
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
        .ForMember(d => d.spd_emailaddress1, opt => opt.MapFrom(s => s.ContactEmailAddress))
        .ForMember(d => d.spd_phonenumber, opt => opt.MapFrom(s => s.ContactPhoneNumber))
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
        .ForMember(d => d.spd_uploadeddocuments, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentOptionSets(s.UploadedDocumentEnums)))
        .ForMember(d => d.spd_portalmodifiedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
        .ForMember(d => d.spd_licenceterm, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<LicenceTermEnum, LicenceTermOptionSet>(s.LicenceTermCode)))
        .ForMember(d => d.spd_declaration, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        .ForMember(d => d.spd_consent, opt => opt.MapFrom(s => s.AgreeToCompleteAndAccurate))
        .ForMember(d => d.spd_declarationdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDeclarationDate(s.AgreeToCompleteAndAccurate)))
        .ForMember(d => d.spd_identityconfirmed, opt => opt.MapFrom(s => SharedMappingFuncs.GetIdentityConfirmed(s.ApplicationOriginTypeCode, s.ApplicationTypeCode.Value)))
        .ReverseMap()
        .ForMember(d => d.ServiceTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetServiceType(s._spd_servicetypeid_value)))
        .ForMember(d => d.ApplicationOriginTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetEnum<ApplicationOriginOptionSet, ApplicationOriginTypeEnum>(s.spd_origin)))
        .ForMember(d => d.ApplicationTypeCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceApplicationTypeEnum(s.spd_licenceapplicationtype)))
        .ForMember(d => d.LicenceTermCode, opt => opt.MapFrom(s => SharedMappingFuncs.GetLicenceTermEnum(s.spd_licenceterm)))
        .ForMember(d => d.UploadedDocumentEnums, opt => opt.MapFrom(s => SharedMappingFuncs.GetUploadedDocumentEnums(s.spd_uploadeddocuments)));
        //.ForMember(d => d.ExpiredLicenceNumber, opt => opt.MapFrom(s => s.spd_CurrentExpiredLicenceId == null ? null : s.spd_CurrentExpiredLicenceId.spd_licencenumber));

        _ = CreateMap<GDSDApp, contact>()
        .ForMember(d => d.contactid, opt => opt.MapFrom(s => Guid.NewGuid()))
        .ForMember(d => d.firstname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.GivenName)))
        .ForMember(d => d.spd_middlename1, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.MiddleName)))
        .ForMember(d => d.lastname, opt => opt.MapFrom(s => StringHelper.ToTitleCase(s.Surname)))
        .ForMember(d => d.emailaddress1, opt => opt.MapFrom(s => s.ContactEmailAddress))
        .ForMember(d => d.birthdate, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateFromDateOnly(s.DateOfBirth)))
        .ForMember(d => d.telephone1, opt => opt.MapFrom(s => s.ContactPhoneNumber))
        .ForMember(d => d.address1_line1, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine1)))
        .ForMember(d => d.address1_line2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine2)))
        .ForMember(d => d.address1_city, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.City)))
        .ForMember(d => d.address1_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.PostalCode)))
        .ForMember(d => d.address1_stateorprovince, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Province)))
        .ForMember(d => d.address1_country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Country)))
        .ReverseMap()
        .ForMember(d => d.DateOfBirth, opt => opt.MapFrom(s => SharedMappingFuncs.GetDateOnly(s.birthdate)))
        .ForMember(d => d.MailingAddress, opt => opt.MapFrom(s => SharedMappingFuncs.GetMailingAddressData(s)));

        _ = CreateMap<DogInfoRenew, spd_application>()
        .ForMember(d => d.spd_dogname, opt => opt.MapFrom(s => s.DogName))
        // .ForMember(d => d.spd_do, opt => opt.MapFrom(s => s.IsAssistanceStillRequired))
        //.ForMember(d => d.spd_do, opt => opt.MapFrom(s => s.CurrentDogCertificate))
        ;

        _ = CreateMap<DogInfoNewAccreditedSchool, spd_application>()
        .ForMember(d => d.spd_dogtype, opt => opt.MapFrom(s => s.IsGuideDog ? DogTypeOptionSet.GuideDog : DogTypeOptionSet.ServiceDog))
        .ForMember(d => d.spd_dogsassistanceindailyliving, opt => opt.MapFrom(s => s.ServiceDogTasks)) //refine
        .IncludeBase<DogInfoNew, spd_application>();
        ;

        _ = CreateMap<DogInfoNewWithoutAccreditedSchool, spd_application>()
        .ForMember(d => d.spd_dogsinoculationsuptodate, opt => opt.MapFrom(s => SharedMappingFuncs.GetYesNo(s.AreInoculationsUpToDate))) //refine
        .IncludeBase<DogInfoNew, spd_application>()
        ;

        _ = CreateMap<DogInfoNew, spd_application>()
        .ForMember(d => d.spd_dogname, opt => opt.MapFrom(s => s.DogName))
        .ForMember(d => d.spd_dogsdateofbirth, opt => opt.MapFrom(s => s.DogDateOfBirth))
        .ForMember(d => d.spd_dogbreed, opt => opt.MapFrom(s => s.DogBreed))
        .ForMember(d => d.spd_dogcolourandmarkings, opt => opt.MapFrom(s => s.DogColorAndMarkings))
        .ForMember(d => d.spd_dogsgender, opt => opt.MapFrom(s => SharedMappingFuncs.GetOptionset<GenderEnum, GenderOptionSet>(s.DogGender)))
        .ForMember(d => d.spd_microchipnumber, opt => opt.MapFrom(s => s.MicrochipNumber))
        ;

        _ = CreateMap<GraduationInfo, spd_dogtrainingschool>()
         .ForMember(d => d.spd_trainingschoolname, opt => opt.MapFrom(s => s.AccreditedSchoolName))
         .ForMember(d => d.spd_contactsurname, opt => opt.MapFrom(s => s.SchoolContactSurname))
         .ForMember(d => d.spd_contactfirstname, opt => opt.MapFrom(s => s.SchoolContactGivenName))
         .ForMember(d => d.spd_contactphone, opt => opt.MapFrom(s => s.SchoolContactPhoneNumber))
         .ForMember(d => d.spd_contactemail, opt => opt.MapFrom(s => s.SchoolContactEmailAddress));

        _ = CreateMap<TrainingInfo, spd_dogtrainingschool>();
        //.ForMember(d => d.spd_name, opt => opt.MapFrom(s => s.HasAttendedTrainingSchool));

        _ = CreateMap<TrainingSchoolInfo, spd_dogtrainingschool>()
           .ForMember(d => d.spd_name, opt => opt.MapFrom(s => s.TrainingBizName))
           .ForMember(d => d.spd_contactfirstname, opt => opt.MapFrom(s => s.ContactGivenName))
           .ForMember(d => d.spd_contactsurname, opt => opt.MapFrom(s => s.ContactSurname))
           .ForMember(d => d.spd_contactemail, opt => opt.MapFrom(s => s.ContactEmailAddress))
           .ForMember(d => d.spd_contactphone, opt => opt.MapFrom(s => s.ContactPhoneNumber))
           .ForMember(d => d.spd_traininghours, opt => opt.MapFrom(s => s.TotalTrainingHours))
           .ForMember(d => d.spd_startdate, opt => opt.MapFrom(s => s.TrainingStartDate))
           .ForMember(d => d.spd_enddate, opt => opt.MapFrom(s => s.TrainingEndDate))
            //.ForMember(d => d.spd_w, opt => opt.MapFrom(s => s.WhatLearned))
            //.ForMember(d => d.spd_w, opt => opt.MapFrom(s => s.TrainingName))
            //.ForMember(d => d.spd, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine1)))
            // .ForMember(d => d.spd_addressline2, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.AddressLine2)))
            // .ForMember(d => d.spd_city, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.City)))
            // .ForMember(d => d.spd_postalcode, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.PostalCode)))
            // .ForMember(d => d.spd_province, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Province)))
            // .ForMember(d => d.spd_country, opt => opt.MapFrom(s => s.MailingAddress == null ? null : StringHelper.SanitizeEmpty(s.MailingAddress.Country)))
            ;

        _ = CreateMap<OtherTraining, spd_dogtrainingschool>()
           .ForMember(d => d.spd_trainingdetails, opt => opt.MapFrom(s => s.TrainingDetail))
            //.ForMember(d => d.spd_trainer, opt => opt.MapFrom(s => s.UsePersonalDogTrainer))
            //.ForMember(d => d.spd_dogtr, opt => opt.MapFrom(s => s.DogTrainerCredential))
            //.ForMember(d => d.spd_contactemail, opt => opt.MapFrom(s => s.TrainingTime))
            //.ForMember(d => d.spd_contactphone, opt => opt.MapFrom(s => s.TrainerSurname))
            //.ForMember(d => d.spd_traininghours, opt => opt.MapFrom(s => s.TrainerGivenName))
            //.ForMember(d => d.spd_startdate, opt => opt.MapFrom(s => s.TrainerEmailAddress))
            //.ForMember(d => d.spd_enddate, opt => opt.MapFrom(s => s.TrainerPhoneNumber))
            .ForMember(d => d.spd_hoursspendpracticingskills, opt => opt.MapFrom(s => s.HoursPracticingSkill))
            ;

        CreateMap<SaveGDSDAppCmd, spd_application>()
         .ForMember(d => d.statuscode, opt => opt.MapFrom(s => SharedMappingFuncs.GetApplicationStatus(s.ApplicationStatusEnum)))
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => s.LicenceAppId ?? Guid.NewGuid()))
         .IncludeBase<GDSDApp, spd_application>();

        CreateMap<CreateGDSDAppCmd, spd_application>()
         .ForMember(d => d.spd_applicationid, opt => opt.MapFrom(s => Guid.NewGuid()))
         .ForMember(d => d.spd_submittedon, opt => opt.MapFrom(s => DateTimeOffset.UtcNow))
         .IncludeBase<GDSDApp, spd_application>();

        _ = CreateMap<spd_application, GDSDAppResp>()
         .IncludeBase<spd_application, GDSDApp>();
    }

}
