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
	WorkerLicenceTypeCode,
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
		const residentialAddressData = { ...licenceModelFormValue.residentialAddressData };
		const mailingAddressData = { ...licenceModelFormValue.mailingAddressData };
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
			mailingAddress: mailingAddressData.isAddressTheSame ? residentialAddressData : mailingAddressData,
			residentialAddress: residentialAddressData,
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
			const isTreatedForMHC = this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC);
			const isPoliceOrPeaceOfficer = this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer);

			if (isPoliceOrPeaceOfficer && policeBackgroundData.attachments) {
				const docs: Array<Blob> = [];
				policeBackgroundData.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
					documents: docs,
				});
			}

			if (isTreatedForMHC && mentalHealthConditionsData.attachments) {
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

		const isPoliceOrPeaceOfficer = this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer);
		const isTreatedForMHC = this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC);

		if (isPoliceOrPeaceOfficer && policeBackgroundData.attachments) {
			const docs: Array<Blob> = [];
			policeBackgroundData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				documents: docs,
			});
		}

		if (isTreatedForMHC && mentalHealthConditionsData.attachments) {
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
		const residentialAddressData = { ...licenceModelFormValue.residentialAddressData };
		const mailingAddressData = { ...licenceModelFormValue.mailingAddressData };
		const citizenshipData = { ...licenceModelFormValue.citizenshipData };
		const policeBackgroundData = { ...licenceModelFormValue.policeBackgroundData };
		const fingerprintProofData = { ...licenceModelFormValue.fingerprintProofData };
		const mentalHealthConditionsData = { ...licenceModelFormValue.mentalHealthConditionsData };
		const photographOfYourselfData = { ...licenceModelFormValue.photographOfYourselfData };
		const personalInformationData = { ...licenceModelFormValue.personalInformationData };

		const categoryCodes: Array<WorkerCategoryTypeCode> = [];
		const documentInfos: Array<Document> = [];

		// default the flag
		mailingAddressData.isAddressTheSame = !!mailingAddressData.isAddressTheSame; // default to boolean
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
			isMailingTheSameAsResidential: mailingAddressData.isAddressTheSame,
			mailingAddress: mailingAddressData.isAddressTheSame ? residentialAddressData : mailingAddressData,
			residentialAddress: residentialAddressData,
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

	getSummaryshowPhotographOfYourself(workerLicenceModelData: any): boolean {
		return (
			this.getSummaryhasGenderChanged(workerLicenceModelData) &&
			this.getSummaryphotoOfYourselfAttachments(workerLicenceModelData).length > 0
		);
	}

	getSummaryhasBcscNameChanged(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.personalInformationData.hasBcscNameChanged ?? '';
	}
	getSummaryhasGenderChanged(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.personalInformationData.hasGenderChanged ?? '';
	}
	getSummaryoriginalLicenceNumber(workerLicenceModelData: any): string {
		return workerLicenceModelData.originalLicenceData.originalLicenceNumber ?? '';
	}
	getSummaryoriginalExpiryDate(workerLicenceModelData: any): string {
		return workerLicenceModelData.originalLicenceData.originalExpiryDate ?? '';
	}
	getSummaryoriginalLicenceTermCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.originalLicenceData.originalLicenceTermCode ?? '';
	}
	getSummarycardHolderName(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.cardHolderName ?? '';
	}
	getSummarycaseNumber(workerLicenceModelData: any): string {
		return workerLicenceModelData.caseNumber ?? '';
	}

	getSummaryisReprint(workerLicenceModelData: any): string {
		return workerLicenceModelData.reprintLicenceData.reprintLicence ?? '';
	}

	getSummaryworkerLicenceTypeCode(workerLicenceModelData: any): WorkerLicenceTypeCode | null {
		return workerLicenceModelData.workerLicenceTypeData?.workerLicenceTypeCode ?? null;
	}

	getSummaryapplicationTypeCode(workerLicenceModelData: any): ApplicationTypeCode | null {
		return workerLicenceModelData.applicationTypeData?.applicationTypeCode ?? null;
	}

	getSummaryisSoleProprietor(workerLicenceModelData: any): string {
		return workerLicenceModelData.soleProprietorData?.isSoleProprietor ?? '';
	}

	getSummarysoleProprietorBizTypeCode(workerLicenceModelData: any): string {
		const isSoleProprietor = workerLicenceModelData.soleProprietorData.isSoleProprietor === BooleanTypeCode.Yes;
		return isSoleProprietor ? workerLicenceModelData.soleProprietorData?.bizTypeCode : '';
	}

	getSummarycategoryArmouredCarGuardAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryArmouredCarGuardFormGroup.attachments ?? [];
	}
	getSummarycategoryFireInvestigatorCertificateAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments ?? [];
	}
	getSummarycategoryFireInvestigatorLetterAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments ?? [];
	}
	getSummarycategoryLocksmithAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryLocksmithFormGroup.attachments ?? [];
	}
	getSummarycategorySecurityGuardAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categorySecurityGuardFormGroup.attachments ?? [];
	}
	getSummarycategorySecurityConsultantAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categorySecurityConsultantFormGroup.attachments ?? [];
	}
	getSummarycategorySecurityConsultantResumeAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categorySecurityConsultantFormGroup.resumeAttachments ?? [];
	}
	getSummarycategorySecurityAlarmInstallerAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categorySecurityAlarmInstallerFormGroup.attachments ?? [];
	}
	getSummarycategoryPrivateInvestigatorAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryPrivateInvestigatorFormGroup.attachments ?? [];
	}
	getSummarycategoryPrivateInvestigatorTrainingAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryPrivateInvestigatorFormGroup.trainingAttachments ?? [];
	}
	getSummarycategoryPrivateInvestigatorFireCertificateAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryPrivateInvestigatorFormGroup.fireCourseCertificateAttachments;
	}
	getSummarycategoryPrivateInvestigatorFireLetterAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryPrivateInvestigatorFormGroup.fireVerificationLetterAttachments;
	}
	getSummarycategoryPrivateInvestigatorUnderSupervisionAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.categoryPrivateInvestigatorSupFormGroup.attachments ?? [];
	}

	getSummarylicenceTermCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.licenceTermData.licenceTermCode ?? '';
	}

	getSummaryhasExpiredLicence(workerLicenceModelData: any): string {
		return workerLicenceModelData.expiredLicenceData.hasExpiredLicence ?? '';
	}
	getSummaryexpiredLicenceNumber(workerLicenceModelData: any): string {
		return workerLicenceModelData.expiredLicenceData.expiredLicenceNumber ?? '';
	}
	getSummaryexpiredLicenceExpiryDate(workerLicenceModelData: any): string {
		return workerLicenceModelData.expiredLicenceData.expiredLicenceExpiryDate ?? '';
	}

	getSummarycarryAndUseRestraints(workerLicenceModelData: any): string {
		return workerLicenceModelData.restraintsAuthorizationData.carryAndUseRestraints ?? '';
	}
	getSummarycarryAndUseRestraintsDocument(workerLicenceModelData: any): string {
		return workerLicenceModelData.restraintsAuthorizationData.carryAndUseRestraintsDocument ?? '';
	}
	getSummarycarryAndUseRestraintsAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.restraintsAuthorizationData.attachments ?? [];
	}
	getSummaryshowDogsAndRestraints(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categorySecurityGuardFormGroup.isInclude;
	}
	getSummaryuseDogs(workerLicenceModelData: any): string {
		return workerLicenceModelData.dogsAuthorizationData.useDogs ?? '';
	}
	getSummaryisDogsPurposeProtection(workerLicenceModelData: any): string {
		return workerLicenceModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeProtection ?? false;
	}
	getSummaryisDogsPurposeDetectionDrugs(workerLicenceModelData: any): string {
		return workerLicenceModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false;
	}
	getSummaryisDogsPurposeDetectionExplosives(workerLicenceModelData: any): string {
		return workerLicenceModelData.dogsAuthorizationData.dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ?? false;
	}
	getSummarydogsPurposeAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.dogsAuthorizationData.attachments ?? [];
	}

	getSummaryisPoliceOrPeaceOfficer(workerLicenceModelData: any): string {
		return workerLicenceModelData.policeBackgroundData.isPoliceOrPeaceOfficer ?? '';
	}
	getSummarypoliceOfficerRoleCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.policeBackgroundData.policeOfficerRoleCode ?? '';
	}
	getSummaryotherOfficerRole(workerLicenceModelData: any): string {
		return workerLicenceModelData.policeBackgroundData.otherOfficerRole ?? '';
	}
	getSummaryletterOfNoConflictAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.policeBackgroundData.attachments ?? [];
	}

	getSummarygivenName(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.givenName ?? '';
	}
	getSummarymiddleName1(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.middleName1 ?? '';
	}
	getSummarymiddleName2(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.middleName2 ?? '';
	}
	getSummarysurname(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.surname ?? '';
	}
	getSummarygenderCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.genderCode ?? '';
	}
	getSummarydateOfBirth(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.dateOfBirth ?? '';
	}

	getSummarypreviousNameFlag(workerLicenceModelData: any): string {
		return workerLicenceModelData.aliasesData.previousNameFlag ?? '';
	}
	getSummaryaliases(workerLicenceModelData: any): Array<any> {
		return workerLicenceModelData.aliasesData.aliases ?? [];
	}

	getSummaryisTreatedForMHC(workerLicenceModelData: any): string {
		return workerLicenceModelData.mentalHealthConditionsData.isTreatedForMHC ?? '';
	}
	getSummarymentalHealthConditionAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.mentalHealthConditionsData.attachments ?? [];
	}

	getSummarycriminalHistoryLabel(workerLicenceModelData: any): string {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(workerLicenceModelData);
		if (applicationTypeCode === ApplicationTypeCode.Update || applicationTypeCode === ApplicationTypeCode.Renewal) {
			return 'New Criminal Charges or Convictions';
		} else {
			return 'Previously been Charged or Convicted of a Crime';
		}
	}
	getSummaryhasCriminalHistory(workerLicenceModelData: any): string {
		return workerLicenceModelData.criminalHistoryData.hasCriminalHistory ?? '';
	}
	getSummarycriminalChargeDescription(workerLicenceModelData: any): string {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(workerLicenceModelData);
		const hasCriminalHistory = this.getSummaryhasCriminalHistory(workerLicenceModelData);

		return applicationTypeCode === ApplicationTypeCode.Update && hasCriminalHistory === BooleanTypeCode.Yes
			? workerLicenceModelData.criminalHistoryData.criminalChargeDescription
			: '';
	}

	getSummaryproofOfFingerprintAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.fingerprintProofData.attachments ?? [];
	}

	getSummaryisCanadianCitizen(workerLicenceModelData: any): string {
		return workerLicenceModelData.citizenshipData.isCanadianCitizen ?? '';
	}
	getSummarycanadianCitizenProofTypeCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.Yes
			? workerLicenceModelData.citizenshipData.canadianCitizenProofTypeCode ?? ''
			: '';
	}
	getSummarynotCanadianCitizenProofTypeCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No
			? workerLicenceModelData.citizenshipData.notCanadianCitizenProofTypeCode ?? ''
			: '';
	}
	getSummaryproofOfAbility(workerLicenceModelData: any): string {
		return workerLicenceModelData.citizenshipData.proofOfAbility ?? '';
	}
	getSummarycitizenshipExpiryDate(workerLicenceModelData: any): string {
		return workerLicenceModelData.citizenshipData.expiryDate ?? '';
	}
	getSummarycitizenshipAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.citizenshipData.attachments ?? [];
	}
	getSummarygovernmentIssuedPhotoTypeCode(workerLicenceModelData: any): string {
		const showAdditionalGovIdData = this.getSummaryshowAdditionalGovIdData(workerLicenceModelData);
		return showAdditionalGovIdData ? workerLicenceModelData.citizenshipData.governmentIssuedPhotoTypeCode : '';
	}
	getSummarygovernmentIssuedPhotoExpiryDate(workerLicenceModelData: any): string {
		const showAdditionalGovIdData = this.getSummaryshowAdditionalGovIdData(workerLicenceModelData);
		return showAdditionalGovIdData ? workerLicenceModelData.citizenshipData.governmentIssuedExpiryDate : '';
	}
	getSummarygovernmentIssuedPhotoAttachments(workerLicenceModelData: any): File[] {
		const showAdditionalGovIdData = this.getSummaryshowAdditionalGovIdData(workerLicenceModelData);
		return showAdditionalGovIdData ? workerLicenceModelData.citizenshipData.governmentIssuedAttachments : [];
	}

	getSummaryshowAdditionalGovIdData(workerLicenceModelData: any): boolean {
		return this.utilService.getSwlShowAdditionalGovIdData(
			workerLicenceModelData.citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			workerLicenceModelData.citizenshipData.canadianCitizenProofTypeCode,
			workerLicenceModelData.citizenshipData.notCanadianCitizenProofTypeCode
		);
	}

	getSummarybcDriversLicenceNumber(workerLicenceModelData: any): string {
		return workerLicenceModelData.bcDriversLicenceData.hasBcDriversLicence === BooleanTypeCode.Yes
			? workerLicenceModelData.bcDriversLicenceData.bcDriversLicenceNumber ?? ''
			: '';
	}

	getSummaryhairColourCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.characteristicsData.hairColourCode ?? '';
	}
	getSummaryeyeColourCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.characteristicsData.eyeColourCode ?? '';
	}
	getSummaryheight(workerLicenceModelData: any): string {
		return workerLicenceModelData.characteristicsData.height ?? '';
	}
	getSummaryheightInches(workerLicenceModelData: any): string {
		return workerLicenceModelData.characteristicsData.heightInches ?? '';
	}
	getSummaryheightUnitCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.characteristicsData.heightUnitCode ?? '';
	}
	getSummaryweight(workerLicenceModelData: any): string {
		return workerLicenceModelData.characteristicsData.weight ?? '';
	}
	getSummaryweightUnitCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.characteristicsData.weightUnitCode ?? '';
	}

	getSummaryphotoOfYourselfAttachments(workerLicenceModelData: any): File[] {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(workerLicenceModelData);
		if (applicationTypeCode === ApplicationTypeCode.New) {
			return workerLicenceModelData.photographOfYourselfData.attachments ?? [];
		} else {
			const updatePhoto = workerLicenceModelData.photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
			const updateAttachments = workerLicenceModelData.photographOfYourselfData.updateAttachments ?? [];
			return updatePhoto ? updateAttachments : null;
		}
	}

	getSummaryemailAddress(workerLicenceModelData: any): string {
		return workerLicenceModelData.contactInformationData?.emailAddress ?? '';
	}
	getSummaryphoneNumber(workerLicenceModelData: any): string {
		return workerLicenceModelData.contactInformationData?.phoneNumber ?? '';
	}

	getSummaryresidentialAddressLine1(workerLicenceModelData: any): string {
		return workerLicenceModelData.residentialAddressData?.addressLine1 ?? '';
	}
	getSummaryresidentialAddressLine2(workerLicenceModelData: any): string {
		return workerLicenceModelData.residentialAddressData?.addressLine2 ?? '';
	}
	getSummaryresidentialCity(workerLicenceModelData: any): string {
		return workerLicenceModelData.residentialAddressData?.city ?? '';
	}
	getSummaryresidentialPostalCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.residentialAddressData?.postalCode ?? '';
	}
	getSummaryresidentialProvince(workerLicenceModelData: any): string {
		return workerLicenceModelData.residentialAddressData?.province ?? '';
	}
	getSummaryresidentialCountry(workerLicenceModelData: any): string {
		return workerLicenceModelData.residentialAddressData?.country ?? '';
	}
	getSummaryisAddressTheSame(workerLicenceModelData: any): string {
		return workerLicenceModelData.mailingAddressData?.isAddressTheSame ?? '';
	}

	getSummarymailingAddressLine1(workerLicenceModelData: any): string {
		return workerLicenceModelData.mailingAddressData?.addressLine1 ?? '';
	}
	getSummarymailingAddressLine2(workerLicenceModelData: any): string {
		return workerLicenceModelData.mailingAddressData?.addressLine2 ?? '';
	}
	getSummarymailingCity(workerLicenceModelData: any): string {
		return workerLicenceModelData.mailingAddressData?.city ?? '';
	}
	getSummarymailingPostalCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.mailingAddressData?.postalCode ?? '';
	}
	getSummarymailingProvince(workerLicenceModelData: any): string {
		return workerLicenceModelData.mailingAddressData?.province ?? '';
	}
	getSummarymailingCountry(workerLicenceModelData: any): string {
		return workerLicenceModelData.mailingAddressData?.country ?? '';
	}

	getSummarycategoryList(workerLicenceModelData: any): Array<WorkerCategoryTypeCode> {
		const list: Array<WorkerCategoryTypeCode> = [];
		if (workerLicenceModelData.categoryArmouredCarGuardFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.ArmouredCarGuard);
		}
		if (workerLicenceModelData.categoryBodyArmourSalesFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.BodyArmourSales);
		}
		if (workerLicenceModelData.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
		}
		if (workerLicenceModelData.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
		}
		if (workerLicenceModelData.categoryFireInvestigatorFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.FireInvestigator);
		}
		if (workerLicenceModelData.categoryLocksmithFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.Locksmith);
		}
		if (workerLicenceModelData.categoryLocksmithSupFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.LocksmithUnderSupervision);
		}
		if (workerLicenceModelData.categoryPrivateInvestigatorFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.PrivateInvestigator);
		}
		if (workerLicenceModelData.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision);
		}
		if (workerLicenceModelData.categorySecurityAlarmInstallerFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmInstaller);
		}
		if (workerLicenceModelData.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision);
		}
		if (workerLicenceModelData.categorySecurityAlarmMonitorFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmMonitor);
		}
		if (workerLicenceModelData.categorySecurityAlarmResponseFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmResponse);
		}
		if (workerLicenceModelData.categorySecurityAlarmSalesFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityAlarmSales);
		}
		if (workerLicenceModelData.categorySecurityConsultantFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityConsultant);
		}
		if (workerLicenceModelData.categorySecurityGuardFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityGuard);
		}
		if (workerLicenceModelData.categorySecurityGuardSupFormGroup.isInclude) {
			list.push(WorkerCategoryTypeCode.SecurityGuardUnderSupervision);
		}

		return list;
	}

	getSummaryisAnyDocuments(workerLicenceModelData: any): boolean {
		return (
			this.getSummaryshowArmouredCarGuard(workerLicenceModelData) ||
			this.getSummaryshowFireInvestigator(workerLicenceModelData) ||
			this.getSummaryshowLocksmith(workerLicenceModelData) ||
			this.getSummaryshowPrivateInvestigator(workerLicenceModelData) ||
			this.getSummaryshowPrivateInvestigatorUnderSupervision(workerLicenceModelData) ||
			this.getSummaryshowSecurityAlarmInstaller(workerLicenceModelData) ||
			this.getSummaryshowSecurityConsultant(workerLicenceModelData) ||
			this.getSummaryshowSecurityGuard(workerLicenceModelData)
		);
	}

	getSummaryshowArmouredCarGuard(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categoryArmouredCarGuardFormGroup?.isInclude ?? false;
	}
	getSummaryshowFireInvestigator(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categoryFireInvestigatorFormGroup?.isInclude ?? false;
	}
	getSummaryshowLocksmith(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categoryLocksmithFormGroup?.isInclude ?? false;
	}
	getSummaryshowPrivateInvestigator(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categoryPrivateInvestigatorFormGroup?.isInclude ?? false;
	}
	getSummaryshowPrivateInvestigatorUnderSupervision(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categoryPrivateInvestigatorSupFormGroup?.isInclude ?? false;
	}
	getSummaryshowSecurityAlarmInstaller(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categorySecurityAlarmInstallerFormGroup?.isInclude ?? false;
	}
	getSummaryshowSecurityConsultant(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categorySecurityConsultantFormGroup?.isInclude ?? false;
	}
	getSummaryshowSecurityGuard(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.categorySecurityGuardFormGroup?.isInclude ?? false;
	}
}
