import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepMdraConsentComponent } from './step-mdra-consent.component';
import { StepMdraSummaryComponent } from './step-mdra-summary.component';

@Component({
	selector: 'app-steps-mdra-review-and-confirm',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-mdra-summary
					[applicationTypeCode]="applicationTypeCode"
					(editStep)="onGoToStep($event)"
				></app-step-mdra-summary>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-mdra-consent></app-step-mdra-consent>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_CONSENT)"
					nextButtonLabel="Submit"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsMdraReviewAndConfirmComponent extends BaseWizardStepComponent {
	readonly STEP_SUMMARY = 0;
	readonly STEP_CONSENT = 1;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepMdraSummaryComponent) summaryComponent!: StepMdraSummaryComponent;
	@ViewChild(StepMdraConsentComponent) consentComponent!: StepMdraConsentComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	onGoToStep(step: number): void {
		this.goToStep.emit(step);
	}

	override onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
		this.summaryComponent.onUpdateData();
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
