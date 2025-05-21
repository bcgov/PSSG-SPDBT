import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepDtTrainingSchoolInfoComponent } from './step-dt-training-school-info.component';

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
					(nextStepperStep)="onStepNext(STEP_SCHOOL_TRAINING)"
					(nextReviewStepperStep)="onNextReview(STEP_SCHOOL_TRAINING)"
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

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepDtTrainingSchoolInfoComponent) schoolComponent!: StepDtTrainingSchoolInfoComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_SCHOOL_TRAINING:
				return this.schoolComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
