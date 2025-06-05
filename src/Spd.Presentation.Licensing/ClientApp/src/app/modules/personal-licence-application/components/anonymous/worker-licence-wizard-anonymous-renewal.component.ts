import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, ServiceTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routes';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { UtilService } from '@app/core/services/util.service';
import { WorkerApplicationService } from '@app/core/services/worker-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { StepsWorkerLicenceSelectionComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/steps-worker-licence-selection.component';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsWorkerLicenceBackgroundComponent } from '../shared/worker-licence-wizard-step-components/steps-worker-licence-background.component';
import { StepsWorkerLicenceIdentificationAnonymousComponent } from './worker-licence-wizard-step-components/steps-worker-licence-identification-anonymous.component';
import { StepsWorkerLicenceReviewAnonymousComponent } from './worker-licence-wizard-step-components/steps-worker-licence-review-anonymous.component';

@Component({
	selector: 'app-worker-licence-wizard-anonymous-renewal',
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
					[showFullCitizenshipQuestion]="true"
					[showPhotographOfYourselfStep]="true"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-identification-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel
					>Review<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Worker Licence</ng-template
				>
				<app-steps-worker-licence-review-anonymous
					[applicationTypeCode]="applicationTypeCode"
					[showCitizenshipStep]="true"
					[isSoleProprietorSimultaneousFlow]="isSoleProprietorSimultaneousFlow"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(nextSubmitStep)="onNextSoleProprietor()"
					(nextPayStep)="onNextPayStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-worker-licence-review-anonymous>
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
						>Review<ng-container *ngTemplateOutlet="StepNameSpace"></ng-container>Business<ng-container
							*ngTemplateOutlet="StepNameSpace"
						></ng-container
						>Licence</ng-template
					>
				</mat-step>
			</ng-container>

			<ng-template #isNotSoleProprietor>
				<mat-step completed="false">
					<ng-template matStepLabel>Pay</ng-template>
				</mat-step>
			</ng-template>
		</mat-stepper>

		<ng-template #StepNameSpace>
			<!-- wrap label in large view -->
			<span class="d-xxl-none">&nbsp;</span><span class="d-none d-xxl-inline"><br /></span>
		</ng-template>
	`,
	styles: [],
	standalone: false,
})
export class WorkerLicenceWizardAnonymousRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	applicationTypeCode!: ApplicationTypeCode;
	licenceAppId: string | null = null;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepsLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;
	@ViewChild(StepsWorkerLicenceBackgroundComponent) stepsBackgroundComponent!: StepsWorkerLicenceBackgroundComponent;
	@ViewChild(StepsWorkerLicenceIdentificationAnonymousComponent)
	stepsIdentificationComponent!: StepsWorkerLicenceIdentificationAnonymousComponent;
	@ViewChild(StepsWorkerLicenceReviewAnonymousComponent)
	stepsReviewLicenceComponent!: StepsWorkerLicenceReviewAnonymousComponent;

	isSoleProprietorSimultaneousFlow = false;
	showWorkerLicenceSoleProprietorStep = false;
	isSoleProprietor = false;
	isFormValid = false;
	showStepDogsAndRestraints = false;
	linkedSoleProprietorBizLicId: string | null = null;

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

	onNextPayStep(): void {
		this.submitStep();
	}

	onNextSoleProprietor(): void {
		this.submitStep(true);
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

	private submitStep(isSoleProprietorSimultaneousFlow: boolean = false): void {
		// If the creation worked and the payment failed, do not post again
		if (this.licenceAppId) {
			this.payNow(this.licenceAppId);
		} else {
			this.workerApplicationService.submitLicenceAnonymous().subscribe({
				next: (resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
					// save this locally just in case payment fails
					this.licenceAppId = resp.body.licenceAppId!;

					const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
						ServiceTypeCode.SecurityWorkerLicence,
						this.applicationTypeCode
					);
					this.utilService.toasterSuccess(successMessage);

					if (isSoleProprietorSimultaneousFlow) {
						this.router.navigate(
							[
								BusinessLicenceApplicationRoutes.MODULE_PATH,
								BusinessLicenceApplicationRoutes.BUSINESS_RENEWAL_SOLE_PROPRIETOR,
							],
							{
								queryParams: {
									swlLicAppId: this.licenceAppId,
									linkedSoleProprietorBizLicId: this.linkedSoleProprietorBizLicId,
								},
							}
						);
					} else {
						this.payNow(this.licenceAppId);
					}
				},
				error: (error: any) => {
					console.log('An error occurred during save', error);
				},
			});
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.workerApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.workerApplicationService.isStepBackgroundComplete();
		this.step3Complete = this.workerApplicationService.isStepIdentificationComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAnonymous(licenceAppId);
	}
}
