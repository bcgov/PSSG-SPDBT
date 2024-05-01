import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, PermitAppCommandResponse, WorkerLicenceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { PermitApplicationService } from '../../services/permit-application.service';
import { StepsPermitReviewAuthenticatedComponent } from './permit-wizard-steps/steps-permit-review-authenticated.component';
import { StepsPermitUpdatesAuthenticatedComponent } from './permit-wizard-steps/steps-permit-updates-authenticated.component';

@Component({
	selector: 'app-permit-wizard-authenticated-update',
	template: `
		<div class="row">
			<div class="offset-xl-1 col-xl-10 col-lg-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step completed="true">
						<ng-template matStepLabel>Permit Confirmation</ng-template>
						<app-step-permit-confirmation></app-step-permit-confirmation>

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
						<ng-template matStepLabel>Permit Updates</ng-template>
						<app-steps-permit-updates-authenticated
							(childNextStep)="onChildNextStep()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-updates-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-permit-review-authenticated
							[applicationTypeCode]="applicationTypeCodeUpdate"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextSubmitStep)="onSubmitStep()"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-review-authenticated>
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
export class PermitWizardAuthenticatedUpdateComponent extends BaseWizardComponent implements OnInit {
	workerLicenceTypeCode: WorkerLicenceTypeCode | null = null;
	applicationTypeCodeUpdate = ApplicationTypeCode.Update;

	newLicenceAppId: string | null = null;

	readonly STEP_PERMIT_CONFIRMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PERMIT_UPDATES = 1;
	readonly STEP_REVIEW_AND_CONFIRM = 2;

	@ViewChild(StepsPermitUpdatesAuthenticatedComponent) stepsUpdatesComponent!: StepsPermitUpdatesAuthenticatedComponent;
	@ViewChild(StepsPermitReviewAuthenticatedComponent) stepsReviewComponent!: StepsPermitReviewAuthenticatedComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private permitApplicationService: PermitApplicationService
	) {
		super(breakpointObserver);

		const state = this.router.getCurrentNavigation()?.extras.state;
		this.workerLicenceTypeCode = state && state['workerLicenceTypeCode'];
	}

	ngOnInit(): void {
		if (!this.permitApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onGotoUserProfile(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathPermitAuthenticated(LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED),
			{ state: { workerLicenceTypeCode: this.workerLicenceTypeCode!, applicationTypeCode: ApplicationTypeCode.Update } }
		);
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_PERMIT_CONFIRMATION:
				this.stepsUpdatesComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_PERMIT_CONFIRMATION:
				this.stepper.selectedIndex = 0;
				break;
			case this.STEP_PERMIT_UPDATES:
				this.stepsUpdatesComponent?.onGoToLastStep();
				break;
		}
	}

	onChildNextStep() {
		this.stepsUpdatesComponent?.onGoToNextStep();
		// this.updateCompleteStatus();
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onSubmitStep(): void {
		this.permitApplicationService.submitPermitRenewalOrUpdateAuthenticated().subscribe({
			next: (resp: StrictHttpResponse<PermitAppCommandResponse>) => {
				const permitCommandResponse = resp.body;

				// save this locally just in application payment fails
				this.newLicenceAppId = permitCommandResponse.licenceAppId!;

				this.hotToastService.success('Your permit update has been successfully submitted');
				this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.PERMIT_UPDATE_SUCCESS));
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}
}
