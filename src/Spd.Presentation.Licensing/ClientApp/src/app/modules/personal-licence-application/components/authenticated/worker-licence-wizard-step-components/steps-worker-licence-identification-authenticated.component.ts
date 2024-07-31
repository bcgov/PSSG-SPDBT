import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepWorkerLicenceBcDriverLicenceComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-bc-driver-licence.component';
import { StepWorkerLicenceCitizenshipComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-citizenship.component';
import { StepWorkerLicenceFingerprintsComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-fingerprints.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-photograph-of-yourself.component';
import { StepWorkerLicencePhysicalCharacteristicsComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-physical-characteristics.component';
import { ApplicationService } from '@app/core/services/application.service';

@Component({
	selector: 'app-steps-worker-licence-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showCitizenshipStep">
				<app-step-worker-licence-citizenship
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-citizenship>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CITIZENSHIP)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_CITIZENSHIP)"
					(nextReviewStepperStep)="onNextReview(STEP_CITIZENSHIP)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNotRenewal">
				<app-step-worker-licence-fingerprints></app-step-worker-licence-fingerprints>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_FINGERPRINTS)"
					(previousStepperStep)="onFingerprintStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_FINGERPRINTS)"
					(nextReviewStepperStep)="onNextReview(STEP_FINGERPRINTS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-bc-driver-licence
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-bc-driver-licence>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_BC_DRIVERS_LICENCE)"
					(previousStepperStep)="onDriversLicenceStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_BC_DRIVERS_LICENCE)"
					(nextReviewStepperStep)="onNextReview(STEP_BC_DRIVERS_LICENCE)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-physical-characteristics
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-physical-characteristics>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_HEIGHT_AND_WEIGHT)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_HEIGHT_AND_WEIGHT)"
					(nextReviewStepperStep)="onNextReview(STEP_HEIGHT_AND_WEIGHT)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-photograph-of-yourself>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTO)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PHOTO)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsWorkerLicenceIdentificationAuthenticatedComponent extends BaseWizardStepComponent {
	readonly STEP_CITIZENSHIP = 1;
	readonly STEP_FINGERPRINTS = 2;
	readonly STEP_BC_DRIVERS_LICENCE = 3;
	readonly STEP_HEIGHT_AND_WEIGHT = 4;
	readonly STEP_PHOTO = 5;

	@Input() isFormValid = false;
	@Input() showCitizenshipStep = true;
	@Input() showSaveAndExit = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepWorkerLicenceCitizenshipComponent) citizenshipComponent!: StepWorkerLicenceCitizenshipComponent;
	@ViewChild(StepWorkerLicenceFingerprintsComponent) fingerprintsComponent!: StepWorkerLicenceFingerprintsComponent;
	@ViewChild(StepWorkerLicenceBcDriverLicenceComponent)
	bcDriverLicenceComponent!: StepWorkerLicenceBcDriverLicenceComponent;
	@ViewChild(StepWorkerLicencePhysicalCharacteristicsComponent)
	heightAndWeightComponent!: StepWorkerLicencePhysicalCharacteristicsComponent;
	@ViewChild(StepWorkerLicencePhotographOfYourselfComponent)
	photoComponent!: StepWorkerLicencePhotographOfYourselfComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	onFingerprintStepPrevious(): void {
		if (this.showCitizenshipStep) {
			this.childstepper.previous();
			return;
		}

		this.previousStepperStep.emit(true);
	}

	onDriversLicenceStepPrevious(): void {
		if (this.showCitizenshipStep || this.isNotRenewal) {
			this.childstepper.previous();
			return;
		}

		this.previousStepperStep.emit(true);
	}

	get isNotRenewal(): boolean {
		return this.applicationTypeCode != ApplicationTypeCode.Renewal;
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CITIZENSHIP:
				return this.citizenshipComponent.isFormValid();
			case this.STEP_FINGERPRINTS:
				return this.fingerprintsComponent.isFormValid();
			case this.STEP_BC_DRIVERS_LICENCE:
				return this.bcDriverLicenceComponent.isFormValid();
			case this.STEP_HEIGHT_AND_WEIGHT:
				return this.heightAndWeightComponent.isFormValid();
			case this.STEP_PHOTO:
				return this.photoComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
