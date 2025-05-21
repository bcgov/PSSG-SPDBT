import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepWorkerLicenceBcDriverLicenceComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-bc-driver-licence.component';
import { StepWorkerLicenceCitizenshipComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-citizenship.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-photograph-of-yourself.component';

@Component({
	selector: 'app-steps-worker-licence-identification-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showFullCitizenshipQuestion || showNonCanadianCitizenshipQuestion">
				<app-step-worker-licence-citizenship
					[applicationTypeCode]="applicationTypeCode"
					[showFullCitizenshipQuestion]="showFullCitizenshipQuestion"
					[showNonCanadianCitizenshipQuestion]="showNonCanadianCitizenshipQuestion"
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
	standalone: false,
})
export class StepsWorkerLicenceIdentificationAuthenticatedComponent extends BaseWizardStepComponent {
	readonly STEP_CITIZENSHIP = 1;
	readonly STEP_BC_DRIVERS_LICENCE = 2;
	readonly STEP_PHOTO = 3;

	@Input() isFormValid = false;
	@Input() showFullCitizenshipQuestion = false;
	@Input() showNonCanadianCitizenshipQuestion = false;
	@Input() showSaveAndExit = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepWorkerLicenceCitizenshipComponent) citizenshipComponent!: StepWorkerLicenceCitizenshipComponent;
	@ViewChild(StepWorkerLicenceBcDriverLicenceComponent)
	bcDriverLicenceComponent!: StepWorkerLicenceBcDriverLicenceComponent;
	@ViewChild(StepWorkerLicencePhotographOfYourselfComponent)
	photoComponent!: StepWorkerLicencePhotographOfYourselfComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	onDriversLicenceStepPrevious(): void {
		if (this.showFullCitizenshipQuestion || this.showNonCanadianCitizenshipQuestion) {
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
			case this.STEP_BC_DRIVERS_LICENCE:
				return this.bcDriverLicenceComponent.isFormValid();
			case this.STEP_PHOTO:
				return this.photoComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
