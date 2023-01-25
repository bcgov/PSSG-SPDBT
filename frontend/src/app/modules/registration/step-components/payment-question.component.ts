import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { RegistrationFormStepComponent } from '../registration.component';

export class PaymentQuestionModel {
	checkFeePayer: string = '';
}

@Component({
	selector: 'app-payment-question',
	template: `
		<div class="step">
			<div class="title mb-5">
				Who will pay the criminal record check?
				<div class="title__sub-title mt-2">Each employee criminal record check is $28.00</div>
			</div>
			<div class="row">
				<div class="offset-md-4 col-md-4 col-sm-12">
					<mat-radio-group
						aria-label="Select an option"
						[(ngModel)]="stepData.checkFeePayer"
						(change)="onDataChange($event)"
					>
						<mat-radio-button value="ORGANIZATION"> My organization </mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="APPLICANT"> The applicant </mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="DO_NOT_KNOW"> I don't know </mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="DEPENDS_ON_SITUATION"> Depends on situation </mat-radio-button>
					</mat-radio-group>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class PaymentQuestionComponent implements RegistrationFormStepComponent {
	@Input() stepData!: PaymentQuestionModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	onDataChange(data: MatRadioChange) {
		this.stepData.checkFeePayer = data.value;
		this.formValidity.emit(this.isFormValid());
	}

	getDataToSave(): any {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.checkFeePayer ? true : false;
	}
}
