import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { PermitApplicationService } from '@app/modules/licence-application/services/permit-application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged } from 'rxjs';
import { StepsBusinessInformationNewComponent } from './steps-business-information-new.component';

@Component({
	selector: 'app-business-wizard-new',
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
				<app-steps-business-information-new
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-business-information-new>
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
				<!-- <app-steps-permit-identification-anonymous
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-permit-identification-anonymous> -->
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
				<!-- <app-steps-permit-review-anonymous
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(nextPayStep)="onNextPayStep()"
						(scrollIntoView)="onScrollIntoView()"
						(goToStep)="onGoToStep($event)"
					></app-steps-permit-review-anonymous> -->
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class BusinessWizardNewComponent extends BaseWizardComponent implements OnInit {
	readonly STEP_BUSINESS_INFORMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_SELECTION = 1;
	readonly STEP_CONTACT_INFORMATION = 2;
	readonly STEP_CONTROLLING_MEMBERS = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	@ViewChild(StepsBusinessInformationNewComponent)
	stepsBusinessInformationComponent!: StepsBusinessInformationNewComponent;

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
	) // private commonApplicationService: CommonApplicationService
	{
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		// this.updateCompleteStatus();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToFirstStep();
				break;
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
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToLastStep();
				break;
			// 		case this.STEP_LICENCE_SELECTION:
			// 			this.stepsPermitPurposeComponent?.onGoToLastStep();
			// 			break;
			// 		case this.STEP_CONTACT_INFORMATION:
			// 			this.stepsPermitIdentificationComponent?.onGoToLastStep();
			// 			break;
			// 		case this.STEP_CONTROLLING_MEMBERS:
			// 			this.stepsPermitContactComponent?.onGoToLastStep();
			// 			break;
		}
	}

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

	// private payNow(licenceAppId: string): void {
	// 	this.commonApplicationService.payNow(licenceAppId, `Payment for Case ID: ${application.applicationNumber}`);
	// }

	onNextStepperStep(stepper: MatStepper): void {
		this.updateCompleteStatus();

		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(_step: number) {
		this.stepsBusinessInformationComponent?.onGoToFirstStep();
		// 	this.stepsPermitPurposeComponent?.onGoToFirstStep();
		// 	this.stepsPermitIdentificationComponent?.onGoToFirstStep();
		// 	this.stepsPermitContactComponent?.onGoToFirstStep();
		// 	this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		this.updateCompleteStatus();

		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}, 250);
	}

	private updateCompleteStatus(): void {
		// 	this.step1Complete = this.permitApplicationService.isStepPermitDetailsComplete();
		// 	this.step2Complete = this.permitApplicationService.isStepPurposeAndRationaleComplete();
		// 	this.step3Complete = this.permitApplicationService.isStepIdentificationComplete();
		// 	this.step4Complete = this.permitApplicationService.isStepContactComplete();
		// 	console.debug('iscomplete', this.step1Complete, this.step2Complete, this.step3Complete); //, this.step4Complete);
	}

	onChildNextStep() {
		console.log('onChildNextStep', this.stepper.selectedIndex);
		switch (this.stepper.selectedIndex) {
			case this.STEP_BUSINESS_INFORMATION:
				this.stepsBusinessInformationComponent?.onGoToNextStep();
				break;
			// 		case this.STEP_LICENCE_SELECTION:
			// 			this.stepsPermitPurposeComponent?.onGoToNextStep();
			// 			break;
			// 		case this.STEP_CONTACT_INFORMATION:
			// 			this.stepsPermitIdentificationComponent?.onGoToNextStep();
			// 			break;
			// 		case this.STEP_CONTROLLING_MEMBERS:
			// 			this.stepsPermitContactComponent?.onGoToNextStep();
			// 			break;
		}
		this.updateCompleteStatus();
	}
}
