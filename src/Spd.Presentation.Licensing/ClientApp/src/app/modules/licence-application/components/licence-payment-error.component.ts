import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-licence-payment-error',
	template: `
		<div class="container mt-4">
			<section class="step-section">
				<app-payment-error></app-payment-error>
			</section>
		</div>
	`,
	styles: [],
})
export class LicencePaymentErrorComponent {
	constructor(private router: Router) {}
}
