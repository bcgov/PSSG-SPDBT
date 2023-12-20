import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserApplicationsAnonymousComponent } from './components/anonymous/user-applications-anonymous.component';
import { StepLicenceAccessCodeAnonymousComponent } from './components/anonymous/wizard-steps/step-licence-access-code-anonymous.component';
import { StepApplicationTypeAnonymousComponent } from './components/anonymous/wizard-steps/step-application-type-anonymous.component';
import { StepLicenceTypeAnonymousComponent } from './components/anonymous/wizard-steps/step-licence-type-anonymous.component';
import { WorkerLicenceNewWizardAnonymousComponent } from './components/anonymous/worker-licence-new-wizard-anonymous.component';
import { WorkerLicenceRenewalWizardAnonymousComponent } from './components/anonymous/worker-licence-renewal-wizard-anonymous.component';
import { WorkerLicenceReplacementWizardAnonymousComponent } from './components/anonymous/worker-licence-replacement-wizard-anonymous.component';
import { WorkerLicenceUpdateWizardAnonymousComponent } from './components/anonymous/worker-licence-update-wizard-anonymous.component';
import { LoginUserProfileComponent } from './components/authenticated/login-user-profile.component';
import { SecurityWorkerLicenceWizardNewAuthenticatedComponent } from './components/authenticated/security-worker-licence-wizard-new-authenticated.component';
import { SecurityWorkerLicenceWizardUpdateAuthenticatedComponent } from './components/authenticated/security-worker-licence-wizard-update-authenticated.component';
import { UserApplicationsAuthenticatedComponent } from './components/authenticated/user-applications-authenticated.component';
import { StepAccessCodeAuthorizedComponent } from './components/authenticated/wizard-steps/step-access-code-authorized.component';
import { StepApplicationTypeAuthenticatedComponent } from './components/authenticated/wizard-steps/step-application-type-authenticated.component';
import { StepLicenceTypeAuthenticatedComponent } from './components/authenticated/wizard-steps/step-licence-type-authenticated.component';
import { LoginSelectionComponent } from './components/login-selection.component';
import { SecurityWorkerLicenceApplicationComponent } from './components/security-worker-licence-application.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentManualComponent } from './components/shared/licence-payment-manual.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { StepLicenceUserProfileComponent } from './components/shared/wizard-child-steps/step-licence-user-profile.component';
import { LicenceApplicationComponent } from './licence-application.component';

export class LicenceApplicationRoutes {
	public static LICENCE_APPLICATION = 'licence-application';

	public static LOGIN_SELECTION = 'login-selection';

	public static USER_APPLICATIONS_AUTHENTICATED = 'user-applications';
	public static APPLICATION_AUTHENTICATED = 'applications';
	public static WORKER_LICENCE_NEW_AUTHENTICATED = 'worker-licence-new';
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

	public static LICENCE_UPDATE = 'licence-update';
	public static LICENCE_LINK = 'licence-link';
	public static LOGIN_USER_PROFILE = 'user-profile';

	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_MANUAL = 'payment-manual';
	public static PAYMENT_ERROR = 'payment-error';

	public static MODULE_PATH = LicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceApplicationRoutes.MODULE_PATH}/${route}` : `/${LicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathUserApplications(): string {
		return `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED}`;
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
				// ANONYMOUS
				path: LicenceApplicationRoutes.APPLICATION_ANONYMOUS,
				component: SecurityWorkerLicenceApplicationComponent,
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
						component: StepLicenceAccessCodeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS,
						component: WorkerLicenceNewWizardAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_ANONYMOUS,
						component: WorkerLicenceRenewalWizardAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_ANONYMOUS,
						component: WorkerLicenceReplacementWizardAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_ANONYMOUS,
						component: WorkerLicenceUpdateWizardAnonymousComponent,
					},
					{
						path: '',
						component: UserApplicationsAnonymousComponent,
					},
				],
			},
			{
				path: LicenceApplicationRoutes.LICENCE_LINK,
				component: StepAccessCodeAuthorizedComponent,
			},
			{
				path: LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED,
				component: UserApplicationsAuthenticatedComponent,
			},
			{
				// SWL - NEW - AUTHORIZED
				path: LicenceApplicationRoutes.APPLICATION_AUTHENTICATED,
				component: SecurityWorkerLicenceApplicationComponent,
				children: [
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
						path: LicenceApplicationRoutes.LICENCE_UPDATE,
						component: SecurityWorkerLicenceWizardUpdateAuthenticatedComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED,
						component: SecurityWorkerLicenceWizardNewAuthenticatedComponent,
					},
					{
						path: '',
						component: UserApplicationsAuthenticatedComponent,
					},
				],
			},
			{ path: `${LicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`, component: LicencePaymentSuccessComponent },
			{ path: `${LicenceApplicationRoutes.PAYMENT_FAIL}/:id`, component: LicencePaymentFailComponent },
			{ path: LicenceApplicationRoutes.PAYMENT_MANUAL, component: LicencePaymentManualComponent },
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
