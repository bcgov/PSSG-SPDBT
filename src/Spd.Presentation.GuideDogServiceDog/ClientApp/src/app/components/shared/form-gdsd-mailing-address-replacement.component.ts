import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';

@Component({
	selector: 'app-form-gdsd-mailing-address-replacement',
	template: `
		<div class="row">
			<div class="col-md-8 col-sm-12 mx-auto">
				<app-form-address [form]="form" [isWideView]="true"></app-form-address>
			</div>
		</div>

		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
					<app-form-gdsd-collection-notice></app-form-gdsd-collection-notice>

					<div formGroupName="captchaFormGroup" *ngIf="displayCaptcha.value">
						<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
								captchaFormGroup.get('token')?.invalid &&
								captchaFormGroup.get('token')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
	standalone: false,
})
export class FormGdsdMailingAddressReplacementComponent implements LicenceChildStepperStepComponent {
	@Input() form!: FormGroup;

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
	get displayCaptcha(): FormControl {
		return this.form.get('captchaFormGroup')?.get('displayCaptcha') as FormControl;
	}
}
