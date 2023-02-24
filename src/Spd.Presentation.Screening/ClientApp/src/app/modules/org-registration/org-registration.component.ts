import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
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

export class Guid {
	private static _regexGUID = /^[{]?[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}[}]?$/;

	static newGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (Math.random() * 16) | 0,
				v = c == 'x' ? r : (r & 0x3) | 0x8;
			return v.toString(16);
		});
	}

	static isGuid(valueToTest: string): boolean {
		return this._regexGUID.test(valueToTest);
	}
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
	`,
	styles: [],
})
export class OrgRegistrationComponent implements OnInit, AfterViewInit {
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
		private route: ActivatedRoute,
		private authenticationService: AuthenticationService,
		private orgRegistrationService: OrgRegistrationService
	) {}

	ngAfterViewInit(): void {
		this.route.queryParamMap.pipe(map((params: ParamMap) => params.get('postlogin'))).subscribe((param) => {
			console.log('param guid', param);
			const stateInfo = sessionStorage.getItem('stateInfo');
			if (stateInfo) {
				this.currentStateInfo = JSON.parse(stateInfo);
				console.log('ngAfterViewInit SessionData', this.currentStateInfo);
				if (param == this.currentStateInfo.guid) {
					console.log('is equal');
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

					this.stepper.selectedIndex = 2;
				} else {
					console.log('is NOT equal');
				}
				sessionStorage.removeItem('stateInfo');
			}
		});
	}

	ngOnInit(): void {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.log(value)),
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

	async onRegisterWithBCeid(): Promise<void> {
		const guid = Guid.newGuid();
		const stateInfo = JSON.stringify({ ...this.stepOneComponent.getStepData(), guid: guid });
		sessionStorage.setItem('stateInfo', stateInfo);
		console.log('saved SessionData', sessionStorage.getItem('stateInfo'));

		const redirectUri = window.location.origin + `/org-registration?postlogin=${guid}`;
		console.log('redirectUri', redirectUri);
		const nextUrl = await this.authenticationService.login(redirectUri);
		console.log('nextUrl', nextUrl);
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		stepper.previous();
	}

	onSaveStepperStep(): void {
		console.log('onSaveStepperStep SessionData', this.currentStateInfo);

		// Prevent step Business Information from being edited
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
		console.log('data', this.stepOneComponent.getStepData());
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
