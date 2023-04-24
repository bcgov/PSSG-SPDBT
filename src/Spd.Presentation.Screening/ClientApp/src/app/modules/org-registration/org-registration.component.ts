import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { distinctUntilChanged } from 'rxjs';
import {
	AnonymousOrgRegistrationCreateRequest,
	BooleanTypeCode,
	OrgRegistrationCreateResponse,
	RegistrationTypeCode,
} from 'src/app/api/models';
import { OrgRegistrationService } from 'src/app/api/services';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { DialogComponent, DialogOptions } from 'src/app/shared/components/dialog.component';
import { OrgRegistrationRoutes } from './org-registration-routing.module';
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
				<mat-step completed="false">
					<ng-template matStepLabel>Eligibility</ng-template>
					<app-step-one
						(nextStepperStep)="onNextStepperStep(stepper)"
						(selectRegistrationType)="onSelectRegistrationType($event)"
						(clearRegistrationData)="onClearRegistrationData()"
						(scrollIntoView)="onScrollIntoView()"
					></app-step-one>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Log In Options</ng-template>
					<app-step-two
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						(registerWithBCeid)="onRegisterWithBCeid()"
					></app-step-two>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Business Information</ng-template>
					<app-step-three
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[registrationTypeCode]="registrationTypeCode"
					></app-step-three>
				</mat-step>

				<mat-step completed="false">
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
		private orgRegistrationService: OrgRegistrationService,
		private utilService: UtilService,
		private dialog: MatDialog
	) {}

	async ngOnInit(): Promise<void> {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.debug(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());

		await this.authenticationService.configureOAuthService(
			window.location.origin + `/${OrgRegistrationRoutes.ORG_REGISTRATION}`
		);

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin();
		console.debug('[OrgRegistrationComponent.ngOnInit] tryLogin authInfo', authInfo);

		if (authInfo.loggedIn) {
			if (authInfo.state) {
				const decodedData = decodeURIComponent(authInfo.state);
				this.utilService.setOrgRegState(decodedData);

				// navigate to step 3
				this.postLoginNavigate(decodedData);
			} else {
				const stateInfo = this.utilService.getOrgRegState();
				if (stateInfo) {
					this.postLoginNavigate(stateInfo);
				}
			}
		}
	}

	postLoginNavigate(step1Data: any): void {
		let step = this.stepper.steps.get(0);
		if (step) {
			step.completed = true;
		}

		step = this.stepper.steps.get(1);
		if (step) {
			step.completed = true;
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
		const stepIndex = this.stepper.selectedIndex;
		if (stepIndex == 2 && this.authenticationService.isLoggedIn()) {
			// Go to Step 1
			this.stepper.selectedIndex = 0;
			this.stepOneComponent.navigateToLastStep(this.currentStateInfo);
			return;
		}

		stepper.previous();
	}

	onSaveStepperStep(): void {
		let dataToSave = {};
		if (this.stepOneComponent) {
			console.debug('[onSaveStepperStep] currentStateInfo', this.currentStateInfo);
			if (this.currentStateInfo && this.currentStateInfo.registrationTypeCode) {
				dataToSave = { ...this.currentStateInfo };
			} else {
				dataToSave = { ...this.stepOneComponent.getStepData() };
			}
		}

		if (this.stepThreeComponent) {
			dataToSave = { ...dataToSave, ...this.stepThreeComponent.getStepData() };
		}

		if (this.stepFourComponent) {
			const step4Data = this.stepFourComponent.getStepData();
			dataToSave = { ...dataToSave, ...this.stepFourComponent.getStepData() };
		}

		const body: AnonymousOrgRegistrationCreateRequest = dataToSave;
		body.requireDuplicateCheck = true;
		console.debug('[onSaveStepperStep] dataToSave', body);

		if (this.authenticationService.isLoggedIn()) {
			this.orgRegistrationService
				.apiOrgRegistrationsPost({ body })
				.pipe()
				.subscribe((dupres: OrgRegistrationCreateResponse) => {
					this.displayDuplicateCheck(body, dupres);
				});
		} else {
			this.orgRegistrationService
				.apiAnonymousOrgRegistrationsPost({ body })
				.pipe()
				.subscribe((dupres: OrgRegistrationCreateResponse) => {
					this.displayDuplicateCheck(body, dupres);
				});
		}
	}

	onNextStepperStep(stepper: MatStepper): void {
		// complete the current step
		if (this.stepper && this.stepper.selected) this.stepper.selected.completed = true;

		const stepIndex = this.stepper.selectedIndex;
		if (stepIndex == 0 && this.authenticationService.isLoggedIn()) {
			// Mark Step 2 (Log In) as complete
			const stepLogin = this.stepper.steps.get(1);
			if (stepLogin) {
				stepLogin.completed = true;
			}

			const stateInfo = JSON.stringify({ ...this.stepOneComponent.getStepData() });
			this.currentStateInfo = JSON.parse(stateInfo);
			this.utilService.setOrgRegState(stateInfo);

			// Go to Step 3
			this.stepper.selectedIndex = 2;
			return;
		}

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
		if (event.selectedIndex == 3) {
			const step3Data = this.stepThreeComponent.getStepData();
			this.sendToEmailAddress = step3Data.contactEmail;
		}

		this.onScrollIntoView();
	}

	private displayDuplicateCheck(
		body: AnonymousOrgRegistrationCreateRequest,
		dupres: OrgRegistrationCreateResponse
	): void {
		if (dupres.hasPotentialDuplicate) {
			const data: DialogOptions = {
				icon: 'warning',
				title: 'Potential duplicate detected',
				message: 'A potential duplicate has been found. Are you sure this is a new organization registration request?',
				actionText: 'Yes, create registration',
				cancelText: 'Cancel',
			};

			this.dialog
				.open(DialogComponent, { data })
				.afterClosed()
				.subscribe((response: boolean) => {
					if (response) {
						this.saveRegistration(body, BooleanTypeCode.Yes);
					}
				});
		} else {
			// Save registration
			this.saveRegistration(body, BooleanTypeCode.No);
		}
	}

	private saveRegistration(body: AnonymousOrgRegistrationCreateRequest, hasPotentialDuplicate: BooleanTypeCode) {
		body.hasPotentialDuplicate = hasPotentialDuplicate;
		body.requireDuplicateCheck = false;

		if (this.authenticationService.isLoggedIn()) {
			this.orgRegistrationService
				.apiOrgRegistrationsPost({ body })
				.pipe()
				.subscribe((_res: any) => {
					this.utilService.clearOrgRegState();
					this.stepFourComponent.childStepNext();
				});
		} else {
			this.orgRegistrationService
				.apiAnonymousOrgRegistrationsPost({ body })
				.pipe()
				.subscribe((_res: any) => {
					this.utilService.clearOrgRegState();
					this.stepFourComponent.childStepNext();
				});
		}
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}
}
