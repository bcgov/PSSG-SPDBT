import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepRdTermsOfUseComponent } from './step-rd-terms-of-use.component';

@Component({
	selector: 'app-steps-rd-details',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  <mat-step>
		    <app-step-rd-terms-of-use></app-step-rd-terms-of-use>
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"
		      (nextReviewStepperStep)="onNextReview(STEP_TERMS)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    @if (isNew) {
		      <app-step-rd-checklist-new></app-step-rd-checklist-new>
		    } @else {
		      <app-step-rd-checklist-renewal></app-step-rd-checklist-renewal>
		    }
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onStepNext(STEP_CHECKLIST)"
		      (nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
		    ></app-wizard-footer>
		  </mat-step>
		</mat-stepper>
		`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsRdDetailsComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_CHECKLIST = 1;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepRdTermsOfUseComponent) termsOfUseComponent!: StepRdTermsOfUseComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_CHECKLIST:
				return true;
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
