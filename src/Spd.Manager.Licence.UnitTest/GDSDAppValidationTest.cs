using AutoFixture;
using FluentValidation.TestHelper;

namespace Spd.Manager.Licence.UnitTest;
public class GDSDAppValidationTest
{
    private readonly GDSDTeamLicenceAppUpsertRequestValidator _validator;
    private readonly GraduationInfoValidator _graduationValidator;
    private readonly TrainingInfoValidator _trainingValidator;
    private readonly IFixture fixture;

    public GDSDAppValidationTest()
    {
        _validator = new GDSDTeamLicenceAppUpsertRequestValidator();
        _graduationValidator = new GraduationInfoValidator();
        _trainingValidator = new TrainingInfoValidator();

        fixture = new Fixture();
        fixture.Behaviors.Remove(new ThrowingRecursionBehavior());
        fixture.Behaviors.Add(new OmitOnRecursionBehavior());
    }

    [Fact]
    public void Should_HaveError_When_ApplicantId_IsEmpty()
    {

        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { ApplicantId = Guid.Empty };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.ApplicantId)
              .WithErrorMessage("'Applicant Id' must not be empty.");
    }

    [Fact]
    public void Should_NotHaveError_When_ApplicantId_IsProvided()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { ApplicantId = Guid.NewGuid() };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.ApplicantId);
    }

    [Fact]
    public void Should_HaveError_When_ServiceTypeCode_IsInvalid()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { ServiceTypeCode = Shared.ServiceTypeCode.MCFD };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.ServiceTypeCode)
              .WithErrorMessage("The specified condition was not met for 'Service Type Code'.");
    }

    [Fact]
    public void Should_HaveError_When_Surname_IsEmpty()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { Surname = string.Empty };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.Surname)
              .WithErrorMessage("'Surname' must not be empty.");
    }

    [Fact]
    public void Should_NotHaveError_When_Surname_IsProvided()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { Surname = "Smith" };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.Surname);
    }

    [Fact]
    public void Should_HaveError_When_DateOfBirth_IsInvalid()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { DateOfBirth = new DateOnly(1700, 1, 1) };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.DateOfBirth)
              .WithErrorMessage("The specified condition was not met for 'Date Of Birth'.");
    }

    [Fact]
    public void Should_NotHaveError_When_DateOfBirth_IsValid()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { DateOfBirth = new DateOnly(2000, 1, 1) };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.DateOfBirth);
    }

    [Fact]
    public void Should_HaveError_When_ContactPhoneNumber_IsEmpty()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { ContactPhoneNumber = string.Empty };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.ContactPhoneNumber)
              .WithErrorMessage("'Contact Phone Number' must not be empty.");
    }

    [Fact]
    public void Should_NotHaveError_When_ContactPhoneNumber_IsValid()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { Surname = "test", ContactPhoneNumber = "1234567890" };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.ContactPhoneNumber);
    }

    [Fact]
    public void Should_HaveError_When_ContactEmailAddress_IsInvalid()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { ContactEmailAddress = "invalid-email" };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.ContactEmailAddress)
              .WithErrorMessage("'Contact Email Address' is not a valid email address.");
    }

    [Fact]
    public void Should_NotHaveError_When_ContactEmailAddress_IsValid()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest { ContactEmailAddress = "test@example.com" };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.ContactEmailAddress);
    }

    [Fact]
    public void Should_HaveError_When_MailingAddress_IsInvalid()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest
        {
            MailingAddress = new MailingAddress { City = string.Empty, Province = string.Empty }
        };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor("MailingAddress.City")
              .WithErrorMessage("'City' must not be empty.");
        result.ShouldHaveValidationErrorFor("MailingAddress.Province")
              .WithErrorMessage("'Province' must not be empty.");
    }

    [Fact]
    public void Should_NotHaveError_When_MailingAddress_IsValid()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest
        {
            MailingAddress = new MailingAddress
            {
                City = "Sample City",
                Province = "Sample Province",
                AddressLine1 = "123 Sample St",
                PostalCode = "12345",
                Country = "Sample Country"
            }
        };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveValidationErrorFor("MailingAddress.City");
        result.ShouldNotHaveValidationErrorFor("MailingAddress.Province");
    }

    [Fact]
    public void Should_HaveError_When_DogInfoNewAccreditedSchool_IsEmpty_And_TrainedByAccreditedSchool()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest
        {
            IsDogTrainedByAccreditedSchool = true,
            DogInfoNewAccreditedSchool = null
        };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.DogInfoNewAccreditedSchool)
              .WithErrorMessage("'Dog Info New Accredited School' must not be empty.");
    }

    [Fact]
    public void Should_NotHaveError_When_DogInfoNewAccreditedSchool_IsValid_And_TrainedByAccreditedSchool()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest
        {
            IsDogTrainedByAccreditedSchool = true,
            DogInfoNewAccreditedSchool = new DogInfoNewAccreditedSchool { DogName = "Buddy" }
        };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.DogInfoNewAccreditedSchool);
    }

    [Fact]
    public void Should_HaveError_When_DogInfoNewAccreditedSchool_ServiceDogTasks_ExceedsMaxLength()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest
        {
            IsDogTrainedByAccreditedSchool = true,
            DogInfoNewAccreditedSchool = new DogInfoNewAccreditedSchool { ServiceDogTasks = new string('A', 1001) }
        };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor("DogInfoNewAccreditedSchool.ServiceDogTasks")
              .WithErrorMessage("The length of 'Service Dog Tasks' must be 1000 characters or fewer. You entered 1001 characters.");
    }

    [Fact]
    public void Should_HaveError_When_GraduationInfo_IsEmpty_And_TrainedByAccreditedSchool()
    {
        // Arrange
        var model = new GDSDTeamLicenceAppUpsertRequest
        {
            IsDogTrainedByAccreditedSchool = true,
            GraduationInfo = null
        };

        // Act
        var result = _validator.TestValidate(model);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.GraduationInfo)
              .WithErrorMessage("'Graduation Info' must not be empty.");
    }

    [Fact]
    public void Should_Have_Error_When_AccreditedSchoolName_Exceeds_MaxLength()
    {
        var model = new GraduationInfo { AccreditedSchoolName = new string('A', 251) };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.AccreditedSchoolName);
    }

    [Fact]
    public void Should_Not_Have_Error_When_AccreditedSchoolName_Is_Within_Limit()
    {
        var model = new GraduationInfo { AccreditedSchoolName = new string('A', 250) };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.AccreditedSchoolName);
    }

    [Fact]
    public void Should_Have_Error_When_SchoolContactSurname_Exceeds_MaxLength()
    {
        var model = new GraduationInfo { SchoolContactSurname = new string('A', 41) };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.SchoolContactSurname);
    }

    [Fact]
    public void Should_Not_Have_Error_When_SchoolContactSurname_Is_Within_Limit()
    {
        var model = new GraduationInfo { SchoolContactSurname = new string('A', 40) };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.SchoolContactSurname);
    }

    [Fact]
    public void Should_Have_Error_When_SchoolContactGivenName_Exceeds_MaxLength()
    {
        var model = new GraduationInfo { SchoolContactGivenName = new string('A', 41) };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.SchoolContactGivenName);
    }

    [Fact]
    public void Should_Not_Have_Error_When_SchoolContactGivenName_Is_Within_Limit()
    {
        var model = new GraduationInfo { SchoolContactGivenName = new string('A', 40) };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.SchoolContactGivenName);
    }

    [Fact]
    public void Should_Have_Error_When_SchoolContactEmailAddress_Is_Invalid()
    {
        var model = new GraduationInfo { SchoolContactEmailAddress = "invalid-email" };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.SchoolContactEmailAddress);
    }

    [Fact]
    public void Should_Not_Have_Error_When_SchoolContactEmailAddress_Is_Valid()
    {
        var model = new GraduationInfo { SchoolContactEmailAddress = "valid.email@example.com" };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.SchoolContactEmailAddress);
    }

    [Fact]
    public void Should_Have_Error_When_SchoolContactPhoneNumber_Exceeds_MaxLength()
    {
        var model = new GraduationInfo { SchoolContactPhoneNumber = new string('1', 31) };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.SchoolContactPhoneNumber);
    }

    [Fact]
    public void Should_Not_Have_Error_When_SchoolContactPhoneNumber_Is_Within_Limit()
    {
        var model = new GraduationInfo { SchoolContactPhoneNumber = new string('1', 30) };
        var result = _graduationValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.SchoolContactPhoneNumber);
    }

    [Fact]
    public void Should_Have_Valid_TrainingBizName()
    {
        var model = new TrainingInfo { TrainingBizName = new string('a', 500) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainingBizName);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_TrainingBizName_Too_Long()
    {
        var model = new TrainingInfo { TrainingBizName = new string('a', 501) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.TrainingBizName);
    }

    [Fact]
    public void Should_Validate_TrainingBizMailingAddress_When_Not_Null()
    {
        var model = new TrainingInfo { TrainingBizMailingAddress = new MailingAddress() }; // Assuming MailingAddress is a valid object.
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainingBizMailingAddress);
    }

    [Fact]
    public void Should_Not_Validate_TrainingBizMailingAddress_When_Null()
    {
        var model = new TrainingInfo { TrainingBizMailingAddress = null };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainingBizMailingAddress);
    }

    [Fact]
    public void Should_Have_Valid_TrainingBizContactGivenName()
    {
        var model = new TrainingInfo { TrainingBizContactGivenName = new string('a', 40) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainingBizContactGivenName);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_TrainingBizContactGivenName_Too_Long()
    {
        var model = new TrainingInfo { TrainingBizContactGivenName = new string('a', 41) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.TrainingBizContactGivenName);
    }

    [Fact]
    public void Should_Have_Valid_TrainingBizContactEmailAddress()
    {
        var model = new TrainingInfo { TrainingBizContactEmailAddress = "email@example.com" };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainingBizContactEmailAddress);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_Invalid_TrainingBizContactEmailAddress()
    {
        var model = new TrainingInfo { TrainingBizContactEmailAddress = "invalid-email" };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.TrainingBizContactEmailAddress);
    }

    [Fact]
    public void Should_Have_Valid_TrainingDateFrom()
    {
        var model = new TrainingInfo { TrainingDateFrom = new DateOnly(2023, 1, 1) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainingDateFrom);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_TrainingDateFrom_Before_1800()
    {
        var model = new TrainingInfo { TrainingDateFrom = new DateOnly(1799, 12, 31) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.TrainingDateFrom);
    }

    [Fact]
    public void Should_Have_Valid_TrainingDateTo()
    {
        var model = new TrainingInfo { TrainingDateTo = new DateOnly(2023, 12, 31) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainingDateTo);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_TrainingDateTo_Before_1800()
    {
        var model = new TrainingInfo { TrainingDateTo = new DateOnly(1799, 12, 31) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.TrainingDateTo);
    }

    [Fact]
    public void Should_Have_Valid_TrainingName()
    {
        var model = new TrainingInfo { TrainingName = new string('a', 100) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainingName);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_TrainingName_Too_Long()
    {
        var model = new TrainingInfo { TrainingName = new string('a', 101) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.TrainingName);
    }

    [Fact]
    public void Should_Have_Valid_WhatLearned()
    {
        var model = new TrainingInfo { WhatLearned = new string('a', 1000) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.WhatLearned);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_WhatLearned_Too_Long()
    {
        var model = new TrainingInfo { WhatLearned = new string('a', 1001) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.WhatLearned);
    }

    [Fact]
    public void Should_Have_Valid_TrainerEmailAddress_When_Not_Null()
    {
        var model = new TrainingInfo { TrainerEmailAddress = "trainer@example.com" };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.TrainerEmailAddress);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_Invalid_TrainerEmailAddress()
    {
        var model = new TrainingInfo { TrainerEmailAddress = "invalid-email" };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.TrainerEmailAddress);
    }

    [Fact]
    public void Should_Have_Valid_HoursPracticingSkill()
    {
        var model = new TrainingInfo { HoursPracticingSkill = new string('a', 100) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldNotHaveValidationErrorFor(x => x.HoursPracticingSkill);
    }

    [Fact]
    public void Should_Have_Validation_Error_For_HoursPracticingSkill_Too_Long()
    {
        var model = new TrainingInfo { HoursPracticingSkill = new string('a', 101) };
        var result = _trainingValidator.TestValidate(model);
        result.ShouldHaveValidationErrorFor(x => x.HoursPracticingSkill);
    }
}
