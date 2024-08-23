import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, BizTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepBusinessLicenceCategoryComponent } from './step-business-licence-category.component';
import { StepBusinessLicenceTermComponent } from './step-business-licence-term.component';

@Component({
	selector: 'app-steps-business-licence-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="!isRenewalShortForm">
				<app-step-business-licence-category
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-category>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[isSoleProprietorCombinedFlow]="isSoleProprietorCombinedFlow"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_CATEGORY)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CATEGORY)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_CATEGORY)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-term
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					[bizTypeCode]="bizTypeCode"
				></app-step-business-licence-term>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[isSoleProprietorCombinedFlow]="isSoleProprietorCombinedFlow"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_TERM)"
					(previousStepperStep)="onLicenceTermGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_LICENCE_TERM)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_TERM)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceSelectionComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_CATEGORY = 1;
	readonly STEP_LICENCE_TERM = 2;

	@Input() isBusinessLicenceSoleProprietor!: boolean;
	@Input() isSoleProprietorCombinedFlow = false;
	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() isRenewalShortForm!: boolean;

	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() bizTypeCode!: BizTypeCode;

	@ViewChild(StepBusinessLicenceCategoryComponent) stepCategoryComponent!: StepBusinessLicenceCategoryComponent;
	@ViewChild(StepBusinessLicenceTermComponent) stepTermComponent!: StepBusinessLicenceTermComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	onLicenceTermGoToPreviousStep(): void {
		if (this.isRenewalShortForm) {
			this.onStepPrevious();
			return;
		}

		this.onGoToPreviousStep();
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_CATEGORY:
				return this.stepCategoryComponent.isFormValid();
			case this.STEP_LICENCE_TERM:
				return this.stepTermComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
