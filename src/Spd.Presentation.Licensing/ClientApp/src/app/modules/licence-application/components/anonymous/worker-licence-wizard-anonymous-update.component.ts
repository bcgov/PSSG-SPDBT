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
import { StepsWorkerLicenceReviewAuthenticatedComponent } from '@app/modules/licence-application/components/authenticated/worker-licence-wizard-steps/steps-worker-licence-review-authenticated.component';
import { StepsWorkerLicenceBackgroundRenewAndUpdateComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/steps-worker-licence-background-renew-and-update.component';
import { StepsWorkerLicenceSelectionComponent } from '@app/modules/licence-application/components/shared/worker-licence-wizard-steps/steps-worker-licence-selection.component';
import { LicenceApplicationService } from '@app/modules/licence-application/services/licence-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { StepsWorkerLicenceIdentificationAnonymousComponent } from './worker-licence-wizard-steps/steps-worker-licence-identification-anonymous.component';

@Component({
	selector: 'app-worker-licence-wizard-anonymous-update',
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
				<app-steps-worker-licence-selection
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-selection>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Background</ng-template>
				<app-steps-worker-licence-background-renew-and-update
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-background-renew-and-update>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Identification</ng-template>
				<app-steps-worker-licence-identification-anonymous
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-identification-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review and Confirm</ng-template>
				<ng-template matStepContent>
					<app-steps-worker-licence-review-anonymous
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onPay()"
						(scrollIntoView)="onScrollIntoView()"
						(goToStep)="onGoToStep($event)"
					></app-steps-worker-licence-review-anonymous>
				</ng-template>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class WorkerLicenceWizardAnonymousUpdateComponent extends BaseWizardComponent implements OnInit {
	readonly STEP_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	newLicenceAppId: string | null = null;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;

	@ViewChild(StepsWorkerLicenceBackgroundRenewAndUpdateComponent)
	stepBackgroundComponent!: StepsWorkerLicenceBackgroundRenewAndUpdateComponent;

	@ViewChild(StepsWorkerLicenceIdentificationAnonymousComponent)
	stepIdentificationComponent!: StepsWorkerLicenceIdentificationAnonymousComponent;

	@ViewChild(StepsWorkerLicenceReviewAuthenticatedComponent)
	stepReviewLicenceComponent!: StepsWorkerLicenceReviewAuthenticatedComponent;

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
		if (step == 99) {
			this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
			this.stepIdentificationComponent.onGoToContactStep();
			return;
		}

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
		// const isFormValid = this.stepMailingAddressComponent.isFormValid();

		// console.log('onPay', this.licenceApplicationService.licenceModelFormGroup.value);
		// console.log('onPay valid', this.licenceApplicationService.licenceModelFormGroup.valid);

		// if (isFormValid) {
		if (this.newLicenceAppId) {
			this.payNow(this.newLicenceAppId);
		} else {
			this.licenceApplicationService.submitLicenceAnonymous().subscribe({
				next: (resp: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => {
					console.debug('[onPay] submitLicenceAnonymous', resp.body);

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
			// }
		}
	}

	private payNow(licenceAppId: string): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Licence Update`,
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
