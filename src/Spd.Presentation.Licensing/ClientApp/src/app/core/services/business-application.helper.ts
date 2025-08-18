import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicationTypeCode,
	BizTypeCode,
	ContactInfo,
	Document,
	LicenceDocumentTypeCode,
	LicenceTermCode,
	PrivateInvestigatorSwlContactInfo,
	ServiceTypeCode,
	WorkerCategoryTypeCode,
} from '@app/api/models';
import { BooleanTypeCode, SelectOptions } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationHelper } from '@app/core/services/common-application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { BranchResponse } from '@app/modules/business-licence-application/components/business-bc-branches.component';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';

export abstract class BusinessApplicationHelper extends CommonApplicationHelper {
	companyBrandingFormGroup: FormGroup = this.formBuilder.group(
		{
			noLogoOrBranding: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => !form.get('noLogoOrBranding')?.value
				),
			],
		}
	);

	businessInformationFormGroup: FormGroup = this.formBuilder.group(
		{
			bizTypeCode: new FormControl('', [FormControlValidators.required]),
			legalBusinessName: new FormControl({ value: '', disabled: true }, [FormControlValidators.required]),
			bizTradeName: new FormControl(''),
			isBizTradeNameReadonly: new FormControl(''),
			soleProprietorSwlEmailAddress: new FormControl('', [FormControlValidators.email]),
			soleProprietorSwlPhoneNumber: new FormControl(''),
			isTradeNameTheSameAsLegal: new FormControl(''),
			soleProprietorLicenceId: new FormControl(''),
			soleProprietorLicenceHolderName: new FormControl(''),
			soleProprietorLicenceNumber: new FormControl(''),
			soleProprietorLicenceExpiryDate: new FormControl(''),
			soleProprietorLicenceStatusCode: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'soleProprietorLicenceId',
					(form) =>
						form.get('bizTypeCode')?.value == BizTypeCode.NonRegisteredSoleProprietor ||
						form.get('bizTypeCode')?.value == BizTypeCode.RegisteredSoleProprietor
				),
				FormGroupValidators.licencemustbeactiveValidator('soleProprietorLicenceStatusCode', 'bizTypeCode'),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'soleProprietorSwlEmailAddress',
					(form) =>
						form.get('bizTypeCode')?.value == BizTypeCode.NonRegisteredSoleProprietor ||
						form.get('bizTypeCode')?.value == BizTypeCode.RegisteredSoleProprietor
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'soleProprietorSwlPhoneNumber',
					(form) =>
						form.get('bizTypeCode')?.value == BizTypeCode.NonRegisteredSoleProprietor ||
						form.get('bizTypeCode')?.value == BizTypeCode.RegisteredSoleProprietor
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'bizTradeName',
					(form) => form.get('isBizTradeNameReadonly')?.value != true
				),
			],
		}
	);

	soleProprietorFormGroup: FormGroup = this.formBuilder.group({
		licenceNumberLookup: new FormControl('', [FormControlValidators.required]),
	});

	liabilityFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]),
	});

	categoryFormGroup: FormGroup = this.formBuilder.group(
		{
			categoryCode: new FormControl(null),

			ArmouredCarGuard: new FormControl(false),
			BodyArmourSales: new FormControl(false),
			ClosedCircuitTelevisionInstaller: new FormControl(false),
			ElectronicLockingDeviceInstaller: new FormControl(false),
			Locksmith: new FormControl(false),
			PrivateInvestigator: new FormControl(false),
			SecurityGuard: new FormControl(false),
			SecurityAlarmInstaller: new FormControl(false),
			SecurityAlarmMonitor: new FormControl(false),
			SecurityAlarmResponse: new FormControl(false),
			SecurityAlarmSales: new FormControl(false),
			SecurityConsultant: new FormControl(false),

			attachments: new FormControl([]),
		},
		{ validators: [FormGroupValidators.atLeastOneTrueValidator()] }
	);

	categoryArmouredCarGuardFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);

	categoryPrivateInvestigatorFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			managerContactId: new FormControl(''),
			managerLicenceId: new FormControl(''),
			managerLicenceHolderName: new FormControl(''),
			managerLicenceNumber: new FormControl(''),
			managerLicenceExpiryDate: new FormControl(''),
			managerLicenceStatusCode: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'managerLicenceId',
					(form) => form.get('isInclude')?.value
				),
			],
		}
	);

	categorySecurityGuardFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
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
				FormGroupValidators.conditionalRequiredValidator('useDogs', (form) => form.get('isInclude')?.value ?? false),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('useDogs')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.atLeastOneCheckboxWhenReqdValidator('dogsPurposeFormGroup', 'useDogs', BooleanTypeCode.Yes),
			],
		}
	);

	businessManagerFormGroup: FormGroup = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName1: new FormControl(''),
		middleName2: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		emailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		phoneNumber: new FormControl('', [FormControlValidators.required]),
	});

	applicantFormGroup: FormGroup = this.formBuilder.group(
		{
			applicantIsBizManager: new FormControl(''),
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl(''),
			emailAddress: new FormControl('', [FormControlValidators.email]),
			phoneNumber: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'surname',
					(form) => form.get('applicantIsBizManager')?.value != true
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'emailAddress',
					(form) => form.get('applicantIsBizManager')?.value != true
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'phoneNumber',
					(form) => form.get('applicantIsBizManager')?.value != true
				),
			],
		}
	);

	businessMailingAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false),
		addressLine1: new FormControl(''),
		addressLine2: new FormControl(''),
		city: new FormControl(''),
		postalCode: new FormControl(''),
		province: new FormControl(''),
		country: new FormControl(''),
	});

	businessAddressFormGroup: FormGroup = this.formBuilder.group(
		{
			addressSelected: new FormControl(false),
			addressLine1: new FormControl(''),
			addressLine2: new FormControl(''),
			city: new FormControl(''),
			postalCode: new FormControl(''),
			province: new FormControl(''),
			country: new FormControl(''),
			isAddressTheSame: new FormControl(false),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredTrueValidator(
					'addressSelected',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'addressLine1',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'city',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'postalCode',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'province',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'country',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
			],
		}
	);

	bcBusinessAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [
			Validators.required,
			FormControlValidators.requiredValue(
				SPD_CONSTANTS.address.provinceBC,
				SPD_CONSTANTS.address.provinceBritishColumbia
			),
		]),
		country: new FormControl('', [
			Validators.required,
			FormControlValidators.requiredValue(SPD_CONSTANTS.address.countryCA, SPD_CONSTANTS.address.countryCanada),
		]),
	});

	branchesInBcFormGroup: FormGroup = this.formBuilder.group({
		hasBranchesInBc: new FormControl(''),
		branches: this.formBuilder.array([]),
	});

	controllingMembersFormGroup: FormGroup = this.formBuilder.group({
		membersWithSwl: this.formBuilder.array([]),
		membersWithoutSwl: this.formBuilder.array([]),
	});

	businessMembersFormGroup: FormGroup = this.formBuilder.group({
		membersWithSwl: this.formBuilder.array([]),
		membersWithoutSwl: this.formBuilder.array([]),
	});

	corporateRegistryDocumentFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]),
	});

	employeesFormGroup: FormGroup = this.formBuilder.group(
		{
			employees: this.formBuilder.array([]),
		},
		{
			validators: [FormGroupValidators.employeesValidator('employees')],
		}
	);

	branchInBcFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [
			FormControlValidators.required,
			FormControlValidators.requiredValue(
				SPD_CONSTANTS.address.provinceBC,
				SPD_CONSTANTS.address.provinceBritishColumbia
			),
		]),
		country: new FormControl('', [
			FormControlValidators.required,
			FormControlValidators.requiredValue(SPD_CONSTANTS.address.countryCA, SPD_CONSTANTS.address.countryCanada),
		]),
		branchManager: new FormControl('', [FormControlValidators.required]),
		branchPhoneNumber: new FormControl('', [FormControlValidators.required]),
		branchEmailAddr: new FormControl('', [FormControlValidators.email]),
	});

	createBranchInBcFormGroup(): FormGroup {
		return this.formBuilder.group({
			addressLine1: ['', FormControlValidators.required],
			addressLine2: [''],
			city: ['', FormControlValidators.required],
			postalCode: ['', FormControlValidators.required],
			province: [
				'',
				[
					FormControlValidators.required,
					FormControlValidators.requiredValue(
						SPD_CONSTANTS.address.provinceBC,
						SPD_CONSTANTS.address.provinceBritishColumbia
					),
				],
			],
			country: [
				'',
				[
					FormControlValidators.required,
					FormControlValidators.requiredValue(SPD_CONSTANTS.address.countryCA, SPD_CONSTANTS.address.countryCanada),
				],
			],
			branchManager: ['', FormControlValidators.required],
			branchPhoneNumber: ['', FormControlValidators.required],
			branchEmailAddr: ['', FormControlValidators.email],
		});
	}

	memberWithSwlFormGroup: FormGroup = this.formBuilder.group({
		licenceNumberLookup: new FormControl('', [FormControlValidators.required]),
	});

	memberWithoutSwlFormGroup: FormGroup = this.formBuilder.group(
		{
			bizContactId: new FormControl(''),
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			emailAddress: new FormControl('', [FormControlValidators.email]),
			noEmailAddress: new FormControl(''),
			phoneNumber: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'emailAddress',
					(_form) => _form.get('noEmailAddress')?.value != true
				),
			],
		}
	);

	portalAdministratorFormGroup: FormGroup = this.formBuilder.group({
		id: new FormControl(''),
		contactAuthorizationTypeCode: new FormControl('', [FormControlValidators.required]),
		firstName: new FormControl(''),
		lastName: new FormControl('', [FormControlValidators.required]),
		phoneNumber: new FormControl('', [FormControlValidators.required]),
		email: new FormControl('', [Validators.required, FormControlValidators.email]),
		jobTitle: new FormControl(''),
	});

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		check2: new FormControl(null, [Validators.requiredTrue]),
		check3: new FormControl(null, [Validators.requiredTrue]),
		check4: new FormControl(null, [Validators.requiredTrue]),
		check5: new FormControl(null, [Validators.requiredTrue]),
		check6: new FormControl(null, [Validators.requiredTrue]),
		agreeToCompleteAndAccurate: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
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

	isBcBranchValid(branch: BranchResponse): boolean {
		const branchFormGroup = this.createBranchInBcFormGroup();
		branchFormGroup.patchValue(branch);
		return branchFormGroup.valid;
	}

	/**
	 * Is the count of stakeholders valid?
	 * @param
	 * @returns minCountValid, maxCountValid
	 */
	isBusinessStakeholdersCountValid(): { minCountValid: boolean; maxCountValid: boolean } {
		const maxCount = SPD_CONSTANTS.maxCount.controllingMembersAndBusinessManagers;
		const controllingMembersFormGroup = this.controllingMembersFormGroup;
		const businessMembersFormGroup = this.businessMembersFormGroup;

		const total =
			+controllingMembersFormGroup.get('membersWithSwl')?.value.length +
			+controllingMembersFormGroup.get('membersWithoutSwl')?.value.length +
			+businessMembersFormGroup.get('membersWithSwl')?.value.length +
			+businessMembersFormGroup.get('membersWithoutSwl')?.value.length;

		const minCountValid = total > 0;
		const maxCountValid = total <= 0 || (total > 0 && total <= maxCount);

		return { minCountValid, maxCountValid };
	}

	/**
	 * Get the valid list of categories based upon the current selections
	 * @param categoryList
	 * @returns
	 */
	getValidBlCategoryList(categoryList: string[], superset: WorkerCategoryTypeCode[]): SelectOptions<string>[] {
		return this.getValidCategoryList(
			this.configService.config?.invalidWorkerLicenceCategoryMatrixConfiguration,
			categoryList,
			true,
			superset
		);
	}

	getDocsToSaveBlobs(businessModelFormValue: any): Array<LicenceDocumentsToSave> {
		const companyBrandingData = businessModelFormValue.companyBrandingData;
		const liabilityData = businessModelFormValue.liabilityData;
		const corporateRegistryDocumentData = businessModelFormValue.corporateRegistryDocumentData;

		const documents: Array<LicenceDocumentsToSave> = [];

		if (!companyBrandingData.noLogoOrBranding) {
			const docs: Array<Blob> = [];
			companyBrandingData.attachments?.forEach((doc: any) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.BizBranding,
				documents: docs,
			});
		}

		if (liabilityData.attachments?.length > 0) {
			const docs: Array<Blob> = [];
			liabilityData.attachments?.forEach((doc: any) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.BizInsurance,
				documents: docs,
			});
		}

		const categoryData = businessModelFormValue.categoryData;

		if (categoryData.ArmouredCarGuard) {
			const docs: Array<Blob> = [];
			businessModelFormValue.categoryArmouredCarGuardFormGroup.attachments.forEach((doc: any) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.ArmourCarGuardRegistrar,
				documents: docs,
			});
		}

		if (categoryData.SecurityGuard) {
			const useDogs = this.utilService.booleanTypeToBoolean(
				businessModelFormValue.categorySecurityGuardFormGroup.useDogs
			);
			if (useDogs) {
				if (businessModelFormValue.categorySecurityGuardFormGroup.attachments) {
					const docs: Array<Blob> = [];
					businessModelFormValue.categorySecurityGuardFormGroup.attachments.forEach((doc: any) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: LicenceDocumentTypeCode.BizSecurityDogCertificate,
						documents: docs,
					});
				}
			}
		}

		if (categoryData.attachments) {
			const docs: Array<Blob> = [];
			categoryData.attachments.forEach((doc: any) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.BizInsurance,
				documents: docs,
			});
		}

		if (corporateRegistryDocumentData.attachments) {
			const docs: Array<Blob> = [];
			corporateRegistryDocumentData.attachments.forEach((doc: any) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CorporateRegistryDocument,
				documents: docs,
			});
		}

		return documents;
	}

	getSaveBodyBase(businessModelFormValue: any): any {
		const bizId = businessModelFormValue.bizId;
		const licenceAppId = businessModelFormValue.licenceAppId;
		const soleProprietorSWLAppId = businessModelFormValue.soleProprietorSWLAppId;
		const soleProprietorSWLAppOriginTypeCode = businessModelFormValue.soleProprietorSWLAppOriginTypeCode;
		const serviceTypeData = businessModelFormValue.serviceTypeData;
		const applicationTypeData = businessModelFormValue.applicationTypeData;
		const expiredLicenceData = businessModelFormValue.expiredLicenceData;
		const companyBrandingData = businessModelFormValue.companyBrandingData;
		const applicantData = businessModelFormValue.applicantData;
		const originalLicenceData = businessModelFormValue.originalLicenceData;

		const businessInformationData = businessModelFormValue.businessInformationData;
		const bizTypeCode = businessInformationData.bizTypeCode;
		const applicantSwlLicenceId = businessInformationData.soleProprietorLicenceId;

		let privateInvestigatorSwlInfo: PrivateInvestigatorSwlContactInfo = {};
		let securityGuardData: any = {
			useDogs: null,
			isDogsPurposeDetectionDrugs: null,
			isDogsPurposeDetectionExplosives: null,
			isDogsPurposeProtection: null,
		};

		const categoryCodes = this.getSaveBodyCategoryCodes(businessModelFormValue.categoryData);
		const documentInfos = this.getSaveBodyDocumentInfos(businessModelFormValue);

		// Business Manager information is only supplied in non-sole proprietor flow
		let applicantContactInfo: ContactInfo = {};
		let applicantIsBizManager: boolean | null = null;

		applicantIsBizManager = applicantData.applicantIsBizManager === true;
		if (!applicantIsBizManager) {
			applicantContactInfo = {
				emailAddress: applicantData.emailAddress,
				givenName: applicantData.givenName,
				middleName1: applicantData.middleName1,
				middleName2: applicantData.middleName2,
				phoneNumber: applicantData.phoneNumber,
				surname: applicantData.surname,
			};
		}

		const categoryData = businessModelFormValue.categoryData;

		if (categoryData.SecurityGuard) {
			const dogsPurposeFormGroup = businessModelFormValue.categorySecurityGuardFormGroup.dogsPurposeFormGroup;
			const isDetectionDrugs = dogsPurposeFormGroup.isDogsPurposeDetectionDrugs;
			const isDetectionExplosives = dogsPurposeFormGroup.isDogsPurposeDetectionExplosives;
			const isProtection = dogsPurposeFormGroup.isDogsPurposeProtection;
			const useDogs = this.utilService.booleanTypeToBoolean(
				businessModelFormValue.categorySecurityGuardFormGroup.useDogs
			);

			securityGuardData = {
				useDogs,
				isDogsPurposeDetectionDrugs: useDogs ? isDetectionDrugs : null,
				isDogsPurposeDetectionExplosives: useDogs ? isDetectionExplosives : null,
				isDogsPurposeProtection: useDogs ? isProtection : null,
			};
		}

		if (categoryData.PrivateInvestigator) {
			const privateInvestigatorData = businessModelFormValue.categoryPrivateInvestigatorFormGroup;
			privateInvestigatorSwlInfo = {
				contactId: privateInvestigatorData.managerContactId,
				licenceId: privateInvestigatorData.managerLicenceId,
			};
		} else {
			this.clearPrivateInvestigatorModelData();
		}

		const hasExpiredLicence = this.utilService.booleanTypeToBoolean(expiredLicenceData.hasExpiredLicence);
		const expiredLicenceId = hasExpiredLicence ? expiredLicenceData.expiredLicenceId : null;
		if (!hasExpiredLicence) {
			this.clearExpiredLicenceModelData();
		}

		const body = {
			bizId,
			bizTypeCode,
			licenceAppId,
			soleProprietorSWLAppId,
			soleProprietorSWLAppOriginTypeCode,
			applicantSwlLicenceId,
			latestApplicationId: businessModelFormValue.latestApplicationId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			serviceTypeCode: serviceTypeData.serviceTypeCode,
			licenceTermCode: businessModelFormValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			noBranding: companyBrandingData.noLogoOrBranding ?? false,
			applicantIsBizManager,
			applicantContactInfo,
			//-----------------------------------
			hasExpiredLicence,
			expiredLicenceId,
			//-----------------------------------
			originalApplicationId: originalLicenceData ? originalLicenceData.originalApplicationId : null,
			originalLicenceId: originalLicenceData ? originalLicenceData.originalLicenceId : null,
			//-----------------------------------
			categoryCodes,
			documentInfos,
			privateInvestigatorSwlInfo,
			...securityGuardData,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getSaveBodyCategoryCodes(categoryData: any): Array<WorkerCategoryTypeCode> {
		const categoryCodes: Array<WorkerCategoryTypeCode> = [];

		if (categoryData.ArmouredCarGuard) {
			categoryCodes.push(WorkerCategoryTypeCode.ArmouredCarGuard);
		}

		if (categoryData.BodyArmourSales) {
			categoryCodes.push(WorkerCategoryTypeCode.BodyArmourSales);
		}

		if (categoryData.ClosedCircuitTelevisionInstaller) {
			categoryCodes.push(WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller);
		}

		if (categoryData.ElectronicLockingDeviceInstaller) {
			categoryCodes.push(WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller);
		}

		if (categoryData.Locksmith) {
			categoryCodes.push(WorkerCategoryTypeCode.Locksmith);
		}

		if (categoryData.PrivateInvestigator) {
			categoryCodes.push(WorkerCategoryTypeCode.PrivateInvestigator);
		}

		if (categoryData.SecurityGuard) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityGuard);
		}

		if (categoryData.SecurityAlarmInstaller) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmInstaller);
		}

		if (categoryData.SecurityAlarmMonitor) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmMonitor);
		}

		if (categoryData.SecurityAlarmResponse) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmResponse);
		}

		if (categoryData.SecurityAlarmSales) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityAlarmSales);
		}

		if (categoryData.SecurityConsultant) {
			categoryCodes.push(WorkerCategoryTypeCode.SecurityConsultant);
		}

		return categoryCodes;
	}

	getSaveBodyDocumentInfos(businessModelFormValue: any): Array<Document> {
		const companyBrandingData = businessModelFormValue.companyBrandingData;
		const liabilityData = businessModelFormValue.liabilityData;
		const corporateRegistryDocumentData = businessModelFormValue.corporateRegistryDocumentData;

		const documents: Array<Document> = [];

		if (!companyBrandingData.noLogoOrBranding) {
			companyBrandingData.attachments?.forEach((doc: any) => {
				documents.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.BizBranding,
				});
			});
		}

		if (liabilityData.attachments?.length > 0) {
			liabilityData.attachments?.forEach((doc: any) => {
				documents.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.BizInsurance,
				});
			});
		}

		const categoryData = businessModelFormValue.categoryData;

		if (categoryData.ArmouredCarGuard) {
			businessModelFormValue.categoryArmouredCarGuardFormGroup.attachments?.forEach((doc: any) => {
				documents.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.ArmourCarGuardRegistrar,
				});
			});
		}

		if (categoryData.SecurityGuard) {
			const useDogs = this.utilService.booleanTypeToBoolean(
				businessModelFormValue.categorySecurityGuardFormGroup.useDogs
			);
			if (useDogs) {
				if (businessModelFormValue.categorySecurityGuardFormGroup.attachments) {
					businessModelFormValue.categorySecurityGuardFormGroup.attachments?.forEach((doc: any) => {
						documents.push({
							documentUrlId: doc.documentUrlId,
							licenceDocumentTypeCode: LicenceDocumentTypeCode.BizSecurityDogCertificate,
						});
					});
				}
			}
		}

		if (corporateRegistryDocumentData.attachments) {
			corporateRegistryDocumentData.attachments?.forEach((doc: any) => {
				documents.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CorporateRegistryDocument,
				});
			});
		}

		return documents;
	}

	isSoleProprietor(bizTypeCode: BizTypeCode | undefined): boolean {
		if (!bizTypeCode) return false;

		return (
			bizTypeCode === BizTypeCode.NonRegisteredSoleProprietor || bizTypeCode === BizTypeCode.RegisteredSoleProprietor
		);
	}

	isRenewalOrUpdate(applicationTypeCode: ApplicationTypeCode | undefined): boolean {
		if (!applicationTypeCode) return false;

		return applicationTypeCode === ApplicationTypeCode.Renewal || applicationTypeCode === ApplicationTypeCode.Update;
	}

	isUpdate(applicationTypeCode: ApplicationTypeCode | undefined): boolean {
		if (!applicationTypeCode) return false;

		return applicationTypeCode === ApplicationTypeCode.Update;
	}

	getSummarycaseNumber(businessLicenceModelData: any): string {
		return businessLicenceModelData.caseNumber ?? '';
	}

	getSummaryisBusinessLicenceSoleProprietor(businessLicenceModelData: any): string {
		return businessLicenceModelData.isBusinessLicenceSoleProprietor ?? false;
	}

	getSummaryhasExpiredLicence(businessLicenceModelData: any): string {
		return businessLicenceModelData.expiredLicenceData.hasExpiredLicence ?? '';
	}
	getSummaryexpiredLicenceNumber(businessLicenceModelData: any): string {
		return businessLicenceModelData.expiredLicenceData.expiredLicenceNumber ?? '';
	}
	getSummaryexpiredLicenceExpiryDate(businessLicenceModelData: any): string {
		return businessLicenceModelData.expiredLicenceData.expiredLicenceExpiryDate ?? '';
	}

	getSummarynoLogoOrBranding(businessLicenceModelData: any): string {
		return businessLicenceModelData.companyBrandingData.noLogoOrBranding ?? '';
	}
	getSummarycompanyBrandingAttachments(businessLicenceModelData: any): File[] {
		return businessLicenceModelData.companyBrandingData.attachments ?? [];
	}

	getSummaryproofOfInsuranceAttachments(businessLicenceModelData: any): File[] {
		return businessLicenceModelData.liabilityData.attachments ?? [];
	}

	getSummaryserviceTypeCode(businessLicenceModelData: any): ServiceTypeCode | null {
		return businessLicenceModelData.serviceTypeData?.serviceTypeCode ?? null;
	}
	getSummaryapplicationTypeCode(businessLicenceModelData: any): ApplicationTypeCode | null {
		return businessLicenceModelData.applicationTypeData?.applicationTypeCode ?? null;
	}
	getSummarybizTypeCode(businessLicenceModelData: any): BizTypeCode | null {
		return businessLicenceModelData.businessInformationData?.bizTypeCode ?? null;
	}
	getSummarylicenceTermCode(businessLicenceModelData: any): LicenceTermCode | null {
		return businessLicenceModelData.licenceTermData.licenceTermCode ?? '';
	}
	getSummarysoleProprietorLicenceHolderName(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessInformationData.soleProprietorLicenceHolderName ?? '';
	}
	getSummarysoleProprietorLicenceNumber(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessInformationData.soleProprietorLicenceNumber ?? '';
	}
	getSummarysoleProprietorLicenceExpiryDate(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessInformationData.soleProprietorLicenceExpiryDate ?? '';
	}
	getSummarysoleProprietorSwlEmailAddress(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessInformationData.soleProprietorSwlEmailAddress ?? '';
	}
	getSummarysoleProprietorSwlPhoneNumber(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessInformationData.soleProprietorSwlPhoneNumber ?? '';
	}

	getSummarycategoryList(businessLicenceModelData: any): Array<WorkerCategoryTypeCode> {
		const list: Array<WorkerCategoryTypeCode> = [];
		const categoryData = businessLicenceModelData.categoryData;

		for (const [key, value] of Object.entries(categoryData)) {
			if (value && key in WorkerCategoryTypeCode) {
				list.push(key as WorkerCategoryTypeCode);
			}
		}

		return list.sort((a, b) => this.utilService.sortByDirection(a.toUpperCase(), b.toUpperCase()));
	}
	getSummaryisDogs(businessLicenceModelData: any): boolean {
		return businessLicenceModelData.categorySecurityGuardFormGroup?.isInclude ?? false;
	}
	getSummaryuseDogs(businessLicenceModelData: any): string {
		return businessLicenceModelData.categorySecurityGuardFormGroup.useDogs ?? '';
	}
	getSummaryisDogsPurposeProtection(businessLicenceModelData: any): string {
		return (
			businessLicenceModelData.categorySecurityGuardFormGroup.dogsPurposeFormGroup.isDogsPurposeProtection ?? false
		);
	}
	getSummaryisDogsPurposeDetectionDrugs(businessLicenceModelData: any): string {
		return (
			businessLicenceModelData.categorySecurityGuardFormGroup.dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false
		);
	}
	getSummaryisDogsPurposeDetectionExplosives(businessLicenceModelData: any): string {
		return (
			businessLicenceModelData.categorySecurityGuardFormGroup.dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ??
			false
		);
	}
	getSummarydogsPurposeAttachments(businessLicenceModelData: any): File[] {
		return businessLicenceModelData.categorySecurityGuardFormGroup.attachments ?? [];
	}

	getSummaryisPrivateInvestigator(businessLicenceModelData: any): boolean {
		return businessLicenceModelData.categoryPrivateInvestigatorFormGroup?.isInclude ?? false;
	}
	getSummaryprivateInvestigatorName(businessLicenceModelData: any): string {
		return businessLicenceModelData.categoryPrivateInvestigatorFormGroup.managerLicenceHolderName ?? '';
	}
	getSummaryprivateInvestigatorLicenceNumber(businessLicenceModelData: any): string {
		return businessLicenceModelData.categoryPrivateInvestigatorFormGroup.managerLicenceNumber ?? '';
	}
	getSummaryprivateInvestigatorExpiryDate(businessLicenceModelData: any): string {
		return businessLicenceModelData.categoryPrivateInvestigatorFormGroup.managerLicenceExpiryDate ?? '';
	}
	getSummaryisAnyDocuments(businessLicenceModelData: any): boolean {
		return this.getSummaryshowArmouredCarGuard(businessLicenceModelData);
	}
	getSummaryshowArmouredCarGuard(businessLicenceModelData: any): boolean {
		return businessLicenceModelData.categoryArmouredCarGuardFormGroup?.isInclude ?? false;
	}
	getSummaryshowSecurityGuard(businessLicenceModelData: any): boolean {
		const isInclude = businessLicenceModelData.categorySecurityGuardFormGroup?.isInclude ?? false;
		return isInclude && businessLicenceModelData.categorySecurityGuardFormGroup?.useDogs === BooleanTypeCode.Yes;
	}
	getSummarycategoryArmouredCarGuardAttachments(businessLicenceModelData: any): File[] {
		return businessLicenceModelData.categoryArmouredCarGuardFormGroup.attachments ?? [];
	}
	getSummarycategorySecurityGuardAttachments(businessLicenceModelData: any): File[] {
		return businessLicenceModelData.categorySecurityGuardFormGroup.attachments ?? [];
	}

	getSummarybusinessManagerGivenName(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessManagerData.givenName ?? '';
	}
	getSummarybusinessManagerMiddleName1(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessManagerData.middleName1 ?? '';
	}
	getSummarybusinessManagerMiddleName2(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessManagerData.middleName2 ?? '';
	}
	getSummarybusinessManagerSurname(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessManagerData.surname ?? '';
	}
	getSummarybusinessManagerEmailAddress(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessManagerData.emailAddress ?? '';
	}
	getSummarybusinessManagerPhoneNumber(businessLicenceModelData: any): string {
		return businessLicenceModelData.businessManagerData.phoneNumber ?? '';
	}

	getSummaryapplicantIsBizManager(businessLicenceModelData: any): string {
		return businessLicenceModelData.applicantData.applicantIsBizManager ?? '';
	}
	getSummaryyourContactGivenName(businessLicenceModelData: any): string {
		return businessLicenceModelData.applicantData.givenName ?? '';
	}
	getSummaryyourContactMiddleName1(businessLicenceModelData: any): string {
		return businessLicenceModelData.applicantData.middleName1 ?? '';
	}
	getSummaryyourContactMiddleName2(businessLicenceModelData: any): string {
		return businessLicenceModelData.applicantData.middleName2 ?? '';
	}
	getSummaryyourContactSurname(businessLicenceModelData: any): string {
		return businessLicenceModelData.applicantData.surname ?? '';
	}
	getSummaryyourContactEmailAddress(businessLicenceModelData: any): string {
		return businessLicenceModelData.applicantData.emailAddress ?? '';
	}
	getSummaryyourContactPhoneNumber(businessLicenceModelData: any): string {
		return businessLicenceModelData.applicantData.phoneNumber ?? '';
	}

	getSummarymembersWithSwlList(businessLicenceModelData: any): Array<any> {
		const cm = businessLicenceModelData.controllingMembersData.membersWithSwl;
		const bm = businessLicenceModelData.businessMembersData.membersWithSwl;
		return cm.concat(bm);
	}
	getSummarymembersWithoutSwlList(businessLicenceModelData: any): Array<any> {
		const cm = businessLicenceModelData.controllingMembersData.membersWithoutSwl;
		const bm = businessLicenceModelData.businessMembersData.membersWithoutSwl;
		return cm.concat(bm);
	}

	getSummaryemployeesList(businessLicenceModelData: any): Array<any> {
		return businessLicenceModelData.employeesData.employees ?? [];
	}

	getSummarycorporateRegistryDocumentsAttachments(businessLicenceModelData: any): File[] {
		return businessLicenceModelData.corporateRegistryDocumentData.attachments ?? [];
	}

	getSummaryisAddressTheSame(businessLicenceModelData: any): boolean {
		return businessLicenceModelData.businessAddressData?.isAddressTheSame ?? false;
	}

	getSummaryisBcBusinessAddress(businessLicenceModelData: any): boolean {
		return businessLicenceModelData.isBcBusinessAddress ?? false;
	}

	private clearPrivateInvestigatorModelData(): void {
		// clear out any old data
		this.categoryPrivateInvestigatorFormGroup.patchValue(
			{
				managerContactId: null,
				managerLicenceId: null,
				managerLicenceHolderName: null,
				managerLicenceNumber: null,
				managerLicenceExpiryDate: null,
				managerLicenceStatusCode: null,
			},
			{ emitEvent: false }
		);
	}
}
