import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-bc-driver-licence',
	template: `
		<div class="step">
			<app-step-title
				title="Do you have a BC Driver's Licence?"
				subtitle="Providing your driver's licence number will speed up processing times"
			></app-step-title>
			<div class="step-container row">
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="hasBcDriversLicence">
							<mat-radio-button class="radio-label" value="a">No</mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button class="radio-label" value="a">Yes</mat-radio-button>
						</mat-radio-group>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class BcDriverLicenceComponent {
	form: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
