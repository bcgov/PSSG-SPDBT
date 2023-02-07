import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';
import { StepOneComponent } from './steps/step-one.component';
import { StepThreeComponent } from './steps/step-three.component';
import { StepTwoComponent } from './steps/step-two.component';

export interface ScreeningFormStepComponent {
	getDataToSave(): any;
	isFormValid(): boolean;
}

@Component({
	selector: 'app-screening',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onSelectionChange($event)"
			#stepper
		>
			<mat-step completed="false">
				<ng-template matStepLabel>Eligibility</ng-template>
				<app-step-one (nextStepperStep)="onNextStepperStep(stepper)"></app-step-one>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Business Information</ng-template>
				<app-step-two
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
				></app-step-two>
			</mat-step>

			<mat-step completed="false">
				<ng-template matStepLabel>Complete</ng-template>
				<app-step-three (previousStepperStep)="onPreviousStepperStep(stepper)"></app-step-three>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class ScreeningComponent implements OnInit {
	orientation: StepperOrientation = 'vertical';

	@ViewChild('stepper') stepper!: MatStepper;

	@ViewChild(StepOneComponent)
	stepOneComponent!: StepOneComponent;

	@ViewChild(StepTwoComponent)
	stepTwoComponent!: StepTwoComponent;

	@ViewChild(StepThreeComponent)
	stepThreeComponent!: StepThreeComponent;

	constructor(private breakpointObserver: BreakpointObserver) {}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.log(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());
	}

	onSelectionChange(event: StepperSelectionEvent): void {
		const stepIndex = event.selectedIndex;
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

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();
	}

	onNextStepperStep(stepper: MatStepper): void {
		if (this.stepper && this.stepper.selected) this.stepper.selected.completed = true;
		stepper.next();
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}
}
