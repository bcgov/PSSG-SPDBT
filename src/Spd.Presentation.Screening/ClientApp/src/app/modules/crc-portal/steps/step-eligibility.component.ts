import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PayeePreferenceTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-step-eligibility',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-checklist [payeeType]="payeeType"></app-checklist>

				<div class="row mt-4">
					<div class="col-xxl-3 col-lg-4 col-md-4 col-sm-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext()">Start</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepEligibilityComponent {
	@ViewChild('childstepper') childstepper!: MatStepper;

	@Input() payeeType!: PayeePreferenceTypeCode;
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	onInfoNotCorrect(): void {
		this.childstepper.next();
	}

	onStepNext(): void {
		this.nextStepperStep.emit(true);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}
}
