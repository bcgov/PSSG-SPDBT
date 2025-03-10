import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { StepsWorkerLicenceSelectionComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/steps-worker-licence-selection.component';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { PersonalLicenceApplicationRoutes } from '../../personal-licence-application-routes';
import { StepsWorkerLicenceBackgroundComponent } from '../shared/worker-licence-wizard-step-components/steps-worker-licence-background.component';
import { StepsWorkerLicenceIdentificationAuthenticatedComponent } from './worker-licence-wizard-step-components/steps-worker-licence-identification-authenticated.component';
import { StepsWorkerLicenceReviewAuthenticatedComponent } from './worker-licence-wizard-step-components/steps-worker-licence-review-authenticated.component';

@Component({
	selector: 'app-worker-licence-wizard-authenticated-renewal',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step [completed]="step1Complete">
						<ng-template matStepLabel
							>Licence<span class="d-xxl-none">&nbsp;</span
							><span class="d-none d-xxl-inline"><br /></span>Selection</ng-template
						>
						<app-steps-worker-licence-selection
							[isLoggedIn]="true"
							[showSaveAndExit]="false"
							[isFormValid]="isFormValid"
							[applicationTypeCode]="applicationTypeCode"
							[showStepDogsAndRestraints]="showStepDogsAndRestraints"
							[showWorkerLicenceSoleProprietorStep]="showWorkerLicenceSoleProprietorStep"
							[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-selection>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Background</ng-template>
						<app-steps-worker-licence-background
							[isLoggedIn]="true"
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
						<app-steps-worker-licence-identification-authenticated
							[isFormValid]="isFormValid"
							[applicationTypeCode]="applicationTypeCode"
							[showCitizenshipStep]="showCitizenshipStep"
							[showSaveAndExit]="false"
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-identification-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel
							>Review<span class="d-xxl-none">&nbsp;</span
							><span class="d-none d-xxl-inline"><br /></span>Worker</ng-template
						>
						<app-steps-worker-licence-review-authenticated
							[applicationTypeCode]="applicationTypeCode"
							[showCitizenshipStep]="showCitizenshipStep"
							[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextSubmitStep)="onNextSoleProprietor()"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
						></app-steps-worker-licence-review-authenticated>
					</mat-step>

					<ng-container *ngIf="isSoleProprietor; else isNotSoleProprietor">
						<mat-step completed="false">
							<ng-template matStepLabel
								>Business<span class="d-xxl-none">&nbsp;</span
								><span class="d-none d-xxl-inline"><br /></span>Information</ng-template
							>
						</mat-step>

						<mat-step completed="false">
							<ng-template matStepLabel
								>Business<span class="d-xxl-none">&nbsp;</span
								><span class="d-none d-xxl-inline"><br /></span>Selection</ng-template
							>
						</mat-step>

						<mat-step completed="false">
							<ng-template matStepLabel
								>Review<span class="d-xxl-none">&nbsp;</span
								><span class="d-none d-xxl-inline"><br /></span>Business</ng-template
							>
						</mat-step>
					</ng-container>

					<ng-template #isNotSoleProprietor>
						<mat-step completed="false">
							<ng-template matStepLabel>Pay</ng-template>
						</mat-step>
					</ng-template>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
	standalone: false,
})
export class WorkerLicenceWizardAuthenticatedRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_WORKER_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_WORKER_BACKGROUND = 1;
	readonly STEP_WORKER_IDENTIFICATION = 2;
	readonly STEP_WORKER_LICENCE_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;

	@ViewChild(StepsWorkerLicenceBackgroundComponent) stepBackgroundComponent!: StepsWorkerLicenceBackgroundComponent;

	@ViewChild(StepsWorkerLicenceIdentificationAuthenticatedComponent)
	stepIdentificationComponent!: StepsWorkerLicenceIdentificationAuthenticatedComponent;

	@ViewChild(StepsWorkerLicenceReviewAuthenticatedComponent)
	stepReviewAuthenticatedComponent!: StepsWorkerLicenceReviewAuthenticatedComponent;

	applicationTypeCode!: ApplicationTypeCode;
	isFormValid = false;
	showStepDogsAndRestraints = false;
	showCitizenshipStep = false;
	showWorkerLicenceSoleProprietorStep = false;
	isSoleProprietor = false;
	isSoleProprietorSimultaneousFlow = false;
	linkedSoleProprietorBizLicId: string | null = null;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private utilService: UtilService,
		private commonApplicationService: CommonApplicationService,
		private workerApplicationService: WorkerApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.workerApplicationService.initialized) {
			this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated());
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

				this.showCitizenshipStep = isCanadianCitizen === BooleanTypeCode.No;

				const bizTypeCode = this.workerApplicationService.workerModelFormGroup.get(
					'soleProprietorData.bizTypeCode'
				)?.value;

				this.linkedSoleProprietorBizLicId = this.workerApplicationService.workerModelFormGroup.get(
					'originalLicenceData.linkedSoleProprietorLicenceId'
				)?.value;

				this.isSoleProprietor = this.commonApplicationService.isBusinessLicenceSoleProprietor(bizTypeCode);

				this.showWorkerLicenceSoleProprietorStep = !!this.linkedSoleProprietorBizLicId;

				this.isSoleProprietorSimultaneousFlow =
					!!this.linkedSoleProprietorBizLicId && this.isSoleProprietor
						? this.workerApplicationService.workerModelFormGroup.get('isSoleProprietorSimultaneousFlow')?.value
						: false;

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_WORKER_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToFirstStep();
				break;
			case this.STEP_WORKER_BACKGROUND:
				this.stepBackgroundComponent?.onGoToFirstStep();
				break;
			case this.STEP_WORKER_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_WORKER_LICENCE_REVIEW:
				this.stepReviewAuthenticatedComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_WORKER_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToLastStep();
				break;
			case this.STEP_WORKER_BACKGROUND:
				this.stepBackgroundComponent?.onGoToLastStep();
				break;
			case this.STEP_WORKER_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		this.stepLicenceSelectionComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		if (this.workerApplicationService.isAutoSave()) {
			this.workerApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					setTimeout(() => {
						// hack... does not navigate without the timeout
						this.stepper.selectedIndex = this.STEP_WORKER_LICENCE_REVIEW;
					}, 250);
				},
				error: (error: HttpErrorResponse) => {
					// only 403s will be here as an error
					if (error.status == 403) {
						this.commonApplicationService.handleDuplicateLicence();
					}
				},
			});
		} else {
			this.stepper.selectedIndex = this.STEP_WORKER_LICENCE_REVIEW;
		}
	}

	onChildNextStep() {
		this.goToChildNextStep();
	}

	onNextPayStep(): void {
		this.submitStep();
	}

	onNextSoleProprietor(): void {
		this.submitSoleProprietorSimultaneousFlowStep();
	}

	private submitStep(): void {
		this.workerApplicationService.submitLicenceRenewalOrUpdateOrReplaceAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					ServiceTypeCode.SecurityWorkerLicence,
					this.applicationTypeCode
				);
				this.utilService.toasterSuccess(successMessage);

				this.payNow(_resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private submitSoleProprietorSimultaneousFlowStep(): void {
		this.workerApplicationService.submitLicenceRenewalOrUpdateOrReplaceAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					ServiceTypeCode.SecurityWorkerLicence,
					this.applicationTypeCode
				);
				this.utilService.toasterSuccess(successMessage);

				this.router.navigate(
					[
						BusinessLicenceApplicationRoutes.MODULE_PATH,
						BusinessLicenceApplicationRoutes.BUSINESS_RENEWAL_SOLE_PROPRIETOR,
					],
					{
						queryParams: {
							swlLicAppId: _resp.body.licenceAppId!,
							linkedSoleProprietorBizLicId: this.linkedSoleProprietorBizLicId,
						},
					}
				);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(licenceAppId);
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.workerApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.workerApplicationService.isStepBackgroundComplete(false);
		this.step3Complete = this.workerApplicationService.isStepIdentificationComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_WORKER_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_WORKER_BACKGROUND:
				this.stepBackgroundComponent?.onGoToNextStep();
				break;
			case this.STEP_WORKER_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
	}
}
