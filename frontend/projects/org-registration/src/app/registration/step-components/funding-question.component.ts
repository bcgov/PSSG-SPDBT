import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormStepComponent } from '../registration.component';

@Component({
	selector: 'app-funding-question',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="title mb-5">
					Does your organization receive at least 50% of its operating budget funding from the B.C. Government?
				</div>
				<div class="row">
					<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
						<mat-radio-group
							class="funding-question__group"
							aria-label="Select an option"
							formControlName="operatingBudgetFlag"
						>
							<mat-radio-button value="YES">Yes</mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="NOTSURE">I'm not sure</mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="NO">No</mat-radio-button>
						</mat-radio-group>
						<mat-error
							*ngIf="
								(form.get('operatingBudgetFlag')?.dirty || form.get('operatingBudgetFlag')?.touched) &&
								form.get('operatingBudgetFlag')?.invalid &&
								form.get('operatingBudgetFlag')?.hasError('required')
							"
							>An option must be selected</mat-error
						>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [
		`
			.funding-question {
				%__group {
					text-align: left;
				}
			}
		`,
	],
})
export class FundingQuestionComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			operatingBudgetFlag: new FormControl('', [Validators.required]),
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
