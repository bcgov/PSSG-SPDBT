import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepGdsdAccreditedGraduationComponent } from '../shared/common-step-components/step-gdsd-accredited-graduation.component';

@Component({
	selector: 'app-steps-gdsd-training-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-accredited-graduation></app-step-gdsd-accredited-graduation>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_ACCREDITED)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNext(STEP_ACCREDITED)"
					(nextReviewStepperStep)="onNextReview(STEP_ACCREDITED)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdTrainingInfoComponent extends BaseWizardStepComponent {
	// If step ordering changes, crucial  to update this <- look for this comment below
	readonly STEP_ACCREDITED = 0;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	applicationTypeCodes = ApplicationTypeCode;

	@ViewChild(StepGdsdAccreditedGraduationComponent) accreditedComponent!: StepGdsdAccreditedGraduationComponent;

	constructor() {
		super();
	}

	override dirtyForm(_step: number): boolean {
		// switch (step) {
		// 	case this.STEP_ACCREDITED:
		// 		return this.accreditedComponent.isFormValid();
		// 	default:
		// 		console.error('Unknown Form', step);
		// }
		// return false;
		return true;
	}
}
