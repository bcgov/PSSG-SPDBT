import { Component } from '@angular/core';
import { BooleanTypeCode } from 'src/app/api/models';
import { RegistrationFormStepComponent } from '../org-registration.component';

@Component({
	selector: 'app-compensation-question',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title
					title="Do volunteers with your organization get any money for volunteering?"
					subtitle="This includes honorarium payments. It does not include gifts, gift cards, or meals."
				></app-step-title>
				<div class="row">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<mat-radio-group aria-label="Select an option" [(ngModel)]="employeeMonetaryCompensationFlag">
							<mat-radio-button [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-divider class="my-3"></mat-divider>
							<mat-radio-button [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</mat-radio-group>
						<mat-error class="mat-option-error" style="text-align: center;" *ngIf="isDirtyAndInvalid">
							An option must be selected
						</mat-error>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class CompensationQuestionComponent implements RegistrationFormStepComponent {
	employeeMonetaryCompensationFlag: BooleanTypeCode | null = null;
	isDirtyAndInvalid = false;

	booleanTypeCodes = BooleanTypeCode;

	getDataToSave(): any {
		return { employeeMonetaryCompensationFlag: this.employeeMonetaryCompensationFlag };
	}

	isFormValid(): boolean {
		const isValid = this.employeeMonetaryCompensationFlag != null;
		this.isDirtyAndInvalid = !isValid;
		return isValid;
	}

	clearCurrentData(): void {
		this.employeeMonetaryCompensationFlag = null;
	}
}
