import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicantUpdateRequest,
	ApplicationTypeCode,
	BizTypeCode,
	Document,
	DocumentExpiredInfo,
	HeightUnitCode,
	LicenceDocumentTypeCode,
	WorkerCategoryTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FileUtilService } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, SpdFile, UtilService } from '@app/core/services/util.service';
import { BooleanTypeCode, SelectOptions, WorkerCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { ApplicationHelper } from './application.helper';

export abstract class LicenceApplicationHelper extends ApplicationHelper {
	soleProprietorFormGroup = this.formBuilder.group(
		{
			isSoleProprietor: new FormControl('', [FormControlValidators.required]),
			bizTypeCode: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'bizTypeCode',
					(form) => form.get('isSoleProprietor')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

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
			dogsPurposeFormGroup: new FormGroup({
				isDogsPurposeProtection: new FormControl(false),
				isDogsPurposeDetectionDrugs: new FormControl(false),
				isDogsPurposeDetectionExplosives: new FormControl(false),
			}),
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
				FormGroupValidators.atLeastOneCheckboxWhenReqdValidator('dogsPurposeFormGroup', 'useDogs', BooleanTypeCode.Yes),
			],
		}
	);

	citizenshipFormGroup: FormGroup = this.formBuilder.group(
		{
			isCanadianCitizen: new FormControl('', [FormControlValidators.required]),
			canadianCitizenProofTypeCode: new FormControl(''),
			notCanadianCitizenProofTypeCode: new FormControl(''),
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
					'notCanadianCitizenProofTypeCode',
					(form) => form.get('isCanadianCitizen')?.value == BooleanTypeCode.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							(form.get('notCanadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.WorkPermit ||
								form.get('notCanadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.StudyPermit))
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedPhotoTypeCode',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value != LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('notCanadianCitizenProofTypeCode')?.value != LicenceDocumentTypeCode.PermanentResidentCard)
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedAttachments',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value != LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('notCanadianCitizenProofTypeCode')?.value != LicenceDocumentTypeCode.PermanentResidentCard)
				),
			],
		}
	);

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

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		check2: new FormControl(null, [Validators.requiredTrue]),
		check3: new FormControl(null, [Validators.requiredTrue]),
		check4: new FormControl(null, [Validators.requiredTrue]),
		check5: new FormControl(null, [Validators.requiredTrue]),
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
		const policeBackgroundData = { ...licenceModelFormValue.policeBackgroundData };
		const mentalHealthConditionsData = { ...licenceModelFormValue.mentalHealthConditionsData };
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

		let hasNewMentalHealthCondition: boolean | null = null;
		let hasNewCriminalRecordCharge: boolean | null = null;
		if (applicationTypeCode === ApplicationTypeCode.Update || applicationTypeCode === ApplicationTypeCode.Renewal) {
			hasNewMentalHealthCondition = this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC);
			hasNewCriminalRecordCharge = this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory);
		}

		const isPoliceOrPeaceOfficer = this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer);

		const requestbody: ApplicantUpdateRequest = {
			licenceId: undefined,
			applicationTypeCode,
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
			isTreatedForMHC: this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC),
			hasNewMentalHealthCondition: hasNewMentalHealthCondition,
			//-----------------------------------
			isPoliceOrPeaceOfficer: isPoliceOrPeaceOfficer,
			policeOfficerRoleCode: isPoliceOrPeaceOfficer ? policeBackgroundData.policeOfficerRoleCode : null,
			otherOfficerRole: isPoliceOrPeaceOfficer ? policeBackgroundData.otherOfficerRole : null,
			//-----------------------------------
			hasCriminalHistory: this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory),
			hasNewCriminalRecordCharge: hasNewCriminalRecordCharge,
			criminalChargeDescription, // populated only for Update and new charges is Yes
			//-----------------------------------
			mailingAddress: mailingAddress.isAddressTheSame ? residentialAddress : mailingAddress,
			residentialAddress: residentialAddress,
		};

		console.debug('[getProfileSaveBody] licenceModelFormValue', licenceModelFormValue);
		console.debug('[getProfileSaveBody] requestbody', requestbody);

		return requestbody;
	}

	getDocsToSaveBlobs(licenceModelFormValue: any, includeProfileDocs = true): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const applicationTypeData = { ...licenceModelFormValue.applicationTypeData };
		const citizenshipData = { ...licenceModelFormValue.citizenshipData };
		const fingerprintProofData = { ...licenceModelFormValue.fingerprintProofData };
		const photographOfYourselfData = { ...licenceModelFormValue.photographOfYourselfData };
		const personalInformationData = { ...licenceModelFormValue.personalInformationData };
		const policeBackgroundData = { ...licenceModelFormValue.policeBackgroundData };
		const mentalHealthConditionsData = { ...licenceModelFormValue.mentalHealthConditionsData };

		if (licenceModelFormValue.categoryArmouredCarGuardFormGroup.isInclude) {
			const docs: Array<Blob> = [];
			licenceModelFormValue.categoryArmouredCarGuardFormGroup.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
				documents: docs,
			});
		}

		if (licenceModelFormValue.categoryFireInvestigatorFormGroup.isInclude) {
			if (licenceModelFormValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments.forEach(
					(doc: SpdFile) => {
						docs.push(doc);
					}
				);
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
					documents: docs,
				});
			}

			if (licenceModelFormValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments.forEach(
					(doc: SpdFile) => {
						docs.push(doc);
					}
				);
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categoryLocksmithFormGroup.isInclude) {
			if (licenceModelFormValue.categoryLocksmithFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryLocksmithFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categoryLocksmithFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			if (licenceModelFormValue.categoryPrivateInvestigatorFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryPrivateInvestigatorFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categoryPrivateInvestigatorFormGroup.requirementCode,
					documents: docs,
				});
			}
			if (licenceModelFormValue.categoryPrivateInvestigatorFormGroup.trainingAttachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryPrivateInvestigatorFormGroup.trainingAttachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categoryPrivateInvestigatorFormGroup.trainingCode,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			if (licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categorySecurityGuardFormGroup.isInclude) {
			if (licenceModelFormValue.categorySecurityGuardFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categorySecurityGuardFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categorySecurityGuardFormGroup.requirementCode,
					documents: docs,
				});
			}

			if (this.utilService.booleanTypeToBoolean(licenceModelFormValue.dogsAuthorizationData.useDogs)) {
				if (licenceModelFormValue.dogsAuthorizationData.attachments) {
					const docs: Array<Blob> = [];
					licenceModelFormValue.dogsAuthorizationData.attachments.forEach((doc: SpdFile) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate,
						documents: docs,
					});
				}
			}

			if (
				this.utilService.booleanTypeToBoolean(licenceModelFormValue.restraintsAuthorizationData.carryAndUseRestraints)
			) {
				if (licenceModelFormValue.restraintsAuthorizationData.attachments) {
					const docs: Array<Blob> = [];
					licenceModelFormValue.restraintsAuthorizationData.attachments.forEach((doc: SpdFile) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: licenceModelFormValue.restraintsAuthorizationData.carryAndUseRestraintsDocument,
						documents: docs,
					});
				}
			}
		}

		if (licenceModelFormValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			if (licenceModelFormValue.categorySecurityAlarmInstallerFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categorySecurityAlarmInstallerFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categorySecurityAlarmInstallerFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categorySecurityConsultantFormGroup.isInclude) {
			if (licenceModelFormValue.categorySecurityConsultantFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categorySecurityConsultantFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categorySecurityConsultantFormGroup.requirementCode,
					documents: docs,
				});
			}
			if (licenceModelFormValue.categorySecurityConsultantFormGroup.resumeAttachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categorySecurityConsultantFormGroup.resumeAttachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityConsultantResume,
					documents: docs,
				});
			}
		}

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

		if (fingerprintProofData.attachments) {
			const docs: Array<Blob> = [];
			fingerprintProofData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint, documents: docs });
		}

		if (includeProfileDocs) {
			if (policeBackgroundData.attachments) {
				const docs: Array<Blob> = [];
				policeBackgroundData.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
					documents: docs,
				});
			}

			if (mentalHealthConditionsData.attachments) {
				const docs: Array<Blob> = [];
				mentalHealthConditionsData.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition, documents: docs });
			}
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

		const isIncludeAdditionalGovermentIdStepData = this.utilService.getSwlShowAdditionalGovIdData(
			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.notCanadianCitizenProofTypeCode
		);

		if (isIncludeAdditionalGovermentIdStepData && citizenshipData.governmentIssuedAttachments) {
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

		console.debug('[getDocsToSaveBlobs] documentsToSave', documents);
		return documents;
	}

	getProfileDocsToSaveBlobs(licenceModelFormValue: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const policeBackgroundData = { ...licenceModelFormValue.policeBackgroundData };
		const mentalHealthConditionsData = { ...licenceModelFormValue.mentalHealthConditionsData };

		if (policeBackgroundData.isPoliceOrPeaceOfficer === BooleanTypeCode.Yes && policeBackgroundData.attachments) {
			const docs: Array<Blob> = [];
			policeBackgroundData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				documents: docs,
			});
		}

		if (mentalHealthConditionsData.isTreatedForMHC === BooleanTypeCode.Yes && mentalHealthConditionsData.attachments) {
			const docs: Array<Blob> = [];
			mentalHealthConditionsData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition, documents: docs });
		}

		console.debug('[getProfileDocsToSaveBlobs] documentsToSave', documents);
		return documents;
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
			updatedList = updatedList.filter(
				(cat) => !invalidCategories[item as WorkerCategoryTypeCode]?.includes(cat.code as WorkerCategoryTypeCode)
			);
		});

		return [...updatedList];
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */

	getSaveBodyBaseAuthenticated(licenceModelFormValue: any): any {
		const baseData = this.getSaveBodyBase(licenceModelFormValue, true);
		console.debug('[getSaveBodyBaseAuthenticated] baseData', baseData);

		return baseData;
	}

	getSaveBodyBaseAnonymous(licenceModelFormValue: any): any {
		const baseData = this.getSaveBodyBase(licenceModelFormValue, false);
		console.debug('[getSaveBodyBaseAnonymous] baseData', baseData);

		return baseData;
	}

	private getSaveBodyBase(licenceModelFormValue: any, isAuthenticated: boolean): any {
		const licenceAppId = licenceModelFormValue.licenceAppId;
		const originalLicenceData = { ...licenceModelFormValue.originalLicenceData };
		const workerLicenceTypeData = { ...licenceModelFormValue.workerLicenceTypeData };
		const applicationTypeData = { ...licenceModelFormValue.applicationTypeData };
		const soleProprietorData = { ...licenceModelFormValue.soleProprietorData };
		const bcDriversLicenceData = { ...licenceModelFormValue.bcDriversLicenceData };
		const contactInformationData = { ...licenceModelFormValue.contactInformationData };
		const expiredLicenceData = { ...licenceModelFormValue.expiredLicenceData };
		const characteristicsData = { ...licenceModelFormValue.characteristicsData };
		const residentialAddress = { ...licenceModelFormValue.residentialAddress };
		const mailingAddress = { ...licenceModelFormValue.mailingAddress };
		const citizenshipData = { ...licenceModelFormValue.citizenshipData };
		const policeBackgroundData = { ...licenceModelFormValue.policeBackgroundData };
		const fingerprintProofData = { ...licenceModelFormValue.fingerprintProofData };
		const mentalHealthConditionsData = { ...licenceModelFormValue.mentalHealthConditionsData };
		const photographOfYourselfData = { ...licenceModelFormValue.photographOfYourselfData };
		const personalInformationData = { ...licenceModelFormValue.personalInformationData };

		const categoryCodes: Array<WorkerCategoryTypeCode> = [];
		const documentInfos: Array<Document> = [];

		// default the flag
		mailingAddress.isAddressTheSame = !!mailingAddress.isAddressTheSame; // default to boolean
		personalInformationData.hasLegalNameChanged = !!personalInformationData.hasLegalNameChanged;

		let dogsAuthorizationData = {};
		let restraintsAuthorizationData = {};

		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		if (licenceModelFormValue.categoryArmouredCarGuardFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.ArmouredCarGuard);
			documentInfos.push(...this.getCategoryArmouredCarGuard(licenceModelFormValue.categoryArmouredCarGuardFormGroup));
		}

		if (licenceModelFormValue.categoryBodyArmourSalesFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.BodyArmourSales);
		}

		if (licenceModelFormValue.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
		}

		if (licenceModelFormValue.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
		}

		if (licenceModelFormValue.categoryFireInvestigatorFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.FireInvestigator);
			documentInfos.push(...this.getCategoryFireInvestigator(licenceModelFormValue.categoryFireInvestigatorFormGroup));
		}

		if (licenceModelFormValue.categoryLocksmithFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.Locksmith);
			documentInfos.push(...this.getCategoryLocksmith(licenceModelFormValue.categoryLocksmithFormGroup));
		}

		if (licenceModelFormValue.categoryLocksmithSupFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.LocksmithUnderSupervision);
		}

		if (licenceModelFormValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.PrivateInvestigator);
			documentInfos.push(
				...this.getCategoryPrivateInvestigator(licenceModelFormValue.categoryPrivateInvestigatorFormGroup)
			);
		}

		if (licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision);
			documentInfos.push(
				...this.getCategoryPrivateInvestigatorSup(licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup)
			);
		}

		if (licenceModelFormValue.categorySecurityGuardFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityGuard);

			const dogsPurposeFormGroup = licenceModelFormValue.dogsAuthorizationData.dogsPurposeFormGroup;
			const isDetectionDrugs = dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false;
			const isDetectionExplosives = dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ?? false;
			const isProtection = dogsPurposeFormGroup.isDogsPurposeProtection ?? false;
			const useDogs = this.utilService.booleanTypeToBoolean(licenceModelFormValue.dogsAuthorizationData.useDogs);

			dogsAuthorizationData = {
				useDogs,
				isDogsPurposeDetectionDrugs: useDogs ? isDetectionDrugs : null,
				isDogsPurposeDetectionExplosives: useDogs ? isDetectionExplosives : null,
				isDogsPurposeProtection: useDogs ? isProtection : null,
			};

			restraintsAuthorizationData = {
				carryAndUseRestraints: this.utilService.booleanTypeToBoolean(
					licenceModelFormValue.restraintsAuthorizationData.carryAndUseRestraints
				),
			};

			documentInfos.push(
				...this.getCategorySecurityGuard(
					licenceModelFormValue.categorySecurityGuardFormGroup,
					licenceModelFormValue.dogsAuthorizationData,
					licenceModelFormValue.restraintsAuthorizationData
				)
			);
		}
		if (licenceModelFormValue.categorySecurityGuardSupFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityGuardUnderSupervision);
		}

		if (licenceModelFormValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmInstaller);
			documentInfos.push(
				...this.getCategorySecurityAlarmInstaller(licenceModelFormValue.categorySecurityAlarmInstallerFormGroup)
			);
		}

		if (licenceModelFormValue.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision);
		}

		if (licenceModelFormValue.categorySecurityAlarmMonitorFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmMonitor);
		}

		if (licenceModelFormValue.categorySecurityAlarmResponseFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmResponse);
		}

		if (licenceModelFormValue.categorySecurityAlarmSalesFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmSales);
		}

		if (licenceModelFormValue.categorySecurityConsultantFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityConsultant);
			documentInfos.push(
				...this.getCategorySecurityConsultantInstaller(licenceModelFormValue.categorySecurityConsultantFormGroup)
			);
		}

		if (personalInformationData.hasLegalNameChanged) {
			personalInformationData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.LegalNameChange,
				});
			});
		}
		delete personalInformationData.attachments; // cleanup so that it is not included in the payload

		fingerprintProofData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
			});
		});

		if (!isAuthenticated) {
			policeBackgroundData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				});
			});

			mentalHealthConditionsData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition,
				});
			});
		}

		citizenshipData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				expiryDate: citizenshipData.expiryDate
					? this.formatDatePipe.transform(citizenshipData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
					: null,
				licenceDocumentTypeCode:
					citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
						? citizenshipData.canadianCitizenProofTypeCode
						: citizenshipData.notCanadianCitizenProofTypeCode,
			});
		});

		const isIncludeAdditionalGovermentIdStepData = this.utilService.getSwlShowAdditionalGovIdData(
			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.notCanadianCitizenProofTypeCode
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

		if (characteristicsData.heightUnitCode == HeightUnitCode.Inches) {
			const ft: number = +characteristicsData.height;
			const inch: number = +characteristicsData.heightInches;
			characteristicsData.height = String(ft * 12 + inch);
		}

		const criminalHistoryData = licenceModelFormValue.criminalHistoryData;
		const criminalChargeDescription =
			applicationTypeData.applicationTypeCode === ApplicationTypeCode.Update &&
			criminalHistoryData.hasCriminalHistory === BooleanTypeCode.Yes
				? criminalHistoryData.criminalChargeDescription
				: '';

		const hasExpiredLicence = expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes;
		const expiredLicenceId = hasExpiredLicence ? expiredLicenceData.expiredLicenceId : null;
		if (!hasExpiredLicence) {
			this.clearExpiredLicenceModelData();
		}

		const body = {
			licenceAppId,
			latestApplicationId: licenceModelFormValue.latestApplicationId,
			originalApplicationId: originalLicenceData.originalApplicationId,
			originalLicenceId: originalLicenceData.originalLicenceId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			//-----------------------------------
			bizTypeCode:
				soleProprietorData.isSoleProprietor === BooleanTypeCode.No ? BizTypeCode.None : soleProprietorData.bizTypeCode,
			//-----------------------------------
			hasPreviousName: this.utilService.booleanTypeToBoolean(licenceModelFormValue.aliasesData.previousNameFlag),
			aliases:
				licenceModelFormValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes
					? licenceModelFormValue.aliasesData.aliases
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
			hasExpiredLicence,
			expiredLicenceId,
			//-----------------------------------
			...characteristicsData,
			//-----------------------------------
			...personalInformationData,
			//-----------------------------------
			hasCriminalHistory: this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory),
			hasNewCriminalRecordCharge: this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory), // used by the backend for an Update or Renewal
			criminalChargeDescription, // populated only for Update and new charges is Yes
			//-----------------------------------
			licenceTermCode: licenceModelFormValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			isMailingTheSameAsResidential: mailingAddress.isAddressTheSame,
			mailingAddress: mailingAddress.isAddressTheSame ? residentialAddress : mailingAddress,
			residentialAddress,
			//-----------------------------------
			isCanadianCitizen: this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen),
			//-----------------------------------
			isTreatedForMHC: this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC),
			hasNewMentalHealthCondition: this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC), // used by the backend for an Update or Renewal
			//-----------------------------------
			isPoliceOrPeaceOfficer: this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer),
			policeOfficerRoleCode: policeBackgroundData.policeOfficerRoleCode,
			otherOfficerRole: policeBackgroundData.otherOfficerRole,
			//-----------------------------------
			categoryCodes: [...categoryCodes],
			documentExpiredInfos: [...documentExpiredInfos],
			documentInfos: [...documentInfos],
			...dogsAuthorizationData,
			...restraintsAuthorizationData,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	/**
	 * Get the category data formatted for saving
	 * @param armouredCarGuardData
	 * @returns WorkerLicenceAppCategoryData
	 */
	private getCategoryArmouredCarGuard(armouredCarGuardData: any): Array<Document> {
		const documents: Array<Document> = [];

		const expiryDate = armouredCarGuardData.expiryDate
			? this.formatDatePipe.transform(armouredCarGuardData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
			: null;

		armouredCarGuardData.attachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				expiryDate,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
			});
		});

		return documents;
	}

	/**
	 * Get the category data formatted for saving
	 * @param fireInvestigatorData
	 * @returns WorkerLicenceAppCategoryData
	 */
	private getCategoryFireInvestigator(fireInvestigatorData: any): Array<Document> {
		const documents: Array<Document> = [];

		fireInvestigatorData.fireCourseCertificateAttachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
			});
		});

		fireInvestigatorData.fireVerificationLetterAttachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
			});
		});

		return documents;
	}

	/**
	 * Get the category data formatted for saving
	 * @param locksmithData
	 * @returns WorkerLicenceAppCategoryData
	 */
	private getCategoryLocksmith(locksmithData: any): Array<Document> {
		const documents: Array<Document> = [];

		locksmithData.attachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: locksmithData.requirementCode,
			});
		});

		return documents;
	}

	/**
	 * Get the category data formatted for saving
	 * @param privateInvestigatorData
	 * @returns WorkerLicenceAppCategoryData
	 */
	private getCategoryPrivateInvestigator(privateInvestigatorData: any): Array<Document> {
		const documents: Array<Document> = [];

		privateInvestigatorData.attachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: privateInvestigatorData.requirementCode,
			});
		});

		privateInvestigatorData.trainingAttachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: privateInvestigatorData.trainingCode,
			});
		});

		return documents;
	}

	/**
	 * Get the category data formatted for saving
	 * @param privateInvestigatorSupData
	 * @returns WorkerLicenceAppCategoryData
	 */
	private getCategoryPrivateInvestigatorSup(privateInvestigatorSupData: any): Array<Document> {
		const documents: Array<Document> = [];

		privateInvestigatorSupData.attachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: privateInvestigatorSupData.requirementCode,
			});
		});

		return documents;
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityGuardData
	 * @returns WorkerLicenceAppCategoryData
	 */
	private getCategorySecurityGuard(
		categorySecurityGuardData: any,
		dogsAuthorizationData: any,
		restraintsAuthorizationData: any
	): Array<Document> {
		const documents: Array<Document> = [];

		categorySecurityGuardData.attachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: categorySecurityGuardData.requirementCode,
			});
		});

		if (this.utilService.booleanTypeToBoolean(dogsAuthorizationData.useDogs)) {
			dogsAuthorizationData.attachments?.forEach((doc: any) => {
				documents.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate,
				});
			});
		}

		if (this.utilService.booleanTypeToBoolean(restraintsAuthorizationData.carryAndUseRestraints)) {
			restraintsAuthorizationData.attachments?.forEach((doc: any) => {
				documents.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: restraintsAuthorizationData.carryAndUseRestraintsDocument,
				});
			});
		}

		return documents;
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityAlarmInstallerData
	 * @returns WorkerLicenceAppCategoryData
	 */
	private getCategorySecurityAlarmInstaller(categorySecurityAlarmInstallerData: any): Array<Document> {
		const documents: Array<Document> = [];

		categorySecurityAlarmInstallerData.attachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: categorySecurityAlarmInstallerData.requirementCode,
			});
		});

		return documents;
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityConsultantData
	 * @returns WorkerLicenceAppCategoryData
	 */
	private getCategorySecurityConsultantInstaller(categorySecurityConsultantData: any): Array<Document> {
		const documents: Array<Document> = [];

		categorySecurityConsultantData.attachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: categorySecurityConsultantData.requirementCode,
			});
		});

		categorySecurityConsultantData.resumeAttachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityConsultantResume,
			});
		});

		return documents;
	}
}
