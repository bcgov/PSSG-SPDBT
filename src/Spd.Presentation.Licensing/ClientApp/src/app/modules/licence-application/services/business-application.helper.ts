import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicationTypeCode,
	BizLicAppUpsertRequest,
	BizTypeCode,
	ContactInfo,
	Document,
	DocumentExpiredInfo,
	LicenceDocumentTypeCode,
	Members,
	NonSwlContactInfo,
	SwlContactInfo,
	WorkerCategoryTypeCode,
} from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { ControllingMemberContactInfo } from './business-application.service';
import { CommonApplicationHelper } from './common-application.helper';
import { LicenceDocumentsToSave } from './licence-application.service';

export abstract class BusinessApplicationHelper extends CommonApplicationHelper {
	originalBusinessLicenceFormGroup: FormGroup = this.formBuilder.group({
		originalApplicationId: new FormControl(null),
		originalLicenceId: new FormControl(null),
		originalLicenceNumber: new FormControl(null),
		originalExpiryDate: new FormControl(null),
		originalLicenceTermCode: new FormControl(null),
		originalBizTypeCode: new FormControl(null),
		originalDogAuthorizationExists: new FormControl(false),
	});

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
			bizTypeCode: new FormControl('', [Validators.required]),
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
			],
		}
	);

	swlLookupLicenceFormGroup: FormGroup = this.formBuilder.group({
		licenceNumberLookup: new FormControl('', [FormControlValidators.required]),
	});

	soleProprietorFormGroup: FormGroup = this.formBuilder.group({
		licenceNumberLookup: new FormControl('', [FormControlValidators.required]),
	});

	liabilityFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]),
	});

	categoryFormGroup: FormGroup = this.formBuilder.group(
		{
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
		},
		{ validators: [FormGroupValidators.atLeastOneTrueValidator()] }
	);

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
			isRequestDogAuthorization: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'isRequestDogAuthorization',
					(form) => form.get('isInclude')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isInclude')?.value && form.get('isRequestDogAuthorization')?.value === BooleanTypeCode.Yes
				),
			],
		}
	);

	businessManagerFormGroup: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl('', [FormControlValidators.required]),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			emailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
			phoneNumber: new FormControl('', [Validators.required]),
			isBusinessManager: new FormControl(),
			applicantGivenName: new FormControl(''),
			applicantMiddleName1: new FormControl(''),
			applicantMiddleName2: new FormControl(''),
			applicantSurname: new FormControl(''),
			applicantEmailAddress: new FormControl('', [FormControlValidators.email]),
			applicantPhoneNumber: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'applicantGivenName',
					(form) => !form.get('isBusinessManager')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'applicantSurname',
					(form) => !form.get('isBusinessManager')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'applicantEmailAddress',
					(form) => !form.get('isBusinessManager')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'applicantPhoneNumber',
					(form) => !form.get('isBusinessManager')?.value
				),
			],
		}
	);

	businessAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [FormControlValidators.required]),
		isMailingTheSame: new FormControl(false),
	});

	businessMailingAddressFormGroup: FormGroup = this.formBuilder.group(
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
					(_form) => this.businessAddressFormGroup.get('isMailingTheSame')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'addressLine1',
					(_form) => this.businessAddressFormGroup.get('isMailingTheSame')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'city',
					(_form) => this.businessAddressFormGroup.get('isMailingTheSame')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'postalCode',
					(_form) => this.businessAddressFormGroup.get('isMailingTheSame')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'province',
					(_form) => this.businessAddressFormGroup.get('isMailingTheSame')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'country',
					(_form) => this.businessAddressFormGroup.get('isMailingTheSame')?.value == false
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
			FormControlValidators.required,
			FormControlValidators.requiredValue('British Columbia'),
		]),
		country: new FormControl('', [FormControlValidators.required, FormControlValidators.requiredValue('Canada')]),
	});

	branchesInBcFormGroup: FormGroup = this.formBuilder.group({
		hasBranchesInBc: new FormControl(''),
		branches: this.formBuilder.array([]),
	});

	controllingMembersFormGroup: FormGroup = this.formBuilder.group(
		{
			membersWithSwl: this.formBuilder.array([]),
			membersWithoutSwl: this.formBuilder.array([]),
			attachmentIsRequired: new FormControl(false),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('attachmentIsRequired')?.value
				),
				FormGroupValidators.controllingmembersValidator('membersWithSwl', 'membersWithoutSwl'),
			],
		}
	);

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
			FormControlValidators.requiredValue('British Columbia'),
		]),
		country: new FormControl('', [FormControlValidators.required, FormControlValidators.requiredValue('Canada')]),
		branchManager: new FormControl('', [FormControlValidators.required]),
		branchPhoneNumber: new FormControl(''),
		branchEmailAddr: new FormControl('', [FormControlValidators.email]),
	});

	memberWithSwlFormGroup: FormGroup = this.formBuilder.group({
		licenceNumberLookup: new FormControl('', [FormControlValidators.required]),
	});

	memberWithoutSwlFormGroup: FormGroup = this.formBuilder.group(
		{
			bizContactId: new FormControl(''),
			givenName: new FormControl('', [FormControlValidators.required]),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			emailAddress: new FormControl('', [FormControlValidators.email]),
			noEmailAddress: new FormControl(''),
			phoneNumber: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'emailAddress',
					(_form) => _form.get('noEmailAddress')?.value != true
				),
			],
		}
	);

	managerFormGroup: FormGroup = this.formBuilder.group({
		id: new FormControl(''),
		managerRoleCode: new FormControl(''),
		givenName: new FormControl('', [FormControlValidators.required]),
		middleName1: new FormControl(''),
		middleName2: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		phoneNumber: new FormControl('', [FormControlValidators.required]),
		emailAddress: new FormControl('', [FormControlValidators.required, FormControlValidators.email]),
		jobTitle: new FormControl(''),
		isActive: new FormControl(''),
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

	reprintLicenceFormGroup: FormGroup = this.formBuilder.group({
		reprintLicence: new FormControl('', [FormControlValidators.required]),
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

	getSaveBodyBase(businessModelFormValue: any): BizLicAppUpsertRequest {
		const bizId = businessModelFormValue.bizId;
		const licenceAppId = businessModelFormValue.licenceAppId;
		const workerLicenceTypeData = { ...businessModelFormValue.workerLicenceTypeData };
		const applicationTypeData = { ...businessModelFormValue.applicationTypeData };
		const expiredLicenceData = { ...businessModelFormValue.expiredLicenceData };
		const companyBrandingData = { ...businessModelFormValue.companyBrandingData };
		const businessManagerData = { ...businessModelFormValue.businessManagerData };
		const originalLicenceData = { ...businessModelFormValue.originalLicenceData };

		const bizTypeCode = businessModelFormValue.businessInformationData.bizTypeCode;

		let privateInvestigatorSwlInfo: SwlContactInfo = {};
		let useDogs: boolean | null = null;

		const categoryCodes = this.getSaveBodyCategoryCodes(businessModelFormValue.categoryData);
		const documentInfos = this.getSaveBodyDocumentInfos(businessModelFormValue);

		// Business Manager information is only supplied in non-sole proprietor flow
		let applicantContactInfo: ContactInfo = {};
		let applicantIsBizManager: boolean | null = null;
		let bizManagerContactInfo: ContactInfo = {};

		if (!this.isSoleProprietor(bizTypeCode)) {
			applicantIsBizManager = businessManagerData.isBusinessManager;
			bizManagerContactInfo = {
				emailAddress: businessManagerData.emailAddress,
				givenName: businessManagerData.givenName,
				middleName1: businessManagerData.middleName1,
				middleName2: businessManagerData.middleName2,
				phoneNumber: businessManagerData.phoneNumber,
				surname: businessManagerData.surname,
			};

			if (!applicantIsBizManager) {
				applicantContactInfo = {
					emailAddress: businessManagerData.applicantEmailAddress,
					givenName: businessManagerData.applicantGivenName,
					middleName1: businessManagerData.applicantMiddleName1,
					middleName2: businessManagerData.applicantMiddleName2,
					phoneNumber: businessManagerData.applicantPhoneNumber,
					surname: businessManagerData.applicantSurname,
				};
			}
		}

		const categoryData = { ...businessModelFormValue.categoryData };

		if (categoryData.SecurityGuard) {
			useDogs = businessModelFormValue.categorySecurityGuardFormGroup.isRequestDogAuthorization === BooleanTypeCode.Yes;
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

		const documentExpiredInfos: Array<DocumentExpiredInfo> =
			documentInfos
				.filter((doc: any) => doc.expiryDate)
				.map((doc: Document) => {
					return {
						expiryDate: doc.expiryDate,
						licenceDocumentTypeCode: doc.licenceDocumentTypeCode,
					} as DocumentExpiredInfo;
				}) ?? [];

		// Only save members if business is not a sole proprietor
		let members: Members = {
			employees: [],
			nonSwlControllingMembers: [],
			swlControllingMembers: [],
		};
		if (!this.isSoleProprietor(bizTypeCode)) {
			members = {
				employees: this.saveEmployeesBody(businessModelFormValue.employeesData),
				nonSwlControllingMembers: this.saveControllingMembersWithoutSwlBody(
					businessModelFormValue.controllingMembersData
				),
				swlControllingMembers: this.saveControllingMembersWithSwlBody(businessModelFormValue.controllingMembersData),
			};
		}

		const hasExpiredLicence = expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes;
		const expiredLicenceId = hasExpiredLicence ? expiredLicenceData.expiredLicenceId : null;
		if (!hasExpiredLicence) {
			this.clearExpiredLicenceModelData();
		}

		const body = {
			bizId,
			bizTypeCode,
			licenceAppId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			licenceTermCode: businessModelFormValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			noBranding: companyBrandingData.noLogoOrBranding ?? false,
			applicantContactInfo,
			applicantIsBizManager,
			bizManagerContactInfo,
			//-----------------------------------
			hasExpiredLicence,
			expiredLicenceId,
			//-----------------------------------
			members,
			//-----------------------------------
			originalApplicationId: originalLicenceData ? originalLicenceData.originalApplicationId : null,
			originalLicenceId: originalLicenceData ? originalLicenceData.originalLicenceId : null,
			//-----------------------------------
			categoryCodes: [...categoryCodes],
			documentExpiredInfos: [...documentExpiredInfos],
			documentInfos: [...documentInfos],
			privateInvestigatorSwlInfo,
			useDogs,
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

	getSaveBodyDocumentInfos(businessModelFormValue: any): Array<LicenceDocumentsToSave> {
		const companyBrandingData = { ...businessModelFormValue.companyBrandingData };
		const liabilityData = { ...businessModelFormValue.liabilityData };
		const controllingMembersData = { ...businessModelFormValue.controllingMembersData };

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

		const categoryData = { ...businessModelFormValue.categoryData };

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
			const useDogs =
				businessModelFormValue.categorySecurityGuardFormGroup.isRequestDogAuthorization === BooleanTypeCode.Yes;
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

		if (controllingMembersData.attachments) {
			const docs: Array<Blob> = [];
			controllingMembersData.attachments.forEach((doc: any) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CorporateRegistryDocument,
				documents: docs,
			});
		}

		return documents;
	}

	saveControllingMembersWithSwlBody(controllingMembersData: any): null | Array<SwlContactInfo> {
		const controllingMembersWithSwlArray = controllingMembersData.membersWithSwl;

		if (!controllingMembersWithSwlArray) {
			return null;
		}

		const swlControllingMembers: null | Array<SwlContactInfo> = controllingMembersWithSwlArray.map(
			(item: ControllingMemberContactInfo) => {
				const contactInfo: SwlContactInfo = {
					bizContactId: item.bizContactId,
					contactId: item.contactId,
					licenceId: item.licenceId,
				};
				return contactInfo;
			}
		);

		console.debug('saveControllingMembersWithSwlBody', swlControllingMembers);
		return swlControllingMembers;
	}

	saveControllingMembersWithoutSwlBody(controllingMembersData: any): null | Array<NonSwlContactInfo> {
		const controllingMembersWithoutSwlArray = controllingMembersData.membersWithoutSwl;

		if (!controllingMembersWithoutSwlArray) {
			return null;
		}

		const nonSwlControllingMembers: null | Array<NonSwlContactInfo> = controllingMembersWithoutSwlArray.map(
			(item: ControllingMemberContactInfo) => {
				const contactInfo: NonSwlContactInfo = {
					bizContactId: item.bizContactId,
					emailAddress: item.emailAddress,
					givenName: item.givenName,
					middleName1: item.middleName1,
					middleName2: item.middleName2,
					phoneNumber: item.phoneNumber,
					surname: item.surname,
				};
				return contactInfo;
			}
		);

		console.debug('saveControllingMembersWithoutSwlBody', nonSwlControllingMembers);
		return nonSwlControllingMembers;
	}

	saveEmployeesBody(employeesData: any): null | Array<SwlContactInfo> {
		const employeesArray = employeesData.employees;

		if (!employeesArray) {
			return null;
		}

		const employees: null | Array<SwlContactInfo> = employeesArray.map((item: ControllingMemberContactInfo) => {
			const contactInfo: SwlContactInfo = {
				bizContactId: item.bizContactId,
				contactId: item.contactId,
				licenceId: item.licenceId,
			};
			return contactInfo;
		});

		console.debug('saveEmployeesBody', employees);
		return employees;
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

	clearPrivateInvestigatorModelData(): void {
		// clear out any old data
		this.categoryPrivateInvestigatorFormGroup.patchValue({
			managerContactId: null,
			managerLicenceId: null,
			managerLicenceHolderName: null,
			managerLicenceNumber: null,
			managerLicenceExpiryDate: null,
			managerLicenceStatusCode: null,
		});
	}
}
