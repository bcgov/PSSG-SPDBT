import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent, UtilService } from '@app/core/services/util.service';

@Component({
	selector: 'app-step-mdra-terms-of-use',
	template: `
		<app-step-section title="Terms and Conditions" subtitle="Read, download, and accept the Terms of Use to continue">
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="offset-xxl-1 col-xxl-10 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<div class="conditions px-3 mb-3" (scroll)="onScrollTermsAndConditions($event)">
							<div class="fs-5 mt-2 mb-3">-- Sarah to provide --</div>
						</div>

						<ng-container *ngIf="displayValidationErrors && !hasScrolledToBottom">
							<div class="alert alert-danger" role="alert">
								Scroll to the bottom of the terms and conditions section to proceed
							</div>
						</ng-container>
					</div>
				</div>

				<div class="row my-2">
					<div class="offset-xxl-1 col-xxl-7 offset-xl-1 col-xl-6 col-lg-7 col-md-12 col-sm-12 mb-2">
						<mat-checkbox formControlName="agreeToTermsAndConditions" (click)="onCheckboxChange()">
							I have read and accept the above Terms of Use.
						</mat-checkbox>
						<mat-error
							class="mat-option-error"
							*ngIf="
								(form.get('agreeToTermsAndConditions')?.dirty || form.get('agreeToTermsAndConditions')?.touched) &&
								form.get('agreeToTermsAndConditions')?.invalid &&
								form.get('agreeToTermsAndConditions')?.hasError('required')
							"
							>This is required</mat-error
						>
					</div>
					<div class="col-xxl-3 col-xl-4 col-lg-5 col-md-12 col-sm-12 mb-2">
						<a
							mat-stroked-button
							color="primary"
							class="large w-100"
							aria-label="Download Terms of Use document"
							download="Security Services Applicant Terms of Use"
							[href]="downloadFilePath"
						>
							<mat-icon>file_download</mat-icon>Terms of Use
						</a>
					</div>
				</div>

				<div class="row">
					<div class="offset-xxl-1 col-xxl-10 offset-xl-1 col-xl-10 col-lg-12 col-md-12 col-sm-12">
						<mat-form-field class="w-auto">
							<mat-label>Date Signed</mat-label>
							<input matInput formControlName="dateSigned" />
							<mat-error *ngIf="form.get('dateSigned')?.hasError('required')">This is required</mat-error>
						</mat-form-field>
					</div>
				</div>
			</form>
		</app-step-section>
	`,
	styles: [
		`
			li {
				margin-bottom: 0.5rem !important;
			}

			.conditions {
				max-height: 400px;
				overflow-y: auto;
			}
		`,
	],
	standalone: false,
})
export class StepMdraTermsOfUseComponent implements LicenceChildStepperStepComponent {
	hasScrolledToBottom = true; // TODO mdra undo false;
	displayValidationErrors = false;

	// bcServicesCardUrl = SPD_CONSTANTS.urls.bcServicesCardUrl;
	// bcGovPrivacyUrl = SPD_CONSTANTS.urls.bcGovPrivacyUrl;
	// bcGovDisclaimerUrl = SPD_CONSTANTS.urls.bcGovDisclaimerUrl;
	downloadFilePath = SPD_CONSTANTS.files.securityServicesApplicantUpdateTerms;

	form = this.metalDealersApplicationService.termsAndConditionsFormGroup;

	constructor(
		private utilService: UtilService,
		private metalDealersApplicationService: MetalDealersApplicationService
	) {}

	// TODO mdra update terms of use

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		this.displayValidationErrors = !this.hasScrolledToBottom;

		return this.form.valid && this.hasScrolledToBottom;
	}

	onScrollTermsAndConditions(e: any) {
		if (e.target.scrollHeight < e.target.scrollTop + e.target.offsetHeight) {
			this.hasScrolledToBottom = true;
			this.setFormValid();
		}
	}

	onCheckboxChange(): void {
		this.setFormValid();
	}

	private setFormValid(): void {
		if (!this.hasScrolledToBottom) {
			return;
		}

		const data = this.form.value;
		if (data.agreeToTermsAndConditions) {
			this.form.controls['dateSigned'].setValue(this.utilService.getDateString(new Date()));
		} else {
			this.form.controls['dateSigned'].setValue('');
		}
	}
}
