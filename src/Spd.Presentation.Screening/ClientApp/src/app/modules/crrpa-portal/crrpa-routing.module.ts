import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrrpaPaymentErrorComponent } from './components/crrpa-payment-error.component';
import { CrrpaPaymentFailComponent } from './components/crrpa-payment-fail.component';
import { CrrpaPaymentSuccessComponent } from './components/crrpa-payment-success.component';
import { CrrpaRoutes } from './crrpa-routes';
import { CrrpaComponent } from './crrpa.component';
import { InvitationCrrpaComponent } from './invitation-crrpa.component';
import { OrgAccessComponent } from './org-access.component';

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
