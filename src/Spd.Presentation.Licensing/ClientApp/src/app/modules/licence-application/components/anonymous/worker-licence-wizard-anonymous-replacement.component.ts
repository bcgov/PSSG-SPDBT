import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { CommonApplicationService } from '../../services/common-application.service';
import { StepWorkerLicenceMailingAddressComponent } from '../shared/worker-licence-wizard-steps/step-worker-licence-mailing-address.component';

@Component({
	selector: 'app-worker-licence-wizard-anonymous-replacement',
	template: `
		<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
			<mat-step>
				<ng-template matStepLabel> Licence Confirmation </ng-template>
				<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<ng-template matStepLabel> Address Update </ng-template>
				<app-step-worker-licence-mailing-address
					[applicationTypeCode]="applicationTypeCode"
				></app-step-worker-licence-mailing-address>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 col-md-12">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-12">
						<button mat-flat-button color="primary" class="large mb-2" (click)="onPay()">Pay</button>
					</div>
				</div>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class WorkerLicenceWizardAnonymousReplacementComponent extends BaseWizardComponent implements OnInit {
	applicationTypeCode = ApplicationTypeCode.Replacement;
	newLicenceAppId: string | null = null;

	@ViewChild(StepWorkerLicenceMailingAddressComponent)
	stepAddressComponent!: StepWorkerLicenceMailingAddressComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: CommonApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onPay(): void {
		const isFormValid = this.stepAddressComponent.isFormValid();
		if (isFormValid) {
			if (this.newLicenceAppId) {
				this.payNow(this.newLicenceAppId);
			} else {
				this.licenceApplicationService.submitLicenceReplacementAnonymous().subscribe({
					next: (resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
						console.debug('[onPay] submitLicenceReplacementAnonymous', resp.body);

						// save this locally just in application payment fails
						this.newLicenceAppId = resp.body.licenceAppId!;

						this.hotToastService.success('Your licence replacement has been successfully submitted');
						this.payNow(this.newLicenceAppId);
					},
					error: (error: any) => {
						console.log('An error occurred during save', error);
						this.hotToastService.error('An error occurred during the save. Please try again.');
					},
				});
			}
		}
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowAnonymous(licenceAppId, 'Payment for Security Worker Licence Replacement');
	}
}
