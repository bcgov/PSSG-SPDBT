import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from '@app/api/models';
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

	constructor(
		protected formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected formatDatePipe: FormatDatePipe
	) {}
}
