import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routing.module';
import { FileUtilService } from '@app/core/services/file-util.service';

@Component({
	selector: 'app-licence-payment-success',
	template: `
		<section class="step-section">
			<app-payment-success
				[payment]="payment"
				(downloadReceipt)="onDownloadReceipt()"
			></app-payment-success>
		</section>
	`,
	styles: [],
})
export class LicencePaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private paymentService: PaymentService,
		private fileUtilService: FileUtilService
	) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('LicencePaymentSuccessComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
		this.paymentService
			.apiAuthLicencePaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.payment = resp;
			});
	}

	onDownloadReceipt(): void {
		this.paymentService
			.apiAuthLicenceApplicationIdPaymentReceiptGet$Response({
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.fileUtilService.downloadFile(resp.headers, resp.body);
			});
	}
}
