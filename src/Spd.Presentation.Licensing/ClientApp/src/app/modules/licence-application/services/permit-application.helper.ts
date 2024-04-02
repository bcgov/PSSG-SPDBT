import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicantUpdateRequest,
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
import { FileUtilService } from '@app/core/services/file-util.service';
import { SpdFile, UtilService } from '@app/core/services/util.service';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { CommonApplicationHelper } from './common-application.helper';
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

export abstract class PermitApplicationHelper extends CommonApplicationHelper {
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

	citizenshipFormGroup: FormGroup = this.formBuilder.group(
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
		protected fileUtilService: FileUtilService
	) {
		super(formBuilder);
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	getProfileSaveBody(licenceModelFormValue: any): ApplicantUpdateRequest {
		const applicationTypeData = { ...licenceModelFormValue.applicationTypeData };
		const contactInformationData = { ...licenceModelFormValue.contactInformationData };
		const residentialAddress = { ...licenceModelFormValue.residentialAddress };
		const mailingAddress = { ...licenceModelFormValue.mailingAddress };
		const personalInformationData = { ...licenceModelFormValue.personalInformationData };
		const criminalHistoryData = licenceModelFormValue.criminalHistoryData;

		const applicationTypeCode = applicationTypeData.applicationTypeCode;

		const criminalChargeDescription =
			applicationTypeCode === ApplicationTypeCode.Update &&
			criminalHistoryData.hasCriminalHistory === BooleanTypeCode.Yes
				? criminalHistoryData.criminalChargeDescription
				: null;

		const documentKeyCodes: null | Array<string> = [];
		const previousDocumentIds: null | Array<string> = [];

		let hasNewCriminalRecordCharge: boolean | null = null;
		if (applicationTypeCode === ApplicationTypeCode.Update || applicationTypeCode === ApplicationTypeCode.Renewal) {
			hasNewCriminalRecordCharge = this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory);
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
				licenceModelFormValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes
					? licenceModelFormValue.aliasesData.aliases
					: [],
			//-----------------------------------
			documentKeyCodes,
			previousDocumentIds,
			//-----------------------------------
			hasCriminalHistory: this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory),
			hasNewCriminalRecordCharge: hasNewCriminalRecordCharge,
			criminalChargeDescription, // populated only for Update and new charges is Yes
			//-----------------------------------
			mailingAddress: residentialAddress.isMailingTheSameAsResidential ? residentialAddress : mailingAddress,
			residentialAddress: residentialAddress,
		};

		console.debug('[getProfileSaveBody] requestbody', requestbody);
		return requestbody;
	}

	getDocsToSaveBlobs(permitModelFormValue: any): Array<PermitDocumentsToSave> {
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

		console.debug('getDocsToSaveBlobs documentsToSave', documents);
		return documents;
	}

	getSaveBodyBaseAuthenticated(permitModelFormValue: any): PermitAppAnonymousSubmitRequest {
		const baseData = this.getSaveBodyBase(permitModelFormValue);
		console.debug('[getSaveBodyBaseAuthenticated] baseData', baseData);

		return baseData;
	}

	getSaveBodyBaseAnonymous(permitModelFormValue: any): PermitAppAnonymousSubmitRequest {
		const baseData = this.getSaveBodyBase(permitModelFormValue);
		console.debug('[getSaveBodyBaseAnonymous] baseData', baseData);

		//  TODO list differences:
		// documentKeyCodes
		// criminalChargeDescription
		// originalApplicationId
		// originalLicenceId
		// previousDocumentIds
		// reprint

		return baseData;
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	private getSaveBodyBase(permitModelFormValue: any): any {
		const licenceAppId = permitModelFormValue.licenceAppId;
		const originalApplicationId = permitModelFormValue.originalApplicationId;
		const originalLicenceId = permitModelFormValue.originalLicenceId;
		const workerLicenceTypeData = { ...permitModelFormValue.workerLicenceTypeData };
		const applicationTypeData = { ...permitModelFormValue.applicationTypeData };
		const bcDriversLicenceData = { ...permitModelFormValue.bcDriversLicenceData };
		const contactInformationData = { ...permitModelFormValue.contactInformationData };
		const expiredLicenceData = { ...permitModelFormValue.expiredLicenceData };
		const characteristicsData = { ...permitModelFormValue.characteristicsData };
		const residentialAddress = { ...permitModelFormValue.residentialAddress };
		const mailingAddress = { ...permitModelFormValue.mailingAddress };
		const citizenshipData = { ...permitModelFormValue.citizenshipData };
		const photographOfYourselfData = { ...permitModelFormValue.photographOfYourselfData };
		const personalInformationData = { ...permitModelFormValue.personalInformationData };

		const permitRequirementData = { ...permitModelFormValue.permitRequirementData };
		const permitRationaleData = { ...permitModelFormValue.permitRationaleData };
		const printPermitData = { ...permitModelFormValue.printPermitData };
		let employerData = {};
		let employerPrimaryAddress = {};

		// default the flags
		residentialAddress.isMailingTheSameAsResidential = !!residentialAddress.isMailingTheSameAsResidential;
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
		delete personalInformationData.attachments; // cleanup so that it is not included in the payload

		permitRationaleData.attachments
			?.filter((doc: any) => doc.documentUrlId)
			.forEach((doc: any) => {
				previousDocumentIds.push(doc.documentUrlId);
			});

		const isCanadianCitizen = this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen);
		citizenshipData.attachments?.forEach((doc: any) => {
			if (citizenshipData.expiryDate) {
				let licenceDocumentTypeCode = citizenshipData.canadianCitizenProofTypeCode;
				if (!isCanadianCitizen) {
					if (citizenshipData.isCanadianResident == BooleanTypeCode.Yes) {
						licenceDocumentTypeCode = citizenshipData.proofOfResidentStatusCode;
					} else {
						licenceDocumentTypeCode = citizenshipData.proofOfCitizenshipCode;
					}
				}

				documentExpiredInfos.push({
					expiryDate: this.formatDatePipe.transform(citizenshipData.expiryDate, SPD_CONSTANTS.date.backendDateFormat),
					licenceDocumentTypeCode,
				});
			}
			if (doc.documentUrlId) {
				previousDocumentIds.push(doc.documentUrlId);
			}
		});

		const showAdditionalGovIdData = this.utilService.getPermitShowAdditionalGovIdData(
			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			citizenshipData.isCanadianResident == BooleanTypeCode.Yes,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.proofOfResidentStatusCode,
			citizenshipData.proofOfCitizenshipCode
		);

		if (showAdditionalGovIdData && citizenshipData.governmentIssuedAttachments) {
			citizenshipData.governmentIssuedAttachments?.forEach((doc: any) => {
				if (citizenshipData.governmentIssuedExpiryDate) {
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

		// TODO update photo
		// const updatePhoto = photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
		// if (applicationTypeData.applicationTypeCode === ApplicationTypeCode.New || updatePhoto || !isAuthenticated) {
		// 	photographOfYourselfData.attachments?.forEach((doc: any) => {
		// 		documentInfos.push({
		// 			documentUrlId: doc.documentUrlId,
		// 			licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
		// 		});
		// 	});
		// } else {
		// 	photographOfYourselfData.updateAttachments?.forEach((doc: any) => {
		// 		documentInfos.push({
		// 			documentUrlId: doc.documentUrlId,
		// 			licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
		// 		});
		// 	});
		// }

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

		if (includesMyEmployement) {
			const allEmployerData = { ...permitModelFormValue.employerData };
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
			hasCriminalHistory: this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory),
			hasNewCriminalRecordCharge: this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory), // used by the backend for an Update or Renewal
			criminalChargeDescription, // populated only for Update and new charges is Yes
			//-----------------------------------
			reprint: this.utilService.booleanTypeToBoolean(printPermitData.isPrintPermit),
			//-----------------------------------
			licenceTermCode: permitModelFormValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			isMailingTheSameAsResidential: residentialAddress.isMailingTheSameAsResidential,
			mailingAddress: residentialAddress.isMailingTheSameAsResidential ? residentialAddress : mailingAddress,
			residentialAddress,
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
			previousDocumentIds: [...previousDocumentIds],
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}
}
