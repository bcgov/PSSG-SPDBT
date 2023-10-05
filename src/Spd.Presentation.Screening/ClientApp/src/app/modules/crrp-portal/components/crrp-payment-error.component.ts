import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-error',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<app-payment-error (backRoute)="onBackRoute()"></app-payment-error>
		</section>
	`,
	styles: [],
})
export class CrrpPaymentErrorComponent {
	constructor(private router: Router) {}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}
}
