import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { CommonApplicationService } from '@app/modules/licence-application/services/common-application.service';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepPermitConsentAndDeclarationComponent } from './step-permit-consent-and-declaration.component';
import { StepPermitSummaryAnonymousComponent } from './step-permit-summary-anonymous.component';

@Component({
	selector: 'app-steps-permit-review-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-summary-anonymous (editStep)="onGoToStep($event)"></app-step-permit-summary-anonymous>

				<app-wizard-footer
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-consent-and-declaration
					[workerLicenceTypeCode]="workerLicenceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
				></app-step-permit-consent-and-declaration>

				<app-wizard-footer
					[nextButtonLabel]="submitPayLabel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onPayNow()"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitReviewAnonymousComponent extends BaseWizardStepComponent implements OnInit {
	submitPayLabel = '';

	@Input() workerLicenceTypeCode!: WorkerLicenceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepPermitSummaryAnonymousComponent) summaryReviewComponent!: StepPermitSummaryAnonymousComponent;
	@ViewChild(StepPermitConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepPermitConsentAndDeclarationComponent;

	constructor(override commonApplicationService: CommonApplicationService) {
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
		this.summaryReviewComponent.onUpdateData();
	}
}