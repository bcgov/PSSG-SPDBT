import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-step-two',
	template: `
		<mat-stepper class="child-stepper" #childstepper>
			<mat-step>
				2222

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onStepNext()">Next</button>
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

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}
}
