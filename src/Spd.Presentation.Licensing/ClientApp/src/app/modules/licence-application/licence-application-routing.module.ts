import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitApplicationBaseAnonymousComponent } from './components/anonymous/permit-application-base-anonymous.component';
import { PermitWizardAnonymousNewComponent } from './components/anonymous/permit-wizard-anonymous-new.component';
import { PermitWizardAnonymousRenewalComponent } from './components/anonymous/permit-wizard-anonymous-renewal.component';
import { PermitWizardAnonymousUpdateComponent } from './components/anonymous/permit-wizard-anonymous-update.component';
import { StepPermitAccessCodeComponent } from './components/anonymous/permit-wizard-steps/step-permit-access-code.component';
import { StepPermitTypeAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-type-anonymous.component';
import { WorkerLicenceApplicationBaseAnonymousComponent } from './components/anonymous/worker-licence-application-base-anonymous.component';
import { WorkerLicenceWizardAnonymousNewComponent } from './components/anonymous/worker-licence-wizard-anonymous-new.component';
import { WorkerLicenceWizardAnonymousRenewalComponent } from './components/anonymous/worker-licence-wizard-anonymous-renewal.component';
import { WorkerLicenceWizardAnonymousReplacementComponent } from './components/anonymous/worker-licence-wizard-anonymous-replacement.component';
import { WorkerLicenceWizardAnonymousUpdateComponent } from './components/anonymous/worker-licence-wizard-anonymous-update.component';
import { StepWorkerLicenceAccessCodeComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-access-code.component';
import { StepWorkerLicenceApplicationTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-application-type-anonymous.component';
import { StepWorkerLicenceTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-type-anonymous.component';
import { LicenceAccessCodeAuthorizedComponent } from './components/authenticated/licence-access-code-authorized.component';
import { LicenceApplicationBaseAuthenticatedComponent } from './components/authenticated/licence-application-base-authenticated.component';
import { LicenceFirstTimeUserSelectionComponent } from './components/authenticated/licence-first-time-user-selection.component';
import { LicenceFirstTimeUserTermsOfUseComponent } from './components/authenticated/licence-first-time-user-terms-of-use.component';
import { LicenceUserApplicationsComponent } from './components/authenticated/licence-user-applications.component';
import { LoginUserProfileComponent } from './components/authenticated/login-user-profile.component';
import { PermitWizardAuthenticatedNewComponent } from './components/authenticated/permit-wizard-authenticated-new.component';
import { PermitWizardAuthenticatedRenewalComponent } from './components/authenticated/permit-wizard-authenticated-renewal.component';
import { PermitWizardAuthenticatedUpdateComponent } from './components/authenticated/permit-wizard-authenticated-update.component';
import { StepPermitUserProfileComponent } from './components/authenticated/permit-wizard-steps/step-permit-user-profile.component';
import { WorkerLicenceWizardAuthenticatedNewComponent } from './components/authenticated/worker-licence-wizard-authenticated-new.component';
import { WorkerLicenceWizardAuthenticatedRenewalComponent } from './components/authenticated/worker-licence-wizard-authenticated-renewal.component';
import { WorkerLicenceWizardAuthenticatedReplacementComponent } from './components/authenticated/worker-licence-wizard-authenticated-replacement.component';
import { WorkerLicenceWizardAuthenticatedUpdateComponent } from './components/authenticated/worker-licence-wizard-authenticated-update.component';
import { StepWorkerLicenceApplicationTypeAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-application-type-authenticated.component';
import { StepWorkerLicenceTypeAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-type-authenticated.component';
import { BusinessLicenceApplicationBaseComponent } from './components/business/business-licence-application-base.component';
import { BusinessLicenceWizardNewComponent } from './components/business/business-licence-wizard-new.component';
import { UserBusinessApplicationsComponent } from './components/business/user-business-applications.component';
import { LicencePaymentCancelComponent } from './components/shared/licence-payment-cancel.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { LicenceUpdateReceivedSuccessComponent } from './components/shared/licence-update-received-success.component';
import { LoginSelectionComponent } from './components/shared/login-selection.component';
import { StepWorkerLicenceUserProfileComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-user-profile.component';
import { LicenceApplicationComponent } from './licence-application.component';

export class LicenceApplicationRoutes {
	public static LICENCE_APPLICATION = 'licensing';

	public static LOGIN_SELECTION = 'login-selection';

	// AUTHENTICATED
	public static LICENCE_APPLICATION_AUTHENTICATED = 'user';
	public static LICENCE_USER_APPLICATIONS_AUTHENTICATED = 'applications';

	public static LICENCE_FIRST_TIME_USER_TERMS = 'terms-and-conditions';
	public static LICENCE_FIRST_TIME_USER_SELECTION = 'user-selection';
	public static LICENCE_LINK = 'licence-link';
	public static LICENCE_LOGIN_USER_PROFILE = 'user-profile';

	public static WORKER_LICENCE_USER_PROFILE_AUTHENTICATED = 'licence-user-profile';
	public static WORKER_LICENCE_SELECTION_AUTHENTICATED = 'licence-selection';
	public static WORKER_LICENCE_APPLICATION_TYPE_AUTHENTICATED = 'licence-application-type';

	public static PERMIT_USER_PROFILE_AUTHENTICATED = 'permit-user-profile';
	public static PERMIT_SELECTION_AUTHENTICATED = 'permit-selection';
	public static PERMIT_APPLICATION_TYPE_AUTHENTICATED = 'permit-application-type';

	public static PERMIT_NEW_AUTHENTICATED = 'permit-new';
	public static PERMIT_RENEWAL_AUTHENTICATED = 'permit-renew';
	public static PERMIT_UPDATE_AUTHENTICATED = 'permit-update';

	public static WORKER_LICENCE_NEW_AUTHENTICATED = 'worker-licence-new';
	public static WORKER_LICENCE_RENEWAL_AUTHENTICATED = 'worker-licence-renew';
	public static WORKER_LICENCE_UPDATE_AUTHENTICATED = 'worker-licence-update';
	public static WORKER_LICENCE_REPLACEMENT_AUTHENTICATED = 'worker-licence-replacement';

	public static BUSINESS_FIRST_TIME_USER_TERMS = 'terms-and-conditions';
	public static BUSINESS_BASE = 'business-licence';
	public static BUSINESS_NEW = 'business-new';
	public static BUSINESS_USER_APPLICATIONS = 'applications';
	public static BUSINESS_RENEW = 'business-renew';

	// ANONYMOUS
	public static LICENCE_APPLICATION_ANONYMOUS = 'applications-anonymous';
	public static LICENCE_SELECTION_ANONYMOUS = 'licence-selection';
	public static LICENCE_APPLICATION_TYPE_ANONYMOUS = 'licence-application-type';
	public static LICENCE_ACCESS_CODE_ANONYMOUS = 'licence-access-code';

	public static WORKER_LICENCE_NEW_ANONYMOUS = 'worker-licence-new';
	public static WORKER_LICENCE_RENEWAL_ANONYMOUS = 'worker-licence-renewal';
	public static WORKER_LICENCE_REPLACEMENT_ANONYMOUS = 'worker-licence-replacement';
	public static WORKER_LICENCE_UPDATE_ANONYMOUS = 'worker-licence-update';

	public static PERMIT_ANONYMOUS = 'permit-anonymous';
	public static PERMIT_ACCESS_CODE_ANONYMOUS = 'permit-access-code';
	public static PERMIT_TYPE_ANONYMOUS = 'permit-type';
	public static PERMIT_NEW_ANONYMOUS = 'permit-new';
	public static PERMIT_RENEWAL_ANONYMOUS = 'permit-renewal';
	public static PERMIT_UPDATE_ANONYMOUS = 'permit-update';

	// PAYMENT
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_CANCEL = 'payment-cancel';
	public static PAYMENT_ERROR = 'payment-error';
	public static UPDATE_SUCCESS = 'update-success';

	public static MODULE_PATH = LicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceApplicationRoutes.MODULE_PATH}/${route}` : `/${LicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathUserApplications(): string {
		return `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_APPLICATION_AUTHENTICATED}/${LicenceApplicationRoutes.LICENCE_USER_APPLICATIONS_AUTHENTICATED}`;
	}

	public static pathSecurityWorkerLicenceAuthenticated(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_APPLICATION_AUTHENTICATED}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_APPLICATION_AUTHENTICATED}`;
	}

	public static pathSecurityWorkerLicenceAnonymous(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_APPLICATION_ANONYMOUS}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_APPLICATION_ANONYMOUS}`;
	}

	public static pathPermitAnonymous(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.PERMIT_ANONYMOUS}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.PERMIT_ANONYMOUS}`;
	}

	public static pathPermitAuthenticated(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_APPLICATION_AUTHENTICATED}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_APPLICATION_AUTHENTICATED}`;
	}

	public static pathBusinessLicence(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.BUSINESS_BASE}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.BUSINESS_BASE}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: LicenceApplicationComponent,
		children: [
			{
				path: LicenceApplicationRoutes.LOGIN_SELECTION,
				component: LoginSelectionComponent,
			},
			{
				/**************************************************** */
				// SECURITY WORKER LICENCE - ANONYMOUS
				/**************************************************** */
				path: LicenceApplicationRoutes.LICENCE_APPLICATION_ANONYMOUS,
				component: WorkerLicenceApplicationBaseAnonymousComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_SELECTION_ANONYMOUS,
						component: StepWorkerLicenceTypeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS,
						component: StepWorkerLicenceApplicationTypeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_ACCESS_CODE_ANONYMOUS,
						component: StepWorkerLicenceAccessCodeComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS,
						component: WorkerLicenceWizardAnonymousNewComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_ANONYMOUS,
						component: WorkerLicenceWizardAnonymousRenewalComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_ANONYMOUS,
						component: WorkerLicenceWizardAnonymousReplacementComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_ANONYMOUS,
						component: WorkerLicenceWizardAnonymousUpdateComponent,
					},
					{
						path: '',
						component: StepWorkerLicenceTypeAnonymousComponent,
					},
				],
			},
			{
				/**************************************************** */
				// PERMIT - ANONYMOUS
				/**************************************************** */
				path: LicenceApplicationRoutes.PERMIT_ANONYMOUS,
				component: PermitApplicationBaseAnonymousComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_SELECTION_ANONYMOUS,
						component: StepWorkerLicenceTypeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_TYPE_ANONYMOUS,
						component: StepPermitTypeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_ACCESS_CODE_ANONYMOUS,
						component: StepPermitAccessCodeComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_NEW_ANONYMOUS,
						component: PermitWizardAnonymousNewComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_RENEWAL_ANONYMOUS,
						component: PermitWizardAnonymousRenewalComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_UPDATE_ANONYMOUS,
						component: PermitWizardAnonymousUpdateComponent,
					},
					{
						path: '',
						component: StepWorkerLicenceTypeAnonymousComponent,
					},
				],
			},
			{
				/**************************************************** */
				// BUSINESS AUTHENTICATED
				/**************************************************** */
				path: LicenceApplicationRoutes.BUSINESS_BASE,
				component: BusinessLicenceApplicationBaseComponent,
				children: [
					{
						path: LicenceApplicationRoutes.BUSINESS_FIRST_TIME_USER_TERMS,
						component: LicenceFirstTimeUserTermsOfUseComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_USER_APPLICATIONS,
						component: UserBusinessApplicationsComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_NEW,
						component: BusinessLicenceWizardNewComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_RENEW,
						component: BusinessLicenceWizardNewComponent,
					},
					{
						path: '',
						component: UserBusinessApplicationsComponent,
					},
				],
			},
			{
				/**************************************************** */
				// LICENCE AUTHENTICATED
				/**************************************************** */
				path: LicenceApplicationRoutes.LICENCE_APPLICATION_AUTHENTICATED,
				component: LicenceApplicationBaseAuthenticatedComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_TERMS,
						component: LicenceFirstTimeUserTermsOfUseComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_SELECTION,
						component: LicenceFirstTimeUserSelectionComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_LINK,
						component: LicenceAccessCodeAuthorizedComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_USER_APPLICATIONS_AUTHENTICATED,
						component: LicenceUserApplicationsComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_LOGIN_USER_PROFILE,
						component: LoginUserProfileComponent,
					},
					/**************************************************** */
					// SECURITY WORKER LICENCE AUTHENTICATED
					/**************************************************** */
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED,
						component: StepWorkerLicenceUserProfileComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_SELECTION_AUTHENTICATED,
						component: StepWorkerLicenceTypeAuthenticatedComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_APPLICATION_TYPE_AUTHENTICATED,
						component: StepWorkerLicenceApplicationTypeAuthenticatedComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedNewComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedUpdateComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedRenewalComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedReplacementComponent,
					},
					/**************************************************** */
					// PERMIT AUTHENTICATED
					/**************************************************** */
					{
						path: LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED,
						component: StepPermitUserProfileComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_NEW_AUTHENTICATED,
						component: PermitWizardAuthenticatedNewComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_UPDATE_AUTHENTICATED,
						component: PermitWizardAuthenticatedUpdateComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_RENEWAL_AUTHENTICATED,
						component: PermitWizardAuthenticatedRenewalComponent,
					},
					{
						path: '',
						component: LicenceUserApplicationsComponent,
					},
				],
			},
			/**************************************************** */
			// PAYMENT
			/**************************************************** */
			{ path: `${LicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`, component: LicencePaymentSuccessComponent },
			{ path: `${LicenceApplicationRoutes.PAYMENT_FAIL}/:id`, component: LicencePaymentFailComponent },
			{ path: `${LicenceApplicationRoutes.PAYMENT_CANCEL}/:id`, component: LicencePaymentCancelComponent },
			{ path: LicenceApplicationRoutes.PAYMENT_ERROR, component: LicencePaymentErrorComponent },
			{ path: LicenceApplicationRoutes.UPDATE_SUCCESS, component: LicenceUpdateReceivedSuccessComponent },
			{
				path: '',
				redirectTo: LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION),
				pathMatch: 'full',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LicenceApplicationRoutingModule {}
