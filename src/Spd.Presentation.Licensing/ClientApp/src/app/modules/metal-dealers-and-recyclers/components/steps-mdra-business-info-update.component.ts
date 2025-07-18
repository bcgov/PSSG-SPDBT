import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepMdraBusinessAddressUpdateComponent } from './step-mdra-business-address-update.component';
import { StepMdraBusinessOwnerUpdateComponent } from './step-mdra-business-owner-update.component';

@Component({
	selector: 'app-steps-mdra-business-info-update',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-mdra-business-owner-update></app-step-mdra-business-owner-update>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_OWNER)"
					(nextReviewStepperStep)="onNextReview(STEP_OWNER)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-mdra-business-address-update></app-step-mdra-business-address-update>

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
export class StepsMdraBusinessInfoUpdateComponent extends BaseWizardStepComponent {
	readonly STEP_OWNER = 0;
	readonly STEP_ADDRESS = 1;

	@Input() isFormValid = false;

	@ViewChild(StepMdraBusinessOwnerUpdateComponent) ownerComponent!: StepMdraBusinessOwnerUpdateComponent;
	@ViewChild(StepMdraBusinessAddressUpdateComponent) addressComponent!: StepMdraBusinessAddressUpdateComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_OWNER:
				return this.ownerComponent.isFormValid();
			case this.STEP_ADDRESS:
				return this.addressComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
