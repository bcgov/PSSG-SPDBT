import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { StepPermitExpiredComponent } from './step-permit-expired.component';
import { StepPermitTermsOfUseComponent } from './step-permit-terms-of-use.component';

@Component({
	selector: 'app-steps-permit-details-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			@if (showTermsOfUse) {
				<mat-step>
					<app-step-permit-terms-of-use [applicationTypeCode]="applicationTypeCode"></app-step-permit-terms-of-use>
					<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"></app-wizard-footer>
				</mat-step>
			}

			<mat-step>
				<app-step-permit-checklist-new [isBodyArmourPermit]="isBodyArmourPermit"></app-step-permit-checklist-new>

				@if (showTermsOfUse) {
					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onGoToNextStep()"
						(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
					></app-wizard-footer>
				} @else {
					<app-wizard-footer
						[isFormValid]="isFormValid"
						(previousStepperStep)="onGotoUserProfile()"
						(nextStepperStep)="onGoToNextStep()"
						(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
					></app-wizard-footer>
				}
			</mat-step>

			<mat-step>
				<app-step-permit-expired
					[isLoggedIn]="isLoggedIn"
					[serviceTypeCode]="serviceTypeCode"
				></app-step-permit-expired>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PERMIT_EXPIRED)"
					(nextReviewStepperStep)="onNextReview(STEP_PERMIT_EXPIRED)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsPermitDetailsNewComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 1;
	readonly STEP_CHECKLIST = 2;
	readonly STEP_PERMIT_EXPIRED = 3;

	@Input() isLoggedIn = false;
	@Input() isFormValid = false;
	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepPermitTermsOfUseComponent) termsOfUseComponent!: StepPermitTermsOfUseComponent;
	@ViewChild(StepPermitExpiredComponent) permitExpiredComponent!: StepPermitExpiredComponent;

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
			case this.STEP_CHECKLIST:
				return true;
			case this.STEP_PERMIT_EXPIRED:
				return this.permitExpiredComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get showTermsOfUse(): boolean {
		// anonymous: agree everytime for all
		return !this.isLoggedIn;
	}

	get isBodyArmourPermit(): boolean {
		return this.serviceTypeCode === ServiceTypeCode.BodyArmourPermit;
	}
}
