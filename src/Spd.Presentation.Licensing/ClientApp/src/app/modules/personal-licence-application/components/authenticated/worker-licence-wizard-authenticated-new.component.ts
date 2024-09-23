import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { ApplicationService } from '@app/core/services/application.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-licence-application-routing.module';
import { StepsWorkerLicenceSelectionComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/steps-worker-licence-selection.component';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routing.module';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsWorkerLicenceIdentificationAuthenticatedComponent } from './worker-licence-wizard-step-components/steps-worker-licence-identification-authenticated.component';
import { StepsWorkerLicenceReviewAuthenticatedComponent } from './worker-licence-wizard-step-components/steps-worker-licence-review-authenticated.component';

@Component({
	selector: 'app-worker-licence-wizard-authenticated-new',
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
						<ng-template matStepLabel>Licence Selection</ng-template>
						<app-steps-worker-licence-selection
							[isLoggedIn]="true"
							[showSaveAndExit]="showSaveAndExit"
							[isFormValid]="isFormValid"
							[applicationTypeCode]="applicationTypeCode"
							[showStepDogsAndRestraints]="showStepDogsAndRestraints"
							[showWorkerLicenceSoleProprietorStep]="true"
							(childNextStep)="onLicenceSelectionChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-selection>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Worker Information</ng-template>
						<app-steps-worker-licence-identification-authenticated
							[isFormValid]="isFormValid"
							[applicationTypeCode]="applicationTypeCode"
							[showCitizenshipStep]="showCitizenshipStep"
							[showSaveAndExit]="showSaveAndExit"
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-identification-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review Worker Licence</ng-template>
						<app-steps-worker-licence-review-authenticated
							[applicationTypeCode]="applicationTypeCode"
							[isSoleProprietor]="isSoleProprietor"
							(saveAndExit)="onSaveAndExit()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextSubmitStep)="onNextSoleProprietor()"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
						></app-steps-worker-licence-review-authenticated>
					</mat-step>

					<ng-container *ngIf="isSoleProprietor">
						<mat-step completed="false">
							<ng-template matStepLabel>Business Information</ng-template>
						</mat-step>

						<mat-step completed="false">
							<ng-template matStepLabel>Business Selection</ng-template>
						</mat-step>

						<mat-step completed="false">
							<ng-template matStepLabel>Review Business Licence</ng-template>
						</mat-step>
					</ng-container>

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
})
export class WorkerLicenceWizardAuthenticatedNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_WORKER_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_WORKER_INFORMATION = 1;
	readonly STEP_WORKER_LICENCE_REVIEW = 2;

	step1Complete = false;
	step2Complete = false;

	isFormValid = false;
	isSoleProprietor = false;

	showSaveAndExit = false;
	showStepDogsAndRestraints = false;
	showCitizenshipStep = false;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;

	@ViewChild(StepsWorkerLicenceIdentificationAuthenticatedComponent)
	stepIdentificationComponent!: StepsWorkerLicenceIdentificationAuthenticatedComponent;

	@ViewChild(StepsWorkerLicenceReviewAuthenticatedComponent)
	stepReviewAuthenticatedComponent!: StepsWorkerLicenceReviewAuthenticatedComponent;

	applicationTypeCode!: ApplicationTypeCode;

	private licenceModelChangedSubscription!: Subscription;
	private soleProprietorBizAppId: string | null = null;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private workerApplicationService: WorkerApplicationService,
		private commonApplicationService: ApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
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

				this.isSoleProprietor =
					this.workerApplicationService.workerModelFormGroup.get('soleProprietorData.isSoleProprietor')?.value ===
					BooleanTypeCode.Yes;

				this.showSaveAndExit = this.workerApplicationService.isSaveAndExit();

				const isCanadianCitizen = this.workerApplicationService.workerModelFormGroup.get(
					'citizenshipData.isCanadianCitizen'
				)?.value;

				this.showCitizenshipStep =
					this.applicationTypeCode === ApplicationTypeCode.New ||
					(this.applicationTypeCode === ApplicationTypeCode.Renewal && isCanadianCitizen === BooleanTypeCode.No);

				this.soleProprietorBizAppId =
					this.workerApplicationService.workerModelFormGroup.get('soleProprietorBizAppId')?.value;

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
			case this.STEP_WORKER_INFORMATION:
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
			case this.STEP_WORKER_INFORMATION:
				this.stepIdentificationComponent?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (this.workerApplicationService.isAutoSave()) {
			this.workerApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					switch (stepper.selectedIndex) {
						case this.STEP_WORKER_LICENCE_SELECTION:
							this.stepLicenceSelectionComponent?.onGoToFirstStep();
							break;
						case this.STEP_WORKER_INFORMATION:
							this.stepIdentificationComponent?.onGoToFirstStep();
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

	onNextPayStep(): void {
		this.submitStep();
	}

	onNextSoleProprietor(): void {
		this.submitSoleProprietorComboFlowStep();
	}

	onGoToStep(step: number) {
		this.stepLicenceSelectionComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onSaveAndExit(): void {
		if (!this.workerApplicationService.isSaveAndExit()) {
			return;
		}

		this.workerApplicationService.partialSaveLicenceStepAuthenticated(true).subscribe({
			next: (_resp: any) => {
				this.router.navigateByUrl(PersonalLicenceApplicationRoutes.pathUserApplications());
			},
			error: (error: HttpErrorResponse) => {
				this.handlePartialSaveError(error);
			},
		});
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
					this.handlePartialSaveError(error);
				},
			});
		} else {
			this.stepper.selectedIndex = this.STEP_WORKER_LICENCE_REVIEW;
		}
	}

	onLicenceSelectionChildNextStep(): void {
		const isStepToSave = this.stepLicenceSelectionComponent?.isStepToSave();
		if (isStepToSave) {
			this.onChildNextStep();
			return;
		}

		this.goToChildNextStep();
	}

	onChildNextStep() {
		if (this.workerApplicationService.isAutoSave()) {
			this.workerApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
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

	private submitStep(): void {
		this.workerApplicationService.submitLicenceNewAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				this.hotToastService.success('Your licence has been successfully submitted');

				this.payNow(_resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private submitSoleProprietorComboFlowStep(): void {
		this.workerApplicationService.submitSoleProprietorComboFlow().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				// if a business licence app already exists, use it
				if (this.soleProprietorBizAppId) {
					this.router.navigate(
						[
							BusinessLicenceApplicationRoutes.MODULE_PATH,
							BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR,
						],
						{
							queryParams: {
								bizLicAppId: this.soleProprietorBizAppId,
							},
						}
					);
					return;
				}

				this.router.navigate(
					[BusinessLicenceApplicationRoutes.MODULE_PATH, BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR],
					{
						queryParams: {
							swlLicAppId: _resp.body.licenceAppId!,
						},
					}
				);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.workerApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.workerApplicationService.isStepIdentificationComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete);
	}

	private handlePartialSaveError(error: HttpErrorResponse): void {
		// only 403s will be here as an error
		if (error.status == 403) {
			this.commonApplicationService.handleDuplicateLicence();
		}
	}

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_WORKER_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_WORKER_INFORMATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(
			licenceAppId,
			'Payment for new Security Worker Licence application'
		);
	}
}
