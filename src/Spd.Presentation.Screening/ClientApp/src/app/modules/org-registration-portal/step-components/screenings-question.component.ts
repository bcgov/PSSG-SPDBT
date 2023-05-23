import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ScreeningsCountTypeCode } from 'src/app/api/models';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-screenings-question',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<app-step-title
					title="How many criminal record checks do you anticipate your organization requesting per year?"
				></app-step-title>
				<div class="row">
					<div class="offset-lg-4 col-lg-4 offset-md-3 col-md-6 col-sm-12">
						<mat-radio-group aria-label="Select an option" formControlName="screeningsCount">
							<mat-radio-button [value]="screeningsCountTypeCodes.LessThanOneHundred"> 0 - 100 </mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button [value]="screeningsCountTypeCodes.OneToFiveHundred"> 100 - 500 </mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button [value]="screeningsCountTypeCodes.MoreThanFiveHundred">
								More than 500
							</mat-radio-button>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('screeningsCount')?.dirty || form.get('screeningsCount')?.touched) &&
									form.get('screeningsCount')?.invalid &&
									form.get('screeningsCount')?.hasError('required')
								"
								>An option must be selected</mat-error
							>
						</mat-radio-group>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class ScreeningsQuestionComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	screeningsCountTypeCodes = ScreeningsCountTypeCode;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			screeningsCount: new FormControl('', [Validators.required]),
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
