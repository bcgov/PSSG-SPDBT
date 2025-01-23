import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { StepGdsdDogInformationComponent } from '../shared/common-step-components/step-gdsd-dog-information.component';
import { StepGdsdDogTrainingInformationComponent } from '../shared/common-step-components/step-gdsd-dog-training-information.component';

@Component({
	selector: 'app-steps-gdsd-dog-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-dog-training-information></app-step-gdsd-dog-training-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_TRAINING_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_TRAINING_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-dog-information></app-step-gdsd-dog-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_INFO)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_DOG_INFO)"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_INFO)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdDogInfoComponent extends BaseWizardStepComponent {
	// If step ordering changes, crucial  to update this <- look for this comment below
	readonly STEP_TRAINING_INFO = 0;
	readonly STEP_DOG_INFO = 1;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepGdsdDogTrainingInformationComponent) dogTrainingComponent!: StepGdsdDogTrainingInformationComponent;

	@ViewChild(StepGdsdDogInformationComponent) dogInformationComponent!: StepGdsdDogInformationComponent;

	constructor(private commonApplicationService: CommonApplicationService) {
		super();
	}

	override dirtyForm(step: number): boolean {
		// switch (step) {
		// 	case this.STEP_TRAINING_INFO:
		// 		return this.dogTrainingComponent.isFormValid();
		// 	case this.STEP_DOG_INFO:
		// 		return this.dogInformationComponent.isFormValid();
		// 	default:
		// 		console.error('Unknown Form', step);
		// }
		// return false;
		return true;
	}
}
