import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-success',
	template: ` <app-payment-success [payment]="payment" (backRoute)="onBackRoute()"></app-payment-success> `,
	styles: [],
})
export class SecurityScreeningPaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;

	constructor(private route: ActivatedRoute, private router: Router, private paymentService: PaymentService) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('SecurityScreeningPaymentSuccessComponent - paymentId', paymentId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		this.paymentService
			.apiApplicantsScreeningsPaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.payment = resp;
			});
	}

	onBackRoute(): void {
		this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
	}
}
