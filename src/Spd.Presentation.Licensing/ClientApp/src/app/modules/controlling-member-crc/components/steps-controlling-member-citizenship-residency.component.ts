import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepControllingMemberBcDriverLicenceComponent } from './step-controlling-member-bc-driver-licence.component';
import { StepControllingMemberCitizenshipComponent } from './step-controlling-member-citizenship.component';
import { StepControllingMemberFingerprintsComponent } from './step-controlling-member-fingerprints.component';

@Component({
	selector: 'app-steps-controlling-member-citizenship-residency',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="isNew">
				<app-step-controlling-member-citizenship></app-step-controlling-member-citizenship>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_CITIZENSHIP)"
					(nextReviewStepperStep)="onNextReview(STEP_CITIZENSHIP)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-fingerprints></app-step-controlling-member-fingerprints>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onFingerprintsPreviousStep()"
					(nextStepperStep)="onFingerprintsNextStep(STEP_FINGERPRINTS)"
					(nextReviewStepperStep)="onNextReview(STEP_FINGERPRINTS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNew">
				<app-step-controlling-member-bc-driver-licence></app-step-controlling-member-bc-driver-licence>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_DRIVERS_LICENCE)"
					(nextReviewStepperStep)="onNextReview(STEP_DRIVERS_LICENCE)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsControllingMemberCitizenshipResidencyComponent extends BaseWizardStepComponent {
	readonly STEP_CITIZENSHIP = 0;
	readonly STEP_FINGERPRINTS = 1;
	readonly STEP_DRIVERS_LICENCE = 2;

	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepControllingMemberCitizenshipComponent) stepCitizenship!: StepControllingMemberCitizenshipComponent;
	@ViewChild(StepControllingMemberFingerprintsComponent) stepFingerprints!: StepControllingMemberFingerprintsComponent;
	@ViewChild(StepControllingMemberBcDriverLicenceComponent)
	stepDriversLicence!: StepControllingMemberBcDriverLicenceComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	onFingerprintsPreviousStep(): void {
		if (this.isNew) {
			super.onGoToPreviousStep();
			return;
		}

		super.onStepPrevious();
	}

	onFingerprintsNextStep(step: number): void {
		if (this.isNew) {
			super.onFormValidNextStep(step);
			return;
		}

		super.onStepNext(step);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CITIZENSHIP:
				return this.stepCitizenship.isFormValid();
			case this.STEP_FINGERPRINTS:
				return this.stepFingerprints.isFormValid();
			case this.STEP_DRIVERS_LICENCE:
				return this.stepDriversLicence.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
