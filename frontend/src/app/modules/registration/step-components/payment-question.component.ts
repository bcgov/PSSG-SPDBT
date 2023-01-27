import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegistrationFormStepComponent } from '../registration.component';

export class PaymentQuestionModel {
	checkFeePayer: string = '';
}

@Component({
	selector: 'app-payment-question',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="step">
				<div class="title mb-5">
					Who will pay the criminal record check?
					<div class="title__sub-title mt-2">Each employee criminal record check is $28.00</div>
				</div>
				<div class="row">
					<div class="offset-md-4 col-md-4 col-sm-12">
						<mat-radio-group aria-label="Select an option" formControlName="checkFeePayer">
							<mat-radio-button value="ORGANIZATION"> My organization </mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="APPLICANT"> The applicant </mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="DO_NOT_KNOW"> I don't know </mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button value="DEPENDS_ON_SITUATION"> Depends on situation </mat-radio-button>
						</mat-radio-group>
						<mat-error *ngIf="form.get('checkFeePayer')?.hasError('required')">Required</mat-error>
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
}
