import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AgreementOfTermsComponent } from '../step-components/agreement-of-terms.component';

@Component({
	selector: 'app-step-terms-and-cond',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-agreement-of-terms></app-agreement-of-terms>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onFormValidNextStep()">Pay</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepTermsAndCondComponent {
	@ViewChild('childstepper') childstepper!: MatStepper;

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(AgreementOfTermsComponent)
	agreementOfTermsComponent!: AgreementOfTermsComponent;

	getStepData(): any {
		return {
			...this.agreementOfTermsComponent.getDataToSave(),
		};
	}

	onFormValidNextStep(): void {
		this.agreementOfTermsComponent.form.markAllAsTouched();
		const isValid = this.agreementOfTermsComponent.isFormValid();
		if (!isValid) return;
		this.nextStepperStep.emit(true);
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}
}
