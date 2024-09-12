import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepControllingMemberBcSecurityLicenceHistoryComponent } from './step-controlling-member-bc-security-licence-history.component';
import { StepControllingMemberMentalHealthConditionsComponent } from './step-controlling-member-mental-health-conditions.component';
import { StepControllingMemberPoliceBackgroundComponent } from './step-controlling-member-police-background.component';

@Component({
	selector: 'app-steps-controlling-member-background',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-controlling-member-bc-security-licence-history
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-member-bc-security-licence-history>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="isLoggedIn"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_HISTORY)"
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_HISTORY)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_HISTORY)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-police-background
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-member-police-background>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="isLoggedIn"
					(saveAndExit)="onSaveAndExit(STEP_POLICE_BACKGROUND)"
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_POLICE_BACKGROUND)"
					(nextReviewStepperStep)="onNextReview(STEP_POLICE_BACKGROUND)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-mental-health-conditions
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-member-mental-health-conditions>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="isLoggedIn"
					(saveAndExit)="onSaveAndExit(STEP_MENTAL_HEALTH)"
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_MENTAL_HEALTH)"
					(nextReviewStepperStep)="onNextReview(STEP_MENTAL_HEALTH)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsControllingMemberBackgroundComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_HISTORY = 0;
	readonly STEP_POLICE_BACKGROUND = 1;
	readonly STEP_MENTAL_HEALTH = 2;

	@Input() isFormValid!: boolean;
	@Input() isLoggedIn!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepControllingMemberBcSecurityLicenceHistoryComponent)
	stepLicenceHistory!: StepControllingMemberBcSecurityLicenceHistoryComponent;
	@ViewChild(StepControllingMemberPoliceBackgroundComponent)
	stepPoliceBackground!: StepControllingMemberPoliceBackgroundComponent;
	@ViewChild(StepControllingMemberMentalHealthConditionsComponent)
	stepMentalHealth!: StepControllingMemberMentalHealthConditionsComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_HISTORY:
				return this.stepLicenceHistory.isFormValid();
			case this.STEP_POLICE_BACKGROUND:
				return this.stepPoliceBackground.isFormValid();
			case this.STEP_MENTAL_HEALTH:
				return this.stepMentalHealth.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
