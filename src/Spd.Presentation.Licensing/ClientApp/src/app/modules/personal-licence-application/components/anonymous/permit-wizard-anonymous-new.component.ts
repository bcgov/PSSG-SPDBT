import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, PermitAppCommandResponse, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routes';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { PermitApplicationService } from '@app/core/services/permit-application.service';
import { UtilService } from '@app/core/services/util.service';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsPermitContactComponent } from './permit-wizard-step-components/steps-permit-contact.component';
import { StepsPermitDetailsNewComponent } from './permit-wizard-step-components/steps-permit-details-new.component';
import { StepsPermitIdentificationAnonymousComponent } from './permit-wizard-step-components/steps-permit-identification-anonymous.component';
import { StepsPermitPurposeAnonymousComponent } from './permit-wizard-step-components/steps-permit-purpose.component-anonymous';
import { StepsPermitReviewAnonymousComponent } from './permit-wizard-step-components/steps-permit-review-anonymous.component';

@Component({
	selector: 'app-permit-wizard-anonymous-new',
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
				<app-steps-permit-details-new
					[isLoggedIn]="false"
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-details-new>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Purpose & Rationale</ng-template>
				<app-steps-permit-purpose-anonymous
					[isFormValid]="isFormValid"
					[showEmployerInformation]="showEmployerInformation"
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
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
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[serviceTypeCode]="serviceTypeCode"
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
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[showSaveAndExit]="false"
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
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					[showEmployerInformation]="showEmployerInformation"
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
	standalone: false,
})
export class PermitWizardAnonymousNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_PERMIT_DETAILS = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PURPOSE_AND_RATIONALE = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_CONTACT_INFORMATION = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	licenceAppId: string | null = null;

	@ViewChild(StepsPermitDetailsNewComponent)
	stepsPermitDetailsComponent!: StepsPermitDetailsNewComponent;

	@ViewChild(StepsPermitPurposeAnonymousComponent)
	stepsPermitPurposeComponent!: StepsPermitPurposeAnonymousComponent;

	@ViewChild(StepsPermitIdentificationAnonymousComponent)
	stepsPermitIdentificationComponent!: StepsPermitIdentificationAnonymousComponent;

	@ViewChild(StepsPermitContactComponent)
	stepsPermitContactComponent!: StepsPermitContactComponent;

	@ViewChild(StepsPermitReviewAnonymousComponent)
	stepsPermitReviewComponent!: StepsPermitReviewAnonymousComponent;

	isFormValid = false;
	showEmployerInformation = false;

	serviceTypeCode!: ServiceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	private permitModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private utilService: UtilService,
		private permitApplicationService: PermitApplicationService,
		private commonApplicationService: CommonApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.permitApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.permitModelChangedSubscription = this.permitApplicationService.permitModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.serviceTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'serviceTypeData.serviceTypeCode'
				)?.value;
				this.applicationTypeCode = this.permitApplicationService.permitModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.showEmployerInformation = this.permitApplicationService.getShowEmployerInformation(this.serviceTypeCode);

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.permitModelChangedSubscription) this.permitModelChangedSubscription.unsubscribe();
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
				this.stepsPermitReviewComponent?.onGoToFirstStep();
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

	onNextPayStep(): void {
		// If the creation worked and the payment failed, do not post again
		if (this.licenceAppId) {
			this.payNow(this.licenceAppId);
		} else {
			this.permitApplicationService.submitPermitAnonymous().subscribe({
				next: (resp: StrictHttpResponse<PermitAppCommandResponse>) => {
					// save this locally just in payment fails
					this.licenceAppId = resp.body.licenceAppId!;

					const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
						this.serviceTypeCode,
						this.applicationTypeCode
					);
					this.utilService.toasterSuccess(successMessage);

					this.payNow(this.licenceAppId);
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
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
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
		this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
		this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();
		this.step4Complete = this.permitApplicationService.isStepContactComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAnonymous(licenceAppId);
	}
}
