import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';
import { SwlTypeCode } from './step-components/licence-selection.component';
import { StepBackgroundComponent } from './step-components/main-steps/step-background.component';
import { StepIdentificationComponent } from './step-components/main-steps/step-identification.component';
import { StepLicenseSelectionComponent } from './step-components/main-steps/step-license-selection.component';
import { StepReviewComponent } from './step-components/main-steps/step-review.component';

export interface LicenceFormStepComponent {
	getDataToSave(): any;
	// clearCurrentData(): void;
	isFormValid(): boolean;
}

export class LicenceModel {
	licenseTypeCode: SwlTypeCode | null = null;
}

@Component({
	selector: 'app-licence-application',
	template: `
		<div class="container my-4">
			<mat-stepper
				linear
				labelPosition="bottom"
				[orientation]="orientation"
				(selectionChange)="onStepSelectionChange($event)"
				#stepper
			>
				<mat-step completed="true">
					<ng-template matStepLabel>Licence Selection</ng-template>
					<app-step-license-selection (nextStepperStep)="onNextStepperStep(stepper)"></app-step-license-selection>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Background</ng-template>
					<app-step-background
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
					></app-step-background>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Identification</ng-template>
					<app-step-identification
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
					></app-step-identification>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Review and Confirm</ng-template>
					<app-step-review
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
					></app-step-review>
				</mat-step>

				<mat-step completed="true">
					<ng-template matStepLabel>Pay</ng-template>
				</mat-step>
			</mat-stepper>
		</div>
	`,
	styles: [],
})
export class LicenceApplicationComponent implements OnInit {
	readonly STEP_LICENCE_SELECTION = 0;
	readonly STEP_BACKGROUND = 1;
	readonly STEP_IDENTIFICATION = 2;
	readonly STEP_REVIEW = 3;

	licenceModel: LicenceModel = new LicenceModel();

	orientation: StepperOrientation = 'vertical';

	@ViewChild(StepLicenseSelectionComponent)
	stepLicenseSelectionComponent!: StepLicenseSelectionComponent;

	@ViewChild(StepBackgroundComponent)
	stepBackgroundComponent!: StepBackgroundComponent;

	@ViewChild(StepIdentificationComponent)
	stepIdentificationComponent!: StepIdentificationComponent;

	@ViewChild(StepReviewComponent)
	stepReviewComponent!: StepReviewComponent;

	@ViewChild('stepper') stepper!: MatStepper;

	constructor(private breakpointObserver: BreakpointObserver) {}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(distinctUntilChanged())
			.subscribe(() => this.breakpointChanged());
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		this.scrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		console.log('previous', stepper);
		stepper.previous();
	}

	onNextStepperStep(stepper: MatStepper): void {
		console.log('next', stepper);
		stepper.next();
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}

	private scrollIntoView(): void {
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
}
