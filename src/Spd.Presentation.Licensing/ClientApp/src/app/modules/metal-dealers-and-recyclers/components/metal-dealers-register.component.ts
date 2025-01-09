import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseWizardComponent } from '@app/core/components/base-wizard.component';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { distinctUntilChanged } from 'rxjs';
import { StepMetalDealersSummaryComponent } from './step-metal-dealers-summary.component';

@Component({
	selector: 'app-metal-dealers-register',
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

				<app-step-metal-dealers-checklist></app-step-metal-dealers-checklist>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					[isWideNext]="true"
					(nextStepperStep)="onFormValidNextStep(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Business Information</ng-template>

				<app-step-metal-dealers-business-information></app-step-metal-dealers-business-information>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Business Addresses</ng-template>

				<app-step-metal-dealers-business-address></app-step-metal-dealers-business-address>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Branch Offices</ng-template>

				<app-step-metal-dealers-branches></app-step-metal-dealers-branches>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Review</ng-template>

				<app-step-metal-dealers-summary (editStep)="onGoToStep($event)"></app-step-metal-dealers-summary>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					(nextStepperStep)="onFormValidNextStep(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>

			<mat-step [completed]="step1Complete">
				<ng-template matStepLabel>Consent</ng-template>

				<app-step-metal-dealers-consent></app-step-metal-dealers-consent>

				<app-wizard-footer
					cancelLabel="Cancel"
					(cancelStep)="onCancel()"
					(previousStepperStep)="onGoToPreviousStep()"
					nextButtonLabel="Submit"
					(nextStepperStep)="onFormValidNextStep(STEP_CHECKLIST)"
				></app-wizard-footer>
			</mat-step>
		</mat-stepper>
	`,
	styles: ``,
	standalone: false,
})
export class MetalDealersRegisterComponent extends BaseWizardComponent implements OnInit {
	step1Complete = true;

	readonly STEP_CHECKLIST = 0;
	readonly STEP_LICENCE_CONFIRMATION = 1;
	readonly STEP_LICENCE_EXPIRED = 2;
	readonly STEP_LICENCE_BRANDING = 3;
	readonly STEP_LICENCE_LIABILITY = 4;

	@ViewChild(StepMetalDealersSummaryComponent) stepReview!: StepMetalDealersSummaryComponent;

	constructor(
		override breakpointObserver: BreakpointObserver,
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
		// const isValid = this.dirtyForm(formNumber);
		// if (!isValid) return;

		this.stepper.next();
	}

	override onStepSelectionChange(event: StepperSelectionEvent) {
		this.stepReview.onUpdateData();

		super.onStepSelectionChange(event);
	}
}
