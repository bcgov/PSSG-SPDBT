import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-metal-dealers-business-information',
	template: `
		<app-step-section title="Business Information">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Legal Business Name</mat-label>
									<input matInput formControlName="legalBusinessName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('legalBusinessName')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>
							<div class="col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Trade Name or "doing business as" Name</mat-label>
									<input matInput formControlName="tradeName" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('tradeName')?.hasError('required')"> This is required </mat-error>
								</mat-form-field>
							</div>

							<mat-divider class="mb-4 mt-3 mat-divider-primary"></mat-divider>

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
									<input
										matInput
										formControlName="phoneNumber"
										[errorStateMatcher]="matcher"
										[mask]="phoneMask"
										[showMaskTyped]="true"
									/>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('required')">This is required</mat-error>
									<mat-error *ngIf="form.get('phoneNumber')?.hasError('mask')">This must be 10 digits</mat-error>
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
export class StepMetalDealersBusinessInformationComponent {
	matcher = new FormErrorStateMatcher();

	phoneMask = SPD_CONSTANTS.phone.displayMask;

	form = this.metalDealersApplicationService.businessOwnerFormGroup;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get givenName(): FormControl {
		return this.form.get('givenName') as FormControl;
	}
	get middleName1(): FormControl {
		return this.form.get('middleName1') as FormControl;
	}
	get middleName2(): FormControl {
		return this.form.get('middleName2') as FormControl;
	}
	get surname(): FormControl {
		return this.form.get('surname') as FormControl;
	}
	get emailAddress(): FormControl {
		return this.form.get('emailAddress') as FormControl;
	}
	get phoneNumber(): FormControl {
		return this.form.get('phoneNumber') as FormControl;
	}
}
