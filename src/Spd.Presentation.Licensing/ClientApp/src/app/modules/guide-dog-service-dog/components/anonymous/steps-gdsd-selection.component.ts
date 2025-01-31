import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepGdsdDogCertificationSelectionComponent } from '../shared/common-step-components/step-gdsd-dog-certification-selection.component';
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
					(nextStepperStep)="onFormValidNextStep(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-gdsd-dog-certification-selection></app-step-gdsd-dog-certification-selection>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_CERTIFICATION)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsGdsdSelectionComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_CHECKLIST = 1;
	readonly STEP_CERTIFICATION = 2;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@ViewChild(StepGdsdTermsOfUseComponent) termsOfUseComponent!: StepGdsdTermsOfUseComponent;
	@ViewChild(StepGdsdDogCertificationSelectionComponent) certComponent!: StepGdsdDogCertificationSelectionComponent;

	constructor() {
		super();
	}

	override dirtyForm(_step: number): boolean {
		// switch (step) {
		// 	case this.STEP_TERMS:
		// 		return this.termsOfUseComponent.isFormValid();
		// 	case this.STEP_CHECKLIST:
		// 		return true;
		// 	case this.STEP_CERTIFICATION:
		// 		return this.certComponent.isFormValid();
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
