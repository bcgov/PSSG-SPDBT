import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepGdsdAccreditedGraduationComponent } from './common-step-components/step-gdsd-accredited-graduation.component';
import { StepGdsdDogTasksComponent } from './common-step-components/step-gdsd-dog-tasks.component';
import { StepGdsdOtherTrainingsComponent } from './common-step-components/step-gdsd-other-trainings.component';
import { StepGdsdSchoolTrainingsComponent } from './common-step-components/step-gdsd-school-trainings.component';
import { StepGdsdTrainingHistoryComponent } from './common-step-components/step-gdsd-training-history.component';

@Component({
	selector: 'app-steps-gdsd-training-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<ng-container *ngIf="isTrainedByAccreditedSchools; else notTrainedByAccreditedSchools">
				<mat-step>
					<app-step-gdsd-accredited-graduation></app-step-gdsd-accredited-graduation>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						[showSaveAndExit]="showSaveAndExit"
						(saveAndExit)="onSaveAndExit(STEP_ACCREDITED)"
						(previousStepperStep)="onStepPrevious()"
						(nextStepperStep)="onStepNextServiceTasks()"
						(nextReviewStepperStep)="onNextReview(STEP_ACCREDITED)"
					></app-wizard-footer>

					<mat-step *ngIf="isServiceDog">
						<app-step-gdsd-dog-tasks></app-step-gdsd-dog-tasks>

						<app-wizard-footer
							[isFormValid]="isFormValid"
							[showSaveAndExit]="showSaveAndExit"
							(saveAndExit)="onSaveAndExit(STEP_TASKS)"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onStepNext(STEP_TASKS)"
							(nextReviewStepperStep)="onNextReview(STEP_TASKS)"
						></app-wizard-footer>
					</mat-step>
				</mat-step>
			</ng-container>

			<ng-template #notTrainedByAccreditedSchools>
				<mat-step>
					<app-step-gdsd-training-history></app-step-gdsd-training-history>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						[showSaveAndExit]="showSaveAndExit"
						(saveAndExit)="onSaveAndExit(STEP_TRAINING_HISTORY)"
						(previousStepperStep)="onStepPrevious()"
						(nextStepperStep)="onFormValidNextStep(STEP_TRAINING_HISTORY)"
						(nextReviewStepperStep)="onNextReview(STEP_TRAINING_HISTORY)"
					></app-wizard-footer>
				</mat-step>

				<ng-container *ngIf="hasAttendedTrainingSchool; else notAttendedTrainingSchool">
					<mat-step>
						<app-step-gdsd-school-trainings></app-step-gdsd-school-trainings>

						<app-wizard-footer
							[isFormValid]="isFormValid"
							[showSaveAndExit]="showSaveAndExit"
							(saveAndExit)="onSaveAndExit(STEP_SCHOOL_TRAINING)"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onFormValidNextStep(STEP_SCHOOL_TRAINING)"
							(nextReviewStepperStep)="onNextReview(STEP_SCHOOL_TRAINING)"
						></app-wizard-footer>
					</mat-step>
				</ng-container>

				<ng-template #notAttendedTrainingSchool>
					<mat-step>
						<app-step-gdsd-other-trainings></app-step-gdsd-other-trainings>

						<app-wizard-footer
							[isFormValid]="isFormValid"
							[showSaveAndExit]="showSaveAndExit"
							(saveAndExit)="onSaveAndExit(STEP_OTHER_TRAINING)"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onFormValidNextStep(STEP_OTHER_TRAINING)"
							(nextReviewStepperStep)="onNextReview(STEP_OTHER_TRAINING)"
						></app-wizard-footer>
					</mat-step>
				</ng-template>

				<mat-step>
					<app-step-gdsd-dog-tasks></app-step-gdsd-dog-tasks>

					<app-wizard-footer
						[isFormValid]="isFormValid"
						[showSaveAndExit]="showSaveAndExit"
						(saveAndExit)="onSaveAndExit(STEP_TASKS)"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onStepNext(STEP_TASKS)"
						(nextReviewStepperStep)="onNextReview(STEP_TASKS)"
					></app-wizard-footer>
				</mat-step>
			</ng-template>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdTrainingInfoComponent extends BaseWizardStepComponent {
	readonly STEP_ACCREDITED = 0;
	readonly STEP_TRAINING_HISTORY = 1;
	readonly STEP_SCHOOL_TRAINING = 2;
	readonly STEP_OTHER_TRAINING = 3;
	readonly STEP_TASKS = 4;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() isTrainedByAccreditedSchools!: boolean;
	@Input() hasAttendedTrainingSchool!: boolean;
	@Input() isServiceDog!: boolean;

	@ViewChild(StepGdsdAccreditedGraduationComponent) accreditedComponent!: StepGdsdAccreditedGraduationComponent;
	@ViewChild(StepGdsdTrainingHistoryComponent) trainingComponent!: StepGdsdTrainingHistoryComponent;
	@ViewChild(StepGdsdSchoolTrainingsComponent) schoolComponent!: StepGdsdSchoolTrainingsComponent;
	@ViewChild(StepGdsdOtherTrainingsComponent) otherComponent!: StepGdsdOtherTrainingsComponent;
	@ViewChild(StepGdsdDogTasksComponent) tasksComponent!: StepGdsdDogTasksComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	onStepNextServiceTasks(): void {
		const isValid = this.dirtyForm(this.STEP_ACCREDITED);
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		if (this.isServiceDog) {
			this.childNextStep.emit(true);
			return;
		}

		this.nextStepperStep.emit(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_ACCREDITED:
				return this.accreditedComponent.isFormValid();
			case this.STEP_TRAINING_HISTORY:
				return this.trainingComponent.isFormValid();
			case this.STEP_SCHOOL_TRAINING:
				return this.schoolComponent.isFormValid();
			case this.STEP_OTHER_TRAINING:
				return this.otherComponent.isFormValid();
			case this.STEP_TASKS:
				return this.tasksComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
