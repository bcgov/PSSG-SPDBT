import { Component } from '@angular/core';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-success',
	template: ` <app-payment-success [backRoute]="backRoute"></app-payment-success> `,
	styles: [],
})
export class SecurityScreeningPaymentSuccessComponent {
	backRoute = SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST);
}
