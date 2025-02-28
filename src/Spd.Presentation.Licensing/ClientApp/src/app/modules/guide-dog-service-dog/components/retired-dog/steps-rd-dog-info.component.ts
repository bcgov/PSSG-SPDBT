import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepRdDogInfoComponent } from './step-rd-dog-info.component';

@Component({
	selector: 'app-steps-rd-dog-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-rd-dog-info
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
				></app-step-rd-dog-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNext(STEP_DOG_INFO)"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_INFO)"
				></app-wizard-footer>
			</mat-step>

			<!-- <ng-container *ngIf="showDogMedicalStep">
				<mat-step>
					<app-step-team-dog-medical></app-step-team-dog-medical>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						[showSaveAndExit]="showSaveAndExit"
						(saveAndExit)="onSaveAndExit(STEP_DOG_MEDICAL)"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onStepNext(STEP_DOG_MEDICAL)"
						(nextReviewStepperStep)="onNextReview(STEP_DOG_MEDICAL)"
					></app-wizard-footer>
				</mat-step>
			</ng-container> -->
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsRdDogInfoComponent extends BaseWizardStepComponent {
	readonly STEP_DOG_INFO = 0;
	// readonly STEP_DOG_MEDICAL = 1;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;

	@ViewChild(StepRdDogInfoComponent) dogInfoComponent!: StepRdDogInfoComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_DOG_INFO:
				return this.dogInfoComponent.isFormValid();
			// case this.STEP_DOG_MEDICAL:
			// 	return this.dogMedicalComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
