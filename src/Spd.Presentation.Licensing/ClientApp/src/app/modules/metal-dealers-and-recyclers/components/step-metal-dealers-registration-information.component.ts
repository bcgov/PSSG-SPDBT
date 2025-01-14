import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-metal-dealers-registration-information',
	template: `
		<app-step-section title="Registration Information">
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-6 col-lg-8 col-md-12 col-sm-12 mx-auto">
								<form [formGroup]="form" novalidate>
									<mat-radio-group aria-label="Select an option" formControlName="applicationTypeCode">
										<div class="row">
											<div class="col-lg-4">
												<mat-radio-button class="radio-label" [value]="applicationTypeCodes.New">New</mat-radio-button>
											</div>
											<div class="col-lg-8">
												<app-alert type="info" icon="">
													Apply for a new registration if you've never registered before.
												</app-alert>
											</div>
										</div>
										<mat-divider class="mb-3"></mat-divider>
										<div class="row">
											<div class="col-lg-4">
												<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Renewal"
													>Renewal</mat-radio-button
												>
											</div>
											<div class="col-lg-8">
												<app-alert type="info" icon="">
													Renew your existing registration before it expires, within 90 days of the expiry date.
												</app-alert>
											</div>
										</div>
										<mat-divider class="mb-3"></mat-divider>
										<div class="row">
											<div class="col-lg-4">
												<mat-radio-button class="radio-label" [value]="applicationTypeCodes.Update"
													>Update</mat-radio-button
												>
											</div>
											<div class="col-lg-8">
												<app-alert type="info" icon=""> Update registration information. </app-alert>
											</div>
										</div>
									</mat-radio-group>
								</form>
								<mat-error
									class="mat-option-error"
									*ngIf="
										(form.get('applicationTypeCode')?.dirty || form.get('applicationTypeCode')?.touched) &&
										form.get('applicationTypeCode')?.invalid &&
										form.get('applicationTypeCode')?.hasError('required')
									"
									>An option must be selected</mat-error
								>
							</div>
						</div>
						<div class="row" *ngIf="applicationTypeIsRenewalOrUpdate" @showHideTriggerSlideAnimation>
							<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12 mx-auto">
								<mat-divider class="mb-3 mt-4 mat-divider-primary"></mat-divider>
								<div class="text-minor-heading mb-3">Your existing registration number</div>
								<mat-form-field>
									<mat-label>Registration Number</mat-label>
									<input matInput formControlName="registrationNumber" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('registrationNumber')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
						</div>
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
	standalone: false,
})
export class MetalDealersRegistrationInformationComponent implements LicenceChildStepperStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	matcher = new FormErrorStateMatcher();

	form = this.metalDealersApplicationService.registerFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get applicationTypeIsRenewalOrUpdate(): boolean {
		return (
			this.applicationTypeCode.value === ApplicationTypeCode.Update ||
			this.applicationTypeCode.value === ApplicationTypeCode.Renewal
		);
	}

	get applicationTypeCode(): FormControl {
		return this.form.get('applicationTypeCode') as FormControl;
	}
}
