import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-error',
	template: ` <app-payment-error (backRoute)="onBackRoute()"></app-payment-error> `,
	styles: [],
})
export class CrrpPaymentErrorComponent {
	constructor(private router: Router) {}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}
}
