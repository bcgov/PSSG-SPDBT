import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, GdsdAppCommandResponse, ServiceTypeCode } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsTeamDogInfoComponent } from './steps-team-dog-info.component';
import { StepsTeamPersonalInfoComponent } from './steps-team-personal-info.component';
import { StepsTeamReviewAndConfirmComponent } from './steps-team-review-and-confirm.component';
import { StepsTeamSelectionComponent } from './steps-team-selection.component';

@Component({
	selector: 'app-gdsd-team-wizard-renewal',
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
				<app-steps-team-selection
					[isLoggedIn]="isLoggedIn"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeRenewal"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-team-selection>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Personal Information</ng-template>
				<app-steps-team-personal-info
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="false"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeRenewal"
					[isTrainedByAccreditedSchools]="false"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-team-personal-info>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Dog Information</ng-template>
				<app-steps-team-dog-info
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="false"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeRenewal"
					[isTrainedByAccreditedSchools]="false"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-team-dog-info>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-team-review-and-confirm
					[showSaveAndExit]="false"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeRenewal"
					[isTrainedByAccreditedSchools]="false"
					[hasAttendedTrainingSchool]="false"
					[isServiceDog]="false"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onSubmit()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-team-review-and-confirm>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Submit</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	standalone: false,
})
export class GdsdTeamWizardRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_PERSONAL_INFO = 1;
	readonly STEP_DOG_INFO = 2;
	readonly STEP_REVIEW_AND_CONFIRM = 3;
	readonly STEP_SUBMIT = 4;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	isLoggedIn = false;
	licenceAppId: string | null = null;
	isFormValid = false;

	serviceTypeCode!: ServiceTypeCode;
	readonly applicationTypeRenewal = ApplicationTypeCode.Renewal;

	@ViewChild(StepsTeamSelectionComponent) stepsSelection!: StepsTeamSelectionComponent;
	@ViewChild(StepsTeamPersonalInfoComponent) stepsPersonalInfo!: StepsTeamPersonalInfoComponent;
	@ViewChild(StepsTeamDogInfoComponent) stepsDogInfo!: StepsTeamDogInfoComponent;
	@ViewChild(StepsTeamReviewAndConfirmComponent) stepsReviewConfirm!: StepsTeamReviewAndConfirmComponent;

	private gdsdModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private authenticationService: AuthenticationService,
		private gdsdTeamApplicationService: GdsdTeamApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.gdsdTeamApplicationService.initialized) {
			this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			return;
		}

		this.isLoggedIn = this.authenticationService.isLoggedIn();

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.gdsdModelChangedSubscription = this.gdsdTeamApplicationService.gdsdTeamModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.serviceTypeCode = this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get(
					'serviceTypeData.serviceTypeCode'
				)?.value;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.gdsdModelChangedSubscription) this.gdsdModelChangedSubscription.unsubscribe();
	}

	onSubmit(): void {
		if (this.isLoggedIn) {
			this.gdsdTeamApplicationService.submitLicenceRenewalAuthenticated().subscribe({
				next: (_resp: StrictHttpResponse<GdsdAppCommandResponse>) => {
					this.router.navigateByUrl(GuideDogServiceDogRoutes.pathGdsdAuthenticated());
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});

			return;
		}

		this.gdsdTeamApplicationService.submitLicenceRenewalAnonymous().subscribe({
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
			case this.STEP_SELECTION:
				this.stepsSelection?.onGoToFirstStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepsPersonalInfo?.onGoToFirstStep();
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
			case this.STEP_SELECTION:
				this.stepsSelection?.onGoToLastStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepsPersonalInfo?.onGoToLastStep();
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
		if (this.gdsdTeamApplicationService.isAutoSave()) {
			this.gdsdTeamApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					setTimeout(() => {
						// hack... does not navigate without the timeout
						this.stepper.selectedIndex = this.STEP_REVIEW_AND_CONFIRM;
					}, 250);
				},
				error: (error: HttpErrorResponse) => {
					console.log('An error occurred during save', error);
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
		this.stepsReviewConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onChildNextStep() {
		this.goToChildNextStep();
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
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.gdsdTeamApplicationService.isStepSelectionComplete();
		this.step2Complete = this.gdsdTeamApplicationService.isStepPersonalInfoComplete();
		this.step3Complete = this.gdsdTeamApplicationService.isStepDogInfoComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}
}
