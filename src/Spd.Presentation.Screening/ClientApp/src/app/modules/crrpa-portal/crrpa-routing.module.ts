import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcComponent } from './crrpa.component';
import { InvitationCrrpaComponent } from './invitation-crrpa.component';
import { OrgAccessComponent } from './org-access.component';
import { CrrpaPaymentFailComponent } from './step-components/crrpa-payment-fail.component';
import { CrrpaPaymentSuccessComponent } from './step-components/crrpa-payment-success.component';

export class CrrpaRoutes {
	public static CRRPA = 'crca';
	public static INVITATION = 'invitation';
	public static ORG_ACCESS = 'org-access';
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';

	public static MODULE_PATH = CrrpaRoutes.CRRPA;

	public static path(route: string | null = null): string {
		return route ? `/${CrrpaRoutes.MODULE_PATH}/${route}` : `/${CrrpaRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: CrcComponent,
	},
	{
		path: `${CrrpaRoutes.INVITATION}/:id`,
		component: InvitationCrrpaComponent,
	},
	{
		path: CrrpaRoutes.ORG_ACCESS,
		component: OrgAccessComponent,
	},
	{ path: CrrpaRoutes.PAYMENT_SUCCESS, component: CrrpaPaymentSuccessComponent },
	{ path: CrrpaRoutes.PAYMENT_FAIL, component: CrrpaPaymentFailComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CrrpaRoutingModule {}
