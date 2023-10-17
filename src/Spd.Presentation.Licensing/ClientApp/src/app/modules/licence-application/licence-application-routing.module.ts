import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsInProgressComponent } from './components/applications-in-progress.component';
import { LicencePaymentErrorComponent } from './components/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/licence-payment-fail.component';
import { LicencePaymentManualComponent } from './components/licence-payment-manual.component';
import { LicencePaymentSuccessComponent } from './components/licence-payment-success.component';
import { LicenceSelectionComponent } from './components/licence-selection.component';
import { ApplicationTypeComponent } from './components/application-type.component';
import { LicenceWizardComponent } from './components/licence-wizard.component';
import { LoginSelectionComponent } from './components/login-selection.component';
import { LicenceApplicationComponent } from './licence-application.component';

export class LicenceApplicationRoutes {
	public static LICENCE_APPLICATION = 'licence-application';
	public static LOGIN_SELECTION = 'login-selection';
	public static APPLICATIONS_IN_PROGRESS = 'applications-in-progress';
	public static LICENCE_SELECTION = 'licence-selection';
	public static LICENCE_TYPE = 'licence-type';
	public static APPLICATION = 'application';

	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_MANUAL = 'payment-manual';
	public static PAYMENT_ERROR = 'payment-error';

	public static MODULE_PATH = LicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceApplicationRoutes.MODULE_PATH}/${route}` : `/${LicenceApplicationRoutes.MODULE_PATH}`;
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
				path: LicenceApplicationRoutes.APPLICATIONS_IN_PROGRESS,
				component: ApplicationsInProgressComponent,
			},
			{
				path: LicenceApplicationRoutes.LICENCE_SELECTION,
				component: LicenceSelectionComponent,
			},
			{
				path: LicenceApplicationRoutes.LICENCE_TYPE,
				component: ApplicationTypeComponent,
			},
			{
				path: LicenceApplicationRoutes.APPLICATION,
				component: LicenceWizardComponent,
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
