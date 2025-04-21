import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, DogTrainerAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { DogTrainerApplicationService } from '@app/core/services/dog-trainer-application.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsDtDetailsComponent } from './steps-dt-details.component';
import { StepsDtPersonalInfoComponent } from './steps-dt-personal-info.component';
import { StepsDtReviewAndConfirmComponent } from './steps-dt-review-and-confirm.component';
import { StepsDtTrainingSchoolInfoComponent } from './steps-dt-training-school-info.component';

@Component({
	selector: 'app-dog-trainer-wizard-new-renewal',
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
				<app-steps-dt-details
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-dt-details>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Training School Information</ng-template>
				<app-steps-dt-training-school-info
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-dt-training-school-info>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Dog Trainer Information</ng-template>
				<app-steps-dt-personal-info
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-dt-personal-info>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-dt-review-and-confirm
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onSubmit()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-dt-review-and-confirm>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	standalone: false,
})
export class DogTrainerWizardNewRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_DETAILS = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_TRAINING_SCHOOL_INFO = 1;
	readonly STEP_DOG_TRAINER_PERSONAL_INFO = 2;
	readonly STEP_REVIEW_AND_CONFIRM = 3;
	readonly STEP_SUBMIT = 4;

	step2Complete = false;
	step3Complete = false;

	licenceAppId: string | null = null;

	@ViewChild(StepsDtDetailsComponent) stepsDetails!: StepsDtDetailsComponent;
	@ViewChild(StepsDtTrainingSchoolInfoComponent) stepsSchoolInfo!: StepsDtTrainingSchoolInfoComponent;
	@ViewChild(StepsDtPersonalInfoComponent) stepsPersonallInfo!: StepsDtPersonalInfoComponent;
	@ViewChild(StepsDtReviewAndConfirmComponent) stepsReviewConfirm!: StepsDtReviewAndConfirmComponent;

	isFormValid = false;

	applicationTypeCode!: ApplicationTypeCode;

	private dogTrainerModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private dogTrainerApplicationService: DogTrainerApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.dogTrainerApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.dogTrainerModelChangedSubscription = this.dogTrainerApplicationService.dogTrainerModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.applicationTypeCode = this.dogTrainerApplicationService.dogTrainerModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.dogTrainerModelChangedSubscription) this.dogTrainerModelChangedSubscription.unsubscribe();
	}

	onSubmit(): void {
		this.dogTrainerApplicationService.submitLicenceAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<DogTrainerAppCommandResponse>) => {
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
		const index = this.getSelectedIndex(event.selectedIndex);
		switch (index) {
			case this.STEP_DETAILS:
				this.stepsDetails?.onGoToFirstStep();
				break;
			case this.STEP_TRAINING_SCHOOL_INFO:
				this.stepsSchoolInfo?.onGoToFirstStep();
				break;
			case this.STEP_DOG_TRAINER_PERSONAL_INFO:
				this.stepsPersonallInfo?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewConfirm?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		const index = this.getSelectedIndex(stepper.selectedIndex);
		switch (index) {
			case this.STEP_DETAILS:
				this.stepsDetails?.onGoToLastStep();
				break;
			case this.STEP_TRAINING_SCHOOL_INFO:
				this.stepsSchoolInfo?.onGoToLastStep();
				break;
			case this.STEP_DOG_TRAINER_PERSONAL_INFO:
				this.stepsPersonallInfo?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToReview() {
		this.stepper.selectedIndex = this.getMatchingIndex(this.STEP_REVIEW_AND_CONFIRM);
	}

	onGoToStep(stepIndex: number) {
		this.stepsDetails?.onGoToFirstStep();
		this.stepsSchoolInfo?.onGoToFirstStep();
		this.stepsPersonallInfo?.onGoToFirstStep();
		this.stepsReviewConfirm?.onGoToFirstStep();

		this.stepper.selectedIndex = this.getMatchingIndex(stepIndex);
	}

	onChildNextStep() {
		const index = this.getSelectedIndex(this.stepper.selectedIndex);
		switch (index) {
			case this.STEP_DETAILS:
				this.stepsDetails?.onGoToNextStep();
				break;
			case this.STEP_TRAINING_SCHOOL_INFO:
				this.stepsSchoolInfo?.onGoToNextStep();
				break;

			case this.STEP_DOG_TRAINER_PERSONAL_INFO:
				this.stepsPersonallInfo?.onGoToNextStep();
				break;
		}
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}

	private getSelectedIndex(currSelectedIndex: number): number {
		if (this.isNew) {
			return currSelectedIndex;
		}

		// step index is different for renewals.
		// there is a hidden step that changes the step index
		return currSelectedIndex === this.STEP_DETAILS ? this.STEP_DETAILS : currSelectedIndex + 1;
	}

	private getMatchingIndex(stepIndex: number): number {
		if (this.isNew) {
			return stepIndex;
		}

		// step index is different for renewals.
		// there is a hidden step that changes the step index
		return stepIndex === this.STEP_DETAILS ? stepIndex : stepIndex - 1;
	}

	private updateCompleteStatus(): void {
		this.step2Complete = this.dogTrainerApplicationService.isStepDogTrainerTrainingSchoolComplete();
		this.step3Complete = this.dogTrainerApplicationService.isStepDogTrainerPersonalInfoComplete();

		console.debug('Complete Status', this.step2Complete, this.step3Complete);
	}
}
