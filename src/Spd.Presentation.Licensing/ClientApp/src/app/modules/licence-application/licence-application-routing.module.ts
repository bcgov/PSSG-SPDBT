import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationTypeComponent } from './components/application-type.component';
import { LicencePaymentErrorComponent } from './components/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/licence-payment-fail.component';
import { LicencePaymentManualComponent } from './components/licence-payment-manual.component';
import { LicencePaymentSuccessComponent } from './components/licence-payment-success.component';
import { LicenceSelectionComponent } from './components/licence-selection.component';
import { LoginSelectionComponent } from './components/login-selection.component';
import { SecurityWorkerLicenceApplicationComponent } from './components/security-worker-licence-application.component';
import { SecurityWorkerLicenceUpdateWizardComponent } from './components/security-worker-licence-update-wizard.component';
import { SecurityWorkerLicenceWizardComponent } from './components/security-worker-licence-wizard.component';
import { UserApplicationsBcscComponent } from './components/user-applications-bcsc.component';
import { UserApplicationsUnauthComponent } from './components/user-applications-unauth.component';
import { UserApplicationsComponent } from './components/user-applications.component';
import { UserProfileComponent } from './components/user-profile.component';
import { LicenceApplicationComponent } from './licence-application.component';

export class LicenceApplicationRoutes {
	public static LICENCE_APPLICATION = 'licence-application';
	public static LOGIN_SELECTION = 'login-selection';
	public static USER_APPLICATIONS = 'user-applications';
	public static USER_APPLICATIONS_UNAUTH = 'user-applications-basic';
	public static LICENCE_UPDATE = 'licence-update';
	public static LICENCE_SELECTION = 'licence-selection';
	public static APPLICATION_TYPE = 'application-type';
	public static SOLE_PROPRIETOR = 'sole-proprietor';
	public static APPLICATION = 'application';
	public static USER_PROFILE = 'user-profile';

	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_MANUAL = 'payment-manual';
	public static PAYMENT_ERROR = 'payment-error';

	public static MODULE_PATH = LicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceApplicationRoutes.MODULE_PATH}/${route}` : `/${LicenceApplicationRoutes.MODULE_PATH}`;
	}
	public static pathSecurityWorkerLicence(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.APPLICATION}`;
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
				path: LicenceApplicationRoutes.USER_APPLICATIONS,
				component: UserApplicationsBcscComponent,
				children: [{ path: '', component: UserApplicationsComponent }],
			},
			{
				path: LicenceApplicationRoutes.USER_APPLICATIONS_UNAUTH,
				component: UserApplicationsUnauthComponent,
			},
			{
				path: LicenceApplicationRoutes.USER_PROFILE,
				component: UserProfileComponent,
			},
			{
				path: LicenceApplicationRoutes.APPLICATION,
				component: SecurityWorkerLicenceApplicationComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_SELECTION,
						component: LicenceSelectionComponent,
					},
					{
						path: LicenceApplicationRoutes.APPLICATION_TYPE,
						component: ApplicationTypeComponent,
					},
					{ path: '', component: SecurityWorkerLicenceWizardComponent },
				],
			},
			{
				path: LicenceApplicationRoutes.LICENCE_UPDATE,
				component: SecurityWorkerLicenceUpdateWizardComponent,
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
