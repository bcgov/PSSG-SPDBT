import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-mdra-business-manager',
	template: `
		<app-step-section
			title="Business Manager"
			subtitle="The business manager is the person responsible for the day to day management of the business."
		>
			<div class="row">
				<div class="col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Given Name</mat-label>
									<input matInput formControlName="givenName" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Middle Name <span class="optional-label">(optional)</span></mat-label>
									<input matInput formControlName="middleName" maxlength="40" />
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Surname</mat-label>
									<input matInput formControlName="surname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('surname')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Phone Number</mat-label>
									<input
										matInput
										formControlName="phoneNumber"
										[mask]="phoneMask"
										[showMaskTyped]="false"
										[errorStateMatcher]="matcher"
									/>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
								</mat-form-field>
							</div>

							<div class="col-xl-4 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Email Address <span class="optional-label">(if any)</span></mat-label>
									<input
										matInput
										formControlName="emailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									<mat-error *ngIf="form.get('emailAddress')?.hasError('email')">
										Must be a valid email address
									</mat-error>
								</mat-form-field>
							</div>
						</div>
					</form>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepMdraBusinessManagerComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form = this.metalDealersApplicationService.businessManagerFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}
}
