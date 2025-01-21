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
import { StepMetalDealersBusinessManagerComponent } from './step-metal-dealers-business-manager.component';
import { StepMetalDealersBusinessOwnerComponent } from './step-metal-dealers-business-owner.component';
import { StepMetalDealersConsentComponent } from './step-metal-dealers-consent.component';
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
					[isWideNext]="true"
					(nextStepperStep)="onFormValidNextStep(STEP_REGISTRATION_INFORMATION)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Business<br />Owner</ng-template>

				<app-step-metal-dealers-business-owner></app-step-metal-dealers-business-owner>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_OWNER)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Business<br />Manager</ng-template>

				<app-step-metal-dealers-business-manager></app-step-metal-dealers-business-manager>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_MANAGER)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Business<br />Addresses</ng-template>

				<app-step-metal-dealers-business-address></app-step-metal-dealers-business-address>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_ADDRESSES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step5Complete">
				<ng-template matStepLabel>Branch<br />Offices</ng-template>

				<app-step-metal-dealers-branches></app-step-metal-dealers-branches>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BRANCH_OFFICES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step6Complete">
				<ng-template matStepLabel>Registration<br />Summary</ng-template>

				<app-step-metal-dealers-summary (editStep)="onGoToStep($event)"></app-step-metal-dealers-summary>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_REVIEW)"
				></app-wizard-footer>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Consent and<br />Declaration</ng-template>

				<app-step-metal-dealers-consent></app-step-metal-dealers-consent>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					nextButtonLabel="Submit"
					(nextStepperStep)="onSubmit()"
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
	step5Complete = false;
	step6Complete = false;

	readonly STEP_REGISTRATION_INFORMATION = 0;
	readonly STEP_BUSINESS_OWNER = 1;
	readonly STEP_BUSINESS_MANAGER = 2;
	readonly STEP_BUSINESS_ADDRESSES = 3;
	readonly STEP_BRANCH_OFFICES = 4;
	readonly STEP_REVIEW = 5;
	readonly STEP_CONSENT = 6;

	@ViewChild(MetalDealersRegistrationInformationComponent)
	stepRegisterInfo!: MetalDealersRegistrationInformationComponent;
	@ViewChild(StepMetalDealersBusinessOwnerComponent)
	stepBusinessOwner!: StepMetalDealersBusinessOwnerComponent;
	@ViewChild(StepMetalDealersBusinessManagerComponent)
	stepBusinessManager!: StepMetalDealersBusinessManagerComponent;
	@ViewChild(StepMetalDealersBusinessAddressComponent) stepAddresses!: StepMetalDealersBusinessAddressComponent;
	@ViewChild(StepMetalDealersBranchesComponent) stepBranches!: StepMetalDealersBranchesComponent;
	@ViewChild(StepMetalDealersSummaryComponent) stepReview!: StepMetalDealersSummaryComponent;
	@ViewChild(StepMetalDealersConsentComponent) stepConsent!: StepMetalDealersConsentComponent;

	private metalDealersModelValueChangedSubscription!: Subscription;

	constructor(
		override breakpointObserver: BreakpointObserver,
		private router: Router,
		private metalDealersApplicationService: MetalDealersApplicationService,
		private commonApplicationService: CommonApplicationService
	) {
		super(breakpointObserver);
	}

	ngOnInit(): void {
		if (!this.metalDealersApplicationService.initialized) {
			this.router.navigateByUrl(MetalDealersAndRecyclersRoutes.path());
			return;
		}

		this.commonApplicationService.setApplicationTitleText(
			'Metal Dealers & Recyclers Business Registration',
			'Business Registration'
		);

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());

		this.metalDealersModelValueChangedSubscription =
			this.metalDealersApplicationService.metalDealersModelValueChanges$.subscribe((_resp: boolean) => {
				this.updateCompleteStatus();
			});
	}

	ngOnDestroy() {
		if (this.metalDealersModelValueChangedSubscription) this.metalDealersModelValueChangedSubscription.unsubscribe();
	}

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

	onSubmit(): void {
		if (!this.stepConsent.isFormValid()) return;

		this.router.navigateByUrl(
			MetalDealersAndRecyclersRoutes.path(
				MetalDealersAndRecyclersRoutes.METAL_DEALERS_AND_RECYCLERS_REGISTRATION_RECEIVED
			)
		);
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_REGISTRATION_INFORMATION:
				return this.stepRegisterInfo.isFormValid();
			case this.STEP_BUSINESS_OWNER:
				return this.stepBusinessOwner.isFormValid();
			case this.STEP_BUSINESS_MANAGER:
				return this.stepBusinessManager.isFormValid();
			case this.STEP_BUSINESS_ADDRESSES:
				return this.stepAddresses.isFormValid();
			case this.STEP_BRANCH_OFFICES:
				return this.stepBranches.isFormValid();
			case this.STEP_REVIEW:
				return this.stepReview.isFormValid();
			case this.STEP_CONSENT:
				return this.stepConsent.isFormValid();
		}
		return false;
	}

	private updateCompleteStatus(): void {
		this.step1Complete = this.metalDealersApplicationService.isStepRegistrationInformationComplete();
		this.step2Complete = this.metalDealersApplicationService.isStepBusinessOwnerComplete();
		this.step3Complete = this.metalDealersApplicationService.isStepBusinessManagerComplete();
		this.step4Complete = this.metalDealersApplicationService.isStepBusinessAddressesComplete();
		this.step5Complete = this.metalDealersApplicationService.isStepBranchOfficesComplete();
		this.step6Complete =
			this.step1Complete && this.step2Complete && this.step3Complete && this.step4Complete && this.step5Complete;

		console.debug(
			'Complete Status',
			this.step1Complete,
			this.step2Complete,
			this.step3Complete,
			this.step4Complete,
			this.step5Complete
		);
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		this.stepReview.onUpdateData();

		super.onStepSelectionChange(event);
	}
}
