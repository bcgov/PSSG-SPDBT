import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepPermitConsentAndDeclarationComponent } from '@app/modules/personal-licence-application/components/anonymous/permit-wizard-step-components/step-permit-consent-and-declaration.component';
import { StepPermitSummaryAuthenticatedComponent } from '@app/modules/personal-licence-application/components/anonymous/permit-wizard-step-components/step-permit-summary-authenticated.component';
import { StepPermitSummaryReviewUpdateAuthenticatedComponent } from '@app/modules/personal-licence-application/components/anonymous/permit-wizard-step-components/step-permit-summary-review-update-authenticated.component';

@Component({
	selector: 'app-steps-permit-review-authenticated',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.Update; else notUpdateReview">
					<app-step-permit-summary-review-update-authenticated></app-step-permit-summary-review-update-authenticated>
				</ng-container>
				<ng-template #notUpdateReview>
					<app-step-permit-summary-authenticated
						[showEmployerInformation]="showEmployerInformation"
						(editStep)="onGoToStep($event)"
					></app-step-permit-summary-authenticated>
				</ng-template>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New; else NotNewWizardFooter">
					<app-wizard-footer
						[isFormValid]="true"
						[showSaveAndExit]="true"
						(saveAndExit)="onNoSaveAndExit()"
						(previousStepperStep)="onStepPrevious()"
						(nextStepperStep)="onGoToNextStep()"
					></app-wizard-footer>
				</ng-container>
				<ng-template #NotNewWizardFooter>
					<app-wizard-footer
						(previousStepperStep)="onStepPrevious()"
						(nextStepperStep)="onGoToNextStep()"
					></app-wizard-footer>
				</ng-template>
			</mat-step>

			<mat-step>
				<app-step-permit-consent-and-declaration
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-consent-and-declaration>

				<ng-container *ngIf="applicationTypeCode === applicationTypeCodes.New; else NotNewConsentWizardFooter">
					<app-wizard-footer
						[isFormValid]="true"
						[showSaveAndExit]="true"
						(saveAndExit)="onNoSaveAndExit()"
						[nextButtonLabel]="submitPayLabel"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onPayNow()"
					></app-wizard-footer>
				</ng-container>
				<ng-template #NotNewConsentWizardFooter>
					<app-wizard-footer
						[nextButtonLabel]="submitPayLabel"
						(previousStepperStep)="onGoToPreviousStep()"
						(nextStepperStep)="onPayNow()"
					></app-wizard-footer>
				</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitReviewAuthenticatedComponent extends BaseWizardStepComponent implements OnInit {
	submitPayLabel = '';
	applicationTypeCodes = ApplicationTypeCode;

	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() showEmployerInformation!: boolean;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepPermitSummaryAuthenticatedComponent)
	summaryReviewComponent!: StepPermitSummaryAuthenticatedComponent;
	@ViewChild(StepPermitSummaryReviewUpdateAuthenticatedComponent)
	summaryReviewUpdateComponent!: StepPermitSummaryReviewUpdateAuthenticatedComponent;
	@ViewChild(StepPermitConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepPermitConsentAndDeclarationComponent;

	constructor(override commonApplicationService: ApplicationService) {
		super(commonApplicationService);
	}

	ngOnInit(): void {
		this.submitPayLabel = 'Pay Now';
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.submitPayLabel = 'Submit';
		}
	}

	onPayNow(): void {
		const isValid = this.consentAndDeclarationComponent.isFormValid();
		if (!isValid) return;

		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.nextSubmitStep.emit();
		} else {
			this.nextPayStep.emit();
		}
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
