import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { StepPermitTermsOfUseComponent } from './step-permit-terms-of-use.component';

@Component({
	selector: 'app-steps-permit-details-renewal',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
		  @if (showTermsOfUse) {
		    <mat-step>
		      <app-step-permit-terms-of-use [applicationTypeCode]="applicationTypeCode"></app-step-permit-terms-of-use>
		      <app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"></app-wizard-footer>
		    </mat-step>
		  }
		
		  <mat-step>
		    <app-step-permit-checklist-renewal></app-step-permit-checklist-renewal>
		
		    @if (showTermsOfUse) {
		      <app-wizard-footer
		        [isFormValid]="isFormValid"
		        (previousStepperStep)="onGoToPreviousStep()"
		        (nextStepperStep)="onGoToNextStep()"
		        (nextReviewStepperStep)="onNextReview(STEP_PERMIT_CHECKLIST)"
		      ></app-wizard-footer>
		    } @else {
		      <app-wizard-footer
		        [isFormValid]="isFormValid"
		        (previousStepperStep)="onGotoUserProfile()"
		        (nextStepperStep)="onGoToNextStep()"
		        (nextReviewStepperStep)="onNextReview(STEP_PERMIT_CHECKLIST)"
		      ></app-wizard-footer>
		    }
		  </mat-step>
		
		  <mat-step>
		    <app-step-permit-confirmation [serviceTypeCode]="serviceTypeCode"></app-step-permit-confirmation>
		
		    <app-wizard-footer
		      [isFormValid]="isFormValid"
		      (previousStepperStep)="onGoToPreviousStep()"
		      (nextStepperStep)="onStepNext(STEP_PERMIT_CONFIRMATION)"
		      (nextReviewStepperStep)="onNextReview(STEP_PERMIT_CONFIRMATION)"
		    ></app-wizard-footer>
		  </mat-step>
		</mat-stepper>
		`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsPermitDetailsRenewalComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_PERMIT_CHECKLIST = 1;
	readonly STEP_PERMIT_CONFIRMATION = 2;

	@Input() isLoggedIn = false;
	@Input() isFormValid = false;
	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepPermitTermsOfUseComponent) termsOfUseComponent!: StepPermitTermsOfUseComponent;

	constructor(
		utilService: UtilService,
		private commonApplicationService: CommonApplicationService
	) {
		super(utilService);
	}

	onGotoUserProfile(): void {
		this.commonApplicationService.onGotoPermitUserProfile(this.serviceTypeCode, this.applicationTypeCode);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_PERMIT_CHECKLIST:
				return true;
			case this.STEP_PERMIT_CONFIRMATION:
				return true;
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showTermsOfUse(): boolean {
		// anonymous: agree everytime for all
		return !this.isLoggedIn;
	}
}
