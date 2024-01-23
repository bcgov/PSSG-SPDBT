import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import {
	PaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	WorkerLicenceAppUpsertResponse,
} from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { StepsReviewLicenceAuthenticatedComponent } from '@app/modules/licence-application/components/authenticated/worker-licence-wizard-steps/steps-review-licence-authenticated.component';
import { StepsBackgroundRenewAndUpdateComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/steps-background-renew-and-update.component';
import { StepsLicenceSelectionComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/steps-licence-selection.component';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { StepsIdentificationAnonymousComponent } from './worker-licence-wizard-steps/steps-identification-anonymous.component';

@Component({
	selector: 'app-worker-licence-wizard-anonymous-renewal',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel> Licence Selection </ng-template>
				<app-steps-licence-selection
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-licence-selection>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Background</ng-template>
				<app-steps-background-renew-and-update
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-background-renew-and-update>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Identification</ng-template>
				<app-steps-identification-anonymous
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-identification-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review and Confirm</ng-template>
				<ng-template matStepContent>
					<app-steps-review-licence-anonymous
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						(goToStep)="onGoToStep($event)"
						(nextPayStep)="onPay()"
					></app-steps-review-licence-anonymous>
				</ng-template>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class WorkerLicenceWizardAnonymousRenewalComponent extends BaseWizardComponent implements OnInit {
	readonly STEP_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	newLicenceAppId: string | null = null;

	@ViewChild(StepsLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepsLicenceSelectionComponent;

	@ViewChild(StepsBackgroundRenewAndUpdateComponent)
	stepBackgroundComponent!: StepsBackgroundRenewAndUpdateComponent;

	@ViewChild(StepsIdentificationAnonymousComponent)
	stepIdentificationComponent!: StepsIdentificationAnonymousComponent;

	@ViewChild(StepsReviewLicenceAuthenticatedComponent)
	stepReviewLicenceComponent!: StepsReviewLicenceAuthenticatedComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private hotToastService: HotToastService,
		private paymentService: PaymentService,
		private licenceApplicationService: LicenceApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.updateCompleteStatus();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToFirstStep();
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToFirstStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW:
				this.stepReviewLicenceComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToLastStep();
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToLastStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		this.updateCompleteStatus();

		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		this.stepLicenceSelectionComponent?.onGoToFirstStep();
		this.stepBackgroundComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		this.updateCompleteStatus();

		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}, 250);
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.licenceApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.licenceApplicationService.isStepBackgroundComplete();
		this.step3Complete = this.licenceApplicationService.isStepIdentificationComplete();

		// console.debug('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	onChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_BACKGROUND:
				this.stepBackgroundComponent?.onGoToNextStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
		this.updateCompleteStatus();
	}

	onPay(): void {
		if (this.newLicenceAppId) {
			this.payNow(this.newLicenceAppId);
		} else {
			this.licenceApplicationService.submitLicenceRenewalAnonymous().subscribe({
				next: (resp: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => {
					console.debug('submitLicenceRenewalAnonymous', resp);
					console.debug('submitLicenceRenewalAnonymous', resp.body);

					// save this locally just in application payment fails
					this.newLicenceAppId = resp.body.licenceAppId!;

					this.hotToastService.success('Your licence renewal has been successfully submitted');
					this.payNow(this.newLicenceAppId);
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
					this.hotToastService.error('An error occurred during the save. Please try again.');
				},
			});
		}
	}

	private payNow(licenceAppId: string): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Licence Renewal`,
		};
		this.paymentService
			.apiUnauthLicenceApplicationIdPaymentLinkPost({
				applicationId: licenceAppId,
				body,
			})
			.pipe()
			.subscribe((res: PaymentLinkResponse) => {
				if (res.paymentLinkUrl) {
					window.location.assign(res.paymentLinkUrl);
				}
			});
	}
}
