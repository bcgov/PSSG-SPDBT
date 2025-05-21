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
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsWorkerLicenceBackgroundComponent } from '../shared/worker-licence-wizard-step-components/steps-worker-licence-background.component';
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
						<ng-template matStepLabel
							>Licence<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Selection</ng-template
						>
						<app-steps-worker-licence-selection
							[isLoggedIn]="true"
							[showSaveAndExit]="showSaveAndExit"
							[isFormValid]="isFormValid"
							[applicationTypeCode]="applicationTypeCode"
							[showStepDogsAndRestraints]="showStepDogsAndRestraints"
							[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
							[showWorkerLicenceSoleProprietorStep]="true"
							(childNextStep)="onLicenceSelectionChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
							(nextReview)="onGoToReview()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-selection>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Background</ng-template>
						<app-steps-worker-licence-background
							[isLoggedIn]="true"
							[showSaveAndExit]="showSaveAndExit"
							[isFormValid]="isFormValid"
							[applicationTypeCode]="applicationTypeCode"
							[showSaveAndExit]="showSaveAndExit"
							(childNextStep)="onChildNextStep()"
							(saveAndExit)="onSaveAndExit()"
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
							[showFullCitizenshipQuestion]="true"
							[showNonCanadianCitizenshipQuestion]="false"
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
						<ng-template matStepLabel
							>Review<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Worker Licence</ng-template
						>
						<app-steps-worker-licence-review-authenticated
							[applicationTypeCode]="applicationTypeCode"
							[showCitizenshipStep]="true"
							[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
							(saveAndExit)="onSaveAndExit()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextSubmitStep)="onNextSoleProprietor()"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
						></app-steps-worker-licence-review-authenticated>
					</mat-step>

					<ng-container *ngIf="isSoleProprietorSimultaneousFlow; else isNotSoleProprietor">
						<mat-step completed="false">
							<ng-template matStepLabel
								>Business<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Information</ng-template
							>
						</mat-step>

						<mat-step completed="false">
							<ng-template matStepLabel
								>Business<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Selection</ng-template
							>
						</mat-step>

						<mat-step completed="false">
							<ng-template matStepLabel
								>Review<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Business Licence</ng-template
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

		<ng-template #StepNameSpace>
			<!-- wrap label in large view -->
			<ng-container *ngIf="isSoleProprietorSimultaneousFlow">
				<span class="d-xxl-none">&nbsp;</span><span class="d-none d-xxl-inline"><br /></span>
			</ng-container>
			<ng-container *ngIf="!isSoleProprietorSimultaneousFlow">&nbsp;</ng-container>
		</ng-template>
	`,
	styles: [],
	standalone: false,
})
export class WorkerLicenceWizardAuthenticatedNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_WORKER_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_WORKER_BACKGROUND = 1;
	readonly STEP_WORKER_IDENTIFICATION = 2;
	readonly STEP_WORKER_LICENCE_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	isFormValid = false;
	isSoleProprietorSimultaneousFlow = false;

	showSaveAndExit = false;
	showStepDogsAndRestraints = false;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepsLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;
	@ViewChild(StepsWorkerLicenceBackgroundComponent) stepsBackgroundComponent!: StepsWorkerLicenceBackgroundComponent;
	@ViewChild(StepsWorkerLicenceIdentificationAuthenticatedComponent)
	stepsIdentificationComponent!: StepsWorkerLicenceIdentificationAuthenticatedComponent;
	@ViewChild(StepsWorkerLicenceReviewAuthenticatedComponent)
	stepsReviewAuthenticatedComponent!: StepsWorkerLicenceReviewAuthenticatedComponent;

	applicationTypeCode!: ApplicationTypeCode;

	private licenceModelChangedSubscription!: Subscription;
	private soleProprietorBizAppId: string | null = null;

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

				this.isSoleProprietorSimultaneousFlow =
					this.workerApplicationService.workerModelFormGroup.get('soleProprietorData.isSoleProprietor')?.value ===
					BooleanTypeCode.Yes;

				this.showSaveAndExit = this.workerApplicationService.isSaveAndExit();

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
		if (this.workerApplicationService.isAutoSave()) {
			this.workerApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					if (stepper?.selected) stepper.selected.completed = true;
					stepper.next();

					const component = this.getSelectedIndexComponent(stepper.selectedIndex);
					component?.onGoToFirstStep();
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
		this.submitSoleProprietorSimultaneousFlowStep();
	}

	onGoToStep(step: number) {
		this.stepsLicenceSelectionComponent?.onGoToFirstStep();
		this.stepsIdentificationComponent?.onGoToFirstStep();
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
		const isStepToSave = this.stepsLicenceSelectionComponent?.isStepToSave();
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

	private getSelectedIndexComponent(index: number): any {
		switch (index) {
			case this.STEP_WORKER_LICENCE_SELECTION:
				return this.stepsLicenceSelectionComponent;
			case this.STEP_WORKER_BACKGROUND:
				return this.stepsBackgroundComponent;
			case this.STEP_WORKER_IDENTIFICATION:
				return this.stepsIdentificationComponent;
			case this.STEP_WORKER_LICENCE_REVIEW:
				return this.stepsReviewAuthenticatedComponent;
		}
		return null;
	}

	private submitStep(): void {
		this.workerApplicationService.submitLicenceNewAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					ServiceTypeCode.SecurityWorkerLicence,
					ApplicationTypeCode.New
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
		this.workerApplicationService.submitNewSoleProprietorSimultaneousFlow().subscribe({
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
		this.step2Complete = this.workerApplicationService.isStepBackgroundComplete();
		this.step3Complete = this.workerApplicationService.isStepIdentificationComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	private handlePartialSaveError(error: HttpErrorResponse): void {
		// only 403s will be here as an error
		if (error.status == 403) {
			this.commonApplicationService.handleDuplicateLicence();
		}
	}

	private goToChildNextStep() {
		const component = this.getSelectedIndexComponent(this.stepper.selectedIndex);
		component?.onGoToNextStep();
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(licenceAppId);
	}
}
