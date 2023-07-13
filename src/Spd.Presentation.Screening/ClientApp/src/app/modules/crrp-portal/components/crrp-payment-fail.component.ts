import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-fail',
	template: ` <app-payment-fail (backRoute)="onBackRoute()"></app-payment-fail> `,
	styles: [],
})
export class CrrpPaymentFailComponent {
	constructor(private router: Router) {}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}
}
