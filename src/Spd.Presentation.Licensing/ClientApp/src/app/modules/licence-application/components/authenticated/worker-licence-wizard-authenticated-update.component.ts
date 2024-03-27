import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { CommonApplicationService } from '../../services/common-application.service';
import { LicenceApplicationService } from '../../services/licence-application.service';
import { StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent } from './worker-licence-wizard-steps/step-worker-licence-summary-review-update-authenticated.component';
import { StepsWorkerLicenceUpdatesAuthenticatedComponent } from './worker-licence-wizard-steps/steps-worker-licence-updates-authenticated.component';

@Component({
	selector: 'app-worker-licence-wizard-authenticated-update',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step completed="true">
						<ng-template matStepLabel>Licence Confirmation</ng-template>
						<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" (click)="onGotoUserProfile()">
									Previous
								</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
							</div>
						</div>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Licence Updates</ng-template>
						<app-steps-worker-licence-updates-authenticated
							(childNextStep)="onChildNextStep()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-updates-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>

						<app-step-worker-licence-summary-review-update-authenticated></app-step-worker-licence-summary-review-update-authenticated>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onPayNow()">Pay Now</button>
							</div>
						</div>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
	encapsulation: ViewEncapsulation.None,
})
export class WorkerLicenceWizardAuthenticatedUpdateComponent extends BaseWizardComponent implements OnInit {
	readonly STEP_LICENCE_CONFIRMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_UPDATES = 1;
	readonly STEP_REVIEW_AND_CONFIRM = 2;

	@ViewChild(StepsWorkerLicenceUpdatesAuthenticatedComponent)
	licenceUpdatesComponent!: StepsWorkerLicenceUpdatesAuthenticatedComponent;
	@ViewChild(StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent)
	licenceSummaryComponent!: StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private commonApplicationService: CommonApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onGotoUserProfile(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
			),
			{ state: { applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}

	onChildNextStep() {
		this.licenceUpdatesComponent?.onGoToNextStep();
		// this.updateCompleteStatus();
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onPayNow(): void {
		const isValid = this.licenceSummaryComponent.isFormValid();
		if (!isValid) return;

		this.licenceApplicationService.submitLicenceRenewalAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				this.hotToastService.success('Your licence update has been successfully submitted');
				this.payNow(_resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowAuthenticated(licenceAppId, 'Payment for Security Worker Licence Update');
	}
}
