import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ApplicationTypeCode, ServiceTypeCode } from '@app/api/models';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { BusinessApplicationService } from '@app/core/services/business-application.service';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { Subscription, distinctUntilChanged } from 'rxjs';

import { Router } from '@angular/router';
import { BusinessLicenceApplicationRoutes } from '../business-license-application-routes';
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
							[applicationTypeCode]="applicationTypeCode"
							[licenceCost]="newLicenceCost"
							[isBusinessLicenceSoleProprietor]="isBusinessLicenceSoleProprietor"
							[isSoleProprietorSimultaneousFlow]="false"
							[isBusinessStakeholdersWithoutSwlExist]="false"
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
	standalone: false,
})
export class BusinessLicenceWizardUpdateComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	applicationTypeUpdate = ApplicationTypeCode.Update;
	newLicenceCost = 0;

	readonly STEP_LICENCE_CONFIRMATION = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_LICENCE_UPDATES = 1;
	readonly STEP_REVIEW_AND_CONFIRM = 2;

	isFormValid = false;

	serviceTypeCode!: ServiceTypeCode;
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
		private commonApplicationService: CommonApplicationService,
		private businessApplicationService: BusinessApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.businessApplicationService.initialized) {
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessLicence());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.businessModelValueChangedSubscription = this.businessApplicationService.businessModelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.serviceTypeCode = this.businessApplicationService.businessModelFormGroup.get(
					'serviceTypeData.serviceTypeCode'
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
		this.stepsLicenceUpdatesComponent?.onGoToFirstStep();
		this.stepsReviewAndConfirm?.onGoToFirstStep();
		this.stepper.selectedIndex = step;
	}

	onChildNextStep() {
		this.stepsLicenceUpdatesComponent?.onGoToNextStep();
	}

	onNextPayStep(): void {
		this.businessApplicationService.payBusinessLicenceUpdateOrReplace({
			applicationTypeCode: ApplicationTypeCode.Update,
		});
	}

	private getSelectedIndexComponent(index: number): any {
		switch (index) {
			case this.STEP_LICENCE_UPDATES:
				return this.stepsLicenceUpdatesComponent;
			case this.STEP_REVIEW_AND_CONFIRM:
				return this.stepsReviewAndConfirm;
		}
		return null;
	}
}
