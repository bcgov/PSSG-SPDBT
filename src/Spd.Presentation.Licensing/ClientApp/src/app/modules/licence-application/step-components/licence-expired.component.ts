import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-licence-expired',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Do you have an expired licence?"
					subtitle="Processing time will be reduced if you provide info from your past licence"
				></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="hasExpiredLicence">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
								</mat-radio-group>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('hasExpiredLicence')?.dirty || form.get('hasExpiredLicence')?.touched) &&
										form.get('hasExpiredLicence')?.invalid &&
										form.get('hasExpiredLicence')?.hasError('required')
									"
									>This is required</mat-error
								>
							</div>
						</div>

						<div
							class="row mt-4"
							*ngIf="hasExpiredLicence.value == booleanTypeCodes.Yes"
							@showHideTriggerSlideAnimation
						>
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
								<div class="text-minor-heading mb-2">Expired licence information:</div>
								<ng-container>
									<div class="row mt-2">
										<div class="col-lg-6 col-md-12 col-sm-12">
											<mat-form-field>
												<mat-label>Expired Licence Number</mat-label>
												<input
													matInput
													formControlName="expiredLicenceNumber"
													maxlength="20"
													[errorStateMatcher]="matcher"
												/>
												<mat-error *ngIf="form.get('expiredLicenceNumber')?.hasError('required')"
													>This is required</mat-error
												>
											</mat-form-field>
										</div>
										<div class="col-lg-6 col-md-12 col-sm-12">
											<mat-form-field>
												<mat-label>Expiry Date</mat-label>
												<input
													matInput
													[matDatepicker]="picker"
													formControlName="expiryDate"
													[max]="maxDate"
													[errorStateMatcher]="matcher"
												/>
												<mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
												<mat-datepicker #picker startView="multi-year"></mat-datepicker>
												<mat-error *ngIf="form.get('expiryDate')?.hasError('required')">This is required</mat-error>
											</mat-form-field>
										</div>
									</div>
								</ng-container>
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
export class LicenceExpiredComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	maxDate = new Date();
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.licenceApplicationService.expiredLicenceFormGroup;

	constructor(private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get hasExpiredLicence(): FormControl {
		return this.form.get('hasExpiredLicence') as FormControl;
	}
}
