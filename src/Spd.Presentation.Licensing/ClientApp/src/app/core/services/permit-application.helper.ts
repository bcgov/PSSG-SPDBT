import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicantUpdateRequest,
	ApplicationTypeCode,
	ArmouredVehiclePermitReasonCode,
	BizTypeCode,
	BodyArmourPermitReasonCode,
	Document,
	DocumentExpiredInfo,
	HeightUnitCode,
	LicenceDocumentTypeCode,
	PermitAppSubmitRequest,
	PermitAppUpsertRequest,
	PoliceOfficerRoleCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FileUtilService } from '@app/core/services/file-util.service';
import { SpdFile, UtilService } from '@app/core/services/util.service';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { ApplicationHelper } from './application.helper';
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

export abstract class PermitApplicationHelper extends ApplicationHelper {
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
		attachments: new FormControl([]),
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

	reprintLicenceFormGroup: FormGroup = this.formBuilder.group(
		{
			reprintLicence: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'reprintLicence',
					(_form) =>
						!!(
							this.personalInformationFormGroup?.get('hasLegalNameChanged')?.value ||
							this.personalInformationFormGroup?.get('hasBcscNameChanged')?.value
						)
				),
			],
		}
	);

	override citizenshipFormGroup: FormGroup = this.formBuilder.group(
		{
			isCanadianCitizen: new FormControl('', [FormControlValidators.required]),
			isCanadianResident: new FormControl(''),
			canadianCitizenProofTypeCode: new FormControl(''),
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
					'isCanadianResident',
					(form) => form.get('isCanadianCitizen')?.value == BooleanTypeCode.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'proofOfResidentStatusCode',
					(form) =>
						form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
						form.get('isCanadianResident')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'proofOfCitizenshipCode',
					(form) =>
						form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
						form.get('isCanadianResident')?.value == BooleanTypeCode.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('isCanadianResident')?.value == BooleanTypeCode.Yes &&
							(form.get('proofOfResidentStatusCode')?.value == LicenceDocumentTypeCode.WorkPermit ||
								form.get('proofOfResidentStatusCode')?.value == LicenceDocumentTypeCode.StudyPermit))
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedPhotoTypeCode',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value !== LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('isCanadianResident')?.value == BooleanTypeCode.Yes &&
							form.get('proofOfResidentStatusCode')?.value !== LicenceDocumentTypeCode.PermanentResidentCard) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('isCanadianResident')?.value == BooleanTypeCode.No &&
							form.get('proofOfCitizenshipCode')?.value !== LicenceDocumentTypeCode.NonCanadianPassport)
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedAttachments',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value !== LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('isCanadianResident')?.value == BooleanTypeCode.Yes &&
							form.get('proofOfResidentStatusCode')?.value !== LicenceDocumentTypeCode.PermanentResidentCard) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('isCanadianResident')?.value == BooleanTypeCode.No &&
							form.get('proofOfCitizenshipCode')?.value !== LicenceDocumentTypeCode.NonCanadianPassport)
				),
			],
		}
	);

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		check2: new FormControl(null, [Validators.requiredTrue]),
		check3: new FormControl(null, [Validators.requiredTrue]),
		check4: new FormControl(null, [Validators.requiredTrue]),
		agreeToCompleteAndAccurate: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
		captchaFormGroup: new FormGroup(
			{
				displayCaptcha: new FormControl(false),
				token: new FormControl(''),
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
		formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected formatDatePipe: FormatDatePipe,
		protected utilService: UtilService,
		protected fileUtilService: FileUtilService,
		protected optionsPipe: OptionsPipe
	) {
		super(formBuilder);
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	getProfileSaveBody(permitModelFormValue: any): ApplicantUpdateRequest {
		const applicationTypeData = permitModelFormValue.applicationTypeData;
		const contactInformationData = permitModelFormValue.contactInformationData;
		const residentialAddressData = permitModelFormValue.residentialAddressData;
		const mailingAddressData = permitModelFormValue.mailingAddressData;
		const personalInformationData = permitModelFormValue.personalInformationData;
		const criminalHistoryData = permitModelFormValue.criminalHistoryData;

		// Even thought this used by permits, still need to save the original data
		const policeBackgroundData = permitModelFormValue.policeBackgroundData;
		const mentalHealthConditionsData = permitModelFormValue.mentalHealthConditionsData;

		const applicationTypeCode = applicationTypeData.applicationTypeCode;

		const hasCriminalHistory = this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory);
		const criminalChargeDescription =
			applicationTypeCode === ApplicationTypeCode.Update && hasCriminalHistory
				? criminalHistoryData.criminalChargeDescription
				: null;

		const documentKeyCodes: null | Array<string> = [];
		const previousDocumentIds: null | Array<string> = [];

		const isTreatedForMHC = this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC);
		const isPoliceOrPeaceOfficer = this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer);
		const policeOfficerRoleCode = isPoliceOrPeaceOfficer ? policeBackgroundData.policeOfficerRoleCode : null;
		const otherOfficerRole =
			policeOfficerRoleCode === PoliceOfficerRoleCode.Other ? policeBackgroundData.otherOfficerRole : null;

		let hasNewMentalHealthCondition: boolean | null = null;
		let hasNewCriminalRecordCharge: boolean | null = null;
		if (applicationTypeCode === ApplicationTypeCode.Update || applicationTypeCode === ApplicationTypeCode.Renewal) {
			hasNewMentalHealthCondition = isTreatedForMHC;
			hasNewCriminalRecordCharge = hasCriminalHistory;
		}

		const requestbody: ApplicantUpdateRequest = {
			licenceId: undefined,
			applicationTypeCode: undefined,
			givenName: personalInformationData.givenName,
			surname: personalInformationData.surname,
			middleName1: personalInformationData.middleName1,
			middleName2: personalInformationData.middleName2,
			dateOfBirth: personalInformationData.dateOfBirth,
			emailAddress: contactInformationData.emailAddress,
			phoneNumber: contactInformationData.phoneNumber,
			genderCode: personalInformationData.genderCode,
			//-----------------------------------
			aliases:
				permitModelFormValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes
					? permitModelFormValue.aliasesData.aliases
					: [],
			//-----------------------------------
			documentKeyCodes,
			previousDocumentIds,
			//-----------------------------------
			isTreatedForMHC,
			hasNewMentalHealthCondition,
			//-----------------------------------
			isPoliceOrPeaceOfficer,
			policeOfficerRoleCode,
			otherOfficerRole,
			//-----------------------------------
			hasCriminalHistory,
			hasNewCriminalRecordCharge,
			criminalChargeDescription, // populated only for Update and new charges is Yes
			//-----------------------------------
			mailingAddress: mailingAddressData.isAddressTheSame ? residentialAddressData : mailingAddressData,
			residentialAddress: residentialAddressData,
		};

		console.debug('[getProfileSaveBody] permitModelFormValue', permitModelFormValue);
		console.debug('[getProfileSaveBody] requestbody', requestbody);

		return requestbody;
	}

	getDocsToSaveBlobs(permitModelFormValue: any): Array<PermitDocumentsToSave> {
		const documents: Array<PermitDocumentsToSave> = [];

		const applicationTypeData = permitModelFormValue.applicationTypeData;
		const workerLicenceTypeData = permitModelFormValue.workerLicenceTypeData;
		const citizenshipData = permitModelFormValue.citizenshipData;
		const photographOfYourselfData = permitModelFormValue.photographOfYourselfData;
		const personalInformationData = permitModelFormValue.personalInformationData;
		const permitRationaleData = permitModelFormValue.permitRationaleData;

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

			let citizenshipLicenceDocumentTypeCode = citizenshipData.canadianCitizenProofTypeCode;
			if (citizenshipData.isCanadianCitizen != BooleanTypeCode.Yes) {
				if (citizenshipData.isCanadianResident == BooleanTypeCode.Yes) {
					citizenshipLicenceDocumentTypeCode = citizenshipData.proofOfResidentStatusCode;
				} else {
					citizenshipLicenceDocumentTypeCode = citizenshipData.proofOfCitizenshipCode;
				}
			}

			documents.push({ licenceDocumentTypeCode: citizenshipLicenceDocumentTypeCode, documents: docs });
		}

		const showAdditionalGovIdData = this.utilService.getPermitShowAdditionalGovIdData(
			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			citizenshipData.isCanadianResident == BooleanTypeCode.Yes,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.proofOfResidentStatusCode,
			citizenshipData.proofOfCitizenshipCode
		);

		if (showAdditionalGovIdData && citizenshipData.governmentIssuedAttachments) {
			const docs: Array<Blob> = [];
			citizenshipData.governmentIssuedAttachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: citizenshipData.governmentIssuedPhotoTypeCode, documents: docs });
		}

		const updatePhoto = photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
		if (applicationTypeData.applicationTypeCode === ApplicationTypeCode.New || !updatePhoto) {
			const docs: Array<Blob> = [];
			photographOfYourselfData.attachments?.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
		} else {
			const docs: Array<Blob> = [];
			photographOfYourselfData.updateAttachments?.forEach((doc: SpdFile) => {
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

		console.debug('getDocsToSaveBlobs documentsToSave', documents);
		return documents;
	}

	getProfileDocsToSaveKeep(permitModelFormValue: any): Array<string> {
		// documents are never added/updates/removed to a permit profile,
		// so just return the existing documents on the profile
		const documents: Array<string> = [];

		const mentalHealthConditionsData = permitModelFormValue.mentalHealthConditionsData;
		const policeBackgroundData = permitModelFormValue.policeBackgroundData;

		const isTreatedForMHC = this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC);
		const isPoliceOrPeaceOfficer = this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer);

		if (isPoliceOrPeaceOfficer && policeBackgroundData.attachments) {
			policeBackgroundData.attachments.forEach((doc: SpdFile) => {
				documents.push(doc.documentUrlId!);
			});
		}

		if (isTreatedForMHC && mentalHealthConditionsData.attachments) {
			mentalHealthConditionsData.attachments.forEach((doc: SpdFile) => {
				documents.push(doc.documentUrlId!);
			});
		}

		return documents;
	}

	getSaveBodyBaseSubmitAuthenticated(permitModelFormValue: any): PermitAppSubmitRequest {
		const baseData = this.getSaveBodyBase(permitModelFormValue, true);
		console.debug('[getSaveBodyBaseSubmitAuthenticated] baseData', baseData);

		const returnBody: PermitAppSubmitRequest = baseData;
		return returnBody;
	}

	getSaveBodyBaseUpsertAuthenticated(permitModelFormValue: any): PermitAppUpsertRequest {
		const baseData = this.getSaveBodyBase(permitModelFormValue, true);
		console.debug('[getSaveBodyBaseUpsertAuthenticated] baseData', baseData);

		const returnBody: PermitAppUpsertRequest = baseData;
		return returnBody;
	}

	getSaveBodyBaseSubmitAnonymous(permitModelFormValue: any): PermitAppSubmitRequest {
		const baseData = this.getSaveBodyBase(permitModelFormValue, false);
		console.debug('[getSaveBodyBaseSubmitAnonymous] baseData', baseData);

		const returnBody: PermitAppSubmitRequest = baseData;
		return returnBody;
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	private getSaveBodyBase(permitModelFormValue: any, isAuthenticated: boolean): any {
		const licenceAppId = permitModelFormValue.licenceAppId;
		const originalLicenceData = permitModelFormValue.originalLicenceData;
		const workerLicenceTypeData = permitModelFormValue.workerLicenceTypeData;
		const applicationTypeData = permitModelFormValue.applicationTypeData;
		const bcDriversLicenceData = permitModelFormValue.bcDriversLicenceData;
		const contactInformationData = permitModelFormValue.contactInformationData;
		const expiredLicenceData = permitModelFormValue.expiredLicenceData;
		const characteristicsData = permitModelFormValue.characteristicsData;
		const residentialAddressData = permitModelFormValue.residentialAddressData;
		const mailingAddressData = permitModelFormValue.mailingAddressData;
		const citizenshipData = permitModelFormValue.citizenshipData;
		const photographOfYourselfData = permitModelFormValue.photographOfYourselfData;
		const personalInformationData = permitModelFormValue.personalInformationData;
		const permitRequirementData = permitModelFormValue.permitRequirementData;
		const permitRationaleData = permitModelFormValue.permitRationaleData;

		const documentInfos: Array<Document> = [];

		let employerData = {};
		let employerPrimaryAddress = {};

		// default the flags
		mailingAddressData.isAddressTheSame = !!mailingAddressData.isAddressTheSame; // make it a boolean
		personalInformationData.hasLegalNameChanged = !!personalInformationData.hasLegalNameChanged;

		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		if (personalInformationData.hasLegalNameChanged) {
			personalInformationData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.LegalNameChange,
				});
			});
		}
		delete personalInformationData.attachments; // cleanup so that it is not included in the payload

		permitRationaleData.attachments?.forEach((doc: any) => {
			const licenceDocumentTypeCode =
				workerLicenceTypeData.workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit
					? LicenceDocumentTypeCode.ArmouredVehicleRationale
					: LicenceDocumentTypeCode.BodyArmourRationale;
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode,
			});
		});

		const isCanadianCitizen = this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen);

		citizenshipData.attachments?.forEach((doc: any) => {
			let licenceDocumentTypeCode = citizenshipData.canadianCitizenProofTypeCode;
			if (!isCanadianCitizen) {
				if (citizenshipData.isCanadianResident == BooleanTypeCode.Yes) {
					licenceDocumentTypeCode = citizenshipData.proofOfResidentStatusCode;
				} else {
					licenceDocumentTypeCode = citizenshipData.proofOfCitizenshipCode;
				}
			}

			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				expiryDate: citizenshipData.expiryDate
					? this.formatDatePipe.transform(citizenshipData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
					: null,
				licenceDocumentTypeCode,
			});
		});

		const isIncludeAdditionalGovermentIdStepData = this.utilService.getPermitShowAdditionalGovIdData(
			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			citizenshipData.isCanadianResident == BooleanTypeCode.Yes,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.proofOfResidentStatusCode,
			citizenshipData.proofOfCitizenshipCode
		);

		if (isIncludeAdditionalGovermentIdStepData && citizenshipData.governmentIssuedAttachments) {
			citizenshipData.governmentIssuedAttachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					expiryDate: citizenshipData.governmentIssuedExpiryDate
						? this.formatDatePipe.transform(
								citizenshipData.governmentIssuedExpiryDate,
								SPD_CONSTANTS.date.backendDateFormat
						  )
						: null,
					licenceDocumentTypeCode: citizenshipData.governmentIssuedPhotoTypeCode,
				});
			});
		}

		if (characteristicsData.heightUnitCode == HeightUnitCode.Inches) {
			const ft: number = +characteristicsData.height;
			const inch: number = +characteristicsData.heightInches;
			characteristicsData.height = String(ft * 12 + inch);
		}

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

		if (includesMyEmployement) {
			const allEmployerData = permitModelFormValue.employerData;
			employerData = {
				employerName: allEmployerData.employerName,
				supervisorName: allEmployerData.supervisorName,
				supervisorEmailAddress: allEmployerData.supervisorEmailAddress,
				supervisorPhoneNumber: allEmployerData.supervisorPhoneNumber,
			};

			employerPrimaryAddress = {
				addressLine1: allEmployerData.addressLine1,
				addressLine2: allEmployerData.addressLine2,
				city: allEmployerData.city,
				postalCode: allEmployerData.postalCode,
				province: allEmployerData.province,
				country: allEmployerData.country,
			};
		}

		const criminalHistoryData = permitModelFormValue.criminalHistoryData;
		const criminalChargeDescription =
			applicationTypeData.applicationTypeCode === ApplicationTypeCode.Update &&
			criminalHistoryData.hasCriminalHistory === BooleanTypeCode.Yes
				? criminalHistoryData.criminalChargeDescription
				: '';

		const updatePhoto = photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
		if (applicationTypeData.applicationTypeCode === ApplicationTypeCode.New || updatePhoto || !isAuthenticated) {
			photographOfYourselfData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
				});
			});
		} else {
			photographOfYourselfData.updateAttachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
				});
			});
		}

		const documentExpiredInfos: Array<DocumentExpiredInfo> =
			documentInfos
				.filter((doc) => doc.expiryDate)
				.map((doc: Document) => {
					return {
						expiryDate: doc.expiryDate,
						licenceDocumentTypeCode: doc.licenceDocumentTypeCode,
					} as DocumentExpiredInfo;
				}) ?? [];

		const hasExpiredLicence = expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes;
		const expiredLicenceId = hasExpiredLicence ? expiredLicenceData.expiredLicenceId : null;
		if (!hasExpiredLicence) {
			this.clearExpiredLicenceModelData();
		}

		const body = {
			licenceAppId,
			originalApplicationId: originalLicenceData.originalApplicationId,
			originalLicenceId: originalLicenceData.originalLicenceId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			//-----------------------------------
			bizTypeCode: BizTypeCode.None,
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
			hasExpiredLicence,
			expiredLicenceId,
			//-----------------------------------
			hairColourCode: characteristicsData.hairColourCode,
			eyeColourCode: characteristicsData.eyeColourCode,
			height: characteristicsData.height,
			heightUnitCode: characteristicsData.heightUnitCode,
			heightInches: characteristicsData.heightInches,
			weight: characteristicsData.weight,
			weightUnitCode: characteristicsData.weightUnitCode,
			//-----------------------------------
			givenName: personalInformationData.givenName,
			surname: personalInformationData.surname,
			middleName1: personalInformationData.middleName1,
			middleName2: personalInformationData.middleName2,
			dateOfBirth: personalInformationData.dateOfBirth,
			emailAddress: contactInformationData.emailAddress,
			phoneNumber: contactInformationData.phoneNumber,
			genderCode: personalInformationData.genderCode,
			//-----------------------------------
			hasCriminalHistory: this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory),
			hasNewCriminalRecordCharge: this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory), // used by the backend for an Update or Renewal
			criminalChargeDescription, // populated only for Update and new charges is Yes
			//-----------------------------------
			licenceTermCode: permitModelFormValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			reprint: this.utilService.booleanTypeToBoolean(permitModelFormValue.reprintLicenceData.reprintLicence),
			//-----------------------------------
			isMailingTheSameAsResidential: mailingAddressData.isAddressTheSame,
			mailingAddress: mailingAddressData.isAddressTheSame ? residentialAddressData : mailingAddressData,
			residentialAddress: residentialAddressData,
			//-----------------------------------
			isCanadianCitizen,
			isCanadianResident: isCanadianCitizen
				? null
				: this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianResident),
			//-----------------------------------
			rationale: permitRationaleData.rationale,
			//-----------------------------------
			...employerData,
			employerPrimaryAddress: includesMyEmployement ? employerPrimaryAddress : null,
			//-----------------------------------
			armouredVehiclePermitReasonCodes,
			bodyArmourPermitReasonCodes,
			permitOtherRequiredReason,
			//-----------------------------------
			documentExpiredInfos: [...documentExpiredInfos],
			documentInfos: isAuthenticated ? [...documentInfos] : undefined,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getSummarylicenceHolderName(permitModelData: any): string {
		return this.utilService.getFullNameWithMiddle(
			permitModelData.personalInformationData.givenName,
			permitModelData.personalInformationData.middleName1,
			permitModelData.personalInformationData.middleName2,
			permitModelData.personalInformationData.surname
		);
	}
	getSummaryshowPhotographOfYourself(permitModelData: any): boolean {
		return (
			this.getSummaryhasGenderChanged(permitModelData) &&
			this.getSummaryphotoOfYourselfAttachments(permitModelData).length > 0
		);
	}

	getSummaryisReprint(permitModelData: any): string {
		return permitModelData.reprintLicenceData.reprintLicence ?? '';
	}
	getSummarycaseNumber(permitModelData: any): string {
		return permitModelData.caseNumber ?? '';
	}

	getSummaryhasBcscNameChanged(permitModelData: any): boolean {
		return permitModelData.personalInformationData.hasBcscNameChanged ?? '';
	}
	getSummaryhasGenderChanged(permitModelData: any): boolean {
		return permitModelData.personalInformationData.hasGenderChanged ?? '';
	}
	getSummaryoriginalLicenceNumber(permitModelData: any): string {
		return permitModelData.originalLicenceData.originalLicenceNumber ?? '';
	}
	getSummaryoriginalExpiryDate(permitModelData: any): string {
		return permitModelData.originalLicenceData.originalExpiryDate ?? '';
	}
	getSummaryoriginalLicenceTermCode(permitModelData: any): string {
		return permitModelData.originalLicenceData.originalLicenceTermCode ?? '';
	}
	getSummaryworkerLicenceTypeCode(permitModelData: any): WorkerLicenceTypeCode | null {
		return permitModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}
	getSummaryapplicationTypeCode(permitModelData: any): ApplicationTypeCode | null {
		return permitModelData.applicationTypeData?.applicationTypeCode ?? null;
	}
	getSummarylicenceTermCode(permitModelData: any): string {
		return permitModelData.licenceTermData.licenceTermCode ?? '';
	}
	getSummaryhasExpiredLicence(permitModelData: any): string {
		return permitModelData.expiredLicenceData.hasExpiredLicence ?? '';
	}
	getSummaryexpiredLicenceNumber(permitModelData: any): string {
		return permitModelData.expiredLicenceData.expiredLicenceNumber ?? '';
	}
	getSummaryexpiredLicenceExpiryDate(permitModelData: any): string {
		return permitModelData.expiredLicenceData.expiredLicenceExpiryDate ?? '';
	}

	getSummarygivenName(permitModelData: any): string {
		return permitModelData.personalInformationData.givenName ?? '';
	}
	getSummarymiddleName1(permitModelData: any): string {
		return permitModelData.personalInformationData.middleName1 ?? '';
	}
	getSummarymiddleName2(permitModelData: any): string {
		return permitModelData.personalInformationData.middleName2 ?? '';
	}
	getSummarysurname(permitModelData: any): string {
		return permitModelData.personalInformationData.surname ?? '';
	}
	getSummarygenderCode(permitModelData: any): string {
		return permitModelData.personalInformationData.genderCode ?? '';
	}
	getSummarydateOfBirth(permitModelData: any): string {
		return permitModelData.personalInformationData.dateOfBirth ?? '';
	}

	getSummarypreviousNameFlag(permitModelData: any): string {
		return permitModelData.aliasesData.previousNameFlag ?? '';
	}
	getSummaryaliases(permitModelData: any): Array<any> {
		return permitModelData.aliasesData.aliases ?? [];
	}

	getSummarycriminalHistoryLabel(permitModelData: any): string {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(permitModelData);
		if (applicationTypeCode === ApplicationTypeCode.Update || applicationTypeCode === ApplicationTypeCode.Renewal) {
			return 'New Criminal Charges or Convictions';
		} else {
			return 'Previously been Charged or Convicted of a Crime';
		}
	}
	getSummaryhasCriminalHistory(permitModelData: any): string {
		return permitModelData.criminalHistoryData.hasCriminalHistory ?? '';
	}
	getSummarycriminalChargeDescription(permitModelData: any): string {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(permitModelData);

		return applicationTypeCode === ApplicationTypeCode.Update &&
			this.getSummaryhasCriminalHistory(permitModelData) === BooleanTypeCode.Yes
			? permitModelData.criminalHistoryData.criminalChargeDescription
			: '';
	}

	getSummaryisCanadianCitizen(permitModelData: any): string {
		return permitModelData.citizenshipData.isCanadianCitizen ?? '';
	}
	getSummarycanadianCitizenProofTypeCode(permitModelData: any): string {
		return permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.Yes
			? permitModelData.citizenshipData.canadianCitizenProofTypeCode ?? ''
			: '';
	}
	getSummaryisCanadianResident(permitModelData: any): string {
		return permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No
			? permitModelData.citizenshipData.isCanadianResident ?? ''
			: '';
	}
	getSummaryproofOfResidentStatusCode(permitModelData: any): string {
		return permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No &&
			permitModelData.citizenshipData.isCanadianResident === BooleanTypeCode.Yes
			? permitModelData.citizenshipData.proofOfResidentStatusCode ?? ''
			: '';
	}
	getSummaryproofOfCitizenshipCode(permitModelData: any): string {
		return permitModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No &&
			permitModelData.citizenshipData.isCanadianResident === BooleanTypeCode.No
			? permitModelData.citizenshipData.proofOfCitizenshipCode ?? ''
			: '';
	}
	getSummarycitizenshipExpiryDate(permitModelData: any): string {
		return permitModelData.citizenshipData.expiryDate ?? '';
	}
	getSummaryattachments(permitModelData: any): File[] {
		return permitModelData.citizenshipData.attachments ?? [];
	}

	getSummaryshowAdditionalGovIdData(permitModelData: any): boolean {
		return this.utilService.getPermitShowAdditionalGovIdData(
			this.getSummaryisCanadianCitizen(permitModelData) == BooleanTypeCode.Yes,
			this.getSummaryisCanadianResident(permitModelData) == BooleanTypeCode.Yes,
			this.getSummarycanadianCitizenProofTypeCode(permitModelData) as LicenceDocumentTypeCode,
			this.getSummaryproofOfResidentStatusCode(permitModelData) as LicenceDocumentTypeCode,
			this.getSummaryproofOfCitizenshipCode(permitModelData) as LicenceDocumentTypeCode
		);
	}

	getSummarygovernmentIssuedPhotoTypeCode(permitModelData: any): string {
		return this.getSummaryshowAdditionalGovIdData(permitModelData)
			? permitModelData.citizenshipData.governmentIssuedPhotoTypeCode
			: '';
	}
	getSummarygovernmentIssuedPhotoExpiryDate(permitModelData: any): string {
		return this.getSummaryshowAdditionalGovIdData(permitModelData)
			? permitModelData.citizenshipData.governmentIssuedExpiryDate
			: '';
	}
	getSummarygovernmentIssuedPhotoAttachments(permitModelData: any): File[] {
		return this.getSummaryshowAdditionalGovIdData(permitModelData)
			? permitModelData.citizenshipData.governmentIssuedAttachments
			: [];
	}

	getSummarybcDriversLicenceNumber(permitModelData: any): string {
		return permitModelData.bcDriversLicenceData.hasBcDriversLicence === BooleanTypeCode.Yes
			? permitModelData.bcDriversLicenceData.bcDriversLicenceNumber ?? ''
			: '';
	}

	getSummaryhairColourCode(permitModelData: any): string {
		return permitModelData.characteristicsData.hairColourCode ?? '';
	}
	getSummaryeyeColourCode(permitModelData: any): string {
		return permitModelData.characteristicsData.eyeColourCode ?? '';
	}
	getSummaryheight(permitModelData: any): string {
		return permitModelData.characteristicsData.height ?? '';
	}
	getSummaryheightInches(permitModelData: any): string {
		return permitModelData.characteristicsData.heightInches ?? '';
	}
	getSummaryheightUnitCode(permitModelData: any): string {
		return permitModelData.characteristicsData.heightUnitCode ?? '';
	}
	getSummaryweight(permitModelData: any): string {
		return permitModelData.characteristicsData.weight ?? '';
	}
	getSummaryweightUnitCode(permitModelData: any): string {
		return permitModelData.characteristicsData.weightUnitCode ?? '';
	}

	getSummaryphotoOfYourselfAttachments(permitModelData: any): File[] {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(permitModelData);

		if (applicationTypeCode === ApplicationTypeCode.New) {
			return permitModelData.photographOfYourselfData.attachments ?? [];
		} else {
			const updatePhoto = permitModelData.photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
			const updateAttachments = permitModelData.photographOfYourselfData.updateAttachments ?? [];
			return updatePhoto ? updateAttachments : null;
		}
	}

	getSummaryemailAddress(permitModelData: any): string {
		return permitModelData.contactInformationData?.emailAddress ?? '';
	}
	getSummaryphoneNumber(permitModelData: any): string {
		return permitModelData.contactInformationData?.phoneNumber ?? '';
	}

	getSummarypurposeLabel(permitModelData: any): string {
		if (this.getSummaryworkerLicenceTypeCode(permitModelData) === WorkerLicenceTypeCode.ArmouredVehiclePermit) {
			return 'Reasons for Requiring an Armoured Vehicle';
		} else {
			return 'Reasons for Requiring Body Armour';
		}
	}
	getSummarypurposeReasons(permitModelData: any): Array<string> {
		const reasonList = [];

		if (this.getSummaryworkerLicenceTypeCode(permitModelData) === WorkerLicenceTypeCode.ArmouredVehiclePermit) {
			const armouredVehicleRequirement = permitModelData.permitRequirementData.armouredVehicleRequirementFormGroup;
			if (armouredVehicleRequirement.isPersonalProtection) {
				reasonList.push(
					this.optionsPipe.transform(
						ArmouredVehiclePermitReasonCode.PersonalProtection,
						'ArmouredVehiclePermitReasonTypes'
					)
				);
			}
			if (armouredVehicleRequirement.isProtectionOfAnotherPerson) {
				reasonList.push(
					this.optionsPipe.transform(
						ArmouredVehiclePermitReasonCode.ProtectionOfAnotherPerson,
						'ArmouredVehiclePermitReasonTypes'
					)
				);
			}
			if (armouredVehicleRequirement.isProtectionOfPersonalProperty) {
				reasonList.push(
					this.optionsPipe.transform(
						ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty,
						'ArmouredVehiclePermitReasonTypes'
					)
				);
			}
			if (armouredVehicleRequirement.isProtectionOfOthersProperty) {
				reasonList.push(
					this.optionsPipe.transform(
						ArmouredVehiclePermitReasonCode.ProtectionOfOtherProperty,
						'ArmouredVehiclePermitReasonTypes'
					)
				);
			}
			if (armouredVehicleRequirement.isMyEmployment) {
				reasonList.push(
					this.optionsPipe.transform(ArmouredVehiclePermitReasonCode.MyEmployment, 'ArmouredVehiclePermitReasonTypes')
				);
			}
			if (armouredVehicleRequirement.isOther) {
				reasonList.push(
					this.optionsPipe.transform(ArmouredVehiclePermitReasonCode.Other, 'ArmouredVehiclePermitReasonTypes')
				);
			}
		} else {
			const bodyArmourRequirementFormGroup = permitModelData.permitRequirementData.bodyArmourRequirementFormGroup;
			if (bodyArmourRequirementFormGroup.isOutdoorRecreation) {
				reasonList.push(
					this.optionsPipe.transform(BodyArmourPermitReasonCode.OutdoorRecreation, 'BodyArmourPermitReasonTypes')
				);
			}
			if (bodyArmourRequirementFormGroup.isPersonalProtection) {
				reasonList.push(
					this.optionsPipe.transform(BodyArmourPermitReasonCode.PersonalProtection, 'BodyArmourPermitReasonTypes')
				);
			}
			if (bodyArmourRequirementFormGroup.isMyEmployment) {
				reasonList.push(
					this.optionsPipe.transform(BodyArmourPermitReasonCode.MyEmployment, 'BodyArmourPermitReasonTypes')
				);
			}
			if (bodyArmourRequirementFormGroup.isTravelForConflict) {
				reasonList.push(
					this.optionsPipe.transform(
						BodyArmourPermitReasonCode.TravelInResponseToInternationalConflict,
						'BodyArmourPermitReasonTypes'
					)
				);
			}
			if (bodyArmourRequirementFormGroup.isOther) {
				reasonList.push(this.optionsPipe.transform(BodyArmourPermitReasonCode.Other, 'BodyArmourPermitReasonTypes'));
			}
		}
		return reasonList;
	}
	getSummaryisOtherReason(permitModelData: any): boolean {
		if (this.getSummaryworkerLicenceTypeCode(permitModelData) === WorkerLicenceTypeCode.ArmouredVehiclePermit) {
			const armouredVehicleRequirement = permitModelData.permitRequirementData.armouredVehicleRequirementFormGroup;
			return armouredVehicleRequirement.isOther;
		} else {
			const bodyArmourRequirementFormGroup = permitModelData.permitRequirementData.bodyArmourRequirementFormGroup;
			return bodyArmourRequirementFormGroup.isOther;
		}
	}
	getSummaryotherReason(permitModelData: any): boolean {
		return permitModelData.permitRequirementData.otherReason;
	}

	getSummaryrationaleLabel(permitModelData: any): string {
		if (this.getSummaryworkerLicenceTypeCode(permitModelData) === WorkerLicenceTypeCode.ArmouredVehiclePermit) {
			return 'Rationale for Requiring an Armoured Vehicle';
		} else {
			return 'Rationale for Requiring Body Armour';
		}
	}
	getSummaryrationale(permitModelData: any): string {
		return permitModelData.permitRationaleData?.rationale ?? '';
	}
	getSummaryisRationaleAttachments(permitModelData: any): boolean {
		return permitModelData.permitRationaleData?.attachments?.length > 0;
	}
	getSummaryrationaleAttachments(permitModelData: any): File[] {
		return permitModelData.permitRationaleData?.attachments ?? [];
	}

	getSummaryemployerName(permitModelData: any): string {
		return permitModelData.employerData?.employerName ?? '';
	}
	getSummarysupervisorName(permitModelData: any): string {
		return permitModelData.employerData?.supervisorName ?? '';
	}
	getSummarysupervisorEmailAddress(permitModelData: any): string {
		return permitModelData.employerData?.supervisorEmailAddress ?? '';
	}
	getSummarysupervisorPhoneNumber(permitModelData: any): string {
		return permitModelData.employerData?.supervisorPhoneNumber ?? '';
	}
	getSummarybusinessAddressLine1(permitModelData: any): string {
		return permitModelData.employerData?.addressLine1 ?? '';
	}
	getSummarybusinessAddressLine2(permitModelData: any): string {
		return permitModelData.employerData?.addressLine2 ?? '';
	}
	getSummarybusinessCity(permitModelData: any): string {
		return permitModelData.employerData?.city ?? '';
	}
	getSummarybusinessPostalCode(permitModelData: any): string {
		return permitModelData.employerData?.postalCode ?? '';
	}
	getSummarybusinessProvince(permitModelData: any): string {
		return permitModelData.employerData?.province ?? '';
	}
	getSummarybusinessCountry(permitModelData: any): string {
		return permitModelData.employerData?.country ?? '';
	}

	getSummaryresidentialAddressLine1(permitModelData: any): string {
		return permitModelData.residentialAddressData?.addressLine1 ?? '';
	}
	getSummaryresidentialAddressLine2(permitModelData: any): string {
		return permitModelData.residentialAddressData?.addressLine2 ?? '';
	}
	getSummaryresidentialCity(permitModelData: any): string {
		return permitModelData.residentialAddressData?.city ?? '';
	}
	getSummaryresidentialPostalCode(permitModelData: any): string {
		return permitModelData.residentialAddressData?.postalCode ?? '';
	}
	getSummaryresidentialProvince(permitModelData: any): string {
		return permitModelData.residentialAddressData?.province ?? '';
	}
	getSummaryresidentialCountry(permitModelData: any): string {
		return permitModelData.residentialAddressData?.country ?? '';
	}
	getSummaryisAddressTheSame(permitModelData: any): string {
		return permitModelData.mailingAddressData?.isAddressTheSame ?? '';
	}

	getSummarymailingAddressLine1(permitModelData: any): string {
		return permitModelData.mailingAddressData?.addressLine1 ?? '';
	}
	getSummarymailingAddressLine2(permitModelData: any): string {
		return permitModelData.mailingAddressData?.addressLine2 ?? '';
	}
	getSummarymailingCity(permitModelData: any): string {
		return permitModelData.mailingAddressData?.city ?? '';
	}
	getSummarymailingPostalCode(permitModelData: any): string {
		return permitModelData.mailingAddressData?.postalCode ?? '';
	}
	getSummarymailingProvince(permitModelData: any): string {
		return permitModelData.mailingAddressData?.province ?? '';
	}
	getSummarymailingCountry(permitModelData: any): string {
		return permitModelData.mailingAddressData?.country ?? '';
	}
}
