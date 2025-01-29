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
    public void Should_Have_Error_When_TrainingSchoolContactInfos_Is_Null_And_HasAttendedTrainingSchool_True()
    {
        // Arrange
        var trainingInfo = new TrainingInfo
        {
            HasAttendedTrainingSchool = true,
            SchoolTrainings = null
        };

        // Act
        var result = _trainingValidator.TestValidate(trainingInfo);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.SchoolTrainings);
    }

    [Fact]
    public void Should_Have_Error_When_TrainingSchoolContactInfos_Is_Empty_And_HasAttendedTrainingSchool_True()
    {
        // Arrange
        var trainingInfo = new TrainingInfo
        {
            HasAttendedTrainingSchool = true,
            SchoolTrainings = new List<TrainingSchoolInfo>()
        };

        // Act
        var result = _trainingValidator.TestValidate(trainingInfo);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.SchoolTrainings);
    }

    [Fact]
    public void Should_Not_Have_Error_When_TrainingSchoolInfos_Is_Valid_And_HasAttendedTrainingSchool_True()
    {
        // Arrange
        var trainingInfo = new TrainingInfo
        {
            HasAttendedTrainingSchool = true,
            SchoolTrainings = new List<TrainingSchoolInfo>
            {
                new() {
                    TrainingBizName = "Valid Business Name",
                    TrainingBizMailingAddress = new MailingAddress(),
                    ContactGivenName = "John",
                    ContactSurname = "Doe",
                    ContactEmailAddress = "john.doe@example.com",
                    TrainingStratDate = new DateOnly(2020, 1, 1),
                    TrainingEndDate = new DateOnly(2021, 1, 1),
                    TrainingName = "Valid Training",
                    WhatLearned = "Skill details"
                }
            }
        };

        // Act
        var result = _trainingValidator.TestValidate(trainingInfo);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.SchoolTrainings);
    }

    [Fact]
    public void Should_Have_Error_When_TrainingSchoolInfos_withTrainingEndDateEarlierThanStartDate_And_HasAttendedTrainingSchool_True()
    {
        // Arrange
        var trainingInfo = new TrainingInfo
        {
            HasAttendedTrainingSchool = true,
            SchoolTrainings = new List<TrainingSchoolInfo>
            {
                new() {
                    TrainingBizName = "Valid Business Name",
                    TrainingBizMailingAddress = new MailingAddress(),
                    ContactGivenName = "John",
                    ContactSurname = "Doe",
                    ContactEmailAddress = "john.doe@example.com",
                    TrainingStratDate = new DateOnly(2020, 1, 1),
                    TrainingEndDate = new DateOnly(2019, 1, 1),
                    TrainingName = "Invalid Training",
                    WhatLearned = "Skill details"
                }
            }
        };

        // Act
        var result = _trainingValidator.TestValidate(trainingInfo);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.SchoolTrainings);
    }

    [Fact]
    public void Should_Have_Error_When_OtherTrainings_Is_Null_And_HasAttendedTrainingSchool_False()
    {
        // Arrange
        var trainingInfo = new TrainingInfo
        {
            HasAttendedTrainingSchool = false,
            OtherTrainings = null
        };

        // Act
        var result = _trainingValidator.TestValidate(trainingInfo);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.OtherTrainings);
    }

    [Fact]
    public void Should_Have_Error_When_OtherTrainings_Is_Empty_And_HasAttendedTrainingSchool_False()
    {
        // Arrange
        var trainingInfo = new TrainingInfo
        {
            HasAttendedTrainingSchool = false,
            OtherTrainings = new List<OtherTraining>()
        };

        // Act
        var result = _trainingValidator.TestValidate(trainingInfo);

        // Assert
        result.ShouldHaveValidationErrorFor(x => x.OtherTrainings);
    }

    [Fact]
    public void Should_Not_Have_Error_When_OtherTrainings_Is_Valid_And_HasAttendedTrainingSchool_False()
    {
        // Arrange
        var trainingInfo = new TrainingInfo
        {
            HasAttendedTrainingSchool = false,
            OtherTrainings = new List<OtherTraining>
            {
                new() {
                    TrainingDetail = "Valid detail",
                    DogTrainerCredential = "Valid credential",
                    TrainingTime = "10 hours",
                    TrainerGivenName = "John",
                    TrainerSurname = "Doe",
                    TrainerEmailAddress = "john.doe@example.com",
                    TrainerPhoneNumber = "123-456-7890",
                    HoursPracticingSkill = "100 hours",
                }
            }
        };

        // Act
        var result = _trainingValidator.TestValidate(trainingInfo);

        // Assert
        result.ShouldNotHaveValidationErrorFor(x => x.OtherTrainings);
    }
}
