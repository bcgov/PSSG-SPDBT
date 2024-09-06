import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { ApplicationService } from '@app/core/services/application.service';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-licence-application-routing.module';
import { StepsWorkerLicenceBackgroundComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/steps-worker-licence-background.component';
import { StepsWorkerLicenceSelectionComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/steps-worker-licence-selection.component';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
import { StepsWorkerLicenceIdentificationAnonymousComponent } from './worker-licence-wizard-step-components/steps-worker-licence-identification-anonymous.component';
import { StepsWorkerLicenceReviewAnonymousComponent } from './worker-licence-wizard-step-components/steps-worker-licence-review-anonymous.component';

@Component({
	selector: 'app-worker-licence-wizard-anonymous-new',
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
					[showWorkerLicenceSoleProprietorStep]="true"
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-selection>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Background</ng-template>
				<app-steps-worker-licence-background
					[showSaveAndExit]="showSaveAndExit"
					[isFormValid]="isFormValid"
					[applicationTypeCode]="applicationTypeCode"
					[policeOfficerRoleCode]="policeOfficerRoleCode"
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
					(childNextStep)="onChildNextStep()"
					(nextReview)="onGoToReview()"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-steps-worker-licence-identification-anonymous>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review Worker Licence</ng-template>
				<app-steps-worker-licence-review-anonymous
					[applicationTypeCode]="applicationTypeCode"
					[isSoleProprietor]="isSoleProprietor"
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(nextSubmitStep)="onNextSoleProprietor()"
					(nextPayStep)="onNextPayStep()"
					(scrollIntoView)="onScrollIntoView()"
					(goToStep)="onGoToStep($event)"
				></app-steps-worker-licence-review-anonymous>
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
	`,
	styles: [],
})
export class WorkerLicenceWizardAnonymousNewComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_WORKER_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_WORKER_LICENCE_BACKGROUND = 1;
	readonly STEP_WORKER_LICENCE_IDENTIFICATION = 2;
	readonly STEP_WORKER_LICENCE_REVIEW = 3;

	step1Complete = false;
	step2Complete = false;
	step3Complete = false;

	licenceAppId: string | null = null;

	isSoleProprietor = false;
	showSaveAndExit = false;
	isFormValid = false;
	showStepDogsAndRestraints = false;
	showCitizenshipStep = false;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;

	@ViewChild(StepsWorkerLicenceBackgroundComponent)
	stepBackgroundComponent!: StepsWorkerLicenceBackgroundComponent;

	@ViewChild(StepsWorkerLicenceIdentificationAnonymousComponent)
	stepIdentificationComponent!: StepsWorkerLicenceIdentificationAnonymousComponent;

	@ViewChild(StepsWorkerLicenceReviewAnonymousComponent)
	stepReviewLicenceComponent!: StepsWorkerLicenceReviewAnonymousComponent;

	applicationTypeCode!: ApplicationTypeCode;
	policeOfficerRoleCode: string | null = null;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private licenceApplicationService: LicenceApplicationService,
		private commonApplicationService: ApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.licenceModelChangedSubscription = this.licenceApplicationService.licenceModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.isFormValid = _resp;

				this.isSoleProprietor =
					this.licenceApplicationService.licenceModelFormGroup.get('soleProprietorData.isSoleProprietor')?.value ===
					BooleanTypeCode.Yes;

				this.applicationTypeCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.showStepDogsAndRestraints =
					this.licenceApplicationService.categorySecurityGuardFormGroup.get('isInclude')?.value;

				const isCanadianCitizen = this.licenceApplicationService.licenceModelFormGroup.get(
					'citizenshipData.isCanadianCitizen'
				)?.value;

				this.showCitizenshipStep =
					this.applicationTypeCode === ApplicationTypeCode.New ||
					(this.applicationTypeCode === ApplicationTypeCode.Renewal && isCanadianCitizen === BooleanTypeCode.No);

				this.policeOfficerRoleCode = this.licenceApplicationService.licenceModelFormGroup.get(
					'policeBackgroundData.policeOfficerRoleCode'
				)?.value;

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
			case this.STEP_WORKER_LICENCE_BACKGROUND:
				this.stepBackgroundComponent?.onGoToFirstStep();
				break;
			case this.STEP_WORKER_LICENCE_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_WORKER_LICENCE_REVIEW:
				this.stepReviewLicenceComponent?.onGoToFirstStep();
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
			case this.STEP_WORKER_LICENCE_BACKGROUND:
				this.stepBackgroundComponent?.onGoToLastStep();
				break;
			case this.STEP_WORKER_LICENCE_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToLastStep();
				break;
		}
	}

	onNextPayStep(): void {
		this.submitStep();
	}

	onNextSoleProprietor(): void {
		this.submitStep(true);
	}

	private submitStep(isSoleProprietorComboFlow: boolean = false): void {
		// If the creation worked and the payment failed, do not post again
		if (this.licenceAppId) {
			this.payNow(this.licenceAppId);
		} else {
			this.licenceApplicationService.submitLicenceAnonymous().subscribe({
				next: (resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
					// save this locally just in case payment fails
					this.licenceAppId = resp.body.licenceAppId!;

					this.hotToastService.success('Your licence has been successfully submitted');

					if (isSoleProprietorComboFlow) {
						this.router.navigate(
							[
								BusinessLicenceApplicationRoutes.MODULE_PATH,
								BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR,
							],
							{
								queryParams: {
									swlLicAppId: this.licenceAppId,
									isSoleProprietorSWLAnonymous: 'Y',
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

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		if (step == 99) {
			this.stepper.selectedIndex = this.STEP_WORKER_LICENCE_IDENTIFICATION;
			this.stepIdentificationComponent.onGoToContactStep();
			return;
		}

		this.stepLicenceSelectionComponent?.onGoToFirstStep();
		this.stepBackgroundComponent?.onGoToFirstStep();
		this.stepIdentificationComponent?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onGoToReview() {
		setTimeout(() => {
			// hack... does not navigate without the timeout
			this.stepper.selectedIndex = this.STEP_WORKER_LICENCE_REVIEW;
		}, 250);
	}

	onChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_WORKER_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_WORKER_LICENCE_BACKGROUND:
				this.stepBackgroundComponent?.onGoToNextStep();
				break;
			case this.STEP_WORKER_LICENCE_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.licenceApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.licenceApplicationService.isStepBackgroundComplete();
		this.step3Complete = this.licenceApplicationService.isStepIdentificationComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete);
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowAnonymous(licenceAppId, 'Payment for new Security Worker Licence application');
	}
}
