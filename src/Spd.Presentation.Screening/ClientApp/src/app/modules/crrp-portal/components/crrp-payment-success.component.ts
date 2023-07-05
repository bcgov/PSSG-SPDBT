import { Component } from '@angular/core';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-success',
	template: ` <app-payment-success [backRoute]="backRoute"></app-payment-success> `,
	styles: [],
})
export class CrrpPaymentSuccessComponent {
	backRoute = CrrpRoutes.path(CrrpRoutes.PAYMENTS);
}
