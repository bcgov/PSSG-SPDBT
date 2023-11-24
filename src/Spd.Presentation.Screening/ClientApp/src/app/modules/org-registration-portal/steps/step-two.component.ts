import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-step-two',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-registration-options
					(clickNext)="onStepNext()"
					(registerWithBCeid)="onRegisterWithBCeid()"
				></app-registration-options>

				<div class="row mt-4">
					<div class="col-lg-3 col-md-4 col-sm-12 mx-auto">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepTwoComponent {
	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() registerWithBCeid: EventEmitter<boolean> = new EventEmitter<boolean>();

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onRegisterWithBCeid(): void {
		this.registerWithBCeid.emit(true);
	}
}
