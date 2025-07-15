import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepWorkerLicenceCategoryComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-category.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-dogs-authorization.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-photograph-of-yourself.component';
import { StepWorkerLicenceRestraintsComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-restraints.component';
import { StepWorkerLicenceReviewNameChangeComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-review-name-change.component';
import { StepWorkerLicenceCriminalHistoryComponent } from '../../shared/worker-licence-wizard-step-components/step-worker-licence-criminal-history.component';
import { StepWorkerLicenceMentalHealthConditionsComponent } from '../../shared/worker-licence-wizard-step-components/step-worker-licence-mental-health-conditions.component';
import { StepWorkerLicencePoliceBackgroundComponent } from '../../shared/worker-licence-wizard-step-components/step-worker-licence-police-background.component';

@Component({
	selector: 'app-steps-worker-licence-updates-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  <mat-step>
		    <app-step-worker-licence-police-background
		      [applicationTypeCode]="applicationTypeUpdate"
		    ></app-step-worker-licence-police-background>
		
		    <app-wizard-footer
		      (previousStepperStep)="onStepPrevious()"
		      (nextStepperStep)="onFormValidNextStep(STEP_POLICE_BACKGROUND)"
		      (nextReviewStepperStep)="onNextReview(STEP_POLICE_BACKGROUND)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    <app-step-worker-licence-mental-health-conditions
		      [applicationTypeCode]="applicationTypeUpdate"
		    ></app-step-worker-licence-mental-health-conditions>
		
		    <app-wizard-footer
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onFormValidNextStep(STEP_MENTAL_HEALTH_CONDITIONS)"
		      (nextReviewStepperStep)="onNextReview(STEP_MENTAL_HEALTH_CONDITIONS)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    <app-step-worker-licence-criminal-history
		      [applicationTypeCode]="applicationTypeUpdate"
		    ></app-step-worker-licence-criminal-history>
		
		    <app-wizard-footer
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onFormValidNextStep(STEP_CRIMINAL_HISTORY)"
		      (nextReviewStepperStep)="onNextReview(STEP_CRIMINAL_HISTORY)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  @if (hasBcscNameChanged) {
		    <mat-step>
		      <app-step-worker-licence-review-name-change></app-step-worker-licence-review-name-change>
		      <app-wizard-footer
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onFormValidNextStep(STEP_NAME_CHANGE)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		
		  @if (showPhotographOfYourselfStep) {
		    <mat-step>
		      <app-step-worker-licence-photograph-of-yourself
		        [applicationTypeCode]="applicationTypeUpdate"
		      ></app-step-worker-licence-photograph-of-yourself>
		      <app-wizard-footer
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onFormValidNextStep(STEP_PHOTOGRAPH_OF_YOURSELF)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		
		  <mat-step>
		    <app-step-worker-licence-category
		      [applicationTypeCode]="applicationTypeUpdate"
		      [isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
		    ></app-step-worker-licence-category>
		
		    <app-wizard-footer
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onFormValidCategoryNextStep()"
		    ></app-wizard-footer>
		  </mat-step>
		
		  @if (showStepDogsAndRestraints) {
		    <mat-step>
		      <app-step-worker-licence-restraints
		        [applicationTypeCode]="applicationTypeUpdate"
		      ></app-step-worker-licence-restraints>
		      <app-wizard-footer
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onFormValidNextStep(STEP_RESTRAINTS)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		
		  @if (showStepDogsAndRestraints) {
		    <mat-step>
		      <app-step-worker-licence-dogs-authorization
		        [applicationTypeCode]="applicationTypeUpdate"
		      ></app-step-worker-licence-dogs-authorization>
		      <app-wizard-footer
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onStepNext(STEP_DOGS)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		</mat-stepper>
		`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsWorkerLicenceUpdatesAuthenticatedComponent extends BaseWizardStepComponent {
	applicationTypeUpdate = ApplicationTypeCode.Update;

	readonly STEP_POLICE_BACKGROUND = 1;
	readonly STEP_MENTAL_HEALTH_CONDITIONS = 2;
	readonly STEP_CRIMINAL_HISTORY = 3;
	readonly STEP_NAME_CHANGE = 4;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 5;
	readonly STEP_LICENCE_CATEGORY = 6;
	readonly STEP_DOGS = 7;
	readonly STEP_RESTRAINTS = 8;

	@Input() showStepDogsAndRestraints = false;
	@Input() hasBcscNameChanged = false;
	@Input() showPhotographOfYourselfStep = false;
	@Input() isSoleProprietorSimultaneousFlow = false;

	@ViewChild(StepWorkerLicencePoliceBackgroundComponent)
	policeBackgroundForm!: StepWorkerLicencePoliceBackgroundComponent;
	@ViewChild(StepWorkerLicenceMentalHealthConditionsComponent)
	mhcForm!: StepWorkerLicenceMentalHealthConditionsComponent;
	@ViewChild(StepWorkerLicenceCriminalHistoryComponent) criminalHistoryForm!: StepWorkerLicenceCriminalHistoryComponent;
	@ViewChild(StepWorkerLicenceReviewNameChangeComponent)
	stepNameChangeComponent!: StepWorkerLicenceReviewNameChangeComponent;
	@ViewChild(StepWorkerLicencePhotographOfYourselfComponent)
	stepPhotographOfYourselfComponent!: StepWorkerLicencePhotographOfYourselfComponent;
	@ViewChild(StepWorkerLicenceCategoryComponent)
	stepLicenceCategoryComponent!: StepWorkerLicenceCategoryComponent;
	@ViewChild(StepWorkerLicenceRestraintsComponent)
	stepRestraintsComponent!: StepWorkerLicenceRestraintsComponent;
	@ViewChild(StepWorkerLicenceDogsAuthorizationComponent)
	stepDogsComponent!: StepWorkerLicenceDogsAuthorizationComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	onFormValidCategoryNextStep(): void {
		if (this.showStepDogsAndRestraints) {
			this.onFormValidNextStep(this.STEP_LICENCE_CATEGORY);
		} else {
			this.onStepNext(this.STEP_LICENCE_CATEGORY);
		}
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_POLICE_BACKGROUND:
				return this.policeBackgroundForm.isFormValid();
			case this.STEP_MENTAL_HEALTH_CONDITIONS:
				return this.mhcForm.isFormValid();
			case this.STEP_CRIMINAL_HISTORY:
				return this.criminalHistoryForm.isFormValid();
			case this.STEP_NAME_CHANGE:
				return this.stepNameChangeComponent.isFormValid();
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepPhotographOfYourselfComponent.isFormValid();
			case this.STEP_LICENCE_CATEGORY:
				return this.stepLicenceCategoryComponent.isFormValid();
			case this.STEP_RESTRAINTS:
				return this.stepRestraintsComponent.isFormValid();
			case this.STEP_DOGS:
				return this.stepDogsComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
