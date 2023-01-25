import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AgreementOfTermsComponent, AgreementOfTermsModel } from '../step-components/agreement-of-terms.component';

@Component({
	selector: 'app-step-four',
	template: `
		<mat-stepper class="child-stepper" #childstepper>
			<mat-step>
				<app-agreement-of-terms
					[stepData]="agreementOfTermsData"
					(formValidity)="onAgreementOfTermsValidity($event)"
				></app-agreement-of-terms>

				<div class="row mt-4">
					<div class="offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onStepPrevious()">Previous</button>
					</div>
					<div class="col-lg-3 col-md-4 col-sm-6">
						<button
							mat-raised-button
							color="primary"
							class="large mb-2"
							[disabled]="!isFormValid14"
							(click)="onSaveNext()"
						>
							Save
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-completed></app-completed>

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
	isFormValid14: boolean = false;

	agreementOfTermsData: AgreementOfTermsModel = {
		agreeToTermsAndConditions: false,
	};

	@Output() previousStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() saveStepperStep: EventEmitter<boolean> = new EventEmitter();

	@ViewChild(AgreementOfTermsComponent)
	agreementOfTermsComponent!: AgreementOfTermsComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	onAgreementOfTermsValidity(isFormValid: boolean): void {
		this.isFormValid14 = isFormValid;
		if (isFormValid) {
			this.agreementOfTermsData = this.agreementOfTermsComponent.getDataToSave();
		}
	}

	childStepNext(): void {
		this.childstepper.next();
	}

	onStepPrevious(): void {
		this.previousStepperStep.emit(true);
	}

	onSaveNext(): void {
		this.saveStepperStep.emit(true);
	}
}
