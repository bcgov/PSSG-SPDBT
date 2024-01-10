import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { AppRoutes } from '@app/app-routing.module';

@Component({
	selector: 'app-licence-payment-success',
	template: `
		<div class="container mt-4">
			<section class="step-section">
				<app-payment-success></app-payment-success>
			</section>
		</div>
	`,
	styles: [],
})
export class LicencePaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;

	constructor(private route: ActivatedRoute, private router: Router, private paymentService: PaymentService) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('LicencePaymentSuccessComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
		this.paymentService
			.apiUnauthLicencePaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.payment = resp;
			});
	}
}
