import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepWorkerLicenceConsentAndDeclarationComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-consent-and-declaration.component';
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

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New; else notNewWizardFooter">
					<app-wizard-footer
						[isFormValid]="true"
						[showSaveAndExit]="true"
						(saveAndExit)="onNoSaveAndExit()"
						(previousStepperStep)="onStepPrevious()"
						(nextStepperStep)="onGoToNextStep()"
					></app-wizard-footer>
				</ng-container>
				<ng-template #notNewWizardFooter>
					<app-wizard-footer
						(previousStepperStep)="onStepPrevious()"
						(nextStepperStep)="onGoToNextStep()"
					></app-wizard-footer>
				</ng-template>
			</mat-step>

			<mat-step>
				<app-step-worker-licence-consent-and-declaration
					[applicationTypeCode]="applicationTypeCode"
					[isSoleProprietor]="isSoleProprietor"
					[isAnonymous]="false"
				></app-step-worker-licence-consent-and-declaration>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update">
					<app-wizard-footer
						nextButtonLabel="Submit"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onSubmitNow()"
					></app-wizard-footer>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
					<ng-container *ngIf="isSoleProprietor; else IsNotSoleProprietor">
						<app-wizard-footer
							[isFormValid]="true"
							[showSaveAndExit]="true"
							(saveAndExit)="onNoSaveAndExit()"
							nextButtonLabel="Save & Continue to Business Licence Application"
							[isWidestNext]="true"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onSaveSoleProprietor()"
						></app-wizard-footer>
					</ng-container>
					<ng-template #IsNotSoleProprietor>
						<app-wizard-footer
							[isFormValid]="true"
							[showSaveAndExit]="true"
							(saveAndExit)="onNoSaveAndExit()"
							nextButtonLabel="Pay Now"
							(previousStepperStep)="onGoToPreviousStep()"
							(nextStepperStep)="onPayNow()"
						></app-wizard-footer>
					</ng-template>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
					<app-wizard-footer
						nextButtonLabel="Pay Now"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onPayNow()"
					></app-wizard-footer>
				</ng-container>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode === applicationTypeCodes.Update">
				<app-step-worker-licence-update-fee [licenceCost]="licenceCost"></app-step-worker-licence-update-fee>

				<app-wizard-footer
					[showExit]="false"
					nextButtonLabel="Pay Now"
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

	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isSoleProprietor!: boolean;
	@Input() licenceCost = 0;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepWorkerLicenceSummaryReviewAuthenticatedComponent)
	summaryReviewComponent!: StepWorkerLicenceSummaryReviewAuthenticatedComponent;
	@ViewChild(StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent)
	summaryReviewUpdateComponent!: StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent;
	@ViewChild(StepWorkerLicenceConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepWorkerLicenceConsentAndDeclarationComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	onSaveSoleProprietor(): void {
		if (!this.consentAndDeclarationComponent.isFormValid()) {
			return;
		}

		this.nextSubmitStep.emit();
	}

	onSubmitNow(): void {
		if (!this.consentAndDeclarationComponent.isFormValid()) {
			return;
		}

		this.nextSubmitStep.emit();
	}

	onPayNow(): void {
		if (!this.consentAndDeclarationComponent.isFormValid()) {
			return;
		}

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
}