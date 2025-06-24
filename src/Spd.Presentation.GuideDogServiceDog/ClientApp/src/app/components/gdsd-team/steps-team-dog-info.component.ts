import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepTeamDogInfoComponent } from './step-team-dog-info.component';
import { StepTeamDogInoculationsComponent } from './step-team-dog-inoculations.component';
import { StepTeamDogMedicalComponent } from './step-team-dog-medical.component';
import { StepTeamDogServiceInfoComponent } from './step-team-dog-service-info.component';

@Component({
	selector: 'app-steps-team-dog-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-team-dog-info [applicationTypeCode]="applicationTypeCode"></app-step-team-dog-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNextDogInfo()"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showDogServiceStep">
				<app-step-team-dog-service-info
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
				></app-step-team-dog-service-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_SERVICE_INFO)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNextDogServiceInfo()"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_SERVICE_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showDogMedicalStep">
				<app-step-team-dog-inoculations></app-step-team-dog-inoculations>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_INOCULATIONS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_DOG_INOCULATIONS)"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_INOCULATIONS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showDogMedicalStep">
				<app-step-team-dog-medical></app-step-team-dog-medical>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_MEDICAL)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_DOG_MEDICAL)"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_MEDICAL)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsTeamDogInfoComponent extends BaseWizardStepComponent {
	readonly STEP_DOG_INFO = 0;
	readonly STEP_DOG_SERVICE_INFO = 1;
	readonly STEP_DOG_INOCULATIONS = 2;
	readonly STEP_DOG_MEDICAL = 3;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;

	@ViewChild(StepTeamDogInfoComponent) dogInfoComponent!: StepTeamDogInfoComponent;
	@ViewChild(StepTeamDogServiceInfoComponent) dogServiceInfoComponent!: StepTeamDogServiceInfoComponent;
	@ViewChild(StepTeamDogInoculationsComponent) dogInoculationsComponent!: StepTeamDogInoculationsComponent;
	@ViewChild(StepTeamDogMedicalComponent) dogMedicalComponent!: StepTeamDogMedicalComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	onStepNextDogInfo(): void {
		const isValid = this.dirtyForm(this.STEP_DOG_INFO);
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		if (this.showDogServiceStep || this.showDogMedicalStep) {
			this.childNextStep.emit(true);
			return;
		}

		this.nextStepperStep.emit(true);
	}

	onStepNextDogServiceInfo(): void {
		const isValid = this.dirtyForm(this.STEP_DOG_SERVICE_INFO);
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		if (this.showDogMedicalStep) {
			this.childNextStep.emit(true);
			return;
		}

		this.nextStepperStep.emit(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_DOG_INFO:
				return this.dogInfoComponent.isFormValid();
			case this.STEP_DOG_SERVICE_INFO:
				return this.dogServiceInfoComponent.isFormValid();
			case this.STEP_DOG_INOCULATIONS:
				return this.dogInoculationsComponent.isFormValid();
			case this.STEP_DOG_MEDICAL:
				return this.dogMedicalComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
	get showDogMedicalStep(): boolean {
		return this.isNew && !this.isTrainedByAccreditedSchools;
	}
	get showDogServiceStep(): boolean {
		return (this.isNew && this.isTrainedByAccreditedSchools) || !this.isNew;
	}
}
