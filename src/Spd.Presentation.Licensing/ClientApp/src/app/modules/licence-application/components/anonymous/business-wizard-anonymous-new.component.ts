import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { PermitApplicationService } from '../../services/permit-application.service';

@Component({
	selector: 'app-business-wizard-anonymous-new',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Business Information</ng-template>
				<!-- <app-steps-permit-details-new
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-details-new> -->
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Licence Selection</ng-template>
				<!-- <app-steps-permit-purpose
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-purpose> -->
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Contact Information</ng-template>
				<!-- <app-steps-permit-identification
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-identification> -->
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Controlling Members & Employees</ng-template>
				<!-- <app-steps-permit-contact
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-contact> -->
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<ng-template matStepContent>
					<!-- <app-steps-permit-review-anonymous
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(nextPayStep)="onNextPayStep()"
						(scrollIntoView)="onScrollIntoView()"
						(goToStep)="onGoToStep($event)"
					></app-steps-permit-review-anonymous> -->
				</ng-template>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class BusinessWizardAnonymousNewComponent extends BaseWizardComponent implements OnInit {
	readonly STEP_BUSINESS_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 1;
	readonly STEP_CONTACT_INFORMATION = 2;
	readonly STEP_CONTROLLING_MEMBERS = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	// @ViewChild(StepsPermitDetailsUpdateComponent)
	// stepsPermitDetailsComponent!: StepsPermitDetailsUpdateComponent;

	// @ViewChild(StepsPermitPurposeComponent)
	// stepsPermitPurposeComponent!: StepsPermitPurposeComponent;

	// @ViewChild(StepsPermitIdentificationComponent)
	// stepsPermitIdentificationComponent!: StepsPermitIdentificationComponent;

	// @ViewChild(StepsPermitContactComponent)
	// stepsPermitContactComponent!: StepsPermitContactComponent;

	// @ViewChild(StepsPermitReviewAnonymousComponent)
	// stepsPermitReviewComponent!: StepsPermitReviewAnonymousComponent;

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

		// this.updateCompleteStatus();
	}

	// override onStepSelectionChange(event: StepperSelectionEvent) {
	// 	switch (event.selectedIndex) {
	// 		case this.STEP_BUSINESS_INFORMATION:
	// 			this.stepsPermitDetailsComponent?.onGoToFirstStep();
	// 			break;
	// 		case this.STEP_LICENCE_SELECTION:
	// 			this.stepsPermitPurposeComponent?.onGoToFirstStep();
	// 			break;
	// 		case this.STEP_CONTACT_INFORMATION:
	// 			this.stepsPermitIdentificationComponent?.onGoToFirstStep();
	// 			break;
	// 		case this.STEP_CONTROLLING_MEMBERS:
	// 			this.stepsPermitContactComponent?.onGoToFirstStep();
	// 			break;
	// 		case this.STEP_REVIEW_AND_CONFIRM:
	// 			this.stepsPermitReviewComponent?.onGoToFirstStep();
	// 			break;
	// 	}

	// 	super.onStepSelectionChange(event);
	// }

	// onPreviousStepperStep(stepper: MatStepper): void {
	// 	stepper.previous();

	// 	switch (stepper.selectedIndex) {
	// 		case this.STEP_BUSINESS_INFORMATION:
	// 			this.stepsPermitDetailsComponent?.onGoToLastStep();
	// 			break;
	// 		case this.STEP_LICENCE_SELECTION:
	// 			this.stepsPermitPurposeComponent?.onGoToLastStep();
	// 			break;
	// 		case this.STEP_CONTACT_INFORMATION:
	// 			this.stepsPermitIdentificationComponent?.onGoToLastStep();
	// 			break;
	// 		case this.STEP_CONTROLLING_MEMBERS:
	// 			this.stepsPermitContactComponent?.onGoToLastStep();
	// 			break;
	// 	}
	// }

	// onNextPayStep(): void {
	// 	this.permitApplicationService.submitPermit().subscribe({
	// 		next: (_resp: any) => {
	// 			this.hotToastService.success('Your licence has been successfully submitted');
	// 			this.router.navigateByUrl(LicenceApplicationRoutes.pathPermitAnonymous());
	// 		},
	// 		error: (error: any) => {
	// 			console.log('An error occurred during save', error);
	// 			this.hotToastService.error('An error occurred during the save. Please try again.');
	// 		},
	// 	});
	// }

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

	// onNextStepperStep(stepper: MatStepper): void {
	// 	this.updateCompleteStatus();

	// 	if (stepper?.selected) stepper.selected.completed = true;
	// 	stepper.next();
	// }

	// onGoToStep(step: number) {
	// 	// if (step == 99) {
	// 	// 	this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
	// 	// 	this.stepIdentificationComponent.onGoToContactStep();
	// 	// 	return;
	// 	// }

	// 	this.stepsPermitDetailsComponent?.onGoToFirstStep();
	// 	this.stepsPermitPurposeComponent?.onGoToFirstStep();
	// 	this.stepsPermitIdentificationComponent?.onGoToFirstStep();
	// 	this.stepsPermitContactComponent?.onGoToFirstStep();
	// 	this.stepper.selectedIndex = step;
	// }

	// onGoToReview() {
	// 	this.updateCompleteStatus();

	// 	setTimeout(() => {
	// 		// hack... does not navigate without the timeout
	// 		this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
	// 	}, 250);
	// }

	// private updateCompleteStatus(): void {
	// 	this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
	// 	this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
	// 	this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();
	// 	this.step4Complete = this.permitApplicationService.isStepContactComplete();
	// 	console.debug('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete); //, this.step4Complete);
	// }

	// onChildNextStep() {
	// 	console.log('onChildNextStep', this.stepper.selectedIndex);
	// 	switch (this.stepper.selectedIndex) {
	// 		case this.STEP_BUSINESS_INFORMATION:
	// 			this.stepsPermitDetailsComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_LICENCE_SELECTION:
	// 			this.stepsPermitPurposeComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_CONTACT_INFORMATION:
	// 			this.stepsPermitIdentificationComponent?.onGoToNextStep();
	// 			break;
	// 		case this.STEP_CONTROLLING_MEMBERS:
	// 			this.stepsPermitContactComponent?.onGoToNextStep();
	// 			break;
	// 	}
	// 	this.updateCompleteStatus();
	// }
}
