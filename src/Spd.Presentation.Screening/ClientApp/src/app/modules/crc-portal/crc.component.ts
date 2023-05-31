import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs';
import { AppInviteVerifyResponse } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CrcRoutes } from './crc-routing.module';
import { StepApplSubmittedComponent } from './steps/step-appl-submitted.component';
import { StepEligibilityComponent } from './steps/step-eligibility.component';
import { StepLoginOptionsComponent } from './steps/step-login-options.component';
import { StepOrganizationInfoComponent } from './steps/step-organization-info.component';
import { StepPersonalInfoComponent } from './steps/step-personal-info.component';
import { StepTermsAndCondComponent } from './steps/step-terms-and-cond.component';

export interface CrcFormStepComponent {
	getDataToSave(): any;
	isFormValid(): boolean;
}

export interface AppInviteOrgData extends AppInviteVerifyResponse {
	address?: string | null;
	facilityNameRequired?: boolean | null;
	vulnerableSectorCategoryDesc?: string | null;
}

@Component({
	selector: 'app-crc',
	template: `
		<div class="container mt-4" *ngIf="orgData">
			<mat-stepper
				linear
				labelPosition="bottom"
				[orientation]="orientation"
				(selectionChange)="onStepSelectionChange($event)"
				#stepper
			>
				<mat-step completed="false">
					<ng-template matStepLabel>Eligibility Check</ng-template>
					<app-step-eligibility
						[payeeType]="orgData.payeeType!"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-step-eligibility>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Organization Information</ng-template>
					<app-step-organization-info
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-step-organization-info>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Log In</ng-template>
					<app-step-login-options
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						(registerWithBcServicesCard)="onRegisterWithBcServicesCard()"
					></app-step-login-options>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Personal Information</ng-template>
					<app-step-personal-info
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						(reEditCrcData)="onReEditCrcData()"
						(getCrcData)="onGetCrcData()"
						[orgData]="orgData"
						[crcData]="crcData"
					></app-step-personal-info>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Terms and Conditions</ng-template>
					<app-step-terms-and-cond
						[payeeType]="orgData.payeeType!"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onSaveStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-step-terms-and-cond>
				</mat-step>

				<!-- PAYMENT PROCESS?
				 <mat-step completed="false" *ngIf="payeeType == 'APP'">
				<ng-template matStepLabel>Pay for Application</ng-template>
				<app-step-pay-for-application
					(nextStepperStep)="onNextStepperStep(stepper)"
					(scrollIntoView)="onScrollIntoView()"
				></app-step-pay-for-application>
			</mat-step> -->

				<mat-step completed="false">
					<ng-template matStepLabel>Application Submitted</ng-template>
					<app-step-appl-submitted
						[payeeType]="orgData.payeeType!"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-step-appl-submitted>
				</mat-step>
			</mat-stepper>
		</div>
	`,
	styles: [],
})
export class CrcComponent implements OnInit {
	orgData!: AppInviteOrgData;
	crcData!: any;
	orientation: StepperOrientation = 'vertical';
	currentStateInfo: any = {};

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

	constructor(
		private router: Router,
		private breakpointObserver: BreakpointObserver,
		private utilService: UtilService,
		private authenticationService: AuthenticationService,
		private location: Location
	) {}

	async ngOnInit(): Promise<void> {
		this.orgData = (this.location.getState() as any).orgData;
		if (this.orgData) {
			this.orgData.address =
				this.orgData.addressLine1 +
				', ' +
				this.orgData.addressCity +
				', ' +
				this.orgData.addressProvince +
				', ' +
				this.orgData.addressPostalCode +
				', ' +
				this.orgData.addressCountry;
			// vulnerableSectorCategory?: EmployeeInteractionTypeCode | null;

			this.orgData.vulnerableSectorCategoryDesc = this.orgData.worksWith;
			this.orgData.contactGivenName = 'Jim';
			this.orgData.contactSurname = 'Jimmy';
			this.orgData.contactEmail = 'Jim@jim.com';
			this.orgData.jobTitle = 'Tester';

			// this.orgData.vulnerableSectorCategoryDesc = EmployeeInteractionTypes.find(
			// 	(item) => item.code == this.orgData.worksWith
			// )?.desc as string;
		} else {
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		console.debug('orgData', this.orgData);

		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.log(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin(CrcRoutes.path());

		if (authInfo.loggedIn) {
			if (authInfo.state) {
				const stateInfo = this.utilService.getSessionData(this.utilService.CRC_PORTAL_STATE_KEY);
				console.debug('[CrcComponent.ngOnInit] stateInfo', stateInfo);
				if (stateInfo) {
					this.postLoginNavigate(stateInfo);
				}
			} else {
				this.router.navigateByUrl(CrcRoutes.path());
			}
		}
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

	onReEditCrcData(): void {
		this.stepper.selectedIndex = 1;
		this.stepPersonalInfoComponent.childstepper.selectedIndex = 0;
	}

	onGetCrcData(): void {
		this.crcData = { ...this.orgData, ...this.getDataToSave() };
	}

	onStepSelectionChange(_event: StepperSelectionEvent) {
		this.onScrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		const stepIndex = stepper.selectedIndex;
		if (stepIndex == 3 && this.authenticationService.isLoggedIn()) {
			// Go to Step 2
			this.stepper.selectedIndex = 1;
			return;
		}

		stepper.previous();
	}

	onNextStepperStep(stepper: MatStepper): void {
		// complete the current step
		if (stepper?.selected) stepper.selected.completed = true;

		const stepIndex = stepper.selectedIndex;

		if (stepIndex == 1 && this.authenticationService.isLoggedIn()) {
			// Mark Step 2 (Log In) as complete
			const stepLogin = this.stepper.steps.get(2);
			if (stepLogin) {
				stepLogin.completed = true;
			}

			const stateInfo = JSON.stringify({ ...this.getDataToSave() });
			this.currentStateInfo = JSON.parse(stateInfo);
			this.utilService.setSessionData(this.utilService.CRC_PORTAL_STATE_KEY, stateInfo);

			// Go to Step 43
			this.stepper.selectedIndex = 3;
			return;
		} else if (stepIndex == 3) {
			// make these steps uneditable...
			// so that after save, user cannot navigate to any of these steps
			for (let i = 0; i <= stepper.selectedIndex; i++) {
				let step = this.stepper.steps.get(i);
				if (step) {
					step.editable = false;
				}
			}
		}

		this.stepper.next();
	}

	async onRegisterWithBcServicesCard(): Promise<void> {
		const stateInfo = JSON.stringify({ ...this.getDataToSave() });

		//auth step 2 - unload angular, redirect to KC
		// const decodedData = decodeURIComponent(authInfo.state);
		this.utilService.setSessionData(this.utilService.CRC_PORTAL_STATE_KEY, stateInfo);
		const nextUrl = await this.authenticationService.login(CrcRoutes.path(CrcRoutes.CRCA));
		if (nextUrl) {
			// User is already logged in and clicks Login button.
			// Want it to start at the beginning and continue past login page.
			this.postLoginNavigate(stateInfo);
		}
	}

	private postLoginNavigate(stepperData: any): void {
		this.currentStateInfo = JSON.parse(stepperData);

		let step = this.stepper.steps.get(0);
		if (step) {
			step.completed = true;
		}

		step = this.stepper.steps.get(1);
		if (step) {
			if (this.stepOrganizationInfoComponent) {
				this.stepOrganizationInfoComponent.setStepData(this.currentStateInfo);
			}
			step.completed = true;
		}

		step = this.stepper.steps.get(2);
		if (step) {
			step.completed = true;
		}

		this.stepper.selectedIndex = 3;
	}

	onSaveStepperStep(stepper: MatStepper): void {
		if (stepper?.selected) stepper.selected.completed = true;

		// make these steps uneditable...
		// so that after save, user cannot navigate to any of these steps
		for (let i = 0; i <= 4; i++) {
			let step = this.stepper.steps.get(i);
			if (step) {
				step.editable = false;
			}
		}

		const data = this.getDataToSave();
		const createRequest: any = { ...data } as Parameters<
			ApplicationService['apiOrgsOrgIdApplicationPost']
		>[0]['body']['ApplicationCreateRequestJson'];
		console.log('onSaveStepperStep createRequest', data);

		this.stepper.next();
	}

	private getDataToSave(): any {
		let dataToSave = { ...this.orgData };
		if (this.stepOrganizationInfoComponent) {
			dataToSave = { ...dataToSave, ...this.stepOrganizationInfoComponent.getStepData() };
		}
		if (this.stepPersonalInfoComponent) {
			dataToSave = { ...dataToSave, ...this.stepPersonalInfoComponent.getStepData() };
		}
		if (this.stepTermsAndCondComponent) {
			dataToSave = { ...dataToSave, ...this.stepTermsAndCondComponent.getStepData() };
		}
		console.debug('getDataToSave', dataToSave);
		return dataToSave;
	}

	private breakpointChanged() {
		if (this.breakpointObserver.isMatched(Breakpoints.XLarge) || this.breakpointObserver.isMatched(Breakpoints.Large)) {
			this.orientation = 'horizontal';
		} else {
			this.orientation = 'vertical';
		}
	}
}
