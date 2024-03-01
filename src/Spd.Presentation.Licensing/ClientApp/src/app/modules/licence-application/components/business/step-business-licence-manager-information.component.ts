import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-manager-information',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Provide contact information"
					subtitle="We require contact information for your company's business manager, who will be responsible for day-to-day supervision of licensed security employees in B.C. in accordance with section 14(2) of the <i>Security Services Act</i>"
				></app-step-title>
			</div>

			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="text-minor-heading mb-2">Business manager information</div>
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Given Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="givenName" [errorStateMatcher]="matcher" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Middle Name 1 <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName1" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Middle Name 2 <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName2" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Surname</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Email Address</mat-label>
									<input
										matInput
										formControlName="emailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									<mat-error *ngIf="form.get('emailAddress')?.hasError('required')"> This is required </mat-error>
									<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
										Must be a valid email address
									</mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Phone Number</mat-label>
									<input matInput formControlName="phoneNumber" [errorStateMatcher]="matcher" [mask]="phoneMask" />
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')"> This must be 10 digits </mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-checkbox formControlName="isBusinessManager"> I am the business manager </mat-checkbox>
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class StepBusinessLicenceManagerInformationComponent implements LicenceChildStepperStepComponent {
	phoneMask = SPD_CONSTANTS.phone.displayMask;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.businessApplicationService.businessManagerFormGroup;

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}
}
