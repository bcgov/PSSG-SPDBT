import { Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { StepPermitEmployerInformationComponent } from '../../anonymous/permit-wizard-steps/step-permit-employer-information.component';
import { StepPermitRationaleComponent } from '../../anonymous/permit-wizard-steps/step-permit-rationale.component';
import { StepPermitReasonComponent } from '../../anonymous/permit-wizard-steps/step-permit-reason.component';
import { StepPermitReprintComponent } from '../../shared/permit-wizard-steps/step-permit-reprint.component';
import { StepPermitPhotographOfYourselfComponent } from './step-permit-photograph-of-yourself.component';
import { StepPermitReviewNameChangeComponent } from './step-permit-review-name-change.component';

@Component({
	selector: 'app-steps-permit-updates-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="hasBcscNameChanged">
				<app-step-permit-review-name-change></app-step-permit-review-name-change>

				<app-wizard-footer
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onFormValidNextStep(STEP_NAME_CHANGE)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showReprint">
				<app-step-permit-reprint [applicationTypeCode]="applicationTypeCode"></app-step-permit-reprint>

				<app-wizard-footer
					(previousStepperStep)="onStepUpdatePrevious(STEP_REPRINT)"
					(nextStepperStep)="onFormValidNextStep(STEP_REPRINT)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="hasGenderChanged">
				<app-step-permit-photograph-of-yourself
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-photograph-of-yourself>

				<app-wizard-footer
					(previousStepperStep)="onStepUpdatePrevious(STEP_PHOTOGRAPH_OF_YOURSELF)"
					(nextStepperStep)="onFormValidNextStep(STEP_PHOTOGRAPH_OF_YOURSELF)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-reason
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-reason>

				<app-wizard-footer
					(previousStepperStep)="onStepUpdatePrevious(STEP_REASON)"
					(nextStepperStep)="onFormValidNextStep(STEP_REASON)"
				></app-wizard-footer>
			</mat-step>

			<mat-step *ngIf="showEmployerInformation">
				<app-step-permit-employer-information
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-employer-information>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_EMPLOYER_INFORMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-rationale
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-rationale>

				<app-wizard-footer
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onStepNext(STEP_RATIONALE)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitUpdatesAuthenticatedComponent extends BaseWizardStepComponent {
	readonly STEP_NAME_CHANGE = 0;
	readonly STEP_REPRINT = 1;
	readonly STEP_PHOTOGRAPH_OF_YOURSELF = 2;
	readonly STEP_REASON = 3;
	readonly STEP_EMPLOYER_INFORMATION = 4;
	readonly STEP_RATIONALE = 5;

	@Input() hasBcscNameChanged = false;
	@Input() hasGenderChanged = false;
	@Input() showEmployerInformation = true;

	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode = ApplicationTypeCode.Update;

	@ViewChild(StepPermitReviewNameChangeComponent)
	stepNameChangeComponent!: StepPermitReviewNameChangeComponent;
	@ViewChild(StepPermitPhotographOfYourselfComponent)
	stepPhotographOfYourselfComponent!: StepPermitPhotographOfYourselfComponent;
	@ViewChild(StepPermitReasonComponent) stepReasonComponent!: StepPermitReasonComponent;
	@ViewChild(StepPermitRationaleComponent) stepRationaleComponent!: StepPermitRationaleComponent;
	@ViewChild(StepPermitReprintComponent) stepReprintComponent!: StepPermitReprintComponent;
	@ViewChild(StepPermitEmployerInformationComponent) stepEmployerComponent!: StepPermitEmployerInformationComponent;

	constructor(override commonApplicationService: CommonApplicationService) {
		super(commonApplicationService);
	}

	onStepUpdatePrevious(step: number): void {
		switch (step) {
			case this.STEP_REPRINT:
				if (this.hasBcscNameChanged) {
					this.childstepper.previous();
					return;
				}
				break;
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				if (this.showReprint || this.hasBcscNameChanged) {
					this.childstepper.previous();
					return;
				}
				break;
			case this.STEP_REASON:
				if (this.hasGenderChanged || this.showReprint || this.hasBcscNameChanged) {
					this.childstepper.previous();
					return;
				}
				break;
			default:
				console.error('Unknown Form', step);
		}

		this.previousStepperStep.emit(true);
	}

	override dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_NAME_CHANGE:
				return this.stepNameChangeComponent.isFormValid();
			case this.STEP_REPRINT:
				return this.stepReprintComponent.isFormValid();
			case this.STEP_PHOTOGRAPH_OF_YOURSELF:
				return this.stepPhotographOfYourselfComponent.isFormValid();
			case this.STEP_REASON:
				return this.stepReasonComponent.isFormValid();
			case this.STEP_EMPLOYER_INFORMATION:
				return this.stepEmployerComponent.isFormValid();
			case this.STEP_RATIONALE:
				return this.stepRationaleComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}

	// for Update flow: only show if they changed their sex selection earlier in the application
	// and name change
	get showReprint(): boolean {
		return this.hasGenderChanged || this.hasBcscNameChanged;
	}
}
