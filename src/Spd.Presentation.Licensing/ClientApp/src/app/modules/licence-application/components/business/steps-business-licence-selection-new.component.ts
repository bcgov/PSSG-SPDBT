import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepBusinessLicenceCategoryComponent } from './step-business-licence-category.component';
import { StepBusinessLicenceTermComponent } from './step-business-licence-term.component';

@Component({
	selector: 'app-steps-business-licence-selection-new',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-category
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
				></app-step-business-licence-category>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_LICENCE_CATEGORY)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_CATEGORY)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-term
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
				></app-step-business-licence-term>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_LICENCE_TERM)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_TERM)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceSelectionNewComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_CATEGORY = 1;
	readonly STEP_LICENCE_TERM = 2;

	isFormValid = false;

	@Input() isBusinessLicenceSoleProprietor!: boolean;

	@ViewChild(StepBusinessLicenceCategoryComponent) stepCategoryComponent!: StepBusinessLicenceCategoryComponent;
	@ViewChild(StepBusinessLicenceTermComponent) stepTermComponent!: StepBusinessLicenceTermComponent;

	constructor(override commonApplicationService: CommonApplicationService) {
		super(commonApplicationService);
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
