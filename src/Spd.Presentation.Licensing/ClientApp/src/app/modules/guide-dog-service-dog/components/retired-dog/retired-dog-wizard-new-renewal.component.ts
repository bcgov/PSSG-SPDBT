import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, GdsdAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsRdDetailsComponent } from './steps-rd-details.component';
import { StepsRdDogInfoComponent } from './steps-rd-dog-info.component';
import { StepsRdPersonalInfoComponent } from './steps-rd-personal-info.component';
import { StepsRdReviewAndConfirmComponent } from './steps-rd-review-and-confirm.component';

@Component({
	selector: 'app-retired-dog-wizard-new-renewal',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="true">
				<ng-template matStepLabel>Certificate Details</ng-template>
				<app-steps-rd-details
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-rd-details>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Personal Information</ng-template>
				<app-steps-rd-personal-info
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="isLoggedIn"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-rd-personal-info>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Dog Information</ng-template>
				<app-steps-rd-dog-info
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-rd-dog-info>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-rd-review-and-confirm
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onSubmit()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-rd-review-and-confirm>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	standalone: false,
})
export class RetiredDogWizardNewRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_DETAILS = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PERSONAL_INFO = 1;
	readonly STEP_DOG_INFO = 2;
	readonly STEP_REVIEW_AND_CONFIRM = 3;
	readonly STEP_SUBMIT = 4;

	isLoggedIn = false; // TODO handle auth
	step2Complete = false;
	step3Complete = false;

	licenceAppId: string | null = null;

	@ViewChild(StepsRdDetailsComponent) stepsDetails!: StepsRdDetailsComponent;
	@ViewChild(StepsRdPersonalInfoComponent) stepsPersonallInfo!: StepsRdPersonalInfoComponent;
	@ViewChild(StepsRdDogInfoComponent) stepsDogInfo!: StepsRdDogInfoComponent;
	@ViewChild(StepsRdReviewAndConfirmComponent) stepsReviewConfirm!: StepsRdReviewAndConfirmComponent;

	isFormValid = false;

	applicationTypeCode!: ApplicationTypeCode;

	private retiredDogModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.retiredDogApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.retiredDogModelChangedSubscription = this.retiredDogApplicationService.retiredDogModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.applicationTypeCode = this.retiredDogApplicationService.retiredDogModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.retiredDogModelChangedSubscription) this.retiredDogModelChangedSubscription.unsubscribe();
	}

	onSubmit(): void {
		this.retiredDogApplicationService.submitLicenceNewAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<GdsdAppCommandResponse>) => {
				this.router.navigateByUrl(
					GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.GDSD_APPLICATION_RECEIVED)
				);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_DETAILS:
				this.stepsDetails?.onGoToFirstStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepsPersonallInfo?.onGoToFirstStep();
				break;
			case this.STEP_DOG_INFO:
				this.stepsDogInfo?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewConfirm?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_DETAILS:
				this.stepsDetails?.onGoToLastStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepsPersonallInfo?.onGoToLastStep();
				break;
			case this.STEP_DOG_INFO:
				this.stepsDogInfo?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToReview() {
		this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
	}

	onGoToStep(step: number) {
		this.stepsDetails?.onGoToFirstStep();
		this.stepsPersonallInfo?.onGoToFirstStep();
		this.stepsDogInfo?.onGoToFirstStep();
		this.stepsReviewConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_DETAILS:
				this.stepsDetails?.onGoToNextStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepsPersonallInfo?.onGoToNextStep();
				break;
			case this.STEP_DOG_INFO:
				this.stepsDogInfo?.onGoToNextStep();
				break;
		}
	}

	private updateCompleteStatus(): void {
		this.step2Complete = this.retiredDogApplicationService.isStepRetiredDogPersonalInfoComplete();
		this.step3Complete = this.retiredDogApplicationService.isStepRetiredDogDogInfoComplete();

		console.debug('Complete Status', this.step2Complete, this.step3Complete);
	}
}
