import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { RegistrationFormStepComponent } from '../registration.component';

export class ScreeningsQuestionModel {
	screeningsCount: string = '';
}

@Component({
	selector: 'app-screenings-question',
	template: `
		<div class="step">
			<div class="title mb-5">How many screenings do you anticipate your organization requesting per year?</div>
			<div class="row">
				<div class="offset-md-4 col-md-4 col-sm-12">
					<mat-radio-group
						aria-label="Select an option"
						[(ngModel)]="stepData.screeningsCount"
						(change)="onDataChange($event)"
					>
						<mat-radio-button value="LESS_THAN_100"> 0 - 100 </mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="100_TO_500"> 100 - 500 </mat-radio-button>
						<mat-divider class="my-3"></mat-divider>
						<mat-radio-button value="MORE_THAN_500"> More than 500 </mat-radio-button>
					</mat-radio-group>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class ScreeningsQuestionComponent implements RegistrationFormStepComponent {
	@Input() stepData!: ScreeningsQuestionModel;
	@Output() formValidity: EventEmitter<boolean> = new EventEmitter<boolean>();

	onDataChange(data: MatRadioChange) {
		this.stepData.screeningsCount = data.value;
		this.formValidity.emit(this.isFormValid());
	}

	getDataToSave(): any {
		return this.stepData;
	}

	isFormValid(): boolean {
		return this.stepData.screeningsCount ? true : false;
	}
}
