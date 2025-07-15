import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, RetiredDogAppCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app.routes';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { RetiredDogApplicationService } from '@app/core/services/retired-dog-application.service';
import { UtilService } from '@app/core/services/util.service';
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
				<ng-template matStepLabel>Checklist</ng-template>
				<app-steps-rd-details
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="goToChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-rd-details>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Personal Information</ng-template>
				<app-steps-rd-personal-info
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-rd-personal-info>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Dog Information</ng-template>
				<app-steps-rd-dog-info
					[isLoggedIn]="isLoggedIn"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-rd-dog-info>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-rd-review-and-confirm
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(saveAndExit)="onSaveAndExit()"
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

	showSaveAndExit = false;
	isLoggedIn = false;
	step2Complete = false;
	step3Complete = false;

	licenceAppId: string | null = null;

	@ViewChild(StepsRdDetailsComponent) stepsDetails!: StepsRdDetailsComponent;
	@ViewChild(StepsRdPersonalInfoComponent) stepsPersonalInfo!: StepsRdPersonalInfoComponent;
	@ViewChild(StepsRdDogInfoComponent) stepsDogInfo!: StepsRdDogInfoComponent;
	@ViewChild(StepsRdReviewAndConfirmComponent) stepsReviewConfirm!: StepsRdReviewAndConfirmComponent;

	isFormValid = false;

	applicationTypeCode!: ApplicationTypeCode;

	private retiredDogModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		override viewportScroller: ViewportScroller,
		override utilService: UtilService,
		private router: Router,
		private authenticationService: AuthenticationService,
		private retiredDogApplicationService: RetiredDogApplicationService
	) {
		super(breakpointObserver, viewportScroller, utilService);
	}

	ngOnInit(): void {
		if (!this.retiredDogApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path());
			return;
		}

		this.isLoggedIn = this.authenticationService.isLoggedIn();
		this.showSaveAndExit = this.retiredDogApplicationService.isSaveAndExit();

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
		if (this.isLoggedIn) {
			this.retiredDogApplicationService.submitLicenceAuthenticated(this.applicationTypeCode).subscribe({
				next: (_resp: StrictHttpResponse<RetiredDogAppCommandResponse>) => {
					this.router.navigateByUrl(AppRoutes.pathGdsdAuthenticated());
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
			return;
		}

		this.retiredDogApplicationService.submitLicenceAnonymous().subscribe({
			next: (_resp: StrictHttpResponse<RetiredDogAppCommandResponse>) => {
				this.router.navigateByUrl(AppRoutes.path(AppRoutes.RETIRED_DOG_APPLICATION_RECEIVED));
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		const component = this.getSelectedIndexComponent(event.selectedIndex);
		component?.onGoToFirstStep();

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		const component = this.getSelectedIndexComponent(stepper.selectedIndex);
		component?.onGoToLastStep();
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (this.retiredDogApplicationService.isAutoSave()) {
			this.retiredDogApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
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
		if (!this.retiredDogApplicationService.isSaveAndExit()) {
			return;
		}

		this.retiredDogApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(AppRoutes.pathGdsdMainApplications());
			},
			error: (error: HttpErrorResponse) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	onGoToReview() {
		if (this.retiredDogApplicationService.isAutoSave()) {
			this.retiredDogApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
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

	onChildNextStep() {
		if (this.retiredDogApplicationService.isAutoSave()) {
			this.retiredDogApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
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

	onGoToStep(step: number) {
		this.stepsDetails?.onGoToFirstStep();
		this.stepsPersonalInfo?.onGoToFirstStep();
		this.stepsDogInfo?.onGoToFirstStep();
		this.stepsReviewConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	private getSelectedIndexComponent(index: number): any {
		switch (index) {
			case this.STEP_DETAILS:
				return this.stepsDetails;
			case this.STEP_PERSONAL_INFO:
				return this.stepsPersonalInfo;
			case this.STEP_DOG_INFO:
				return this.stepsDogInfo;
			case this.STEP_REVIEW_AND_CONFIRM:
				return this.stepsReviewConfirm;
		}
		return null;
	}

	get isNew(): boolean {
		return this.applicationTypeCode === ApplicationTypeCode.New;
	}

	goToChildNextStep() {
		const component = this.getSelectedIndexComponent(this.stepper.selectedIndex);
		component?.onGoToNextStep();
	}

	private updateCompleteStatus(): void {
		this.step2Complete = this.retiredDogApplicationService.isStepRetiredDogPersonalInfoComplete();
		this.step3Complete = this.retiredDogApplicationService.isStepRetiredDogDogInfoComplete();

		console.debug('Complete Status', this.step2Complete, this.step3Complete);
	}
}
