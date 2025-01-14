import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { MetalDealersAndRecyclersRoutes } from '../metal-dealers-and-recyclers-routes';
import { StepMetalDealersBranchesComponent } from './step-metal-dealers-branches.component';
import { StepMetalDealersBusinessAddressComponent } from './step-metal-dealers-business-address.component';
import { StepMetalDealersBusinessInformationComponent } from './step-metal-dealers-business-information.component';
import { MetalDealersRegistrationInformationComponent } from './step-metal-dealers-registration-information.component';
import { StepMetalDealersSummaryComponent } from './step-metal-dealers-summary.component';

@Component({
	selector: 'app-metal-dealers-wizard',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Registration<br />Information</ng-template>

				<app-step-metal-dealers-registration-information></app-step-metal-dealers-registration-information>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					[isWideNext]="true"
					(nextStepperStep)="onFormValidNextStep(STEP_REGISTRATION_INFORMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Business<br />Information</ng-template>

				<app-step-metal-dealers-business-information></app-step-metal-dealers-business-information>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_INFORMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Business<br />Addresses</ng-template>

				<app-step-metal-dealers-business-address></app-step-metal-dealers-business-address>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_ADDRESSES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Branch<br />Offices</ng-template>

				<app-step-metal-dealers-branches></app-step-metal-dealers-branches>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BRANCH_OFFICES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Review</ng-template>

				<app-step-metal-dealers-summary (editStep)="onGoToStep($event)"></app-step-metal-dealers-summary>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_REVIEW)"
				></app-wizard-footer>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Consent</ng-template>

				<app-step-metal-dealers-consent></app-step-metal-dealers-consent>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					nextButtonLabel="Submit"
					(nextStepperStep)="onFormValidNextStep(STEP_CONSENT)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: ``,
	standalone: false,
})
export class MetalDealersWizardComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;

	readonly STEP_REGISTRATION_INFORMATION = 0;
	readonly STEP_BUSINESS_INFORMATION = 1;
	readonly STEP_BUSINESS_ADDRESSES = 2;
	readonly STEP_BRANCH_OFFICES = 3;
	readonly STEP_REVIEW = 4;
	readonly STEP_CONSENT = 5;

	@ViewChild(MetalDealersRegistrationInformationComponent)
	stepRegisterInfo!: MetalDealersRegistrationInformationComponent;
	@ViewChild(StepMetalDealersBusinessInformationComponent)
	stepBusinessInfo!: StepMetalDealersBusinessInformationComponent;
	@ViewChild(StepMetalDealersBusinessAddressComponent) stepAddresses!: StepMetalDealersBusinessAddressComponent;
	@ViewChild(StepMetalDealersBranchesComponent) stepBranches!: StepMetalDealersBranchesComponent;
	@ViewChild(StepMetalDealersSummaryComponent) stepReview!: StepMetalDealersSummaryComponent;

	private modelValueChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private metalDealersApplicationService: MetalDealersApplicationService,
		private commonApplicationService: CommonApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		this.commonApplicationService.setApplicationTitleText(
			'Metal Dealers & Recyclers Business Registration',
			'Registration'
		);

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		if (!this.metalDealersApplicationService.initialized) {
			this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.pathMetalDealersAndRecyclers());
			return;
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.modelValueChangedSubscription = this.metalDealersApplicationService.modelValueChanges$.subscribe(
			(_resp: boolean) => {
				this.updateCompleteStatus();
			}
		);
	}

	ngOnDestroy() {
		if (this.modelValueChangedSubscription) this.modelValueChangedSubscription.unsubscribe();
	}

	onCancel() {}

	onGoToStep(step: number) {
		this.stepper.selectedIndex = step;
	}

	onGoToPreviousStep() {
		this.stepper.previous();
	}

	onGoToNextStep() {
		this.stepper.next();
	}

	onGoToFirstStep() {
		this.stepper.selectedIndex = 0;
	}

	onGoToLastStep() {
		this.stepper.selectedIndex = this.stepper.steps.length - 1;
	}

	onFormValidNextStep(formNumber: number): void {
		const isValid = this.dirtyForm(formNumber);
		if (!isValid) return;

		this.stepper.next();
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_REGISTRATION_INFORMATION:
				return this.stepRegisterInfo.isFormValid();
			case this.STEP_BUSINESS_INFORMATION:
				return this.stepBusinessInfo.isFormValid();
			case this.STEP_BUSINESS_ADDRESSES:
				return this.stepAddresses.isFormValid();
			case this.STEP_BRANCH_OFFICES:
				return this.stepBranches.isFormValid();
			case this.STEP_REVIEW:
				return true;
			case this.STEP_CONSENT:
				return true;
		}
		return false;
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.metalDealersApplicationService.isStepRegistrationInformationComplete();
		this.step2Complete = this.metalDealersApplicationService.isStepBusinessInformationComplete();
		this.step3Complete = this.metalDealersApplicationService.isStepBusinessAddressesComplete();
		this.step4Complete = this.metalDealersApplicationService.isStepBranchOfficesComplete();

		console.debug('Complete Status', this.step1Complete, this.step2Complete, this.step3Complete, this.step4Complete);
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		this.stepReview.onUpdateData();

		super.onStepSelectionChange(event);
	}
}
