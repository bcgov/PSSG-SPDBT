import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepBusinessLicenceCategoryComponent } from './step-business-licence-category.component';
import { StepBusinessLicenceManagerInformationComponent } from './step-business-licence-manager-information.component';
import { StepBusinessLicenceReprintComponent } from './step-business-licence-reprint.component';

@Component({
	selector: 'app-steps-business-licence-updates',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-category
					[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-business-licence-category>

				<app-wizard-footer
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onCategoryNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="!isBusinessLicenceSoleProprietor">
				<app-step-business-licence-manager-information
					[applicationTypeCode]="applicationTypeCodes.Update"
				></app-step-business-licence-manager-information>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onBusinessManagerNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="!isUpdateFlowWithHideReprintStep">
				<app-step-business-licence-reprint></app-step-business-licence-reprint>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_REPRINT)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsBusinessLicenceUpdatesComponent extends BaseWizardStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	readonly STEP_LICENCE_CATEGORY = 0;
	readonly STEP_MANAGER = 1;
	readonly STEP_REPRINT = 2;

	@Input() isBusinessLicenceSoleProprietor!: boolean;
	@Input() isUpdateFlowWithHideReprintStep!: boolean;

	@ViewChild(StepBusinessLicenceCategoryComponent) stepLicenceCategoryComponent!: StepBusinessLicenceCategoryComponent;
	@ViewChild(StepBusinessLicenceManagerInformationComponent)
	stepManagerComponent!: StepBusinessLicenceManagerInformationComponent;
	@ViewChild(StepBusinessLicenceReprintComponent) stepReprintComponent!: StepBusinessLicenceReprintComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_CATEGORY:
				return this.stepLicenceCategoryComponent.isFormValid();
			case this.STEP_MANAGER:
				return this.stepManagerComponent.isFormValid();
			case this.STEP_REPRINT:
				return this.stepReprintComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	onCategoryNextStep(): void {
		if (this.isBusinessLicenceSoleProprietor) {
			this.onStepNext(this.STEP_LICENCE_CATEGORY);
		} else {
			this.onFormValidNextStep(this.STEP_LICENCE_CATEGORY);
		}
	}

	onBusinessManagerNextStep(): void {
		if (this.isUpdateFlowWithHideReprintStep) {
			this.onStepNext(this.STEP_MANAGER);
		} else {
			this.onFormValidNextStep(this.STEP_MANAGER);
		}
	}
}