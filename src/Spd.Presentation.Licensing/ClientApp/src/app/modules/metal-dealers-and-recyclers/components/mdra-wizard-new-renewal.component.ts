import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';
import { MetalDealersAndRecyclersRoutes } from '@app/modules/metal-dealers-and-recyclers/metal-dealers-and-recyclers-routes';
import { distinctUntilChanged, Subscription } from 'rxjs';
import { StepMdraBranchesComponent } from './step-mdra-branches.component';
import { StepMdraBusinessAddressComponent } from './step-mdra-business-address.component';
import { StepMdraBusinessManagerComponent } from './step-mdra-business-manager.component';
import { StepMdraBusinessOwnerComponent } from './step-mdra-business-owner.component';
import { StepMdraConsentComponent } from './step-mdra-consent.component';
import { StepMdraSummaryComponent } from './step-mdra-summary.component';

@Component({
	selector: 'app-mdra-wizard-new-renewal',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Checklist</ng-template>

				<app-step-mdra-checklist-new></app-step-mdra-checklist-new>

				<app-wizard-footer
					cancelLabel="Cancel"
					(nextStepperStep)="onFormValidNextStep(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step2Complete">
				<ng-template matStepLabel>Business<br />Owner</ng-template>

				<app-step-mdra-business-owner></app-step-mdra-business-owner>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_OWNER)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step3Complete">
				<ng-template matStepLabel>Business<br />Manager</ng-template>

				<app-step-mdra-business-manager></app-step-mdra-business-manager>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_MANAGER)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step4Complete">
				<ng-template matStepLabel>Business<br />Addresses</ng-template>

				<app-step-mdra-business-address></app-step-mdra-business-address>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BUSINESS_ADDRESSES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step5Complete">
				<ng-template matStepLabel>Branch<br />Offices</ng-template>

				<app-step-mdra-branches></app-step-mdra-branches>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_BRANCH_OFFICES)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step6Complete">
				<ng-template matStepLabel>Registration<br />Summary</ng-template>

				<app-step-mdra-summary (editStep)="onGoToStep($event)"></app-step-mdra-summary>

				<app-wizard-footer
					cancelLabel="Cancel"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_REVIEW)"
				></app-wizard-footer>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Consent and<br />Declaration</ng-template>

				<app-step-mdra-consent></app-step-mdra-consent>

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
export class MdraWizardNewRenewalComponent extends BaseWizardComponent implements OnInit, OnDestroy {
	step1Complete = false;
	step2Complete = false;
	step3Complete = false;
	step4Complete = false;
	step5Complete = false;
	step6Complete = false;

	readonly STEP_CHECKLIST = 0;
	readonly STEP_BUSINESS_OWNER = 1;
	readonly STEP_BUSINESS_MANAGER = 2;
	readonly STEP_BUSINESS_ADDRESSES = 3;
	readonly STEP_BRANCH_OFFICES = 4;
	readonly STEP_REVIEW = 5;
	readonly STEP_CONSENT = 6;

	@ViewChild(StepMdraBusinessOwnerComponent)
	stepBusinessOwner!: StepMdraBusinessOwnerComponent;
	@ViewChild(StepMdraBusinessManagerComponent)
	stepBusinessManager!: StepMdraBusinessManagerComponent;
	@ViewChild(StepMdraBusinessAddressComponent) stepAddresses!: StepMdraBusinessAddressComponent;
	@ViewChild(StepMdraBranchesComponent) stepBranches!: StepMdraBranchesComponent;
	@ViewChild(StepMdraSummaryComponent) stepReview!: StepMdraSummaryComponent;
	@ViewChild(StepMdraConsentComponent) stepConsent!: StepMdraConsentComponent;

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

		this.commonApplicationService.setMetalDealersApplicationTitle();

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
			MetalDealersAndRecyclersRoutes.path(MetalDealersAndRecyclersRoutes.MDRA_REGISTRATION_RECEIVED)
		);
	}

	private dirtyForm(step: number): boolean {
		switch (step) {
			case this.STEP_CHECKLIST:
				return true;
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
