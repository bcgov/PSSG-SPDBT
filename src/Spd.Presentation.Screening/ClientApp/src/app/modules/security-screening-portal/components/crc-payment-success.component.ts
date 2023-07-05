import { Component } from '@angular/core';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-crc-payment-success',
	template: ` <app-payment-success [backRoute]="backRoute"></app-payment-success> `,
	styles: [],
})
export class CrcPaymentSuccessComponent {
	backRoute = SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST);
}
