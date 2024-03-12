import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';

export abstract class CommonApplicationHelper {
	personalInformationFormGroup: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			genderCode: new FormControl('', [FormControlValidators.required]),
			dateOfBirth: new FormControl('', [Validators.required]),
			hasLegalNameChanged: new FormControl(false),
			origGivenName: new FormControl(''),
			origMiddleName1: new FormControl(''),
			origMiddleName2: new FormControl(''),
			origSurname: new FormControl(''),
			origGenderCode: new FormControl(''),
			origDateOfBirth: new FormControl(''),
			hasGenderChanged: new FormControl(false),
			attachments: new FormControl([]),
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

	// criminalHistoryFormGroup: FormGroup = this.formBuilder.group(
	// 	{
	// 		hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
	// 		criminalChargeDescription: new FormControl(''),
	// 	},
	// 	{
	// 		validators: [
	// 			FormGroupValidators.conditionalRequiredValidator(
	// 				'criminalChargeDescription',
	// 				(_form) =>
	// 					_form.get('hasCriminalHistory')?.value == BooleanTypeCode.Yes &&
	// 					this.applicationTypeFormGroup.get('applicationTypeCode')?.value == ApplicationTypeCode.Update
	// 			),
	// 		],
	// 	}
	// );

	contactInformationFormGroup: FormGroup = this.formBuilder.group({
		contactEmailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
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

	constructor(protected formBuilder: FormBuilder) {}
}
