import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-police-background',
	template: `
		<div class="step">
			<app-step-title
				title="Are you currently a Police Officer or Peace Officer?"
				subtitle="A member of a police force as defined in the British Columbia Police Act may not hold a security worker licence."
			></app-step-title>
			<div class="step-container row">
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="isPoliceOrPeaceOfficer">
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
export class PoliceBackgroundComponent {
	form: FormGroup = this.formBuilder.group({
		isPoliceOrPeaceOfficer: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
