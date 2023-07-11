import { Component } from '@angular/core';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-manual',
	template: ` <app-payment-manual [backRoute]="backRoute"></app-payment-manual> `,
	styles: [],
})
export class CrrpPaymentManualComponent {
	backRoute = CrrpRoutes.path(CrrpRoutes.PAYMENTS);
}
