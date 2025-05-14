import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicantUpdateRequest,
	ApplicationTypeCode,
	BizTypeCode,
	Document,
	DocumentRelatedInfo,
	HeightUnitCode,
	LicenceDocumentTypeCode,
	LicenceTermCode,
	PoliceOfficerRoleCode,
	ServiceTypeCode,
	WorkerCategoryTypeCode,
	WorkerLicenceAppSubmitRequest,
	WorkerLicenceAppUpsertRequest,
} from '@app/api/models';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { BooleanTypeCode, SelectOptions } from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { CommonApplicationHelper } from './common-application.helper';

export abstract class WorkerApplicationHelper extends CommonApplicationHelper {
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
		protected utilService: UtilService,
		protected fileUtilService: FileUtilService
	) {
		super(formBuilder);
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	getProfileSaveBody(workerModelFormValue: any): ApplicantUpdateRequest {
		const contactInformationData = workerModelFormValue.contactInformationData;
		const residentialAddressData = workerModelFormValue.residentialAddressData;
		const mailingAddressData = workerModelFormValue.mailingAddressData;
		const personalInformationData = workerModelFormValue.personalInformationData;
		const characteristicsData = workerModelFormValue.characteristicsData;

		if (characteristicsData.heightUnitCode == HeightUnitCode.Inches) {
			const ft: number = +characteristicsData.height;
			const inch: number = +characteristicsData.heightInches;
			characteristicsData.height = String(ft * 12 + inch);
		}

		const requestbody: ApplicantUpdateRequest = {
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
				workerModelFormValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes
					? workerModelFormValue.aliasesData.aliases
					: [],
			//-----------------------------------
			mailingAddress: mailingAddressData.isAddressTheSame ? residentialAddressData : mailingAddressData,
			residentialAddress: residentialAddressData,
			...characteristicsData,
		};

		console.debug('[getProfileSaveBody] requestbody', requestbody);

		return requestbody;
	}

	getDocsToSaveBlobs(workerModelFormValue: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const applicationTypeData = workerModelFormValue.applicationTypeData;
		const citizenshipData = workerModelFormValue.citizenshipData;
		const fingerprintProofData = workerModelFormValue.fingerprintProofData;
		const photographOfYourselfData = workerModelFormValue.photographOfYourselfData;
		const personalInformationData = workerModelFormValue.personalInformationData;
		const policeBackgroundData = workerModelFormValue.policeBackgroundData;
		const mentalHealthConditionsData = workerModelFormValue.mentalHealthConditionsData;

		if (workerModelFormValue.categoryArmouredCarGuardFormGroup.isInclude) {
			const docs: Array<Blob> = [];
			workerModelFormValue.categoryArmouredCarGuardFormGroup.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
				documents: docs,
			});
		}

		if (workerModelFormValue.categoryFireInvestigatorFormGroup.isInclude) {
			if (workerModelFormValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments.forEach(
					(doc: SpdFile) => {
						docs.push(doc);
					}
				);
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
					documents: docs,
				});
			}

			if (workerModelFormValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments.forEach(
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

		if (workerModelFormValue.categoryLocksmithFormGroup.isInclude) {
			if (workerModelFormValue.categoryLocksmithFormGroup.attachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categoryLocksmithFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: workerModelFormValue.categoryLocksmithFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (workerModelFormValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			if (workerModelFormValue.categoryPrivateInvestigatorFormGroup.attachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categoryPrivateInvestigatorFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: workerModelFormValue.categoryPrivateInvestigatorFormGroup.requirementCode,
					documents: docs,
				});
			}
			if (workerModelFormValue.categoryPrivateInvestigatorFormGroup.trainingAttachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categoryPrivateInvestigatorFormGroup.trainingAttachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: workerModelFormValue.categoryPrivateInvestigatorFormGroup.trainingCode,
					documents: docs,
				});
			}
		}

		if (workerModelFormValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			if (workerModelFormValue.categoryPrivateInvestigatorSupFormGroup.attachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categoryPrivateInvestigatorSupFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: workerModelFormValue.categoryPrivateInvestigatorSupFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (workerModelFormValue.categorySecurityGuardFormGroup.isInclude) {
			if (workerModelFormValue.categorySecurityGuardFormGroup.attachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categorySecurityGuardFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: workerModelFormValue.categorySecurityGuardFormGroup.requirementCode,
					documents: docs,
				});
			}

			if (this.utilService.booleanTypeToBoolean(workerModelFormValue.dogsAuthorizationData.useDogs)) {
				if (workerModelFormValue.dogsAuthorizationData.attachments) {
					const docs: Array<Blob> = [];
					workerModelFormValue.dogsAuthorizationData.attachments.forEach((doc: SpdFile) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate,
						documents: docs,
					});
				}
			}

			if (
				this.utilService.booleanTypeToBoolean(workerModelFormValue.restraintsAuthorizationData.carryAndUseRestraints)
			) {
				if (workerModelFormValue.restraintsAuthorizationData.attachments) {
					const docs: Array<Blob> = [];
					workerModelFormValue.restraintsAuthorizationData.attachments.forEach((doc: SpdFile) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: workerModelFormValue.restraintsAuthorizationData.carryAndUseRestraintsDocument,
						documents: docs,
					});
				}
			}
		}

		if (workerModelFormValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			if (workerModelFormValue.categorySecurityAlarmInstallerFormGroup.attachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categorySecurityAlarmInstallerFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: workerModelFormValue.categorySecurityAlarmInstallerFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (workerModelFormValue.categorySecurityConsultantFormGroup.isInclude) {
			if (workerModelFormValue.categorySecurityConsultantFormGroup.attachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categorySecurityConsultantFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: workerModelFormValue.categorySecurityConsultantFormGroup.requirementCode,
					documents: docs,
				});
			}
			if (workerModelFormValue.categorySecurityConsultantFormGroup.resumeAttachments) {
				const docs: Array<Blob> = [];
				workerModelFormValue.categorySecurityConsultantFormGroup.resumeAttachments.forEach((doc: SpdFile) => {
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

	/**
	 * Get the valid list of categories based upon the current selections
	 * @param categoryList
	 * @returns
	 */
	getValidSwlCategoryList(categoryList: string[]): SelectOptions<string>[] {
		return this.getValidCategoryList(
			this.configService.configs?.invalidWorkerLicenceCategoryMatrixConfiguration,
			categoryList
		);
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */

	getSaveBodyBaseSubmitAuthenticated(permitModelFormValue: any): WorkerLicenceAppSubmitRequest {
		const baseData = this.getSaveBodyBase(permitModelFormValue, true);

		// converted data maybe missing this value.
		if (typeof baseData.hasBcDriversLicence !== 'boolean') {
			baseData.hasBcDriversLicence = false;
		}

		const returnBody: WorkerLicenceAppSubmitRequest = baseData;
		return returnBody;
	}

	getSaveBodyBaseUpsertAuthenticated(permitModelFormValue: any): WorkerLicenceAppUpsertRequest {
		const baseData = this.getSaveBodyBase(permitModelFormValue, true);

		const returnBody: WorkerLicenceAppUpsertRequest = baseData;
		return returnBody;
	}

	getSaveBodyBaseAnonymous(workerModelFormValue: any): any {
		const baseData = this.getSaveBodyBase(workerModelFormValue, false);

		// converted data maybe missing this value.
		if (typeof baseData.hasBcDriversLicence !== 'boolean') {
			baseData.hasBcDriversLicence = false;
		}

		return baseData;
	}

	private getSaveBodyBase(workerModelFormValue: any, isAuthenticated: boolean): any {
		const licenceAppId = workerModelFormValue.licenceAppId;
		const originalLicenceData = workerModelFormValue.originalLicenceData;
		const serviceTypeData = workerModelFormValue.serviceTypeData;
		const applicationTypeData = workerModelFormValue.applicationTypeData;
		const soleProprietorData = workerModelFormValue.soleProprietorData;
		const bcDriversLicenceData = workerModelFormValue.bcDriversLicenceData;
		const contactInformationData = workerModelFormValue.contactInformationData;
		const expiredLicenceData = workerModelFormValue.expiredLicenceData;
		const characteristicsData = workerModelFormValue.characteristicsData;
		const residentialAddressData = workerModelFormValue.residentialAddressData;
		const mailingAddressData = workerModelFormValue.mailingAddressData;
		const citizenshipData = workerModelFormValue.citizenshipData;
		const policeBackgroundData = workerModelFormValue.policeBackgroundData;
		const fingerprintProofData = workerModelFormValue.fingerprintProofData;
		const mentalHealthConditionsData = workerModelFormValue.mentalHealthConditionsData;
		const photographOfYourselfData = workerModelFormValue.photographOfYourselfData;
		const personalInformationData = workerModelFormValue.personalInformationData;
		const criminalHistoryData = workerModelFormValue.criminalHistoryData;

		const applicationTypeCode = applicationTypeData.applicationTypeCode;

		const categoryCodes: Array<WorkerCategoryTypeCode> = [];
		const documentInfos: Array<Document> = [];

		// default the flag
		mailingAddressData.isAddressTheSame = !!mailingAddressData.isAddressTheSame; // default to boolean
		personalInformationData.hasLegalNameChanged = !!personalInformationData.hasLegalNameChanged;

		let dogsAuthorizationData = {};
		let restraintsAuthorizationData = {};

		personalInformationData.dateOfBirth = this.utilService.dateToDbDate(personalInformationData.dateOfBirth);

		if (workerModelFormValue.categoryArmouredCarGuardFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.ArmouredCarGuard);
			documentInfos.push(...this.getCategoryArmouredCarGuard(workerModelFormValue.categoryArmouredCarGuardFormGroup));
		}

		if (workerModelFormValue.categoryBodyArmourSalesFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.BodyArmourSales);
		}

		if (workerModelFormValue.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
		}

		if (workerModelFormValue.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
		}

		if (workerModelFormValue.categoryFireInvestigatorFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.FireInvestigator);
			documentInfos.push(...this.getCategoryFireInvestigator(workerModelFormValue.categoryFireInvestigatorFormGroup));
		}

		if (workerModelFormValue.categoryLocksmithFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.Locksmith);
			documentInfos.push(...this.getCategoryLocksmith(workerModelFormValue.categoryLocksmithFormGroup));
		}

		if (workerModelFormValue.categoryLocksmithSupFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.LocksmithUnderSupervision);
		}

		if (workerModelFormValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.PrivateInvestigator);
			documentInfos.push(
				...this.getCategoryPrivateInvestigator(workerModelFormValue.categoryPrivateInvestigatorFormGroup)
			);
		}

		if (workerModelFormValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision);
			documentInfos.push(
				...this.getCategoryPrivateInvestigatorSup(workerModelFormValue.categoryPrivateInvestigatorSupFormGroup)
			);
		}

		if (workerModelFormValue.categorySecurityGuardFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityGuard);

			const dogsPurposeFormGroup = workerModelFormValue.dogsAuthorizationData.dogsPurposeFormGroup;
			const isDetectionDrugs = dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false;
			const isDetectionExplosives = dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ?? false;
			const isProtection = dogsPurposeFormGroup.isDogsPurposeProtection ?? false;
			const useDogs = this.utilService.booleanTypeToBoolean(workerModelFormValue.dogsAuthorizationData.useDogs);

			dogsAuthorizationData = {
				useDogs,
				isDogsPurposeDetectionDrugs: useDogs ? isDetectionDrugs : null,
				isDogsPurposeDetectionExplosives: useDogs ? isDetectionExplosives : null,
				isDogsPurposeProtection: useDogs ? isProtection : null,
			};

			restraintsAuthorizationData = {
				carryAndUseRestraints: this.utilService.booleanTypeToBoolean(
					workerModelFormValue.restraintsAuthorizationData.carryAndUseRestraints
				),
			};

			documentInfos.push(
				...this.getCategorySecurityGuard(
					workerModelFormValue.categorySecurityGuardFormGroup,
					workerModelFormValue.dogsAuthorizationData,
					workerModelFormValue.restraintsAuthorizationData
				)
			);
		}
		if (workerModelFormValue.categorySecurityGuardSupFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityGuardUnderSupervision);
		}

		if (workerModelFormValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmInstaller);
			documentInfos.push(
				...this.getCategorySecurityAlarmInstaller(workerModelFormValue.categorySecurityAlarmInstallerFormGroup)
			);
		}

		if (workerModelFormValue.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision);
		}

		if (workerModelFormValue.categorySecurityAlarmMonitorFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmMonitor);
		}

		if (workerModelFormValue.categorySecurityAlarmResponseFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmResponse);
		}

		if (workerModelFormValue.categorySecurityAlarmSalesFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmSales);
		}

		if (workerModelFormValue.categorySecurityConsultantFormGroup.isInclude) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityConsultant);
			documentInfos.push(
				...this.getCategorySecurityConsultantInstaller(workerModelFormValue.categorySecurityConsultantFormGroup)
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

		fingerprintProofData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
			});
		});

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

		citizenshipData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				expiryDate: this.utilService.dateToDbDate(citizenshipData.expiryDate),
				documentIdNumber: citizenshipData.documentIdNumber,
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
					expiryDate: this.utilService.dateToDbDate(citizenshipData.governmentIssuedExpiryDate),
					documentIdNumber: citizenshipData.governmentIssuedDocumentIdNumber,
					licenceDocumentTypeCode: citizenshipData.governmentIssuedPhotoTypeCode,
				});
			});
		}

		const updatePhoto = photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
		if (applicationTypeData.applicationTypeCode === ApplicationTypeCode.New || !updatePhoto) {
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

		let reprint = true; // New, Renewal, Replacement all require reprint
		if (applicationTypeCode === ApplicationTypeCode.Update) {
			reprint =
				updatePhoto || personalInformationData.hasLegalNameChanged || personalInformationData.hasBcscNameChanged;
		}

		const documentRelatedInfos: Array<DocumentRelatedInfo> =
			documentInfos
				.filter((doc) => doc.expiryDate || doc.documentIdNumber)
				.map((doc: Document) => {
					return {
						expiryDate: doc.expiryDate,
						licenceDocumentTypeCode: doc.licenceDocumentTypeCode,
						documentIdNumber: doc.documentIdNumber,
					} as DocumentRelatedInfo;
				}) ?? [];

		if (characteristicsData.heightUnitCode == HeightUnitCode.Inches) {
			const ft: number = +characteristicsData.height;
			const inch: number = +characteristicsData.heightInches;
			characteristicsData.height = String(ft * 12 + inch);
		}

		const hasCriminalHistory = this.utilService.booleanTypeToBoolean(criminalHistoryData.hasCriminalHistory);
		const criminalChargeDescription =
			applicationTypeCode === ApplicationTypeCode.Update && hasCriminalHistory
				? criminalHistoryData.criminalChargeDescription
				: null;

		const isTreatedForMHC = this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC);
		const isPoliceOrPeaceOfficer = this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer);
		let policeOfficerRoleCode = null;
		if (applicationTypeCode != ApplicationTypeCode.Replacement) {
			policeOfficerRoleCode = isPoliceOrPeaceOfficer
				? policeBackgroundData.policeOfficerRoleCode
				: PoliceOfficerRoleCode.None;
		}
		const otherOfficerRole =
			isPoliceOrPeaceOfficer && policeOfficerRoleCode === PoliceOfficerRoleCode.Other
				? policeBackgroundData.otherOfficerRole
				: null;

		const hasExpiredLicence = expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes;
		const expiredLicenceId = hasExpiredLicence ? expiredLicenceData.expiredLicenceId : null;
		if (!hasExpiredLicence) {
			this.clearExpiredLicenceModelData();
		}

		const hasBcDriversLicence = this.utilService.booleanTypeToBoolean(bcDriversLicenceData.hasBcDriversLicence);
		const hasPreviousName = this.utilService.booleanTypeToBoolean(workerModelFormValue.aliasesData.previousNameFlag);

		const body = {
			licenceAppId,
			latestApplicationId: workerModelFormValue.latestApplicationId,
			originalApplicationId: originalLicenceData.originalApplicationId,
			originalLicenceId: originalLicenceData.originalLicenceId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			serviceTypeCode: serviceTypeData.serviceTypeCode,
			//-----------------------------------
			bizTypeCode:
				soleProprietorData.isSoleProprietor === BooleanTypeCode.No ? BizTypeCode.None : soleProprietorData.bizTypeCode,
			//-----------------------------------
			hasPreviousName,
			aliases: hasPreviousName ? workerModelFormValue.aliasesData.aliases : [],
			//-----------------------------------
			hasBcDriversLicence,
			bcDriversLicenceNumber: hasBcDriversLicence ? bcDriversLicenceData.bcDriversLicenceNumber : null,
			//-----------------------------------
			emailAddress: contactInformationData.emailAddress,
			phoneNumber: contactInformationData.phoneNumber,
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
			genderCode: personalInformationData.genderCode,
			//-----------------------------------
			hasCriminalHistory,
			criminalChargeDescription, // populated only for Update and new charges is Yes
			//-----------------------------------
			licenceTermCode: workerModelFormValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			isMailingTheSameAsResidential: mailingAddressData.isAddressTheSame,
			mailingAddress: mailingAddressData.isAddressTheSame ? residentialAddressData : mailingAddressData,
			residentialAddress: residentialAddressData,
			//-----------------------------------
			isCanadianCitizen: this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen),
			//-----------------------------------
			isTreatedForMHC,
			//-----------------------------------
			isPoliceOrPeaceOfficer,
			policeOfficerRoleCode,
			otherOfficerRole,
			//-----------------------------------
			reprint,
			//-----------------------------------
			categoryCodes: categoryCodes,
			documentRelatedInfos: documentRelatedInfos,
			documentInfos: documentInfos,
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

		armouredCarGuardData.attachments?.forEach((doc: any) => {
			documents.push({
				documentUrlId: doc.documentUrlId,
				expiryDate: this.utilService.dateToDbDate(armouredCarGuardData.expiryDate),
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

	showPhotographOfYourselfStep(workerLicenceModelData: any): boolean {
		const originalPhotoOfYourselfExpired = !!workerLicenceModelData.originalLicenceData.originalPhotoOfYourselfExpired;
		if (originalPhotoOfYourselfExpired) return true;

		const att = this.getSummaryphotoOfYourselfAttachments(workerLicenceModelData);
		return this.getSummaryhasGenderChanged(workerLicenceModelData) && !!att && att.length > 0;
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

	getSummaryserviceTypeCode(workerLicenceModelData: any): ServiceTypeCode | null {
		return workerLicenceModelData.serviceTypeData?.serviceTypeCode ?? null;
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

	getSummarylicenceTermCode(workerLicenceModelData: any): LicenceTermCode | null {
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

	getSummaryapplicantName(workerLicenceModelData: any): string {
		return (
			this.utilService.getFullNameWithMiddle(
				workerLicenceModelData.personalInformationData.givenName,
				workerLicenceModelData.personalInformationData.middleName1,
				workerLicenceModelData.personalInformationData.middleName2,
				workerLicenceModelData.personalInformationData.surname
			) ?? ''
		);
	}
	getSummarygenderCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.genderCode ?? '';
	}
	getSummarydateOfBirth(workerLicenceModelData: any): string {
		return workerLicenceModelData.personalInformationData.dateOfBirth ?? '';
	}
	getSummaryhasLegalNameChanged(workerLicenceModelData: any): boolean {
		return !!workerLicenceModelData.personalInformationData.hasLegalNameChanged;
	}
	getSummaryhasLegalNameChangedAttachments(workerLicenceModelData: any): File[] {
		return workerLicenceModelData.personalInformationData.attachments ?? [];
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
			? (workerLicenceModelData.citizenshipData.canadianCitizenProofTypeCode ?? '')
			: '';
	}
	getSummarynotCanadianCitizenProofTypeCode(workerLicenceModelData: any): string {
		return workerLicenceModelData.citizenshipData.isCanadianCitizen === BooleanTypeCode.No
			? (workerLicenceModelData.citizenshipData.notCanadianCitizenProofTypeCode ?? '')
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
		if (workerLicenceModelData.bcDriversLicenceData.hasBcDriversLicence === BooleanTypeCode.Yes) {
			const hasLicenceNumber = !!workerLicenceModelData.bcDriversLicenceData.bcDriversLicenceNumber;
			if (hasLicenceNumber) {
				return workerLicenceModelData.bcDriversLicenceData.bcDriversLicenceNumber;
			}
			return BooleanTypeCode.Yes;
		}
		return BooleanTypeCode.No;
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

	getSummaryphotoOfYourselfAttachments(workerLicenceModelData: any): File[] | null {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(workerLicenceModelData);
		if (applicationTypeCode === ApplicationTypeCode.New) {
			return workerLicenceModelData.photographOfYourselfData.attachments ?? null;
		} else {
			const updatePhoto = workerLicenceModelData.photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
			const updateAttachments = workerLicenceModelData.photographOfYourselfData.updateAttachments ?? null;
			return updatePhoto ? updateAttachments : null;
		}
	}

	getSummaryemailAddress(workerLicenceModelData: any): string {
		return workerLicenceModelData.contactInformationData?.emailAddress ?? '';
	}
	getSummaryphoneNumber(workerLicenceModelData: any): string {
		return workerLicenceModelData.contactInformationData?.phoneNumber ?? '';
	}

	getSummaryisAddressTheSame(workerLicenceModelData: any): boolean {
		return workerLicenceModelData.mailingAddressData?.isAddressTheSame ?? false;
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
