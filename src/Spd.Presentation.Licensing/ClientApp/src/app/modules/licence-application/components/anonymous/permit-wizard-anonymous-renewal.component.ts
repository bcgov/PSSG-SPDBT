import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ApplicationTypeCode, PermitAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { CommonApplicationService } from '../../services/common-application.service';
import { PermitApplicationService } from '../../services/permit-application.service';
import { StepsPermitContactComponent } from './permit-wizard-steps/steps-permit-contact.component';
import { StepsPermitDetailsRenewalComponent } from './permit-wizard-steps/steps-permit-details-renewal.component';
import { StepsPermitIdentificationAnonymousComponent } from './permit-wizard-steps/steps-permit-identification-anonymous.component';
import { StepsPermitPurposeAnonymousComponent } from './permit-wizard-steps/steps-permit-purpose.component-anonymous';
import { StepsPermitReviewAnonymousComponent } from './permit-wizard-steps/steps-permit-review-anonymous.component';

@Component({
	selector: 'app-permit-wizard-anonymous-renewal',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel> Permit Details </ng-template>
				<app-steps-permit-details-renewal
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-details-renewal>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Purpose & Rationale</ng-template>
				<app-steps-permit-purpose-anonymous
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-purpose-anonymous>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Identification</ng-template>
				<app-steps-permit-identification-anonymous
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-identification-anonymous>
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Contact Information</ng-template>
				<app-steps-permit-contact
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-contact>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-permit-review-anonymous
					[applicationTypeCode]="applicationTypeCodes.Renewal"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(nextPayStep)="onNextPayStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-permit-review-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class PermitWizardAnonymousRenewalComponent extends BaseWizardComponent implements OnInit {
	readonly STEP_PERMIT_DETAILS = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PURPOSE_AND_RATIONALE = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_CONTACT_INFORMATION = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	applicationTypeCodes = ApplicationTypeCode;

	newLicenceAppId: string | null = null;

	@ViewChild(StepsPermitDetailsRenewalComponent)
	stepsPermitDetailsComponent!: StepsPermitDetailsRenewalComponent;

	@ViewChild(StepsPermitPurposeAnonymousComponent)
	stepsPermitPurposeComponent!: StepsPermitPurposeAnonymousComponent;

	@ViewChild(StepsPermitIdentificationAnonymousComponent)
	stepsPermitIdentificationComponent!: StepsPermitIdentificationAnonymousComponent;

	@ViewChild(StepsPermitContactComponent)
	stepsPermitContactComponent!: StepsPermitContactComponent;

	@ViewChild(StepsPermitReviewAnonymousComponent)
	stepReviewLicenceComponent!: StepsPermitReviewAnonymousComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private hotToastService: HotToastService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
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
			case this.STEP_PERMIT_DETAILS:
				this.stepsPermitDetailsComponent?.onGoToFirstStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepsPermitPurposeComponent?.onGoToFirstStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepsPermitIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsPermitContactComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepReviewLicenceComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepsPermitDetailsComponent?.onGoToLastStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepsPermitPurposeComponent?.onGoToLastStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepsPermitIdentificationComponent?.onGoToLastStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsPermitContactComponent?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		this.updateCompleteStatus();

		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		this.stepsPermitDetailsComponent?.onGoToFirstStep();
		this.stepsPermitPurposeComponent?.onGoToFirstStep();
		this.stepsPermitIdentificationComponent?.onGoToFirstStep();
		this.stepsPermitContactComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		this.updateCompleteStatus();

		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}, 250);
	}

	onChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_PERMIT_DETAILS:
				this.stepsPermitDetailsComponent?.onGoToNextStep();
				break;
			case this.STEP_PURPOSE_AND_RATIONALE:
				this.stepsPermitPurposeComponent?.onGoToNextStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepsPermitIdentificationComponent?.onGoToNextStep();
				break;
			case this.STEP_CONTACT_INFORMATION:
				this.stepsPermitContactComponent?.onGoToNextStep();
				break;
		}
		this.updateCompleteStatus();
	}

	onNextPayStep(): void {
		if (this.newLicenceAppId) {
			this.payNow(this.newLicenceAppId);
		} else {
			this.permitApplicationService.submitPermitAnonymous().subscribe({
				next: (resp: StrictHttpResponse<PermitAppCommandResponse>) => {
					console.debug('[onPay] submitPermitAnonymous', resp.body);

					// save this locally just in application payment fails
					this.newLicenceAppId = resp.body.licenceAppId!;

					this.hotToastService.success('Your permit renewal has been successfully submitted');
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
		this.commonApplicationService.payNowAnonymous(licenceAppId, 'Payment for Permit Renewal');
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
		this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
		this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();
		this.step4Complete = this.permitApplicationService.isStepContactComplete();

		console.debug('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}
}
