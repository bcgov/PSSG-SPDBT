import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, GdsdAppCommandResponse, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { GuideDogServiceDogRoutes } from '../../guide-dog-service-dog-routes';
import { StepsGdsdDogInfoComponent } from '../anonymous/steps-gdsd-dog-info.component';
import { StepsGdsdPersonalInfoComponent } from '../anonymous/steps-gdsd-personal-info.component';
import { StepsGdsdReviewConfirmComponent } from '../anonymous/steps-gdsd-review-confirm.component';
import { StepsGdsdSelectionComponent } from '../anonymous/steps-gdsd-selection.component';
import { StepsGdsdTrainingInfoComponent } from '../anonymous/steps-gdsd-training-info.component';

@Component({
	selector: 'app-gdsd-wizard-new',
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
				<app-steps-gdsd-selection
					[isLoggedIn]="false"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-selection>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Personal Information</ng-template>
				<app-steps-gdsd-personal-info
					[isLoggedIn]="false"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-personal-info>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Dog Information</ng-template>
				<app-steps-gdsd-dog-info
					[isLoggedIn]="false"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-dog-info>
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Training Information</ng-template>
				<app-steps-gdsd-training-info
					[isLoggedIn]="false"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					[hasAttendedTrainingSchool]="hasAttendedTrainingSchool"
					[isServiceDog]="isServiceDog"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-training-info>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-gdsd-review-confirm
					[isLoggedIn]="false"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					[hasAttendedTrainingSchool]="hasAttendedTrainingSchool"
					[isServiceDog]="isServiceDog"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextSubmitStep)="onSubmit()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-gdsd-review-confirm>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	standalone: false,
})
export class GdsdWizardNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PERSONAL_INFO = 1;
	readonly STEP_DOG_INFO = 2;
	readonly STEP_TRAINING_INFO = 3;
	readonly STEP_REVIEW_AND_CONFIRM = 4;
	readonly STEP_SUBMIT = 5;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	showSaveAndExit = false;
	licenceAppId: string | null = null;

	@ViewChild(StepsGdsdSelectionComponent)
	stepsSelection!: StepsGdsdSelectionComponent;

	@ViewChild(StepsGdsdPersonalInfoComponent)
	stepsPersonalInfo!: StepsGdsdPersonalInfoComponent;

	@ViewChild(StepsGdsdDogInfoComponent)
	stepsDogInfo!: StepsGdsdDogInfoComponent;

	@ViewChild(StepsGdsdTrainingInfoComponent)
	stepsTrainingInfo!: StepsGdsdTrainingInfoComponent;

	@ViewChild(StepsGdsdReviewConfirmComponent)
	stepsReviewConfirm!: StepsGdsdReviewConfirmComponent;

	isFormValid = false;
	isTrainedByAccreditedSchools = false;
	hasAttendedTrainingSchool = false;
	isServiceDog = false;

	applicationTypeCode!: ApplicationTypeCode;

	private gdsdModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private hotToastService: HotToastService,
		private router: Router,
		private commonApplicationService: CommonApplicationService,
		private gdsdApplicationService: GdsdApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.gdsdApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.gdsdModelChangedSubscription = this.gdsdApplicationService.gdsdModelValueChanges$.subscribe((_resp: any) => {
			this.isFormValid = _resp;

			this.isServiceDog =
				this.gdsdApplicationService.gdsdModelFormGroup.get('dogCertificationSelectionData.isGuideDog')?.value ===
				BooleanTypeCode.No;

			this.isTrainedByAccreditedSchools =
				this.gdsdApplicationService.gdsdModelFormGroup.get(
					'dogCertificationSelectionData.isDogTrainedByAccreditedSchool'
				)?.value === BooleanTypeCode.Yes;

			this.hasAttendedTrainingSchool =
				this.gdsdApplicationService.gdsdModelFormGroup.get('trainingHistoryData.hasAttendedTrainingSchool')?.value ===
				BooleanTypeCode.Yes;

			this.updateCompleteStatus();
		});
	}

	ngOnDestroy() {
		if (this.gdsdModelChangedSubscription) this.gdsdModelChangedSubscription.unsubscribe();
	}

	onSubmit(): void {
		this.gdsdApplicationService.submitAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<GdsdAppCommandResponse>) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					ServiceTypeCode.GdsdTeamCertification,
					this.applicationTypeCode
				);
				this.hotToastService.success(successMessage);

				this.router.navigateByUrl(
					GuideDogServiceDogRoutes.pathGdsdAnonymous(GuideDogServiceDogRoutes.GDSD_APPLICATION_RECEIVED),
					{ state: { isSubmit: BooleanTypeCode.Yes } }
				);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_SELECTION:
				this.stepsSelection?.onGoToFirstStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepsPersonalInfo?.onGoToFirstStep();
				break;
			case this.STEP_DOG_INFO:
				this.stepsDogInfo?.onGoToFirstStep();
				break;
			case this.STEP_TRAINING_INFO:
				this.stepsTrainingInfo?.onGoToFirstStep();
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
			case this.STEP_SELECTION:
				this.stepsSelection?.onGoToLastStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepsPersonalInfo?.onGoToLastStep();
				break;
			case this.STEP_DOG_INFO:
				this.stepsDogInfo?.onGoToLastStep();
				break;
			case this.STEP_TRAINING_INFO:
				this.stepsTrainingInfo?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		this.stepsSelection?.onGoToFirstStep();
		this.stepsPersonalInfo?.onGoToFirstStep();
		this.stepsDogInfo?.onGoToFirstStep();
		this.stepsTrainingInfo?.onGoToFirstStep();
		this.stepsReviewConfirm?.onGoToFirstStep();
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
			case this.STEP_SELECTION:
				this.stepsSelection?.onGoToNextStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepsPersonalInfo?.onGoToNextStep();
				break;
			case this.STEP_DOG_INFO:
				this.stepsDogInfo?.onGoToNextStep();
				break;
			case this.STEP_TRAINING_INFO:
				this.stepsTrainingInfo?.onGoToNextStep();
				break;
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.gdsdApplicationService.isStepSelectionComplete();
		this.step2Complete = this.gdsdApplicationService.isStepPersonalInformationComplete();
		this.step3Complete = this.gdsdApplicationService.isStepDogInformationComplete();
		this.step4Complete = this.gdsdApplicationService.isStepTrainingInformationComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}
}
