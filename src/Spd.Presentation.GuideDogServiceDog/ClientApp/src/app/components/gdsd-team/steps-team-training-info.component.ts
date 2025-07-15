import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepTeamAccreditedGraduationComponent } from './step-team-accredited-graduation.component';
import { StepTeamDogTasksComponent } from './step-team-dog-tasks.component';
import { StepTeamOtherTrainingsComponent } from './step-team-other-trainings.component';
import { StepTeamSchoolTrainingsComponent } from './step-team-school-trainings.component';
import { StepTeamTrainingHistoryComponent } from './step-team-training-history.component';

@Component({
	selector: 'app-steps-team-training-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  @if (isTrainedByAccreditedSchools) {
		    <mat-step>
		      <app-step-team-accredited-graduation></app-step-team-accredited-graduation>
		      <app-wizard-footer
		        [isFormValid]="isFormValid"
		        [showSaveAndExit]="showSaveAndExit"
		        (saveAndExit)="onSaveAndExit(STEP_ACCREDITED)"
		        (previousStepperStep)="onStepPrevious()"
		        (nextStepperStep)="onStepNextServiceTasks()"
		        (nextReviewStepperStep)="onNextReview(STEP_ACCREDITED)"
		      ></app-wizard-footer>
		    </mat-step>
		    @if (isServiceDog) {
		      <mat-step>
		        <app-step-team-dog-tasks></app-step-team-dog-tasks>
		        <app-wizard-footer
		          [isFormValid]="isFormValid"
		          [showSaveAndExit]="showSaveAndExit"
		          (saveAndExit)="onSaveAndExit(STEP_TASKS)"
		          (previousStepperStep)="onGoToPreviousStep()"
		          (nextStepperStep)="onStepNext(STEP_TASKS)"
		          (nextReviewStepperStep)="onNextReview(STEP_TASKS)"
		        ></app-wizard-footer>
		      </mat-step>
		    }
		  } @else {
		    <mat-step>
		      <app-step-team-training-history></app-step-team-training-history>
		      <app-wizard-footer
		        [isFormValid]="isFormValid"
		        [showSaveAndExit]="showSaveAndExit"
		        (saveAndExit)="onSaveAndExit(STEP_TRAINING_HISTORY)"
		        (previousStepperStep)="onStepPrevious()"
		        (nextStepperStep)="onFormValidNextStep(STEP_TRAINING_HISTORY)"
		        (nextReviewStepperStep)="onNextReview(STEP_TRAINING_HISTORY)"
		      ></app-wizard-footer>
		    </mat-step>
		    @if (hasAttendedTrainingSchool) {
		      <mat-step>
		        <app-step-team-school-trainings></app-step-team-school-trainings>
		        <app-wizard-footer
		          [isFormValid]="isFormValid"
		          [showSaveAndExit]="showSaveAndExit"
		          (saveAndExit)="onSaveAndExit(STEP_SCHOOL_TRAINING)"
		          (previousStepperStep)="onGoToPreviousStep()"
		          (nextStepperStep)="onFormValidNextStep(STEP_SCHOOL_TRAINING)"
		          (nextReviewStepperStep)="onNextReview(STEP_SCHOOL_TRAINING)"
		        ></app-wizard-footer>
		      </mat-step>
		    } @else {
		      <mat-step>
		        <app-step-team-other-trainings></app-step-team-other-trainings>
		        <app-wizard-footer
		          [isFormValid]="isFormValid"
		          [showSaveAndExit]="showSaveAndExit"
		          (saveAndExit)="onSaveAndExit(STEP_OTHER_TRAINING)"
		          (previousStepperStep)="onGoToPreviousStep()"
		          (nextStepperStep)="onFormValidNextStep(STEP_OTHER_TRAINING)"
		          (nextReviewStepperStep)="onNextReview(STEP_OTHER_TRAINING)"
		        ></app-wizard-footer>
		      </mat-step>
		    }
		    <mat-step>
		      <app-step-team-dog-tasks></app-step-team-dog-tasks>
		      <app-wizard-footer
		        [isFormValid]="isFormValid"
		        [showSaveAndExit]="showSaveAndExit"
		        (saveAndExit)="onSaveAndExit(STEP_TASKS)"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onStepNext(STEP_TASKS)"
		        (nextReviewStepperStep)="onNextReview(STEP_TASKS)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		
		</mat-stepper>
		`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsTeamTrainingInfoComponent extends BaseWizardStepComponent {
	readonly STEP_ACCREDITED = 0;
	readonly STEP_TRAINING_HISTORY = 1;
	readonly STEP_SCHOOL_TRAINING = 2;
	readonly STEP_OTHER_TRAINING = 3;
	readonly STEP_TASKS = 4;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() isTrainedByAccreditedSchools!: boolean;
	@Input() hasAttendedTrainingSchool!: boolean;
	@Input() isServiceDog!: boolean;

	@ViewChild(StepTeamAccreditedGraduationComponent) accreditedComponent!: StepTeamAccreditedGraduationComponent;
	@ViewChild(StepTeamTrainingHistoryComponent) trainingComponent!: StepTeamTrainingHistoryComponent;
	@ViewChild(StepTeamSchoolTrainingsComponent) schoolComponent!: StepTeamSchoolTrainingsComponent;
	@ViewChild(StepTeamOtherTrainingsComponent) otherComponent!: StepTeamOtherTrainingsComponent;
	@ViewChild(StepTeamDogTasksComponent) tasksComponent!: StepTeamDogTasksComponent;

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
