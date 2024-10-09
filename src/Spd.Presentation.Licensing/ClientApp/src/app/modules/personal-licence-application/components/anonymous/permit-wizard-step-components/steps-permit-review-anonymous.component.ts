import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardStepComponent } from '@app/core/components/base-wizard-step.component';
import { ApplicationService } from '@app/core/services/application.service';
import { StepPermitConsentAndDeclarationComponent } from './step-permit-consent-and-declaration.component';
import { StepPermitSummaryAnonymousComponent } from './step-permit-summary-anonymous.component';

@Component({
	selector: 'app-steps-permit-review-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-summary-anonymous
					[showEmployerInformation]="showEmployerInformation"
					(editStep)="onGoToStep($event)"
				></app-step-permit-summary-anonymous>

				<app-wizard-footer
					(previousStepperStep)="onStepPrevious()"
					(nextStepperStep)="onGoToNextStep()"
				></app-wizard-footer>
			</mat-step>

			<mat-step>
				<app-step-permit-consent-and-declaration
					[serviceTypeCode]="serviceTypeCode"
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

	@Input() serviceTypeCode!: ServiceTypeCode;
	@Input() applicationTypeCode!: ApplicationTypeCode;
	@Input() showEmployerInformation!: boolean;

	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepPermitSummaryAnonymousComponent) summaryReviewComponent!: StepPermitSummaryAnonymousComponent;
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
		this.summaryReviewComponent.onUpdateData();
	}
}
