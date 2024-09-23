import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { ApplicationService } from '@app/core/services/application.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { StepWorkerLicenceMailingAddressReplacementAnonymousComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/step-worker-licence-mailing-address-replacement-anonymous.component';
import { HotToastService } from '@ngxpert/hot-toast';
import { distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-worker-licence-wizard-anonymous-replacement',
	template: `
		<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
			<mat-step>
				<ng-template matStepLabel>Licence Confirmation</ng-template>
				<app-step-worker-licence-confirmation></app-step-worker-licence-confirmation>

				<app-wizard-footer (nextStepperStep)="onGoToNextStep()"></app-wizard-footer>
			</mat-step>

			<mat-step>
				<ng-template matStepLabel>Address Update</ng-template>
				<app-step-worker-licence-mailing-address-replacement-anonymous></app-step-worker-licence-mailing-address-replacement-anonymous>

				<app-wizard-footer
					nextButtonLabel="Pay"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onPay()"
				></app-wizard-footer>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class WorkerLicenceWizardAnonymousReplacementComponent extends BaseWizardComponent implements OnInit {
	newLicenceAppId: string | null = null;

	@ViewChild(StepWorkerLicenceMailingAddressReplacementAnonymousComponent)
	stepAddressComponent!: StepWorkerLicenceMailingAddressReplacementAnonymousComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private hotToastService: HotToastService,
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: ApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onGoToNextStep(): void {
		this.stepper.next();
	}

	onGoToPreviousStep(): void {
		this.stepper.previous();
	}

	onPay(): void {
		const isFormValid = this.stepAddressComponent.isFormValid();
		if (isFormValid) {
			if (this.newLicenceAppId) {
				this.payNow(this.newLicenceAppId);
			} else {
				this.workerApplicationService.submitLicenceReplacementAnonymous().subscribe({
					next: (resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
						console.debug('[onPay] submitLicenceReplacementAnonymous', resp.body);

						// save this locally just in application payment fails
						this.newLicenceAppId = resp.body.licenceAppId!;

						this.hotToastService.success('Your licence replacement has been successfully submitted');
						this.payNow(this.newLicenceAppId);
					},
					error: (error: any) => {
						console.log('An error occurred during save', error);
					},
				});
			}
		}
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowAnonymous(licenceAppId, 'Payment for Security Worker Licence replacement');
	}
}
