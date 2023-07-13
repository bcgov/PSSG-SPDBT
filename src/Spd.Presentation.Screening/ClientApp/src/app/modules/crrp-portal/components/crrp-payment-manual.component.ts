import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-manual',
	template: ` <app-payment-manual (backRoute)="onBackRoute()"></app-payment-manual> `,
	styles: [],
})
export class CrrpPaymentManualComponent {
	constructor(private router: Router) {}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}
}
