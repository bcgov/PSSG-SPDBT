import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { ApplicationService } from '@app/core/services/application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';

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
						<ng-template matStepLabel>Licence Confirmation</ng-template>
						<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

						<app-wizard-footer
							nextButtonLabel="Pay Now"
							(previousStepperStep)="onGotoUserProfile()"
							(nextStepperStep)="onPayNow()"
						></app-wizard-footer>
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
		private hotToastService: HotToastService,
		private commonApplicationService: ApplicationService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onGotoUserProfile(): void {
		this.commonApplicationService.onGotoSwlUserProfile(ApplicationTypeCode.Replacement);
	}

	onPayNow(): void {
		this.licenceApplicationService.submitLicenceRenewalOrUpdateOrReplaceAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				this.hotToastService.success('Your licence replacement has been successfully submitted');
				this.payNow(_resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(
			licenceAppId,
			'Payment for Security Worker Licence replacement'
		);
	}
}
