import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SecurityScreeningDetailComponent } from './components/security-screening-detail.component';
import { SecurityScreeningListComponent } from './components/security-screening-list.component';
import { SecurityScreeningPaymentErrorComponent } from './components/security-screening-payment-error.component';
import { SecurityScreeningPaymentFailComponent } from './components/security-screening-payment-fail.component';
import { SecurityScreeningPaymentManualComponent } from './components/security-screening-payment-manual.component';
import { SecurityScreeningPaymentSuccessComponent } from './components/security-screening-payment-success.component';
import { SecurityScreeningRoutes } from './security-screening-routes';
import { SecurityScreeningComponent } from './security-screening.component';

const routes: Routes = [
	{
		path: '',
		component: SecurityScreeningComponent,
		children: [
			{ path: SecurityScreeningRoutes.CRC_LIST, component: SecurityScreeningListComponent },
			{ path: SecurityScreeningRoutes.CRC_DETAIL, component: SecurityScreeningDetailComponent },
			{ path: `${SecurityScreeningRoutes.PAYMENT_SUCCESS}/:id`, component: SecurityScreeningPaymentSuccessComponent },
			{ path: `${SecurityScreeningRoutes.PAYMENT_FAIL}/:id`, component: SecurityScreeningPaymentFailComponent },
			{ path: SecurityScreeningRoutes.PAYMENT_MANUAL, component: SecurityScreeningPaymentManualComponent },
			{ path: SecurityScreeningRoutes.PAYMENT_ERROR, component: SecurityScreeningPaymentErrorComponent },
			{ path: '', redirectTo: SecurityScreeningRoutes.CRC_LIST, pathMatch: 'full' },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SecurityScreeningRoutingModule {}
