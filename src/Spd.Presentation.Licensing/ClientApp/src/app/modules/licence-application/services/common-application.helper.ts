import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeCode, PoliceOfficerRoleCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';

export abstract class CommonApplicationHelper {
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
		linkedLicenceTermCode: new FormControl(null),
		linkedExpiryDate: new FormControl(null),
		linkedCardHolderName: new FormControl(null),
		linkedLicenceHolderName: new FormControl(null),
		linkedLicenceHolderId: new FormControl(null),
		captchaFormGroup: new FormGroup({
			token: new FormControl('', FormControlValidators.required),
		}),
	});

	linkAccountCodeFormGroup: FormGroup = this.formBuilder.group({
		licenceNumber: new FormControl('', [FormControlValidators.required]),
		accessCode: new FormControl('', [FormControlValidators.required]),
	});

	expiredLicenceFormGroup = this.formBuilder.group(
		{
			hasExpiredLicence: new FormControl('', [FormControlValidators.required]),
			expiredLicenceId: new FormControl(''),
			expiredLicenceHolderName: new FormControl(''),
			expiredLicenceNumber: new FormControl(''),
			expiredLicenceExpiryDate: new FormControl(''),
			expiredLicenceStatusCode: new FormControl(''),
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
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiredLicenceId',
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

	licenceTermFormGroup: FormGroup = this.formBuilder.group({
		licenceTermCode: new FormControl('', [FormControlValidators.required]),
	});

	criminalHistoryFormGroup: FormGroup = this.formBuilder.group(
		{
			hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
			criminalChargeDescription: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'criminalChargeDescription',
					(_form) =>
						_form.get('hasCriminalHistory')?.value == BooleanTypeCode.Yes &&
						this.applicationTypeFormGroup.get('applicationTypeCode')?.value == ApplicationTypeCode.Update
				),
			],
		}
	);

	policeBackgroundFormGroup: FormGroup = this.formBuilder.group(
		{
			isPoliceOrPeaceOfficer: new FormControl('', [FormControlValidators.required]),
			policeOfficerRoleCode: new FormControl(''),
			otherOfficerRole: new FormControl(''),
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'policeOfficerRoleCode',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.nopoliceofficer('policeOfficerRoleCode', 'isPoliceOrPeaceOfficer'),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'otherOfficerRole',
					(form) => form.get('policeOfficerRoleCode')?.value == PoliceOfficerRoleCode.Other
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	mentalHealthConditionsFormGroup: FormGroup = this.formBuilder.group(
		{
			isTreatedForMHC: new FormControl('', [FormControlValidators.required]),
			attachments: new FormControl(''),
			hasPreviousMhcFormUpload: new FormControl(''), // used to determine label to display
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isTreatedForMHC')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	bcDriversLicenceFormGroup: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl('', [FormControlValidators.required]),
		bcDriversLicenceNumber: new FormControl(),
	});

	photographOfYourselfFormGroup: FormGroup = this.formBuilder.group(
		{
			updatePhoto: new FormControl(''), // used by update/renewal
			uploadedDateTime: new FormControl(''), // used in Renewal to determine if a new photo is mandatory
			attachments: new FormControl([], [FormControlValidators.required]),
			updateAttachments: new FormControl([]), // used by update/renewal
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'updateAttachments',
					(form) =>
						form.get('updatePhoto')?.value == this.booleanTypeCodes.Yes &&
						this.applicationTypeFormGroup.get('applicationTypeCode')?.value !== ApplicationTypeCode.New
				),
				FormGroupValidators.conditionalRequiredValidator(
					'updatePhoto',
					(_form) => this.applicationTypeFormGroup.get('applicationTypeCode')?.value !== ApplicationTypeCode.New
				),
			],
		}
	);

	characteristicsFormGroup: FormGroup = this.formBuilder.group({
		hairColourCode: new FormControl('', [FormControlValidators.required]),
		eyeColourCode: new FormControl('', [FormControlValidators.required]),
		height: new FormControl('', [FormControlValidators.required]),
		heightUnitCode: new FormControl('', [FormControlValidators.required]),
		heightInches: new FormControl(''),
		weight: new FormControl('', [FormControlValidators.required]),
		weightUnitCode: new FormControl('', [FormControlValidators.required]),
	});

	personalInformationFormGroup: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			genderCode: new FormControl('', [FormControlValidators.required]),
			dateOfBirth: new FormControl('', [Validators.required]),
			hasLegalNameChanged: new FormControl(false),
			hasBcscNameChanged: new FormControl(),
			origGivenName: new FormControl(''),
			origMiddleName1: new FormControl(''),
			origMiddleName2: new FormControl(''),
			origSurname: new FormControl(''),
			origGenderCode: new FormControl(''),
			origDateOfBirth: new FormControl(''),
			hasGenderChanged: new FormControl(false),
			attachments: new FormControl([]),
			cardHolderName: new FormControl(), // placeholder for data to display in Update process
			licenceHolderName: new FormControl(), // placeholder for data to display in Update process
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => !!form.get('hasLegalNameChanged')?.value
				),
			],
		}
	);

	aliasesFormGroup: FormGroup = this.formBuilder.group({
		previousNameFlag: new FormControl(null, [FormControlValidators.required]),
		aliases: this.formBuilder.array([]),
	});

	contactInformationFormGroup: FormGroup = this.formBuilder.group({
		emailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		phoneNumber: new FormControl('', [Validators.required]),
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

	profileConfirmationFormGroup: FormGroup = this.formBuilder.group({
		isProfileUpToDate: new FormControl('', [Validators.requiredTrue]),
	});

	constructor(protected formBuilder: FormBuilder) {}
}
