import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-success',
	template: ` <app-payment-success (backRoute)="onBackRoute()"></app-payment-success> `,
	styles: [],
})
export class CrrpPaymentSuccessComponent {
	constructor(private router: Router) {}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}
}
