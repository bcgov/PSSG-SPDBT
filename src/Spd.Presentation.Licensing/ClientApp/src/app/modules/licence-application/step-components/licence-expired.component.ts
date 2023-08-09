import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-licence-expired',
	template: `
		<div class="step">
			<app-step-title
				title="Do you have an expired licence?"
				subtitle="Processing time will be reduced if you provide info from your past licence"
			></app-step-title>
			<div class="step-container">
				<div class="row">
					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="hasExpiredLicence">
								<mat-radio-button class="radio-label" value="a">No</mat-radio-button>
								<mat-divider class="my-3"></mat-divider>
								<mat-radio-button class="radio-label" value="b">Yes</mat-radio-button>
							</mat-radio-group>
						</form>
					</div>
				</div>

				<div class="row mt-4">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-divider class="mb-3" style="border-top-color: var(--color-primary-light);"></mat-divider>
						<div class="text-minor-heading fw-semibold mb-2">Expired Licence Information</div>
						<ng-container>
							<div class="row mt-2">
								<div class="col-lg-4 col-md-12 col-sm-12">
									<mat-form-field>
										<mat-label>Expired licence number</mat-label>
										<input matInput formControlName="expiredLicenceNumber" [errorStateMatcher]="matcher" />
										<mat-error *ngIf="form.get('expiredLicenceNumber')?.hasError('required')"
											>This is required</mat-error
										>
									</mat-form-field>
								</div>
								<div class="col-lg-4 col-md-12 col-sm-12">
									<mat-form-field>
										<mat-label>Expired licence term</mat-label>
										<input matInput formControlName="expiredLicenceTerm" [errorStateMatcher]="matcher" />
										<mat-error *ngIf="form.get('expiredLicenceTerm')?.hasError('required')">
											This is required
										</mat-error>
									</mat-form-field>
								</div>
								<div class="col-lg-4 col-md-12 col-sm-12">
									<mat-form-field>
										<mat-label>Expiry date</mat-label>
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
			</div>
		</div>
	`,
	styles: [],
})
export class LicenceExpiredComponent {
	maxDate = new Date();
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		hasExpiredLicence: new FormControl(''),
		expiredLicenceNumber: new FormControl(''),
		expiredLicenceTerm: new FormControl(''),
		expiryDate: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
