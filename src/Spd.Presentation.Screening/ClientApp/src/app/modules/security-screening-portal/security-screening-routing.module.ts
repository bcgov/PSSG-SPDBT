import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityScreeningDetailComponent } from './components/security-screening-detail.component';
import { SecurityScreeningListComponent } from './components/security-screening-list.component';
import { SecurityScreeningPaymentFailComponent } from './components/security-screening-payment-fail.component';
import { SecurityScreeningPaymentSuccessComponent } from './components/security-screening-payment-success.component';
import { SecurityScreeningComponent } from './security-screening.component';

export class SecurityScreeningRoutes {
	public static SECURITY_SCREENING_APPLICATION = 'security-screening';
	public static CRC_LIST = 'crc-list';
	public static CRC_DETAIL = 'crc-detail';
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';

	public static MODULE_PATH = SecurityScreeningRoutes.SECURITY_SCREENING_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${SecurityScreeningRoutes.MODULE_PATH}/${route}` : `/${SecurityScreeningRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: SecurityScreeningComponent,
		children: [
			{ path: SecurityScreeningRoutes.CRC_LIST, component: SecurityScreeningListComponent },
			{ path: SecurityScreeningRoutes.CRC_DETAIL, component: SecurityScreeningDetailComponent },
			{ path: SecurityScreeningRoutes.PAYMENT_SUCCESS, component: SecurityScreeningPaymentSuccessComponent },
			{ path: SecurityScreeningRoutes.PAYMENT_FAIL, component: SecurityScreeningPaymentFailComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SecurityScreeningRoutingModule {}
