import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { FormControlValidators } from '../validators/form-control.validators';
import { CommonApplicationHelper } from './common-application.helper';

export abstract class GdsdApplicationHelper extends CommonApplicationHelper {
	gdsdPersonalInformationFormGroup: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl(''),
			middleName: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			dateOfBirth: new FormControl('', [Validators.required]),
			phoneNumber: new FormControl('', [Validators.required]),
			emailAddress: new FormControl(''),
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

	governmentPhotoIdFormGroup: FormGroup = this.formBuilder.group({
		photoTypeCode: new FormControl('', [Validators.required]),
		expiryDate: new FormControl(''),
		attachments: new FormControl([], [Validators.required]),
	});

	dogTrainingInformationFormGroup: FormGroup = this.formBuilder.group({
		isAccredited: new FormControl('', [Validators.required]),
		dogTrainingTypeCode: new FormControl('', [Validators.required]),
	});

	dogInformationFormGroup: FormGroup = this.formBuilder.group({
		dogName: new FormControl('', [Validators.required]),
		dateOfBirth: new FormControl('', [Validators.required]),
		breed: new FormControl('', [Validators.required]),
		colourAndMarkings: new FormControl('', [Validators.required]),
		genderCode: new FormControl('', [Validators.required]),
		microchipNumber: new FormControl(''),
	});

	accreditedGraduationFormGroup: FormGroup = this.formBuilder.group({
		schoolName: new FormControl('', [Validators.required]),
		contactGivenName: new FormControl(''),
		contactSurname: new FormControl('', [FormControlValidators.required]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
		contactEmailAddress: new FormControl('', [Validators.required]),
		attachments: new FormControl([], [Validators.required]),
	});

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
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

	constructor(
		formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected formatDatePipe: FormatDatePipe,
		protected utilService: UtilService,
		protected fileUtilService: FileUtilService
	) {
		super(formBuilder);
	}
}
