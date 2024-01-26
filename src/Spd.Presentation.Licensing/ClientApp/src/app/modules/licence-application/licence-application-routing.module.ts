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
import { StepApplicationTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-application-type-anonymous.component';
import { StepLicenceAccessCodeComponent } from './components/anonymous/worker-licence-wizard-steps/step-licence-access-code.component';
import { StepLicenceTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-licence-type-anonymous.component';
import { LoginUserProfileComponent } from './components/authenticated/login-user-profile.component';
import { UserApplicationsAuthenticatedComponent } from './components/authenticated/user-applications-authenticated.component';
import { WorkerLicenceApplicationBaseAuthenticatedComponent } from './components/authenticated/worker-licence-application-base-authenticated.component';
import { WorkerLicenceWizardAuthenticatedNewComponent } from './components/authenticated/worker-licence-wizard-authenticated-new.component';
import { WorkerLicenceWizardAuthenticatedRenewComponent } from './components/authenticated/worker-licence-wizard-authenticated-renew.component';
import { WorkerLicenceWizardAuthenticatedUpdateComponent } from './components/authenticated/worker-licence-wizard-authenticated-update.component';
import { StepApplicationTypeAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-application-type-authenticated.component';
import { StepLicenceAccessCodeAuthorizedComponent } from './components/authenticated/worker-licence-wizard-steps/step-licence-access-code-authorized.component';
import { StepLicenceTypeAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-licence-type-authenticated.component';
import { LicencePaymentCancelComponent } from './components/shared/licence-payment-cancel.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { LoginSelectionComponent } from './components/shared/login-selection.component';
import { StepLicenceUserProfileComponent } from './components/shared/worker-licence-wizard-steps/step-licence-user-profile.component';
import { LicenceApplicationComponent } from './licence-application.component';

export class LicenceApplicationRoutes {
	public static LICENCE_APPLICATION = 'licensing';

	public static LOGIN_SELECTION = 'login-selection';

	public static USER_APPLICATIONS_AUTHENTICATED = 'applications';
	public static APPLICATION_AUTHENTICATED = 'user';
	public static WORKER_LICENCE_NEW_AUTHENTICATED = 'worker-licence-new';
	public static WORKER_LICENCE_RENEW_AUTHENTICATED = 'worker-licence-renew';
	public static WORKER_LICENCE_UPDATE_AUTHENTICATED = 'worker-licence-update';
	public static LICENCE_USER_PROFILE_AUTHENTICATED = 'licence-user-profile';
	public static LICENCE_SELECTION_AUTHENTICATED = 'licence-selection';
	public static LICENCE_APPLICATION_TYPE_AUTHENTICATED = 'licence-application-type';

	public static APPLICATION_ANONYMOUS = 'applications-anonymous';
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

	public static LICENCE_LINK = 'licence-link';
	public static LOGIN_USER_PROFILE = 'user-profile';

	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_CANCEL = 'payment-cancel';
	public static PAYMENT_ERROR = 'payment-error';

	public static MODULE_PATH = LicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceApplicationRoutes.MODULE_PATH}/${route}` : `/${LicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathUserApplications(): string {
		return `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_AUTHENTICATED}/${LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED}`;
	}

	public static pathSecurityWorkerLicenceAuthenticated(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_AUTHENTICATED}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_AUTHENTICATED}`;
	}

	public static pathSecurityWorkerLicenceAnonymous(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_ANONYMOUS}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_ANONYMOUS}`;
	}

	public static pathPermitAnonymous(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.PERMIT_ANONYMOUS}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.PERMIT_ANONYMOUS}`;
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
				// SECURITY WORKER LICENCE - ANONYMOUS
				path: LicenceApplicationRoutes.APPLICATION_ANONYMOUS,
				component: WorkerLicenceApplicationBaseAnonymousComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_SELECTION_ANONYMOUS,
						component: StepLicenceTypeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS,
						component: StepApplicationTypeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_ACCESS_CODE_ANONYMOUS,
						component: StepLicenceAccessCodeComponent,
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
						component: StepLicenceTypeAnonymousComponent,
					},
				],
			},
			{
				// PERMIT - ANONYMOUS
				path: LicenceApplicationRoutes.PERMIT_ANONYMOUS,
				component: PermitApplicationBaseAnonymousComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_SELECTION_ANONYMOUS,
						component: StepLicenceTypeAnonymousComponent,
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
						component: StepLicenceTypeAnonymousComponent,
					},
				],
			},
			{
				// SWL - NEW - AUTHORIZED
				path: LicenceApplicationRoutes.APPLICATION_AUTHENTICATED,
				component: WorkerLicenceApplicationBaseAuthenticatedComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_LINK,
						component: StepLicenceAccessCodeAuthorizedComponent,
					},
					{
						path: LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED,
						component: UserApplicationsAuthenticatedComponent,
					},
					{
						path: LicenceApplicationRoutes.LOGIN_USER_PROFILE,
						component: LoginUserProfileComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_USER_PROFILE_AUTHENTICATED,
						component: StepLicenceUserProfileComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_SELECTION_AUTHENTICATED,
						component: StepLicenceTypeAuthenticatedComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_AUTHENTICATED,
						component: StepApplicationTypeAuthenticatedComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedUpdateComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedNewComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_RENEW_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedRenewComponent,
					},
					{
						path: '',
						component: UserApplicationsAuthenticatedComponent,
					},
				],
			},
			{ path: `${LicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`, component: LicencePaymentSuccessComponent },
			{ path: `${LicenceApplicationRoutes.PAYMENT_FAIL}/:id`, component: LicencePaymentFailComponent },
			{ path: `${LicenceApplicationRoutes.PAYMENT_CANCEL}/:id`, component: LicencePaymentCancelComponent },
			{ path: LicenceApplicationRoutes.PAYMENT_ERROR, component: LicencePaymentErrorComponent },
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
