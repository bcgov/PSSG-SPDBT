import {
	ApplicationInviteStatusCode,
	ApplicationPortalStatusCode,
	ApplicationTypeCode,
	ArmouredVehiclePermitReasonCode,
	BizTypeCode,
	BodyArmourPermitReasonCode,
	ContactAuthorizationTypeCode,
	EyeColourCode,
	GenderCode,
	HairColourCode,
	HeightUnitCode,
	LicenceDocumentTypeCode,
	LicenceTermCode,
	PoliceOfficerRoleCode,
	ServiceTypeCode,
	WeightUnitCode,
	WorkerCategoryTypeCode,
} from '@app/api/models';
import { CountryTypeCode } from './country-type.model';

export interface SelectOptions<k = string> {
	code: k;
	desc: string;
	selected?: boolean;
}

// ============================================================
// ENUMs
// ============================================================
export enum BooleanTypeCode {
	Yes = 'Yes',
	No = 'No',
}

export enum LicenceUpdateTypeCode {
	UpdateName = 'UpdateName',
	UpdatePhoto = 'UpdatePhoto',
	AddLicenceCategory = 'AddLicenceCategory',
	AddAuthorizationToUseRestraints = 'AddAuthorizationToUseRestraints',
	AddAuthorizationToUseDogs = 'AddAuthorizationToUseDogs',
}

type LocksmithRequirementCodeSubset = Extract<
	LicenceDocumentTypeCode,
	| LicenceDocumentTypeCode.CategoryLocksmithApprovedLocksmithCourse
	| LicenceDocumentTypeCode.CategoryLocksmithCertificateOfQualification
	| LicenceDocumentTypeCode.CategoryLocksmithExperienceAndApprenticeship
>;
export const LocksmithRequirementCode: Record<LocksmithRequirementCodeSubset, string> = {
	[LicenceDocumentTypeCode.CategoryLocksmithApprovedLocksmithCourse]:
		LicenceDocumentTypeCode.CategoryLocksmithApprovedLocksmithCourse,
	[LicenceDocumentTypeCode.CategoryLocksmithCertificateOfQualification]:
		LicenceDocumentTypeCode.CategoryLocksmithCertificateOfQualification,
	[LicenceDocumentTypeCode.CategoryLocksmithExperienceAndApprenticeship]:
		LicenceDocumentTypeCode.CategoryLocksmithExperienceAndApprenticeship,
};

type PrivateInvestigatorRequirementCodeSubset = Extract<
	LicenceDocumentTypeCode,
	| LicenceDocumentTypeCode.CategoryPrivateInvestigatorExperienceAndCourses
	| LicenceDocumentTypeCode.CategoryPrivateInvestigatorKnowledgeAndExperience
	| LicenceDocumentTypeCode.CategoryPrivateInvestigatorTenYearsPoliceExperienceAndTraining
>;
export const PrivateInvestigatorRequirementCode: Record<PrivateInvestigatorRequirementCodeSubset, string> = {
	[LicenceDocumentTypeCode.CategoryPrivateInvestigatorExperienceAndCourses]:
		LicenceDocumentTypeCode.CategoryPrivateInvestigatorExperienceAndCourses,
	[LicenceDocumentTypeCode.CategoryPrivateInvestigatorKnowledgeAndExperience]:
		LicenceDocumentTypeCode.CategoryPrivateInvestigatorKnowledgeAndExperience,
	[LicenceDocumentTypeCode.CategoryPrivateInvestigatorTenYearsPoliceExperienceAndTraining]:
		LicenceDocumentTypeCode.CategoryPrivateInvestigatorTenYearsPoliceExperienceAndTraining,
};

type PrivateInvestigatorTrainingCodeSubset = Extract<
	LicenceDocumentTypeCode,
	| LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingRecognizedCourse
	| LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingOtherCoursesOrKnowledge
>;
export const PrivateInvestigatorTrainingCode: Record<PrivateInvestigatorTrainingCodeSubset, string> = {
	[LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingRecognizedCourse]:
		LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingRecognizedCourse,
	[LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingOtherCoursesOrKnowledge]:
		LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingOtherCoursesOrKnowledge,
};

type PrivateInvestigatorSupRequirementCodeSubset = Extract<
	LicenceDocumentTypeCode,
	| LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionPrivateSecurityTrainingNetworkCompletion
	| LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionOtherCourseCompletion
>;
export const PrivateInvestigatorSupRequirementCode: Record<PrivateInvestigatorSupRequirementCodeSubset, string> = {
	[LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionPrivateSecurityTrainingNetworkCompletion]:
		LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionPrivateSecurityTrainingNetworkCompletion,
	[LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionOtherCourseCompletion]:
		LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionOtherCourseCompletion,
};

type SecurityAlarmInstallerRequirementCodeSubset = Extract<
	LicenceDocumentTypeCode,
	| LicenceDocumentTypeCode.CategorySecurityAlarmInstallerExperienceOrTrainingEquivalent
	| LicenceDocumentTypeCode.CategorySecurityAlarmInstallerTradesQualificationCertificate
>;
export const SecurityAlarmInstallerRequirementCode: Record<SecurityAlarmInstallerRequirementCodeSubset, string> = {
	[LicenceDocumentTypeCode.CategorySecurityAlarmInstallerExperienceOrTrainingEquivalent]:
		LicenceDocumentTypeCode.CategorySecurityAlarmInstallerExperienceOrTrainingEquivalent,
	[LicenceDocumentTypeCode.CategorySecurityAlarmInstallerTradesQualificationCertificate]:
		LicenceDocumentTypeCode.CategorySecurityAlarmInstallerTradesQualificationCertificate,
};

type SecurityConsultantRequirementCodeSubset = Extract<
	LicenceDocumentTypeCode,
	| LicenceDocumentTypeCode.CategorySecurityConsultantResume
	| LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters
	| LicenceDocumentTypeCode.CategorySecurityConsultantRecommendationLetters
>;
export const SecurityConsultantRequirementCode: Record<SecurityConsultantRequirementCodeSubset, string> = {
	[LicenceDocumentTypeCode.CategorySecurityConsultantResume]: LicenceDocumentTypeCode.CategorySecurityConsultantResume,
	[LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters]:
		LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters,
	[LicenceDocumentTypeCode.CategorySecurityConsultantRecommendationLetters]:
		LicenceDocumentTypeCode.CategorySecurityConsultantRecommendationLetters,
};

type SecurityGuardRequirementCodeSubset = Extract<
	LicenceDocumentTypeCode,
	| LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCertificate
	| LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCourseEquivalent
	| LicenceDocumentTypeCode.CategorySecurityGuardPoliceExperienceOrTraining
>;
export const SecurityGuardRequirementCode: Record<SecurityGuardRequirementCodeSubset, string> = {
	[LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCertificate]:
		LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCertificate,
	[LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCourseEquivalent]:
		LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCourseEquivalent,
	[LicenceDocumentTypeCode.CategorySecurityGuardPoliceExperienceOrTraining]:
		LicenceDocumentTypeCode.CategorySecurityGuardPoliceExperienceOrTraining,
};

type RestraintDocumentTypeCodeSubset = Extract<
	LicenceDocumentTypeCode,
	| LicenceDocumentTypeCode.CategorySecurityGuardAstCertificate
	| LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetter
	| LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetterAstEquivalent
>;
export const RestraintDocumentTypeCode: Record<RestraintDocumentTypeCodeSubset, string> = {
	[LicenceDocumentTypeCode.CategorySecurityGuardAstCertificate]:
		LicenceDocumentTypeCode.CategorySecurityGuardAstCertificate,
	[LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetter]:
		LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetter,
	[LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetterAstEquivalent]:
		LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetterAstEquivalent,
};

// ============================================================
// SelectOptions Lists
// ============================================================

export const ApplicationTypes: SelectOptions[] = [
	{ desc: 'New', code: ApplicationTypeCode.New },
	{ desc: 'Renewal', code: ApplicationTypeCode.Renewal },
	{ desc: 'Replacement', code: ApplicationTypeCode.Replacement },
	{ desc: 'Update', code: ApplicationTypeCode.Update },
];

export const ApplicationPortalStatuses: SelectOptions[] = [
	{ desc: 'Awaiting Third Party', code: ApplicationPortalStatusCode.AwaitingThirdParty },
	{ desc: 'Awaiting Applicant', code: ApplicationPortalStatusCode.AwaitingApplicant },
	{ desc: 'Cancelled by Appl.', code: ApplicationPortalStatusCode.CancelledByApplicant },
	{ desc: 'Cancelled by Org.', code: ApplicationPortalStatusCode.CancelledByOrganization },
	{ desc: 'Closed - Judicial Review', code: ApplicationPortalStatusCode.ClosedJudicialReview },
	{ desc: 'Closed - No Response', code: ApplicationPortalStatusCode.ClosedNoResponse },
	{ desc: 'Closed - No Consent', code: ApplicationPortalStatusCode.ClosedNoConsent },
	{ desc: 'Completed - Cleared', code: ApplicationPortalStatusCode.CompletedCleared },
	{ desc: 'Completed - Risk Found', code: ApplicationPortalStatusCode.RiskFound },
	{ desc: 'Draft', code: ApplicationPortalStatusCode.Draft },
	{ desc: 'In Progress', code: ApplicationPortalStatusCode.InProgress },
	{ desc: 'Incomplete', code: ApplicationPortalStatusCode.Incomplete },
	{ desc: 'Payment Pending', code: ApplicationPortalStatusCode.AwaitingPayment },
	{ desc: 'Verify Identity', code: ApplicationPortalStatusCode.VerifyIdentity },
	{ desc: 'Under Assessment', code: ApplicationPortalStatusCode.UnderAssessment },
];

export const BizTypes: SelectOptions[] = [
	{ desc: 'Corporation', code: BizTypeCode.Corporation },
	{ desc: 'Non-Registered Partnership', code: BizTypeCode.NonRegisteredPartnership },
	{ desc: 'Non-Registered Sole Proprietor', code: BizTypeCode.NonRegisteredSoleProprietor },
	{ desc: 'Registered Partnership', code: BizTypeCode.RegisteredPartnership },
	{ desc: 'Registered Sole Proprietor', code: BizTypeCode.RegisteredSoleProprietor },
	{ desc: 'None', code: BizTypeCode.None },
];

export const BusinessLicenceTypes: SelectOptions[] = BizTypes.filter(
	(item: SelectOptions) => item.code != BizTypeCode.None
);

export const ApplicationInviteStatuses: SelectOptions[] = [
	{ desc: 'Draft', code: ApplicationInviteStatusCode.Draft },
	{ desc: 'Sent', code: ApplicationInviteStatusCode.Sent },
	{ desc: 'Failed', code: ApplicationInviteStatusCode.Failed },
	{ desc: 'Completed', code: ApplicationInviteStatusCode.Completed },
	{ desc: 'Cancelled', code: ApplicationInviteStatusCode.Cancelled },
	{ desc: 'Expired', code: ApplicationInviteStatusCode.Expired },
];

export const GenderTypes: SelectOptions[] = [
	{ desc: 'M', code: GenderCode.M },
	{ desc: 'F', code: GenderCode.F },
	{ desc: 'X', code: GenderCode.U },
];

export const LicenceTermTypes: SelectOptions[] = [
	{ desc: '90 Days', code: LicenceTermCode.NinetyDays },
	{ desc: '1 Year', code: LicenceTermCode.OneYear },
	{ desc: '2 Years', code: LicenceTermCode.TwoYears },
	{ desc: '3 Years', code: LicenceTermCode.ThreeYears },
	{ desc: '5 Years', code: LicenceTermCode.FiveYears },
];

export const DogDocumentTypes: SelectOptions[] = [
	{
		desc: 'Security Dog Validation Certificate',
		code: LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate,
	},
	{
		desc: 'Security Dog Validation Certificate',
		code: LicenceDocumentTypeCode.BizSecurityDogCertificate,
	},
];

export const RestraintDocumentTypes: SelectOptions[] = [
	{
		desc: 'Advanced security training (AST) certificate',
		code: RestraintDocumentTypeCode.CategorySecurityGuard_ASTCertificate,
	},
	{
		desc: 'A Canadian police officer, correctional officer, sheriff, auxiliary, reserve or border service officer can provide a letter from their employer showing use of force training within the last 12 months. This letter should be signed on official letterhead and include the exact date of the training for our records.',
		code: RestraintDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetter,
	},
	{
		desc: 'Must be able to demonstrate, to the satisfaction of the registrar that he or she has training equivalent to the training referred above.',
		code: RestraintDocumentTypeCode.CategorySecurityGuard_UseForceEmployerLetterASTEquivalent,
	},
];

export const BooleanTypes: SelectOptions[] = [
	{ desc: 'No', code: BooleanTypeCode.No },
	{ desc: 'Yes', code: BooleanTypeCode.Yes },
];

export const ProofOfCanadianCitizenshipTypes: SelectOptions[] = [
	{ desc: 'Canadian Birth Certificate', code: LicenceDocumentTypeCode.BirthCertificate },
	{ desc: 'Canadian Citizenship Certificate', code: LicenceDocumentTypeCode.CanadianCitizenship },
	{ desc: 'Canadian Passport', code: LicenceDocumentTypeCode.CanadianPassport },
	{ desc: 'Secure certificate of Indian Status', code: LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen },
];

export const ProofOfAbilityToWorkInCanadaTypes: SelectOptions[] = [
	{ desc: 'Canadian Permanent Resident Card', code: LicenceDocumentTypeCode.PermanentResidentCard },
	{
		desc: 'Confirmation of Permanent Residence Document (IMM 5292)',
		code: LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument,
	},
	{ desc: 'Record of Landing (IMM1000)', code: LicenceDocumentTypeCode.RecordOfLandingDocument },
	{ desc: 'Study Permit', code: LicenceDocumentTypeCode.StudyPermit },
	{ desc: 'Valid document to verify legal work status', code: LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus },
	{ desc: 'Work Permit', code: LicenceDocumentTypeCode.WorkPermit },
];

export const GovernmentIssuedPhotoIdTypes: SelectOptions[] = [
	{ desc: 'BC Services Card (with photo)', code: LicenceDocumentTypeCode.BcServicesCard },
	{ desc: 'BCID', code: LicenceDocumentTypeCode.Bcid },
	{ desc: 'Canadian Firearms Licence', code: LicenceDocumentTypeCode.CanadianFirearmsLicence },
	{ desc: 'Canadian Permanent Resident Card', code: LicenceDocumentTypeCode.PermanentResidentCardAdditional },
	{ desc: `Driver's Licence`, code: LicenceDocumentTypeCode.DriversLicenceAdditional },
	{ desc: 'Passport', code: LicenceDocumentTypeCode.PassportAdditional },
	{
		desc: 'Secure certificate of Indian Status (with photo)',
		code: LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional,
	},
];

export const PermitProofOfResidenceStatusTypes: SelectOptions[] = [
	{ desc: 'Canadian Permanent Resident Card', code: LicenceDocumentTypeCode.PermanentResidentCard },
	{
		desc: 'Confirmation of Permanent Residence Document (IMM 5292)',
		code: LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument,
	},
	{ desc: 'Record of Landing (IMM1000)', code: LicenceDocumentTypeCode.RecordOfLandingDocument },
	{ desc: 'Study Permit', code: LicenceDocumentTypeCode.StudyPermit },
	{ desc: 'Work Permit', code: LicenceDocumentTypeCode.WorkPermit },
];

export const PermitProofOfCitizenshipTypes: SelectOptions[] = [
	{ desc: `Driver's Licence`, code: LicenceDocumentTypeCode.DriversLicence },
	{ desc: 'Valid Government Issued Photo ID', code: LicenceDocumentTypeCode.GovernmentIssuedPhotoId },
	{ desc: 'Passport', code: LicenceDocumentTypeCode.NonCanadianPassport },
];

export const ServiceTypes: SelectOptions[] = [
	{ desc: 'Armoured Vehicle Permit', code: ServiceTypeCode.ArmouredVehiclePermit },
	{ desc: 'Body Armour Permit', code: ServiceTypeCode.BodyArmourPermit },
	{ desc: 'Crrp Employee', code: ServiceTypeCode.CrrpEmployee },
	{ desc: 'Crrp Volunteer', code: ServiceTypeCode.CrrpVolunteer },
	{ desc: 'Mcfd', code: ServiceTypeCode.Mcfd },
	{ desc: 'Mdra', code: ServiceTypeCode.Mdra },
	{ desc: 'PeCrc', code: ServiceTypeCode.PeCrc },
	{ desc: 'PeCrcVs', code: ServiceTypeCode.PeCrcVs },
	{ desc: 'Psso', code: ServiceTypeCode.Psso },
	{ desc: 'PssoVs', code: ServiceTypeCode.PssoVs },
	{ desc: 'Security Business Licence', code: ServiceTypeCode.SecurityBusinessLicence },
	{ desc: 'Security Worker Licence', code: ServiceTypeCode.SecurityWorkerLicence },
	{
		desc: 'Controlling Members CRC',
		code: ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
	},
];

export const ContactAuthorizationTypes: SelectOptions[] = [
	{ desc: 'Business Manager', code: ContactAuthorizationTypeCode.BusinessManager },
	{ desc: 'Contact', code: ContactAuthorizationTypeCode.Contact },
	{ desc: 'Primary', code: ContactAuthorizationTypeCode.Primary },
	{ desc: 'Primary Business Manager', code: ContactAuthorizationTypeCode.PrimaryBusinessManager },
];

export const HairColourTypes: SelectOptions[] = [
	{ desc: 'Bald', code: HairColourCode.Bald },
	{ desc: 'Black', code: HairColourCode.Black },
	{ desc: 'Blonde', code: HairColourCode.Blonde },
	{ desc: 'Brown', code: HairColourCode.Brown },
	{ desc: 'Grey', code: HairColourCode.Grey },
	{ desc: 'Red', code: HairColourCode.Red },
	{ desc: 'White', code: HairColourCode.White },
];

export const EyeColourTypes: SelectOptions[] = [
	{ desc: 'Black', code: EyeColourCode.Black },
	{ desc: 'Blue', code: EyeColourCode.Blue },
	{ desc: 'Brown', code: EyeColourCode.Brown },
	{ desc: 'Green', code: EyeColourCode.Green },
	{ desc: 'Grey', code: EyeColourCode.Grey },
	{ desc: 'Hazel', code: EyeColourCode.Hazel },
	{ desc: 'Other', code: EyeColourCode.Other },
];

export const HeightUnitTypes: SelectOptions[] = [
	{ desc: 'Centimeters', code: HeightUnitCode.Centimeters },
	{ desc: 'Feet', code: HeightUnitCode.Inches },
];

export const WeightUnitTypes: SelectOptions[] = [
	{ desc: 'Kilograms', code: WeightUnitCode.Kilograms },
	{ desc: 'Pounds', code: WeightUnitCode.Pounds },
];

export const WorkerCategoryTypes: SelectOptions[] = [
	{ desc: 'Armoured Car Guard', code: WorkerCategoryTypeCode.ArmouredCarGuard },
	{ desc: 'Body Armour Sales', code: WorkerCategoryTypeCode.BodyArmourSales },
	{ desc: 'Closed Circuit Television Installer', code: WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller },
	{ desc: 'Electronic Locking Device Installer', code: WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller },
	{ desc: 'Fire Investigator', code: WorkerCategoryTypeCode.FireInvestigator },
	{ desc: 'Locksmith', code: WorkerCategoryTypeCode.Locksmith },
	{ desc: 'Locksmith - Under Supervision', code: WorkerCategoryTypeCode.LocksmithUnderSupervision },
	{ desc: 'Private Investigator', code: WorkerCategoryTypeCode.PrivateInvestigator },
	{
		desc: 'Private Investigator - Under Supervision',
		code: WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
	},
	{ desc: 'Security Alarm Installer', code: WorkerCategoryTypeCode.SecurityAlarmInstaller },
	{
		desc: 'Security Alarm Installer - Under Supervision',
		code: WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
	},
	{ desc: 'Security Alarm Monitor', code: WorkerCategoryTypeCode.SecurityAlarmMonitor },
	{ desc: 'Security Alarm Response', code: WorkerCategoryTypeCode.SecurityAlarmResponse },
	{ desc: 'Security Alarm Sales', code: WorkerCategoryTypeCode.SecurityAlarmSales },
	{ desc: 'Security Consultant', code: WorkerCategoryTypeCode.SecurityConsultant },
	{ desc: 'Security Guard', code: WorkerCategoryTypeCode.SecurityGuard },
	{ desc: 'Security Guard - Under Supervision', code: WorkerCategoryTypeCode.SecurityGuardUnderSupervision },
];

export const BusinessLicenceCategoryTypes: SelectOptions[] = [
	{ desc: 'Armoured Car Guard', code: WorkerCategoryTypeCode.ArmouredCarGuard },
	{ desc: 'Body Armour Sales', code: WorkerCategoryTypeCode.BodyArmourSales },
	{ desc: 'Closed Circuit Television Installer', code: WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller },
	{ desc: 'Electronic Locking Device Installer', code: WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller },
	{ desc: 'Locksmith', code: WorkerCategoryTypeCode.Locksmith },
	{ desc: 'Private Investigator', code: WorkerCategoryTypeCode.PrivateInvestigator },
	{ desc: 'Security Alarm Installer', code: WorkerCategoryTypeCode.SecurityAlarmInstaller },
	{ desc: 'Security Alarm Monitor', code: WorkerCategoryTypeCode.SecurityAlarmMonitor },
	{ desc: 'Security Alarm Response', code: WorkerCategoryTypeCode.SecurityAlarmResponse },
	{ desc: 'Security Alarm Sales', code: WorkerCategoryTypeCode.SecurityAlarmSales },
	{ desc: 'Security Consultant', code: WorkerCategoryTypeCode.SecurityConsultant },
	{ desc: 'Security Guard', code: WorkerCategoryTypeCode.SecurityGuard },
];

export const PoliceOfficerRoleTypes: SelectOptions[] = [
	{ desc: 'Auxiliary or Reserve Constable', code: PoliceOfficerRoleCode.AuxiliaryorReserveConstable },
	{ desc: 'Corrections Officer', code: PoliceOfficerRoleCode.CorrectionsOfficer },
	{ desc: 'Court Appointed Bailiff', code: PoliceOfficerRoleCode.CourtAppointedBailiff },
	{ desc: 'Other', code: PoliceOfficerRoleCode.Other },
	{ desc: 'Police Officer', code: PoliceOfficerRoleCode.PoliceOfficer },
	{ desc: 'Police Officer - Retired', code: PoliceOfficerRoleCode.PoliceOfficerRetired },
	{ desc: 'Sheriff Deputy Sheriff', code: PoliceOfficerRoleCode.SheriffDeputySheriff },
	{
		desc: 'Special Provincial Or Municipal Constable',
		code: PoliceOfficerRoleCode.SpecialProvincialOrMunicipalConstable,
	},
];

export const ArmouredVehiclePermitReasonTypes: SelectOptions[] = [
	{ desc: 'Personal Protection', code: ArmouredVehiclePermitReasonCode.PersonalProtection },
	{ desc: 'My Employment', code: ArmouredVehiclePermitReasonCode.MyEmployment },
	{ desc: 'Other', code: ArmouredVehiclePermitReasonCode.Other },
	{ desc: 'Protection of Personal Property', code: ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty },
	{ desc: `Protection of Other's Property`, code: ArmouredVehiclePermitReasonCode.ProtectionOfOtherProperty },
	{ desc: 'Protection of Another Person', code: ArmouredVehiclePermitReasonCode.ProtectionOfAnotherPerson },
];

export const BodyArmourPermitReasonTypes: SelectOptions[] = [
	{ desc: 'My Employment', code: BodyArmourPermitReasonCode.MyEmployment },
	{ desc: 'Other', code: BodyArmourPermitReasonCode.Other },
	{ desc: 'Outdoor Recreation', code: BodyArmourPermitReasonCode.OutdoorRecreation },
	{ desc: 'Personal Protection', code: BodyArmourPermitReasonCode.PersonalProtection },
	{
		desc: 'Travel in Response to International Conflict',
		code: BodyArmourPermitReasonCode.TravelInResponseToInternationalConflict,
	},
];

export const CountryTypes: SelectOptions[] = [
	{ desc: 'Canada', code: CountryTypeCode.Canada },
	{ desc: 'United States of America', code: CountryTypeCode.UnitedStatesofAmerica },
	{ desc: 'Afghanistan', code: CountryTypeCode.Afghanistan },
	{ desc: 'Åland Islands', code: CountryTypeCode.ÅlandIslands },
	{ desc: 'Albania', code: CountryTypeCode.Albania },
	{ desc: 'Algeria', code: CountryTypeCode.Algeria },
	{ desc: 'American Samoa', code: CountryTypeCode.AmericanSamoa },
	{ desc: 'Andorra', code: CountryTypeCode.Andorra },
	{ desc: 'Angola', code: CountryTypeCode.Angola },
	{ desc: 'Anguilla', code: CountryTypeCode.Anguilla },
	{ desc: 'Antarctica', code: CountryTypeCode.Antarctica },
	{ desc: 'Antigua and Barbuda', code: CountryTypeCode.AntiguaandBarbuda },
	{ desc: 'Argentina', code: CountryTypeCode.Argentina },
	{ desc: 'Armenia', code: CountryTypeCode.Armenia },
	{ desc: 'Aruba', code: CountryTypeCode.Aruba },
	{ desc: 'Australia', code: CountryTypeCode.Australia },
	{ desc: 'Austria', code: CountryTypeCode.Austria },
	{ desc: 'Azerbaijan', code: CountryTypeCode.Azerbaijan },
	{ desc: 'Bahamas (the)', code: CountryTypeCode.Bahamas },
	{ desc: 'Bahrain', code: CountryTypeCode.Bahrain },
	{ desc: 'Bangladesh', code: CountryTypeCode.Bangladesh },
	{ desc: 'Barbados', code: CountryTypeCode.Barbados },
	{ desc: 'Belarus', code: CountryTypeCode.Belarus },
	{ desc: 'Belgium', code: CountryTypeCode.Belgium },
	{ desc: 'Belize', code: CountryTypeCode.Belize },
	{ desc: 'Benin', code: CountryTypeCode.Benin },
	{ desc: 'Bermuda', code: CountryTypeCode.Bermuda },
	{ desc: 'Bhutan', code: CountryTypeCode.Bhutan },
	{ desc: 'Bolivia (Plurinational State of)', code: CountryTypeCode.Bolivia },
	{ desc: 'Bonaire, Sint Eustatius and Saba', code: CountryTypeCode.Bonaire },
	{ desc: 'Bosnia and Herzegovina', code: CountryTypeCode.BosniaandHerzegovina },
	{ desc: 'Botswana', code: CountryTypeCode.Botswana },
	{ desc: 'Bouvet Island', code: CountryTypeCode.BouvetIsland },
	{ desc: 'Brazil', code: CountryTypeCode.Brazil },
	{ desc: 'British Indian Ocean Territory (the)', code: CountryTypeCode.BritishIndianOceanTerritory },
	{ desc: 'Brunei Darussalam', code: CountryTypeCode.BruneiDarussalam },
	{ desc: 'Bulgaria', code: CountryTypeCode.Bulgaria },
	{ desc: 'Burkina Faso', code: CountryTypeCode.BurkinaFaso },
	{ desc: 'Burundi', code: CountryTypeCode.Burundi },
	{ desc: 'Cabo Verde', code: CountryTypeCode.CaboVerde },
	{ desc: 'Cambodia', code: CountryTypeCode.Cambodia },
	{ desc: 'Cameroon', code: CountryTypeCode.Cameroon },
	{ desc: 'Cayman Islands (the)', code: CountryTypeCode.CaymanIslands },
	{ desc: 'Central African Republic (the)', code: CountryTypeCode.CentralAfricanRepublic },
	{ desc: 'Chad', code: CountryTypeCode.Chad },
	{ desc: 'Chile', code: CountryTypeCode.Chile },
	{ desc: 'China', code: CountryTypeCode.China },
	{ desc: 'Christmas Island', code: CountryTypeCode.ChristmasIsland },
	{ desc: 'Cocos (Keeling) Islands (the)', code: CountryTypeCode.CocosIslands },
	{ desc: 'Colombia', code: CountryTypeCode.Colombia },
	{ desc: 'Comoros (the)', code: CountryTypeCode.Comoros },
	{ desc: 'Congo (the Democratic Republic of the)', code: CountryTypeCode.DemocraticRepublicCongo },
	{ desc: 'Congo (the)', code: CountryTypeCode.Congo },
	{ desc: 'Cook Islands (the)', code: CountryTypeCode.CookIslands },
	{ desc: 'Costa Rica', code: CountryTypeCode.CostaRica },
	{ desc: "Côte d'Ivoire", code: CountryTypeCode.CôtedIvoire },
	{ desc: 'Croatia', code: CountryTypeCode.Croatia },
	{ desc: 'Cuba', code: CountryTypeCode.Cuba },
	{ desc: 'Curaçao', code: CountryTypeCode.Curaçao },
	{ desc: 'Cyprus', code: CountryTypeCode.Cyprus },
	{ desc: 'Czechia', code: CountryTypeCode.Czechia },
	{ desc: 'Denmark', code: CountryTypeCode.Denmark },
	{ desc: 'Djibouti', code: CountryTypeCode.Djibouti },
	{ desc: 'Dominica', code: CountryTypeCode.Dominica },
	{ desc: 'Dominican Republic (the)', code: CountryTypeCode.DominicanRepublic },
	{ desc: 'Ecuador', code: CountryTypeCode.Ecuador },
	{ desc: 'Egypt', code: CountryTypeCode.Egypt },
	{ desc: 'El Salvador', code: CountryTypeCode.ElSalvador },
	{ desc: 'Equatorial Guinea', code: CountryTypeCode.EquatorialGuinea },
	{ desc: 'Eritrea', code: CountryTypeCode.Eritrea },
	{ desc: 'Estonia', code: CountryTypeCode.Estonia },
	{ desc: 'Eswatini', code: CountryTypeCode.Switzerland },
	{ desc: 'Ethiopia', code: CountryTypeCode.Ethiopia },
	{ desc: 'Falkland Islands (the) [Malvinas]', code: CountryTypeCode.FalklandIslands },
	{ desc: 'Faroe Islands (the)', code: CountryTypeCode.FaroeIslands },
	{ desc: 'Fiji', code: CountryTypeCode.Fiji },
	{ desc: 'Finland', code: CountryTypeCode.Finland },
	{ desc: 'France', code: CountryTypeCode.France },
	{ desc: 'French Guiana', code: CountryTypeCode.FrenchGuiana },
	{ desc: 'French Polynesia', code: CountryTypeCode.FrenchPolynesia },
	{ desc: 'French Southern Territories (the)', code: CountryTypeCode.FrenchSouthernTerritories },
	{ desc: 'Gabon', code: CountryTypeCode.Gabon },
	{ desc: 'Gambia (the)', code: CountryTypeCode.Gambia },
	{ desc: 'Georgia', code: CountryTypeCode.Georgia },
	{ desc: 'Germany', code: CountryTypeCode.Germany },
	{ desc: 'Ghana', code: CountryTypeCode.Ghana },
	{ desc: 'Gibraltar', code: CountryTypeCode.Gibraltar },
	{ desc: 'Greece', code: CountryTypeCode.Greece },
	{ desc: 'Greenland', code: CountryTypeCode.Greenland },
	{ desc: 'Grenada', code: CountryTypeCode.Grenada },
	{ desc: 'Guadeloupe', code: CountryTypeCode.Guadeloupe },
	{ desc: 'Guam', code: CountryTypeCode.Guam },
	{ desc: 'Guatemala', code: CountryTypeCode.Guatemala },
	{ desc: 'Guernsey', code: CountryTypeCode.Guernsey },
	{ desc: 'Guinea', code: CountryTypeCode.Guinea },
	{ desc: 'Guinea-Bissau', code: CountryTypeCode.GuineaBissau },
	{ desc: 'Guyana', code: CountryTypeCode.Guyana },
	{ desc: 'Haiti', code: CountryTypeCode.Haiti },
	{ desc: 'Heard Island and McDonald Islands', code: CountryTypeCode.HeardIslandandMcDonaldIslands },
	{ desc: 'Holy See (the)', code: CountryTypeCode.HolySee },
	{ desc: 'Honduras', code: CountryTypeCode.Honduras },
	{ desc: 'Hong Kong', code: CountryTypeCode.HongKong },
	{ desc: 'Hungary', code: CountryTypeCode.Hungary },
	{ desc: 'Iceland', code: CountryTypeCode.Iceland },
	{ desc: 'India', code: CountryTypeCode.India },
	{ desc: 'Indonesia', code: CountryTypeCode.Indonesia },
	{ desc: 'Iran (Islamic Republic of)', code: CountryTypeCode.Iran },
	{ desc: 'Iraq', code: CountryTypeCode.Iraq },
	{ desc: 'Ireland', code: CountryTypeCode.Ireland },
	{ desc: 'Isle of Man', code: CountryTypeCode.IsleofMan },
	{ desc: 'Israel', code: CountryTypeCode.Israel },
	{ desc: 'Italy', code: CountryTypeCode.Italy },
	{ desc: 'Jamaica', code: CountryTypeCode.Jamaica },
	{ desc: 'Japan', code: CountryTypeCode.Japan },
	{ desc: 'Jersey', code: CountryTypeCode.Jersey },
	{ desc: 'Jordan', code: CountryTypeCode.Jordan },
	{ desc: 'Kazakhstan', code: CountryTypeCode.Kazakhstan },
	{ desc: 'Kenya', code: CountryTypeCode.Kenya },
	{ desc: 'Kiribati', code: CountryTypeCode.Kiribati },
	{ desc: "Korea (the Democratic People's Republic of)", code: CountryTypeCode.DemocraticPeoplesRepublicofKorea },
	{ desc: 'Korea (the Republic of)', code: CountryTypeCode.RepublicofKorea },
	{ desc: 'Kuwait', code: CountryTypeCode.Kuwait },
	{ desc: 'Kyrgyzstan', code: CountryTypeCode.Kyrgyzstan },
	{ desc: "Lao People's Democratic Republic (the)", code: CountryTypeCode.LaoPeople },
	{ desc: 'Latvia', code: CountryTypeCode.Latvia },
	{ desc: 'Lebanon', code: CountryTypeCode.Lebanon },
	{ desc: 'Lesotho', code: CountryTypeCode.Lesotho },
	{ desc: 'Liberia', code: CountryTypeCode.Liberia },
	{ desc: 'Libya', code: CountryTypeCode.Libya },
	{ desc: 'Liechtenstein', code: CountryTypeCode.Liechtenstein },
	{ desc: 'Lithuania', code: CountryTypeCode.Lithuania },
	{ desc: 'Luxembourg', code: CountryTypeCode.Luxembourg },
	{ desc: 'Macao', code: CountryTypeCode.Macao },
	{ desc: 'Madagascar', code: CountryTypeCode.Madagascar },
	{ desc: 'Malawi', code: CountryTypeCode.Malawi },
	{ desc: 'Malaysia', code: CountryTypeCode.Malaysia },
	{ desc: 'Maldives', code: CountryTypeCode.Maldives },
	{ desc: 'Mali', code: CountryTypeCode.Mali },
	{ desc: 'Malta', code: CountryTypeCode.Malta },
	{ desc: 'Marshall Islands (the)', code: CountryTypeCode.MarshallIslands },
	{ desc: 'Martinique', code: CountryTypeCode.Martinique },
	{ desc: 'Mauritania', code: CountryTypeCode.Mauritania },
	{ desc: 'Mauritius', code: CountryTypeCode.Mauritius },
	{ desc: 'Mayotte', code: CountryTypeCode.Mayotte },
	{ desc: 'Mexico', code: CountryTypeCode.Mexico },
	{ desc: 'Micronesia (Federated States of)', code: CountryTypeCode.Micronesia },
	{ desc: 'Moldova (the Republic of)', code: CountryTypeCode.Moldova },
	{ desc: 'Monaco', code: CountryTypeCode.Monaco },
	{ desc: 'Mongolia', code: CountryTypeCode.Mongolia },
	{ desc: 'Montenegro', code: CountryTypeCode.Montenegro },
	{ desc: 'Montserrat', code: CountryTypeCode.Montserrat },
	{ desc: 'Morocco', code: CountryTypeCode.Morocco },
	{ desc: 'Mozambique', code: CountryTypeCode.Mozambique },
	{ desc: 'Myanmar', code: CountryTypeCode.Myanmar },
	{ desc: 'Namibia', code: CountryTypeCode.Namibia },
	{ desc: 'Nauru', code: CountryTypeCode.Nauru },
	{ desc: 'Nepal', code: CountryTypeCode.Nepal },
	{ desc: 'Netherlands (the)', code: CountryTypeCode.Netherlands },
	{ desc: 'New Caledonia', code: CountryTypeCode.NewCaledonia },
	{ desc: 'New Zealand', code: CountryTypeCode.NewZealand },
	{ desc: 'Nicaragua', code: CountryTypeCode.Nicaragua },
	{ desc: 'Niger (the)', code: CountryTypeCode.Niger },
	{ desc: 'Nigeria', code: CountryTypeCode.Nigeria },
	{ desc: 'Niue', code: CountryTypeCode.Niue },
	{ desc: 'Norfolk Island', code: CountryTypeCode.NorfolkIsland },
	{ desc: 'North Macedonia', code: CountryTypeCode.NorthMacedonia },
	{ desc: 'Northern Mariana Islands (the)', code: CountryTypeCode.NorthernMarianaIslands },
	{ desc: 'Norway', code: CountryTypeCode.Norway },
	{ desc: 'Oman', code: CountryTypeCode.Oman },
	{ desc: 'Pakistan', code: CountryTypeCode.Pakistan },
	{ desc: 'Palau', code: CountryTypeCode.Palau },
	{ desc: 'Palestine, State of', code: CountryTypeCode.Palestine },
	{ desc: 'Panama', code: CountryTypeCode.Panama },
	{ desc: 'Papua New Guinea', code: CountryTypeCode.PapuaNewGuinea },
	{ desc: 'Paraguay', code: CountryTypeCode.Paraguay },
	{ desc: 'Peru', code: CountryTypeCode.Peru },
	{ desc: 'Philippines (the)', code: CountryTypeCode.Philippines },
	{ desc: 'Pitcairn', code: CountryTypeCode.Pitcairn },
	{ desc: 'Poland', code: CountryTypeCode.Poland },
	{ desc: 'Portugal', code: CountryTypeCode.Portugal },
	{ desc: 'Puerto Rico', code: CountryTypeCode.PuertoRico },
	{ desc: 'Qatar', code: CountryTypeCode.Qatar },
	{ desc: 'Réunion', code: CountryTypeCode.Réunion },
	{ desc: 'Romania', code: CountryTypeCode.Romania },
	{ desc: 'Russian Federation (the)', code: CountryTypeCode.RussianFederation },
	{ desc: 'Rwanda', code: CountryTypeCode.Rwanda },
	{ desc: 'Saint Barthélemy', code: CountryTypeCode.SaintBarthélemy },
	{ desc: 'Saint Helena, Ascension and Tristan da Cunha', code: CountryTypeCode.SaintHelena },
	{ desc: 'Saint Kitts and Nevis', code: CountryTypeCode.SaintKittsandNevis },
	{ desc: 'Saint Lucia', code: CountryTypeCode.SaintLucia },
	{ desc: 'Saint Martin (French part)', code: CountryTypeCode.SaintMartin },
	{ desc: 'Saint Pierre and Miquelon', code: CountryTypeCode.SaintPierreandMiquelon },
	{ desc: 'Saint Vincent and the Grenadines', code: CountryTypeCode.SaintVincentandtheGrenadines },
	{ desc: 'Samoa', code: CountryTypeCode.Samoa },
	{ desc: 'San Marino', code: CountryTypeCode.SanMarino },
	{ desc: 'Sao Tome and Principe', code: CountryTypeCode.SaoTomeandPrincipe },
	{ desc: 'Saudi Arabia', code: CountryTypeCode.SaudiArabia },
	{ desc: 'Senegal', code: CountryTypeCode.Senegal },
	{ desc: 'Serbia', code: CountryTypeCode.Serbia },
	{ desc: 'Seychelles', code: CountryTypeCode.Seychelles },
	{ desc: 'Sierra Leone', code: CountryTypeCode.SierraLeone },
	{ desc: 'Singapore', code: CountryTypeCode.Singapore },
	{ desc: 'Sint Maarten (Dutch part)', code: CountryTypeCode.SintMaarten },
	{ desc: 'Slovakia', code: CountryTypeCode.Slovakia },
	{ desc: 'Slovenia', code: CountryTypeCode.Slovenia },
	{ desc: 'Solomon Islands', code: CountryTypeCode.SolomonIslands },
	{ desc: 'Somalia', code: CountryTypeCode.Somalia },
	{ desc: 'South Africa', code: CountryTypeCode.SouthAfrica },
	{
		desc: 'South Georgia and the South Sandwich Islands',
		code: CountryTypeCode.SouthGeorgiaandtheSouthSandwichIslands,
	},
	{ desc: 'South Sudan', code: CountryTypeCode.SouthSudan },
	{ desc: 'Spain', code: CountryTypeCode.Spain },
	{ desc: 'Sri Lanka', code: CountryTypeCode.SriLanka },
	{ desc: 'Sudan (the)', code: CountryTypeCode.Sudan },
	{ desc: 'Suriname', code: CountryTypeCode.Suriname },
	{ desc: 'Svalbard and Jan Mayen', code: CountryTypeCode.SvalbardandJanMayen },
	{ desc: 'Sweden', code: CountryTypeCode.Sweden },
	{ desc: 'Switzerland', code: CountryTypeCode.Switzerland },
	{ desc: 'Syrian Arab Republic (the)', code: CountryTypeCode.SyrianArabRepublic },
	{ desc: 'Taiwan (Province of China)', code: CountryTypeCode.Taiwan },
	{ desc: 'Tajikistan', code: CountryTypeCode.Tajikistan },
	{ desc: 'Tanzania, the United Republic of', code: CountryTypeCode.Tanzania },
	{ desc: 'Thailand', code: CountryTypeCode.Thailand },
	{ desc: 'Timor-Leste', code: CountryTypeCode.TimorLeste },
	{ desc: 'Togo', code: CountryTypeCode.Togo },
	{ desc: 'Tokelau', code: CountryTypeCode.Tokelau },
	{ desc: 'Tonga', code: CountryTypeCode.Tonga },
	{ desc: 'Trinidad and Tobago', code: CountryTypeCode.TrinidadandTobago },
	{ desc: 'Tunisia', code: CountryTypeCode.Tunisia },
	{ desc: 'Türkiye', code: CountryTypeCode.Türkiye },
	{ desc: 'Turkmenistan', code: CountryTypeCode.Turkmenistan },
	{ desc: 'Turks and Caicos Islands (the)', code: CountryTypeCode.TurksandCaicosIslands },
	{ desc: 'Tuvalu', code: CountryTypeCode.Tuvalu },
	{ desc: 'Uganda', code: CountryTypeCode.Uganda },
	{ desc: 'Ukraine', code: CountryTypeCode.Ukraine },
	{ desc: 'United Arab Emirates (the)', code: CountryTypeCode.UnitedArabEmirates },
	{
		desc: 'United Kingdom of Great Britain and Northern Ireland (the)',
		code: CountryTypeCode.UnitedKingdomofGreatBritainandNorthernIreland,
	},
	{ desc: 'United States Minor Outlying Islands (the)', code: CountryTypeCode.UnitedStatesMinorOutlyingIslands },
	{ desc: 'Uruguay', code: CountryTypeCode.Uruguay },
	{ desc: 'Uzbekistan', code: CountryTypeCode.Uzbekistan },
	{ desc: 'Vanuatu', code: CountryTypeCode.Vanuatu },
	{ desc: 'Venezuela (Bolivarian Republic of)', code: CountryTypeCode.Venezuela },
	{ desc: 'Viet Nam', code: CountryTypeCode.VietNam },
	{ desc: 'Virgin Islands (British)', code: CountryTypeCode.BritishVirginIslands },
	{ desc: 'Virgin Islands (U.S.)', code: CountryTypeCode.USVirginIslands },
	{ desc: 'Wallis and Futuna', code: CountryTypeCode.WallisandFutuna },
	{ desc: 'Western Sahara*', code: CountryTypeCode.WesternSahara },
	{ desc: 'Yemen', code: CountryTypeCode.Yemen },
	{ desc: 'Zambia', code: CountryTypeCode.Zambia },
	{ desc: 'Zimbabwe', code: CountryTypeCode.Zimbabwe },
];
