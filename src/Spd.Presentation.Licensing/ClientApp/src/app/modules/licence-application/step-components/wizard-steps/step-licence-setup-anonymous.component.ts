import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '../../licence-application-routing.module';
import { LicenceStepperStepComponent } from '../../services/licence-application.helper';
import { StepLicenceApplicationTypeComponent } from '../wizard-child-steps/step-licence-application-type.component';
import { StepLicenceTypeSelectionComponent } from '../wizard-child-steps/step-licence-type-selection.component';

@Component({
	selector: 'app-step-licence-setup-anonymous',
	template: `
		<mat-stepper class="child-stepper" (selectionChange)="onStepSelectionChange($event)" #childstepper>
			<mat-step>
				<app-step-licence-type-selection></app-step-licence-type-selection>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">Cancel</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onFormValidNextStep(STEP_LICENCE_TYPE)">
							Next
						</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<app-step-licence-application-type></app-step-licence-application-type>

				<div class="row mt-4">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onStepNext(STEP_APPLICATION_TYPE)">
							Next
						</button>
					</div>
				</div>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class StepLicenceSetupAnonymousComponent implements LicenceStepperStepComponent {
	readonly STEP_LICENCE_TYPE = 1;
	readonly STEP_APPLICATION_TYPE = 2;

	@ViewChild(StepLicenceTypeSelectionComponent)
	licenceTypeSelectionComponent!: StepLicenceTypeSelectionComponent;

	@ViewChild(StepLicenceApplicationTypeComponent)
	licenceApplicationTypeComponent!: StepLicenceApplicationTypeComponent;

	@ViewChild('childstepper') private childstepper!: MatStepper;

	@Output() nextStepperStep: EventEmitter<boolean> = new EventEmitter();
	@Output() scrollIntoView: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() childNextStep: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private router: Router) {}

	onStepNext(formNumber: number): void {
		// const isValid = this.dirtyForm(formNumber);
		// if (!isValid) return;

		this.nextStepperStep.emit(true);
	}

	onStepPrevious(): void {
		// unused
	}

	onCancel(): void {
		this.router.navigate([LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_ANONYMOUS)]);
	}

	onFormValidNextStep(formNumber: number): void {
		// const isValid = this.dirtyForm(formNumber);
		// if (!isValid) return;

		this.childNextStep.emit(true);
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.scrollIntoView.emit(true);
	}

	onGoToNextStep() {
		this.childstepper.next();
	}

	onGoToFirstStep() {
		this.childstepper.selectedIndex = 0;
	}

	onGoToLastStep() {
		this.childstepper.selectedIndex = this.childstepper.steps.length - 1;
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_LICENCE_TYPE:
				return this.licenceTypeSelectionComponent.isFormValid();
			case this.STEP_APPLICATION_TYPE:
				return this.licenceApplicationTypeComponent.isFormValid();
			default:
				console.error('Unknown Form', step);
		}
		return false;
	}
}
