import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { RegistrationFormStepComponent } from '../registration.component';

export class FundingQuestionModel {
	operatingBudgetFlag: string = '';
}

@Component({
	selector: 'app-funding-question',
	template: `
		<div class="step">
			<div class="title mb-5">
				2. Does your organization receive at least 50% of its operating budget funding from the B.C. Government?
			</div>
			<div class="row">
				<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
					<mat-radio-group
						class="funding-question__group"
						aria-label="Select an option"
						[(ngModel)]="stepData.operatingBudgetFlag"
						(change)="onDataChange($event)"
					>
						<mat-radio-button value="YES">Yes</mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="NOTSURE">I'm not sure</mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="NO">No</mat-radio-button>
					</mat-radio-group>
				</div>
			</div>
		</div>
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
export class FundingQuestionComponent implements RegistrationFormStepComponent {
	@Input() stepData!: FundingQuestionModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	onDataChange(_val: MatRadioChange) {
		this.stepData.operatingBudgetFlag = _val.value;
		this.formValidity.emit(this.isFormValid());
	}

	getDataToSave(): FundingQuestionModel {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.operatingBudgetFlag ? true : false;
	}
}
