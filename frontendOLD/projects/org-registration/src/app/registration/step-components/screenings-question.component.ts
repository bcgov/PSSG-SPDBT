import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormStepComponent } from '../registration.component';

@Component({
	selector: 'app-screenings-question',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="row">
					<div class="col-md-8 col-sm-12 mx-auto">
						<div class="title mb-5">How many screenings do you anticipate your organization requesting per year?</div>
					</div>
				</div>
				<div class="row">
					<div class="offset-md-4 col-md-4 col-sm-12">
						<mat-radio-group aria-label="Select an option" formControlName="screeningsCount">
							<mat-radio-button value="LESS_THAN_100"> 0 - 100 </mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="100_TO_500"> 100 - 500 </mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="MORE_THAN_500"> More than 500 </mat-radio-button>
							<mat-error
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
