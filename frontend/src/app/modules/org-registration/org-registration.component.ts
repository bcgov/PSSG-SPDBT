import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';
import { OrgRegistrationService } from 'src/app/api/services';
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
	selector: 'app-org-registration',
	template: `
		<mat-stepper
			linear
			labelPosition="bottom"
			[orientation]="orientation"
			(selectionChange)="onStepSelectionChange($event)"
			#stepper
		>
			<mat-step completed="false" editable="true">
				<ng-template matStepLabel>Eligibility</ng-template>
				<app-step-one
					(nextStepperStep)="onNextStepperStep(stepper)"
					(selectRegistrationType)="onSelectRegistrationType($event)"
					(clearRegistrationData)="onClearRegistrationData()"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-one>
			</mat-step>

			<mat-step completed="false" editable="false">
				<ng-template matStepLabel>Log In Options</ng-template>
				<app-step-two
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-two>
			</mat-step>

			<mat-step completed="false" editable="true">
				<ng-template matStepLabel>Business Information</ng-template>
				<app-step-three
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
					[registrationTypeCode]="registrationTypeCode"
				></app-step-three>
			</mat-step>

			<mat-step completed="false" editable="false">
				<ng-template matStepLabel>Complete</ng-template>
				<app-step-four
					(previousStepperStep)="onPreviousStepperStep(stepper)"
					(saveStepperStep)="onSaveStepperStep()"
					(scrollIntoView)="onScrollIntoView()"
					[sendToEmailAddress]="sendToEmailAddress"
				></app-step-four>
			</mat-step>
		</mat-stepper>
	`,
	styles: [],
})
export class OrgRegistrationComponent implements OnInit {
	registrationTypeCode = '';
	sendToEmailAddress = '';
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

	constructor(private breakpointObserver: BreakpointObserver, private orgRegistrationService: OrgRegistrationService) {}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.log(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());

		// const body: OrgRegistrationCreateRequest = {
		// 	agreeToTermsAndConditions: true,
		// 	contactDateOfBirth: '2023-02-04T00:11:05.865Z',
		// 	checkFeePayer: 'string',
		// 	contactEmail: 'a@test.com',
		// 	contactGivenName: 'string',
		// 	contactJobTitle: 'string',
		// 	contactPhoneNumber: '2506648787',
		// 	contactSurname: 'string',
		// 	employeeInteractionFlag: 'string',
		// 	employerOrganizationTypeCode: EmployerOrganizationTypeCode.Appointed,
		// 	genericEmail: 'b@con.com',
		// 	genericEmailConfirmation: 'b@con.com',
		// 	genericPhoneNumber: '2506648787',
		// 	hasPhoneOrEmail: 'string',
		// 	mailingAddressLine1: 'string',
		// 	mailingAddressLine2: 'string',
		// 	mailingCity: 'string',
		// 	mailingCountry: 'string',
		// 	mailingPostalCode: 'string',
		// 	mailingProvince: 'string',
		// 	operatingBudgetFlag: 'string',
		// 	organizationName: 'test',
		// 	organizationType: 'string',
		// 	registrationTypeCode: RegistrationTypeCode.Employee,
		// 	screeningsCount: 'string',
		// };
		// this.orgRegistrationService
		// 	.apiOrgRegistrationsPost({ body })
		// 	.pipe()
		// 	.subscribe((_res: any) => {
		// 		this.stepFourComponent.childStepNext();
		// 	});
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();
	}

	onSaveStepperStep(): void {
		// Prevent step 3 from being edited
		let step = this.stepper.steps.get(2);
		if (step) step.editable = false;

		let dataToSave = {};
		if (this.stepOneComponent) {
			dataToSave = { ...dataToSave, ...this.stepOneComponent.getStepData() };
		}

		if (this.stepThreeComponent) {
			dataToSave = { ...dataToSave, ...this.stepThreeComponent.getStepData() };
		}

		if (this.stepFourComponent) {
			dataToSave = { ...dataToSave, ...this.stepFourComponent.getStepData() };
		}

		console.log('onSaveStepperStep', dataToSave);

		// const body: OrgRegistrationCreateRequest = dataToSave;
		// this.orgRegistrationService
		// 	.apiOrgRegistrationsPost({ body })
		// 	.pipe()
		// 	.subscribe((_res: any) => {
		// 		this.stepFourComponent.childStepNext();
		// 	});
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
		this.stepper.steps.forEach((step) => {
			step.completed = false;
		});

		this.stepThreeComponent.clearStepData();
		this.stepFourComponent.clearStepData();
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
		if (event.selectedIndex == 2) {
			// after log in, cannot edit Step 1
			let step = this.stepper.steps.get(0);
			if (step) step.editable = false;
		} else if (event.selectedIndex == 3) {
			const step3Data = this.stepThreeComponent.getStepData();
			this.sendToEmailAddress = step3Data.contactEmail;
		}

		this.onScrollIntoView();
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}
}
