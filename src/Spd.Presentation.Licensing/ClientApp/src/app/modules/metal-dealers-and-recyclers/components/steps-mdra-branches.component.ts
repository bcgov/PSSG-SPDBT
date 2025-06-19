import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { UtilService } from '@app/core/services/util.service';
import { StepMdraBranchesComponent } from './step-mdra-branches.component';

@Component({
	selector: 'app-steps-mdra-branches',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-mdra-branches [applicationTypeCode]="applicationTypeCode"></app-step-mdra-branches>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					[showSaveAndExit]="false"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onStepNext(STEP_BRANCHES)"
					(nextReviewStepperStep)="onNextReview(STEP_BRANCHES)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
	standalone: false,
})
export class StepsMdraBranchesComponent extends BaseWizardStepComponent {
	readonly STEP_BRANCHES = 0;

	@Input() isFormValid = false;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepMdraBranchesComponent) branchesComponent!: StepMdraBranchesComponent;

	constructor(utilService: UtilService) {
		super(utilService);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_BRANCHES:
				return this.branchesComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
