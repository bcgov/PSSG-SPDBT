import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicationTypeCode,
	HeightUnitCode,
	LicenceDocumentTypeCode,
	PermitAppAnonymousSubmitRequest,
	WorkerLicenceAppAnonymousSubmitRequest,
	WorkerLicenceAppSubmitRequest,
	WorkerLicenceAppUpsertRequest,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
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

export abstract class PermitApplicationHelper {
	booleanTypeCodes = BooleanTypeCode;

	workerLicenceTypeFormGroup: FormGroup = this.formBuilder.group({
		workerLicenceTypeCode: new FormControl('', [Validators.required]),
	});

	applicationTypeFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeCode: new FormControl('', [Validators.required]),
	});

	accessCodeFormGroup: FormGroup = this.formBuilder.group({
		licenceNumber: new FormControl('', [FormControlValidators.required]),
		accessCode: new FormControl('', [FormControlValidators.required]),
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
			hasLegalNameChanged: new FormControl(false),
			origGivenName: new FormControl(''),
			origMiddleName1: new FormControl(''),
			origMiddleName2: new FormControl(''),
			origSurname: new FormControl(''),
			origGenderCode: new FormControl(''),
			origDateOfBirth: new FormControl(''),
			hasGenderChanged: new FormControl(false),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('hasLegalNameChanged')?.value
				),
			],
		}
	);

	expiredLicenceFormGroup = this.formBuilder.group(
		{
			hasExpiredLicence: new FormControl('', [FormControlValidators.required]),
			expiredLicenceNumber: new FormControl(),
			expiredLicenceId: new FormControl(),
			expiryDate: new FormControl(),
			captchaFormGroup: new FormGroup({
				token: new FormControl('', FormControlValidators.required),
			}),
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

	printPermitFormGroup: FormGroup = this.formBuilder.group(
		{
			isPrintPermit: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'isPrintPermit',
					(_form) => this.applicationTypeFormGroup.get('applicationTypeCode')?.value === ApplicationTypeCode.Update
				),
			],
		}
	);

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
			governmentIssuedPhotoTypeCode: new FormControl(''),
			governmentIssuedExpiryDate: new FormControl(''),
			governmentIssuedAttachments: new FormControl([]),
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
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							(form.get('proofOfResidentStatusCode')?.value == LicenceDocumentTypeCode.WorkPermit ||
								form.get('proofOfResidentStatusCode')?.value == LicenceDocumentTypeCode.StudyPermit))
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedPhotoTypeCode',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value !== LicenceDocumentTypeCode.CanadianPassport) ||
						form.get('isResidentOfCanada')?.value == BooleanTypeCode.No ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('isResidentOfCanada')?.value == BooleanTypeCode.Yes &&
							form.get('proofOfResidentStatusCode')?.value !== LicenceDocumentTypeCode.PermanentResidentCard)
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedAttachments',
					(form) => form.get('isResidentOfCanada')?.value == BooleanTypeCode.No
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
		protected formatDatePipe: FormatDatePipe,
		protected utilService: UtilService
	) {}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	public getSaveBody(permitModelFormValue: any): PermitAppAnonymousSubmitRequest {
		// TODO WorkerLicenceAppUpsertRequest |
		console.debug('getSaveBody permitModelFormValue', permitModelFormValue);

		const licenceAppId = permitModelFormValue.licenceAppId;
		const workerLicenceTypeData = { ...permitModelFormValue.workerLicenceTypeData };
		const applicationTypeData = { ...permitModelFormValue.applicationTypeData };
		const bcDriversLicenceData = { ...permitModelFormValue.bcDriversLicenceData };
		const contactInformationData = { ...permitModelFormValue.contactInformationData };
		const expiredLicenceData = { ...permitModelFormValue.expiredLicenceData };
		const characteristicsData = { ...permitModelFormValue.characteristicsData };
		const residentialAddressData = { ...permitModelFormValue.residentialAddressData };
		const mailingAddressData = { ...permitModelFormValue.mailingAddressData };
		const citizenshipData = { ...permitModelFormValue.citizenshipData };
		// const fingerprintProofData = { ...permitModelFormValue.fingerprintProofData };
		// const photographOfYourselfData = { ...permitModelFormValue.photographOfYourselfData };

		const personalInformationData = { ...permitModelFormValue.personalInformationData };
		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		// let fingerprintProofDocument: FingerprintProofDocument | null = null;
		// if (fingerprintProofData.attachments) {
		// 	const fingerprintProofDocuments: Array<LicenceAppDocumentResponse> = [];
		// 	fingerprintProofData.attachments.forEach((doc: any) => {
		// 		fingerprintProofDocuments.push({
		// 			documentUrlId: doc.documentUrlId,
		// 		});
		// 	});
		// 	fingerprintProofDocument = {
		// 		documentResponses: fingerprintProofDocuments,
		// 		licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
		// 	};
		// }

		// let citizenshipDocument: CitizenshipDocument | null = null;
		// if (citizenshipData.attachments) {
		// 	// TODO fix permit citizenship data
		// 	const citizenshipDocuments: Array<LicenceAppDocumentResponse> = [];
		// 	citizenshipData.attachments.forEach((doc: any) => {
		// 		citizenshipDocuments.push({
		// 			documentUrlId: doc.documentUrlId,
		// 		});
		// 	});
		// 	citizenshipDocument = {
		// 		documentResponses: citizenshipDocuments,
		// 		expiryDate: citizenshipData.expiryDate
		// 			? this.formatDatePipe.transform(citizenshipData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
		// 			: null,
		// 		licenceDocumentTypeCode:
		// 			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
		// 				? citizenshipData.canadianCitizenProofTypeCode
		// 				: citizenshipData.notCanadianCitizenProofTypeCode,
		// 	};
		// }

		// let idPhotoDocument: IdPhotoDocument | null = null;
		// if (photographOfYourselfData.attachments) {
		// 	const photographOfYourselfDocuments: Array<LicenceAppDocumentResponse> = [];
		// 	photographOfYourselfData.attachments.forEach((doc: any) => {
		// 		photographOfYourselfDocuments.push({
		// 			documentUrlId: doc.documentUrlId,
		// 		});
		// 	});
		// 	idPhotoDocument = {
		// 		documentResponses: photographOfYourselfDocuments,
		// 		licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
		// 	};
		// }

		if (characteristicsData.heightUnitCode == HeightUnitCode.Inches) {
			const ft: number = +characteristicsData.height;
			const inch: number = +characteristicsData.heightInches;
			characteristicsData.height = String(ft * 12 + inch);
		}

		const expiredLicenceExpiryDate = expiredLicenceData.expiryDate
			? this.formatDatePipe.transform(expiredLicenceData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
			: null;

		const body: WorkerLicenceAppUpsertRequest | WorkerLicenceAppSubmitRequest = {
			licenceAppId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			//-----------------------------------
			hasPreviousName: this.utilService.booleanTypeToBoolean(permitModelFormValue.aliasesData.previousNameFlag),
			aliases:
				permitModelFormValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes
					? permitModelFormValue.aliasesData.aliases
					: [],
			//-----------------------------------
			hasBcDriversLicence: this.utilService.booleanTypeToBoolean(bcDriversLicenceData.hasBcDriversLicence),
			bcDriversLicenceNumber:
				bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
					? bcDriversLicenceData.bcDriversLicenceNumber
					: null,
			//-----------------------------------
			...contactInformationData,
			//-----------------------------------
			hasExpiredLicence: false, // TODO remove?
			expiredLicenceNumber:
				expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceNumber : null,
			expiredLicenceId:
				expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceId : null,
			expiryDate: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceExpiryDate : null,
			//-----------------------------------
			...characteristicsData,
			//-----------------------------------
			...personalInformationData,
			//-----------------------------------
			hasCriminalHistory: this.utilService.booleanTypeToBoolean(
				permitModelFormValue.criminalHistoryData.hasCriminalHistory
			),
			//-----------------------------------
			licenceTermCode: permitModelFormValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			isMailingTheSameAsResidential: residentialAddressData.isMailingTheSameAsResidential,
			mailingAddressData: residentialAddressData.isMailingTheSameAsResidential
				? residentialAddressData
				: mailingAddressData,
			residentialAddressData,
			//-----------------------------------
			isCanadianCitizen: this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen),
			// citizenshipDocument,
			//-----------------------------------
			// fingerprintProofDocument,
			//-----------------------------------
			// useBcServicesCardPhoto: this.utilService.booleanTypeToBoolean(photographOfYourselfData.useBcServicesCardPhoto),
			// idPhotoDocument,
			//-----------------------------------
		};
		return body;
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	public getSaveBodyAnonymous(permitModelFormValue: any): PermitAppAnonymousSubmitRequest {
		const savebody = this.getSaveBody(permitModelFormValue);

		// const documentInfos = this.getSaveDocumentInfosAnonymous(permitModelFormValue);
		// console.log('documentInfos', documentInfos);

		// const categoryData: any[] = []; // savebody.categoryData ?? [];

		// const categoryCodes: Array<WorkerCategoryTypeCode> = categoryData.map(
		// 	(item: WorkerLicenceAppCategoryData) => item.workerCategoryTypeCode!
		// );

		const requestBody: WorkerLicenceAppAnonymousSubmitRequest = {
			workerLicenceTypeCode: savebody.workerLicenceTypeCode,
			applicationTypeCode: savebody.applicationTypeCode,
			givenName: savebody.givenName,
			middleName1: savebody.middleName1,
			middleName2: savebody.middleName2,
			surname: savebody.surname,
			dateOfBirth: savebody.dateOfBirth,
			genderCode: savebody.genderCode,
			expiredLicenceNumber: savebody.expiredLicenceNumber,
			expiredLicenceId: savebody.expiredLicenceId,
			hasExpiredLicence: savebody.hasExpiredLicence,
			licenceTermCode: savebody.licenceTermCode,
			hasCriminalHistory: savebody.hasCriminalHistory,
			hasPreviousName: savebody.hasPreviousName,
			hasBcDriversLicence: savebody.hasBcDriversLicence,
			bcDriversLicenceNumber: savebody.bcDriversLicenceNumber,
			hairColourCode: savebody.hairColourCode,
			eyeColourCode: savebody.eyeColourCode,
			height: savebody.height,
			heightUnitCode: savebody.heightUnitCode,
			weight: savebody.weight,
			weightUnitCode: savebody.weightUnitCode,
			contactEmailAddress: savebody.contactEmailAddress,
			contactPhoneNumber: savebody.contactPhoneNumber,
			isMailingTheSameAsResidential: savebody.isMailingTheSameAsResidential ?? false,
			isPoliceOrPeaceOfficer: savebody.isPoliceOrPeaceOfficer,
			policeOfficerRoleCode: savebody.policeOfficerRoleCode,
			otherOfficerRole: savebody.otherOfficerRole,
			isTreatedForMHC: savebody.isTreatedForMHC,
			useBcServicesCardPhoto: savebody.useBcServicesCardPhoto,
			isCanadianCitizen: savebody.isCanadianCitizen,
			aliases: savebody.aliases ? [...savebody.aliases] : [],
			residentialAddressData: { ...savebody.residentialAddressData },
			mailingAddressData: { ...savebody.mailingAddressData },
			// categoryCodes: categoryCodes,
			// documentInfos,
		};
		// console.log('requestBody', requestBody);

		return requestBody;
	}

	// getSaveDocumentInfosAnonymous(permitModelFormValue: any): Array<DocumentBase> {
	// 	const documents: Array<DocumentBase> = [];
	// 	const savebody = this.getSaveBody(permitModelFormValue);

	// 	savebody.categoryData?.forEach((item: WorkerLicenceAppCategoryData) => {
	// 		item.documents?.forEach((doc: Document) => {
	// 			if (doc.expiryDate) {
	// 				documents.push({ licenceDocumentTypeCode: doc.licenceDocumentTypeCode!, expiryDate: doc.expiryDate });
	// 			}
	// 		});
	// 	});

	// 	if (savebody.citizenshipDocument?.expiryDate) {
	// 		documents.push({
	// 			licenceDocumentTypeCode: savebody.citizenshipDocument.licenceDocumentTypeCode,
	// 			expiryDate: savebody.citizenshipDocument.expiryDate,
	// 		});
	// 	}

	// 	console.debug('submitPermitAnonymous documentInfos', documents);
	// 	return documents;
	// }

	// getSaveDocsAnonymous(permitModelFormValue: any): Array<PermitDocumentsToSave> {
	// 	const documents: Array<PermitDocumentsToSave> = [];

	// 	const citizenshipData = { ...permitModelFormValue.citizenshipData };
	// 	const fingerprintProofData = { ...permitModelFormValue.fingerprintProofData };
	// 	const photographOfYourselfData = { ...permitModelFormValue.photographOfYourselfData };

	// 	if (fingerprintProofData.attachments) {
	// 		const docs: Array<Blob> = [];
	// 		fingerprintProofData.attachments.forEach((doc: Blob) => {
	// 			docs.push(doc);
	// 		});
	// 		documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint, documents: docs });
	// 	}

	// 	if (citizenshipData.attachments) {
	// 		// TODO fix permit citizenship data
	// 		const docs: Array<Blob> = [];
	// 		citizenshipData.attachments.forEach((doc: Blob) => {
	// 			docs.push(doc);
	// 		});
	// 		const citizenshipLicenceDocumentTypeCode =
	// 			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
	// 				? citizenshipData.canadianCitizenProofTypeCode
	// 				: citizenshipData.notCanadianCitizenProofTypeCode;
	// 		documents.push({ licenceDocumentTypeCode: citizenshipLicenceDocumentTypeCode, documents: docs });
	// 	}

	// 	if (photographOfYourselfData.attachments) {
	// 		const docs: Array<Blob> = [];
	// 		photographOfYourselfData.attachments.forEach((doc: Blob) => {
	// 			docs.push(doc);
	// 		});
	// 		documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
	// 	}

	// 	return documents;
	// }
}
