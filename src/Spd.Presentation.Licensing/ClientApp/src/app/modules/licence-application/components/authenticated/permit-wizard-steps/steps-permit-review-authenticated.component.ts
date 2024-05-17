import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepPermitConsentAndDeclarationComponent } from '../../anonymous/permit-wizard-steps/step-permit-consent-and-declaration.component';
import { StepPermitSummaryAuthenticatedComponent } from '../../anonymous/permit-wizard-steps/step-permit-summary-authenticated.component';
import { StepPermitSummaryReviewUpdateAuthenticatedComponent } from '../../anonymous/permit-wizard-steps/step-permit-summary-review-update-authenticated.component';

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
	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCodes = ApplicationTypeCode;

	@Input() applicationTypeCode: ApplicationTypeCode | null = null;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepPermitSummaryAuthenticatedComponent)
	summaryReviewComponent!: StepPermitSummaryAuthenticatedComponent;
	@ViewChild(StepPermitSummaryReviewUpdateAuthenticatedComponent)
	summaryReviewUpdateComponent!: StepPermitSummaryReviewUpdateAuthenticatedComponent;
	@ViewChild(StepPermitConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepPermitConsentAndDeclarationComponent;

	constructor(
		override commonApplicationService: CommonApplicationService,
		private permitApplicationService: PermitApplicationService
	) {
		super(commonApplicationService);
	}

	ngOnInit(): void {
		this.submitPayLabel = 'Pay Now';
		if (this.applicationTypeCode === ApplicationTypeCode.Update) {
			this.submitPayLabel = 'Submit';
		}

		this.workerLicenceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
			'workerLicenceTypeData.workerLicenceTypeCode'
		)?.value;
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
