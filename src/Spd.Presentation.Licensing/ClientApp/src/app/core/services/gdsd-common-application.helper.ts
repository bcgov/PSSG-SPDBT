import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormControlValidators } from '../validators/form-control.validators';
import { FormGroupValidators } from '../validators/form-group.validators';
import { CommonApplicationHelper } from './common-application.helper';

export abstract class GdsdCommonApplicationHelper extends CommonApplicationHelper {
	override personalInformationFormGroup: FormGroup = this.formBuilder.group({
		hasBcscNameChanged: new FormControl(''), // placeholder
		givenName: new FormControl(''),
		middleName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		dateOfBirth: new FormControl('', [Validators.required]),
		phoneNumber: new FormControl('', [FormControlValidators.required]),
		emailAddress: new FormControl('', [FormControlValidators.email]),
	});

	governmentPhotoIdFormGroup: FormGroup = this.formBuilder.group({
		photoTypeCode: new FormControl('', [FormControlValidators.required]),
		expiryDate: new FormControl(''),
		attachments: new FormControl([], [Validators.required]),
	});

	dogInfoFormGroup: FormGroup = this.formBuilder.group({
		dogName: new FormControl('', [FormControlValidators.required]),
		dogDateOfBirth: new FormControl('', [Validators.required]),
		dogBreed: new FormControl('', [FormControlValidators.required]),
		dogColorAndMarkings: new FormControl('', [FormControlValidators.required]),
		dogGender: new FormControl('', [FormControlValidators.required]),
		microchipNumber: new FormControl(''),
	});

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		applicantOrLegalGuardianName: new FormControl('', [FormControlValidators.required]),
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

	consentAndDeclarationDtFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
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

	override originalLicenceFormGroup: FormGroup = this.formBuilder.group({
		originalApplicationId: new FormControl(null),
		originalLicenceId: new FormControl(null),
		originalLicenceNumber: new FormControl(null),
		originalExpiryDate: new FormControl(null),
		originalLicenceTermCode: new FormControl(null),
		originalLicenceHolderName: new FormControl(null),
		originalLicenceHolderId: new FormControl(null),
		originalPhotoOfYourselfExpired: new FormControl(false),
	});

	constructor(formBuilder: FormBuilder) {
		super(formBuilder);
	}
}
