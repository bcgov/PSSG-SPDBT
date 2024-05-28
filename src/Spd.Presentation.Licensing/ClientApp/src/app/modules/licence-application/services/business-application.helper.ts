import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BizTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ConfigService } from '@app/core/services/config.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';

export abstract class BusinessApplicationHelper {
	booleanTypeCodes = BooleanTypeCode;

	workerLicenceTypeFormGroup: FormGroup = this.formBuilder.group({
		workerLicenceTypeCode: new FormControl('', [Validators.required]),
	});

	applicationTypeFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeCode: new FormControl('', [Validators.required]),
	});

	licenceTermFormGroup: FormGroup = this.formBuilder.group({
		licenceTermCode: new FormControl('', [FormControlValidators.required]),
	});

	expiredLicenceFormGroup = this.formBuilder.group(
		{
			hasExpiredLicence: new FormControl('', [FormControlValidators.required]),
			expiredLicenceNumber: new FormControl(),
			expiredLicenceId: new FormControl(),
			expiryDate: new FormControl(),
			captchaFormGroup: new FormGroup({
				token: new FormControl(''),
			}),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'captchaFormGroup.token',
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
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
			FireInvestigator: new FormControl(false),
			Locksmith: new FormControl(false),
			LocksmithUnderSupervision: new FormControl(false),
			PrivateInvestigator: new FormControl(false),
			PrivateInvestigatorUnderSupervision: new FormControl(false),
			SecurityGuard: new FormControl(false),
			SecurityGuardUnderSupervision: new FormControl(false),
			SecurityAlarmInstallerUnderSupervision: new FormControl(false),
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
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl(''),
			managerLicenceNumber: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator('surname', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'managerLicenceNumber',
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
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			emailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
			phoneNumber: new FormControl('', [Validators.required]),
			isBusinessManager: new FormControl(),
			agivenName: new FormControl(''), // TODO applicant info - rename later
			amiddleName1: new FormControl(''),
			amiddleName2: new FormControl(''),
			asurname: new FormControl(''),
			aemailAddress: new FormControl('', [FormControlValidators.email]),
			aphoneNumber: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'asurname',
					(form) => !form.get('isBusinessManager')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'aemailAddress',
					(form) => !form.get('isBusinessManager')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'aphoneNumber',
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

	controllingMembersFormGroup: FormGroup = this.formBuilder.group({
		membersWithSwl: this.formBuilder.array([]),
		membersWithoutSwl: this.formBuilder.array([]),
		attachments: new FormControl([]),
	});

	employeesFormGroup: FormGroup = this.formBuilder.group({
		employees: this.formBuilder.array([]),
	});

	// membersConfirmationFormGroup: FormGroup = this.formBuilder.group({
	// 	attachments: new FormControl([], [Validators.required]),
	// });

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

	// employeesFormGroup: FormGroup = this.formBuilder.group({
	// 	hasEmployees: new FormControl(''),
	// 	licenceNumberLookup: new FormControl(''),
	// 	employees: this.formBuilder.array([]),
	// });

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

	constructor(
		protected formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected formatDatePipe: FormatDatePipe
	) {}
}
