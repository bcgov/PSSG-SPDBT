import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicationTypeCode,
	ArmouredVehiclePermitReasonCode,
	BodyArmourPermitReasonCode,
	BusinessTypeCode,
	DocumentExpiredInfo,
	HeightUnitCode,
	LicenceDocumentTypeCode,
	PermitAppAnonymousSubmitRequest,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { SpdFile, UtilService } from '@app/core/services/util.service';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { PermitDocumentsToSave } from './permit-application.service';

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
		employerName: new FormControl('', [FormControlValidators.required]),
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

	// profileConfirmationFormGroup: FormGroup = this.formBuilder.group({
	// 	isProfileUpToDate: new FormControl('', [Validators.requiredTrue]),
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

	getSaveBodyAnonymous(permitModelFormValue: any): PermitAppAnonymousSubmitRequest {
		const requestbody = this.getSaveBodyBase(permitModelFormValue);

		console.debug('[getSaveBodyAnonymous] requestbody', requestbody);
		return requestbody;
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyAuthenticated(permitModelFormValue: any): PermitAppAnonymousSubmitRequest {
		const requestbody = this.getSaveBodyBase(permitModelFormValue);

		console.debug('[getSaveBodyAuthenticated] requestbody', requestbody);
		return requestbody;
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	private getSaveBodyBase(permitModelFormValue: any): PermitAppAnonymousSubmitRequest {
		const licenceAppId = permitModelFormValue.licenceAppId;
		const originalApplicationId = permitModelFormValue.originalApplicationId;
		const originalLicenceId = permitModelFormValue.originalLicenceId;
		const workerLicenceTypeData = { ...permitModelFormValue.workerLicenceTypeData };
		const applicationTypeData = { ...permitModelFormValue.applicationTypeData };
		const bcDriversLicenceData = { ...permitModelFormValue.bcDriversLicenceData };
		const contactInformationData = { ...permitModelFormValue.contactInformationData };
		const expiredLicenceData = { ...permitModelFormValue.expiredLicenceData };
		const characteristicsData = { ...permitModelFormValue.characteristicsData };
		const residentialAddressData = { ...permitModelFormValue.residentialAddressData };
		const mailingAddressData = { ...permitModelFormValue.mailingAddressData };
		const citizenshipData = { ...permitModelFormValue.citizenshipData };
		const photographOfYourselfData = { ...permitModelFormValue.photographOfYourselfData };
		const personalInformationData = { ...permitModelFormValue.personalInformationData };

		const permitRequirementData = { ...permitModelFormValue.permitRequirementData };
		const employerPrimaryAddress = { ...permitModelFormValue.employerPrimaryAddress };
		const permitRationaleData = { ...permitModelFormValue.permitRationaleData };
		const printPermitData = { ...permitModelFormValue.printPermitData };

		// default the flags
		residentialAddressData.isMailingTheSameAsResidential = !!residentialAddressData.isMailingTheSameAsResidential;
		personalInformationData.hasLegalNameChanged = !!personalInformationData.hasLegalNameChanged;

		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		// get list of documents with expiry dates
		const documentExpiredInfos: Array<DocumentExpiredInfo> = [];

		// get list of previously saved documents
		const previousDocumentIds: Array<string> = [];

		if (personalInformationData.hasLegalNameChanged) {
			personalInformationData.attachments
				?.filter((doc: any) => doc.documentUrlId)
				.forEach((doc: any) => {
					previousDocumentIds.push(doc.documentUrlId);
				});
		}

		permitRationaleData.attachments
			?.filter((doc: any) => doc.documentUrlId)
			.forEach((doc: any) => {
				previousDocumentIds.push(doc.documentUrlId);
			});

		citizenshipData.attachments?.forEach((doc: any) => {
			if (citizenshipData.expiryDate) {
				documentExpiredInfos.push({
					expiryDate: this.formatDatePipe.transform(citizenshipData.expiryDate, SPD_CONSTANTS.date.backendDateFormat),
					licenceDocumentTypeCode:
						citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
							? citizenshipData.canadianCitizenProofTypeCode
							: citizenshipData.notCanadianCitizenProofTypeCode,
				});
			}
			if (doc.documentUrlId) {
				previousDocumentIds.push(doc.documentUrlId);
			}
		});

		const isIncludeAdditionalGovermentIdStepData =
			(citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes &&
				citizenshipData.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			citizenshipData.isResidentOfCanada == BooleanTypeCode.No ||
			(citizenshipData.isResidentOfCanada == BooleanTypeCode.Yes &&
				citizenshipData.proofOfResidentStatusCode != LicenceDocumentTypeCode.PermanentResidentCard);

		if (isIncludeAdditionalGovermentIdStepData && citizenshipData.governmentIssuedAttachments) {
			citizenshipData.governmentIssuedAttachments?.forEach((doc: any) => {
				if (citizenshipData.expiryDate) {
					documentExpiredInfos.push({
						expiryDate: this.formatDatePipe.transform(
							citizenshipData.governmentIssuedExpiryDate,
							SPD_CONSTANTS.date.backendDateFormat
						),
						licenceDocumentTypeCode: citizenshipData.governmentIssuedPhotoTypeCode,
					});
				}
				if (doc.documentUrlId) {
					previousDocumentIds.push(doc.documentUrlId);
				}
			});
		}

		photographOfYourselfData.attachments
			?.filter((doc: any) => doc.documentUrlId)
			.forEach((doc: any) => {
				previousDocumentIds.push(doc.documentUrlId);
			});

		if (characteristicsData.heightUnitCode == HeightUnitCode.Inches) {
			const ft: number = +characteristicsData.height;
			const inch: number = +characteristicsData.heightInches;
			characteristicsData.height = String(ft * 12 + inch);
		}

		const expiredLicenceExpiryDate = expiredLicenceData.expiryDate
			? this.formatDatePipe.transform(expiredLicenceData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
			: null;

		const armouredVehiclePermitReasonCodes: Array<ArmouredVehiclePermitReasonCode> = [];
		const bodyArmourPermitReasonCodes: Array<BodyArmourPermitReasonCode> = [];
		let permitOtherRequiredReason: string | null = null;
		let includesMyEmployement = false;

		if (workerLicenceTypeData.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit) {
			const armouredVehicleRequirements = permitRequirementData.armouredVehicleRequirementFormGroup;
			if (armouredVehicleRequirements.isPersonalProtection) {
				armouredVehiclePermitReasonCodes.push(ArmouredVehiclePermitReasonCode.PersonalProtection);
			}
			if (armouredVehicleRequirements.isMyEmployment) {
				includesMyEmployement = true;
				armouredVehiclePermitReasonCodes.push(ArmouredVehiclePermitReasonCode.MyEmployment);
			}
			if (armouredVehicleRequirements.isProtectionOfAnotherPerson) {
				armouredVehiclePermitReasonCodes.push(ArmouredVehiclePermitReasonCode.ProtectionOfAnotherPerson);
			}
			if (armouredVehicleRequirements.isProtectionOfPersonalProperty) {
				armouredVehiclePermitReasonCodes.push(ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty);
			}
			if (armouredVehicleRequirements.isProtectionOfOthersProperty) {
				armouredVehiclePermitReasonCodes.push(ArmouredVehiclePermitReasonCode.ProtectionOfOtherProperty);
			}
			if (armouredVehicleRequirements.isOther) {
				permitOtherRequiredReason = permitRequirementData.otherReason;
				armouredVehiclePermitReasonCodes.push(ArmouredVehiclePermitReasonCode.Other);
			}
		} else {
			const bodyArmourRequirements = permitRequirementData.bodyArmourRequirementFormGroup;

			if (bodyArmourRequirements.isOutdoorRecreation) {
				bodyArmourPermitReasonCodes.push(BodyArmourPermitReasonCode.OutdoorRecreation);
			}
			if (bodyArmourRequirements.isPersonalProtection) {
				bodyArmourPermitReasonCodes.push(BodyArmourPermitReasonCode.PersonalProtection);
			}
			if (bodyArmourRequirements.isMyEmployment) {
				includesMyEmployement = true;
				bodyArmourPermitReasonCodes.push(BodyArmourPermitReasonCode.MyEmployment);
			}
			if (bodyArmourRequirements.isTravelForConflict) {
				bodyArmourPermitReasonCodes.push(BodyArmourPermitReasonCode.TravelInResponseToInternationalConflict);
			}
			if (bodyArmourRequirements.isOther) {
				permitOtherRequiredReason = permitRequirementData.otherReason;
				bodyArmourPermitReasonCodes.push(BodyArmourPermitReasonCode.Other);
			}
		}

		const body = {
			licenceAppId,
			originalApplicationId,
			originalLicenceId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			//-----------------------------------
			businessTypeCode: BusinessTypeCode.None,
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
			hasExpiredLicence: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes,
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
			hasNewCriminalRecordCharge: this.utilService.booleanTypeToBoolean(
				permitModelFormValue.criminalHistoryData.hasCriminalHistory
			), // used by the backend for an Update or Renewal
			criminalChargeDescription: permitModelFormValue.criminalHistoryData.criminalChargeDescription,
			//-----------------------------------
			reprint: this.utilService.booleanTypeToBoolean(printPermitData.isPrintPermit),
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
			//-----------------------------------
			useBcServicesCardPhoto: this.utilService.booleanTypeToBoolean(photographOfYourselfData.useBcServicesCardPhoto),
			//-----------------------------------
			rationale: permitRationaleData.rationale,
			//-----------------------------------
			employerPrimaryAddress: includesMyEmployement ? employerPrimaryAddress : null,
			//-----------------------------------
			armouredVehiclePermitReasonCodes,
			bodyArmourPermitReasonCodes,
			permitOtherRequiredReason,
			//-----------------------------------
			documentExpiredInfos: [...documentExpiredInfos],
			previousDocumentIds: [...previousDocumentIds],
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getDocsToSaveAnonymousBlobs(permitModelFormValue: any): Array<PermitDocumentsToSave> {
		console.debug('getDocsToSaveAnonymousBlobs permitModelFormValue', permitModelFormValue);

		const documents: Array<PermitDocumentsToSave> = [];

		const workerLicenceTypeData = { ...permitModelFormValue.workerLicenceTypeData };
		const citizenshipData = { ...permitModelFormValue.citizenshipData };
		const photographOfYourselfData = { ...permitModelFormValue.photographOfYourselfData };
		const personalInformationData = { ...permitModelFormValue.personalInformationData };
		const permitRationaleData = { ...permitModelFormValue.permitRationaleData };

		if (personalInformationData.hasLegalNameChanged && personalInformationData.attachments) {
			const docs: Array<Blob> = [];
			personalInformationData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.LegalNameChange,
				documents: docs,
			});
		}

		if (citizenshipData.attachments) {
			const docs: Array<Blob> = [];
			citizenshipData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			const citizenshipLicenceDocumentTypeCode =
				citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
					? citizenshipData.canadianCitizenProofTypeCode
					: citizenshipData.notCanadianCitizenProofTypeCode;
			documents.push({ licenceDocumentTypeCode: citizenshipLicenceDocumentTypeCode, documents: docs });
		}

		const isIncludeAdditionalGovermentIdStepData =
			(citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes &&
				citizenshipData.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			citizenshipData.isResidentOfCanada == BooleanTypeCode.No ||
			(citizenshipData.isResidentOfCanada == BooleanTypeCode.Yes &&
				citizenshipData.proofOfResidentStatusCode != LicenceDocumentTypeCode.PermanentResidentCard);

		if (isIncludeAdditionalGovermentIdStepData && citizenshipData.governmentIssuedAttachments) {
			const docs: Array<Blob> = [];
			citizenshipData.governmentIssuedAttachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: citizenshipData.governmentIssuedPhotoTypeCode, documents: docs });
		}

		if (photographOfYourselfData.attachments) {
			const docs: Array<Blob> = [];
			photographOfYourselfData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
		}

		if (permitRationaleData.attachments) {
			const documentTypeCode =
				workerLicenceTypeData.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit
					? LicenceDocumentTypeCode.ArmouredVehicleRationale
					: LicenceDocumentTypeCode.BodyArmourRationale;

			const docs: Array<Blob> = [];
			permitRationaleData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: documentTypeCode, documents: docs });
		}

		console.debug('getDocsToSaveAnonymousBlobs documentsToSave', documents);

		return documents;
	}
}
