import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { RegistrationFormStepComponent } from '../registration.component';

export class CompensationQuestionModel {
	employeeMonetaryCompensationFlag: string = '';
}

@Component({
	selector: 'app-compensation-question',
	template: `
		<div class="step">
			<div class="title mb-5">
				Do volunteers with your organization get any money for volunteering?
				<div class="title__sub-title mt-2">
					This includes honorarium payments. It does not include gifts, gift cards, or meals.
				</div>
			</div>
			<div class="row">
				<div class="offset-md-2 col-md-8 col-sm-12">
					<mat-radio-group
						aria-label="Select an option"
						[(ngModel)]="stepData.employeeMonetaryCompensationFlag"
						(change)="onDataChange($event)"
					>
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
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class CompensationQuestionComponent implements RegistrationFormStepComponent {
	@Input() stepData!: CompensationQuestionModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	onDataChange(_val: MatRadioChange) {
		this.stepData.employeeMonetaryCompensationFlag = _val.value;
		this.formValidity.emit(this.isFormValid());
	}

	getDataToSave(): any {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.employeeMonetaryCompensationFlag ? true : false;
	}
}
