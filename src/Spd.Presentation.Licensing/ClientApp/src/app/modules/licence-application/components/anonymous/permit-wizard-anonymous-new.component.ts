import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { PermitApplicationService } from '../../services/permit-application.service';
import { StepsPermitDetailsComponent } from './permit-wizard-steps/steps-permit-details.component';
import { StepsPermitIdentificationComponent } from './permit-wizard-steps/steps-permit-identification.component';
import { StepsPermitPurposeComponent } from './permit-wizard-steps/steps-permit-purpose.component';

@Component({
	selector: 'app-permit-wizard-anonymous-new',
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
					<mat-step [completed]="step1Complete">
						<ng-template matStepLabel> Permit Details </ng-template>
						<app-steps-permit-details
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-details>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Purpose & Rationale</ng-template>
						<app-steps-permit-purpose
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-purpose>
					</mat-step>

					<mat-step [completed]="step3Complete">
						<ng-template matStepLabel>Identification</ng-template>
						<app-steps-permit-identification
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-permit-identification>
					</mat-step>

					<!-- <mat-step [completed]="step4Complete">
						<ng-template matStepLabel>Contact Information</ng-template>
						<app-steps-identification-anonymous
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-identification-anonymous>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<ng-template matStepContent>
							<app-steps-review-licence-anonymous
								(previousStepperStep)="onPreviousStepperStep(stepper)"
								(nextStepperStep)="onNextStepperStep(stepper)"
								(nextPayStep)="onNextPayStep()"
								(scrollIntoView)="onScrollIntoView()"
								(goToStep)="onGoToStep($event)"
							></app-steps-review-licence-anonymous>
						</ng-template>
					</mat-step> -->

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
})
export class PermitWizardAnonymousNewComponent extends BaseWizardComponent implements OnInit {
	readonly STEP_PERMIT_DETAILS = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PURPOSE_AND_RATIONALE = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_CONTACT_INFORMATION = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	@ViewChild(StepsPermitDetailsComponent)
	stepsPermitDetailsComponent!: StepsPermitDetailsComponent;

	@ViewChild(StepsPermitPurposeComponent)
	stepsPermitPurposeComponent!: StepsPermitPurposeComponent;

	@ViewChild(StepsPermitIdentificationComponent)
	stepsPermitIdentificationComponent!: StepsPermitIdentificationComponent;

	// @ViewChild(StepsIdentificationAnonymousComponent)
	// stepContactInformationComponent!: StepsIdentificationAnonymousComponent;

	// @ViewChild(StepsReviewLicenceAuthenticatedComponent)
	// stepReviewLicenceComponent!: StepsReviewLicenceAuthenticatedComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private permitApplicationService: PermitApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.updateCompleteStatus();

		this.permitApplicationService.setLicenceTermsAndFees();
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
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
			// case this.STEP_CONTACT_INFORMATION:
			// 	this.stepContactInformationComponent?.onGoToFirstStep();
			// 	break;
			// case this.STEP_REVIEW_AND_CONFIRM:
			// 	this.stepReviewLicenceComponent?.onGoToFirstStep();
			// 	break;
		}
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
			// case this.STEP_CONTACT_INFORMATION:
			// 	this.stepContactInformationComponent?.onGoToLastStep();
			// 	break;
		}
	}

	onNextPayStep(): void {
		this.permitApplicationService.submitLicence().subscribe({
			next: (_resp: any) => {
				this.hotToastService.success('Your licence has been successfully submitted');
				this.router.navigateByUrl(LicenceApplicationRoutes.pathPermitAnonymous());
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
				this.hotToastService.error('An error occurred during the save. Please try again.');
			},
		});
	}

	// onPayNow(application: PaymentResponse): void {
	// 	const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
	// 	const body: PaymentLinkCreateRequest = {
	// 		applicationId: application.id!,
	// 		paymentMethod: PaymentMethodCode.CreditCard,
	// 		description: `Payment for Case ID: ${application.applicationNumber}`,
	// 	};
	// 	this.paymentService
	// 		.apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost({
	// 			orgId: orgId!,
	// 			applicationId: application.id!,
	// 			body,
	// 		})
	// 		.pipe()
	// 		.subscribe((res: PaymentLinkResponse) => {
	// 			if (res.paymentLinkUrl) {
	// 				window.location.assign(res.paymentLinkUrl);
	// 			}
	// 		});
	// }

	onNextStepperStep(stepper: MatStepper): void {
		this.updateCompleteStatus();

		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		// if (step == 99) {
		// 	this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
		// 	this.stepIdentificationComponent.onGoToContactStep();
		// 	return;
		// }

		this.stepsPermitDetailsComponent?.onGoToFirstStep();
		this.stepsPermitPurposeComponent?.onGoToFirstStep();
		this.stepsPermitIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		this.updateCompleteStatus();

		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}, 250);
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
		this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
		this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();
		// this.step4Complete = this.permitApplicationService.isStepIdentificationComplete(); // TODO fix
		console.debug('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete); //, this.step4Complete);
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
			// case this.STEP_CONTACT_INFORMATION:
			// 	this.stepContactInformationComponent?.onGoToNextStep();
			// 	break;
		}
		this.updateCompleteStatus();
	}
}
