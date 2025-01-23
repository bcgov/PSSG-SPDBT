import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { StepGdsdChecklistNewComponent } from '../shared/common-step-components/step-gdsd-checklist-new.component';
import { StepGdsdTermsOfUseComponent } from '../shared/common-step-components/step-gdsd-terms-of-use.component';

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

	@ViewChild(StepGdsdTermsOfUseComponent) termsOfUseComponent!: StepGdsdTermsOfUseComponent;

	@ViewChild(StepGdsdChecklistNewComponent) checklistComponent!: StepGdsdChecklistNewComponent;

	constructor(private commonApplicationService: CommonApplicationService) {
		super();
	}

	onGotoUserProfile(): void {
		this.commonApplicationService.onGotoSwlUserProfile(this.applicationTypeCode!);
	}

	override dirtyForm(step: number): boolean {
		// switch (step) {
		// 	case this.STEP_TERMS:
		// 		return this.termsOfUseComponent.isFormValid();
		// 	case this.STEP_CHECKLIST:
		// 		return this.checklistComponent.isFormValid();
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
}
