import { Component } from '@angular/core';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-crc-payment-fail',
	template: ` <app-payment-fail [backRoute]="backRoute"></app-payment-fail> `,
	styles: [],
})
export class CrcPaymentFailComponent {
	backRoute = SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST);
}
