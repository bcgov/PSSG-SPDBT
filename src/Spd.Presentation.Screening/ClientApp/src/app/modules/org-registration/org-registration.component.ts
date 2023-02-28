import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';
import { RegistrationTypeCode } from 'src/app/api/models';
import { OrgRegistrationService } from 'src/app/api/services';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
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
		<div class="container mt-4">
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
						(registerWithBCeid)="onRegisterWithBCeid()"
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
		</div>
	`,
	styles: [],
})
export class OrgRegistrationComponent implements OnInit {
	STATE_KEY = 'state';
	registrationTypeCode: RegistrationTypeCode | null = null;
	sendToEmailAddress = '';
	orientation: StepperOrientation = 'vertical';
	currentStateInfo: any = {};

	@ViewChild('stepper') stepper!: MatStepper;

	@ViewChild(StepOneComponent)
	stepOneComponent!: StepOneComponent;

	@ViewChild(StepTwoComponent)
	stepTwoComponent!: StepTwoComponent;

	@ViewChild(StepThreeComponent)
	stepThreeComponent!: StepThreeComponent;

	@ViewChild(StepFourComponent)
	stepFourComponent!: StepFourComponent;

	constructor(
		private breakpointObserver: BreakpointObserver,
		private authenticationService: AuthenticationService,
		private orgRegistrationService: OrgRegistrationService
	) {}

	async ngOnInit(): Promise<void> {
		await this.authenticationService.configureOAuthService(window.location.origin + `/org-registration`);

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin();
		console.debug('[ngOnInit] tryLogin authInfo', authInfo);

		if (authInfo.loggedIn) {
			if (authInfo.state) {
				var decodedData = decodeURIComponent(authInfo.state);
				sessionStorage.setItem(this.STATE_KEY, decodedData);

				// navigate to step 3
				this.postLoginNavigate(decodedData);
			} else {
				const stateInfo = sessionStorage.getItem(this.STATE_KEY);

				if (stateInfo) {
					this.postLoginNavigate(stateInfo);
				}
			}
		}

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.debug(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());

		// const body: OrgRegistrationCreateRequest = {
		// 	agreeToTermsAndConditions: false,
		// 	contactDateOfBirth: '2023-02-04T00:11:05.865Z',
		// 	payerPreference: PayerPreferenceTypeCode.Applicant,
		// 	contactEmail: 'a@test.com',
		// 	contactGivenName: '1string',
		// 	contactJobTitle: '2string',
		// 	contactPhoneNumber: '2506648787',
		// 	contactSurname: '3string',
		// 	employeeInteractionFlag: EmployeeInteractionTypeCode.Adults,
		// 	employerOrganizationTypeCode: EmployerOrganizationTypeCode.Appointed,
		// 	volunteerOrganizationTypeCode: null,
		// 	genericEmail: 'b@con.com',
		// 	genericEmailConfirmation: 'b@con.com',
		// 	genericPhoneNumber: '2506648787',
		// 	hasPhoneOrEmail: BooleanTypeCode.Yes,
		// 	mailingAddressLine1: '1string',
		// 	mailingAddressLine2: '2string',
		// 	mailingCity: '3string',
		// 	mailingCountry: '4string',
		// 	mailingPostalCode: '5string',
		// 	mailingProvince: '6string',
		// 	operatingBudgetFlag: OperatingBudgetTypeCode.No,
		// 	organizationName: 'test4',
		// 	registrationTypeCode: RegistrationTypeCode.Employee,
		// 	screeningsCount: ScreeningsCountTypeCode.LessThanOneHundred,
		// };
		// this.orgRegistrationService
		// 	.apiOrgRegistrationsPost({ body })
		// 	.pipe()
		// 	.subscribe((_res: any) => {
		// 		this.stepFourComponent.childStepNext();
		// 	});
	}

	postLoginNavigate(step1Data: any): void {
		let step = this.stepper.steps.get(0);
		if (step) {
			step.completed = true;
			step.editable = false;
		}

		step = this.stepper.steps.get(1);
		if (step) {
			step.completed = true;
			step.editable = false;
		}

		this.currentStateInfo = JSON.parse(step1Data);
		this.stepper.selectedIndex = 2;
	}

	async onRegisterWithBCeid(): Promise<void> {
		const stateInfo = JSON.stringify({ ...this.stepOneComponent.getStepData() });

		//auth step 2 - unload angular, redirect to KC
		const isLoggedIn = await this.authenticationService.login(stateInfo);
		if (isLoggedIn) {
			// User is already logged in and clicks Login button.
			// For example, complete a registration then refresh the page.
			// Want it to start at the beginning and continue past login page.
			this.postLoginNavigate(stateInfo);
		}
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();
	}

	onSaveStepperStep(): void {
		// Prevent step Business Information from being edited
		let step = this.stepper.steps.get(2);
		if (step) step.editable = false;

		let dataToSave = {};
		if (this.stepOneComponent) {
			if (this.currentStateInfo) {
				dataToSave = { ...this.currentStateInfo };
			} else {
				dataToSave = { ...this.stepOneComponent.getStepData() };
			}
		}

		if (this.stepThreeComponent) {
			dataToSave = { ...dataToSave, ...this.stepThreeComponent.getStepData() };
		}

		if (this.stepFourComponent) {
			dataToSave = { ...dataToSave, ...this.stepFourComponent.getStepData() };
		}

		console.debug('[onSaveStepperStep] dataToSave', dataToSave);

		// const body: OrgRegistrationCreateRequest = dataToSave;
		// this.orgRegistrationService
		// 	.apiOrgRegistrationsPost({ body })
		// 	.pipe()
		// 	.subscribe((_res: any) => {
		// sessionStorage.removeItem(this.STATE_KEY);
		// 		this.stepFourComponent.childStepNext();
		// 	});
		sessionStorage.removeItem(this.STATE_KEY);
		this.stepFourComponent.childStepNext();
	}

	onNextStepperStep(stepper: MatStepper): void {
		// complete the current step
		if (this.stepper && this.stepper.selected) this.stepper.selected.completed = true;
		stepper.next();
	}

	onSelectRegistrationType(type: RegistrationTypeCode): void {
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
