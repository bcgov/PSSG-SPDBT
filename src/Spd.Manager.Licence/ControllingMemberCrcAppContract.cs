﻿using MediatR;
using Spd.Manager.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Spd.Manager.Licence;
public abstract record ControllingMemberCrcApp
{
    //public string? AccessCode { get; set; }
    public string? GivenName { get; set; }
    public string? MiddleName1 { get; set; }
    public string? MiddleName2 { get; set; }
    public string? Surname { get; set; }
    public bool? AgreeToCompleteAndAccurate { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public GenderCode? GenderCode { get; set; }
    public string? PhoneNumber { get; set; }
    public string? EmailAddress { get; set; }
    public bool? HasPreviousNames { get; set; }
    public IEnumerable<Alias> Aliases { get; set; } = Array.Empty<Alias>();
    public bool? HasBcDriversLicence { get; set; }
    public string? BcDriversLicenceNumber { get; set; }
    public bool? IsPoliceOrPeaceOfficer { get; set; }
    public PoliceOfficerRoleCode? PoliceOfficerRoleCode { get; set; }
    public string? OtherOfficerRole { get; set; }
    public bool? IsCanadianCitizen { get; set; }
    public bool? HasCriminalHistory { get; set; }
    public string? CriminalHistoryDetail { get; set; }
    public bool? HasBankruptcyHistory { get; set; }
    public string? BankruptcyHistoryDetail { get; set; }
    public bool? IsTreatedForMHC { get; set; }
    public Address? ResidentialAddress { get; set; }
}

public record ControllingMemberCrcAppCommandResponse
{
    public Guid ControllingMemberAppId { get; set; }
};


public record ControllingMemberCrcAppSubmitRequest : ControllingMemberCrcApp
{
};

public record ControllingMemberCrcAppSubmitRequestCommand(ControllingMemberCrcAppSubmitRequest CrcControllingMemberUpsertRequest) : IRequest<ControllingMemberCrcAppCommandResponse>;