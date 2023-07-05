import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcDetailComponent } from './components/crc-detail.component';
import { CrcListComponent } from './components/crc-list.component';
import { CrcPaymentFailComponent } from './components/crc-payment-fail.component';
import { CrcPaymentSuccessComponent } from './components/crc-payment-success.component';
import { SecurityScreeningComponent } from './security-screening.component';

export class SecurityScreeningRoutes {
	public static SECURITY_SCREENING_APPLICATION = 'security-screening';
	public static CRC_LIST = 'crc-list';
	public static CRC_DETAIL = 'crc-detail';
	public static CRC_PAYMENT_SUCCESS = 'payment-success';
	public static CRC_PAYMENT_FAIL = 'payment-fail';

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
			{ path: SecurityScreeningRoutes.CRC_LIST, component: CrcListComponent },
			{ path: SecurityScreeningRoutes.CRC_DETAIL, component: CrcDetailComponent },
			{ path: SecurityScreeningRoutes.CRC_PAYMENT_SUCCESS, component: CrcPaymentSuccessComponent },
			{ path: SecurityScreeningRoutes.CRC_PAYMENT_FAIL, component: CrcPaymentFailComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SecurityScreeningRoutingModule {}
