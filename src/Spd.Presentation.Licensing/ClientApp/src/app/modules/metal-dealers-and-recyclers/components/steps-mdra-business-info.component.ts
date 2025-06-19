import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepMdraBusinessAddressComponent } from './step-mdra-business-address.component';
import { StepMdraBusinessManagerComponent } from './step-mdra-business-manager.component';
import { StepMdraBusinessOwnerComponent } from './step-mdra-business-owner.component';

@Component({
	selector: 'app-steps-mdra-business-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-mdra-business-owner [applicationTypeCode]="applicationTypeCode"></app-step-mdra-business-owner>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_OWNER)"
					(nextReviewStepperStep)="onNextReview(STEP_OWNER)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-mdra-business-manager [applicationTypeCode]="applicationTypeCode"></app-step-mdra-business-manager>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MANAGER)"
					(nextReviewStepperStep)="onNextReview(STEP_MANAGER)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-mdra-business-address [applicationTypeCode]="applicationTypeCode"></app-step-mdra-business-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_ADDRESS)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsMdraBusinessInfoComponent extends BaseWizardStepComponent {
	readonly STEP_OWNER = 0;
	readonly STEP_MANAGER = 1;
	readonly STEP_ADDRESS = 2;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepMdraBusinessOwnerComponent) ownerComponent!: StepMdraBusinessOwnerComponent;
	@ViewChild(StepMdraBusinessManagerComponent) managerComponent!: StepMdraBusinessManagerComponent;
	@ViewChild(StepMdraBusinessAddressComponent) addressComponent!: StepMdraBusinessAddressComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_OWNER:
				return this.ownerComponent.isFormValid();
			case this.STEP_MANAGER:
				return this.managerComponent.isFormValid();
			case this.STEP_ADDRESS:
				return this.addressComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
