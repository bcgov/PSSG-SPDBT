import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, PoliceOfficerRoleCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { StepWorkerLicenceCriminalHistoryComponent } from './step-worker-licence-criminal-history.component';
import { StepWorkerLicenceFingerprintsComponent } from './step-worker-licence-fingerprints.component';
import { StepWorkerLicenceMentalHealthConditionsComponent } from './step-worker-licence-mental-health-conditions.component';
import { StepWorkerLicencePoliceBackgroundComponent } from './step-worker-licence-police-background.component';

@Component({
	selector: 'app-steps-worker-licence-background',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-worker-licence-police-background></app-step-worker-licence-police-background>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_POLICE_BACKGROUND)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_POLICE_BACKGROUND)"
					(nextReviewStepperStep)="onNextReview(STEP_POLICE_BACKGROUND)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-mental-health-conditions
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-mental-health-conditions>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_MENTAL_HEALTH_CONDITIONS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MENTAL_HEALTH_CONDITIONS)"
					(nextReviewStepperStep)="onNextReview(STEP_MENTAL_HEALTH_CONDITIONS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodeUpdate">
				<app-step-worker-licence-criminal-history
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-criminal-history>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CRIMINAL_HISTORY)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CRIMINAL_HISTORY)"
					(nextReviewStepperStep)="onNextReview(STEP_CRIMINAL_HISTORY)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode !== applicationTypeCodeUpdate">
				<app-step-worker-licence-fingerprints></app-step-worker-licence-fingerprints>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_FINGERPRINTS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_FINGERPRINTS)"
					(nextReviewStepperStep)="onNextReview(STEP_FINGERPRINTS)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsWorkerLicenceBackgroundComponent extends BaseWizardStepComponent {
	readonly STEP_POLICE_BACKGROUND = 1;
	readonly STEP_MENTAL_HEALTH_CONDITIONS = 2;
	readonly STEP_CRIMINAL_HISTORY = 3;
	readonly STEP_FINGERPRINTS = 4;

	policeOfficerRoleCodes = PoliceOfficerRoleCode;

	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() policeOfficerRoleCode: string | null = null;

	applicationTypeCodeUpdate = ApplicationTypeCode.Update;

	@ViewChild(StepWorkerLicencePoliceBackgroundComponent)
	policeBackgroundComponent!: StepWorkerLicencePoliceBackgroundComponent;
	@ViewChild(StepWorkerLicenceMentalHealthConditionsComponent)
	mentalHealthConditionsComponent!: StepWorkerLicenceMentalHealthConditionsComponent;
	@ViewChild(StepWorkerLicenceCriminalHistoryComponent)
	criminalHistoryComponent!: StepWorkerLicenceCriminalHistoryComponent;
	@ViewChild(StepWorkerLicenceFingerprintsComponent) fingerprintsComponent!: StepWorkerLicenceFingerprintsComponent;

	constructor(override commonApplicationService: CommonApplicationService) {
		super(commonApplicationService);
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		if (!isValid) return;

		if (_formNumber === this.STEP_MENTAL_HEALTH_CONDITIONS && this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.nextStepperStep.emit(true);
			return;
		}
		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_POLICE_BACKGROUND:
				return this.policeBackgroundComponent.isFormValid();
			case this.STEP_MENTAL_HEALTH_CONDITIONS:
				return this.mentalHealthConditionsComponent.isFormValid();
			case this.STEP_CRIMINAL_HISTORY:
				return this.criminalHistoryComponent.isFormValid();
			case this.STEP_FINGERPRINTS:
				return this.fingerprintsComponent.isFormValid();
		}
		return false;
	}
}
