import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepGdsdConsentComponent } from '../shared/common-step-components/step-gdsd-consent.component';
import { StepGdsdSummaryComponent } from './step-components/step-gdsd-summary.component';

@Component({
	selector: 'app-steps-gdsd-review-confirm',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-summary></app-step-gdsd-summary>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_SUMMARY)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-consent></app-step-gdsd-consent>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CONSENT)"
					(previousStepperStep)="onGoToPreviousStep()"
					nextButtonLabel="Submit"
					(nextStepperStep)="onSubmitNow()"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdReviewConfirmComponent extends BaseWizardStepComponent {
	readonly STEP_SUMMARY = 0;
	readonly STEP_CONSENT = 1;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepGdsdSummaryComponent) summaryComponent!: StepGdsdSummaryComponent;
	@ViewChild(StepGdsdConsentComponent) consentComponent!: StepGdsdConsentComponent;

	constructor() {
		super();
	}

	onSubmitNow(): void {
		this.nextSubmitStep.emit();
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_SUMMARY:
				return true;
			case this.STEP_CONSENT:
				return this.consentComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
