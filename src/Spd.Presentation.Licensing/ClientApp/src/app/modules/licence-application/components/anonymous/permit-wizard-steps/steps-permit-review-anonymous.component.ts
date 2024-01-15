import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepPermitConsentAndDeclarationComponent } from './step-permit-consent-and-declaration.component';
import { StepPermitSummaryAnonymousComponent } from './step-permit-summary-anonymous.component';

@Component({
	selector: 'app-steps-permit-review-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-permit-summary-anonymous (editStep)="onGoToStep($event)"></app-step-permit-summary-anonymous>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-permit-consent-and-declaration></app-step-permit-consent-and-declaration>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onPayNow()">Pay Now</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepsPermitReviewAnonymousComponent extends BaseWizardStepComponent {
	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepPermitSummaryAnonymousComponent) summaryReviewComponent!: StepPermitSummaryAnonymousComponent;
	@ViewChild(StepPermitConsentAndDeclarationComponent)
	consentAndDeclarationComponent!: StepPermitConsentAndDeclarationComponent;

	constructor() {
		super();
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
		this.childstepper.selectedIndex = 0;
		this.summaryReviewComponent.onUpdateData();
	}
}
