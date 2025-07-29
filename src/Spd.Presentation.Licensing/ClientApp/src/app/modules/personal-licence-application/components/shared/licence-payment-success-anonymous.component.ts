import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routes';
import { FileUtilService } from '@app/core/services/file-util.service';

@Component({
	selector: 'app-licence-payment-success-anonymous',
	template: `
		<app-container>
			<section class="step-section">
				<app-payment-success [payment]="payment" (downloadReceipt)="onDownloadReceipt()"></app-payment-success>
			</section>
		</app-container>
	`,
	styles: [],
	standalone: false,
})
export class LicencePaymentSuccessAnonymousComponent implements OnInit {
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
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
		}

		this.paymentService
			.apiUnauthLicencePaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.payment = resp;
			});
	}

	onDownloadReceipt(): void {
		this.paymentService
			.apiUnauthLicenceApplicationIdPaymentReceiptGet$Response({
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.fileUtilService.downloadFile(resp.headers, resp.body);
			});
	}
}
