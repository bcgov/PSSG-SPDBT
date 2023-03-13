import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-compensation-question',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<app-step-title
					title="Do volunteers with your organization get any money for volunteering?"
					subtitle="This includes honorarium payments. It does not include gifts, gift cards, or meals."
				></app-step-title>
				<div class="row">
					<div class="offset-md-4 col-md-4 col-sm-12">
						<mat-radio-group aria-label="Select an option" formControlName="employeeMonetaryCompensationFlag">
							<mat-radio-button [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						<mat-error
							*ngIf="
								(form.get('employeeMonetaryCompensationFlag')?.dirty ||
									form.get('employeeMonetaryCompensationFlag')?.touched) &&
								form.get('employeeMonetaryCompensationFlag')?.invalid &&
								form.get('employeeMonetaryCompensationFlag')?.hasError('required')
							"
							>An option must be selected</mat-error
						>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class CompensationQuestionComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	booleanTypeCodes = BooleanTypeCode;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			employeeMonetaryCompensationFlag: new FormControl('', [Validators.required]),
		});
	}

	getDataToSave(): any {
		return this.form.value;
	}

	isFormValid(): boolean {
		return this.form.valid;
	}

	clearCurrentData(): void {
		this.form.reset();
	}
}
