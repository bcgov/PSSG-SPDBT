import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { ApplicationService } from '@app/core/services/application.service';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { Subscription, distinctUntilChanged } from 'rxjs';

import { StepBusinessLicenceConfirmationComponent } from './step-business-licence-confirmation.component';
import { StepsBusinessLicenceReviewComponent } from './steps-business-licence-review.component';
import { StepsBusinessLicenceUpdatesComponent } from './steps-business-licence-updates.component';

@Component({
	selector: 'app-business-licence-wizard-update',
	template: `
		<div class="row">
			<div class="col-12">
				<mat-stepper
					linear
					labelPosition="bottom"
					[orientation]="orientation"
					class="mat-stepper-disable-header-navigation"
					(selectionChange)="onStepSelectionChange($event)"
					#stepper
				>
					<mat-step completed="true">
						<ng-template matStepLabel>Licence Confirmation</ng-template>
						<app-step-business-licence-confirmation
							[applicationTypeCode]="applicationTypeUpdate"
						></app-step-business-licence-confirmation>

						<app-wizard-footer
							(previousStepperStep)="onGotoBusinessProfile()"
							(nextStepperStep)="onGoToNextStep()"
						></app-wizard-footer>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Licence Updates</ng-template>
						<app-steps-business-licence-updates
							[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
							(childNextStep)="onChildNextStep()"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextStepperStep)="onNextStepperStep(stepper)"
							(scrollIntoView)="onScrollIntoView()"
						></app-steps-business-licence-updates>
					</mat-step>

					<mat-step completed="false">
						<ng-template matStepLabel>Review & Confirm</ng-template>
						<app-steps-business-licence-review
							[workerLicenceTypeCode]="workerLicenceTypeCode"
							[applicationTypeCode]="applicationTypeCode"
							[licenceCost]="newLicenceCost"
							[isRenewalShortForm]="false"
							[showSaveAndExit]="false"
							(previousStepperStep)="onPreviousStepperStep(stepper)"
							(nextPayStep)="onNextPayStep()"
							(scrollIntoView)="onScrollIntoView()"
							(goToStep)="onGoToStep($event)"
						></app-steps-business-licence-review>
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
export class BusinessLicenceWizardUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	applicationTypeUpdate = ApplicationTypeCode.Update;
	newLicenceCost = 0;

	readonly STEP_LICENCE_CONFIRMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_UPDATES = 1;
	readonly STEP_REVIEW_AND_CONFIRM = 2;

	isFormValid = false;

	workerLicenceTypeCode!: WorkerLicenceTypeCode;
	applicationTypeCode!: ApplicationTypeCode;

	isBusinessLicenceSoleProprietor!: boolean;
	private businessModelValueChangedSubscription!: Subscription;

	@ViewChild(StepBusinessLicenceConfirmationComponent)
	stepLicenceConfirmationComponent!: StepBusinessLicenceConfirmationComponent;
	@ViewChild(StepsBusinessLicenceUpdatesComponent) stepsLicenceUpdatesComponent!: StepsBusinessLicenceUpdatesComponent;
	@ViewChild(StepsBusinessLicenceReviewComponent) stepsReviewAndConfirm!: StepsBusinessLicenceReviewComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private hotToastService: HotToastService,
		private commonApplicationService: ApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.businessModelValueChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.workerLicenceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'workerLicenceTypeData.workerLicenceTypeCode'
				)?.value;
				this.applicationTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'applicationTypeData.applicationTypeCode'
				)?.value;

				this.isBusinessLicenceSoleProprietor = this.businessApplicationService.businessModelFormGroup.get(
					'isBusinessLicenceSoleProprietor'
				)?.value;

				this.isFormValid = _resp;
			}
		);
	}

	ngOnDestroy() {
		if (this.businessModelValueChangedSubscription) this.businessModelValueChangedSubscription.unsubscribe();
	}

	onGoToNextStep(): void {
		this.stepper.next();
	}

	onGotoBusinessProfile(): void {
		this.commonApplicationService.onGotoBusinessProfile(this.applicationTypeCode);
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_LICENCE_UPDATES:
				this.stepsLicenceUpdatesComponent?.onGoToFirstStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToFirstStep();
				break;
		}

		super.onStepSelectionChange(event);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_LICENCE_UPDATES:
				this.stepsLicenceUpdatesComponent?.onGoToLastStep();
				break;
			case this.STEP_REVIEW_AND_CONFIRM:
				this.stepsReviewAndConfirm?.onGoToLastStep();
				break;
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;
		stepper.next();
	}

	onGoToStep(step: number) {
		this.stepsLicenceUpdatesComponent?.onGoToFirstStep();
		this.stepsReviewAndConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onChildNextStep() {
		this.stepsLicenceUpdatesComponent?.onGoToNextStep();
	}

	onNextPayStep(): void {
		this.businessApplicationService.payBusinessLicenceUpdateOrReplace({
			paymentSuccess: 'Your business licence update has been successfully submitted',
			paymentReason: 'Payment for update of Business Licence application',
		});
	}
}
