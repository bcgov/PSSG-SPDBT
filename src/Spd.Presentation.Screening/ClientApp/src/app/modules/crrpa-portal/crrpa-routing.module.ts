import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrrpaPaymentErrorComponent } from './components/crrpa-payment-error.component';
import { CrrpaPaymentFailComponent } from './components/crrpa-payment-fail.component';
import { CrrpaPaymentSuccessComponent } from './components/crrpa-payment-success.component';
import { CrrpaComponent } from './crrpa.component';
import { InvitationCrrpaComponent } from './invitation-crrpa.component';
import { OrgAccessComponent } from './org-access.component';

export class CrrpaRoutes {
	public static CRRPA = 'crrpa';
	public static INVITATION = 'invitation';
	public static ORG_ACCESS = 'org-access';
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_ERROR = 'payment-error';

	public static MODULE_PATH = CrrpaRoutes.CRRPA;

	public static path(route: string | null = null): string {
		return route ? `/${CrrpaRoutes.MODULE_PATH}/${route}` : `/${CrrpaRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: CrrpaComponent,
	},
	{
		path: `${CrrpaRoutes.INVITATION}/:id`,
		component: InvitationCrrpaComponent,
	},
	{
		path: CrrpaRoutes.ORG_ACCESS,
		component: OrgAccessComponent,
	},
	{ path: `${CrrpaRoutes.PAYMENT_SUCCESS}/:id`, component: CrrpaPaymentSuccessComponent },
	{ path: `${CrrpaRoutes.PAYMENT_FAIL}/:id`, component: CrrpaPaymentFailComponent },
	{ path: CrrpaRoutes.PAYMENT_FAIL, component: CrrpaPaymentFailComponent },
	{ path: CrrpaRoutes.PAYMENT_ERROR, component: CrrpaPaymentErrorComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CrrpaRoutingModule {}
