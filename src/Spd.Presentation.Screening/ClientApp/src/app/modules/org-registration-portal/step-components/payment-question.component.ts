import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PayerPreferenceTypeCode } from 'src/app/api/models';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-payment-question',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title
					title="Who will pay the criminal record check?"
					subtitle="Each employee criminal record check is $28. You can make changes to who pays when you register using BCeID."
				></app-step-title>
				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="offset-lg-4 col-lg-4 offset-md-3 col-md-6 col-sm-12">
							<mat-radio-group aria-label="Select an option" formControlName="payerPreference">
								<mat-radio-button [value]="payerPreferenceTypeCodes.Organization"> My organization </mat-radio-button>
								<mat-divider class="my-3"></mat-divider>
								<mat-radio-button [value]="payerPreferenceTypeCodes.Applicant"> The applicant </mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('payerPreference')?.dirty || form.get('payerPreference')?.touched) &&
									form.get('payerPreference')?.invalid &&
									form.get('payerPreference')?.hasError('required')
								"
							>
								An option must be selected
							</mat-error>
						</div>
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class PaymentQuestionComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	payerPreferenceTypeCodes = PayerPreferenceTypeCode;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			payerPreference: new FormControl('', [FormControlValidators.required]),
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
