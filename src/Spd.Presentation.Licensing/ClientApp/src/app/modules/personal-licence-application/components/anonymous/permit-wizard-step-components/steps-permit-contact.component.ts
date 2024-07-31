import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepPermitContactInformationComponent } from './step-permit-contact-information.component';
import { StepPermitMailingAddressComponent } from './step-permit-mailing-address.component';
import { StepPermitResidentialAddressComponent } from './step-permit-residential-address.component';

@Component({
	selector: 'app-steps-permit-contact',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-residential-address
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-residential-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_RESIDENTIAL_ADDRESS)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_RESIDENTIAL_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_RESIDENTIAL_ADDRESS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-mailing-address [applicationTypeCode]="applicationTypeCode"></app-step-permit-mailing-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_MAILING_ADDRESS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_MAILING_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_MAILING_ADDRESS)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-contact-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-contact-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CONTACT_INFORMATION)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_CONTACT_INFORMATION)"
					(nextReviewStepperStep)="onNextReview(STEP_CONTACT_INFORMATION)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitContactComponent extends BaseWizardStepComponent {
	readonly STEP_RESIDENTIAL_ADDRESS = 1;
	readonly STEP_MAILING_ADDRESS = 2;
	readonly STEP_CONTACT_INFORMATION = 3;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isFormValid = false;
	@Input() showSaveAndExit = false;

	@ViewChild(StepPermitResidentialAddressComponent)
	stepResidentialAddressComponent!: StepPermitResidentialAddressComponent;
	@ViewChild(StepPermitMailingAddressComponent) stepMailingAddressComponent!: StepPermitMailingAddressComponent;
	@ViewChild(StepPermitContactInformationComponent)
	stepContactInformationComponent!: StepPermitContactInformationComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		if (!isValid) return;

		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_RESIDENTIAL_ADDRESS:
				return this.stepResidentialAddressComponent.isFormValid();
			case this.STEP_MAILING_ADDRESS:
				return this.stepMailingAddressComponent.isFormValid();
			case this.STEP_CONTACT_INFORMATION:
				return this.stepContactInformationComponent.isFormValid();
		}
		return false;
	}
}
