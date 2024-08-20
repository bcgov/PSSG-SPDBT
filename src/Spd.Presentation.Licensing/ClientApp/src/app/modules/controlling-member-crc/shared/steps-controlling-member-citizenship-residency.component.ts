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
			<mat-step>
				<app-step-controlling-member-citizenship
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-member-citizenship>

				<app-wizard-footer
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_CITIZENSHIP)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-fingerprints></app-step-controlling-member-fingerprints>

				<app-wizard-footer
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_FINGERPRINTS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-controlling-member-bc-driver-licence
					[applicationTypeCode]="applicationTypeCode"
				></app-step-controlling-member-bc-driver-licence>

				<app-wizard-footer
					(cancelAndExit)="onCancelAndExit()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_DRIVERS_LICENCE)"
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
}
