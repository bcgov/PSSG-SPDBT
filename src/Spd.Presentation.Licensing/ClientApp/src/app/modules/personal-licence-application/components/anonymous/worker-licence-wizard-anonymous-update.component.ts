import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routes';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { StepsWorkerLicenceSelectionComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/steps-worker-licence-selection.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsWorkerLicenceBackgroundComponent } from '../shared/worker-licence-wizard-step-components/steps-worker-licence-background.component';
import { StepsWorkerLicenceIdentificationAnonymousComponent } from './worker-licence-wizard-step-components/steps-worker-licence-identification-anonymous.component';
import { StepsWorkerLicenceReviewAnonymousComponent } from './worker-licence-wizard-step-components/steps-worker-licence-review-anonymous.component';

@Component({
	selector: 'app-worker-licence-wizard-anonymous-update',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Licence Selection</ng-template>
				<app-steps-worker-licence-selection
					[isLoggedIn]="false"
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[showStepDogsAndRestraints]="showStepDogsAndRestraints"
					[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
					[showWorkerLicenceSoleProprietorStep]="false"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-selection>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Background</ng-template>
				<app-steps-worker-licence-background
					[isLoggedIn]="false"
					[showSaveAndExit]="false"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-background>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Identification</ng-template>
				<app-steps-worker-licence-identification-anonymous
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[showCitizenshipStep]="showCitizenshipStep"
					[showPhotographOfYourselfStep]="showPhotographOfYourselfStep"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-identification-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review & Confirm</ng-template>
				<app-steps-worker-licence-review-anonymous
					[applicationTypeCode]="applicationTypeCode"
					[showCitizenshipStep]="showCitizenshipStep"
					[licenceCost]="updateLicenceCost"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextSubmitStep)="onSubmitStep()"
					(nextPayStep)="onNextPayStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-worker-licence-review-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Pay</ng-template>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
	standalone: false,
})
export class WorkerLicenceWizardAnonymousUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	newLicenceAppId: string | null = null;
	updateLicenceCost = 0;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepsLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;
	@ViewChild(StepsWorkerLicenceBackgroundComponent) stepsBackgroundComponent!: StepsWorkerLicenceBackgroundComponent;
	@ViewChild(StepsWorkerLicenceIdentificationAnonymousComponent)
	stepsIdentificationComponent!: StepsWorkerLicenceIdentificationAnonymousComponent;
	@ViewChild(StepsWorkerLicenceReviewAnonymousComponent)
	stepsReviewLicenceComponent!: StepsWorkerLicenceReviewAnonymousComponent;

	applicationTypeCode!: ApplicationTypeCode;
	showSaveAndExit = false;
	isFormValid = false;
	showStepDogsAndRestraints = false;
	showCitizenshipStep = false;
	showPhotographOfYourselfStep = false;
	isSoleProprietorSimultaneousFlow = false;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private utilService: UtilService,
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: CommonApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.workerApplicationService.initialized) {
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.licenceModelChangedSubscription = this.workerApplicationService.workerModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.isFormValid = _resp;

				this.applicationTypeCode = this.workerApplicationService.workerModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.showStepDogsAndRestraints =
					this.workerApplicationService.categorySecurityGuardFormGroup.get('isInclude')?.value;

				const isCanadianCitizen = this.workerApplicationService.workerModelFormGroup.get(
					'citizenshipData.isCanadianCitizen'
				)?.value;

				this.showCitizenshipStep =
					this.applicationTypeCode === ApplicationTypeCode.New ||
					(this.applicationTypeCode === ApplicationTypeCode.Renewal && isCanadianCitizen === BooleanTypeCode.No);

				const hasGenderChanged = !!this.workerApplicationService.workerModelFormGroup.get(
					'personalInformationData.hasGenderChanged'
				)?.value;

				const photoOfYourselfExpired = !!this.workerApplicationService.workerModelFormGroup.get(
					'originalLicenceData.originalPhotoOfYourselfExpired'
				)?.value;

				// Show this step if gender has changed, photo has expired or is missing
				this.showPhotographOfYourselfStep = hasGenderChanged || photoOfYourselfExpired;

				this.isSoleProprietorSimultaneousFlow =
					this.workerApplicationService.workerModelFormGroup.get('soleProprietorData.isSoleProprietor')?.value ===
					BooleanTypeCode.Yes;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
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
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		if (step == 99) {
			this.stepper.selectedIndex = this.STEP_IDENTIFICATION;
			this.stepsIdentificationComponent.onGoToContactStep();
			return;
		}

		this.stepsLicenceSelectionComponent?.onGoToFirstStep();
		this.stepsBackgroundComponent?.onGoToFirstStep();
		this.stepsIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}, 250);
	}

	onChildNextStep() {
		const component = this.getSelectedIndexComponent(this.stepper.selectedIndex);
		component?.onGoToNextStep();
	}

	onSubmitStep(): void {
		if (this.newLicenceAppId) {
			if (this.updateLicenceCost > 0) {
				this.stepsReviewLicenceComponent?.onGoToLastStep();
			} else {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.path(PersonalLicenceApplicationRoutes.LICENCE_UPDATE_SUCCESS)
				);
			}
		} else {
			this.workerApplicationService.submitLicenceAnonymous().subscribe({
				next: (resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
					const workerLicenceCommandResponse = resp.body;

					// save this locally just in application payment fails
					this.newLicenceAppId = workerLicenceCommandResponse.licenceAppId!;
					this.updateLicenceCost = workerLicenceCommandResponse.cost ?? 0;

					if (this.updateLicenceCost > 0) {
						this.stepsReviewLicenceComponent?.onGoToLastStep();
					} else {
						const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
							ServiceTypeCode.SecurityWorkerLicence,
							ApplicationTypeCode.Update
						);
						this.utilService.toasterSuccess(successMessage);

						this.router.navigateByUrl(
							PersonalLicenceApplicationRoutes.path(PersonalLicenceApplicationRoutes.LICENCE_UPDATE_SUCCESS)
						);
					}
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
		}
	}

	onNextPayStep(): void {
		this.payNow(this.newLicenceAppId!);
	}

	private getSelectedIndexComponent(index: number): any {
		switch (index) {
			case this.STEP_LICENCE_SELECTION:
				return this.stepsLicenceSelectionComponent;
			case this.STEP_BACKGROUND:
				return this.stepsBackgroundComponent;
			case this.STEP_IDENTIFICATION:
				return this.stepsIdentificationComponent;
			case this.STEP_REVIEW:
				return this.stepsReviewLicenceComponent;
		}
		return null;
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.workerApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.workerApplicationService.isStepBackgroundComplete(false);
		this.step3Complete = this.workerApplicationService.isStepIdentificationComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAnonymous(licenceAppId);
	}
}
