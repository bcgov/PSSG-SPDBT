import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-rd-consent',
	template: `
		<app-step-section heading="Acknowledgement">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-12 py-3 hereby">
								I certify that the information I have provided is true and correct to the best of my knowledge and
								belief. I understand that inaccurate, misleading, missing or false information may lead to refusal or
								cancellation of my retired guide or service dog team certificate. I agree to adhere to any terms and
								conditions of certification.
							</div>
						</div>

						<div class="col-xl-6 col-lg-6 col-md-12 mt-4">
							<mat-form-field>
								<mat-label>Name of Applicant or Legal Guardian</mat-label>
								<input
									matInput
									formControlName="applicantOrLegalGuardianName"
									maxlength="80"
									[errorStateMatcher]="matcher"
								/>
								@if (form.get('applicantOrLegalGuardianName')?.hasError('required')) {
									<mat-error>This is required</mat-error>
								}
							</mat-form-field>
						</div>

						<div class="row">
							<div class="col-12 mt-3">
								<mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
									Declaration & Sign Off
								</mat-checkbox>
								@if (
									(form.get('agreeToCompleteAndAccurate')?.dirty || form.get('agreeToCompleteAndAccurate')?.touched) &&
									form.get('agreeToCompleteAndAccurate')?.invalid &&
									form.get('agreeToCompleteAndAccurate')?.hasError('required')
								) {
									<mat-error>This is required</mat-error>
								}
							</div>
						</div>

						<div class="row mt-4">
							<div class="col-12">
								<mat-form-field class="w-auto">
									<mat-label>Date Signed</mat-label>
									<input matInput formControlName="dateSigned" />
									@if (form.get('dateSigned')?.hasError('required')) {
										<mat-error>This is required</mat-error>
									}
								</mat-form-field>
							</div>
						</div>

						@if (displayCaptcha.value) {
							<div class="row mb-4">
								<div class="col-12">
									<div formGroupName="captchaFormGroup">
										<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
										@if (
											(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
											captchaFormGroup.get('token')?.invalid &&
											captchaFormGroup.get('token')?.hasError('required')
										) {
											<mat-error>Click this button to verify that you are not a robot</mat-error>
										}
									</div>
								</div>
							</div>
						}

						<app-form-gdsd-collection-notice></app-form-gdsd-collection-notice>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [
		`
			.hereby {
				background-color: #f6f6f6 !important;
			}
		`,
	],
	standalone: false,
})
export class StepRdConsentComponent implements OnInit, LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.retiredDogApplicationService.consentAndDeclarationFormGroup;

	constructor(
		private utilService: UtilService,
		private authProcessService: AuthProcessService,
		private retiredDogApplicationService: RetiredDogApplicationService
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

	onCheckboxChange(): void {
		const data = this.form.value;
		if (data.agreeToCompleteAndAccurate) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}

	get captchaFormGroup(): FormGroup {
		return this.form.get('captchaFormGroup') as FormGroup;
	}
	get displayCaptcha(): FormControl {
		return this.form.get('captchaFormGroup')?.get('displayCaptcha') as FormControl;
	}
}
