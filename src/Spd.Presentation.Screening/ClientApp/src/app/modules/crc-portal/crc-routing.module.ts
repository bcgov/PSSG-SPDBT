import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcComponent } from './crc.component';
import { InvitationCrcComponent } from './invitation-crc.component';
import { OrgAccessComponent } from './org-access.component';
import { CrcPaymentFailComponent } from './step-components/crc-payment-fail.component';
import { CrcPaymentSuccessComponent } from './step-components/crc-payment-success.component';

export class CrcRoutes {
	public static CRCA = 'crca';
	public static INVITATION = 'invitation';
	public static ORG_ACCESS = 'org-access';
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';

	public static MODULE_PATH = CrcRoutes.CRCA;

	public static path(route: string | null = null): string {
		return route ? `/${CrcRoutes.MODULE_PATH}/${route}` : `/${CrcRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: CrcComponent,
	},
	{
		path: 'invitation/:id',
		component: InvitationCrcComponent,
	},
	{
		path: CrcRoutes.ORG_ACCESS,
		component: OrgAccessComponent,
	},
	{ path: CrcRoutes.PAYMENT_SUCCESS, component: CrcPaymentSuccessComponent },
	{ path: CrcRoutes.PAYMENT_FAIL, component: CrcPaymentFailComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CrcApplicationRoutingModule {}
