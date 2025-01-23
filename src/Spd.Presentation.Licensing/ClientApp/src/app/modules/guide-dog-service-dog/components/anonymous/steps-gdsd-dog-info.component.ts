import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-steps-gdsd-dog-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-dog-training-information></app-step-gdsd-dog-training-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_TRAINING_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_TRAINING_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-dog-information></app-step-gdsd-dog-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_INFO)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_DOG_INFO)"
					(nextReviewStepperStep)="onNextReview(STEP_DOG_INFO)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdDogInfoComponent extends BaseWizardStepComponent {
	// If step ordering changes, crucial  to update this <- look for this comment below
	readonly STEP_TRAINING_INFO = 0;
	readonly STEP_DOG_INFO = 1;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	applicationTypeCodes = ApplicationTypeCode;

	// @ViewChild(StepWorkerLicenceTermsOfUseComponent)
	// termsOfUseComponent!: StepWorkerLicenceTermsOfUseComponent;

	// @ViewChild(StepWorkerLicenceSoleProprietorComponent)
	// soleProprietorComponent!: StepWorkerLicenceSoleProprietorComponent;

	// @ViewChild(StepWorkerLicenceExpiredComponent)
	// licenceExpiredComponent!: StepWorkerLicenceExpiredComponent;

	constructor(private commonApplicationService: CommonApplicationService) {
		super();
	}

	// isStepToSave(): boolean {
	// 	const index = this.childstepper.selectedIndex;
	// 	return index >= 2;
	// }

	override dirtyForm(step: number): boolean {
		// switch (step) {
		// 	case this.STEP_TRAINING_INFO:
		// 		return this.termsOfUseComponent.isFormValid();
		// 	case this.STEP_DOG_INFO:
		// 		return this.soleProprietorComponent.isFormValid();
		// 	case this.STEP_ACCREDITED_GRADUATION_INFO:
		// 		return true;
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
