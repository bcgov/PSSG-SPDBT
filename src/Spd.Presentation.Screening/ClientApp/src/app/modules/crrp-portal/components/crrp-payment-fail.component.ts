import { Component } from '@angular/core';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-fail',
	template: ` <app-payment-fail [backRoute]="backRoute"></app-payment-fail> `,
	styles: [],
})
export class CrrpPaymentFailComponent {
	backRoute = CrrpRoutes.path(CrrpRoutes.PAYMENTS);
}
