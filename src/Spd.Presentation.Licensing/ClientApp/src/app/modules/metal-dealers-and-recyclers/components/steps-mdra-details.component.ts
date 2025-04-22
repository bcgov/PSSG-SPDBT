import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepMdraTermsOfUseComponent } from './step-mdra-terms-of-use.component';

@Component({
	selector: 'app-steps-mdra-details',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-mdra-terms-of-use></app-step-mdra-terms-of-use>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(nextStepperStep)="onFormValidNextStep(STEP_TERMS)"
					(nextReviewStepperStep)="onNextReview(STEP_TERMS)"
				></app-wizard-footer>
			</mat-step>

			<!-- // TODO MDRA add do you have an expired licence question -->

			<mat-step>
				<ng-container *ngIf="isNew; else isRenewal">
					<app-step-mdra-checklist-new></app-step-mdra-checklist-new>
				</ng-container>
				<ng-template #isRenewal>
					<app-step-mdra-checklist-new></app-step-mdra-checklist-new>
				</ng-template>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_CHECKLIST)"
					(nextReviewStepperStep)="onNextReview(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsMdraDetailsComponent extends BaseWizardStepComponent {
	readonly STEP_TERMS = 0;
	readonly STEP_CHECKLIST = 1;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepMdraTermsOfUseComponent) termsOfUseComponent!: StepMdraTermsOfUseComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_TERMS:
				return this.termsOfUseComponent.isFormValid();
			case this.STEP_CHECKLIST:
				return true;
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}
}
