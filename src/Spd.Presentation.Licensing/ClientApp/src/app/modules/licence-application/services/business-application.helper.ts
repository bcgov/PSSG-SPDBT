import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

	businessTypeFormGroup: FormGroup = this.formBuilder.group({
		businessTypeCode: new FormControl('', [Validators.required]),
	});

	licenceTermFormGroup: FormGroup = this.formBuilder.group({
		licenceTermCode: new FormControl('', [FormControlValidators.required]),
	});

	businessManagerFormGroup: FormGroup = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName1: new FormControl(''),
		middleName2: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		emailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		phoneNumber: new FormControl('', [Validators.required]),
		isBusinessManager: new FormControl(),
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

	companyBrandingFormGroup: FormGroup = this.formBuilder.group({
		noLogoOrBranding: new FormControl(false),
		attachments: new FormControl(''),
	});

	liabilityFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl(''),
	});

	categoryFormGroup: FormGroup = this.formBuilder.group({
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

	membersWithSwlFormGroup: FormGroup = this.formBuilder.group({
		hasMembersWithSwl: new FormControl(''),
		licenceNumberLookup: new FormControl(''),
		members: this.formBuilder.array([]),
	});

	membersWithoutSwlFormGroup: FormGroup = this.formBuilder.group({
		hasMembersWithoutSwl: new FormControl(''),
		members: this.formBuilder.array([]),
	});

	membersConfirmationFormGroup: FormGroup = this.formBuilder.group({
		attachments: this.formBuilder.array([]),
	});

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
		managerName: new FormControl(''),
		managerSwlNumber: new FormControl(''),
		managerPhoneNumber: new FormControl(''),
		managerEmail: new FormControl(''),
	});

	memberWithSwlFormGroup: FormGroup = this.formBuilder.group({
		licenceNumberLookup: new FormControl('', [FormControlValidators.required]),
	});

	employeeWithSwlFormGroup: FormGroup = this.formBuilder.group({
		licenceNumberLookup: new FormControl('', [FormControlValidators.required]),
	});

	memberWithoutSwlFormGroup: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl('', [FormControlValidators.required]),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			emailAddress: new FormControl(''),
			noEmailAddress: new FormControl(''),
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

	employeesFormGroup: FormGroup = this.formBuilder.group({
		hasEmployees: new FormControl(''),
		licenceNumberLookup: new FormControl(''),
		employees: this.formBuilder.array([]),
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
