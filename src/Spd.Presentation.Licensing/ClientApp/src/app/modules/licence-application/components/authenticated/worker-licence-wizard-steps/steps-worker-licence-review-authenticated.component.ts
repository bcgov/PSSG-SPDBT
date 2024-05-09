import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { StepWorkerLicenceConsentAndDeclarationComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/step-worker-licence-consent-and-declaration.component';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { StepWorkerLicenceSummaryReviewAuthenticatedComponent } from './step-worker-licence-summary-review-authenticated.component';
import { StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent } from './step-worker-licence-summary-review-update-authenticated.component';

@Component({
	selector: 'app-steps-worker-licence-review-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update; else notUpdateReview">
					<app-step-worker-licence-summary-review-update-authenticated></app-step-worker-licence-summary-review-update-authenticated>
				</ng-container>
				<ng-template #notUpdateReview>
					<app-step-worker-licence-summary-review-authenticated
						(editStep)="onGoToStep($event)"
					></app-step-worker-licence-summary-review-authenticated>
				</ng-template>

				<app-wizard-footer
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-consent-and-declaration
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-consent-and-declaration>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update; else notUpdateConsent">
					<app-wizard-footer
						nextButtonLabel="Submit"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onSubmitNow()"
					></app-wizard-footer>
				</ng-container>
				<ng-template #notUpdateConsent>
					<app-wizard-footer
						nextButtonLabel="Pay Now"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onPayNow()"
					></app-wizard-footer>
				</ng-template>
			</mat-step>

			<mat-step *ngIf="isUpdate">
				<app-step-worker-licence-update-fee [licenceCost]="licenceCost"></app-step-worker-licence-update-fee>

				<app-wizard-footer
					nextButtonLabel="Pay Now"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onPayNow()"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsWorkerLicenceReviewAuthenticatedComponent extends BaseWizardStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() licenceCost = 0;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepWorkerLicenceSummaryReviewAuthenticatedComponent)
	summaryReviewComponent!: StepWorkerLicenceSummaryReviewAuthenticatedComponent;
	@ViewChild(StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent)
	summaryReviewUpdateComponent!: StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent;
	@ViewChild(StepWorkerLicenceConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepWorkerLicenceConsentAndDeclarationComponent;

	constructor(override commonApplicationService: CommonApplicationService) {
		super(commonApplicationService);
	}

	onSubmitNow(): void {
		const isValid = this.consentAndDeclarationComponent.isFormValid();
		if (!isValid) return;

		this.nextSubmitStep.emit();
	}

	onPayNow(): void {
		this.nextPayStep.emit();
	}

	onGoToStep(step: number): void {
		this.goToStep.emit(step);
	}

	override onStepNext(_formNumber: number): void {
		// unused
	}

	override onFormValidNextStep(_formNumber: number): void {
		// unused
	}

	override onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.summaryReviewUpdateComponent.onUpdateData();
		} else {
			this.summaryReviewComponent.onUpdateData();
		}
	}

	get isUpdate(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.Update;
	}
}
