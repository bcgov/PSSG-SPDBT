import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, forkJoin, Observable, take, tap } from 'rxjs';
import {
	ApplicationTypeCode,
	Documents,
	DocumentTypeCode,
	EyeColourCode,
	GenderCode,
	HairColourCode,
	HeightUnitCode,
	LicenceTermCode,
	PoliceOfficerRoleCode,
	WeightUnitCode,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
	WorkerLicenceUpsertRequest,
	WorkerLicenceUpsertResponse,
} from 'src/app/api/models';
import { WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import {
	BooleanTypeCode,
	LocksmithRequirementCode,
	PrivateInvestigatorRequirementCode,
	PrivateInvestigatorSupRequirementCode,
	PrivateInvestigatorTrainingCode,
	SecurityAlarmInstallerRequirementCode,
	SecurityConsultantRequirementCode,
	SecurityGuardRequirementCode,
	SelectOptions,
	WorkerCategoryTypes,
} from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';

export interface LicenceStepperStepComponent {
	onStepNext(formNumber: string): void;
	onStepPrevious(): void;
	onFormValidNextStep(formNumber: string): void;
	onStepSelectionChange(event: StepperSelectionEvent): void;
	onGoToNextStep(): void;
	onGoToFirstStep(): void;
	onGoToLastStep(): void;
}

export interface LicenceChildStepperStepComponent {
	isFormValid(): boolean;
}

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService {
	initialized = false;

	booleanTypeCodes = BooleanTypeCode;

	licenceModelLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	hasValueChanged = false;
	hasDocumentsChanged = false;

	workerLicenceTypeFormGroup: FormGroup = this.formBuilder.group({
		workerLicenceTypeCode: new FormControl('', [Validators.required]),
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
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
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
	});
	categoryClosedCircuitTelevisionInstallerFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categoryElectronicLockingDeviceInstallerFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categoryLocksmithSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityAlarmInstallerSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityAlarmMonitorFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityAlarmResponseFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityAlarmSalesFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityGuardSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
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
					(form) => this.categorySecurityGuardFormGroup?.get('isInclude')?.value ?? false
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
					(form) => this.categorySecurityGuardFormGroup?.get('isInclude')?.value ?? false
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
			addressSelected: new FormControl(false),
			mailingAddressLine1: new FormControl(''),
			mailingAddressLine2: new FormControl(''),
			mailingCity: new FormControl(''),
			mailingPostalCode: new FormControl(''),
			mailingProvince: new FormControl(''),
			mailingCountry: new FormControl(''),
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
		licenceApplicationId: new FormControl(null),
		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
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
		private utilService: UtilService,
		private configService: ConfigService,
		private spinnerService: NgxSpinnerService,
		private workerLicensingService: WorkerLicensingService
	) {}

	reset(): void {
		this.initialized = false;
		this.licenceModelFormGroup.reset();

		const aliases = this.licenceModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		aliases.clear();

		console.debug('RESET licenceModelFormGroup', this.licenceModelFormGroup.value);
	}

	createNewLicence(): Observable<any> {
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				this.licenceModelFormGroup.reset();
				console.debug('NEW licenceModelFormGroup', this.licenceModelFormGroup.value);

				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(this.licenceModelFormGroup.value);
			}, 1000);
		});
	}

	loadLicenceNew(): Observable<any> {
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myBlob = new Blob();
				const myFile = this.utilService.blobToFile(myBlob, 'test1.doc');

				const defaults: any = {
					workerLicenceTypeData: {
						workerLicenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit,
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
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myBlob = new Blob();
				const myFile = this.utilService.blobToFile(myBlob, 'test.doc');

				const defaults: any = {
					workerLicenceTypeData: {
						workerLicenceTypeCode: WorkerLicenceTypeCode.BodyArmourPermit,
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
		// console.debug(
		// 	'isStep1Complete',
		// 	this.workerLicenceTypeFormGroup.valid,
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
			this.workerLicenceTypeFormGroup.valid &&
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
		// console.debug(
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
		// console.debug(
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

	getValidCategoryList(categoryList: string[]): SelectOptions<string>[] {
		const invalidCategories = this.configService.configs?.invalidWorkerLicenceCategoryMatrixConfiguration!;
		let updatedList = [...WorkerCategoryTypes];

		categoryList.forEach((item) => {
			updatedList = updatedList.filter((cat) => !invalidCategories[item].includes(cat.code as WorkerCategoryTypeCode));
		});

		return [...updatedList];
	}

	saveLicence(): any {
		console.log('saveLicence', this.hasValueChanged, this.hasDocumentsChanged);

		// if (this.hasValueChanged && this.hasDocumentsChanged) {
		// 	return forkJoin([this.saveLicenceBasicInformation(), this.saveLicenceDocuments()]);
		// } else if (this.hasValueChanged) {
		// 	return forkJoin([this.saveLicenceBasicInformation()]);
		// } else if (this.hasDocumentsChanged) {
		// 	return forkJoin([this.saveLicenceDocuments()]);
		// }
		if (this.hasValueChanged) {
			return forkJoin([this.saveLicenceBasicInformation()]);
		}
	}

	private saveLicenceBasicInformation(): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {
		const formValue = this.licenceModelFormGroup.value;
		console.debug('saveLicenceBasicInformation licenceModelFormGroup', formValue);

		const workerLicenceTypeData = { ...formValue.workerLicenceTypeData };
		const applicationTypeData = { ...formValue.applicationTypeData };
		const soleProprietorData = { ...formValue.soleProprietorData };
		const contactInformationData = { ...formValue.contactInformationData };
		const expiredLicenceData = { ...formValue.expiredLicenceData };
		const characteristicsData = { ...formValue.characteristicsData };
		const personalInformationData = { ...formValue.personalInformationData };
		const residentialAddressData = { ...formValue.residentialAddressData };
		const mailingAddressData = { ...formValue.mailingAddressData };

		const body: WorkerLicenceUpsertRequest = {
			licenceApplicationId: formValue.licenceApplicationId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			isSoleProprietor: soleProprietorData.isSoleProprietor == BooleanTypeCode.Yes,
			// hasPreviousName: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes,
			// aliases: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes ? formValue.aliasesData.aliases : [],
			// hasBcDriversLicence: formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes,
			// bcDriversLicenceNumber:
			// 	formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
			// 		? formValue.bcDriversLicenceData.bcDriversLicenceNumber
			// 		: null,
			// contactEmailAddress: contactInformationData.contactEmailAddress,
			// contactPhoneNumber: contactInformationData.contactPhoneNumber,
			// dateOfBirth: formValue.applicationTypeData.dateOfBirth,
			// hasExpiredLicence: formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes,
			// expiredLicenceNumber:
			// 	formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes
			// 		? expiredLicenceData.expiredLicenceNumber
			// 		: null,
			// expiryDate:
			// 	formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiryDate : null,
			// eyeColourCode: characteristicsData.eyeColourCode,
			// hairColourCode: characteristicsData.hairColourCode,
			// height: characteristicsData.height,
			// heightUnitCode: characteristicsData.heightUnitCode,
			// weight: characteristicsData.weight,
			// weightUnitCode: characteristicsData.weightUnitCode,
			// genderCode: personalInformationData.genderCode,
			// givenName: personalInformationData.givenName,
			// oneLegalName: personalInformationData.oneLegalName,
			// middleName1: personalInformationData.middleName1,
			// middleName2: personalInformationData.middleName2,
			// surname: personalInformationData.surname,
			// hasCriminalHistory: formValue.applicationTypeData.hasCriminalHistory == BooleanTypeCode.Yes,
			// licenceTermCode: formValue.applicationTypeData.licenceTermCode,
			// isMailingTheSameAsResidential: residentialAddressData.isMailingTheSameAsResidential,
			// mailingAddressData: residentialAddressData.isMailingTheSameAsResidential
			// 	? residentialAddressData
			// 	: mailingAddressData,
			// residentialAddressData,
		};
		return this.workerLicensingService.apiAnonymousWorkerLicencesPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<WorkerLicenceUpsertResponse>) => {
				if (!formValue.licenceApplicationId) {
					this.licenceModelFormGroup.patchValue(
						{ licenceApplicationId: res.body.licenceApplicationId },
						{ emitEvent: false }
					);
				}
			})
		);
	}

	private saveLicenceDocuments(): any {
		const formValue = this.licenceModelFormGroup.value;
		console.debug('saveLicenceDocuments licenceModelFormGroup', formValue);

		const documents: Array<Documents> = [];

		if (formValue.categoryArmouredCarGuardFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Documents = {
				attachments: [...formValue.categoryArmouredCarGuardFormGroup.attachments],
				documentTypeCode: DocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
				expiryDate: formValue.categoryArmouredCarGuardFormGroup.documentExpiryDate,
			};
			documents.push(workerLicenceCategoryDocs);
		}

		if (formValue.categoryFireInvestigatorFormGroup.isInclude) {
			documents.push({
				attachments: [...formValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments],
				documentTypeCode: DocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
			});
			documents.push({
				attachments: [...formValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments],
				documentTypeCode: DocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
			});
		}

		if (formValue.categoryLocksmithFormGroup.isInclude) {
			documents.push({
				attachments: [...formValue.categoryLocksmithFormGroup.attachments],
				documentTypeCode: formValue.categoryLocksmithFormGroup.requirementCode,
			});
		}

		if (formValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			documents.push({
				attachments: [...formValue.categoryPrivateInvestigatorFormGroup.attachments],
				documentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.requirementCode,
			});
			documents.push({
				attachments: [...formValue.categoryPrivateInvestigatorFormGroup.trainingAttachments],
				documentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.trainingCode,
			});
		}

		if (formValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			documents.push({
				attachments: [...formValue.categoryPrivateInvestigatorSupFormGroup.attachments],
				documentTypeCode: formValue.categoryPrivateInvestigatorSupFormGroup.requirementCode,
			});
			documents.push({
				attachments: [...formValue.categoryPrivateInvestigatorSupFormGroup.trainingAttachments],
				documentTypeCode: DocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionTraining,
			});
		}

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			documents.push({
				attachments: [...formValue.categorySecurityGuardFormGroup.attachments],
				documentTypeCode: formValue.categorySecurityGuardFormGroup.requirementCode,
			});
		}

		if (formValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			documents.push({
				attachments: [...formValue.categorySecurityAlarmInstallerFormGroup.attachments],
				documentTypeCode: formValue.categorySecurityAlarmInstallerFormGroup.requirementCode,
			});
		}

		if (formValue.categorySecurityConsultantFormGroup.isInclude) {
			documents.push({
				attachments: [...formValue.categorySecurityConsultantFormGroup.attachments],
				documentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
			});
			documents.push({
				attachments: [...formValue.categorySecurityConsultantFormGroup.resumeAttachments],
				documentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
			});
		}

		if (formValue.citizenshipData.attachments) {
			documents.push({
				attachments: [...formValue.citizenshipData.attachments],
				documentTypeCode: formValue.citizenshipData.proofTypeCode,
				expiryDate: formValue.citizenshipData.expiryDate,
			});

			const includeAdditionalGovermentIdStepData =
				(formValue.citizenshipData.isBornInCanada == BooleanTypeCode.Yes &&
					formValue.citizenshipData.proofTypeCode != DocumentTypeCode.CanadianPassport) ||
				(formValue.citizenshipData.isBornInCanada == BooleanTypeCode.No &&
					formValue.citizenshipData.proofOfAbility != DocumentTypeCode.PermanentResidentCard);

			if (includeAdditionalGovermentIdStepData) {
				const govIssuedIdDocs: Documents = {
					attachments: [...formValue.govIssuedIdData.attachments],
					documentTypeCode: formValue.govIssuedIdData.governmentIssuedPhotoTypeCode,
				};
				documents.push(govIssuedIdDocs);
			}
		}

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			documents.push({
				attachments: [...formValue.dogsAuthorizationData.attachments],
				documentTypeCode: formValue.dogsAuthorizationData.dogsPurposeDocumentType,
			});

			documents.push({
				attachments: [...formValue.restraintsAuthorizationData.attachments],
				documentTypeCode: formValue.restraintsAuthorizationData.carryAndUseRetraintsDocument,
			});
		}

		if (formValue.mentalHealthConditionsData.attachments) {
			documents.push({
				attachments: [...formValue.mentalHealthConditionsData.attachments],
				documentTypeCode: DocumentTypeCode.MentalHealthCondition,
			});
		}

		if (formValue.photographOfYourselfData.attachments) {
			documents.push({
				attachments: [...formValue.photographOfYourselfData.attachments],
				documentTypeCode: DocumentTypeCode.PhotoOfYourself,
			});
		}

		const isPoliceOrPeaceOfficer = formValue.policeBackgroundData.isPoliceOrPeaceOfficer == BooleanTypeCode.Yes;
		if (isPoliceOrPeaceOfficer && formValue.policeBackgroundData.attachments) {
			documents.push({
				attachments: [...formValue.policeBackgroundData.attachments],
				documentTypeCode: DocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			});
		}

		if (formValue.proofOfFingerprintData.attachments) {
			documents.push({
				attachments: [...formValue.proofOfFingerprintData.attachments],
				documentTypeCode: DocumentTypeCode.ProofOfFingerprint,
			});
		}

		console.debug('*************** documents to save:', documents);

		// return this.workerLicensingService.apiWorkerLicencesPost$Response({ body });
	}

	/*
	xxxxxxxxxxxxxxx(): any {
		const formValue = this.licenceModelFormGroup.value;
		console.debug('saveLicence licenceModelFormGroup', formValue);
		const aliasesData: AliasesData = {
			hasPreviousName: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes,
			aliases: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes ? formValue.aliasesData.aliases : [],
		};

		const applicationTypeData: ApplicationTypeData = {
			applicationTypeCode: formValue.applicationTypeData.applicationTypeCode,
		};

		const bcDriversLicenceData: BcDriversLicenceData = {
			bcDriversLicenceNumber:
				formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
					? formValue.bcDriversLicenceData.bcDriversLicenceNumber
					: '',
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

		let citizenshipData: CitizenshipData = {};
		let govIssuedIdData: GovIssuedIdData = {};

		if (formValue.citizenshipData.attachments) {
			const citizenshipDocs: Documents = {
				attachments: [...formValue.citizenshipData.attachments],
				documentTypeCode: formValue.citizenshipData.proofTypeCode,
				expiryDate: formValue.citizenshipData.expiryDate,
			};
			citizenshipData = {
				documents: citizenshipDocs,
				isBornInCanada: formValue.citizenshipData.isBornInCanada == BooleanTypeCode.Yes,
			};

			const includeAdditionalGovermentIdStepData =
				(citizenshipData && formValue.citizenshipData.proofTypeCode != DocumentTypeCode.CanadianPassport) ||
				(!citizenshipData.isBornInCanada &&
					formValue.citizenshipData.proofTypeCode != DocumentTypeCode.PermanentResidentCard);

			if (includeAdditionalGovermentIdStepData) {
				const govIssuedIdDocs: Documents = {
					attachments: [...formValue.govIssuedIdData.attachments],
					documentTypeCode: formValue.govIssuedIdData.governmentIssuedPhotoTypeCode,
				};
				govIssuedIdData = {
					documents: govIssuedIdDocs,
				};
			}
		}

		const contactInformationData: ContactInformationData = { ...formValue.contactInformationData };

		const criminalHistoryData: CriminalHistoryData = { ...formValue.criminalHistoryData };

		let dogsAuthorizationData: DogsAuthorizationData = {};
		let restraintsAuthorizationData: RestraintsAuthorizationData = {};

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			const dogsAuthorizationDocs: Documents = {
				attachments: [...formValue.dogsAuthorizationData.attachments],
				documentTypeCode: formValue.dogsAuthorizationData.dogsPurposeDocumentType,
			};
			const useDogs = formValue.dogsAuthorizationData.useDogs == BooleanTypeCode.Yes;
			dogsAuthorizationData = {
				documents: useDogs ? dogsAuthorizationDocs : undefined,
				isDogsPurposeDetectionDrugs: useDogs ? formValue.dogsAuthorizationData.isDogsPurposeDetectionDrugs : null,
				isDogsPurposeDetectionExplosives: useDogs
					? formValue.dogsAuthorizationData.isDogsPurposeDetectionExplosives
					: null,
				isDogsPurposeProtection: useDogs ? formValue.dogsAuthorizationData.isDogsPurposeProtection : null,
				useDogs,
			};

			const carryAndUseRetraints = formValue.restraintsAuthorizationData.carryAndUseRetraints == BooleanTypeCode.Yes;
			const restraintsAuthorizationDocs: Documents = {
				attachments: [...formValue.restraintsAuthorizationData.attachments],
				documentTypeCode: formValue.restraintsAuthorizationData.carryAndUseRetraintsDocument,
			};
			restraintsAuthorizationData = {
				carryAndUseRetraints,
				documents: carryAndUseRetraints ? restraintsAuthorizationDocs : undefined,
			};
		}

		const expiredLicenceData: ExpiredLicenceData = { ...formValue.expiredLicenceData };

		const licenceApplicationId = formValue.licenceApplicationId;

		const licenceTermData: LicenceTermData = { ...formValue.licenceTermData };

		const workerLicenceTypeData: LicenceTypeData = { ...formValue.workerLicenceTypeData };

		let mentalHealthConditionsData: MentalHealthConditionsData = {};
		if (formValue.mentalHealthConditionsData.attachments) {
			const mentalHealthConditionsDocs: Documents = {
				attachments: [...formValue.mentalHealthConditionsData.attachments],
				documentTypeCode: formValue.mentalHealthConditionsData.governmentIssuedPhotoTypeCode,
			};
			const isTreatedForMHC = formValue.mentalHealthConditionsData.isTreatedForMHC == BooleanTypeCode.Yes;
			mentalHealthConditionsData = {
				documents: isTreatedForMHC ? mentalHealthConditionsDocs : undefined,
				isTreatedForMHC,
			};
		}

		const personalInformationData: PersonalInformationData = { ...formValue.personalInformationData };

		const useBcServicesCardPhoto = formValue.photographOfYourselfData.useBcServicesCardPhoto == BooleanTypeCode.Yes;
		let photographOfYourselfData: PhotographOfYourselfData = { useBcServicesCardPhoto };
		if (formValue.photographOfYourselfData.attachments) {
			const photographOfYourselfDocs: Documents = {
				attachments: [...formValue.photographOfYourselfData.attachments],
				documentTypeCode: DocumentTypeCode.PhotoOfYourself,
			};
			photographOfYourselfData = {
				documents: useBcServicesCardPhoto ? photographOfYourselfDocs : undefined,
				useBcServicesCardPhoto,
			};
		}

		const isPoliceOrPeaceOfficer = formValue.policeBackgroundData.isPoliceOrPeaceOfficer == BooleanTypeCode.Yes;
		let policeBackgroundData: PoliceBackgroundData = { isPoliceOrPeaceOfficer };
		if (formValue.policeBackgroundData.attachments) {
			const policeBackgroundDocs: Documents = {
				attachments: [...formValue.policeBackgroundData.attachments],
				documentTypeCode: DocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			};
			policeBackgroundData = {
				documents: isPoliceOrPeaceOfficer ? policeBackgroundDocs : undefined,
				isPoliceOrPeaceOfficer,
				otherOfficerRole:
					formValue.policeBackgroundData.policeOfficerRoleCode == PoliceOfficerRoleCode.Other
						? formValue.policeBackgroundData.otherOfficerRole
						: null,
				policeOfficerRoleCode: isPoliceOrPeaceOfficer ? formValue.policeBackgroundData.policeOfficerRoleCode : null,
			};
		}

		let proofOfFingerprintData: ProofOfFingerprintData = {};
		if (formValue.proofOfFingerprintData.attachments) {
			const proofOfFingerprintDocs: Documents = {
				attachments: [...formValue.proofOfFingerprintData.attachments],
				documentTypeCode: DocumentTypeCode.ProofOfFingerprint,
			};
			proofOfFingerprintData = {
				documents: proofOfFingerprintDocs,
			};
		}

		const residentialAddressData: ResidentialAddressData = { ...formValue.residentialAddressData };
		let mailingAddressData: MailingAddressData = {};
		if (!residentialAddressData.isMailingTheSameAsResidential) {
			mailingAddressData = { ...formValue.mailingAddressData };
		}

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
			licenceApplicationId,
			licenceTermData,
			workerLicenceTypeData,
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

		console.debug('*************** body to save:', body);

		return this.workerLicensingService.apiWorkerLicencesPost$Response({ body });

		const workerLicenceTypeData = { ...formValue.workerLicenceTypeData };
		const applicationTypeData = { ...formValue.applicationTypeData };
		const soleProprietorData = { ...formValue.soleProprietorData };
		const contactInformationData = { ...formValue.contactInformationData };
		const expiredLicenceData = { ...formValue.expiredLicenceData };
		const characteristicsData = { ...formValue.characteristicsData };
		const personalInformationData = { ...formValue.personalInformationData };
		const residentialAddressData = { ...formValue.residentialAddressData };
		const mailingAddressData = { ...formValue.mailingAddressData };

		const body: WorkerLicenceUpsertRequest = {
			// licenceApplicationId: formValue.applicationTypeData.licenceApplicationId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			isSoleProprietor: soleProprietorData.isSoleProprietor == BooleanTypeCode.Yes,
			// hasPreviousName: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes,
			// aliases: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes ? formValue.aliasesData.aliases : [],
			// hasBcDriversLicence: formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes,
			// bcDriversLicenceNumber:
			// 	formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
			// 		? formValue.bcDriversLicenceData.bcDriversLicenceNumber
			// 		: null,
			// contactEmailAddress: contactInformationData.contactEmailAddress,
			// contactPhoneNumber: contactInformationData.contactPhoneNumber,
			// dateOfBirth: formValue.applicationTypeData.dateOfBirth,
			// hasExpiredLicence: formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes,
			// expiredLicenceNumber:
			// 	formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes
			// 		? expiredLicenceData.expiredLicenceNumber
			// 		: null,
			// expiryDate:
			// 	formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiryDate : null,
			// eyeColourCode: characteristicsData.eyeColourCode,
			// hairColourCode: characteristicsData.hairColourCode,
			// height: characteristicsData.height,
			// heightUnitCode: characteristicsData.heightUnitCode,
			// weight: characteristicsData.weight,
			// weightUnitCode: characteristicsData.weightUnitCode,
			// genderCode: personalInformationData.genderCode,
			// givenName: personalInformationData.givenName,
			// oneLegalName: personalInformationData.oneLegalName,
			// middleName1: personalInformationData.middleName1,
			// middleName2: personalInformationData.middleName2,
			// surname: personalInformationData.surname,
			// hasCriminalHistory: formValue.applicationTypeData.hasCriminalHistory == BooleanTypeCode.Yes,
			// licenceTermCode: formValue.applicationTypeData.licenceTermCode,
			// isMailingTheSameAsResidential: residentialAddressData.isMailingTheSameAsResidential,
			// mailingAddressData: residentialAddressData.isMailingTheSameAsResidential
			// 	? residentialAddressData
			// 	: mailingAddressData,
			// residentialAddressData,
		};
		// return this.workerLicensingService.apiAnonymousWorkerLicencesPost$Response({ body });

		// const body2: ProofOfFingerprintUpsertRequest = {
		// 	licenceApplicationId: '',
		// };
		// const proofOfFingerprintDocs: Documents = {
		// 	attachments: [...formValue.proofOfFingerprintData.attachments],
		// 	documentTypeCode: DocumentTypeCode.ProofOfFingerprint,
		// };
		// const body3: PhotographOfYourselfUpsertRequest = { documents: proofOfFingerprintDocs };

		return forkJoin([
			this.workerLicensingService.apiAnonymousWorkerLicencesPost$Response({ body }),
			// this.workerLicensingService.apiWorkerLicencesFingerprintPost$Response(),
			// this.workerLicensingService.apiWorkerLicencesPhotographOfYourselfPost$Response(),
		]);

		// forkJoin([
		// 	this.workerLicensingService.apiWorkerLicencesFingerprintPost$Response({ body: body2 }),
		// 	this.workerLicensingService.apiAnonymousWorkerLicencesPost$Response({ body }),
		// ]).subscribe({
		// 	next: (resp) => {
		// 		console.log('resp', resp);
		// 	},
		// 	error: (error) => {
		// 		// only 404 will be here as an error
		// 		console.log('An error occurred during save', error);
		// 	},
		// });
	}
		*/
}
