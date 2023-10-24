import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import {
	ApplicationTypeCode,
	EyeColourCode,
	GenderCode,
	HairColourCode,
	HeightUnitCode,
	LicenceTermCode,
	PoliceOfficerRoleCode,
	WeightUnitCode,
	WorkerLicenceTypeCode,
} from 'src/app/api/models';
import {
	BooleanTypeCode,
	DogDocumentCode,
	GovernmentIssuedPhotoIdCode,
	LocksmithRequirementCode,
	PrivateInvestigatorRequirementCode,
	PrivateInvestigatorSupRequirementCode,
	PrivateInvestigatorTrainingCode,
	ProofOfAbilityToWorkInCanadaCode,
	ProofOfCanadianCitizenshipCode,
	RestraintDocumentCode,
	SecurityAlarmInstallerRequirementCode,
	SecurityConsultantRequirementCode,
	SecurityGuardRequirementCode,
} from 'src/app/core/code-types/model-desc.models';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';

export interface LicenceFormStepComponent {
	isFormValid(): boolean;
}

// export class LicenceBackendModel {
// 	// isNewOrExpired?: boolean = true;
// 	// isReplacement?: boolean = false;
// 	// isNotReplacement?: boolean = true;
// 	// showStepAccessCode?: boolean = false;
// 	// showStepSoleProprietor?: boolean = true;
// 	// showStepLicenceExpired?: boolean = true;
// 	// showStepDogsAndRestraints?: boolean = true;
// 	// showStepPoliceBackground?: boolean = true;
// 	// showStepMentalHealth?: boolean = true;
// 	// showStepCriminalHistory?: boolean = true;
// 	// showStepFingerprints?: boolean = true;
// 	// showStepBackgroundInfo?: boolean = true;

// 	licenceTypeCode: SwlTypeCode | null = null;
// 	applicationTypeCode: SwlApplicationTypeCode | null = null;
// 	isSoleProprietor: BooleanTypeCode | null = null;
// 	currentLicenceNumber: string | null = null;
// 	accessCode: string | null = null;
// 	oneLegalName: boolean | null = null;
// 	givenName: string | null = null;
// 	middleName1: string | null = null;
// 	middleName2: string | null = null;
// 	surname: string | null = null;
// 	genderCode: GenderCode | null = null;
// 	dateOfBirth: string | null = null;
// 	hasExpiredLicence: BooleanTypeCode | null = null;
// 	expiredLicenceNumber?: string | null = null;
// 	expiryDate?: string | null = null;
// 	swlCategoryList: SelectOptions[] = [];
// 	licenceCategoryArmouredCarGuard?: {
// 		documentExpiryDate?: string | null;
// 		attachments?: Array<File>;
// 	};
// 	licenceCategoryBodyArmourSales?: {};
// 	licenceCategoryyClosedCircuitTelevisionInstaller?: {};
// 	licenceCategoryElectronicLockingDeviceInstaller?: {};
// 	licenceCategoryFireInvestigator?: {
// 		fireCourseCertificateAttachments?: Array<File>;
// 		fireVerificationLetterAttachments?: Array<File>;
// 	};
// 	licenceCategoryLocksmithSup?: {};
// 	licenceCategoryLocksmith?: {
// 		requirementCode?: string | null;
// 		attachments?: Array<File>;
// 	};
// 	licenceCategoryPrivateInvestigatorSup?: {
// 		requirementCode?: string | null;
// 		// documentExpiryDate?: string | null;
// 		attachments?: Array<File>;
// 		trainingAttachments?: Array<File>;
// 	};
// 	licenceCategoryPrivateInvestigator?: {
// 		requirementCode?: string | null;
// 		trainingCode?: string | null;
// 		// documentExpiryDate?: string | null;
// 		attachments?: Array<File>;
// 		trainingAttachments?: Array<File>;
// 		// fireCourseCertificateAttachments?: Array<File>;
// 		// fireVerificationLetterAttachments?: Array<File>;
// 		// addFireInvestigator?: BooleanTypeCode | null;
// 	};
// 	licenceCategorySecurityAlarmInstallerSup?: {};
// 	licenceCategorySecurityAlarmInstaller?: {
// 		requirementCode?: string | null;
// 		attachments?: Array<File>;
// 	};
// 	licenceCategorySecurityAlarmMonitor?: {};
// 	licenceCategorySecurityAlarmResponse?: {};
// 	licenceCategorySecurityAlarmSales?: {};
// 	licenceCategorySecurityConsultant?: {
// 		requirementCode?: string | null;
// 		attachments?: Array<File>;
// 		resumeAttachments?: Array<File>;
// 	};
// 	licenceCategorySecurityGuardSup?: {};
// 	licenceCategorySecurityGuard?: {
// 		requirementCode?: string | null;
// 		attachments?: Array<File>;
// 	};
// 	useDogsOrRestraints: string | null = null;
// 	isDogsPurposeProtection?: boolean | null = false;
// 	isDogsPurposeDetectionDrugs?: boolean | null = false;
// 	isDogsPurposeDetectionExplosives?: boolean | null = false;
// 	dogsPurposeDocumentType?: DogDocumentCode | null = null;
// 	dogsPurposeAttachments?: Array<File> = [];
// 	carryAndUseRetraints?: boolean | null = false;
// 	carryAndUseRetraintsDocument?: RestraintDocumentCode | null = null;
// 	carryAndUseRetraintsAttachments?: Array<File> = [];
// 	licenceTermCode: SwlTermCode | null = null;
// 	isViewOnlyPoliceOrPeaceOfficer?: boolean = false;
// 	isPoliceOrPeaceOfficer: BooleanTypeCode | null = null;
// 	officerRole?: string | null = null;
// 	otherOfficerRole?: string | null = null;
// 	letterOfNoConflictAttachments?: Array<File> = [];
// 	isTreatedForMHC: BooleanTypeCode | null = null;
// 	mentalHealthConditionAttachments?: Array<File> = [];
// 	hasCriminalHistory: BooleanTypeCode | null = null;
// 	proofOfFingerprintAttachments?: Array<File> = [];
// 	previousNameFlag: BooleanTypeCode | null = null;
// 	aliases?: Array<AliasModel> | null = null;
// 	isBornInCanada: BooleanTypeCode | null = null;
// 	proofOfCitizenship: ProofOfCanadianCitizenshipCode | null = null;
// 	proofOfAbility: ProofOfAbilityToWorkInCanadaCode | null = null;
// 	citizenshipDocumentExpiryDate?: string | null = null;
// 	citizenshipDocumentPhotoAttachments?: Array<File> = [];
// 	governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode | null = null;
// 	governmentIssuedPhotoExpiryDate?: string | null = null;
// 	governmentIssuedPhotoAttachments?: Array<File> = [];
// 	hasBcDriversLicence: BooleanTypeCode | null = null;
// 	bcDriversLicenceNumber?: string | null = null;
// 	hairColourCode: HairColourCode | null = null;
// 	eyeColourCode: EyeColourCode | null = null;
// 	height: string | null = null;
// 	heightUnitCode: HeightUnitCode | null = null;
// 	weight: string | null = null;
// 	weightUnitCode: WeightUnitCode | null = null;
// 	useBcServicesCardPhoto: BooleanTypeCode | null = null;
// 	photoOfYourselfAttachments?: Array<File> = [];
// 	contactEmailAddress?: string | null = null;
// 	contactPhoneNumber?: string | null = null;
// 	residentialAddressLine1?: string | null = null;
// 	residentialAddressLine2?: string | null = null;
// 	residentialCity?: string | null = null;
// 	residentialPostalCode?: string | null = null;
// 	residentialProvince?: string | null = null;
// 	residentialCountry?: string | null = null;
// 	isMailingTheSameAsResidential?: boolean | null = null;
// 	mailingAddressLine1?: string | null = null;
// 	mailingAddressLine2?: string | null = null;
// 	mailingCity?: string | null = null;
// 	mailingPostalCode?: string | null = null;
// 	mailingProvince?: string | null = null;
// 	mailingCountry?: string | null = null;
// }

// export class AliasModel {
// 	constructor(
// 		givenName: string | null,
// 		middleName1: string | null,
// 		middleName2: string | null,
// 		surname: string | null
// 	) {
// 		this.givenName = givenName;
// 		this.middleName1 = middleName1;
// 		this.middleName2 = middleName2;
// 		this.surname = surname;
// 	}
// 	givenName: string | null = null;
// 	middleName1: string | null = null;
// 	middleName2: string | null = null;
// 	surname: string | null = null;
// }

// export class LicenceModelSubject {
// 	isLoaded?: boolean = false;
// 	isSetFlags?: boolean = false;
// 	isUpdated?: boolean = false;
// 	isCategoryLoaded?: boolean = false;
// }

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService {
	initialized = false;

	booleanTypeCodes = BooleanTypeCode;

	licenceModelLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

	categoryBodyArmourSalesFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categoryClosedCircuitTelevisionInstallerFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categoryElectronicLockingDeviceInstallerFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categoryLocksmithSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categorySecurityAlarmInstallerSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categorySecurityAlarmMonitorFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categorySecurityAlarmResponseFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categorySecurityAlarmSalesFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categorySecurityGuardSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
		checkbox: new FormControl({ value: true, disabled: true }),
	});
	categoryArmouredCarGuardFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			documentExpiryDate: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'documentExpiryDate',
					(form) => form.get('isInclude')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);
	categoryFireInvestigatorFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			fireCourseCertificateAttachments: new FormControl([]),
			fireVerificationLetterAttachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'fireCourseCertificateAttachments',
					(form) => form.get('isInclude')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'fireVerificationLetterAttachments',
					(form) => form.get('isInclude')?.value
				),
			],
		}
	);
	categoryLocksmithFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);
	categoryPrivateInvestigatorSupFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
			trainingAttachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'trainingAttachments',
					(form) => form.get('isInclude')?.value
				),
			],
		}
	);
	categoryPrivateInvestigatorFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			trainingCode: new FormControl(''),
			attachments: new FormControl([]),
			trainingAttachments: new FormControl([]),
			// fireCourseCertificateAttachments: new FormControl([]),
			// fireVerificationLetterAttachments: new FormControl([]),
			// addFireInvestigator: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalRequiredValidator('trainingCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'trainingAttachments',
					(form) => form.get('isInclude')?.value
				),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'fireCourseCertificateAttachments',
				// 	(form) => form.get('isInclude')?.value && form.get('addFireInvestigator')?.value == this.booleanTypeCodes.Yes
				// ),
				// FormGroupValidators.conditionalDefaultRequiredValidator(
				// 	'fireVerificationLetterAttachments',
				// 	(form) => form.get('isInclude')?.value && form.get('addFireInvestigator')?.value == this.booleanTypeCodes.Yes
				// ),
			],
		}
	);
	categorySecurityAlarmInstallerFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);
	categorySecurityConsultantFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
			resumeAttachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'resumeAttachments',
					(form) => form.get('isInclude')?.value
				),
			],
		}
	);
	categorySecurityGuardFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);

	restraintsAuthorizationFormGroup: FormGroup = this.formBuilder.group(
		{
			carryAndUseRetraints: new FormControl(''),
			carryAndUseRetraintsDocument: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'carryAndUseRetraints',
					(form) => this.categorySecurityGuardFormGroup.get('isInclude')?.value
				),
				FormGroupValidators.conditionalRequiredValidator(
					'carryAndUseRetraintsDocument',
					(form) => form.get('carryAndUseRetraints')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('carryAndUseRetraints')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

	dogsAuthorizationFormGroup: FormGroup = this.formBuilder.group(
		{
			useDogs: new FormControl(''),
			dogsPurposeFormGroup: new FormGroup(
				{
					isDogsPurposeProtection: new FormControl(false),
					isDogsPurposeDetectionDrugs: new FormControl(false),
					isDogsPurposeDetectionExplosives: new FormControl(false),
				},
				FormGroupValidators.atLeastOneCheckboxValidator('useDogs', BooleanTypeCode.Yes)
			),
			dogsPurposeDocumentType: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'useDogs',
					(form) => this.categorySecurityGuardFormGroup.get('isInclude')?.value
				),
				FormGroupValidators.conditionalRequiredValidator(
					'dogsPurposeDocumentType',
					(form) => form.get('useDogs')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('useDogs')?.value == this.booleanTypeCodes.Yes
				),
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
			isBornInCanada: new FormControl('', [FormControlValidators.required]),
			proofOfCitizenship: new FormControl(''),
			proofOfAbility: new FormControl(''),
			citizenshipDocumentExpiryDate: new FormControl(''),
			citizenshipDocumentPhotoAttachments: new FormControl([], [Validators.required]),
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
		governmentIssuedPhotoTypeCode: new FormControl('', [FormControlValidators.required]),
		governmentIssuedPhotoExpiryDate: new FormControl(''),
		governmentIssuedPhotoAttachments: new FormControl('', [Validators.required]),
	});

	bcDriversLicenceFormGroup: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl('', [FormControlValidators.required]),
		bcDriversLicenceNumber: new FormControl(),
	});

	characteristicsFormGroup: FormGroup = this.formBuilder.group({
		hairColourCode: new FormControl('', [FormControlValidators.required]),
		eyeColourCode: new FormControl('', [FormControlValidators.required]),
		height: new FormControl('', [FormControlValidators.required]),
		heightUnitCode: new FormControl('', [FormControlValidators.required]),
		weight: new FormControl('', [FormControlValidators.required]),
		weightUnitCode: new FormControl('', [FormControlValidators.required]),
	});

	photographOfYourselfFormGroup: FormGroup = this.formBuilder.group(
		{
			useBcServicesCardPhoto: new FormControl('', [FormControlValidators.required]),
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

	mailingAddressFormGroup: FormGroup = this.formBuilder.group(
		{
			addressSelected: new FormControl(false), //, [Validators.requiredTrue]),
			mailingAddressLine1: new FormControl(''), //, [FormControlValidators.required]),
			mailingAddressLine2: new FormControl(''),
			mailingCity: new FormControl(''), //, [FormControlValidators.required]),
			mailingPostalCode: new FormControl(''), //, [FormControlValidators.required]),
			mailingProvince: new FormControl(''), //, [FormControlValidators.required]),
			mailingCountry: new FormControl(''), //, [FormControlValidators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'addressSelected',
					(form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value
				),
				FormGroupValidators.conditionalRequiredValidator(
					'mailingAddressLine1',
					(form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value
				),
				FormGroupValidators.conditionalRequiredValidator(
					'mailingCity',
					(form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value
				),
				FormGroupValidators.conditionalRequiredValidator(
					'mailingPostalCode',
					(form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value
				),
				FormGroupValidators.conditionalRequiredValidator(
					'mailingProvince',
					(form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value
				),
				FormGroupValidators.conditionalRequiredValidator(
					'mailingCountry',
					(form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value
				),
			],
		}
	);

	licenceModelFormGroup: FormGroup = this.formBuilder.group({
		// showStepAccessCode: new FormControl(false),
		// showStepSoleProprietor: new FormControl(true),
		// showStepLicenceExpired: new FormControl(true),
		// showStepDogsAndRestraints: new FormControl(true),
		// showStepPoliceBackground: new FormControl(true),
		// showStepMentalHealth: new FormControl(true),
		// showStepCriminalHistory: new FormControl(true),
		// showStepFingerprints: new FormControl(true),

		licenceTypeData: this.licenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		soleProprietorData: this.soleProprietorFormGroup,
		personalInformationData: this.personalInformationFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
		licenceTermData: this.licenceTermFormGroup,
		restraintsAuthorizationData: this.restraintsAuthorizationFormGroup,
		dogsAuthorizationData: this.dogsAuthorizationFormGroup,

		categoryArmouredCarGuardFormGroup: this.categoryArmouredCarGuardFormGroup,
		categoryBodyArmourSalesFormGroup: this.categoryBodyArmourSalesFormGroup,
		categoryClosedCircuitTelevisionInstallerFormGroup: this.categoryClosedCircuitTelevisionInstallerFormGroup,
		categoryElectronicLockingDeviceInstallerFormGroup: this.categoryElectronicLockingDeviceInstallerFormGroup,
		categoryFireInvestigatorFormGroup: this.categoryFireInvestigatorFormGroup,
		categoryLocksmithFormGroup: this.categoryLocksmithFormGroup,
		categoryLocksmithSupFormGroup: this.categoryLocksmithSupFormGroup,
		categoryPrivateInvestigatorFormGroup: this.categoryPrivateInvestigatorFormGroup,
		categoryPrivateInvestigatorSupFormGroup: this.categoryPrivateInvestigatorSupFormGroup,
		categorySecurityAlarmInstallerFormGroup: this.categorySecurityAlarmInstallerFormGroup,
		categorySecurityAlarmInstallerSupFormGroup: this.categorySecurityAlarmInstallerSupFormGroup,
		categorySecurityConsultantFormGroup: this.categorySecurityConsultantFormGroup,
		categorySecurityAlarmMonitorFormGroup: this.categorySecurityAlarmMonitorFormGroup,
		categorySecurityAlarmResponseFormGroup: this.categorySecurityAlarmResponseFormGroup,
		categorySecurityAlarmSalesFormGroup: this.categorySecurityAlarmSalesFormGroup,
		categorySecurityGuardFormGroup: this.categorySecurityGuardFormGroup,
		categorySecurityGuardSupFormGroup: this.categorySecurityGuardSupFormGroup,

		policeBackgroundData: this.policeBackgroundFormGroup,
		mentalHealthConditionsData: this.mentalHealthConditionsFormGroup,
		criminalHistoryData: this.criminalHistoryFormGroup,
		proofOfFingerprintData: this.proofOfFingerprintFormGroup,

		aliasesData: this.aliasesFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		govIssuedIdData: this.govIssuedIdFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
	});

	constructor(
		private formBuilder: FormBuilder,
		private hotToastService: HotToastService,
		private utilService: UtilService,
		private spinnerService: NgxSpinnerService
	) {}

	reset(): void {
		this.initialized = false;
		this.licenceModelFormGroup.reset();

		const aliases = this.licenceModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		aliases.clear();

		console.log('RESET licenceModelFormGroup', this.licenceModelFormGroup.value);
	}

	createNewLicence(): Observable<any> {
		console.log('createNewLicence ');
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				this.licenceModelFormGroup.reset();
				// this.licenceModelFormGroup.patchValue({
				// 	categoryArmouredCarGuardFormGroup: {
				// 		isInclude: false,
				// 	},
				// 	categoryBodyArmourSalesFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// 	categoryClosedCircuitTelevisionInstallerFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// 	categoryElectronicLockingDeviceInstallerFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// 	categoryFireInvestigatorFormGroup: {
				// 		isInclude: false,
				// 	},
				// 	categoryLocksmithFormGroup: {
				// 		isInclude: false,
				// 	},
				// 	categoryLocksmithSupFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// 	categoryPrivateInvestigatorSupFormGroup: {
				// 		isInclude: false,
				// 	},
				// 	categoryPrivateInvestigatorFormGroup: {
				// 		isInclude: false,
				// 	},
				// 	categorySecurityAlarmInstallerFormGroup: {
				// 		isInclude: false,
				// 	},
				// 	categorySecurityAlarmInstallerSupFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// 	categorySecurityAlarmMonitorFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// 	categorySecurityAlarmResponseFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// 	categorySecurityAlarmSalesFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// 	categorySecurityConsultantFormGroup: {
				// 		isInclude: false,
				// 	},
				// 	categorySecurityGuardFormGroup: {
				// 		isInclude: false,
				// 	},
				// 	categorySecurityGuardSupFormGroup: {
				// 		isInclude: false,
				// 		checkbox: true,
				// 	},
				// });
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
				const myFile = this.utilService.blobToFile(myBlob, 'test1.doc');

				const defaults: any = {
					licenceTypeData: {
						licenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit,
					},
					applicationTypeData: {
						applicationTypeCode: ApplicationTypeCode.New,
					},
					soleProprietorData: {
						isSoleProprietor: BooleanTypeCode.Yes,
					},
					personalInformationData: {
						oneLegalName: false,
						givenName: 'John',
						middleName1: 'Michael',
						middleName2: 'Adam',
						surname: 'Johnson',
						genderCode: GenderCode.M,
						dateOfBirth: '2009-10-07T00:00:00+00:00',
					},
					expiredLicenceData: {
						hasExpiredLicence: BooleanTypeCode.Yes,
						expiredLicenceNumber: '789',
						expiryDate: '2002-02-07T00:00:00+00:00',
					},
					restraintsAuthorizationData: {
						carryAndUseRetraints: BooleanTypeCode.Yes,
						carryAndUseRetraintsDocument: RestraintDocumentCode.AdvancedSecurityTrainingCertificate,
						attachments: [myFile],
					},
					dogsAuthorizationData: {
						useDogs: BooleanTypeCode.Yes,
						dogsPurposeFormGroup: {
							isDogsPurposeProtection: true,
							isDogsPurposeDetectionDrugs: false,
							isDogsPurposeDetectionExplosives: true,
						},
						dogsPurposeDocumentType: DogDocumentCode.CertificateOfAdvancedSecurityTraining,
						attachments: [myFile],
					},
					licenceTermData: {
						licenceTermCode: LicenceTermCode.ThreeYears,
					},
					// currentLicenceNumber: '123456',
					// accessCode: '456',
					policeBackgroundData: {
						isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
						officerRole: PoliceOfficerRoleCode.Other,
						otherOfficerRole: 'testRole',
						letterOfNoConflictAttachments: [myFile],
					},
					mentalHealthConditionsData: {
						isTreatedForMHC: BooleanTypeCode.Yes,
						mentalHealthConditionAttachments: [myFile],
					},
					criminalHistoryData: {
						hasCriminalHistory: BooleanTypeCode.No,
					},
					proofOfFingerprintData: {
						proofOfFingerprintAttachments: [myFile],
					},
					aliasesData: {
						previousNameFlag: BooleanTypeCode.Yes,
						aliases: [
							{ givenName: 'Abby', middleName1: 'Betty', middleName2: 'Meg', surname: 'Brown' },
							{ givenName: 'Abby', middleName1: '', middleName2: '', surname: 'Anderson' },
						],
					},
					citizenshipData: {
						isBornInCanada: BooleanTypeCode.Yes,
						proofOfCitizenship: ProofOfCanadianCitizenshipCode.BirthCertificate,
						proofOfAbility: null,
						citizenshipDocumentExpiryDate: null,
						citizenshipDocumentPhotoAttachments: [myFile],
					},
					govIssuedIdData: {
						governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode.BcServicesCard,
						governmentIssuedPhotoAttachments: [myFile],
					},
					bcDriversLicenceData: {
						hasBcDriversLicence: BooleanTypeCode.Yes,
						bcDriversLicenceNumber: '5458877',
					},
					characteristicsData: {
						hairColourCode: HairColourCode.Black,
						eyeColourCode: EyeColourCode.Blue,
						height: '100',
						heightUnitCode: HeightUnitCode.Inches,
						weight: '75',
						weightUnitCode: WeightUnitCode.Kilograms,
					},
					photographOfYourselfData: {
						useBcServicesCardPhoto: BooleanTypeCode.No,
						photoOfYourselfAttachments: [myFile],
					},
					contactInformationData: {
						contactEmailAddress: 'contact-test@test.gov.bc.ca',
						contactPhoneNumber: '2508896363',
					},
					residentialAddressData: {
						addressSelected: true,
						isMailingTheSameAsResidential: false,
						residentialAddressLine1: '123-720 Commonwealth Rd',
						residentialAddressLine2: '',
						residentialCity: 'Kelowna',
						residentialCountry: 'Canada',
						residentialPostalCode: 'V4V 1R8',
						residentialProvince: 'British Columbia',
					},
					mailingAddressData: {
						addressSelected: true,
						mailingAddressLine1: '777-798 Richmond St W',
						mailingAddressLine2: '',
						mailingCity: 'Toronto',
						mailingCountry: 'Canada',
						mailingPostalCode: 'M6J 3P3',
						mailingProvince: 'Ontario',
					},
					categoryArmouredCarGuardFormGroup: {
						isInclude: true,
						documentExpiryDate: '2009-10-07T00:00:00+00:00',
						attachments: [myFile],
					},
					categoryBodyArmourSalesFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryClosedCircuitTelevisionInstallerFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryElectronicLockingDeviceInstallerFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryFireInvestigatorFormGroup: {
						isInclude: true,
						fireCourseCertificateAttachments: [myFile],
						fireVerificationLetterAttachments: [myFile],
					},
					categoryLocksmithFormGroup: {
						isInclude: true,
						requirementCode: LocksmithRequirementCode.ExperienceAndApprenticeship,
						attachments: [myFile],
					},
					categoryLocksmithSupFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryPrivateInvestigatorSupFormGroup: {
						isInclude: true,
						requirementCode: PrivateInvestigatorSupRequirementCode.PrivateSecurityTrainingNetworkCompletion,
						attachments: [myFile],
						trainingAttachments: [myFile],
					},
					categoryPrivateInvestigatorFormGroup: {
						isInclude: true,
						requirementCode: PrivateInvestigatorRequirementCode.ExperienceAndCourses,
						trainingCode: PrivateInvestigatorTrainingCode.CompleteOtherCoursesOrKnowledge,
						attachments: [myFile],
						trainingAttachments: [myFile],
						fireCourseCertificateAttachments: [myFile],
						fireVerificationLetterAttachments: [myFile],
						addFireInvestigator: BooleanTypeCode.Yes,
					},
					categorySecurityAlarmInstallerFormGroup: {
						isInclude: true,
						requirementCode: SecurityAlarmInstallerRequirementCode.ExperienceOrTrainingEquivalent,
						attachments: [myFile],
					},
					categorySecurityAlarmInstallerSupFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categorySecurityAlarmMonitorFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categorySecurityAlarmResponseFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categorySecurityAlarmSalesFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categorySecurityConsultantFormGroup: {
						isInclude: true,
						requirementCode: SecurityConsultantRequirementCode.RecommendationLetters,
						attachments: [myFile],
						resumeAttachments: [myFile],
					},
					categorySecurityGuardFormGroup: {
						isInclude: true,
						attachments: [myFile],
						requirementCode: SecurityGuardRequirementCode.BasicSecurityTrainingCertificate,
					},
					categorySecurityGuardSupFormGroup: {
						isInclude: false,
						checkbox: true,
					},
				};

				console.debug('loadLicenceNew defaults', defaults);

				this.licenceModelFormGroup.patchValue({ ...defaults });

				if (defaults.aliasesData.aliases?.length > 0) {
					let transformedAliasItems = defaults.aliasesData.aliases.map((item: any) =>
						this.formBuilder.group({
							givenName: new FormControl(item.givenName),
							middleName1: new FormControl(item.middleName1),
							middleName2: new FormControl(item.middleName2),
							surname: new FormControl(item.surname, [FormControlValidators.required]),
						})
					);

					const aliasesData = this.licenceModelFormGroup.controls['aliasesData'] as FormGroup;
					aliasesData.setControl('aliases', this.formBuilder.array(transformedAliasItems));
				}

				console.debug('this.licenceModelFormGroup', this.licenceModelFormGroup.value);

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

				const defaults: any = {
					licenceTypeData: {
						licenceTypeCode: WorkerLicenceTypeCode.BodyArmourPermit,
					},
					applicationTypeData: {
						applicationTypeCode: ApplicationTypeCode.New,
					},
					soleProprietorData: {
						isSoleProprietor: BooleanTypeCode.No,
					},
					personalInformationData: {
						oneLegalName: false,
						givenName: 'Alice',
						middleName1: 'Michael',
						middleName2: 'Adam',
						surname: 'Johnson',
						genderCode: GenderCode.F,
						dateOfBirth: '2005-10-07T00:00:00+00:00',
					},
					expiredLicenceData: {
						hasExpiredLicence: BooleanTypeCode.No,
					},
					restraintsAuthorizationData: {
						// carryAndUseRetraints: BooleanTypeCode.No,
					},
					dogsAuthorizationData: {
						// useDogsOrRestraints: BooleanTypeCode.No,
					},
					licenceTermData: {
						licenceTermCode: LicenceTermCode.NintyDays,
					},
					policeBackgroundData: {
						isPoliceOrPeaceOfficer: BooleanTypeCode.No,
					},
					mentalHealthConditionsData: {
						isTreatedForMHC: BooleanTypeCode.No,
					},
					criminalHistoryData: {
						hasCriminalHistory: BooleanTypeCode.No,
					},
					proofOfFingerprintData: {
						proofOfFingerprintAttachments: [myFile],
					},
					aliasesData: {
						previousNameFlag: BooleanTypeCode.No,
					},
					citizenshipData: {
						isBornInCanada: BooleanTypeCode.Yes,
						proofOfCitizenship: ProofOfCanadianCitizenshipCode.BirthCertificate,
						proofOfAbility: null,
						citizenshipDocumentExpiryDate: null,
						citizenshipDocumentPhotoAttachments: [myFile],
					},
					govIssuedIdData: {
						governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode.BcServicesCard,
						governmentIssuedPhotoAttachments: [myFile],
					},
					bcDriversLicenceData: {
						hasBcDriversLicence: BooleanTypeCode.No,
					},
					characteristicsData: {
						hairColourCode: HairColourCode.Black,
						eyeColourCode: EyeColourCode.Blue,
						height: '100',
						heightUnitCode: HeightUnitCode.Inches,
						weight: '75',
						weightUnitCode: WeightUnitCode.Kilograms,
					},
					photographOfYourselfData: {
						useBcServicesCardPhoto: BooleanTypeCode.Yes,
					},
					contactInformationData: {
						contactEmailAddress: 'contact-test22@test.gov.bc.ca',
						contactPhoneNumber: '2508896363',
					},
					residentialAddressData: {
						addressSelected: true,
						isMailingTheSameAsResidential: true,
						residentialAddressLine1: '123-720 Commonwealth Rd',
						residentialAddressLine2: '',
						residentialCity: 'Kelowna',
						residentialCountry: 'Canada',
						residentialPostalCode: 'V4V 1R8',
						residentialProvince: 'British Columbia',
					},
					// categorySecurityAlarmInstallerFormGroup: {
					// 	isInclude: true,
					// 	requirementCode: 'a',
					// 	attachments: [myFile],
					// },
					categorySecurityAlarmResponseFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryClosedCircuitTelevisionInstallerFormGroup: {
						isInclude: true,
						checkbox: true,
					},
				};

				console.debug('loadLicenceNew2 defaults', defaults);

				this.licenceModelFormGroup.patchValue({ ...defaults });

				if (defaults.aliasesData.aliases?.length > 0) {
					let transformedAliasItems = defaults.aliasesData.aliases.map((item: any) =>
						this.formBuilder.group({
							givenName: new FormControl(item.givenName),
							middleName1: new FormControl(item.middleName1),
							middleName2: new FormControl(item.middleName2),
							surname: new FormControl(item.surname, [FormControlValidators.required]),
						})
					);

					const aliasesData = this.licenceModelFormGroup.controls['aliasesData'] as FormGroup;
					aliasesData.setControl('aliases', this.formBuilder.array(transformedAliasItems));
				}

				console.debug('this.licenceModelFormGroup', this.licenceModelFormGroup.value);

				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');

				observer.next(defaults);
			}, 1000);
		});
	}

	isStep1Complete(): boolean {
		// console.log(
		// 	'isStep1Complete',
		// 	this.licenceTypeFormGroup.valid,
		// 	this.applicationTypeFormGroup.valid,
		// 	this.soleProprietorFormGroup.valid,
		// 	this.personalInformationFormGroup.valid,
		// 	this.expiredLicenceFormGroup.valid,
		// 	this.licenceTermFormGroup.valid,
		// 	this.restraintsAuthorizationFormGroup.valid,
		// 	this.dogsAuthorizationFormGroup.valid,
		// 	this.categoryArmouredCarGuardFormGroup.valid,
		// 	this.categoryBodyArmourSalesFormGroup.valid,
		// 	this.categoryClosedCircuitTelevisionInstallerFormGroup.valid,
		// 	this.categoryElectronicLockingDeviceInstallerFormGroup.valid,
		// 	this.categoryFireInvestigatorFormGroup.valid,
		// 	this.categoryLocksmithFormGroup.valid,
		// 	this.categoryLocksmithSupFormGroup.valid,
		// 	this.categoryPrivateInvestigatorFormGroup.valid,
		// 	this.categoryPrivateInvestigatorSupFormGroup.valid,
		// 	this.categorySecurityAlarmInstallerFormGroup.valid,
		// 	this.categorySecurityAlarmInstallerSupFormGroup.valid,
		// 	this.categorySecurityConsultantFormGroup.valid,
		// 	this.categorySecurityAlarmMonitorFormGroup.valid,
		// 	this.categorySecurityAlarmResponseFormGroup.valid,
		// 	this.categorySecurityAlarmSalesFormGroup.valid,
		// 	this.categorySecurityGuardFormGroup.valid,
		// 	this.categorySecurityGuardSupFormGroup.valid
		// );

		return (
			this.licenceTypeFormGroup.valid &&
			this.applicationTypeFormGroup.valid &&
			this.soleProprietorFormGroup.valid &&
			this.personalInformationFormGroup.valid &&
			this.expiredLicenceFormGroup.valid &&
			this.licenceTermFormGroup.valid &&
			this.restraintsAuthorizationFormGroup.valid &&
			this.dogsAuthorizationFormGroup.valid &&
			this.categoryArmouredCarGuardFormGroup.valid &&
			this.categoryBodyArmourSalesFormGroup.valid &&
			this.categoryClosedCircuitTelevisionInstallerFormGroup.valid &&
			this.categoryElectronicLockingDeviceInstallerFormGroup.valid &&
			this.categoryFireInvestigatorFormGroup.valid &&
			this.categoryLocksmithFormGroup.valid &&
			this.categoryLocksmithSupFormGroup.valid &&
			this.categoryPrivateInvestigatorFormGroup.valid &&
			this.categoryPrivateInvestigatorSupFormGroup.valid &&
			this.categorySecurityAlarmInstallerFormGroup.valid &&
			this.categorySecurityAlarmInstallerSupFormGroup.valid &&
			this.categorySecurityConsultantFormGroup.valid &&
			this.categorySecurityAlarmMonitorFormGroup.valid &&
			this.categorySecurityAlarmResponseFormGroup.valid &&
			this.categorySecurityAlarmSalesFormGroup.valid &&
			this.categorySecurityGuardFormGroup.valid &&
			this.categorySecurityGuardSupFormGroup.valid
		);
	}

	isStep2Complete(): boolean {
		// console.log(
		// 	'isStep2Complete',
		// 	this.policeBackgroundFormGroup.valid,
		// 	this.mentalHealthConditionsFormGroup.valid,
		// 	this.criminalHistoryFormGroup.valid,
		// 	this.proofOfFingerprintFormGroup.valid
		// );

		return (
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid &&
			this.criminalHistoryFormGroup.valid &&
			this.proofOfFingerprintFormGroup.valid
		);
	}

	isStep3Complete(): boolean {
		// console.log(
		// 	'isStep3Complete',
		// 	this.aliasesFormGroup.valid,
		// 	this.citizenshipFormGroup.valid,
		// 	this.govIssuedIdFormGroup.valid,
		// 	this.bcDriversLicenceFormGroup.valid,
		// 	this.characteristicsFormGroup.valid,
		// 	this.photographOfYourselfFormGroup.valid,
		// 	this.residentialAddressFormGroup.valid,
		// 	this.mailingAddressFormGroup.valid,
		// 	this.contactInformationFormGroup.valid
		// );

		return (
			this.aliasesFormGroup.valid &&
			this.citizenshipFormGroup.valid &&
			this.govIssuedIdFormGroup.valid &&
			this.bcDriversLicenceFormGroup.valid &&
			this.characteristicsFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.residentialAddressFormGroup.valid &&
			this.mailingAddressFormGroup.valid &&
			this.contactInformationFormGroup.valid
		);
	}

	// loadLicenceRenewal(): Observable<any> {
	// 	console.log('loadLicenceRenewal ');
	// 	this.spinnerService.show('loaderSpinner');
	// 	this.initialized = true;

	// 	return new Observable((observer) => {
	// 		setTimeout(() => {
	// 			const defaults: LicenceBackendModel = {
	// 				licenceTypeCode: SwlTypeCode.SecurityBusinessLicence,
	// 				applicationTypeCode: SwlApplicationTypeCode.Renewal,
	// 				isSoleProprietor: BooleanTypeCode.Yes,
	// 				currentLicenceNumber: '123',
	// 				accessCode: '456',
	// 				oneLegalName: false,
	// 				givenName: 'Blake',
	// 				middleName1: '',
	// 				middleName2: '',
	// 				surname: 'Smith',
	// 				genderCode: GenderCode.M,
	// 				dateOfBirth: '2000-10-07T00:00:00+00:00',
	// 				hasExpiredLicence: BooleanTypeCode.No,
	// 				expiredLicenceNumber: '',
	// 				expiryDate: '',
	// 				useDogsOrRestraints: null,
	// 				isDogsPurposeProtection: null,
	// 				isDogsPurposeDetectionDrugs: null,
	// 				isDogsPurposeDetectionExplosives: null,
	// 				carryAndUseRetraints: null,
	// 				licenceTermCode: SwlTermCode.NintyDays,
	// 				isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
	// 				officerRole: PoliceOfficerRoleCode.Other,
	// 				otherOfficerRole: 'Janitor',
	// 				isTreatedForMHC: null,
	// 				hasCriminalHistory: null,
	// 				previousNameFlag: BooleanTypeCode.No,
	// 				isBornInCanada: null,
	// 				proofOfCitizenship: null,
	// 				proofOfAbility: null,
	// 				citizenshipDocumentExpiryDate: null,
	// 				citizenshipDocumentPhotoAttachments: [],
	// 				governmentIssuedPhotoTypeCode: null,
	// 				hasBcDriversLicence: null,
	// 				hairColourCode: null,
	// 				eyeColourCode: null,
	// 				height: null,
	// 				heightUnitCode: null,
	// 				weight: null,
	// 				weightUnitCode: null,
	// 				useBcServicesCardPhoto: null,
	// 				swlCategoryList: [
	// 					{ desc: 'Closed Circuit Television Installer', code: WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller },
	// 				],
	// 			};
	// 			console.log('loadLicenceRenewal defaults', defaults);
	// 			// this.licenceModel = { ...defaults };
	// 			this.licenceModelFormGroup.patchValue({ ...defaults });
	// 			// this.notifyLoaded();
	// 			this.initialized = true;
	// 			this.spinnerService.hide('loaderSpinner');
	// 			observer.next(defaults);
	// 		}, 1000);
	// 	});
	// }

	// loadLicenceReplacement(): Observable<any> {
	// 	console.log('loadLicenceReplacement ');
	// 	this.spinnerService.show('loaderSpinner');
	// 	this.initialized = true;

	// 	return new Observable((observer) => {
	// 		setTimeout(() => {
	// 			const defaults: LicenceBackendModel = {
	// 				licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
	// 				applicationTypeCode: SwlApplicationTypeCode.Replacement,
	// 				isSoleProprietor: BooleanTypeCode.Yes,
	// 				currentLicenceNumber: '123456',
	// 				accessCode: '456',
	// 				oneLegalName: false,
	// 				givenName: 'Jane',
	// 				middleName1: 'Alice',
	// 				middleName2: 'Mary',
	// 				surname: 'Johnson',
	// 				genderCode: GenderCode.F,
	// 				dateOfBirth: '2009-10-07T00:00:00+00:00',
	// 				hasExpiredLicence: BooleanTypeCode.Yes,
	// 				expiredLicenceNumber: '789',
	// 				expiryDate: '2002-02-07T00:00:00+00:00',
	// 				useDogsOrRestraints: BooleanTypeCode.Yes,
	// 				isDogsPurposeProtection: true,
	// 				isDogsPurposeDetectionDrugs: false,
	// 				isDogsPurposeDetectionExplosives: true,
	// 				carryAndUseRetraints: true,
	// 				dogsPurposeDocumentType: DogDocumentCode.SecurityDogValidationCertificate,
	// 				carryAndUseRetraintsDocument: RestraintDocumentCode.TrainingEquivalent,
	// 				carryAndUseRetraintsAttachments: [],
	// 				licenceTermCode: SwlTermCode.ThreeYears,
	// 				isPoliceOrPeaceOfficer: null,
	// 				isTreatedForMHC: null,
	// 				hasCriminalHistory: null,
	// 				previousNameFlag: null,
	// 				isBornInCanada: null,
	// 				proofOfCitizenship: null,
	// 				proofOfAbility: null,
	// 				citizenshipDocumentExpiryDate: null,
	// 				citizenshipDocumentPhotoAttachments: [],
	// 				governmentIssuedPhotoTypeCode: null,
	// 				hasBcDriversLicence: null,
	// 				hairColourCode: null,
	// 				eyeColourCode: null,
	// 				height: null,
	// 				heightUnitCode: null,
	// 				weight: null,
	// 				weightUnitCode: null,
	// 				useBcServicesCardPhoto: null,
	// 				swlCategoryList: [
	// 					{ desc: 'Electronic Locking Device Installer', code: WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller },
	// 				],
	// 			};
	// 			console.log('loadLicenceReplacement defaults', defaults);
	// 			// this.licenceModel = { ...defaults };
	// 			this.licenceModelFormGroup.patchValue({ ...defaults });
	// 			// this.notifyLoaded();
	// 			this.initialized = true;
	// 			this.spinnerService.hide('loaderSpinner');
	// 			observer.next(defaults);
	// 		}, 1000);
	// 	});
	// }

	// loadLicenceUpdate(): Observable<any> {
	// 	console.log('loadLicenceUpdate ');
	// 	this.spinnerService.show('loaderSpinner');
	// 	this.initialized = true;

	// 	return new Observable((observer) => {
	// 		setTimeout(() => {
	// 			const defaults: LicenceBackendModel = {
	// 				licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
	// 				applicationTypeCode: SwlApplicationTypeCode.Update,
	// 				isSoleProprietor: BooleanTypeCode.Yes,
	// 				currentLicenceNumber: '123456',
	// 				accessCode: '456',
	// 				oneLegalName: false,
	// 				givenName: 'Jane',
	// 				middleName1: 'Alice',
	// 				middleName2: 'Mary',
	// 				surname: 'Johnson',
	// 				genderCode: GenderCode.F,
	// 				dateOfBirth: '2009-10-07T00:00:00+00:00',
	// 				hasExpiredLicence: BooleanTypeCode.Yes,
	// 				expiredLicenceNumber: '789',
	// 				expiryDate: '2002-02-07T00:00:00+00:00',
	// 				useDogsOrRestraints: BooleanTypeCode.Yes,
	// 				isDogsPurposeProtection: true,
	// 				isDogsPurposeDetectionDrugs: false,
	// 				isDogsPurposeDetectionExplosives: true,
	// 				carryAndUseRetraints: true,
	// 				dogsPurposeDocumentType: DogDocumentCode.SecurityDogValidationCertificate,
	// 				carryAndUseRetraintsDocument: RestraintDocumentCode.AdvancedSecurityTrainingCertificate,
	// 				carryAndUseRetraintsAttachments: [],
	// 				licenceTermCode: SwlTermCode.ThreeYears,
	// 				isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
	// 				officerRole: PoliceOfficerRoleCode.AuxiliaryorReserveConstable,
	// 				isTreatedForMHC: null,
	// 				hasCriminalHistory: null,
	// 				previousNameFlag: null,
	// 				isBornInCanada: null,
	// 				proofOfCitizenship: null,
	// 				proofOfAbility: null,
	// 				citizenshipDocumentExpiryDate: null,
	// 				citizenshipDocumentPhotoAttachments: [],
	// 				governmentIssuedPhotoTypeCode: null,
	// 				hasBcDriversLicence: null,
	// 				hairColourCode: null,
	// 				eyeColourCode: null,
	// 				height: null,
	// 				heightUnitCode: null,
	// 				weight: null,
	// 				weightUnitCode: null,
	// 				useBcServicesCardPhoto: null,
	// 				swlCategoryList: [
	// 					{ desc: 'Closed Circuit Television Installer', code: WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller },
	// 					{ desc: 'Electronic Locking Device Installer', code: WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller },
	// 				],
	// 			};
	// 			console.log('loadLicenceUpdate defaults', defaults);
	// 			// this.licenceModel = { ...defaults };
	// 			this.licenceModelFormGroup.patchValue({ ...defaults });
	// 			// this.notifyLoaded();
	// 			this.initialized = true;
	// 			this.spinnerService.hide('loaderSpinner');
	// 			observer.next(defaults);
	// 		}, 1000);
	// 	});
	// }

	saveLicence(): void {
		this.hotToastService.success('Licence information has been saved');
		// console.log('SAVE LICENCE DATA', this.licenceModel);
		// this.licenceModelFormGroup.markAllAsTouched();
		console.log('SAVE LICENCE FORM DATA', this.licenceModelFormGroup.valid, this.licenceModelFormGroup.value);
	}

	// clearLicenceCategoryData(code: WorkerCategoryTypeCode): void {
	// switch (code) {
	// 	case WorkerCategoryTypeCode.ArmouredCarGuard:
	// 		delete this.licenceModel.licenceCategoryArmouredCarGuard;
	// 		break;
	// 	case WorkerCategoryTypeCode.BodyArmourSales:
	// 		delete this.licenceModel.licenceCategoryBodyArmourSales;
	// 		break;
	// 	case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
	// 		delete this.licenceModel.licenceCategoryyClosedCircuitTelevisionInstaller;
	// 		break;
	// 	case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
	// 		delete this.licenceModel.licenceCategoryElectronicLockingDeviceInstaller;
	// 		break;
	// 	case WorkerCategoryTypeCode.FireInvestigator:
	// 		delete this.licenceModel.licenceCategoryFireInvestigator;
	// 		break;
	// 	case WorkerCategoryTypeCode.Locksmith:
	// 		delete this.licenceModel.licenceCategoryLocksmith;
	// 		break;
	// 	case WorkerCategoryTypeCode.LocksmithSup:
	// 		delete this.licenceModel.licenceCategoryLocksmithSup;
	// 		break;
	// 	case WorkerCategoryTypeCode.PrivateInvestigator:
	// 		delete this.licenceModel.licenceCategoryPrivateInvestigator;
	// 		break;
	// 	case WorkerCategoryTypeCode.PrivateInvestigatorSup:
	// 		delete this.licenceModel.licenceCategoryPrivateInvestigatorSup;
	// 		break;
	// 	case WorkerCategoryTypeCode.SecurityAlarmInstallerSup:
	// 		delete this.licenceModel.licenceCategorySecurityAlarmInstallerSup;
	// 		break;
	// 	case WorkerCategoryTypeCode.SecurityAlarmInstaller:
	// 		delete this.licenceModel.licenceCategorySecurityAlarmInstaller;
	// 		break;
	// 	case WorkerCategoryTypeCode.SecurityAlarmMonitor:
	// 		delete this.licenceModel.licenceCategorySecurityAlarmMonitor;
	// 		break;
	// 	case WorkerCategoryTypeCode.SecurityAlarmResponse:
	// 		delete this.licenceModel.licenceCategorySecurityAlarmResponse;
	// 		break;
	// 	case WorkerCategoryTypeCode.SecurityAlarmSales:
	// 		delete this.licenceModel.licenceCategorySecurityAlarmSales;
	// 		break;
	// 	case WorkerCategoryTypeCode.SecurityConsultant:
	// 		delete this.licenceModel.licenceCategorySecurityConsultant;
	// 		break;
	// 	case WorkerCategoryTypeCode.SecurityGuard:
	// 		delete this.licenceModel.licenceCategorySecurityGuard;
	// 		break;
	// 	case WorkerCategoryTypeCode.SecurityGuardSup:
	// 		delete this.licenceModel.licenceCategorySecurityGuardSup;
	// 		break;
	// }
	// }

	// clearAllLicenceCategoryData(): void {
	// call function to delete all licence category data
	// delete this.licenceModel.licenceCategoryArmouredCarGuard;
	// delete this.licenceModel.licenceCategoryBodyArmourSales;
	// delete this.licenceModel.licenceCategoryyClosedCircuitTelevisionInstaller;
	// delete this.licenceModel.licenceCategoryElectronicLockingDeviceInstaller;
	// delete this.licenceModel.licenceCategoryFireInvestigator;
	// delete this.licenceModel.licenceCategoryLocksmithSup;
	// delete this.licenceModel.licenceCategoryLocksmith;
	// delete this.licenceModel.licenceCategoryPrivateInvestigatorSup;
	// delete this.licenceModel.licenceCategoryPrivateInvestigator;
	// delete this.licenceModel.licenceCategorySecurityAlarmInstallerSup;
	// delete this.licenceModel.licenceCategorySecurityAlarmInstaller;
	// delete this.licenceModel.licenceCategorySecurityAlarmMonitor;
	// delete this.licenceModel.licenceCategorySecurityAlarmResponse;
	// delete this.licenceModel.licenceCategorySecurityAlarmSales;
	// delete this.licenceModel.licenceCategorySecurityConsultant;
	// delete this.licenceModel.licenceCategorySecurityGuardSup;
	// delete this.licenceModel.licenceCategorySecurityGuard;
	// }

	// notifyModelChanged(updatedData: any): void {
	// 	// const licenceModel = { ...this.licenceModel, ...updatedData };
	// 	// this.cleanLicenceModel(licenceModel);
	// 	// this.licenceModel = { ...licenceModel };
	// 	// console.log('notifyModelChanged licenceModel', this.licenceModel);

	// 	// this.licenceModelFormGroup.patchValue({ ...updatedData });

	// 	console.log(
	// 		'notifyModelChanged licenceModelFormGroup',
	// 		this.licenceModelFormGroup.valid,
	// 		this.licenceModelFormGroup.value
	// 	);
	// 	this.licenceModelLoaded$.next({ isUpdated: true });
	// }

	// notifyLoaded(): void {
	// 	this.setFlags();
	// 	console.log('notifyLoaded', this.licenceModelFormGroup.value);
	// 	this.licenceModelLoaded$.next({ isLoaded: true });
	// }

	// notifyUpdateFlags(): void {
	// 	this.setFlags();
	// 	console.log('notifyUpdateFlags', this.licenceModelFormGroup.value);
	// 	this.licenceModelLoaded$.next({ isSetFlags: true });
	// }

	// notifyCategoryData(): void {
	// 	console.log('notifyCategoryData', this.licenceModelFormGroup.value);
	// 	this.licenceModelLoaded$.next({ isCategoryLoaded: true });
	// }

	// private cleanLicenceModel(origLicenceModel: LicenceModel): LicenceModel {
	// 	//TODO when to clean model?
	// 	return origLicenceModel;
	// }

	// private setFlags(): void {
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
	// 	(item) => item.code == WorkerCategoryTypeCode.SecurityGuard
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
	// }
}
