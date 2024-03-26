import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { distinctUntilChanged } from 'rxjs';
import { CommonApplicationService } from '../../services/common-application.service';

@Component({
	selector: 'app-worker-licence-wizard-authenticated-replacement',
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
						<ng-template matStepLabel> Licence Confirmation </ng-template>
						<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

						<div class="row wizard-button-row">
							<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
								<button mat-stroked-button color="primary" class="large mb-2" (click)="onGotoUserProfile()">
									Previous
								</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onNextPayStep()">Pay Now</button>
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
})
export class WorkerLicenceWizardAuthenticatedReplacementComponent extends BaseWizardComponent implements OnInit {
	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private commonApplicationService: CommonApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		if (!this.licenceApplicationService.initialized) {
			this.router.navigateByUrl(LicenceApplicationRoutes.pathUserApplications());
		}
	}

	onGotoUserProfile(): void {
		this.router.navigateByUrl(
			LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
				LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED
			),
			{ state: { applicationTypeCode: ApplicationTypeCode.Replacement } }
		);
	}

	onNextPayStep(): void {
		// TODO  swl replacement authenticated - pay - which licenceAppId ?
		const licenceAppId = this.licenceApplicationService.licenceModelFormGroup.get('originalApplicationId')?.value;
		this.commonApplicationService.payNowAuthenticated(licenceAppId, 'Payment for Security Worker Licence Replacement');
	}
}
