import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
	selector: 'app-step-appl-submitted',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-application-submitted></app-application-submitted>

				<div class="row mt-4">
					<div class="col-xxl-3 col-lg-4 col-md-4 col-sm-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" [routerLink]="'/'">Close</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepApplSubmittedComponent {
	@ViewChild('childstepper') childstepper!: MatStepper;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	getStepData(): any {
		return {};
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;
		this.childstepper.next();
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	private dirtyForm(step: number): boolean {
		return true;
	}
}
