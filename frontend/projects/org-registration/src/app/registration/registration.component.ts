import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';
import { StepFourComponent } from './steps/step-four.component';
import { StepOneComponent } from './steps/step-one.component';
import { StepThreeComponent } from './steps/step-three.component';
import { StepTwoComponent } from './steps/step-two.component';

export interface RegistrationFormStepComponent {
	getDataToSave(): any;
	clearCurrentData(): void;
	isFormValid(): boolean;
}

@Component({
	selector: 'app-registration',
	template: `
		<mat-stepper linear labelPosition="bottom" [orientation]="orientation" #stepper>
			<mat-step>
				<ng-template matStepLabel>Eligibility</ng-template>
				<app-step-one
					(nextStepperStep)="onNextStepperStep(stepper)"
					(selectRegistrationType)="onSelectRegistrationType($event)"
					(clearRegistrationData)="onClearRegistrationData()"
				></app-step-one>
			</mat-step>

			<mat-step>
				<ng-template matStepLabel>Log In Options</ng-template>
				<app-step-two
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
				></app-step-two>
			</mat-step>

			<mat-step>
				<ng-template matStepLabel>Business Information</ng-template>
				<app-step-three
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					[registrationTypeCode]="registrationTypeCode"
				></app-step-three>
			</mat-step>

			<mat-step>
				<ng-template matStepLabel>Complete</ng-template>
				<app-step-four
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(saveStepperStep)="onSaveStepperStep()"
				></app-step-four>
			</mat-step>
		</mat-stepper>
	`,
	styles: [
		`
			.mat-horizontal-stepper-header {
				pointer-events: none !important;
			}
		`,
	],
	encapsulation: ViewEncapsulation.None,
})
export class RegistrationComponent implements OnInit {
	registrationTypeCode = '';
	orientation: StepperOrientation = 'vertical';

	@ViewChild('stepper') stepper!: MatStepper;

	@ViewChild(StepOneComponent)
	stepOneComponent!: StepOneComponent;

	@ViewChild(StepTwoComponent)
	stepTwoComponent!: StepTwoComponent;

	@ViewChild(StepThreeComponent)
	stepThreeComponent!: StepThreeComponent;

	@ViewChild(StepFourComponent)
	stepFourComponent!: StepFourComponent;

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

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();
	}

	onSaveStepperStep(): void {
		console.log('onSaveStepperStep SAVE DATA');

		if (this.stepOneComponent) {
			console.log('step1', this.stepOneComponent.getStepData());
		}

		if (this.stepThreeComponent) {
			console.log('step3', this.stepThreeComponent.getStepData());
		}

		if (this.stepFourComponent) {
			console.log('step4', this.stepFourComponent.getStepData());
		}

		this.stepFourComponent.childStepNext();
	}

	onNextStepperStep(stepper: MatStepper): void {
		// complete the current step
		if (this.stepper && this.stepper.selected) this.stepper.selected.completed = true;
		stepper.next();
	}

	onSelectRegistrationType(type: string): void {
		this.registrationTypeCode = type;
	}

	onClearRegistrationData(): void {
		this.stepThreeComponent.clearStepData();
		this.stepFourComponent.clearStepData();
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}

		// if(this.breakpointObserver.isMatched(Breakpoints.Medium)) {
		// 	this.orientation = 'horizontal';
		//   this.currentBreakpoint = Breakpoints.Medium;
		// } else if(this.breakpointObserver.isMatched(Breakpoints.Small)) {
		// 	this.orientation = 'vertical';
		//   this.currentBreakpoint = Breakpoints.Small;
		// } else if(this.breakpointObserver.isMatched('(min-width: 500px)')) {
		//   this.currentBreakpoint = '(min-width: 500px)';
		// }
	}
}
