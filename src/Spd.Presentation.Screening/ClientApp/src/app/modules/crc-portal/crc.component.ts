import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import {
	ApplicantAppCreateRequest,
	ApplicationCreateResponse,
	EmployeeInteractionTypeCode,
	ServiceTypeCode,
	ShareableClearanceItem,
	ShareableClearanceResponse,
} from 'src/app/api/models';
import { ApplicantService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
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

export interface AppInviteOrgData extends ApplicantAppCreateRequest {
	orgAddress?: string | null; // for display
	readonlyTombstone?: boolean | null; // logic for screens - SPDBT-1272
	performPaymentProcess?: boolean | null;
	previousNameFlag?: boolean | null;
	shareableCrcExists?: boolean | null;
	shareableClearanceItem?: ShareableClearanceItem | null;
	recaptcha?: string | null;
	orgEmail?: null | string; // from AppInviteVerifyResponse
	orgId?: string; // from AppInviteVerifyResponse
	orgName?: null | string; // from AppInviteVerifyResponse
	orgPhoneNumber?: null | string; // from AppInviteVerifyResponse
	orgAddressLine1?: null | string; // from AppInviteVerifyResponse
	orgAddressLine2?: null | string; // from AppInviteVerifyResponse
	orgCity?: null | string; // from AppInviteVerifyResponse
	orgCountry?: null | string; // from AppInviteVerifyResponse
	orgPostalCode?: null | string; // from AppInviteVerifyResponse
	orgProvince?: null | string; // from AppInviteVerifyResponse
	worksWith?: EmployeeInteractionTypeCode; // from AppInviteVerifyResponse
}

@Component({
	selector: 'app-crc',
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
					<ng-template matStepLabel>Eligibility Check</ng-template>
					<app-step-eligibility
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
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
						(getCrcData)="onUpdateOrgData()"
						[orgData]="orgData"
					></app-step-personal-info>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Terms and Conditions</ng-template>
					<app-step-terms-and-cond
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onSaveStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-step-terms-and-cond>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Application Submitted</ng-template>
					<app-step-appl-submitted
						[performPayment]="orgData?.performPaymentProcess ?? false"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
					></app-step-appl-submitted>
				</mat-step>

				<!-- PAYMENT PROCESS?
 <mat-step completed="false" *ngIf="payeeType == payeePreferenceTypeCodes.Applicant">
<ng-template matStepLabel>Pay for Application</ng-template>
<app-step-pay-for-application
	(nextStepperStep)="onNextStepperStep(stepper)"
	(scrollIntoView)="onScrollIntoView()"
></app-step-pay-for-application>
</mat-step> -->
			</mat-stepper>
		</div>
	`,
	styles: [],
})
export class CrcComponent implements OnInit {
	orgData: AppInviteOrgData | null = null;

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
		private authProcessService: AuthProcessService,
		private authUserService: AuthUserService,
		private applicantService: ApplicantService,
		private location: Location,
		private hotToast: HotToastService
	) {}

	async ngOnInit(): Promise<void> {
		this.breakpointObserver
			.observe([Breakpoints.Large, Breakpoints.Medium, Breakpoints.Small, '(min-width: 500px)'])
			.pipe(
				// tap((value) => console.log(value)),
				distinctUntilChanged()
			)
			.subscribe(() => this.breakpointChanged());

		// Parameter must be orgData or accessCode

		const orgData = (this.location.getState() as any).crcaOrgData;
		if (orgData) {
			orgData.orgAddress = this.utilService.getAddressString({
				addressLine1: orgData.orgAddressLine1!,
				addressLine2: orgData.orgAddressLine2 ?? undefined,
				city: orgData.orgCity!,
				province: orgData.orgProvince!,
				postalCode: orgData.orgPostalCode!,
				country: orgData.orgCountry!,
			});

			orgData.performPaymentProcess = false; // TODO hardcode  performPaymentProcess for now
			orgData.readonlyTombstone = false; // TODO hardcode readonlyTombstone for now
		}

		const stateInfo = await this.authProcessService.tryInitializeCrc();
		if (stateInfo) {
			this.postLoginNavigate(stateInfo);
		} else {
			this.assignApplicantUserInfoData(orgData);

			// Assign this at the end so that the orgData setters have the correct information.
			this.orgData = orgData;
		}

		if (!this.orgData) {
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
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

	onUpdateOrgData(): void {
		this.orgData = { ...this.orgData, ...this.getDataToSave() };
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

			// const stateInfo = JSON.stringify({ ...this.getDataToSave() });
			// this.currentStateInfo = JSON.parse(stateInfo);
			// this.utilService.setSessionData(this.utilService.CRC_PORTAL_STATE_KEY, stateInfo);

			// Go to Step 4
			this.stepper.selectedIndex = 3;
		}

		this.stepper.next();
	}

	async onRegisterWithBcServicesCard(): Promise<void> {
		const stateInfo = JSON.stringify({ ...this.getDataToSave() });

		//auth step 2 - unload angular, redirect to KC
		// const decodedData = decodeURIComponent(authInfo.state);
		this.utilService.setSessionData(this.utilService.CRC_PORTAL_STATE_KEY, stateInfo);

		const nextUrl = await this.authProcessService.initializeCrc();
		if (nextUrl) {
			// User is already logged in and clicks Login button.
			// Want it to start at the beginning and continue past login page.
			this.postLoginNavigate(stateInfo);
		}
	}

	private populateShareableClearance(
		orgId: string,
		serviceType: ServiceTypeCode
	): Observable<ShareableClearanceResponse> {
		return this.applicantService
			.apiApplicantsClearancesShareableGet({
				withOrgId: orgId,
				serviceType: serviceType,
			})
			.pipe(
				tap((resp: ShareableClearanceResponse) => {
					const shareableClearanceItem = resp?.items ? resp.items[0] : null;
					if (shareableClearanceItem) {
						this.orgData!.shareableClearanceItem = shareableClearanceItem;
						this.orgData!.shareableCrcExists = true;
						this.orgData!.sharedClearanceId = shareableClearanceItem.clearanceId;
					} else {
						this.orgData!.agreeToShare = false;
					}
				})
			);
	}

	private postLoginNavigate(stepperData: any): void {
		this.currentStateInfo = JSON.parse(stepperData);
		console.log('stepperData', stepperData);

		const orgData = JSON.parse(stepperData);
		this.assignApplicantUserInfoData(orgData);

		// Assign this at the end so that the orgData setters have the correct information.
		this.orgData = orgData;

		this.populateShareableClearance(orgData.orgId, orgData.serviceType).subscribe(
			(_resp: ShareableClearanceResponse) => {
				for (let i = 0; i <= 2; i++) {
					let step = this.stepper.steps.get(i);
					if (step) {
						step.completed = true;
					}
				}

				this.stepper.selectedIndex = 3;
			}
		);
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

		const dataToSave = this.getDataToSave();
		const body: ApplicantAppCreateRequest = dataToSave;
		body.genderCode = dataToSave.genderCode ? dataToSave.genderCode : null;
		console.debug('[onSaveStepperStep] dataToSave', body);

		if (this.authenticationService.isLoggedIn()) {
			body.haveVerifiedIdentity = true;
			this.applicantService
				.apiApplicantsScreeningsPost({ body })
				.pipe()
				.subscribe((_res: ApplicationCreateResponse) => {
					this.hotToast.success('Application was successfully saved');
					this.stepper.next();
				});
		} else {
			body.haveVerifiedIdentity = false;
			this.applicantService
				.apiApplicantsScreeningsAnonymousPost({ body })
				.pipe()
				.subscribe((_res: ApplicationCreateResponse) => {
					this.hotToast.success('Application was successfully saved');
					this.stepper.next();
				});
		}
	}

	private assignApplicantUserInfoData(orgData: AppInviteOrgData | null): void {
		const bcscUserInfoProfile = this.authUserService.bcscUserInfoProfile;

		if (orgData && bcscUserInfoProfile) {
			orgData.readonlyTombstone = true;
			orgData.givenName = bcscUserInfoProfile?.firstName;
			orgData.surname = bcscUserInfoProfile?.lastName;
			orgData.middleName1 = bcscUserInfoProfile?.middleName1;
			orgData.middleName2 = bcscUserInfoProfile?.middleName2;
			orgData.dateOfBirth = bcscUserInfoProfile?.birthDate;
			orgData.emailAddress = bcscUserInfoProfile?.email;
			orgData.genderCode = bcscUserInfoProfile?.genderCode;
		}
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
