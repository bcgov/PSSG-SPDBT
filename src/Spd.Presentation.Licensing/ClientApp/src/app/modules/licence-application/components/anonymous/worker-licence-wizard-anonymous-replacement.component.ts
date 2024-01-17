import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { StepMailingAddressComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-child-steps/step-mailing-address.component';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-worker-licence-wizard-anonymous-replacement',
	template: `
		<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
			<mat-step>
				<ng-template matStepLabel> Licence Confirmation </ng-template>
				<app-step-licence-confirmation [applicationTypeCode]="applicationTypeCode"></app-step-licence-confirmation>

				<div class="row mt-4">
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6 mx-auto">
						<button mat-flat-button color="primary" class="large mb-2" matStepperNext>Next</button>
					</div>
				</div>
			</mat-step>

			<mat-step>
				<ng-template matStepLabel> Address Update </ng-template>
				<app-step-mailing-address [applicationTypeCode]="applicationTypeCode"></app-step-mailing-address>

				<div class="row wizard-button-row">
					<div class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6">
						<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
					</div>
					<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
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

	@ViewChild(StepMailingAddressComponent)
	stepMailingAddressComponent!: StepMailingAddressComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
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

	onPay(): void {
		const isFormValid = this.stepMailingAddressComponent.isFormValid();

		console.log('onPay', this.licenceApplicationService.licenceModelFormGroup.value);
		console.log(
			'onPay isStepLicenceSelectionComplete',
			this.licenceApplicationService.isStepLicenceSelectionComplete()
		);
		console.log('onPay isStepBackgroundComplete', this.licenceApplicationService.isStepBackgroundComplete());
		console.log('onPay isStepIdentificationComplete', this.licenceApplicationService.isStepIdentificationComplete());
		console.log('onPay valid', this.licenceApplicationService.licenceModelFormGroup.valid);

		if (isFormValid) {
			// If the creation worked and the payment failed, do not post again
			// if (this.licenceAppId) {
			// 	this.payNow(this.licenceAppId);
			// } else {
			// 	this.licenceApplicationService.submitLicence().subscribe({
			// 		next: (resp: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => {
			// 			// save this locally just in case payment fails
			// 			this.licenceAppId = resp.body.licenceAppId!;
			// 			this.hotToastService.success('Your licence has been successfully submitted');
			// 			this.payNow(this.licenceAppId);
			// 		},
			// 		error: (error: any) => {
			// 			console.log('An error occurred during save', error);
			// 			this.hotToastService.error('An error occurred during the save. Please try again.');
			// 		},
			// 	});
			// }
		}
	}
}
