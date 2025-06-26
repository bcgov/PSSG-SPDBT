import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepMdraLicenceExpiredComponent } from './step-mdra-licence-expired.component';
import { StepMdraTermsOfUseComponent } from './step-mdra-terms-of-use.component';

@Component({
	selector: 'app-steps-mdra-details',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  <mat-step>
		    <app-step-mdra-terms-of-use></app-step-mdra-terms-of-use>
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"
		      (nextReviewStepperStep)="onNextReview(STEP_TERMS)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  <mat-step>
		    @if (isUpdate) {
		      <app-step-mdra-checklist-update></app-step-mdra-checklist-update>
		    } @else {
		      <app-step-mdra-checklist-new></app-step-mdra-checklist-new>
		    }
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onChecklistNextStep(STEP_CHECKLIST)"
		      (nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
		    ></app-wizard-footer>
		  </mat-step>
		
		  @if (isNew) {
		    <mat-step>
		      <app-step-mdra-licence-expired></app-step-mdra-licence-expired>
		      <app-wizard-footer
		        [isFormValid]="isFormValid"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onStepNext(STEP_LICENCE_EXPIRED)"
		        (nextReviewStepperStep)="onNextReview(STEP_LICENCE_EXPIRED)"
		      ></app-wizard-footer>
		    </mat-step>
		  }
		</mat-stepper>
		`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsMdraDetailsComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_CHECKLIST = 1;
	readonly STEP_LICENCE_EXPIRED = 2;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepMdraTermsOfUseComponent) termsOfUseComponent!: StepMdraTermsOfUseComponent;
	@ViewChild(StepMdraLicenceExpiredComponent) expiredComponent!: StepMdraLicenceExpiredComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	onChecklistNextStep(step: number): void {
		if (this.isNew) {
			super.onFormValidNextStep(step);
			return;
		}

		super.onStepNext(step);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_CHECKLIST:
				return true;
			case this.STEP_LICENCE_EXPIRED:
				return this.expiredComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
}
