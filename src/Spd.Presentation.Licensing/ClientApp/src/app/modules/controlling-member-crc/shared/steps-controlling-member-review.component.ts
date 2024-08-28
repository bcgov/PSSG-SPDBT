import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepControllingMemberConsentAndDeclarationComponent } from './step-controlling-member-consent-and-declaration.component';
import { StepControllingMemberSummaryReviewAnonymousComponent } from './step-controlling-member-summary-review-anonymous.component';

@Component({
	selector: 'app-steps-controlling-member-review',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-controlling-member-summary-review-anonymous
					(editStep)="onEditStep($event)"
				></app-step-controlling-member-summary-review-anonymous>

				<app-wizard-footer
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_REVIEW)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-consent-and-declaration></app-step-controlling-member-consent-and-declaration>

				<app-wizard-footer
					nextButtonLabel="Submit"
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_CONSENT)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsControllingMemberReviewComponent extends BaseWizardStepComponent {
	readonly STEP_REVIEW = 0;
	readonly STEP_CONSENT = 1;

	// @Input() isFormValid!: boolean;
	// @Input() showSaveAndExit!: boolean;
	// @Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepControllingMemberSummaryReviewAnonymousComponent)
	stepReview!: StepControllingMemberSummaryReviewAnonymousComponent;
	@ViewChild(StepControllingMemberConsentAndDeclarationComponent)
	stepConsent!: StepControllingMemberConsentAndDeclarationComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	onEditStep(stepNumber: number) {
		this.goToStep.emit(stepNumber);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_REVIEW:
				return true;
			case this.STEP_CONSENT:
				return this.stepConsent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	override onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
		this.stepReview.onUpdateData();
	}
}
