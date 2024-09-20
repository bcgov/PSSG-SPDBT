import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { StepperOrientation, StepperSelectionEvent } from '@angular/cdk/stepper';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Observable, distinctUntilChanged, tap } from 'rxjs';
import {
	ApplicantAppCreateRequest,
	ApplicationCreateResponse,
	PaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	ServiceTypeCode,
	ShareableClearanceResponse,
} from 'src/app/api/models';
import { ApplicantService, PaymentService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UtilService } from 'src/app/core/services/util.service';
import { SaStepApplSubmittedComponent } from 'src/app/shared/components/screening-application-steps/sa-step-appl-submitted.component';
import { SaStepEligibilityComponent } from 'src/app/shared/components/screening-application-steps/sa-step-eligibility.component';
import { SaStepLoginOptionsComponent } from 'src/app/shared/components/screening-application-steps/sa-step-login-options.component';
import { SaStepOrganizationInfoComponent } from 'src/app/shared/components/screening-application-steps/sa-step-organization-info.component';
import { SaStepPersonalInfoComponent } from 'src/app/shared/components/screening-application-steps/sa-step-personal-info.component';
import { SaStepTermsAndCondComponent } from 'src/app/shared/components/screening-application-steps/sa-step-terms-and-cond.component';
import { AppInviteOrgData } from 'src/app/shared/components/screening-application-steps/screening-application.model';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';

@Component({
	selector: 'app-crrpa',
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
					<ng-template matStepLabel>Checklist</ng-template>
					<app-sa-step-eligibility
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-sa-step-eligibility>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Organization Information</ng-template>
					<app-sa-step-organization-info
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-sa-step-organization-info>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Log In</ng-template>
					<app-sa-step-login-options
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						(registerWithBcServicesCard)="onRegisterWithBcServicesCard()"
						[portal]="portal.Crrp"
					></app-sa-step-login-options>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Personal Information</ng-template>
					<app-sa-step-personal-info
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onNextStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						(reEditCrcData)="onReEditCrcData()"
						(getCrcData)="onUpdateOrgData()"
						[orgData]="orgData"
					></app-sa-step-personal-info>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Terms and Conditions</ng-template>
					<app-sa-step-terms-and-cond
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(nextStepperStep)="onSaveStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-sa-step-terms-and-cond>
				</mat-step>

				<mat-step completed="false">
					<ng-template matStepLabel>Application Submitted</ng-template>
					<app-sa-step-appl-submitted
						[emailAddress]="sendToEmailAddress"
						(previousStepperStep)="onPreviousStepperStep(stepper)"
						(scrollIntoView)="onScrollIntoView()"
						[orgData]="orgData"
					></app-sa-step-appl-submitted>
				</mat-step>
			</mat-stepper>
		</div>
	`,
	styles: [],
})
export class CrrpaComponent implements OnInit {
	readonly STEP_ELIGIBILITY = 0; // needs to be zero based because 'selectedIndex' is zero based
	readonly STEP_ORG_INFO = 1;
	readonly STEP_LOGIN = 2;
	readonly STEP_PERSONAL_INFO = 3;
	readonly STEP_TERMS_AND_COND = 4;

	orgData: AppInviteOrgData | null = null;
	portal = PortalTypeCode;

	sendToEmailAddress: string | null = null;

	orientation: StepperOrientation = 'vertical';
	currentStateInfo: any = {};

	@ViewChild('stepper') stepper!: MatStepper;

	@ViewChild(SaStepEligibilityComponent)
	stepEligibilityComponent!: SaStepEligibilityComponent;

	@ViewChild(SaStepApplSubmittedComponent)
	stepApplSubmittedComponent!: SaStepApplSubmittedComponent;

	@ViewChild(SaStepLoginOptionsComponent)
	stepLoginOptionsComponent!: SaStepLoginOptionsComponent;

	@ViewChild(SaStepOrganizationInfoComponent)
	stepOrganizationInfoComponent!: SaStepOrganizationInfoComponent;

	@ViewChild(SaStepPersonalInfoComponent)
	stepPersonalInfoComponent!: SaStepPersonalInfoComponent;

	@ViewChild(SaStepTermsAndCondComponent)
	stepTermsAndCondComponent!: SaStepTermsAndCondComponent;

	constructor(
		private router: Router,
		private breakpointObserver: BreakpointObserver,
		private utilService: UtilService,
		private formatDatePipe: FormatDatePipe,
		private authenticationService: AuthenticationService,
		private authProcessService: AuthProcessService,
		private authUserService: AuthUserBcscService,
		private applicantService: ApplicantService,
		private paymentService: PaymentService,
		private location: Location
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

		const orgData = (this.location.getState() as any).crrpaOrgData;
		if (orgData) {
			orgData.orgAddress = this.utilService.getAddressString({
				addressLine1: orgData.orgAddressLine1 ?? '',
				addressLine2: orgData.orgAddressLine2 ?? '',
				city: orgData.orgCity ?? '',
				province: orgData.orgProvince ?? '',
				postalCode: orgData.orgPostalCode ?? '',
				country: orgData.orgCountry ?? '',
			});

			orgData.isCrrpa = true;
			orgData.notPssoOrPecrc = true;
			orgData.bcGovEmployeeIdShow = false;
			orgData.performPaymentProcess = false; //default
			orgData.readonlyTombstone = false; // default
		}

		const stateInfo = await this.authProcessService.tryInitializeCrrpa();
		if (stateInfo) {
			this.postLoginNavigate(stateInfo);
		} else {
			if (orgData) {
				// If already logged in, get the shareable information
				if (this.authenticationService.isLoggedIn()) {
					this.populateShareableClearance(orgData.orgId, orgData.serviceType).subscribe();
				}

				this.assignApplicantUserInfoData(orgData);
			}

			// Assign this at the end so that the orgData setters have the correct information.
			this.orgData = orgData;
		}

		if (!this.orgData) {
			console.debug('CrcComponent - missing orgData');
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
		this.stepPersonalInfoComponent.childstepper.selectedIndex = 1;
	}

	onUpdateOrgData(): void {
		this.orgData = { ...this.orgData, ...this.getDataToSave() };
	}

	onStepSelectionChange(event: StepperSelectionEvent) {
		switch (event.selectedIndex) {
			case this.STEP_ORG_INFO:
				this.stepOrganizationInfoComponent?.onGoToFirstStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepPersonalInfoComponent?.onGoToFirstStep();
				break;
			case this.STEP_TERMS_AND_COND:
				this.stepTermsAndCondComponent?.onGoToFirstStep();
				break;
		}

		this.onScrollIntoView();
	}

	onPreviousStepperStep(stepper: MatStepper): void {
		const stepIndex = stepper.selectedIndex;
		if (stepIndex == 3 && this.authenticationService.isLoggedIn()) {
			// Go to Step 2
			this.stepper.selectedIndex = 1;
			this.stepOrganizationInfoComponent?.onGoToLastStep();
			return;
		}

		stepper.previous();

		switch (stepper.selectedIndex) {
			case this.STEP_ORG_INFO:
				this.stepOrganizationInfoComponent?.onGoToLastStep();
				break;
			case this.STEP_PERSONAL_INFO:
				this.stepPersonalInfoComponent?.onGoToLastStep();
				break;
			case this.STEP_TERMS_AND_COND:
				this.stepTermsAndCondComponent?.onGoToLastStep();
				break;
		}
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

			// Go to Step 4
			this.stepper.selectedIndex = 3;
			return;
		}

		this.stepper.next();
	}

	async onRegisterWithBcServicesCard(): Promise<void> {
		const stateInfo = JSON.stringify({ ...this.getDataToSave() });

		//auth step 2 - unload angular, redirect to KC
		// const decodedData = decodeURIComponent(authInfo.state);
		this.utilService.setSessionData(this.utilService.CRRPA_PORTAL_STATE_KEY, stateInfo);

		const nextUrl = await this.authProcessService.initializeCrrpa();
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
						this.orgData!.agreeToShareCrc = false;
					}
				})
			);
	}

	private postLoginNavigate(stepperData: any): void {
		this.currentStateInfo = JSON.parse(stepperData);
		console.debug('stepperData', stepperData);

		const orgData = JSON.parse(stepperData);
		this.assignApplicantUserInfoData(orgData);

		// Assign this at the end so that the orgData setters have the correct information.
		this.orgData = orgData;

		this.populateShareableClearance(orgData.orgId, orgData.serviceType).subscribe(
			(_resp: ShareableClearanceResponse) => {
				for (let i = 0; i <= 2; i++) {
					const step = this.stepper.steps.get(i);
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
			const step = this.stepper.steps.get(i);
			if (step) {
				step.editable = false;
			}
		}

		const dataToSave = this.getDataToSave();
		const body: ApplicantAppCreateRequest = dataToSave;
		body.genderCode = dataToSave.genderCode ? dataToSave.genderCode : null;
		body.dateOfBirth = this.formatDatePipe.transform(body.dateOfBirth, SPD_CONSTANTS.date.backendDateFormat);
		console.debug('[onSaveStepperStep] dataToSave', body);

		this.sendToEmailAddress = body.emailAddress ?? null;

		if (this.authenticationService.isLoggedIn()) {
			body.haveVerifiedIdentity = true;
			this.applicantService
				.apiApplicantsScreeningsPost({ body })
				.pipe()
				.subscribe((res: ApplicationCreateResponse) => {
					if (this.orgData!.performPaymentProcess) {
						this.payNow(res.applicationId!);
					} else {
						this.stepper.next();
					}
				});
		} else {
			body.haveVerifiedIdentity = false;
			this.applicantService
				.apiApplicantsScreeningsAnonymousPost({ body })
				.pipe()
				.subscribe((res: ApplicationCreateResponse) => {
					if (this.orgData!.performPaymentProcess) {
						this.payNow(res.applicationId!);
					} else {
						this.stepper.next();
					}
				});
		}
	}

	private payNow(applicationId: string): void {
		if (this.authenticationService.isLoggedIn()) {
			this.authProcessService.refreshToken();
		}

		const body: PaymentLinkCreateRequest = {
			applicationId: applicationId,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: 'Payment for Case',
		};
		this.paymentService
			.apiCrrpaPaymentLinkPost({
				body,
			})
			.pipe()
			.subscribe((res: PaymentLinkResponse) => {
				if (res.paymentLinkUrl) {
					window.location.assign(res.paymentLinkUrl);
				}
			});
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
