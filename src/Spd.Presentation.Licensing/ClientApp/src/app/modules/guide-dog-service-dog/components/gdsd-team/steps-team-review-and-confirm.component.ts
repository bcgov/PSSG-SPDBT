import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepTeamConsentComponent } from './step-team-consent.component';
import { StepTeamSummaryComponent } from './step-team-summary.component';

@Component({
	selector: 'app-steps-team-review-and-confirm',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-team-summary
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					[hasAttendedTrainingSchool]="hasAttendedTrainingSchool"
					[isServiceDog]="isServiceDog"
					(editStep)="onGoToStep($event)"
				></app-step-team-summary>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_SUMMARY)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-team-consent [isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"></app-step-team-consent>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CONSENT)"
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
export class StepsTeamReviewAndConfirmComponent extends BaseWizardStepComponent {
	readonly STEP_SUMMARY = 0;
	readonly STEP_CONSENT = 1;

	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;
	@Input() hasAttendedTrainingSchool!: boolean;
	@Input() isServiceDog!: boolean;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepTeamSummaryComponent) summaryComponent!: StepTeamSummaryComponent;
	@ViewChild(StepTeamConsentComponent) consentComponent!: StepTeamConsentComponent;

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
