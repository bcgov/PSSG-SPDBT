import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { distinctUntilChanged } from 'rxjs';
import { PermitApplicationService } from '../../services/permit-application.service';
import { StepPermitMailingAddressComponent } from './permit-wizard-steps/step-permit-mailing-address.component';

@Component({
	selector: 'app-permit-wizard-anonymous-replacement',
	template: `
		<div class="row">
			<div class="col-12">
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
						<app-step-permit-mailing-address
							[applicationTypeCode]="applicationTypeCode"
						></app-step-permit-mailing-address>

						<div class="row mt-4">
							<div
								class="offset-xxl-4 col-xxl-2 offset-xl-3 col-xl-3 offset-lg-3 col-lg-3 offset-md-2 col-md-4 col-sm-6"
							>
								<button mat-stroked-button color="primary" class="large mb-2" matStepperPrevious>Previous</button>
							</div>
							<div class="col-xxl-2 col-xl-3 col-lg-3 col-md-4 col-sm-6">
								<button mat-flat-button color="primary" class="large mb-2" (click)="onGoToNextStep()">Pay</button>
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
export class PermitWizardAnonymousReplacementComponent extends BaseWizardComponent implements OnInit {
	applicationTypeCode = ApplicationTypeCode.Replacement;

	@ViewChild(StepPermitMailingAddressComponent) stepAddressComponent!: StepPermitMailingAddressComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private permitApplicationService: PermitApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.permitApplicationService.setLicenceTermsAndFees();
	}

	onGoToNextStep(): void {
		const isFormValid = this.stepAddressComponent.isFormValid();
		if (isFormValid) {
			// PAY
		}
	}
}
