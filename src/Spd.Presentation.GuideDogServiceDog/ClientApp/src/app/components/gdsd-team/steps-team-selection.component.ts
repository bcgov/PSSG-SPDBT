import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepTeamDogCertificationSelectionComponent } from './step-team-dog-certification-selection.component';
import { StepTeamTermsOfUseComponent } from './step-team-terms-of-use.component';

@Component({
	selector: 'app-steps-team-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-team-terms-of-use></app-step-team-terms-of-use>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(nextStepperStep)="onFormValidNextStep(STEP_TERMS)"
					(nextReviewStepperStep)="onNextReview(STEP_TERMS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<ng-container *ngIf="isNew; else isRenewal">
					<app-step-team-checklist-new></app-step-team-checklist-new>
				</ng-container>
				<ng-template #isRenewal>
					<app-step-team-checklist-renewal></app-step-team-checklist-renewal>
				</ng-template>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNextChecklist()"
					(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="isNew">
				<app-step-team-dog-certification-selection></app-step-team-dog-certification-selection>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_CERTIFICATION)"
					(nextReviewStepperStep)="onNextReview(STEP_CERTIFICATION)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsTeamSelectionComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_CHECKLIST = 1;
	readonly STEP_CERTIFICATION = 2;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepTeamTermsOfUseComponent) termsOfUseComponent!: StepTeamTermsOfUseComponent;
	@ViewChild(StepTeamDogCertificationSelectionComponent) certComponent!: StepTeamDogCertificationSelectionComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	onStepNextChecklist(): void {
		const isValid = this.dirtyForm(this.STEP_CHECKLIST);
		if (!isValid) {
			this.utilService.scrollToErrorSection();
			return;
		}

		if (this.isNew) {
			this.childNextStep.emit(true);
			return;
		}

		this.nextStepperStep.emit(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_CHECKLIST:
				return true;
			case this.STEP_CERTIFICATION:
				return this.certComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
