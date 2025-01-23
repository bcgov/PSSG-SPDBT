import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-steps-gdsd-personal-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-gdsd-personal-information-anonymous></app-step-gdsd-personal-information-anonymous>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PERSONAL_INFO)"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_PERSONAL_INFO)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-photograph-of-yourself></app-step-gdsd-photograph-of-yourself>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_PHOTO_OF_YOURSELF)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTO_OF_YOURSELF)"
					(nextReviewStepperStep)="onNextReview(STEP_PHOTO_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-government-id-anonymous></app-step-gdsd-government-id-anonymous>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_GOV_ID)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_GOV_ID)"
					(nextReviewStepperStep)="onNextReview(STEP_GOV_ID)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-mailing-address></app-step-gdsd-mailing-address>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_MAILING_ADDRESS)"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_MAILING_ADDRESS)"
					(nextReviewStepperStep)="onNextReview(STEP_MAILING_ADDRESS)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdPersonalInfoComponent extends BaseWizardStepComponent {
	// If step ordering changes, crucial  to update this <- look for this comment below
	readonly STEP_PERSONAL_INFO = 0;
	readonly STEP_PHOTO_OF_YOURSELF = 1;
	readonly STEP_GOV_ID = 2;
	readonly STEP_MAILING_ADDRESS = 7;

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

	// @ViewChild(StepWorkerLicenceCategoryComponent)
	// licenceCategoryComponent!: StepWorkerLicenceCategoryComponent;

	constructor(private commonApplicationService: CommonApplicationService) {
		super();
	}

	// isStepToSave(): boolean {
	// 	const index = this.childstepper.selectedIndex;
	// 	return index >= 2;
	// }

	override dirtyForm(step: number): boolean {
		// switch (step) {
		// 	case this.STEP_PERSONAL_INFO:
		// 		return this.termsOfUseComponent.isFormValid();
		// 	case this.STEP_PHOTO_OF_YOURSELF:
		// 		return this.soleProprietorComponent.isFormValid();
		// 	case this.STEP_GOV_ID:
		// 		return true;
		// 	case this.STEP_MAILING_ADDRESS:
		// 		return this.licenceExpiredComponent.isFormValid();
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
