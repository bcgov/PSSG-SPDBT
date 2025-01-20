import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';

@Component({
	selector: 'app-gdsd-wizard-anonymous-new',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Certificate Selection</ng-template>
				<!-- <app-steps-gdsd-details-new
					[isLoggedIn]="false"
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-details-new> -->
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Personal Information</ng-template>
				<!-- <app-steps-gdsd-purpose-anonymous
					[isFormValid]="isFormValid"
					[showEmployerInformation]="showEmployerInformation"
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-purpose-anonymous> -->
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Dog Information</ng-template>
				<!-- <app-steps-gdsd-identification-anonymous
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-identification-anonymous> -->
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Training Information</ng-template>
				<!-- <app-steps-gdsd-contact
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[showSaveAndExit]="false"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-contact> -->
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<!-- <app-steps-gdsd-review-anonymous
					[serviceTypeCode]="serviceTypeCode"
					[applicationTypeCode]="applicationTypeCode"
					[showEmployerInformation]="showEmployerInformation"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(nextPayStep)="onNextPayStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-gdsd-review-anonymous> -->
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	standalone: false,
})
export class GdsdWizardAnonymousNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_CERTIFICATE = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PERSONAL_INFO = 1;
	readonly STEP_DOG_INFO = 2;
	readonly STEP_TRAINING_INFO = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;
	readonly STEP_SUBMIT = 5;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	licenceAppId: string | null = null;

	// @ViewChild(StepsGdsdDetailsNewComponent)
	// stepsGdsdDetailsComponent!: StepsGdsdDetailsNewComponent;

	// @ViewChild(StepsGdsdPurposeAnonymousComponent)
	// stepsGdsdPurposeComponent!: StepsGdsdPurposeAnonymousComponent;

	// @ViewChild(StepsGdsdIdentificationAnonymousComponent)
	// stepsGdsdIdentificationComponent!: StepsGdsdIdentificationAnonymousComponent;

	// @ViewChild(StepsGdsdContactComponent)
	// stepsGdsdContactComponent!: StepsGdsdContactComponent;

	// @ViewChild(StepsGdsdReviewAnonymousComponent)
	// stepsGdsdReviewComponent!: StepsGdsdReviewAnonymousComponent;

	isFormValid = false;

	applicationTypeCode!: ApplicationTypeCode;

	private gdsdModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		// private gdsdApplicationService: gdsdApplicationService,
		private commonApplicationService: CommonApplicationService,
		private gdsdApplicationService: GdsdApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		// if (!this.gdsdApplicationService.initialized) {
		// 	this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
		// 	return;
		// }

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.gdsdModelChangedSubscription = this.gdsdApplicationService.gdsdModelValueChanges$.subscribe((_resp: any) => {
			this.isFormValid = _resp;

			// this.applicationTypeCode = this.gdsdApplicationService.gdsdModelFormGroup.get(
			// 	'applicationTypeData.applicationTypeCode'
			// )?.value;

			this.updateCompleteStatus();
		});
	}

	ngOnDestroy() {
		if (this.gdsdModelChangedSubscription) this.gdsdModelChangedSubscription.unsubscribe();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		// switch (event.selectedIndex) {
		// 	case this.STEP_GDSD_DETAILS:
		// 		this.stepsGdsdDetailsComponent?.onGoToFirstStep();
		// 		break;
		// 	case this.STEP_PURPOSE_AND_RATIONALE:
		// 		this.stepsGdsdPurposeComponent?.onGoToFirstStep();
		// 		break;
		// 	case this.STEP_IDENTIFICATION:
		// 		this.stepsGdsdIdentificationComponent?.onGoToFirstStep();
		// 		break;
		// 	case this.STEP_CONTACT_INFORMATION:
		// 		this.stepsGdsdContactComponent?.onGoToFirstStep();
		// 		break;
		// 	case this.STEP_REVIEW_AND_CONFIRM:
		// 		this.stepsGdsdReviewComponent?.onGoToFirstStep();
		// 		break;
		// }

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		// switch (stepper.selectedIndex) {
		// 	case this.STEP_GDSD_DETAILS:
		// 		this.stepsGdsdDetailsComponent?.onGoToLastStep();
		// 		break;
		// 	case this.STEP_PURPOSE_AND_RATIONALE:
		// 		this.stepsGdsdPurposeComponent?.onGoToLastStep();
		// 		break;
		// 	case this.STEP_IDENTIFICATION:
		// 		this.stepsGdsdIdentificationComponent?.onGoToLastStep();
		// 		break;
		// 	case this.STEP_CONTACT_INFORMATION:
		// 		this.stepsGdsdContactComponent?.onGoToLastStep();
		// 		break;
		// }
	}

	onNextPayStep(): void {
		// If the creation worked and the payment failed, do not post again
		// if (this.licenceAppId) {
		// 	this.payNow(this.licenceAppId);
		// } else {
		// 	this.gdsdApplicationService.submitGdsdAnonymous().subscribe({
		// 		next: (resp: StrictHttpResponse<GdsdAppCommandResponse>) => {
		// 			// save this locally just in payment fails
		// 			this.licenceAppId = resp.body.licenceAppId!;
		// 			const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
		// 				this.serviceTypeCode,
		// 				this.applicationTypeCode
		// 			);
		// 			this.hotToastService.success(successMessage);
		// 			this.payNow(this.licenceAppId);
		// 		},
		// 		error: (error: any) => {
		// 			console.log('An error occurred during save', error);
		// 		},
		// 	});
		// }
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		// this.stepsGdsdDetailsComponent?.onGoToFirstStep();
		// this.stepsGdsdPurposeComponent?.onGoToFirstStep();
		// this.stepsGdsdIdentificationComponent?.onGoToFirstStep();
		// this.stepsGdsdContactComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}, 250);
	}

	onChildNextStep() {
		// switch (this.stepper.selectedIndex) {
		// 	case this.STEP_GDSD_DETAILS:
		// 		this.stepsGdsdDetailsComponent?.onGoToNextStep();
		// 		break;
		// 	case this.STEP_PURPOSE_AND_RATIONALE:
		// 		this.stepsGdsdPurposeComponent?.onGoToNextStep();
		// 		break;
		// 	case this.STEP_IDENTIFICATION:
		// 		this.stepsGdsdIdentificationComponent?.onGoToNextStep();
		// 		break;
		// 	case this.STEP_CONTACT_INFORMATION:
		// 		this.stepsGdsdContactComponent?.onGoToNextStep();
		// 		break;
		// }
	}

	private updateCompleteStatus(): void {
		// this.step1Complete = this.gdsdApplicationService.isStepGdsdDetailsComplete();
		// this.step2Complete = this.gdsdApplicationService.isStepPurposeAndRationaleComplete();
		// this.step3Complete = this.gdsdApplicationService.isStepIdentificationComplete();
		// this.step4Complete = this.gdsdApplicationService.isStepContactComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}
}
