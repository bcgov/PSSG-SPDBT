import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, GdsdAppCommandResponse, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsGdsdDogInfoComponent } from './shared/common-steps-components/steps-gdsd-dog-info.component';
import { StepsGdsdPersonalInfoComponent } from './shared/common-steps-components/steps-gdsd-personal-info.component';
import { StepsGdsdReviewConfirmComponent } from './shared/common-steps-components/steps-gdsd-review-confirm.component';
import { StepsGdsdSelectionComponent } from './shared/common-steps-components/steps-gdsd-selection.component';
import { StepsGdsdTrainingInfoComponent } from './shared/common-steps-components/steps-gdsd-training-info.component';

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
					[isLoggedIn]="isLoggedIn"
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
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="isLoggedIn"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-personal-info>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Dog Information</ng-template>
				<app-steps-gdsd-dog-info
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="isLoggedIn"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-dog-info>
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Training Information</ng-template>
				<app-steps-gdsd-training-info
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="isLoggedIn"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					[hasAttendedTrainingSchool]="hasAttendedTrainingSchool"
					[isServiceDog]="isServiceDog"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-gdsd-training-info>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-gdsd-review-confirm
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="isLoggedIn"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					[hasAttendedTrainingSchool]="hasAttendedTrainingSchool"
					[isServiceDog]="isServiceDog"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
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

	isLoggedIn = false;
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

	readonly applicationTypeCode = ApplicationTypeCode.New;

	private gdsdModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private hotToastService: HotToastService,
		private router: Router,
		private authenticationService: AuthenticationService,
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

		this.isLoggedIn = this.authenticationService.isLoggedIn();

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.gdsdModelChangedSubscription = this.gdsdApplicationService.gdsdModelValueChanges$.subscribe((_resp: any) => {
			this.isFormValid = _resp;

			this.isServiceDog =
				this.gdsdApplicationService.gdsdModelFormGroup.get('dogGdsdData.isGuideDog')?.value === BooleanTypeCode.No;

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
		if (this.isLoggedIn) {
			this.gdsdApplicationService.submitLicenceNewAuthenticated().subscribe({
				next: (_resp: StrictHttpResponse<GdsdAppCommandResponse>) => {
					const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
						ServiceTypeCode.GdsdTeamCertification,
						this.applicationTypeCode
					);
					this.hotToastService.success(successMessage);

					this.router.navigateByUrl(
						GuideDogServiceDogRoutes.pathGdsdAuthenticated(GuideDogServiceDogRoutes.GDSD_APPLICATION_RECEIVED)
					);
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});

			return;
		}

		this.gdsdApplicationService.submitNewAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<GdsdAppCommandResponse>) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					ServiceTypeCode.GdsdTeamCertification,
					this.applicationTypeCode
				);
				this.hotToastService.success(successMessage);

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
		if (this.gdsdApplicationService.isAutoSave()) {
			this.gdsdApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					switch (stepper.selectedIndex) {
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
					}
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		}
	}

	onSaveAndExit(): void {
		if (!this.gdsdApplicationService.isSaveAndExit()) {
			return;
		}

		this.gdsdApplicationService.partialSaveLicenceStepAuthenticated(true).subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdUserApplications());
			},
			error: (error: HttpErrorResponse) => {
				this.handlePartialSaveError(error);
			},
		});
	}

	onGoToReview() {
		if (this.gdsdApplicationService.isAutoSave()) {
			this.gdsdApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					setTimeout(() => {
						// hack... does not navigate without the timeout
						this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
					}, 250);
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else {
			this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
		}
	}

	onGoToStep(step: number) {
		this.stepsSelection?.onGoToFirstStep();
		this.stepsPersonalInfo?.onGoToFirstStep();
		this.stepsDogInfo?.onGoToFirstStep();
		this.stepsTrainingInfo?.onGoToFirstStep();
		this.stepsReviewConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onChildNextStep() {
		if (this.gdsdApplicationService.isAutoSave()) {
			this.gdsdApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.goToChildNextStep();
				},
				error: (error: HttpErrorResponse) => {
					this.handlePartialSaveError(error);
				},
			});
		} else {
			this.goToChildNextStep();
		}
	}

	private handlePartialSaveError(_error: HttpErrorResponse): void {
		// TODO  handlePartialSaveError
	}

	private goToChildNextStep() {
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
