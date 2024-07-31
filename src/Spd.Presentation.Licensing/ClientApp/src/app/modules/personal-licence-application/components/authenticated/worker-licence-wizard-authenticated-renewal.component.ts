import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ApplicationTypeCode, WorkerLicenceCommandResponse } from '@app/api/models';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { LicenceApplicationService } from '@app/core/services/licence-application.service';
import { StepsWorkerLicenceSelectionComponent } from '@app/modules/personal-licence-application/components/shared/worker-licence-wizard-step-components/steps-worker-licence-selection.component';
import { ApplicationService } from '@app/core/services/application.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';
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
						<ng-template matStepLabel>Licence Selection</ng-template>
						<app-steps-worker-licence-selection
							[isLoggedIn]="true"
							[showSaveAndExit]="showSaveAndExit"
							[isFormValid]="isFormValid"
							[applicationTypeCode]="applicationTypeCode"
							[showStepDogsAndRestraints]="showStepDogsAndRestraints"
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-selection>
					</mat-step>

					<mat-step [completed]="step2Complete">
						<ng-template matStepLabel>Identification</ng-template>
						<app-steps-worker-licence-identification-authenticated
							[isFormValid]="isFormValid"
							[applicationTypeCode]="applicationTypeCode"
							[showCitizenshipStep]="showCitizenshipStep"
							[showSaveAndExit]="showSaveAndExit"
							(childNextStep)="onChildNextStep()"
							(nextReview)="onGoToReview()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-worker-licence-identification-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-worker-licence-review-authenticated
							[applicationTypeCode]="applicationTypeCode"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextPayStep)="onPayNow()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
						></app-steps-worker-licence-review-authenticated>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Pay</ng-template>
					</mat-step>
				</mat-stepper>
			</div>
		</div>
	`,
	styles: [],
})
export class WorkerLicenceWizardAuthenticatedRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	readonly STEP_LICENCE_SELECTION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_IDENTIFICATION = 1;
	readonly STEP_REVIEW = 2;

	step1Complete = false;
	step2Complete = false;

	@ViewChild(StepsWorkerLicenceSelectionComponent)
	stepLicenceSelectionComponent!: StepsWorkerLicenceSelectionComponent;

	@ViewChild(StepsWorkerLicenceIdentificationAuthenticatedComponent)
	stepIdentificationComponent!: StepsWorkerLicenceIdentificationAuthenticatedComponent;

	@ViewChild(StepsWorkerLicenceReviewAuthenticatedComponent)
	stepReviewAuthenticatedComponent!: StepsWorkerLicenceReviewAuthenticatedComponent;

	applicationTypeCode!: ApplicationTypeCode;
	showSaveAndExit = false;
	isFormValid = false;
	showStepDogsAndRestraints = false;
	showCitizenshipStep = false;

	private licenceModelChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private hotToastService: HotToastService,
		private commonApplicationService: ApplicationService,
		private licenceApplicationService: LicenceApplicationService
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

				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.licenceModelChangedSubscription) this.licenceModelChangedSubscription.unsubscribe();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToFirstStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW:
				this.stepReviewAuthenticatedComponent?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToLastStep();
				break;
			case this.STEP_IDENTIFICATION:
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
		if (this.licenceApplicationService.isAutoSave()) {
			this.licenceApplicationService.partialSaveLicenceStepAuthenticated().subscribe({
				next: (_resp: any) => {
					setTimeout(() => {
						// hack... does not navigate without the timeout
						this.stepper.selectedIndex = this.STEP_REVIEW;
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
			this.stepper.selectedIndex = this.STEP_REVIEW;
		}
	}

	onChildNextStep() {
		this.goToChildNextStep();
	}

	onPayNow(): void {
		this.licenceApplicationService.submitLicenceRenewalOrUpdateOrReplaceAuthenticated().subscribe({
			next: (_resp: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				this.hotToastService.success('Your licence renewal has been successfully submitted');
				this.payNow(_resp.body.licenceAppId!);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	private payNow(licenceAppId: string): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(
			licenceAppId,
			'Payment for Security Worker Licence renewal'
		);
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.licenceApplicationService.isStepLicenceSelectionComplete();
		this.step2Complete = this.licenceApplicationService.isStepIdentificationComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete);
	}

	private goToChildNextStep() {
		switch (this.stepper.selectedIndex) {
			case this.STEP_LICENCE_SELECTION:
				this.stepLicenceSelectionComponent?.onGoToNextStep();
				break;
			case this.STEP_IDENTIFICATION:
				this.stepIdentificationComponent?.onGoToNextStep();
				break;
		}
	}
}
