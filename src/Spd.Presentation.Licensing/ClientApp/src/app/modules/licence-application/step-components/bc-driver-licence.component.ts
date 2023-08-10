import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-bc-driver-licence',
	template: `
		<div class="step">
			<app-step-title
				title="Do you have a BC Driver's Licence?"
				subtitle="Providing your driver's licence number will speed up processing times"
			></app-step-title>
			<div class="step-container">
				<div class="row">
					<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<form [formGroup]="form" novalidate>
							<mat-radio-group aria-label="Select an option" formControlName="hasBcDriversLicence">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
						</form>
					</div>
				</div>

				<div class="row mt-4" *ngIf="hasBcDriversLicence.value == booleanTypeCodes.Yes">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-divider class="mb-3" style="border-top-color: var(--color-primary-light);"></mat-divider>
						<div class="row mt-2">
							<div class="col-lg-6 col-md-12 col-sm-12">
								<mat-form-field>
									<mat-label>BC Drivers Licence Number</mat-label>
									<input matInput formControlName="bcDriversLicenceNumber" mask="00000009" />
									<mat-error *ngIf="form.get('bcDriversLicenceNumber')?.hasError('mask')">
										This must be 7 or 8 digits
									</mat-error>
								</mat-form-field>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class BcDriverLicenceComponent {
	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl(''),
		bcDriversLicenceNumber: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}

	get hasBcDriversLicence(): FormControl {
		return this.form.get('hasBcDriversLicence') as FormControl;
	}
}
