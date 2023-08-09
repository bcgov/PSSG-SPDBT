import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-sole-proprietor',
	template: `
		<div class="step">
			<app-step-title
				title="Do you also want to apply for a Sole Proprietor Security Business Licence?"
				subtitle="If you are a Sole Proprietor and need both a worker licence and a business licence, you can apply for them at the same time and pay only for the business licence."
			></app-step-title>
			<div class="step-container row">
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="isSoleProprietor">
							<mat-radio-button class="radio-label" value="a">Yes</mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button class="radio-label" value="b">No</mat-radio-button>
						</mat-radio-group>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class SoleProprietorComponent {
	form: FormGroup = this.formBuilder.group({
		isSoleProprietor: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
