import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-steps-gdsd-training-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-accredited-graduation></app-step-gdsd-accredited-graduation>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_TERMS)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNext(STEP_TERMS)"
					(nextReviewStepperStep)="onNextReview(STEP_TERMS)"
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
	readonly STEP_TERMS = 0;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	applicationTypeCodes = ApplicationTypeCode;

	// @ViewChild(StepWorkerLicenceTermsOfUseComponent)
	// termsOfUseComponent!: StepWorkerLicenceTermsOfUseComponent;

	constructor(private commonApplicationService: CommonApplicationService) {
		super();
	}

	override dirtyForm(step: number): boolean {
		// switch (step) {
		// 	case this.STEP_TERMS:
		// 		return this.termsOfUseComponent.isFormValid();
		// 	default:
		// 		console.error('Unknown Form', step);
		// }
		// return false;
		return true;
	}

	// get isRenewalOrUpdate(): boolean {
	// 	return (
	// 		this.applicationTypeCode === ApplicationTypeCode.Renewal ||
	// 		this.applicationTypeCode === ApplicationTypeCode.Update
	// 	);
	// }
}
