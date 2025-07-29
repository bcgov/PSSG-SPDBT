import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepDtTrainingSchoolCeoComponent } from './step-dt-training-school-ceo.component';
import { StepDtTrainingSchoolInfoComponent } from './step-dt-training-school-info.component';
import { StepDtTrainingSchoolVerificationComponent } from './step-dt-training-school-verification.component';

@Component({
	selector: 'app-steps-dt-training-school-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-dt-training-school-info
					[applicationTypeCode]="applicationTypeCode"
				></app-step-dt-training-school-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_SCHOOL_TRAINING)"
					(nextReviewStepperStep)="onNextReview(STEP_SCHOOL_TRAINING)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-dt-training-school-ceo [applicationTypeCode]="applicationTypeCode"></app-step-dt-training-school-ceo>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_SCHOOL_TRAINING_CEO)"
					(nextReviewStepperStep)="onNextReview(STEP_SCHOOL_TRAINING_CEO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-dt-training-school-verification></app-step-dt-training-school-verification>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_SCHOOL_TRAINING_VERIFICATION)"
					(nextReviewStepperStep)="onNextReview(STEP_SCHOOL_TRAINING_VERIFICATION)"
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
	readonly STEP_SCHOOL_TRAINING_CEO = 1;
	readonly STEP_SCHOOL_TRAINING_VERIFICATION = 2;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepDtTrainingSchoolInfoComponent) schoolComponent!: StepDtTrainingSchoolInfoComponent;
	@ViewChild(StepDtTrainingSchoolCeoComponent) schoolCeoComponent!: StepDtTrainingSchoolCeoComponent;
	@ViewChild(StepDtTrainingSchoolVerificationComponent)
	schoolVerifyComponent!: StepDtTrainingSchoolVerificationComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_SCHOOL_TRAINING:
				return this.schoolComponent.isFormValid();
			case this.STEP_SCHOOL_TRAINING_CEO:
				return this.schoolCeoComponent.isFormValid();
			case this.STEP_SCHOOL_TRAINING_VERIFICATION:
				return this.schoolVerifyComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
