import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepRdDogInfoComponent } from './step-rd-dog-info.component';

@Component({
	selector: 'app-steps-rd-dog-info',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-rd-dog-info [applicationTypeCode]="applicationTypeCode"></app-step-rd-dog-info>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onSaveAndExit(STEP_DOG_INFO)"
					(previousStepperStep)="onStepPrevious()"
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
export class StepsRdDogInfoComponent extends BaseWizardStepComponent {
	readonly STEP_DOG_INFO = 0;

	@Input() isLoggedIn = false;
	@Input() showSaveAndExit = false;
	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepRdDogInfoComponent) dogInfoComponent!: StepRdDogInfoComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_DOG_INFO:
				return this.dogInfoComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
