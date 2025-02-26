import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepDtTrainingSchoolInfoComponent } from '../../anonymous/step-dt-training-school-info.component';
import { StepDtTrainingSchoolMailingAddressComponent } from '../../anonymous/step-dt-training-school-mailing-address.component';

@Component({
	selector: 'app-steps-dt-training-school-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-dt-training-school-info></app-step-dt-training-school-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_SCHOOL_TRAINING)"
					(nextReviewStepperStep)="onNextReview(STEP_SCHOOL_TRAINING)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-dt-training-school-mailing-address
					[applicationTypeCode]="applicationTypeCode"
				></app-step-dt-training-school-mailing-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_MAILING_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_MAILING_ADDRESS)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsDtTrainingSchoolInfoComponent extends BaseWizardStepComponent {
	readonly STEP_SCHOOL_TRAINING = 0;
	readonly STEP_MAILING_ADDRESS = 1;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepDtTrainingSchoolInfoComponent) schoolComponent!: StepDtTrainingSchoolInfoComponent;
	@ViewChild(StepDtTrainingSchoolMailingAddressComponent)
	addressComponent!: StepDtTrainingSchoolMailingAddressComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_SCHOOL_TRAINING:
				return this.schoolComponent.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				return this.addressComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
