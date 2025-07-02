import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepRdDogInfoComponent } from './step-rd-dog-info.component';
import { StepRdDogLivingInfoComponent } from './step-rd-dog-living-info.component';
import { StepRdDogRetiredInfoComponent } from './step-rd-dog-retired-info.component';

@Component({
	selector: 'app-steps-rd-dog-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  <mat-step>
		    <app-step-rd-dog-info [applicationTypeCode]="applicationTypeCode"></app-step-rd-dog-info>
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_DOG_INFO)"
		      (previousStepperStep)="onStepPrevious()"
		      (nextStepperStep)="onFormValidNextStep(STEP_DOG_INFO)"
		      (nextReviewStepperStep)="onNextReview(STEP_DOG_INFO)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  @if (isNew) {
		    <mat-step>
		      <app-step-rd-dog-retired-info [applicationTypeCode]="applicationTypeCode"></app-step-rd-dog-retired-info>
		      <app-wizard-footer
		        [isFormValid]="isFormValid"
		        [showSaveAndExit]="showSaveAndExit"
		        (saveAndExit)="onSaveAndExit(STEP_DOG_RETIRED_INFO)"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onFormValidNextStep(STEP_DOG_RETIRED_INFO)"
		        (nextReviewStepperStep)="onNextReview(STEP_DOG_RETIRED_INFO)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		
		  <mat-step>
		    <app-step-rd-dog-living-info [applicationTypeCode]="applicationTypeCode"></app-step-rd-dog-living-info>
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      [showSaveAndExit]="showSaveAndExit"
		      (saveAndExit)="onSaveAndExit(STEP_DOG_LIVING_INFO)"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onStepNext(STEP_DOG_LIVING_INFO)"
		      (nextReviewStepperStep)="onNextReview(STEP_DOG_LIVING_INFO)"
		    ></app-wizard-footer>
		  </mat-step>
		</mat-stepper>
		`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsRdDogInfoComponent extends BaseWizardStepComponent {
	readonly STEP_DOG_INFO = 0;
	readonly STEP_DOG_RETIRED_INFO = 1;
	readonly STEP_DOG_LIVING_INFO = 2;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepRdDogInfoComponent) dogInfoComponent!: StepRdDogInfoComponent;
	@ViewChild(StepRdDogRetiredInfoComponent) dogRetiredInfoComponent!: StepRdDogRetiredInfoComponent;
	@ViewChild(StepRdDogLivingInfoComponent) dogLivingInfoComponent!: StepRdDogLivingInfoComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_DOG_INFO:
				return this.dogInfoComponent.isFormValid();
			case this.STEP_DOG_RETIRED_INFO:
				return this.dogRetiredInfoComponent.isFormValid();
			case this.STEP_DOG_LIVING_INFO:
				return this.dogLivingInfoComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
