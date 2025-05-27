import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, GdsdTeamAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app.routes';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { GdsdTeamApplicationService } from '@app/core/services/gdsd-team-application.service';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsTeamDogInfoComponent } from './steps-team-dog-info.component';
import { StepsTeamPersonalInfoComponent } from './steps-team-personal-info.component';
import { StepsTeamReviewAndConfirmComponent } from './steps-team-review-and-confirm.component';
import { StepsTeamSelectionComponent } from './steps-team-selection.component';
import { StepsTeamTrainingInfoComponent } from './steps-team-training-info.component';

@Component({
	selector: 'app-gdsd-team-wizard-new-renewal',
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
					[applicationTypeCode]="applicationTypeCode"
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
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
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
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-team-dog-info>
			</mat-step>

			<mat-step [completed]="step4Complete" *ngIf="isNew">
				<ng-template matStepLabel>Training Information</ng-template>
				<app-steps-team-training-info
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					[hasAttendedTrainingSchool]="hasAttendedTrainingSchool"
					[isServiceDog]="isServiceDog"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-team-training-info>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-team-review-and-confirm
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[isTrainedByAccreditedSchools]="isTrainedByAccreditedSchools"
					[hasAttendedTrainingSchool]="hasAttendedTrainingSchool"
					[isServiceDog]="isServiceDog"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
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
export class GdsdTeamWizardNewRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
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
	isLoggedIn = false;
	licenceAppId: string | null = null;
	isFormValid = false;
	isTrainedByAccreditedSchools = false;
	hasAttendedTrainingSchool = false;
	isServiceDog = false;
	applicationTypeCode!: ApplicationTypeCode;

	@ViewChild(StepsTeamSelectionComponent) stepsSelection!: StepsTeamSelectionComponent;
	@ViewChild(StepsTeamPersonalInfoComponent) stepsPersonalInfo!: StepsTeamPersonalInfoComponent;
	@ViewChild(StepsTeamDogInfoComponent) stepsDogInfo!: StepsTeamDogInfoComponent;
	@ViewChild(StepsTeamTrainingInfoComponent) stepsTrainingInfo!: StepsTeamTrainingInfoComponent;
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
			this.router.navigateByUrl(AppRoutes.path());
			return;
		}

		this.isLoggedIn = this.authenticationService.isLoggedIn();
		this.showSaveAndExit = this.gdsdTeamApplicationService.isSaveAndExit();

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.gdsdModelChangedSubscription = this.gdsdTeamApplicationService.gdsdTeamModelValueChanges$.subscribe(
			(_resp: any) => {
				this.isFormValid = _resp;

				this.applicationTypeCode = this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.isServiceDog =
					this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get('dogGdsdData.isGuideDog')?.value ===
					BooleanTypeCode.No;

				this.isTrainedByAccreditedSchools =
					this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get(
						'dogCertificationSelectionData.isDogTrainedByAccreditedSchool'
					)?.value === BooleanTypeCode.Yes;

				this.hasAttendedTrainingSchool =
					this.gdsdTeamApplicationService.gdsdTeamModelFormGroup.get('trainingHistoryData.hasAttendedTrainingSchool')
						?.value === BooleanTypeCode.Yes;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.gdsdModelChangedSubscription) this.gdsdModelChangedSubscription.unsubscribe();
	}

	onSubmit(): void {
		if (this.isLoggedIn) {
			this.gdsdTeamApplicationService.submitLicenceAuthenticated(this.applicationTypeCode).subscribe({
				next: (_resp: StrictHttpResponse<GdsdTeamAppCommandResponse>) => {
					this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated());
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
			return;
		}

		this.gdsdTeamApplicationService.submitLicenceAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<GdsdTeamAppCommandResponse>) => {
				this.router.navigateByUrl(AppRoutes.path(AppRoutes.GDSD_APPLICATION_RECEIVED));
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		const index = this.getSelectedIndex(event.selectedIndex);
		const component = this.getSelectedIndexComponent(index);
		component?.onGoToFirstStep();

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		const index = this.getSelectedIndex(stepper.selectedIndex);
		const component = this.getSelectedIndexComponent(index);
		component?.onGoToLastStep();
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (this.gdsdTeamApplicationService.isAutoSave()) {
			this.gdsdTeamApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					const component = this.getSelectedIndexComponent(stepper.selectedIndex);
					component?.onGoToFirstStep();
				},
				error: (error: HttpErrorResponse) => {
					console.log('An error occurred during save', error);
				},
			});
		} else {
			if (stepper?.selected) stepper.selected.completed = true;
			stepper.next();
		}
	}

	onSaveAndExit(): void {
		if (!this.gdsdTeamApplicationService.isSaveAndExit()) {
			return;
		}

		this.gdsdTeamApplicationService.partialSaveLicenceStepAuthenticated(true).subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(AppRoutes.pathGdsdMainApplications());
			},
			error: (error: HttpErrorResponse) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	onGoToReview() {
		if (this.gdsdTeamApplicationService.isAutoSave()) {
			this.gdsdTeamApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					setTimeout(() => {
						// hack... does not navigate without the timeout
						this.stepper.selectedIndex = this.getMatchingIndex(this.STEP_REVIEW_AND_CONFIRM);
					}, 250);
				},
				error: (error: HttpErrorResponse) => {
					console.log('An error occurred during save', error);
				},
			});
		} else {
			this.stepper.selectedIndex = this.getMatchingIndex(this.STEP_REVIEW_AND_CONFIRM);
		}
	}

	onGoToStep(stepIndex: number) {
		this.stepsSelection?.onGoToFirstStep();
		this.stepsPersonalInfo?.onGoToFirstStep();
		this.stepsDogInfo?.onGoToFirstStep();
		this.stepsTrainingInfo?.onGoToFirstStep();
		this.stepsReviewConfirm?.onGoToFirstStep();

		this.stepper.selectedIndex = this.getMatchingIndex(stepIndex);
	}

	onChildNextStep() {
		if (this.gdsdTeamApplicationService.isAutoSave()) {
			this.gdsdTeamApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					this.goToChildNextStep();
				},
				error: (error: HttpErrorResponse) => {
					console.log('An error occurred during save', error);
				},
			});
		} else {
			this.goToChildNextStep();
		}
	}

	private getSelectedIndexComponent(index: number): any {
		switch (index) {
			case this.STEP_SELECTION:
				return this.stepsSelection;
			case this.STEP_PERSONAL_INFO:
				return this.stepsPersonalInfo;
			case this.STEP_DOG_INFO:
				return this.stepsDogInfo;
			case this.STEP_TRAINING_INFO:
				return this.stepsTrainingInfo;
			case this.STEP_REVIEW_AND_CONFIRM:
				return this.stepsReviewConfirm;
		}
		return null;
	}

	private goToChildNextStep() {
		const index = this.getSelectedIndex(this.stepper.selectedIndex);
		const component = this.getSelectedIndexComponent(index);
		component?.onGoToNextStep();
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
		return currSelectedIndex < this.STEP_TRAINING_INFO ? currSelectedIndex : currSelectedIndex + 1;
	}

	private getMatchingIndex(stepIndex: number): number {
		if (this.isNew) {
			return stepIndex;
		}

		// step index is different for renewals.
		// there is a hidden step that changes the step index
		return stepIndex < this.STEP_TRAINING_INFO ? stepIndex : stepIndex - 1;
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.gdsdTeamApplicationService.isStepSelectionComplete();
		this.step2Complete = this.gdsdTeamApplicationService.isStepPersonalInfoComplete();
		this.step3Complete = this.gdsdTeamApplicationService.isStepDogInfoComplete();
		this.step4Complete = this.gdsdTeamApplicationService.isStepTrainingInfoComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}
}
