import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-criminal-history',
	template: `
		<div class="step">
			<app-step-title title="Do you have criminal history to declare?"></app-step-title>
			<div class="step-container row">
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate>
						<mat-radio-group aria-label="Select an option" formControlName="hasCriminalHistory">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-divider class="my-2"></mat-divider>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
					</form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class CriminalHistoryComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.formBuilder.group({
		hasCriminalHistory: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
