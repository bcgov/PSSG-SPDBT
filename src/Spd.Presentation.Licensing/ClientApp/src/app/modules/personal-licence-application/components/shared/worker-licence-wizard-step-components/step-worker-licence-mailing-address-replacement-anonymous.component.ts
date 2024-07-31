import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { LicenceApplicationService } from '@app/modules/personal-licence-application/licence-application.service';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-step-worker-licence-mailing-address-replacement-anonymous',
	template: `
		<app-step-section [title]="title" [subtitle]="subtitle">
			<app-address [form]="form"></app-address>

			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12">
						<app-collection-notice></app-collection-notice>

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
		</app-step-section>
	`,
	styles: [],
})
export class StepWorkerLicenceMailingAddressReplacementAnonymousComponent
	implements OnInit, LicenceChildStepperStepComponent
{
	form: FormGroup = this.licenceApplicationService.mailingAddressFormGroup;
	title = 'Review your mailing address';
	subtitle = 'Ensure your mailing address is correct before submitting your application';

	constructor(
		private licenceApplicationService: LicenceApplicationService,
		private authProcessService: AuthProcessService
	) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			this.captchaFormGroup.patchValue({ displayCaptcha: !isLoggedIn });
		});
	}

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
