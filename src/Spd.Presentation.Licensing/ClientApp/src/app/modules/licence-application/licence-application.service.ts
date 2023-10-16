import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { BooleanTypeCode, GenderCode } from 'src/app/api/models';
import {
	DogDocumentCode,
	EyeColourCode,
	GovernmentIssuedPhotoIdCode,
	HairColourCode,
	HeightUnitCode,
	PoliceOfficerRoleCode,
	ProofOfAbilityToWorkInCanadaCode,
	ProofOfCanadianCitizenshipCode,
	RestraintDocumentCode,
	SelectOptions,
	SwlApplicationTypeCode,
	SwlCategoryTypeCode,
	SwlTermCode,
	SwlTypeCode,
	WeightUnitCode,
} from 'src/app/core/code-types/model-desc.models';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';

export interface LicenceFormStepComponent {
	getDataToSave(): any;
	// clearCurrentData(): void;
	isFormValid(): boolean;
}

export class LicenceBackendModel {
	isNewOrExpired?: boolean = true;
	isReplacement?: boolean = false;
	isNotReplacement?: boolean = true;
	showStepAccessCode?: boolean = false;
	showStepSoleProprietor?: boolean = true;
	showStepLicenceExpired?: boolean = true;
	showStepDogsAndRestraints?: boolean = true;
	showStepPoliceBackground?: boolean = true;
	showStepMentalHealth?: boolean = true;
	showStepCriminalHistory?: boolean = true;
	showStepFingerprints?: boolean = true;
	showStepBackgroundInfo?: boolean = true;

	licenceTypeCode: SwlTypeCode | null = null;
	applicationTypeCode: SwlApplicationTypeCode | null = null;
	isSoleProprietor: BooleanTypeCode | null = null;
	currentLicenceNumber: string | null = null;
	accessCode: string | null = null;
	oneLegalName: boolean | null = null;
	givenName: string | null = null;
	middleName1: string | null = null;
	middleName2: string | null = null;
	surname: string | null = null;
	genderCode: GenderCode | null = null;
	dateOfBirth: string | null = null;
	hasExpiredLicence: BooleanTypeCode | null = null;
	expiredLicenceNumber?: string | null = null;
	expiryDate?: string | null = null;
	swlCategoryList: SelectOptions[] = [];
	licenceCategoryArmouredCarGuard?: {
		documentExpiryDate?: string | null;
		attachments?: Array<File>;
	};
	licenceCategoryBodyArmourSales?: {};
	licenceCategoryyClosedCircuitTelevisionInstaller?: {};
	licenceCategoryElectronicLockingDeviceInstaller?: {};
	licenceCategoryFireInvestigator?: {
		fireinvestigatorcertificateattachments?: Array<File>;
		fireinvestigatorletterattachments?: Array<File>;
	};
	licenceCategoryLocksmithUnderSupervision?: {};
	licenceCategoryLocksmith?: {
		requirement?: string | null;
		attachments?: Array<File>;
	};
	licenceCategoryPrivateInvestigatorUnderSupervision?: {
		requirement?: string | null;
		// documentExpiryDate?: string | null;
		attachments?: Array<File>;
		trainingattachments?: Array<File>;
	};
	licenceCategoryPrivateInvestigator?: {
		requirement?: string | null;
		training?: string | null;
		// documentExpiryDate?: string | null;
		attachments?: Array<File>;
		trainingattachments?: Array<File>;
		fireinvestigatorcertificateattachments?: Array<File>;
		fireinvestigatorletterattachments?: Array<File>;
		addFireInvestigator?: BooleanTypeCode | null;
	};
	licenceCategorySecurityAlarmInstallerUnderSupervision?: {};
	licenceCategorySecurityAlarmInstaller?: {
		requirement?: string | null;
		attachments?: Array<File>;
	};
	licenceCategorySecurityAlarmMonitor?: {};
	licenceCategorySecurityAlarmResponse?: {};
	licenceCategorySecurityAlarmSales?: {};
	licenceCategorySecurityConsultant?: {
		requirement?: string | null;
		attachments?: Array<File>;
		resumeattachments?: Array<File>;
	};
	licenceCategorySecurityGuardUnderSupervision?: {};
	licenceCategorySecurityGuard?: {
		requirement?: string | null;
		attachments?: Array<File>;
	};
	useDogsOrRestraints: string | null = null;
	isDogsPurposeProtection?: boolean | null = false;
	isDogsPurposeDetectionDrugs?: boolean | null = false;
	isDogsPurposeDetectionExplosives?: boolean | null = false;
	dogsPurposeDocumentType?: DogDocumentCode | null = null;
	dogsPurposeAttachments?: Array<File> = [];
	carryAndUseRetraints?: boolean | null = false;
	carryAndUseRetraintsDocument?: RestraintDocumentCode | null = null;
	carryAndUseRetraintsAttachments?: Array<File> = [];
	licenceTermCode: SwlTermCode | null = null;
	isViewOnlyPoliceOrPeaceOfficer?: boolean = false;
	isPoliceOrPeaceOfficer: BooleanTypeCode | null = null;
	officerRole?: string | null = null;
	otherOfficerRole?: string | null = null;
	letterOfNoConflictAttachments?: Array<File> = [];
	isTreatedForMHC: BooleanTypeCode | null = null;
	mentalHealthConditionAttachments?: Array<File> = [];
	hasCriminalHistory: BooleanTypeCode | null = null;
	proofOfFingerprintAttachments?: Array<File> = [];
	previousNameFlag: BooleanTypeCode | null = null;
	aliases?: Array<AliasModel> | null = null;
	isBornInCanada: BooleanTypeCode | null = null;
	proofOfCitizenship: ProofOfCanadianCitizenshipCode | null = null;
	proofOfAbility: ProofOfAbilityToWorkInCanadaCode | null = null;
	citizenshipDocumentExpiryDate?: string | null = null;
	citizenshipDocumentPhotoAttachments?: Array<File> = [];
	governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode | null = null;
	governmentIssuedPhotoExpiryDate?: string | null = null;
	governmentIssuedPhotoAttachments?: Array<File> = [];
	hasBcDriversLicence: BooleanTypeCode | null = null;
	bcDriversLicenceNumber?: string | null = null;
	hairColourCode: HairColourCode | null = null;
	eyeColourCode: EyeColourCode | null = null;
	height: string | null = null;
	heightUnitCode: HeightUnitCode | null = null;
	weight: string | null = null;
	weightUnitCode: WeightUnitCode | null = null;
	useBcServicesCardPhoto: BooleanTypeCode | null = null;
	photoOfYourselfAttachments?: Array<File> = [];
	contactEmailAddress?: string | null = null;
	contactPhoneNumber?: string | null = null;
	residentialAddressLine1?: string | null = null;
	residentialAddressLine2?: string | null = null;
	residentialCity?: string | null = null;
	residentialPostalCode?: string | null = null;
	residentialProvince?: string | null = null;
	residentialCountry?: string | null = null;
	isMailingTheSameAsResidential?: boolean | null = null;
	mailingAddressLine1?: string | null = null;
	mailingAddressLine2?: string | null = null;
	mailingCity?: string | null = null;
	mailingPostalCode?: string | null = null;
	mailingProvince?: string | null = null;
	mailingCountry?: string | null = null;
}

export class AliasModel {
	constructor(
		givenName: string | null,
		middleName1: string | null,
		middleName2: string | null,
		surname: string | null
	) {
		this.givenName = givenName;
		this.middleName1 = middleName1;
		this.middleName2 = middleName2;
		this.surname = surname;
	}
	givenName: string | null = null;
	middleName1: string | null = null;
	middleName2: string | null = null;
	surname: string | null = null;
}

export class LicenceModelSubject {
	isLoaded?: boolean = false;
	isSetFlags?: boolean = false;
	isUpdated?: boolean = false;
	isCategoryLoaded?: boolean = false;
}

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService {
	initialized = false;
	booleanTypeCodes = BooleanTypeCode;

	licenceModelLoaded$: BehaviorSubject<LicenceModelSubject> = new BehaviorSubject<LicenceModelSubject>(
		new LicenceModelSubject()
	);

	licenceTypeFormGroup: FormGroup = this.formBuilder.group({
		licenceTypeCode: new FormControl('', [Validators.required]),
	});

	applicationTypeFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeCode: new FormControl('', [Validators.required]),
	});

	personalInformationFormGroup = this.formBuilder.group(
		{
			oneLegalName: new FormControl(false),
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			genderCode: new FormControl(''),
			dateOfBirth: new FormControl('', [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'givenName',
					(form) => form.get('oneLegalName')?.value != true
				),
			],
		}
	);

	soleProprietorFormGroup = this.formBuilder.group({
		isSoleProprietor: new FormControl('', [FormControlValidators.required]),
	});

	expiredLicenceFormGroup = this.formBuilder.group(
		{
			hasExpiredLicence: new FormControl('', [FormControlValidators.required]),
			expiredLicenceNumber: new FormControl(),
			expiryDate: new FormControl(),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'expiredLicenceNumber',
					(form) =>
						form.get('showStepLicenceExpired')?.value &&
						form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) =>
						form.get('showStepLicenceExpired')?.value &&
						form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

	licenceTermFormGroup: FormGroup = this.formBuilder.group({
		licenceTermCode: new FormControl('', [FormControlValidators.required]),
	});

	aliasesFormGroup: FormGroup = this.formBuilder.group({
		previousNameFlag: new FormControl(null, [FormControlValidators.required]),
		aliases: this.formBuilder.array([]),
	});

	aliasRowForm = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName1: new FormControl(''),
		middleName2: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
	});

	categoriesFormGroup: FormGroup = this.formBuilder.group({
		categories: this.formBuilder.array([]),
	});

	categoryRowForm = this.formBuilder.group({
		desc: new FormControl(''),
		code: new FormControl(''),
	});

	categorySecurityGuardFormGroup: FormGroup = this.formBuilder.group({
		requirement: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl('', [Validators.required]),
	});
	categoryArmouredCarGuardFormGroup: FormGroup = this.formBuilder.group({
		documentExpiryDate: new FormControl('', [Validators.required]),
		attachments: new FormControl('', [Validators.required]),
	});
	categoryFireInvestigatorFormGroup: FormGroup = this.formBuilder.group({
		fireinvestigatorcertificateattachments: new FormControl('', [Validators.required]),
		fireinvestigatorletterattachments: new FormControl('', [Validators.required]),
	});
	categoryLocksmithFormGroup: FormGroup = this.formBuilder.group({
		requirement: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl('', [Validators.required]),
	});
	categoryPrivateInvestigatorUnderSupervisionFormGroup: FormGroup = this.formBuilder.group({
		requirement: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl('', [Validators.required]),
		trainingattachments: new FormControl('', [Validators.required]),
	});
	categoryPrivateInvestigatorFormGroup: FormGroup = this.formBuilder.group({
		requirement: new FormControl('', [FormControlValidators.required]),
		training: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl('', [Validators.required]),
		trainingattachments: new FormControl('', [Validators.required]),
		fireinvestigatorcertificateattachments: new FormControl(''),
		fireinvestigatorletterattachments: new FormControl(''),
		addFireInvestigator: new FormControl(''),
	});
	categorySecurityAlarmInstallerFormGroup: FormGroup = this.formBuilder.group({
		requirement: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl('', [Validators.required]),
	});
	categorySecurityConsultantFormGroup: FormGroup = this.formBuilder.group({
		requirement: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl('', [Validators.required]),
		resumeattachments: new FormControl('', [Validators.required]),
	});

	dogsOrRestraintsFormGroup: FormGroup = this.formBuilder.group(
		{
			useDogsOrRestraints: new FormControl('', [FormControlValidators.required]),
			carryAndUseRetraints: new FormControl(''),
			carryAndUseRetraintsDocument: new FormControl(''),
			carryAndUseRetraintsAttachments: new FormControl(''),
			dogPurposeFormGroup: new FormGroup(
				{
					isDogsPurposeProtection: new FormControl(false),
					isDogsPurposeDetectionDrugs: new FormControl(false),
					isDogsPurposeDetectionExplosives: new FormControl(false),
				},
				FormGroupValidators.atLeastOneCheckboxValidator('useDogsOrRestraints', BooleanTypeCode.Yes)
			),
			dogsPurposeDocumentType: new FormControl(''),
			dogsPurposeAttachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'carryAndUseRetraintsDocument',
					(form) =>
						form.get('useDogsOrRestraints')?.value == this.booleanTypeCodes.Yes &&
						form.get('carryAndUseRetraints')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'carryAndUseRetraintsAttachments',
					(form) =>
						form.get('useDogsOrRestraints')?.value == this.booleanTypeCodes.Yes &&
						form.get('carryAndUseRetraints')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator('dogsPurposeDocumentType', (form) => {
					const dogPurposeFormGroup = form.get('dogPurposeFormGroup') as FormGroup;
					return (
						form.get('useDogsOrRestraints')?.value == this.booleanTypeCodes.Yes &&
						((dogPurposeFormGroup.get('isDogsPurposeProtection') as FormControl).value ||
							(dogPurposeFormGroup.get('isDogsPurposeDetectionDrugs') as FormControl).value ||
							(dogPurposeFormGroup.get('isDogsPurposeDetectionExplosives') as FormControl).value)
					);
				}),
				FormGroupValidators.conditionalDefaultRequiredValidator('dogsPurposeAttachments', (form) => {
					const dogPurposeFormGroup = form.get('dogPurposeFormGroup') as FormGroup;
					return (
						form.get('useDogsOrRestraints')?.value == this.booleanTypeCodes.Yes &&
						((dogPurposeFormGroup.get('isDogsPurposeProtection') as FormControl).value ||
							(dogPurposeFormGroup.get('isDogsPurposeDetectionDrugs') as FormControl).value ||
							(dogPurposeFormGroup.get('isDogsPurposeDetectionExplosives') as FormControl).value)
					);
				}),
			],
		}
	);

	policeBackgroundFormGroup: FormGroup = this.formBuilder.group(
		{
			isPoliceOrPeaceOfficer: new FormControl('', [FormControlValidators.required]),
			officerRole: new FormControl(''),
			otherOfficerRole: new FormControl(''),
			letterOfNoConflictAttachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'officerRole',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'otherOfficerRole',
					(form) => form.get('officerRole')?.value == PoliceOfficerRoleCode.Other
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'letterOfNoConflictAttachments',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	mentalHealthConditionsFormGroup: FormGroup = this.formBuilder.group(
		{
			isTreatedForMHC: new FormControl('', [FormControlValidators.required]),
			mentalHealthConditionAttachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'mentalHealthConditionAttachments',
					(form) => form.get('isTreatedForMHC')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	criminalHistoryFormGroup: FormGroup = this.formBuilder.group({
		hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
	});

	proofOfFingerprintFormGroup: FormGroup = this.formBuilder.group({
		proofOfFingerprintAttachments: new FormControl('', [Validators.required]),
	});

	citizenshipFormGroup: FormGroup = this.formBuilder.group(
		{
			isBornInCanada: new FormControl(null, [FormControlValidators.required]),
			proofOfCitizenship: new FormControl(),
			proofOfAbility: new FormControl(),
			citizenshipDocumentExpiryDate: new FormControl(),
			citizenshipDocumentPhotoAttachments: new FormControl(null, [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'proofOfCitizenship',
					(form) => form.get('isBornInCanada')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'proofOfAbility',
					(form) => form.get('isBornInCanada')?.value == this.booleanTypeCodes.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'citizenshipDocumentExpiryDate',
					(form) =>
						form.get('proofOfAbility')?.value == ProofOfAbilityToWorkInCanadaCode.WorkPermit ||
						form.get('proofOfAbility')?.value == ProofOfAbilityToWorkInCanadaCode.StudyPermit
				),
			],
		}
	);

	govIssuedIdFormGroup: FormGroup = this.formBuilder.group({
		governmentIssuedPhotoTypeCode: new FormControl(null, [FormControlValidators.required]),
		governmentIssuedPhotoExpiryDate: new FormControl(),
		governmentIssuedPhotoAttachments: new FormControl(null, [Validators.required]),
	});

	bcDriversLicenceFormGroup: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl(null, [FormControlValidators.required]),
		bcDriversLicenceNumber: new FormControl(),
	});

	characteristicsFormGroup: FormGroup = this.formBuilder.group({
		hairColourCode: new FormControl(null, [FormControlValidators.required]),
		eyeColourCode: new FormControl(null, [FormControlValidators.required]),
		height: new FormControl(null, [FormControlValidators.required]),
		heightUnitCode: new FormControl(null, [FormControlValidators.required]),
		weight: new FormControl(null, [FormControlValidators.required]),
		weightUnitCode: new FormControl(null, [FormControlValidators.required]),
	});

	photographOfYourselfFormGroup: FormGroup = this.formBuilder.group(
		{
			useBcServicesCardPhoto: new FormControl(null, [FormControlValidators.required]),
			photoOfYourselfAttachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'photoOfYourselfAttachments',
					(form) => form.get('useBcServicesCardPhoto')?.value == this.booleanTypeCodes.No
				),
			],
		}
	);

	contactInformationFormGroup: FormGroup = this.formBuilder.group({
		contactEmailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
	});

	residentialAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		residentialAddressLine1: new FormControl('', [FormControlValidators.required]),
		residentialAddressLine2: new FormControl(''),
		residentialCity: new FormControl('', [FormControlValidators.required]),
		residentialPostalCode: new FormControl('', [FormControlValidators.required]),
		residentialProvince: new FormControl('', [FormControlValidators.required]),
		residentialCountry: new FormControl('', [FormControlValidators.required]),
		isMailingTheSameAsResidential: new FormControl(),
	});

	mailingAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		mailingAddressLine1: new FormControl('', [FormControlValidators.required]),
		mailingAddressLine2: new FormControl(''),
		mailingCity: new FormControl('', [FormControlValidators.required]),
		mailingPostalCode: new FormControl('', [FormControlValidators.required]),
		mailingProvince: new FormControl('', [FormControlValidators.required]),
		mailingCountry: new FormControl('', [FormControlValidators.required]),
	});

	licenceModelFormGroup: FormGroup = this.formBuilder.group(
		{
			// showStepAccessCode: new FormControl(false),
			// showStepSoleProprietor: new FormControl(true),
			// showStepLicenceExpired: new FormControl(true),
			// showStepDogsAndRestraints: new FormControl(true),
			// showStepPoliceBackground: new FormControl(true),
			// showStepMentalHealth: new FormControl(true),
			// showStepCriminalHistory: new FormControl(true),
			// showStepFingerprints: new FormControl(true),

			// licenceTypeCode: new FormControl('', [Validators.required]),
			// applicationTypeCode: new FormControl('', [Validators.required]),

			// aliasFormGroup: this.aliasFormGroup,
			soleProprietorFormGroup: this.soleProprietorFormGroup,
			licenceTypeFormGroup: this.licenceTypeFormGroup,
			applicationTypeFormGroup: this.applicationTypeFormGroup,
			personalInformationFormGroup: this.personalInformationFormGroup,
			expiredLicenceFormGroup: this.expiredLicenceFormGroup,
			licenceTermFormGroup: this.licenceTermFormGroup,
			dogsOrRestraintsFormGroup: this.dogsOrRestraintsFormGroup,
			policeBackgroundFormGroup: this.policeBackgroundFormGroup,
			mentalHealthConditionsFormGroup: this.mentalHealthConditionsFormGroup,
			criminalHistoryFormGroup: this.criminalHistoryFormGroup,
			proofOfFingerprintFormGroup: this.proofOfFingerprintFormGroup,
			categoriesFormGroup: this.categoriesFormGroup,
			categorySecurityGuardFormGroup: this.categorySecurityGuardFormGroup,
			categoryArmouredCarGuardFormGroup: this.categoryArmouredCarGuardFormGroup,
			categoryFireInvestigatorFormGroup: this.categoryFireInvestigatorFormGroup,
			categoryLocksmithFormGroup: this.categoryLocksmithFormGroup,
			categoryPrivateInvestigatorUnderSupervisionFormGroup: this.categoryPrivateInvestigatorUnderSupervisionFormGroup,
			categoryPrivateInvestigatorFormGroup: this.categoryPrivateInvestigatorFormGroup,
			categorySecurityAlarmInstallerFormGroup: this.categorySecurityAlarmInstallerFormGroup,
			categorySecurityConsultantFormGroup: this.categorySecurityConsultantFormGroup,
			aliasesFormGroup: this.aliasesFormGroup,
			citizenshipFormGroup: this.citizenshipFormGroup,
			govIssuedIdFormGroup: this.govIssuedIdFormGroup,
			bcDriversLicenceFormGroup: this.bcDriversLicenceFormGroup,
			characteristicsFormGroup: this.characteristicsFormGroup,
			photographOfYourselfFormGroup: this.photographOfYourselfFormGroup,
			contactInformationFormGroup: this.contactInformationFormGroup,
			residentialAddressFormGroup: this.residentialAddressFormGroup,
			mailingAddressFormGroup: this.mailingAddressFormGroup,

			// isSoleProprietor: new FormControl('', [FormControlValidators.required]),
			// oneLegalName: new FormControl(false),
			// givenName: new FormControl(''),
			// middleName1: new FormControl(''),
			// middleName2: new FormControl(''),
			// surname: new FormControl('', [FormControlValidators.required]),
			// genderCode: new FormControl(''),
			// dateOfBirth: new FormControl('', [Validators.required]),
			// hasExpiredLicence: new FormControl('', [FormControlValidators.required]),
			// expiredLicenceNumber: new FormControl(),
			// expiryDate: new FormControl(),
			// useDogsOrRestraints: new FormControl(''),
			// carryAndUseRetraints: new FormControl(''),
			// carryAndUseRetraintsDocument: new FormControl(''),
			// carryAndUseRetraintsAttachments: new FormControl(''),
			// dogPurposeFormGroup: new FormGroup(
			// 	{
			// 		isDogsPurposeProtection: new FormControl(false),
			// 		isDogsPurposeDetectionDrugs: new FormControl(false),
			// 		isDogsPurposeDetectionExplosives: new FormControl(false),
			// 	},
			// 	FormGroupValidators.atLeastOneCheckboxValidator('useDogsOrRestraints', BooleanTypeCode.Yes)
			// ),
			// dogsPurposeDocumentType: new FormControl(''),
			// dogsPurposeAttachments: new FormControl(''),
			// licenceTermCode: new FormControl('', [FormControlValidators.required]),
			// isPoliceOrPeaceOfficer: new FormControl('', [FormControlValidators.required]),
			// officerRole: new FormControl(''),
			// otherOfficerRole: new FormControl(''),
			// letterOfNoConflictAttachments: new FormControl(''),
			// isTreatedForMHC: new FormControl('', [FormControlValidators.required]),
			// mentalHealthConditionAttachments: new FormControl(''),
			// hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
			// proofOfFingerprintAttachments: new FormControl(null, [Validators.required]),
			// previousNameFlag: new FormControl(null, [FormControlValidators.required]),
			// aliases: this.formBuilder.array([]),
			// isBornInCanada: new FormControl(null, [FormControlValidators.required]),
			// proofOfCitizenship: new FormControl(),
			// proofOfAbility: new FormControl(),
			// citizenshipDocumentExpiryDate: new FormControl(),
			// citizenshipDocumentPhotoAttachments: new FormControl(null, [Validators.required]),
			// governmentIssuedPhotoTypeCode: new FormControl(null, [FormControlValidators.required]),
			// governmentIssuedPhotoExpiryDate: new FormControl(),
			// governmentIssuedPhotoAttachments: new FormControl(null, [Validators.required]),
			// hasBcDriversLicence: new FormControl(null, [FormControlValidators.required]),
			// bcDriversLicenceNumber: new FormControl(),
			// hairColourCode: new FormControl(null, [FormControlValidators.required]),
			// eyeColourCode: new FormControl(null, [FormControlValidators.required]),
			// height: new FormControl(null, [FormControlValidators.required]),
			// heightUnitCode: new FormControl(null, [FormControlValidators.required]),
			// weight: new FormControl(null, [FormControlValidators.required]),
			// weightUnitCode: new FormControl(null, [FormControlValidators.required]),
			// useBcServicesCardPhoto: new FormControl(null, [FormControlValidators.required]),
			// photoOfYourselfAttachments: new FormControl(''),
			// addressSelected: new FormControl(false, [Validators.requiredTrue]),
			// residentialAddressLine1: new FormControl('', [FormControlValidators.required]),
			// residentialAddressLine2: new FormControl(''),
			// residentialCity: new FormControl('', [FormControlValidators.required]),
			// residentialPostalCode: new FormControl('', [FormControlValidators.required]),
			// residentialProvince: new FormControl('', [FormControlValidators.required]),
			// residentialCountry: new FormControl('', [FormControlValidators.required]),
			// isMailingTheSameAsResidential: new FormControl(),
		},
		{
			validators: [
				// FormGroupValidators.conditionalRequiredValidator(
				// 	'givenName',
				// 	(form) => form.get('oneLegalName')?.value != true
				// ),
				// FormGroupValidators.conditionalRequiredValidator(
				// 	'expiredLicenceNumber',
				// 	(form) =>
				// 		form.get('showStepLicenceExpired')?.value &&
				// 		form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				// ),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'expiryDate',
				// 	(form) =>
				// 		form.get('showStepLicenceExpired')?.value &&
				// 		form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				// ),
				// FormGroupValidators.conditionalRequiredValidator(
				// 	'useDogsOrRestraints',
				// 	(form) =>
				// 		form.get('showStepDogsAndRestraints')?.value &&
				// 		form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				// ),
				// FormGroupValidators.conditionalRequiredValidator(
				// 	'officerRole',
				// 	(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				// ),
				// FormGroupValidators.conditionalRequiredValidator(
				// 	'otherOfficerRole',
				// 	(form) => form.get('officerRole')?.value == PoliceOfficerRoleCode.Other
				// ),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'letterOfNoConflictAttachments',
				// 	(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				// ),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'mentalHealthConditionAttachments',
				// 	(form) => form.get('isTreatedForMHC')?.value == BooleanTypeCode.Yes
				// ),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'proofOfCitizenship',
				// 	(form) => form.get('isBornInCanada')?.value == this.booleanTypeCodes.Yes
				// ),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'proofOfAbility',
				// 	(form) => form.get('isBornInCanada')?.value == this.booleanTypeCodes.No
				// ),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'citizenshipDocumentExpiryDate',
				// 	(form) =>
				// 		form.get('proofOfAbility')?.value == ProofOfAbilityToWorkInCanadaCode.WorkPermit ||
				// 		form.get('proofOfAbility')?.value == ProofOfAbilityToWorkInCanadaCode.StudyPermit
				// ),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'photoOfYourselfAttachments',
				// 	(form) => form.get('useBcServicesCardPhoto')?.value == this.booleanTypeCodes.No
				// ),
			],
		}
	);

	// licenceModel: LicenceModel = new LicenceModel();

	constructor(
		private formBuilder: FormBuilder,
		private hotToastService: HotToastService,
		private utilService: UtilService,
		private spinnerService: NgxSpinnerService
	) {}

	/*
		swlCategoryList: [
					{ desc: 'Armoured Car Guard', code: SwlCategoryTypeCode.ArmouredCarGuard },
					{ desc: 'Body Armour Sales', code: SwlCategoryTypeCode.BodyArmourSales },
					{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
					{ desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
					{ desc: 'Fire Investigator', code: SwlCategoryTypeCode.FireInvestigator },
					{ desc: 'Locksmith', code: SwlCategoryTypeCode.Locksmith },
					{ desc: 'Locksmith - Under Supervision', code: SwlCategoryTypeCode.LocksmithUnderSupervision },
					{ desc: 'Private Investigator', code: SwlCategoryTypeCode.PrivateInvestigator },
					{
						desc: 'Private Investigator - Under Supervision',
						code: SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision,
					},
					{ desc: 'Security Alarm Installer', code: SwlCategoryTypeCode.SecurityAlarmInstaller },
					{
						desc: 'Security Alarm Installer - Under Supervision',
						code: SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
					},
					{ desc: 'Security Alarm Monitor', code: SwlCategoryTypeCode.SecurityAlarmMonitor },
					{ desc: 'Security Alarm Response', code: SwlCategoryTypeCode.SecurityAlarmResponse },
					{ desc: 'Security Alarm Sales', code: SwlCategoryTypeCode.SecurityAlarmSales },
					{ desc: 'Security Consultant', code: SwlCategoryTypeCode.SecurityConsultant },
					{ desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },
					{ desc: 'Security Guard - Under Supervision', code: SwlCategoryTypeCode.SecurityGuardUnderSupervision },
				],
				*/

	reset(): void {
		this.initialized = false;
		// this.licenceModel = new LicenceModel();
		this.licenceModelFormGroup.reset();
	}

	createNewLicence(): Observable<any> {
		console.log('createNewLicence ');
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				this.licenceModelFormGroup.reset();
				// this.licenceModel = new LicenceModel();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(this.licenceModelFormGroup.value);
			}, 1000);
		});
	}

	loadLicenceNew(): Observable<any> {
		console.log('loadLicenceNew ');
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myBlob = new Blob();
				const myFile = this.utilService.blobToFile(myBlob, 'test.doc');

				const defaults: any = {
					licenceTypeFormGroup: {
						licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
					},
					applicationTypeFormGroup: {
						applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
					},
					soleProprietorFormGroup: {
						isSoleProprietor: BooleanTypeCode.Yes,
					},
					personalInformationFormGroup: {
						oneLegalName: false,
						givenName: 'John',
						middleName1: 'Michael',
						middleName2: 'Adam',
						surname: 'Johnson',
						genderCode: GenderCode.M,
						dateOfBirth: '2009-10-07T00:00:00+00:00',
					},
					expiredLicenceFormGroup: {
						hasExpiredLicence: BooleanTypeCode.Yes,
						expiredLicenceNumber: '789',
						expiryDate: '2002-02-07T00:00:00+00:00',
					},
					dogsOrRestraintsFormGroup: {
						useDogsOrRestraints: BooleanTypeCode.Yes,
						dogPurposeFormGroup: {
							isDogsPurposeProtection: true,
							isDogsPurposeDetectionDrugs: false,
							isDogsPurposeDetectionExplosives: true,
						},
						dogsPurposeDocumentType: DogDocumentCode.CertificateOfAdvancedSecurityTraining,
						dogsPurposeAttachments: [myFile],
						carryAndUseRetraints: true,
						carryAndUseRetraintsDocument: RestraintDocumentCode.AdvancedSecurityTrainingCertificate,
						carryAndUseRetraintsAttachments: [myFile],
					},
					licenceTermFormGroup: {
						licenceTermCode: SwlTermCode.ThreeYears,
					},
					// currentLicenceNumber: '123456',
					// accessCode: '456',
					policeBackgroundFormGroup: {
						isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
						officerRole: PoliceOfficerRoleCode.Other,
						otherOfficerRole: 'testRole',
						letterOfNoConflictAttachments: [myFile],
					},
					mentalHealthConditionsFormGroup: {
						isTreatedForMHC: BooleanTypeCode.Yes,
						mentalHealthConditionAttachments: [myFile],
					},
					criminalHistoryFormGroup: {
						hasCriminalHistory: BooleanTypeCode.No,
					},
					proofOfFingerprintFormGroup: {
						proofOfFingerprintAttachments: [myFile],
					},
					aliasesFormGroup: {
						previousNameFlag: BooleanTypeCode.Yes,
						aliases: [
							{ givenName: 'Abby', middleName1: 'Betty', middleName2: 'Meg', surname: 'Brown' },
							{ givenName: 'Abby', middleName1: '', middleName2: '', surname: 'Anderson' },
						],
					},
					citizenshipFormGroup: {
						isBornInCanada: BooleanTypeCode.Yes,
						proofOfCitizenship: ProofOfCanadianCitizenshipCode.BirthCertificate,
						proofOfAbility: null,
						citizenshipDocumentExpiryDate: null,
						citizenshipDocumentPhotoAttachments: [myFile],
					},
					govIssuedIdFormGroup: {
						governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode.BcServicesCard,
						governmentIssuedPhotoAttachments: [myFile],
					},
					bcDriversLicenceFormGroup: {
						hasBcDriversLicence: BooleanTypeCode.Yes,
						bcDriversLicenceNumber: '5458877',
					},
					characteristicsFormGroup: {
						hairColourCode: HairColourCode.Black,
						eyeColourCode: EyeColourCode.Blue,
						height: '100',
						heightUnitCode: HeightUnitCode.Inches,
						weight: '75',
						weightUnitCode: WeightUnitCode.Kilograms,
					},
					photographOfYourselfFormGroup: {
						useBcServicesCardPhoto: BooleanTypeCode.No,
						photoOfYourselfAttachments: [myFile],
					},
					contactInformationFormGroup: {
						contactEmailAddress: 'contact-test@test.gov.bc.ca',
						contactPhoneNumber: '2508896363',
					},
					residentialAddressFormGroup: {
						addressSelected: true,
						isMailingTheSameAsResidential: false,
						residentialAddressLine1: '123-720 Commonwealth Rd',
						residentialAddressLine2: '',
						residentialCity: 'Kelowna',
						residentialCountry: 'Canada',
						residentialPostalCode: 'V4V 1R8',
						residentialProvince: 'British Columbia',
					},
					mailingAddressFormGroup: {
						addressSelected: true,
						mailingAddressLine1: '777-798 Richmond St W',
						mailingAddressLine2: '',
						mailingCity: 'Toronto',
						mailingCountry: 'Canada',
						mailingPostalCode: 'M6J 3P3',
						mailingProvince: 'Ontario',
					},
					// categoriesFormGroup: {
					// 	categories: [
					// 		// { desc: 'Armoured Car Guard', code: SwlCategoryTypeCode.ArmouredCarGuard },
					// 		{ desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },

					// 		{ desc: 'Armoured Car Guard', code: SwlCategoryTypeCode.ArmouredCarGuard },
					// 		// { desc: 'Body Armour Sales', code: SwlCategoryTypeCode.BodyArmourSales },
					// 		// { desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
					// 		// { desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
					// 		{ desc: 'Fire Investigator', code: SwlCategoryTypeCode.FireInvestigator },
					// 		{ desc: 'Locksmith', code: SwlCategoryTypeCode.Locksmith },
					// 		// { desc: 'Locksmith - Under Supervision', code: SwlCategoryTypeCode.LocksmithUnderSupervision },
					// 		{ desc: 'Private Investigator', code: SwlCategoryTypeCode.PrivateInvestigator },
					// 		// {
					// 		// 	desc: 'Private Investigator - Under Supervision',
					// 		// 	code: SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision,
					// 		// },
					// 		{ desc: 'Security Alarm Installer', code: SwlCategoryTypeCode.SecurityAlarmInstaller },
					// 		// {
					// 		// 	desc: 'Security Alarm Installer - Under Supervision',
					// 		// 	code: SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
					// 		// },
					// 		// { desc: 'Security Alarm Monitor', code: SwlCategoryTypeCode.SecurityAlarmMonitor },
					// 		// { desc: 'Security Alarm Response', code: SwlCategoryTypeCode.SecurityAlarmResponse },
					// 		// { desc: 'Security Alarm Sales', code: SwlCategoryTypeCode.SecurityAlarmSales },
					// 		{ desc: 'Security Consultant', code: SwlCategoryTypeCode.SecurityConsultant },
					// 		// { desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },
					// 		// { desc: 'Security Guard - Under Supervision', code: SwlCategoryTypeCode.SecurityGuardUnderSupervision },
					// 	],
					// },
					categorySecurityGuardFormGroup: {
						attachments: [myFile],
						requirement: 'a',
					},
					categoryArmouredCarGuardFormGroup: {
						documentExpiryDate: '2009-10-07T00:00:00+00:00',
						attachments: [myFile],
					},
					categoryFireInvestigatorFormGroup: {
						fireinvestigatorcertificateattachments: [myFile],
						fireinvestigatorletterattachments: [myFile],
					},
					categoryLocksmithFormGroup: {
						requirement: 'a',
						attachments: [myFile],
					},
					categoryPrivateInvestigatorUnderSupervisionFormGroup: {
						requirement: 'a',
						attachments: [myFile],
						trainingattachments: [myFile],
					},
					categoryPrivateInvestigatorFormGroup: {
						requirement: 'a',
						training: 'a',
						attachments: [myFile],
						trainingattachments: [myFile],
						fireinvestigatorcertificateattachments: [myFile],
						fireinvestigatorletterattachments: [myFile],
						addFireInvestigator: BooleanTypeCode.Yes,
					},
					categorySecurityAlarmInstallerFormGroup: {
						requirement: 'a',
						attachments: [myFile],
					},
					categorySecurityConsultantFormGroup: {
						requirement: 'a',
						attachments: [myFile],
						resumeattachments: [myFile],
					},
				};

				console.log('loadLicenceNew defaults', defaults);

				// this.licenceModel = { ...defaults };
				this.licenceModelFormGroup.patchValue({ ...defaults });

				// const categoriesFormGroup = this.licenceModelFormGroup.controls['categoriesFormGroup'].value;
				// console.log('categoriesFormGroup', categoriesFormGroup);

				// // const categoryItem = this.formBuilder.group({
				// // 	desc: new FormControl(option.desc),
				// // 	code: new FormControl(option?.code),
				// // });
				// // console.log('xxxx categoryItem', categoryItem);

				// // this.categories.value.push(categoryItem);

				// const categories = this.licenceModelFormGroup.controls['categoriesFormGroup'].get('categories') as FormArray;
				// const categories = this.formBuilder.array([]);

				const defaultCategories = [
					{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
					{ desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },
					// { desc: 'Armoured Car Guard', code: SwlCategoryTypeCode.ArmouredCarGuard },
					// { desc: 'Fire Investigator', code: SwlCategoryTypeCode.FireInvestigator },
					// { desc: 'Locksmith', code: SwlCategoryTypeCode.Locksmith },
					// { desc: 'Private Investigator', code: SwlCategoryTypeCode.PrivateInvestigator },
					// { desc: 'Security Alarm Installer', code: SwlCategoryTypeCode.SecurityAlarmInstaller },
					// { desc: 'Security Consultant', code: SwlCategoryTypeCode.SecurityConsultant },
				];

				let transformedCategoryItems = defaultCategories.map((item: any) =>
					this.formBuilder.group({
						desc: new FormControl(item.desc),
						code: new FormControl(item.code),
					})
				);
				const yy = this.licenceModelFormGroup.controls['categoriesFormGroup'] as FormGroup;
				yy.setControl('categories', this.formBuilder.array(transformedCategoryItems));
				console.log('categories', yy);
				console.log('categories', yy.value.length);

				// defaultCategories.forEach((item: any) => {
				// 	console.log('item', item);

				// 	const categoryItem = this.formBuilder.group({
				// 		desc: new FormControl(item.desc),
				// 		code: new FormControl(item.code),
				// 	});

				// 	categories.value.push(categoryItem);
				// 	// categories.value.push(
				// 	// 	aliasItem
				// 	// );
				// });
				// console.log('categories', categories);

				// const aliasesFormGroup = this.licenceModelFormGroup.controls['aliasesFormGroup'].value;
				// const aliases = this.licenceModelFormGroup.controls['aliasesFormGroup'].get('aliases') as FormArray;
				// console.log('aliasesFormGroup', aliasesFormGroup);
				// console.log('aliases', aliases);

				// defaults.aliasesFormGroup.aliases.forEach((item: any) => {
				// 	console.log('item', item);

				// 	const aliasItem = this.formBuilder.group({
				// 		givenName: new FormControl(item.givenName),
				// 		middleName1: new FormControl(item.middleName1),
				// 		middleName2: new FormControl(item.middleName2),
				// 		surname: new FormControl(item.surname, [FormControlValidators.required]),
				// 	});

				// 	// (this.licenceModelFormGroup.controls['aliasesFormGroup'].get('aliases') as FormArray<FormGroup>).push(
				// 	// 	aliasItem
				// 	// );
				// 	aliases.value.push(aliasItem);
				// });
				// console.log('aliases', aliases);
				// console.log('aliases', aliases.value.length);

				// const aliasesFormGroup = this.licenceModelFormGroup.controls['aliasesFormGroup'].value;
				// const aliases = this.licenceModelFormGroup.controls['aliasesFormGroup'].get('aliases') as FormArray;
				// console.log('aliasesFormGroup', aliasesFormGroup);
				// console.log('aliases', aliases);

				let transformedAliasItems = defaults.aliasesFormGroup.aliases.map((item: any) =>
					this.formBuilder.group({
						givenName: new FormControl(item.givenName),
						middleName1: new FormControl(item.middleName1),
						middleName2: new FormControl(item.middleName2),
						surname: new FormControl(item.surname, [FormControlValidators.required]),
					})
				);

				console.log('transformedItems', transformedAliasItems);
				const xx = this.licenceModelFormGroup.controls['aliasesFormGroup'] as FormGroup;
				xx.setControl('aliases', this.formBuilder.array(transformedAliasItems));

				// defaults.aliasesFormGroup.aliases.forEach((item: any) => {
				// 	console.log('item', item);

				// 	const aliasItem = this.formBuilder.group({
				// 		givenName: new FormControl(item.givenName),
				// 		middleName1: new FormControl(item.middleName1),
				// 		middleName2: new FormControl(item.middleName2),
				// 		surname: new FormControl(item.surname, [FormControlValidators.required]),
				// 	});

				// 	// (this.licenceModelFormGroup.controls['aliasesFormGroup'].get('aliases') as FormArray<FormGroup>).push(
				// 	// 	aliasItem
				// 	// );
				// 	aliases.value.push(aliasItem);
				// });
				console.log('aliases', xx);
				console.log('aliases', xx.value.length);

				// this.ToDoListForm.setControl('items', this.fb.array(transformedItems));

				console.log('this.licenceModelFormGroup', this.licenceModelFormGroup.value);

				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');

				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceNew2(): Observable<any> {
		console.log('loadLicenceNew2 ');
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myBlob = new Blob();
				const myFile = this.utilService.blobToFile(myBlob, 'test.doc');

				const defaults: LicenceBackendModel = {
					licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
					applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123456',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'Jane',
					middleName1: 'Alice',
					middleName2: 'Mary',
					surname: 'Johnson',
					genderCode: GenderCode.F,
					dateOfBirth: '2009-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.No,
					useDogsOrRestraints: BooleanTypeCode.No,
					licenceTermCode: SwlTermCode.NintyDays,
					isPoliceOrPeaceOfficer: BooleanTypeCode.No,
					isTreatedForMHC: BooleanTypeCode.No,
					hasCriminalHistory: BooleanTypeCode.No,
					proofOfFingerprintAttachments: [myFile],
					previousNameFlag: BooleanTypeCode.No,
					isBornInCanada: BooleanTypeCode.Yes,
					proofOfCitizenship: ProofOfCanadianCitizenshipCode.SecureCertificateOfIndianStatus,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [myFile],
					governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode.BcServicesCard,
					governmentIssuedPhotoAttachments: [myFile],
					hasBcDriversLicence: BooleanTypeCode.No,
					hairColourCode: HairColourCode.Black,
					eyeColourCode: EyeColourCode.Blue,
					height: '200',
					heightUnitCode: HeightUnitCode.Inches,
					weight: '175',
					weightUnitCode: WeightUnitCode.Kilograms,
					useBcServicesCardPhoto: BooleanTypeCode.Yes,
					contactEmailAddress: 'contact-test2@test.gov.bc.ca',
					contactPhoneNumber: '2508896366',
					isMailingTheSameAsResidential: true,
					residentialAddressLine1: '123-720 Commonwealth Rd',
					residentialAddressLine2: '',
					residentialCity: 'Kelowna',
					residentialCountry: 'Canada',
					residentialPostalCode: 'V4V 1R8',
					residentialProvince: 'British Columbia',
					swlCategoryList: [{ desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard }],
					licenceCategorySecurityGuard: {
						attachments: [myFile],
						requirement: 'b',
					},
				};

				console.log('loadLicenceNew2 defaults', defaults);

				// this.licenceModel = { ...defaults };
				this.licenceModelFormGroup.patchValue({ ...defaults });
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceRenewal(): Observable<any> {
		console.log('loadLicenceRenewal ');
		this.spinnerService.show('loaderSpinner');
		this.initialized = true;

		return new Observable((observer) => {
			setTimeout(() => {
				const defaults: LicenceBackendModel = {
					licenceTypeCode: SwlTypeCode.SecurityBusinessLicence,
					applicationTypeCode: SwlApplicationTypeCode.Renewal,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'Blake',
					middleName1: '',
					middleName2: '',
					surname: 'Smith',
					genderCode: GenderCode.M,
					dateOfBirth: '2000-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.No,
					expiredLicenceNumber: '',
					expiryDate: '',
					useDogsOrRestraints: null,
					isDogsPurposeProtection: null,
					isDogsPurposeDetectionDrugs: null,
					isDogsPurposeDetectionExplosives: null,
					carryAndUseRetraints: null,
					licenceTermCode: SwlTermCode.NintyDays,
					isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
					officerRole: PoliceOfficerRoleCode.Other,
					otherOfficerRole: 'Janitor',
					isTreatedForMHC: null,
					hasCriminalHistory: null,
					previousNameFlag: BooleanTypeCode.No,
					isBornInCanada: null,
					proofOfCitizenship: null,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [],
					governmentIssuedPhotoTypeCode: null,
					hasBcDriversLicence: null,
					hairColourCode: null,
					eyeColourCode: null,
					height: null,
					heightUnitCode: null,
					weight: null,
					weightUnitCode: null,
					useBcServicesCardPhoto: null,
					swlCategoryList: [
						{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
					],
				};
				console.log('loadLicenceRenewal defaults', defaults);
				// this.licenceModel = { ...defaults };
				this.licenceModelFormGroup.patchValue({ ...defaults });
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceReplacement(): Observable<any> {
		console.log('loadLicenceReplacement ');
		this.spinnerService.show('loaderSpinner');
		this.initialized = true;

		return new Observable((observer) => {
			setTimeout(() => {
				const defaults: LicenceBackendModel = {
					licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
					applicationTypeCode: SwlApplicationTypeCode.Replacement,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123456',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'Jane',
					middleName1: 'Alice',
					middleName2: 'Mary',
					surname: 'Johnson',
					genderCode: GenderCode.F,
					dateOfBirth: '2009-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.Yes,
					expiredLicenceNumber: '789',
					expiryDate: '2002-02-07T00:00:00+00:00',
					useDogsOrRestraints: BooleanTypeCode.Yes,
					isDogsPurposeProtection: true,
					isDogsPurposeDetectionDrugs: false,
					isDogsPurposeDetectionExplosives: true,
					carryAndUseRetraints: true,
					dogsPurposeDocumentType: DogDocumentCode.SecurityDogValidationCertificate,
					carryAndUseRetraintsDocument: RestraintDocumentCode.TrainingEquivalent,
					carryAndUseRetraintsAttachments: [],
					licenceTermCode: SwlTermCode.ThreeYears,
					isPoliceOrPeaceOfficer: null,
					isTreatedForMHC: null,
					hasCriminalHistory: null,
					previousNameFlag: null,
					isBornInCanada: null,
					proofOfCitizenship: null,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [],
					governmentIssuedPhotoTypeCode: null,
					hasBcDriversLicence: null,
					hairColourCode: null,
					eyeColourCode: null,
					height: null,
					heightUnitCode: null,
					weight: null,
					weightUnitCode: null,
					useBcServicesCardPhoto: null,
					swlCategoryList: [
						{ desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
					],
				};
				console.log('loadLicenceReplacement defaults', defaults);
				// this.licenceModel = { ...defaults };
				this.licenceModelFormGroup.patchValue({ ...defaults });
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceUpdate(): Observable<any> {
		console.log('loadLicenceUpdate ');
		this.spinnerService.show('loaderSpinner');
		this.initialized = true;

		return new Observable((observer) => {
			setTimeout(() => {
				const defaults: LicenceBackendModel = {
					licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
					applicationTypeCode: SwlApplicationTypeCode.Update,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123456',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'Jane',
					middleName1: 'Alice',
					middleName2: 'Mary',
					surname: 'Johnson',
					genderCode: GenderCode.F,
					dateOfBirth: '2009-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.Yes,
					expiredLicenceNumber: '789',
					expiryDate: '2002-02-07T00:00:00+00:00',
					useDogsOrRestraints: BooleanTypeCode.Yes,
					isDogsPurposeProtection: true,
					isDogsPurposeDetectionDrugs: false,
					isDogsPurposeDetectionExplosives: true,
					carryAndUseRetraints: true,
					dogsPurposeDocumentType: DogDocumentCode.SecurityDogValidationCertificate,
					carryAndUseRetraintsDocument: RestraintDocumentCode.AdvancedSecurityTrainingCertificate,
					carryAndUseRetraintsAttachments: [],
					licenceTermCode: SwlTermCode.ThreeYears,
					isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
					officerRole: PoliceOfficerRoleCode.AuxiliaryorReserveConstable,
					isTreatedForMHC: null,
					hasCriminalHistory: null,
					previousNameFlag: null,
					isBornInCanada: null,
					proofOfCitizenship: null,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [],
					governmentIssuedPhotoTypeCode: null,
					hasBcDriversLicence: null,
					hairColourCode: null,
					eyeColourCode: null,
					height: null,
					heightUnitCode: null,
					weight: null,
					weightUnitCode: null,
					useBcServicesCardPhoto: null,
					swlCategoryList: [
						{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
						{ desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
					],
				};
				console.log('loadLicenceUpdate defaults', defaults);
				// this.licenceModel = { ...defaults };
				this.licenceModelFormGroup.patchValue({ ...defaults });
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(defaults);
			}, 1000);
		});
	}

	saveLicence(): void {
		this.hotToastService.success('Licence information has been saved');
		// console.log('SAVE LICENCE DATA', this.licenceModel);
		// this.licenceModelFormGroup.markAllAsTouched();
		console.log('SAVE LICENCE FORM DATA', this.licenceModelFormGroup.valid, this.licenceModelFormGroup.value);
	}

	clearLicenceCategoryData(code: SwlCategoryTypeCode): void {
		// switch (code) {
		// 	case SwlCategoryTypeCode.ArmouredCarGuard:
		// 		delete this.licenceModel.licenceCategoryArmouredCarGuard;
		// 		break;
		// 	case SwlCategoryTypeCode.BodyArmourSales:
		// 		delete this.licenceModel.licenceCategoryBodyArmourSales;
		// 		break;
		// 	case SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller:
		// 		delete this.licenceModel.licenceCategoryyClosedCircuitTelevisionInstaller;
		// 		break;
		// 	case SwlCategoryTypeCode.ElectronicLockingDeviceInstaller:
		// 		delete this.licenceModel.licenceCategoryElectronicLockingDeviceInstaller;
		// 		break;
		// 	case SwlCategoryTypeCode.FireInvestigator:
		// 		delete this.licenceModel.licenceCategoryFireInvestigator;
		// 		break;
		// 	case SwlCategoryTypeCode.Locksmith:
		// 		delete this.licenceModel.licenceCategoryLocksmith;
		// 		break;
		// 	case SwlCategoryTypeCode.LocksmithUnderSupervision:
		// 		delete this.licenceModel.licenceCategoryLocksmithUnderSupervision;
		// 		break;
		// 	case SwlCategoryTypeCode.PrivateInvestigator:
		// 		delete this.licenceModel.licenceCategoryPrivateInvestigator;
		// 		break;
		// 	case SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision:
		// 		delete this.licenceModel.licenceCategoryPrivateInvestigatorUnderSupervision;
		// 		break;
		// 	case SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
		// 		delete this.licenceModel.licenceCategorySecurityAlarmInstallerUnderSupervision;
		// 		break;
		// 	case SwlCategoryTypeCode.SecurityAlarmInstaller:
		// 		delete this.licenceModel.licenceCategorySecurityAlarmInstaller;
		// 		break;
		// 	case SwlCategoryTypeCode.SecurityAlarmMonitor:
		// 		delete this.licenceModel.licenceCategorySecurityAlarmMonitor;
		// 		break;
		// 	case SwlCategoryTypeCode.SecurityAlarmResponse:
		// 		delete this.licenceModel.licenceCategorySecurityAlarmResponse;
		// 		break;
		// 	case SwlCategoryTypeCode.SecurityAlarmSales:
		// 		delete this.licenceModel.licenceCategorySecurityAlarmSales;
		// 		break;
		// 	case SwlCategoryTypeCode.SecurityConsultant:
		// 		delete this.licenceModel.licenceCategorySecurityConsultant;
		// 		break;
		// 	case SwlCategoryTypeCode.SecurityGuard:
		// 		delete this.licenceModel.licenceCategorySecurityGuard;
		// 		break;
		// 	case SwlCategoryTypeCode.SecurityGuardUnderSupervision:
		// 		delete this.licenceModel.licenceCategorySecurityGuardUnderSupervision;
		// 		break;
		// }
	}

	clearAllLicenceCategoryData(): void {
		// call function to delete all licence category data
		// delete this.licenceModel.licenceCategoryArmouredCarGuard;
		// delete this.licenceModel.licenceCategoryBodyArmourSales;
		// delete this.licenceModel.licenceCategoryyClosedCircuitTelevisionInstaller;
		// delete this.licenceModel.licenceCategoryElectronicLockingDeviceInstaller;
		// delete this.licenceModel.licenceCategoryFireInvestigator;
		// delete this.licenceModel.licenceCategoryLocksmithUnderSupervision;
		// delete this.licenceModel.licenceCategoryLocksmith;
		// delete this.licenceModel.licenceCategoryPrivateInvestigatorUnderSupervision;
		// delete this.licenceModel.licenceCategoryPrivateInvestigator;
		// delete this.licenceModel.licenceCategorySecurityAlarmInstallerUnderSupervision;
		// delete this.licenceModel.licenceCategorySecurityAlarmInstaller;
		// delete this.licenceModel.licenceCategorySecurityAlarmMonitor;
		// delete this.licenceModel.licenceCategorySecurityAlarmResponse;
		// delete this.licenceModel.licenceCategorySecurityAlarmSales;
		// delete this.licenceModel.licenceCategorySecurityConsultant;
		// delete this.licenceModel.licenceCategorySecurityGuardUnderSupervision;
		// delete this.licenceModel.licenceCategorySecurityGuard;
	}

	notifyModelChanged(updatedData: any): void {
		// const licenceModel = { ...this.licenceModel, ...updatedData };
		// this.cleanLicenceModel(licenceModel);
		// this.licenceModel = { ...licenceModel };
		// console.log('notifyModelChanged licenceModel', this.licenceModel);

		// this.licenceModelFormGroup.patchValue({ ...updatedData });

		console.log(
			'notifyModelChanged licenceModelFormGroup',
			this.licenceModelFormGroup.valid,
			this.licenceModelFormGroup.value
		);
		this.licenceModelLoaded$.next({ isUpdated: true });
	}

	notifyLoaded(): void {
		this.setFlags();
		console.log('notifyLoaded', this.licenceModelFormGroup.value);
		this.licenceModelLoaded$.next({ isLoaded: true });
	}

	notifyUpdateFlags(): void {
		this.setFlags();
		console.log('notifyUpdateFlags', this.licenceModelFormGroup.value);
		this.licenceModelLoaded$.next({ isSetFlags: true });
	}

	notifyCategoryData(): void {
		console.log('notifyCategoryData', this.licenceModelFormGroup.value);
		this.licenceModelLoaded$.next({ isCategoryLoaded: true });
	}

	// private cleanLicenceModel(origLicenceModel: LicenceModel): LicenceModel {
	// 	//TODO when to clean model?
	// 	return origLicenceModel;
	// }

	private setFlags(): void {
		// const flags = {
		// isNewOrExpired: this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired,
		// isReplacement: this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Replacement,
		// isNotReplacement: this.licenceModel.applicationTypeCode != SwlApplicationTypeCode.Replacement,
		// showStepAccessCode: 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal ||
		// this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update,
		// showStepSoleProprietor: this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
		// this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal,
		// showStepLicenceExpired: 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired
		// };
		// this.licenceModel.isNewOrExpired = this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired;
		// this.licenceModel.isReplacement = this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Replacement;
		// this.licenceModel.isNotReplacement = !this.licenceModel.isReplacement;
		// this.licenceModel.showStepAccessCode =
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update;
		// // Review question would only apply to those who have a SWL w/ Sole Prop already,
		// // otherwise they would see the same question shown to New applicants
		// this.licenceModel.showStepSoleProprietor =
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;
		// this.licenceModel.showStepLicenceExpired =
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired;
		// this.licenceModel.showStepDogsAndRestraints = !!this.licenceModel.swlCategoryList.find(
		// 	(item) => item.code == SwlCategoryTypeCode.SecurityGuard
		// );
		// this.licenceModel.isViewOnlyPoliceOrPeaceOfficer = this.licenceModel.applicationTypeCode
		// 	? this.licenceModel.applicationTypeCode != SwlApplicationTypeCode.NewOrExpired
		// 	: false;
		// this.licenceModel.showStepPoliceBackground =
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;
		// this.licenceModel.showStepMentalHealth =
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;
		// this.licenceModel.showStepCriminalHistory =
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;
		// this.licenceModel.showStepFingerprints =
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
		// 	this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;
		// this.licenceModel.showStepBackgroundInfo = false;
		// this.licenceModelFormGroup.patchValue();
	}
}
