import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-step-review',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-summary-review (editStep)="onGoToStep($event)"></app-summary-review>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-consent-and-declaration></app-consent-and-declaration>

				<div class="row mt-4">
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
export class StepReviewComponent {
	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() goToStep: EventEmitter<number> = new EventEmitter<number>();

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onPayNow(): void {}

	onGoToStep(step: number): void {
		this.goToStep.emit(step);
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}
}
