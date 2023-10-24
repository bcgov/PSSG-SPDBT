import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import {
	AliasesData,
	ApplicationTypeCode,
	ApplicationTypeData,
	BcDriversLicenceData,
	CharacteristicsData,
	CitizenshipData,
	ContactInformationData,
	CriminalHistoryData,
	Documents,
	DocumentTypeCode,
	DogsAuthorizationData,
	ExpiredLicenceData,
	EyeColourCode,
	GenderCode,
	GovIssuedIdData,
	HairColourCode,
	HeightUnitCode,
	LicenceTermCode,
	LicenceTermData,
	LicenceTypeData,
	MailingAddressData,
	MentalHealthConditionsData,
	PersonalInformationData,
	PhotographOfYourselfData,
	PoliceBackgroundData,
	PoliceOfficerRoleCode,
	ProofOfFingerprintData,
	ResidentialAddressData,
	RestraintsAuthorizationData,
	SoleProprietorData,
	WeightUnitCode,
	WorkerCategoryTypeCode,
	WorkerLicenceCategoryData,
	WorkerLicenceCreateRequest,
	WorkerLicenceTypeCode,
} from 'src/app/api/models';
import { WorkerLicensingService } from 'src/app/api/services';
import {
	BooleanTypeCode,
	LocksmithRequirementCode,
	PrivateInvestigatorRequirementCode,
	PrivateInvestigatorSupRequirementCode,
	PrivateInvestigatorTrainingCode,
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
			attachments: new FormControl(''),
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
					'attachments',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	mentalHealthConditionsFormGroup: FormGroup = this.formBuilder.group(
		{
			isTreatedForMHC: new FormControl('', [FormControlValidators.required]),
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isTreatedForMHC')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	criminalHistoryFormGroup: FormGroup = this.formBuilder.group({
		hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
	});

	proofOfFingerprintFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl('', [Validators.required]),
	});

	citizenshipFormGroup: FormGroup = this.formBuilder.group(
		{
			isBornInCanada: new FormControl('', [FormControlValidators.required]),
			proofTypeCode: new FormControl('', [FormControlValidators.required]),
			expiryDate: new FormControl(''),
			attachments: new FormControl([], [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) =>
						form.get('proofOfAbility')?.value == DocumentTypeCode.WorkPermit ||
						form.get('proofOfAbility')?.value == DocumentTypeCode.StudyPermit
				),
			],
		}
	);

	govIssuedIdFormGroup: FormGroup = this.formBuilder.group({
		governmentIssuedPhotoTypeCode: new FormControl('', [FormControlValidators.required]),
		governmentIssuedPhotoExpiryDate: new FormControl(''),
		attachments: new FormControl('', [Validators.required]),
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
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
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
		licenceId: new FormControl(''),
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
		private spinnerService: NgxSpinnerService,
		private workerLicensingService: WorkerLicensingService
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
						carryAndUseRetraintsDocument: DocumentTypeCode.RestraintsAdvancedSecurityTrainingCertificate,
						attachments: [myFile],
					},
					dogsAuthorizationData: {
						useDogs: BooleanTypeCode.Yes,
						dogsPurposeFormGroup: {
							isDogsPurposeProtection: true,
							isDogsPurposeDetectionDrugs: false,
							isDogsPurposeDetectionExplosives: true,
						},
						dogsPurposeDocumentType: DocumentTypeCode.DogsCertificateOfAdvancedSecurityTraining,
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
						attachments: [myFile],
					},
					mentalHealthConditionsData: {
						isTreatedForMHC: BooleanTypeCode.Yes,
						attachments: [myFile],
					},
					criminalHistoryData: {
						hasCriminalHistory: BooleanTypeCode.No,
					},
					proofOfFingerprintData: {
						attachments: [myFile],
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
						proofTypeCode: DocumentTypeCode.BirthCertificate,
						expiryDate: null,
						attachments: [myFile],
					},
					govIssuedIdData: {
						governmentIssuedPhotoTypeCode: DocumentTypeCode.BcServicesCard,
						attachments: [myFile],
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
						attachments: [myFile],
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
						requirementCode: LocksmithRequirementCode.CategoryLocksmith_ExperienceAndApprenticeship,
						attachments: [myFile],
					},
					categoryLocksmithSupFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryPrivateInvestigatorSupFormGroup: {
						isInclude: true,
						requirementCode:
							PrivateInvestigatorSupRequirementCode.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion,
						attachments: [myFile],
						trainingAttachments: [myFile],
					},
					categoryPrivateInvestigatorFormGroup: {
						isInclude: true,
						requirementCode: PrivateInvestigatorRequirementCode.CategoryPrivateInvestigator_ExperienceAndCourses,
						trainingCode: PrivateInvestigatorTrainingCode.CompleteOtherCoursesOrKnowledge,
						attachments: [myFile],
						trainingAttachments: [myFile],
						fireCourseCertificateAttachments: [myFile],
						fireVerificationLetterAttachments: [myFile],
						addFireInvestigator: BooleanTypeCode.Yes,
					},
					categorySecurityAlarmInstallerFormGroup: {
						isInclude: true,
						requirementCode:
							SecurityAlarmInstallerRequirementCode.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent,
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
						requirementCode: SecurityConsultantRequirementCode.CategorySecurityConsultant_RecommendationLetters,
						attachments: [myFile],
						resumeAttachments: [myFile],
					},
					categorySecurityGuardFormGroup: {
						isInclude: true,
						attachments: [myFile],
						requirementCode: SecurityGuardRequirementCode.CategorySecurityGuard_BasicSecurityTrainingCertificate,
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
						attachments: [myFile],
					},
					aliasesData: {
						previousNameFlag: BooleanTypeCode.No,
					},
					citizenshipData: {
						isBornInCanada: BooleanTypeCode.Yes,
						proofTypeCode: DocumentTypeCode.BirthCertificate,
						expiryDate: null,
						attachments: [myFile],
					},
					govIssuedIdData: {
						governmentIssuedPhotoTypeCode: DocumentTypeCode.BcServicesCard,
						attachments: [myFile],
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

	saveLicence(): void {
		const formValue = this.licenceModelFormGroup.value;
		console.log('formValue', formValue);

		const aliasesData: AliasesData = {
			aliases: formValue.aliasesData.aliases,
			hasPreviousName: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes,
		};

		const applicationTypeData: ApplicationTypeData = {
			applicationTypeCode: formValue.applicationTypeData.applicationTypeCode,
		};

		const bcDriversLicenceData: BcDriversLicenceData = {
			bcDriversLicenceNumber: formValue.bcDriversLicenceData.bcDriversLicenceNumber,
			hasBcDriversLicence: formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes,
		};

		const categoriesData: null | Array<WorkerLicenceCategoryData> = [];

		if (formValue.categoryArmouredCarGuardFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Documents = {
				attachments: [...formValue.categoryArmouredCarGuardFormGroup.attachments],
				documentTypeCode: DocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
				expiryDate: formValue.categoryArmouredCarGuardFormGroup.documentExpiryDate,
			};
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: [workerLicenceCategoryDocs],
				workerCategoryTypeCode: WorkerCategoryTypeCode.ArmouredCarGuard,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categoryBodyArmourSalesFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.BodyArmourSales,
			});
		}

		if (formValue.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
			});
		}

		if (formValue.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
			});
		}

		if (formValue.categoryFireInvestigatorFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<Documents> = [
				{
					attachments: [...formValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments],
					documentTypeCode: DocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
				},
				{
					attachments: [...formValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments],
					documentTypeCode: DocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.FireInvestigator,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categoryLocksmithFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<Documents> = [
				{
					attachments: [...formValue.categoryLocksmithFormGroup.attachments],
					documentTypeCode: formValue.categoryLocksmithFormGroup.requirementCode,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.Locksmith,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categoryLocksmithSupFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.LocksmithUnderSupervision,
			});
		}

		if (formValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<Documents> = [
				{
					attachments: [...formValue.categoryPrivateInvestigatorFormGroup.attachments],
					documentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.requirementCode,
				},
				{
					attachments: [...formValue.categoryPrivateInvestigatorFormGroup.trainingAttachments],
					documentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.trainingCode,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigator,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<Documents> = [
				{
					attachments: [...formValue.categoryPrivateInvestigatorSupFormGroup.attachments],
					documentTypeCode: formValue.categoryPrivateInvestigatorSupFormGroup.requirementCode,
				},
				{
					attachments: [...formValue.categoryPrivateInvestigatorSupFormGroup.trainingAttachments],
					documentTypeCode: DocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionTraining,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<Documents> = [
				{
					attachments: [...formValue.categorySecurityGuardFormGroup.attachments],
					documentTypeCode: formValue.categorySecurityGuardFormGroup.requirementCode,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuard,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categorySecurityGuardSupFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
			});
		}

		if (formValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<Documents> = [
				{
					attachments: [...formValue.categorySecurityAlarmInstallerFormGroup.attachments],
					documentTypeCode: formValue.categorySecurityAlarmInstallerFormGroup.requirementCode,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstaller,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
			});
		}

		if (formValue.categorySecurityAlarmMonitorFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmMonitor,
			});
		}

		if (formValue.categorySecurityAlarmResponseFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmResponse,
			});
		}

		if (formValue.categorySecurityAlarmSalesFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmSales,
			});
		}

		if (formValue.categorySecurityConsultantFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<Documents> = [
				{
					attachments: [...formValue.categorySecurityConsultantFormGroup.attachments],
					documentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
				},
				{
					attachments: [...formValue.categorySecurityConsultantFormGroup.resumeAttachments],
					documentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
				},
			];

			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityConsultant,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		const characteristicsData: CharacteristicsData = { ...formValue.characteristicsData };

		const citizenshipDocs: Documents = {
			attachments: [...formValue.citizenshipData.attachments],
			documentTypeCode: formValue.citizenshipData.proofTypeCode,
			expiryDate: formValue.citizenshipData.expiryDate,
		};
		const citizenshipData: CitizenshipData = {
			documents: citizenshipDocs,
			isBornInCanada: formValue.citizenshipData.isBornInCanada == BooleanTypeCode.Yes,
		};

		const contactInformationData: ContactInformationData = { ...formValue.contactInformationData };

		const criminalHistoryData: CriminalHistoryData = { ...formValue.criminalHistoryData };

		const dogsAuthorizationDocs: Documents = {
			attachments: [...formValue.dogsAuthorizationData.attachments],
			documentTypeCode: formValue.dogsAuthorizationData.dogsPurposeDocumentType,
		};
		const dogsAuthorizationData: DogsAuthorizationData = {
			documents: dogsAuthorizationDocs,
			isDogsPurposeDetectionDrugs: formValue.dogsAuthorizationData.isDogsPurposeDetectionDrugs,
			isDogsPurposeDetectionExplosives: formValue.dogsAuthorizationData.isDogsPurposeDetectionExplosives,
			isDogsPurposeProtection: formValue.dogsAuthorizationData.isDogsPurposeProtection,
			useDogs: formValue.dogsAuthorizationData.useDogs == BooleanTypeCode.Yes,
		};

		const expiredLicenceData: ExpiredLicenceData = { ...formValue.expiredLicenceData };

		const govIssuedIdDocs: Documents = {
			attachments: [...formValue.govIssuedIdData.attachments],
			documentTypeCode: formValue.govIssuedIdData.governmentIssuedPhotoTypeCode,
		};
		const govIssuedIdData: GovIssuedIdData = {
			documents: govIssuedIdDocs,
		};

		const licenceId = formValue.licenceId;

		const licenceTermData: LicenceTermData = { ...formValue.licenceTermData };

		const licenceTypeData: LicenceTypeData = { ...formValue.licenceTypeData };

		const mailingAddressData: MailingAddressData = { ...formValue.mailingAddressData };

		const mentalHealthConditionsDocs: Documents = {
			attachments: [...formValue.mentalHealthConditionsData.attachments],
			documentTypeCode: formValue.mentalHealthConditionsData.governmentIssuedPhotoTypeCode,
		};
		const mentalHealthConditionsData: MentalHealthConditionsData = {
			documents: mentalHealthConditionsDocs,
			isTreatedForMHC: formValue.mentalHealthConditionsData.isTreatedForMHC == BooleanTypeCode.Yes,
		};

		const personalInformationData: PersonalInformationData = { ...formValue.personalInformationData };

		const photographOfYourselfDocs: Documents = {
			attachments: [...formValue.photographOfYourselfData.attachments],
			documentTypeCode: DocumentTypeCode.PhotoOfYourself,
		};
		const photographOfYourselfData: PhotographOfYourselfData = {
			documents: photographOfYourselfDocs,
			useBcServicesCardPhoto: formValue.photographOfYourselfData.useBcServicesCardPhoto == BooleanTypeCode.Yes,
		};

		const policeBackgroundDocs: Documents = {
			attachments: [...formValue.policeBackgroundData.attachments],
			documentTypeCode: DocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
		};
		const policeBackgroundData: PoliceBackgroundData = {
			documents: policeBackgroundDocs,
			isPoliceOrPeaceOfficer: formValue.policeBackgroundData.isPoliceOrPeaceOfficer == BooleanTypeCode.Yes,
			otherOfficerRole: formValue.policeBackgroundData.otherOfficerRole,
			policeOfficerRoleCode: formValue.policeBackgroundData.policeOfficerRoleCode,
		};

		const proofOfFingerprintDocs: Documents = {
			attachments: [...formValue.proofOfFingerprintData.attachments],
			documentTypeCode: DocumentTypeCode.ProofOfFingerprint,
		};
		const proofOfFingerprintData: ProofOfFingerprintData = {
			documents: proofOfFingerprintDocs,
		};

		const residentialAddressData: ResidentialAddressData = { ...formValue.residentialAddressData };

		const restraintsAuthorizationDocs: Documents = {
			attachments: [...formValue.restraintsAuthorizationData.attachments],
			documentTypeCode: formValue.restraintsAuthorizationData.carryAndUseRetraintsDocument,
		};
		const restraintsAuthorizationData: RestraintsAuthorizationData = {
			carryAndUseRetraints: formValue.restraintsAuthorizationData.carryAndUseRetraints == BooleanTypeCode.Yes,
			documents: restraintsAuthorizationDocs,
		};

		const soleProprietorData: SoleProprietorData = {
			isSoleProprietor: formValue.soleProprietorData.isSoleProprietor == BooleanTypeCode.Yes,
		};

		const body: WorkerLicenceCreateRequest = {
			aliasesData,
			applicationTypeData,
			bcDriversLicenceData,
			categoriesData,
			characteristicsData,
			citizenshipData,
			contactInformationData,
			criminalHistoryData,
			dogsAuthorizationData,
			expiredLicenceData,
			govIssuedIdData,
			licenceId,
			licenceTermData,
			licenceTypeData,
			mailingAddressData,
			mentalHealthConditionsData,
			personalInformationData,
			photographOfYourselfData,
			policeBackgroundData,
			proofOfFingerprintData,
			residentialAddressData,
			restraintsAuthorizationData,
			soleProprietorData,
		};
		// const body = {
		// 	LicenceId: formValue.licenceId,
		// 	'LicenceTypeData.WorkerLicenceTypeCode': formValue.licenceTypeData.licenceTypeCode,
		// 	'ApplicationTypeData.ApplicationTypeCode': formValue.applicationTypeData.applicationTypeCode,
		// 	'SoleProprietorData.isSoleProprietor': formValue.soleProprietorData.isSoleProprietor,
		// };

		console.log('*************** body to save:', body);
		// this.workerLicensingService
		// 	.apiWorkerLicencesPost()
		// 	.pipe()
		// 	.subscribe((resp: WorkerLicenceCreateResponse) => {
		// 		this.licenceModelFormGroup.patchValue({ licenceId: resp.licenceId }, { emitEvent: false });
		this.hotToastService.success('Licence information has been saved');
		// 		console.log('SAVE LICENCE FORM DATA', this.licenceModelFormGroup.valid, this.licenceModelFormGroup.value);
		// 	});
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
