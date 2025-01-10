import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-metal-dealers-consent',
	template: `
		<app-step-section title="Consent and Declaration">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xxl-9 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-12">
								<mat-checkbox formControlName="check1" (click)="onCheckboxChange()">
									I HEREBY CERTIFY THAT I have read and understand all portions of this application form. The
									information set out by me in this application is true and correct to the best of my knowledge and
									belief. I have read and understand the Metal Dealers and Recyclers Act and Regulations and I am aware
									of and understand the terms and conditions of registration and the conditions that may be placed on me
									as a registered business under the Act.
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
							<div class="col-12 mt-4">
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
	styles: [],
	standalone: false,
})
export class StepMetalDealersConsentComponent {
	collectionNoticeActName = '';
	collectionNoticeActNameWithAbbrev = '';
	check3Name = '';
	check1Name = '';

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
