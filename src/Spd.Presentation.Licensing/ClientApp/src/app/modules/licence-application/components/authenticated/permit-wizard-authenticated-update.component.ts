import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '../../services/licence-application.service';

@Component({
	selector: 'app-permit-wizard-authenticated-update',
	template: `
		<div class="row">
			<div class="offset-xl-1 col-xl-10 col-lg-12">
				<mat-stepper class="child-stepper" linear (selectionChange)="onStepSelectionChange($event)" #stepper>
					<mat-step completed="true">
						<!-- <ng-template matStepLabel> Update your Licence or Permit </ng-template> -->
						<app-step-worker-licence-all-updates-authenticated
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-step-worker-licence-all-updates-authenticated>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" (click)="onCancel()">Cancel</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
							</div>
						</div>
					</mat-step>

					<!-- <mat-step completed="true">
						<app-step-worker-licence-mailing-address-update-authenticated></app-step-worker-licence-mailing-address-update-authenticated>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
							</div>
						</div>
					</mat-step> -->

					<mat-step completed="true">
						<!-- <ng-template matStepLabel>Confirm Updates</ng-template> -->
						<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
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
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class PermitWizardAuthenticatedUpdateComponent extends BaseWizardComponent implements OnInit {
	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		}

		// this.updateCompleteStatus(); // TODO what to set?
	}

	// onStepSelectionChange(_event: StepperSelectionEvent) {
	// 	//empty
	// }

	// onScrollIntoView(): void {
	// 	this.scrollIntoView();
	// }

	onPreviousStepperStep(stepper: MatStepper): void {
		// console.debug('previous', stepper);
		stepper.previous();
	}

	onNextStepperStep(stepper: MatStepper): void {
		// console.debug('next', stepper);
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
}
