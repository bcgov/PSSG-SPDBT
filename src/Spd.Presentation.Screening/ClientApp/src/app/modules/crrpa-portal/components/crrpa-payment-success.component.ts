import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-crrpa-payment-success',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<app-payment-success
					[isApplicationReceived]="true"
					[payment]="payment"
					(downloadReceipt)="onDownloadReceipt()"
				></app-payment-success>
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
		private paymentService: PaymentService,
		private utilService: UtilService
	) {}

	async ngOnInit(): Promise<void> {
		await this.authProcessService.tryInitializeCrrpa();

		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('CrrpaPaymentSuccessComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		this.paymentService
			.apiCrrpaPaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.payment = resp;
			});
	}

	onDownloadReceipt(): void {
		this.paymentService
			.apiCrrpaApplicationIdPaymentReceiptGet$Response({
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
