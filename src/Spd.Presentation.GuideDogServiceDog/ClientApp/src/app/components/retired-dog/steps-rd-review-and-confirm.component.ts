import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepRdConsentComponent } from './step-rd-consent.component';
import { StepRdSummaryComponent } from './step-rd-summary.component';

@Component({
	selector: 'app-steps-rd-review-and-confirm',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-rd-summary
					[applicationTypeCode]="applicationTypeCode"
					(editStep)="onGoToStep($event)"
				></app-step-rd-summary>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_SUMMARY)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-rd-consent></app-step-rd-consent>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_SUMMARY)"
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
export class StepsRdReviewAndConfirmComponent extends BaseWizardStepComponent {
	readonly STEP_SUMMARY = 0;
	readonly STEP_CONSENT = 1;

	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepRdSummaryComponent) summaryComponent!: StepRdSummaryComponent;
	@ViewChild(StepRdConsentComponent) consentComponent!: StepRdConsentComponent;

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
