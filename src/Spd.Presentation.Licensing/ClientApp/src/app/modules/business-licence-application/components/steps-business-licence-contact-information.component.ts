import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepBusinessLicenceManagerInformationComponent } from './step-business-licence-manager-information.component';

@Component({
    selector: 'app-steps-business-licence-contact-information',
    template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-business-licence-manager-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-manager-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_LICENCE_MANAGER_INFORMATION)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNext(STEP_LICENCE_MANAGER_INFORMATION)"
					(nextReviewStepperStep)="onNextReview(STEP_LICENCE_MANAGER_INFORMATION)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
    styles: [],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class StepsBusinessLicenceContactInformationComponent extends BaseWizardStepComponent {
	readonly STEP_LICENCE_MANAGER_INFORMATION = 0;

	@Input() isFormValid!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepBusinessLicenceManagerInformationComponent)
	stepManagerInformationComponent!: StepBusinessLicenceManagerInformationComponent;

	constructor() {
		super();
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_MANAGER_INFORMATION:
				return this.stepManagerInformationComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
