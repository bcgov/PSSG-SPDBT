import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BaseWizardStepComponent } from 'src/app/core/components/base-wizard-step.component';
import { StepConsentAndDeclarationComponent } from '../../shared/worker-licence-wizard-child-steps/step-consent-and-declaration.component';
import { StepSummaryReviewLicenceAnonymousComponent } from './step-summary-review-licence-anonymous.component';

@Component({
	selector: 'app-steps-review-licence-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-summary-review-licence-anonymous
					(editStep)="onGoToStep($event)"
				></app-step-summary-review-licence-anonymous>

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
				<app-step-consent-and-declaration></app-step-consent-and-declaration>

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
export class StepsReviewLicenceAnonymousComponent extends BaseWizardStepComponent {
	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	@ViewChild(StepSummaryReviewLicenceAnonymousComponent)
	summaryReviewComponent!: StepSummaryReviewLicenceAnonymousComponent;
	@ViewChild(StepConsentAndDeclarationComponent) consentAndDeclarationComponent!: StepConsentAndDeclarationComponent;

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
