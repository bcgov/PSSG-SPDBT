import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-manual',
	template: ` <app-payment-manual (backRoute)="onBackRoute()"></app-payment-manual> `,
	styles: [],
})
export class SecurityScreeningPaymentManualComponent {
	constructor(private router: Router) {}

	onBackRoute(): void {
		this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
	}
}
