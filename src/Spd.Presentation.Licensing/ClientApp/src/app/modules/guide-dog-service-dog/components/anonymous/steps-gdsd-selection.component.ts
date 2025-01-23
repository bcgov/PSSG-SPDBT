import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-steps-gdsd-selection',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="showTermsOfUse">
				<app-step-gdsd-terms-of-use [applicationTypeCode]="applicationTypeCode"></app-step-gdsd-terms-of-use>

				<app-wizard-footer (nextStepperStep)="onFormValidNextStep(STEP_TERMS)"></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-checklist-new></app-step-gdsd-checklist-new>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdSelectionComponent extends BaseWizardStepComponent {
	// If step ordering changes, crucial  to update this <- look for this comment below
	readonly STEP_TERMS = 0;
	readonly STEP_CHECKLIST = 1;

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

	onGotoUserProfile(): void {
		this.commonApplicationService.onGotoSwlUserProfile(this.applicationTypeCode!);
	}

	// isStepToSave(): boolean {
	// 	const index = this.childstepper.selectedIndex;
	// 	return index >= 2;
	// }

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

	get showTermsOfUse(): boolean {
		// anonymous: agree everytime for all
		return !this.isLoggedIn;
	}

	// get isRenewalOrUpdate(): boolean {
	// 	return (
	// 		this.applicationTypeCode === ApplicationTypeCode.Renewal ||
	// 		this.applicationTypeCode === ApplicationTypeCode.Update
	// 	);
	// }
}
