import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import {
	BusinessTypeCode,
	Document,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceFeeListResponse,
	LicenceFeeResponse,
	PoliceOfficerRoleCode,
	WorkerCategoryTypeCode,
	WorkerLicenceAppCategoryData,
	WorkerLicenceTypeCode,
} from 'src/app/api/models';
import { LicenceFeeService, WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { BooleanTypeCode, SelectOptions, WorkerCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

export interface LicenceStepperStepComponent {
	onStepNext(formNumber: number): void;
	onStepPrevious(): void;
	onFormValidNextStep(formNumber: number): void;
	onStepSelectionChange(event: StepperSelectionEvent): void;
	onGoToNextStep(): void;
	onGoToFirstStep(): void;
	onGoToLastStep(): void;
}

export interface LicenceChildStepperStepComponent {
	isFormValid(): boolean;
}

export interface LicenceDocument {
	Documents?: Array<File>;
	LicenceDocumentTypeCode?: LicenceDocumentTypeCode;
}

export enum LicenceDocumentChanged {
	categoryArmouredCarGuard = 'categoryArmouredCarGuard',
	categoryFireInvestigator = 'categoryFireInvestigator',
	categoryLocksmith = 'categoryLocksmith',
	categoryPrivateInvestigator = 'categoryPrivateInvestigator',
	categoryPrivateInvestigatorSup = 'categoryPrivateInvestigatorSup',
	categorySecurityGuard = 'categorySecurityGuard',
	categorySecurityAlarmInstaller = 'categorySecurityAlarmInstaller',
	categorySecurityConsultant = 'categorySecurityConsultant',
	citizenship = 'citizenship',
	dogsAuthorization = 'dogsAuthorization',
	restraintsAuthorization = 'restraintsAuthorization',
	additionalGovermentId = 'additionalGovermentId',
	mentalHealthConditions = 'mentalHealthConditions',
	photographOfYourself = 'photographOfYourself',
	policeBackground = 'policeBackground',
	proofOfFingerprint = 'proofOfFingerprint',
}

export abstract class LicenceApplicationHelper {
	initialized = false;
	hasValueChanged = false;
	licenceModelLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	licenceAppId = '';
	contactId = '';

	booleanTypeCodes = BooleanTypeCode;

	workerLicenceTypeFormGroup: FormGroup = this.formBuilder.group({
		workerLicenceTypeCode: new FormControl('', [Validators.required]),
	});

	applicationTypeFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeCode: new FormControl('', [Validators.required]),
	});

	personalInformationFormGroup = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName1: new FormControl(''),
		middleName2: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		genderCode: new FormControl(''),
		dateOfBirth: new FormControl('', [Validators.required]),
	});

	soleProprietorFormGroup = this.formBuilder.group({
		isSoleProprietor: new FormControl('', [FormControlValidators.required]),
	});

	expiredLicenceFormGroup = this.formBuilder.group(
		{
			hasExpiredLicence: new FormControl('', [FormControlValidators.required]),
			expiredLicenceNumber: new FormControl(),
			expiredLicenceId: new FormControl(),
			expiryDate: new FormControl(),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'expiredLicenceNumber',
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiredLicenceId',
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
			expiryDate: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator('expiryDate', (form) => form.get('isInclude')?.value),
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
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
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
			carryAndUseRestraints: new FormControl(''),
			carryAndUseRestraintsDocument: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'carryAndUseRestraints',
					(_form) => this.categorySecurityGuardFormGroup?.get('isInclude')?.value ?? false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'carryAndUseRestraintsDocument',
					(form) => form.get('carryAndUseRestraints')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('carryAndUseRestraints')?.value == this.booleanTypeCodes.Yes
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
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'useDogs',
					(_form) => this.categorySecurityGuardFormGroup?.get('isInclude')?.value ?? false
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
			policeOfficerRoleCode: new FormControl(''),
			otherOfficerRole: new FormControl(''),
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'policeOfficerRoleCode',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'otherOfficerRole',
					(form) => form.get('policeOfficerRoleCode')?.value == PoliceOfficerRoleCode.Other
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

	fingerprintProofFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl('', [Validators.required]),
	});

	citizenshipFormGroup: FormGroup = this.formBuilder.group(
		{
			isCanadianCitizen: new FormControl('', [FormControlValidators.required]),
			canadianCitizenProofTypeCode: new FormControl(''),
			notCanadianCitizenProofTypeCode: new FormControl(''),
			expiryDate: new FormControl(''),
			attachments: new FormControl([], [Validators.required]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'canadianCitizenProofTypeCode',
					(form) => form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'notCanadianCitizenProofTypeCode',
					(form) => form.get('isCanadianCitizen')?.value == BooleanTypeCode.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) =>
						form.get('notCanadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.WorkPermit ||
						form.get('notCanadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.StudyPermit
				),
			],
		}
	);

	additionalGovIdFormGroup: FormGroup = this.formBuilder.group(
		{
			governmentIssuedPhotoTypeCode: new FormControl(''),
			expiryDate: new FormControl(''),
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedPhotoTypeCode',
					(_form) =>
						(this.citizenshipFormGroup.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							this.citizenshipFormGroup.get('canadianCitizenProofTypeCode')?.value !=
								LicenceDocumentTypeCode.CanadianPassport) ||
						(this.citizenshipFormGroup.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							this.citizenshipFormGroup.get('notCanadianCitizenProofTypeCode')?.value !=
								LicenceDocumentTypeCode.PermanentResidentCard)
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(_form) =>
						(this.citizenshipFormGroup.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							this.citizenshipFormGroup.get('canadianCitizenProofTypeCode')?.value !=
								LicenceDocumentTypeCode.CanadianPassport) ||
						(this.citizenshipFormGroup.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							this.citizenshipFormGroup.get('notCanadianCitizenProofTypeCode')?.value !=
								LicenceDocumentTypeCode.PermanentResidentCard)
				),
			],
		}
	);

	bcDriversLicenceFormGroup: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl('', [FormControlValidators.required]),
		bcDriversLicenceNumber: new FormControl(),
	});

	characteristicsFormGroup: FormGroup = this.formBuilder.group({
		hairColourCode: new FormControl('', [FormControlValidators.required]),
		eyeColourCode: new FormControl('', [FormControlValidators.required]),
		height: new FormControl('', [FormControlValidators.required]),
		heightUnitCode: new FormControl('', [FormControlValidators.required]),
		heightInches: new FormControl(''),
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

	// profileFormGroup: FormGroup = this.formBuilder.group({
	// 	profileIsUpToDate: new FormControl('', [Validators.requiredTrue]),
	// });

	contactInformationFormGroup: FormGroup = this.formBuilder.group({
		contactEmailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
	});

	residentialAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [FormControlValidators.required]),
		isMailingTheSameAsResidential: new FormControl(false),
	});

	mailingAddressFormGroup: FormGroup = this.formBuilder.group(
		{
			addressSelected: new FormControl(false),
			addressLine1: new FormControl(''),
			addressLine2: new FormControl(''),
			city: new FormControl(''),
			postalCode: new FormControl(''),
			province: new FormControl(''),
			country: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredTrueValidator(
					'addressSelected',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'addressLine1',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'city',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'postalCode',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'province',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'country',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
			],
		}
	);

	licenceFees: Array<LicenceFeeResponse> = [];
	licenceFeeTermCodes: Array<LicenceFeeResponse> = [];

	constructor(
		protected formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected licenceFeeService: LicenceFeeService,
		protected workerLicensingService: WorkerLicensingService,
		protected formatDatePipe: FormatDatePipe
	) {
		this.licenceFeeService
			.apiLicenceFeeWorkerLicenceTypeCodeGet({ workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence })
			.pipe()
			.subscribe((resp: LicenceFeeListResponse) => {
				this.licenceFees = resp.licenceFees ?? [];
			});
	}

	/**
	 * Reset the licence data
	 */
	reset(): void {
		this.initialized = false;
		this.licenceFeeTermCodes = [];
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStep1Complete(): boolean {
		// console.debug(
		// 	'isStep1Complete',
		// 	this.workerLicenceTypeFormGroup.valid,
		// 	this.applicationTypeFormGroup.valid
		// );

		const isValid = this.workerLicenceTypeFormGroup.valid && this.applicationTypeFormGroup.valid;
		if (isValid && this.licenceFeeTermCodes.length === 0) {
			// value has changed to true
			this.licenceFeeTermCodes.push(...this.getLicenceTermsAndFees());
		}

		return isValid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStep2Complete(): boolean {
		// console.debug(
		// 	'isStep2Complete',
		// 	this.soleProprietorFormGroup.valid,
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
			this.soleProprietorFormGroup.valid &&
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

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStep3Complete(): boolean {
		// console.debug(
		// 	'isStep3Complete',
		// 	this.policeBackgroundFormGroup.valid,
		// 	this.mentalHealthConditionsFormGroup.valid,
		// 	this.criminalHistoryFormGroup.valid,
		// 	this.fingerprintProofFormGroup.valid
		// );

		return (
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid &&
			this.criminalHistoryFormGroup.valid &&
			this.fingerprintProofFormGroup.valid
		);
	}

	/**
	 * Get the valid list of categories based upon the current selections
	 * @param categoryList
	 * @returns
	 */
	getValidCategoryList(categoryList: string[]): SelectOptions<string>[] {
		const invalidCategories = this.configService.configs?.invalidWorkerLicenceCategoryMatrixConfiguration ?? {};
		let updatedList = [...WorkerCategoryTypes];

		categoryList.forEach((item) => {
			updatedList = updatedList.filter((cat) => !invalidCategories[item].includes(cat.code as WorkerCategoryTypeCode));
		});

		return [...updatedList];
	}

	/**
	 * Set the licence fees for the licence and application type
	 * @returns list of fees
	 */
	protected getLicenceTermsAndFees() {
		const workerLicenceTypeCode = this.workerLicenceTypeFormGroup.value.workerLicenceTypeData?.workerLicenceTypeCode;
		const applicationTypeCode = this.applicationTypeFormGroup.value.applicationTypeData?.applicationTypeCode;
		// const businessTypeCode = //TODO what to do about business type code??

		if (!workerLicenceTypeCode || !applicationTypeCode) {
			return [];
		}

		const fees = this.licenceFees?.filter(
			(item) =>
				item.workerLicenceTypeCode == workerLicenceTypeCode &&
				item.businessTypeCode == BusinessTypeCode.NonRegisteredPartnership &&
				item.applicationTypeCode == applicationTypeCode
		);

		console.debug('getLicenceTermsAndFees filtered', fees);
		return [...fees];
	}

	/**
	 * Upload a file of a certain type. Return a reference to the file that will used when the licence is saved
	 * @param documentCode
	 * @param document
	 * @returns
	 */
	addUploadDocument(
		documentCode: LicenceDocumentTypeCode,
		document: File
	): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
		const doc: LicenceDocument = {
			Documents: [document],
			LicenceDocumentTypeCode: documentCode,
		};

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response({
			licenceAppId: this.licenceAppId,
			body: doc,
		});
	}
	/**
	 * Get the category data formatted for saving
	 * @param armouredCarGuardData
	 * @returns WorkerLicenceAppCategoryData
	 */
	protected getCategoryArmouredCarGuard(armouredCarGuardData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (armouredCarGuardData.attachments) {
			const categoryArmouredCarGuardDocuments: Array<LicenceAppDocumentResponse> = [];
			armouredCarGuardData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				categoryArmouredCarGuardDocuments.push(licenceAppDocumentResponse);
			});

			const expiryDate = armouredCarGuardData.expiryDate
				? this.formatDatePipe.transform(armouredCarGuardData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
				: null;

			documents.push({
				documentResponses: categoryArmouredCarGuardDocuments,
				expiryDate,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
			});
		}
		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.ArmouredCarGuard,
			documents: documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param fireInvestigatorData
	 * @returns WorkerLicenceAppCategoryData
	 */
	protected getCategoryFireInvestigator(fireInvestigatorData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (fireInvestigatorData.fireCourseCertificateAttachments) {
			const fireCourseCertificateDocuments: Array<LicenceAppDocumentResponse> = [];
			fireInvestigatorData.fireCourseCertificateAttachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				fireCourseCertificateDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: fireCourseCertificateDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
			});
		}
		if (fireInvestigatorData.fireVerificationLetterAttachments) {
			const fireVerificationLetterDocuments: Array<LicenceAppDocumentResponse> = [];
			fireInvestigatorData.fireVerificationLetterAttachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				fireVerificationLetterDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: fireVerificationLetterDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.FireInvestigator,
			documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param locksmithData
	 * @returns WorkerLicenceAppCategoryData
	 */
	protected getCategoryLocksmith(locksmithData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (locksmithData.attachments) {
			const categoryLocksmithDocuments: Array<LicenceAppDocumentResponse> = [];
			locksmithData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				categoryLocksmithDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: categoryLocksmithDocuments,
				licenceDocumentTypeCode: locksmithData.requirementCode,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.Locksmith,
			documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param privateInvestigatorData
	 * @returns WorkerLicenceAppCategoryData
	 */
	protected getCategoryPrivateInvestigator(privateInvestigatorData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (privateInvestigatorData.attachments) {
			const privateInvestigatorDocuments: Array<LicenceAppDocumentResponse> = [];
			privateInvestigatorData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				privateInvestigatorDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: privateInvestigatorDocuments,
				licenceDocumentTypeCode: privateInvestigatorData.requirementCode,
			});
		}
		if (privateInvestigatorData.trainingAttachments) {
			const privateInvestigatorTrainingDocuments: Array<LicenceAppDocumentResponse> = [];
			privateInvestigatorData.trainingAttachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				privateInvestigatorTrainingDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: privateInvestigatorTrainingDocuments,
				licenceDocumentTypeCode: privateInvestigatorData.trainingCode,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigator,
			documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param privateInvestigatorSupData
	 * @returns WorkerLicenceAppCategoryData
	 */
	protected getCategoryPrivateInvestigatorSup(privateInvestigatorSupData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (privateInvestigatorSupData.attachments) {
			const privateInvestigatorSupDocuments: Array<LicenceAppDocumentResponse> = [];
			privateInvestigatorSupData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				privateInvestigatorSupDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: privateInvestigatorSupDocuments,
				licenceDocumentTypeCode: privateInvestigatorSupData.requirementCode,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
			documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityGuardData
	 * @returns WorkerLicenceAppCategoryData
	 */
	protected getCategorySecurityGuard(
		categorySecurityGuardData: any,
		dogsAuthorizationData: any,
		restraintsAuthorizationData: any
	): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];
		if (categorySecurityGuardData.attachments) {
			const categorySecurityGuardDocuments: Array<LicenceAppDocumentResponse> = [];

			categorySecurityGuardData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				categorySecurityGuardDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: categorySecurityGuardDocuments,
				licenceDocumentTypeCode: categorySecurityGuardData.requirementCode,
			});
		}

		if (this.booleanTypeToBoolean(dogsAuthorizationData.useDogs)) {
			if (dogsAuthorizationData.attachments) {
				const categorySecurityGuardDogDocuments: Array<LicenceAppDocumentResponse> = [];
				dogsAuthorizationData.attachments.forEach((doc: any) => {
					const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
						documentUrlId: doc.documentUrlId,
					};
					categorySecurityGuardDogDocuments.push(licenceAppDocumentResponse);
				});

				documents.push({
					documentResponses: categorySecurityGuardDogDocuments,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate,
				});
			}
		}

		if (this.booleanTypeToBoolean(restraintsAuthorizationData.carryAndUseRestraints)) {
			if (restraintsAuthorizationData.attachments) {
				const categorySecurityGuardRestraintDocuments: Array<LicenceAppDocumentResponse> = [];
				restraintsAuthorizationData.attachments.forEach((doc: any) => {
					const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
						documentUrlId: doc.documentUrlId,
					};
					categorySecurityGuardRestraintDocuments.push(licenceAppDocumentResponse);
				});

				documents.push({
					documentResponses: categorySecurityGuardRestraintDocuments,
					licenceDocumentTypeCode: restraintsAuthorizationData.carryAndUseRestraintsDocument,
				});
			}
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuard,
			documents: documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityAlarmInstallerData
	 * @returns WorkerLicenceAppCategoryData
	 */
	protected getCategorySecurityAlarmInstaller(categorySecurityAlarmInstallerData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (categorySecurityAlarmInstallerData.attachments) {
			const categorySecurityAlarmInstallerDocuments: Array<LicenceAppDocumentResponse> = [];

			categorySecurityAlarmInstallerData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				categorySecurityAlarmInstallerDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: categorySecurityAlarmInstallerDocuments,
				licenceDocumentTypeCode: categorySecurityAlarmInstallerData.requirementCode,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstaller,
			documents: documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityConsultantData
	 * @returns WorkerLicenceAppCategoryData
	 */
	protected getCategorySecurityConsultantInstaller(categorySecurityConsultantData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (categorySecurityConsultantData.attachments) {
			const securityConsultantDocuments: Array<LicenceAppDocumentResponse> = [];
			categorySecurityConsultantData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				securityConsultantDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: securityConsultantDocuments,
				licenceDocumentTypeCode: categorySecurityConsultantData.requirementCode,
			});
		}
		if (categorySecurityConsultantData.resumeAttachments) {
			const securityConsultantResumeDocuments: Array<LicenceAppDocumentResponse> = [];
			categorySecurityConsultantData.resumeAttachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				securityConsultantResumeDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: securityConsultantResumeDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityConsultant,
			documents,
		};
	}

	/**
	 * Convert BooleanTypeCode to boolean
	 * @param value
	 * @returns
	 */
	protected booleanTypeToBoolean(value: BooleanTypeCode | null): boolean | null {
		if (!value) return null;

		if (value == BooleanTypeCode.Yes) return true;
		return false;
	}

	/**
	 * Convert boolean to BooleanTypeCode
	 * @param value
	 * @returns
	 */
	protected booleanToBooleanType(value: boolean | null | undefined): BooleanTypeCode | null {
		const isBooleanType = typeof value === 'boolean';
		if (!isBooleanType) return null;

		return value ? BooleanTypeCode.Yes : BooleanTypeCode.No;
	}
}
