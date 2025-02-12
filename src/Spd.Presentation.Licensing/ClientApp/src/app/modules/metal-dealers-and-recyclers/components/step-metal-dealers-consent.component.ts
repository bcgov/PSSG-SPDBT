import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-metal-dealers-consent',
	template: `
		<app-step-section title="Consent and Declaration">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-12 py-3 hereby">
								<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
									I HEREBY CERTIFY THAT I have read and understand all portions of this application form. The
									information set out by me in this application is true and correct to the best of my knowledge and
									belief. I have read and understand the Metal Dealers and Recyclers Act and Regulations and I am aware
									of and understand the
									<a
										aria-label="Navigate to Terms and Conditions site"
										href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/00_11022_01#section11"
										target="_blank"
										>terms and conditions</a
									>
									of registration and the conditions that may be placed on me as a registered business under the Act.
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('check1')?.dirty || form.get('check1')?.touched) &&
										form.get('check1')?.invalid &&
										form.get('check1')?.hasError('required')
									"
									>This is required
								</mat-error>
							</div>
						</div>

						<div class="row">
							<div class="col-12 mt-3">
								<mat-checkbox formControlName="agreeToCompleteAndAccurate" (click)="onCheckboxChange()">
									Declaration & Sign Off
								</mat-checkbox>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('agreeToCompleteAndAccurate')?.dirty ||
											form.get('agreeToCompleteAndAccurate')?.touched) &&
										form.get('agreeToCompleteAndAccurate')?.invalid &&
										form.get('agreeToCompleteAndAccurate')?.hasError('required')
									"
								>
									This is required
								</mat-error>
							</div>
						</div>

						<div class="row mt-4">
							<div class="col-12">
								<mat-form-field class="w-auto">
									<mat-label>Date Signed</mat-label>
									<input matInput formControlName="dateSigned" />
									<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>

						<div class="row mb-4">
							<div class="col-12">
								<div formGroupName="captchaFormGroup">
									<app-captcha-v2 [captchaFormGroup]="captchaFormGroup"></app-captcha-v2>
									<mat-error
										class="mat-option-error"
										*ngIf="
											(captchaFormGroup.get('token')?.dirty || captchaFormGroup.get('token')?.touched) &&
											captchaFormGroup.get('token')?.invalid &&
											captchaFormGroup.get('token')?.hasError('required')
										"
										>This is required
									</mat-error>
								</div>
							</div>
						</div>

						<app-collection-notice [collectionNoticeActName]="collectionNoticeActName"></app-collection-notice>
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
export class StepMetalDealersConsentComponent implements LicenceChildStepperStepComponent {
	collectionNoticeActName = 'Metal Dealers and Recyclers Act';

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
