import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';

@Component({
	selector: 'app-step-bc-driver-licence',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Do you have a BC Driver's Licence?"
					subtitle="Providing your driver's licence number will speed up processing times"
				></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="hasBcDriversLicence">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('hasBcDriversLicence')?.dirty || form.get('hasBcDriversLicence')?.touched) &&
										form.get('hasBcDriversLicence')?.invalid &&
										form.get('hasBcDriversLicence')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div
							class="row mt-4"
							*ngIf="hasBcDriversLicence.value === booleanTypeCodes.Yes"
							@showHideTriggerSlideAnimation
						>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
								<div class="row mt-2">
									<div class="col-lg-6 col-md-12 col-sm-12 mx-auto">
										<div class="text-minor-heading mb-2">BC driver's licence information:</div>
										<mat-form-field>
											<mat-label>BC Drivers Licence <span class="optional-label">(optional)</span></mat-label>
											<input matInput formControlName="bcDriversLicenceNumber" mask="00000009" />
											<mat-error *ngIf="form.get('bcDriversLicenceNumber')?.hasError('mask')">
												This must be 7 or 8 digits
											</mat-error>
										</mat-form-field>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepBcDriverLicenceComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.bcDriversLicenceFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get hasBcDriversLicence(): FormControl {
		return this.form.get('hasBcDriversLicence') as FormControl;
	}
}
