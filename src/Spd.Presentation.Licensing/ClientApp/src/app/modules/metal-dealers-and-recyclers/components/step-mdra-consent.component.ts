import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-mdra-consent',
	template: `
		<app-step-section heading="Consent and Declaration">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-12 py-3 hereby">
								<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
									I HEREBY CERTIFY THAT I have read and understand all portions of this application form. The
									information set out by me in this application is true and correct to the best of my knowledge and
									belief. I have read and understand the Metal Dealers and Recyclers Act and Regulations. I am aware of
									and understand the terms and conditions attached to every registration under the Act, as well as the
									<a
										aria-label="Navigate to Terms and Conditions site"
										href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/00_11022_01#section11"
										target="_blank"
										>terms and conditions</a
									>
									that may be placed on my business’ registration under the Act.
								</mat-checkbox>
								@if (
									(form.get('check1')?.dirty || form.get('check1')?.touched) &&
									form.get('check1')?.invalid &&
									form.get('check1')?.hasError('required')
								) {
									<mat-error class="mat-option-error">This is required</mat-error>
								}
							</div>
						</div>

						<div class="row">
							<div class="col-12 mt-3">
								<mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
									I certify that, to the best of my knowledge, the information I have provided and will provide as
									necessary is complete and accurate.
								</mat-checkbox>
								@if (
									(form.get('agreeToCompleteAndAccurate')?.dirty || form.get('agreeToCompleteAndAccurate')?.touched) &&
									form.get('agreeToCompleteAndAccurate')?.invalid &&
									form.get('agreeToCompleteAndAccurate')?.hasError('required')
								) {
									<mat-error class="mat-option-error">This is required</mat-error>
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

						<div class="row mb-4">
							<div class="col-12">
								<div formGroupName="captchaFormGroup">
									<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
									@if (
										(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
										captchaFormGroup.get('token')?.invalid &&
										captchaFormGroup.get('token')?.hasError('required')
									) {
										<mat-error class="mat-option-error">This is required</mat-error>
									}
								</div>
							</div>
						</div>

						<app-alert type="success" icon="">
							COLLECTION NOTICE: All information regarding this application is collected under the Metal Dealers and
							Recyclers Act and its Regulation and will be used for that purpose. The use and disclosure of this
							information will comply with the Freedom of Information and Protection of Privacy Act and the Federal
							Privacy Act, as applicable. If you have any questions regarding the collection, use or disclosure of this
							information, please contact
							<a
								aria-label="Send email to SPD Compliance"
								href="mailto:SPDCompliance@gov.bc.ca"
								class="email-address-link"
								>SPDCompliance&#64;gov.bc.ca</a
							>.
						</app-alert>
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
export class StepMdraConsentComponent implements LicenceChildStepperStepComponent {
	form: FormGroup = this.metalDealersApplicationService.consentAndDeclarationFormGroup;

	constructor(
		private utilService: UtilService,
		private metalDealersApplicationService: MetalDealersApplicationService
	) {}

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
}
