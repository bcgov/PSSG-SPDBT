import { Component } from '@angular/core';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-fail',
	template: ` <app-payment-fail [backRoute]="backRoute"></app-payment-fail> `,
	styles: [],
})
export class SecurityScreeningPaymentFailComponent {
	backRoute = SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST);
}
