import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-steps-gdsd-review-confirm',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-summary></app-step-gdsd-summary>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_SUMMARY)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-consent></app-step-gdsd-consent>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_CONSENT)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onSubmitNow()"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdReviewConfirmComponent extends BaseWizardStepComponent {
	// If step ordering changes, crucial  to update this <- look for this comment below
	readonly STEP_SUMMARY = 0;
	readonly STEP_CONSENT = 1;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	applicationTypeCodes = ApplicationTypeCode;

	// @ViewChild(StepWorkerLicenceTermsOfUseComponent)
	// termsOfUseComponent!: StepWorkerLicenceTermsOfUseComponent;

	// @ViewChild(StepWorkerLicenceSoleProprietorComponent)
	// soleProprietorComponent!: StepWorkerLicenceSoleProprietorComponent;

	constructor(private commonApplicationService: CommonApplicationService) {
		super();
	}

	onSubmitNow(): void {
		// if (!this.consentAndDeclarationComponent.isFormValid()) {
		// 	return;
		// }

		this.nextSubmitStep.emit();
	}

	override dirtyForm(step: number): boolean {
		// switch (step) {
		// 	case this.STEP_TERMS:
		// 		return this.termsOfUseComponent.isFormValid();
		// 	case this.STEP_SOLE_PROPRIETOR:
		// 		return this.soleProprietorComponent.isFormValid();
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
