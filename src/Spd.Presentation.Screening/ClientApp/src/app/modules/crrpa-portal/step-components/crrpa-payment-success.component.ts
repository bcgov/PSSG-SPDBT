import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';

@Component({
	selector: 'app-crrpa-payment-success',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<app-payment-success [isApplicationReceived]="true" [payment]="payment"></app-payment-success>
			</section>
		</div>
	`,
	styles: [],
})
export class CrrpaPaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;

	constructor(
		private route: ActivatedRoute,
		private authProcessService: AuthProcessService,
		private router: Router,
		private paymentService: PaymentService
	) {}

	async ngOnInit(): Promise<void> {
		await this.authProcessService.tryInitializeCrrpa();

		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('CrrpaPaymentSuccessComponent - paymentId', paymentId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		this.paymentService
			.apiCrrpaPaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.payment = resp;
			});
	}
}
