import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';

@Component({
	selector: 'app-worker-licence-wizard-authenticated-update',
	template: `
		<ng-container>
			<!--  *ngIf="isLoaded$ | async" -->
			<div class="row">
				<div class="offset-xl-1 col-xl-10 col-lg-12">
					<mat-stepper class="child-stepper" linear (selectionChange)="onStepSelectionChange($event)" #stepper>
						<mat-step completed="true">
							<!-- <ng-template matStepLabel> Update your Licence or Permit </ng-template> -->
							<app-step-licence-updates
								(nextStepperStep)="onNextStepperStep(stepper)"
								(scrollIntoView)="onScrollIntoView()"
							></app-step-licence-updates>

							<div class="row mt-4">
								<div
									class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6"
								>
									<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">Cancel</button>
								</div>
								<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
									<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
								</div>
							</div>
						</mat-step>

						<mat-step completed="true">
							<!-- <ng-template matStepLabel>Confirm Mailing Address</ng-template> -->
							<app-step-confirm-mailing-address></app-step-confirm-mailing-address>

							<div class="row mt-4">
								<div
									class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6"
								>
									<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
								</div>
								<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
									<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
								</div>
							</div>
						</mat-step>

						<mat-step completed="true">
							<!-- <ng-template matStepLabel>Confirm Updates</ng-template> -->
							<app-step-confirm-updates></app-step-confirm-updates>

							<div class="row mt-4">
								<div
									class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6"
								>
									<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
								</div>
								<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
									<button mat-flat-button color="primary" class="large mb-2">Pay</button>
								</div>
							</div>
						</mat-step>

						<mat-step completed="true">
							<!-- <ng-template matStepLabel>Pay</ng-template> -->
						</mat-step>
					</mat-stepper>
				</div>
			</div>
		</ng-container>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class WorkerLicenceWizardAuthenticatedUpdateComponent {
	orientation: StepperOrientation = 'vertical';

	@ViewChild('stepper') stepper!: MatStepper;

	constructor(private router: Router) {}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		//empty
	}

	onScrollIntoView(): void {
		this.scrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		// console.log('previous', stepper);
		stepper.previous();
	}

	onNextStepperStep(stepper: MatStepper): void {
		// console.log('next', stepper);
		stepper.next();
	}

	onStepPrevious(): void {
		//empty
	}

	onStepNext(): void {
		//empty
	}

	onCancel(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
	}

	private scrollIntoView(): void {
		const stepIndex = this.stepper.selectedIndex;
		const stepId = this.stepper._getStepLabelId(stepIndex);
		const stepElement = document.getElementById(stepId);
		if (stepElement) {
			setTimeout(() => {
				stepElement.scrollIntoView({
					block: 'start',
					inline: 'nearest',
					behavior: 'smooth',
				});
			}, 250);
		}
	}
}
