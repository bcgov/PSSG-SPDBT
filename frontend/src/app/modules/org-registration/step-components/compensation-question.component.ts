import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-compensation-question',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="title mb-5">
					Do volunteers with your organization get any money for volunteering?
					<div class="title__sub-title mt-2">
						This includes honorarium payments. It does not include gifts, gift cards, or meals.
					</div>
				</div>
				<div class="row">
					<div class="offset-md-2 col-md-8 col-sm-12">
						<mat-radio-group aria-label="Select an option" formControlName="employeeMonetaryCompensationFlag">
							<mat-radio-button value="NO">
								<strong>No</strong>, volunteers do not receive monetary compensation in relation to the services or the
								time spent providing volunteer services
							</mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="YES">
								<strong>Yes</strong>, volunteers receive a form of monetary compensation in relation to the services
								and/or the time spent providing volunteer services
							</mat-radio-button>
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
