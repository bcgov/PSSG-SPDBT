import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AgreementOfTermsComponent } from '../step-components/agreement-of-terms.component';

@Component({
	selector: 'app-step-four',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-agreement-of-terms></app-agreement-of-terms>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button mat-raised-button color="primary" class="large mb-2" (click)="onSaveNext()">Submit</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-completed [sendToEmailAddress]="sendToEmailAddress"></app-completed>

				<div class="row mt-4">
					<div class="offset-lg-4 col-lg-4 offset-md-4 col-md-4 col-sm-12">
						<button mat-raised-button color="primary" class="large mb-2" [routerLink]="'/'">Close</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepFourComponent {
	@Input() sendToEmailAddress = '';
	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() saveStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();

	@ViewChild(AgreementOfTermsComponent)
	agreementOfTermsComponent!: AgreementOfTermsComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	getStepData(): any {
		return {
			...this.agreementOfTermsComponent.getDataToSave(),
		};
	}

	childStepNext(): void {
		this.childstepper.next();
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onSaveNext(): void {
		this.agreementOfTermsComponent.form.markAllAsTouched();
		const isValid = this.agreementOfTermsComponent.isFormValid();
		if (!isValid) return;

		this.saveStepperStep.emit(true);
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	clearStepData(): void {
		this.agreementOfTermsComponent?.clearCurrentData();
	}
}
