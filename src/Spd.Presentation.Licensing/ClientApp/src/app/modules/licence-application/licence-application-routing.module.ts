import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicencePaymentErrorComponent } from './components/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/licence-payment-fail.component';
import { LicencePaymentManualComponent } from './components/licence-payment-manual.component';
import { LicencePaymentSuccessComponent } from './components/licence-payment-success.component';
import { LoginSelectionComponent } from './components/login-selection.component';
import { LoginUserProfileComponent } from './components/login-user-profile.component';
import { SecurityWorkerLicenceApplicationComponent } from './components/security-worker-licence-application.component';
import { SecurityWorkerLicenceWizardAnonymousComponent } from './components/security-worker-licence-wizard-anonymous.component';
import { SecurityWorkerLicenceWizardAuthenticatedComponent } from './components/security-worker-licence-wizard-authenticated.component';
import { SecurityWorkerLicenceWizardUpdateComponent } from './components/security-worker-licence-wizard-update.component';
import { UserApplicationsAnonymousComponent } from './components/user-applications-anonymous.component';
import { UserApplicationsAuthenticatedComponent } from './components/user-applications-authenticated.component';
import { LicenceApplicationComponent } from './licence-application.component';

export class LicenceApplicationRoutes {
	public static LICENCE_APPLICATION = 'licence-application';

	public static LOGIN_SELECTION = 'login-selection';

	public static USER_APPLICATIONS_AUTHENTICATED = 'user-applications';
	public static USER_APPLICATIONS_ANONYMOUS = 'user-applications-anonymous';

	public static APPLICATION_AUTHENTICATED = 'application';
	public static APPLICATION_ANONYMOUS = 'application-anonymous';

	public static LICENCE_UPDATE = 'licence-update';
	public static LOGIN_USER_PROFILE = 'user-profile';

	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_MANUAL = 'payment-manual';
	public static PAYMENT_ERROR = 'payment-error';

	public static MODULE_PATH = LicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceApplicationRoutes.MODULE_PATH}/${route}` : `/${LicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathSecurityWorkerLicenceApplications(): string {
		if (window.location.pathname.includes(LicenceApplicationRoutes.APPLICATION_ANONYMOUS)) {
			return `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.USER_APPLICATIONS_ANONYMOUS}`;
		}
		return `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED}`;
	}

	public static pathSecurityWorkerLicence(route: string | null = null): string {
		if (window.location.pathname.includes(LicenceApplicationRoutes.APPLICATION_ANONYMOUS)) {
			return route
				? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_ANONYMOUS}/${route}`
				: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_ANONYMOUS}`;
		}
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_AUTHENTICATED}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION_AUTHENTICATED}`;
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
				path: LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED,
				component: UserApplicationsAuthenticatedComponent,
			},
			{
				path: LicenceApplicationRoutes.USER_APPLICATIONS_ANONYMOUS,
				component: UserApplicationsAnonymousComponent,
			},
			{
				path: LicenceApplicationRoutes.LOGIN_USER_PROFILE,
				component: LoginUserProfileComponent,
			},
			{
				// SWL - NEW - ANONYMOUS
				path: LicenceApplicationRoutes.APPLICATION_ANONYMOUS,
				component: SecurityWorkerLicenceApplicationComponent,
				children: [{ path: '', component: SecurityWorkerLicenceWizardAnonymousComponent }],
			},
			{
				// SWL - NEW - AUTHORIZED
				path: LicenceApplicationRoutes.APPLICATION_AUTHENTICATED,
				component: SecurityWorkerLicenceApplicationComponent,
				children: [{ path: '', component: SecurityWorkerLicenceWizardAuthenticatedComponent }],
			},
			{
				path: LicenceApplicationRoutes.LICENCE_UPDATE,
				component: SecurityWorkerLicenceWizardUpdateComponent,
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
