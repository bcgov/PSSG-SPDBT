import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	Document,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	WorkerCategoryTypeCode,
	WorkerLicenceAppCategoryData,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { BooleanTypeCode, SelectOptions, WorkerCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

export interface PermitStepperStepComponent {
	onStepNext(formNumber: number): void;
	onStepPrevious(): void;
	onFormValidNextStep(formNumber: number): void;
	onStepSelectionChange(event: StepperSelectionEvent): void;
	onGoToNextStep(): void;
	onGoToFirstStep(): void;
	onGoToLastStep(): void;
}

export interface PermitChildStepperStepComponent {
	isFormValid(): boolean;
}

// export interface LicenceDocument {
// 	Documents?: Array<File>;
// 	LicenceDocumentTypeCode?: LicenceDocumentTypeCode;
// }

// export enum LicenceDocumentChanged {
// 	categoryArmouredCarGuard = 'categoryArmouredCarGuard',
// 	categoryFireInvestigator = 'categoryFireInvestigator',
// 	categoryLocksmith = 'categoryLocksmith',
// 	categoryPrivateInvestigator = 'categoryPrivateInvestigator',
// 	categoryPrivateInvestigatorSup = 'categoryPrivateInvestigatorSup',
// 	categorySecurityGuard = 'categorySecurityGuard',
// 	categorySecurityAlarmInstaller = 'categorySecurityAlarmInstaller',
// 	categorySecurityConsultant = 'categorySecurityConsultant',
// 	citizenship = 'citizenship',
// 	dogsAuthorization = 'dogsAuthorization',
// 	restraintsAuthorization = 'restraintsAuthorization',
// 	additionalGovermentId = 'additionalGovermentId',
// 	mentalHealthConditions = 'mentalHealthConditions',
// 	photographOfYourself = 'photographOfYourself',
// 	policeBackground = 'policeBackground',
// 	proofOfFingerprint = 'proofOfFingerprint',
// }

export abstract class PermitApplicationHelper {
	booleanTypeCodes = BooleanTypeCode;

	workerLicenceTypeFormGroup: FormGroup = this.formBuilder.group({
		workerLicenceTypeCode: new FormControl('', [Validators.required]),
	});

	applicationTypeFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeCode: new FormControl('', [Validators.required]),
	});

	accessCodeFormGroup: FormGroup = this.formBuilder.group({
		licenceNumber: new FormControl('OPENTEST1', [FormControlValidators.required]), // TODO removed hard-coded
		accessCode: new FormControl('6H0GXD0JZK', [FormControlValidators.required]), // TODO removed hard-coded
		linkedLicenceId: new FormControl(null, [FormControlValidators.required]),
		linkedLicenceAppId: new FormControl(null),
		linkedExpiryDate: new FormControl(null),
		captchaFormGroup: new FormGroup({
			token: new FormControl('', FormControlValidators.required),
		}),
	});

	personalInformationFormGroup = this.formBuilder.group(
		{
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			genderCode: new FormControl('', [FormControlValidators.required]),
			dateOfBirth: new FormControl('', [Validators.required]),
			isNeedProofOfLegalNameChange: new FormControl(false),
			origGivenName: new FormControl(''),
			origMiddleName1: new FormControl(''),
			origMiddleName2: new FormControl(''),
			origSurname: new FormControl(''),
			origGenderCode: new FormControl(''),
			origDateOfBirth: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isNeedProofOfLegalNameChange')?.value
				),
			],
		}
	);

	expiredLicenceFormGroup = this.formBuilder.group(
		{
			hasExpiredPermit: new FormControl('', [FormControlValidators.required]),
			expiredLicenceNumber: new FormControl(),
			expiredLicenceId: new FormControl(),
			expiryDate: new FormControl(),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'expiredLicenceNumber',
					(form) => form.get('hasExpiredPermit')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiredLicenceId',
					(form) => form.get('hasExpiredPermit')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) => form.get('hasExpiredPermit')?.value == this.booleanTypeCodes.Yes
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

	permitRequirementFormGroup: FormGroup = this.formBuilder.group(
		{
			workerLicenceTypeCode: new FormControl(),
			bodyArmourRequirementFormGroup: new FormGroup(
				{
					isOutdoorRecreation: new FormControl(false),
					isPersonalProtection: new FormControl(false),
					isMyEmployment: new FormControl(false),
					isTravelForConflict: new FormControl(false),
					isOther: new FormControl(false),
				},
				FormGroupValidators.atLeastOneCheckboxValidator('workerLicenceTypeCode', WorkerLicenceTypeCode.BodyArmourPermit)
			),
			armouredVehicleRequirementFormGroup: new FormGroup(
				{
					isPersonalProtection: new FormControl(false),
					isMyEmployment: new FormControl(false),
					isProtectionOfAnotherPerson: new FormControl(false),
					isProtectionOfPersonalProperty: new FormControl(false),
					isProtectionOfOthersProperty: new FormControl(false),
					isOther: new FormControl(false),
				},
				FormGroupValidators.atLeastOneCheckboxValidator(
					'workerLicenceTypeCode',
					WorkerLicenceTypeCode.ArmouredVehiclePermit
				)
			),
			otherReason: new FormControl(),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'otherReason',
					(form) =>
						form.get('bodyArmourRequirementFormGroup.isOther')?.value == true ||
						form.get('armouredVehicleRequirementFormGroup.isOther')?.value == true
				),
			],
		}
	);

	permitRationaleFormGroup: FormGroup = this.formBuilder.group({
		rationale: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl(''),
	});

	employerInformationFormGroup: FormGroup = this.formBuilder.group({
		businessName: new FormControl('', [FormControlValidators.required]),
		supervisorName: new FormControl('', [FormControlValidators.required]),
		supervisorEmailAddress: new FormControl('', [FormControlValidators.required]),
		supervisorPhoneNumber: new FormControl('', [FormControlValidators.required]),
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [FormControlValidators.required]),
	});

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
			isResidentOfCanada: new FormControl(''),
			proofOfResidentStatusCode: new FormControl(''),
			proofOfCitizenshipCode: new FormControl(''),
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
					'isResidentOfCanada',
					(form) => form.get('isCanadianCitizen')?.value == BooleanTypeCode.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'proofOfResidentStatusCode',
					(form) => form.get('isResidentOfCanada')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'proofOfCitizenshipCode',
					(form) => form.get('isResidentOfCanada')?.value == BooleanTypeCode.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) =>
						form.get('isResidentOfCanada')?.value == BooleanTypeCode.Yes &&
						(form.get('proofOfResidentStatusCode')?.value == LicenceDocumentTypeCode.WorkPermit ||
							form.get('proofOfResidentStatusCode')?.value == LicenceDocumentTypeCode.StudyPermit)
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

	profileConfirmationFormGroup: FormGroup = this.formBuilder.group({
		isProfileUpToDate: new FormControl('', [Validators.requiredTrue]),
	});

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

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		agreeToCompleteAndAccurate: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
		captchaFormGroup: new FormGroup(
			{
				displayCaptcha: new FormControl(false),
				token: new FormControl('', FormControlValidators.required),
			},
			{
				validators: [
					FormGroupValidators.conditionalRequiredValidator(
						'token',
						(form) => form.get('displayCaptcha')?.value == true
					),
				],
			}
		),
	});

	constructor(
		protected formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected formatDatePipe: FormatDatePipe
	) {}

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
	 * Get the category data formatted for saving
	 * @param armouredCarGuardData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategoryArmouredCarGuard(armouredCarGuardData: any): WorkerLicenceAppCategoryData {
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
	getCategoryFireInvestigator(fireInvestigatorData: any): WorkerLicenceAppCategoryData {
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
	getCategoryLocksmith(locksmithData: any): WorkerLicenceAppCategoryData {
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
	getCategoryPrivateInvestigator(privateInvestigatorData: any): WorkerLicenceAppCategoryData {
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
	getCategoryPrivateInvestigatorSup(privateInvestigatorSupData: any): WorkerLicenceAppCategoryData {
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
	getCategorySecurityGuard(
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
	getCategorySecurityAlarmInstaller(categorySecurityAlarmInstallerData: any): WorkerLicenceAppCategoryData {
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
	getCategorySecurityConsultantInstaller(categorySecurityConsultantData: any): WorkerLicenceAppCategoryData {
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
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityConsultantResume,
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
	booleanTypeToBoolean(value: BooleanTypeCode | null): boolean | null {
		if (!value) return null;

		if (value == BooleanTypeCode.Yes) return true;
		return false;
	}

	/**
	 * Convert boolean to BooleanTypeCode
	 * @param value
	 * @returns
	 */
	public booleanToBooleanType(value: boolean | null | undefined): BooleanTypeCode | null {
		const isBooleanType = typeof value === 'boolean';
		if (!isBooleanType) return null;

		return value ? BooleanTypeCode.Yes : BooleanTypeCode.No;
	}
}
