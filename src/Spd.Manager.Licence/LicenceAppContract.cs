﻿using Spd.Manager.Shared;
using GenderCode = Spd.Manager.Shared.GenderCode;

namespace Spd.Manager.Licence;
public abstract record PersonalLicenceAppBase
{
    public WorkerLicenceTypeCode? WorkerLicenceTypeCode { get; set; }
    public ApplicationTypeCode? ApplicationTypeCode { get; set; }
    public BusinessTypeCode? BusinessTypeCode { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public GenderCode? GenderCode { get; set; }
    public bool? OneLegalName { get; set; }
    public string? ExpiredLicenceNumber { get; set; }
    public Guid? ExpiredLicenceId { get; set; } //for new application type, for renew, replace, update, it should be null.
    public bool? HasExpiredLicence { get; set; }  //for new application type
    public LicenceTermCode? LicenceTermCode { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public bool? HasPreviousName { get; set; }
    public IEnumerable<Alias>? Aliases { get; set; }
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public HairColourCode? HairColourCode { get; set; }
    public EyeColourCode? EyeColourCode { get; set; }
    public int? Height { get; set; }
    public HeightUnitCode? HeightUnitCode { get; set; }
    public int? Weight { get; set; }
    public WeightUnitCode? WeightUnitCode { get; set; }
    public string? ContactEmailAddress { get; set; }
    public string? ContactPhoneNumber { get; set; }
    public bool? IsMailingTheSameAsResidential { get; set; }
    public ResidentialAddress? ResidentialAddressData { get; set; }
    public MailingAddress? MailingAddressData { get; set; }
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? IsTreatedForMHC { get; set; }
    public bool? UseBcServicesCardPhoto { get; set; }
    public bool? CarryAndUseRestraints { get; set; }
    public bool? UseDogs { get; set; }
    public bool? IsDogsPurposeProtection { get; set; }
    public bool? IsDogsPurposeDetectionDrugs { get; set; }
    public bool? IsDogsPurposeDetectionExplosives { get; set; }
    public bool? IsCanadianCitizen { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public bool? LegalNameChanged { get; set; }
    public IEnumerable<DocumentExpiredInfo> DocumentExpiredInfos { get; set; } = Enumerable.Empty<DocumentExpiredInfo>();
}

public record ResidentialAddress : Address;
public record MailingAddress : Address;

public record LicenceAppUpsertResponse
{
    public Guid? LicenceAppId { get; set; }
}


