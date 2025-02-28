import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepTeamDogInfoComponent } from './step-team-dog-info.component';
import { StepTeamDogMedicalComponent } from './step-team-dog-medical.component';

@Component({
	selector: 'app-steps-team-dog-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-team-dog-info
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
				></app-step-team-dog-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNextDogInfo()"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_INFO)"
				></app-wizard-footer>
			</mat-step>

			<ng-container *ngIf="showDogMedicalStep">
				<mat-step>
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
			</ng-container>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsTeamDogInfoComponent extends BaseWizardStepComponent {
	readonly STEP_DOG_INFO = 0;
	readonly STEP_DOG_MEDICAL = 1;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isTrainedByAccreditedSchools!: boolean;

	@ViewChild(StepTeamDogInfoComponent) dogInfoComponent!: StepTeamDogInfoComponent;
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
}
