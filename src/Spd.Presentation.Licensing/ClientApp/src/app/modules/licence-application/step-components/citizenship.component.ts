import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-citizenship',
	template: `
		<div class="step">
			<app-step-title title="Were you born in Canada?"></app-step-title>
			<div class="step-container row">
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="isBornInCanada">
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
export class CitizenshipComponent {
	form: FormGroup = this.formBuilder.group({
		isBornInCanada: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
