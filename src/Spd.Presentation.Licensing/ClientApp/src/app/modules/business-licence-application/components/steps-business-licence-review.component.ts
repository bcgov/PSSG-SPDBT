import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { ApplicationService } from '@app/core/services/application.service';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepBusinessLicenceConsentAndDeclarationComponent } from './step-business-licence-consent-and-declaration.component';
import { StepBusinessLicenceSummaryComponent } from './step-business-licence-summary.component';

@Component({
	selector: 'app-steps-business-licence-review',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step *ngIf="!isRenewalShortForm">
				<app-step-business-licence-summary
					(editStep)="onGoToStep($event)"
					[isUpdateFlowWithHideReprintStep]="isUpdateFlowWithHideReprintStep"
				></app-step-business-licence-summary>

				<app-wizard-footer
					[isFormValid]="true"
					[showSaveAndExit]="showSaveAndExit"
					(saveAndExit)="onNoSaveAndExit()"
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-business-licence-consent-and-declaration
					[applicationTypeCode]="applicationTypeCode"
				></app-step-business-licence-consent-and-declaration>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update">
					<app-wizard-footer
						nextButtonLabel="Submit"
						(previousStepperStep)="onConsentGoToPreviousStep()"
						(nextStepperStep)="onSubmitNow()"
					></app-wizard-footer>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New">
					<app-wizard-footer
						[isFormValid]="true"
						[showSaveAndExit]="true"
						(saveAndExit)="onNoSaveAndExit()"
						nextButtonLabel="Pay Now"
						(previousStepperStep)="onConsentGoToPreviousStep()"
						(nextStepperStep)="onPayNow()"
					></app-wizard-footer>
				</ng-container>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Renewal">
					<app-wizard-footer
						nextButtonLabel="Pay Now"
						(previousStepperStep)="onConsentGoToPreviousStep()"
						(nextStepperStep)="onPayNow()"
					></app-wizard-footer>
				</ng-container>
			</mat-step>

			<mat-step *ngIf="applicationTypeCode === applicationTypeCodes.Update">
				<app-step-business-licence-update-fee [licenceCost]="licenceCost"></app-step-business-licence-update-fee>

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
export class StepsBusinessLicenceReviewComponent extends BaseWizardStepComponent {
	applicationTypeCodes = ApplicationTypeCode;

	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() isRenewalShortForm!: boolean;
	@Input() showSaveAndExit!: boolean;
	@Input() licenceCost = 0;
	@Input() isUpdateFlowWithHideReprintStep!: boolean;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepBusinessLicenceSummaryComponent) summaryReviewComponent!: StepBusinessLicenceSummaryComponent;
	@ViewChild(StepBusinessLicenceConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepBusinessLicenceConsentAndDeclarationComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	onConsentGoToPreviousStep(): void {
		if (this.isRenewalShortForm) {
			this.onStepPrevious();
			return;
		}

		this.onGoToPreviousStep();
	}

	onSubmitNow(): void {
		if (!this.consentAndDeclarationComponent.isFormValid()) {
			return;
		}

		this.nextSubmitStep.emit();
	}

	onPayNow(): void {
		const isValid = this.consentAndDeclarationComponent.isFormValid();
		if (!isValid) return;

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
		if (this.isRenewalShortForm) {
			this.childstepper.selectedIndex = 1;
			return;
		}

		this.childstepper.selectedIndex = 0;
		this.summaryReviewComponent.onUpdateData();
	}
}