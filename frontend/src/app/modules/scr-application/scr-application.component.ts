import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';
import { StepApplSubmittedComponent } from './steps/step-appl-submitted.component';
import { StepEligibilityComponent } from './steps/step-eligibility.component';
import { StepLoginOptionsComponent } from './steps/step-login-options.component';
import { StepOrganizationInfoComponent } from './steps/step-organization-info.component';
import { StepPersonalInfoComponent } from './steps/step-personal-info.component';
import { StepTermsAndCondComponent } from './steps/step-terms-and-cond.component';

export interface ScreeningFormStepComponent {
	getDataToSave(): any;
	isFormValid(): boolean;
}

@Component({
	selector: 'app-scr-application',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step completed="false" editable="false">
				<ng-template matStepLabel>Eligibility Check</ng-template>
				<app-step-eligibility
					[paymentBy]="paymentBy"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-eligibility>
			</mat-step>

			<mat-step completed="false" editable="false">
				<ng-template matStepLabel>Organization Information</ng-template>
				<app-step-organization-info
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-organization-info>
			</mat-step>

			<mat-step completed="false" editable="false">
				<ng-template matStepLabel>Log In Information</ng-template>
				<app-step-login-options
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-login-options>
			</mat-step>

			<mat-step completed="false" editable="false">
				<ng-template matStepLabel>Personal Information</ng-template>
				<app-step-personal-info
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-personal-info>
			</mat-step>

			<mat-step completed="false" editable="false">
				<ng-template matStepLabel>Terms and Conditions</ng-template>
				<app-step-terms-and-cond
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-terms-and-cond>
			</mat-step>

			<mat-step completed="false" editable="false" *ngIf="paymentBy == 'APP'">
				<ng-template matStepLabel>Pay for Application</ng-template>
				<app-step-pay-for-application
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-pay-for-application>
			</mat-step>

			<mat-step completed="false" editable="false">
				<ng-template matStepLabel>Application Submitted</ng-template>
				<app-step-appl-submitted
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-appl-submitted>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class ScrApplicationComponent implements OnInit {
	orientation: StepperOrientation = 'vertical';
	paymentBy!: 'APP' | 'ORG';

	@ViewChild('stepper') stepper!: MatStepper;

	@ViewChild(StepEligibilityComponent)
	stepEligibilityComponent!: StepEligibilityComponent;

	@ViewChild(StepApplSubmittedComponent)
	stepApplSubmittedComponent!: StepApplSubmittedComponent;

	@ViewChild(StepLoginOptionsComponent)
	stepLoginOptionsComponent!: StepLoginOptionsComponent;

	@ViewChild(StepOrganizationInfoComponent)
	stepOrganizationInfoComponent!: StepOrganizationInfoComponent;

	@ViewChild(StepPersonalInfoComponent)
	stepPersonalInfoComponent!: StepPersonalInfoComponent;

	@ViewChild(StepTermsAndCondComponent)
	stepTermsAndCondComponent!: StepTermsAndCondComponent;

	constructor(private breakpointObserver: BreakpointObserver, private location: Location) {}

	ngOnInit(): void {
		this.paymentBy = (this.location.getState() as any).paymentBy;

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.log(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());
	}

	onScrollIntoView(): void {
		const stepIndex = this.stepper.selectedIndex;
		const stepId = this.stepper._getStepLabelId(stepIndex);
		const stepElement = document.getElementById(stepId);
		if (stepElement) {
			setTimeout(() => {
				stepElement.scrollIntoView({
					block: 'start',
					inline: 'nearest',
					behavior: 'smooth',
				});
			}, 250);
		}
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.onScrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();
	}

	onNextStepperStep(stepper: MatStepper): void {
		// complete the current step
		if (stepper && stepper.selected) stepper.selected.completed = true;
		this.stepper.next();
	}

	onSaveStepperStep(): void {
		// let dataToSave = {};
		// if (this.stepOneComponent) {
		// 	dataToSave = { ...dataToSave, ...this.stepOneComponent.getStepData() };
		// }
		// if (this.stepThreeComponent) {
		// 	dataToSave = { ...dataToSave, ...this.stepThreeComponent.getStepData() };
		// }
		// if (this.stepFourComponent) {
		// 	dataToSave = { ...dataToSave, ...this.stepFourComponent.getStepData() };
		// }
		// console.log('onSaveStepperStep', dataToSave);
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}
}
