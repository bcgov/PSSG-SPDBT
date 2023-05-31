import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { PayerPreferenceTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-step-appl-submitted',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<!--  *ngIf="payeeType == payeePreferenceTypeCodes.Applicant" -->
			<mat-step *ngIf="performPayment">
				<app-payment-success></app-payment-success>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button style="color: var(--color-green);" class="large mb-2">Download Receipt</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step *ngIf="performPayment">
				<app-payment-failure></app-payment-failure>

				<div class="row mt-4">
					<div class="col-xxl-3 col-lg-4 col-md-4 col-sm-12 mx-auto">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperNext>Close</button>
					</div>
				</div>
			</mat-step>

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

	@Input() payeeType!: PayerPreferenceTypeCode;
	@Input() performPayment = false;

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
		// switch (step) {
		// 	case 1:
		// 		this.declarationComponent.form.markAllAsTouched();
		// 		return this.declarationComponent.isFormValid();
		// 	case 2:
		// 		this.agreementOfTermsComponent.form.markAllAsTouched();
		// 		return this.agreementOfTermsComponent.isFormValid();

		// 	default:
		// 		console.error('Unknown Form', step);
		// }
		// return false;
		return true; //TODO UPDATE when working on payment
	}
}
