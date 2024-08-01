import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepPermitEmployerInformationComponent } from './step-permit-employer-information.component';
import { StepPermitRationaleComponent } from './step-permit-rationale.component';
import { StepPermitReasonComponent } from './step-permit-reason.component';

@Component({
	selector: 'app-steps-permit-purpose-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-reason
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-reason>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_PERMIT_REASON)"
					(nextReviewStepperStep)="onNextReview(STEP_PERMIT_REASON)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showEmployerInformation">
				<app-step-permit-employer-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-employer-information>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_EMPLOYER_INFORMATION)"
					(nextReviewStepperStep)="onNextReview(STEP_EMPLOYER_INFORMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-rationale
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-rationale>

				<app-wizard-footer
					[isFormValid]="isFormValid"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_PERMIT_RATIONALE)"
					(nextReviewStepperStep)="onNextReview(STEP_PERMIT_RATIONALE)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitPurposeAnonymousComponent extends BaseWizardStepComponent {
	readonly STEP_PERMIT_REASON = 1;
	readonly STEP_EMPLOYER_INFORMATION = 2;
	readonly STEP_PERMIT_RATIONALE = 3;

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() isFormValid = false;
	@Input() showEmployerInformation = false;

	@ViewChild(StepPermitReasonComponent) stepPermitReasonComponent!: StepPermitReasonComponent;
	@ViewChild(StepPermitEmployerInformationComponent)
	stepEmployerInformationComponent!: StepPermitEmployerInformationComponent;
	@ViewChild(StepPermitRationaleComponent) stepPermitRationaleComponent!: StepPermitRationaleComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	override onFormValidNextStep(_formNumber: number): void {
		const isValid = this.dirtyForm(_formNumber);
		if (!isValid) return;

		this.childNextStep.next(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_PERMIT_REASON:
				return this.stepPermitReasonComponent.isFormValid();
			case this.STEP_EMPLOYER_INFORMATION:
				return this.stepEmployerInformationComponent.isFormValid();
			case this.STEP_PERMIT_RATIONALE:
				return this.stepPermitRationaleComponent.isFormValid();
		}
		return false;
	}
}
