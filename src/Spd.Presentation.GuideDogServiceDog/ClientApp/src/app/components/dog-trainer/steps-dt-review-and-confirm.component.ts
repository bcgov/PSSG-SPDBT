import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepDtConsentComponent } from './step-dt-consent.component';
import { StepDtSummaryComponent } from './step-dt-summary.component';

@Component({
	selector: 'app-steps-dt-review-and-confirm',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-dt-summary
					[applicationTypeCode]="applicationTypeCode"
					(editStep)="onGoToStep($event)"
				></app-step-dt-summary>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-dt-consent></app-step-dt-consent>

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
export class StepsDtReviewAndConfirmComponent extends BaseWizardStepComponent {
	readonly STEP_SUMMARY = 0;
	readonly STEP_CONSENT = 1;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepDtSummaryComponent) summaryComponent!: StepDtSummaryComponent;
	@ViewChild(StepDtConsentComponent) consentComponent!: StepDtConsentComponent;

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
