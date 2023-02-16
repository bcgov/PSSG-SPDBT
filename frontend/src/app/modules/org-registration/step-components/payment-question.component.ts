import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-payment-question',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="title mb-5">
					Who will pay the criminal record check?
					<div class="title__sub-title mt-2">
						Each employee criminal record check is $28. You can adjust who pays once you're registered in the
						organization portal.
					</div>
				</div>
				<div class="row">
					<div class="offset-md-4 col-md-4 col-sm-12">
						<mat-radio-group aria-label="Select an option" formControlName="checkFeePayer">
							<mat-radio-button value="ORGANIZATION"> My organization </mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="APPLICANT"> The applicant </mat-radio-button>
						</mat-radio-group>
						<mat-error *ngIf="form.get('checkFeePayer')?.hasError('required')">An option must be selected</mat-error>
					</div>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class PaymentQuestionComponent implements OnInit, RegistrationFormStepComponent {
	form!: FormGroup;

	constructor(private formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			checkFeePayer: new FormControl('', [Validators.required]),
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
