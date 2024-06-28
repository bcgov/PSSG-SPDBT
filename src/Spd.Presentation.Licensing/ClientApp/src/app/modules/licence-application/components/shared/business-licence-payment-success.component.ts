import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routing.module';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { FileUtilService } from '@app/core/services/file-util.service';

@Component({
	selector: 'app-business-licence-payment-success',
	template: `
		<section class="step-section">
			<app-common-payment-success
				[payment]="payment"
				(downloadReceipt)="onDownloadReceipt()"
			></app-common-payment-success>
		</section>
	`,
	styles: [],
})
export class BusinessLicencePaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authUserBceidService: AuthUserBceidService,
		private paymentService: PaymentService,
		private fileUtilService: FileUtilService
	) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('BusinessLicencePaymentSuccessComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		this.paymentService
			.apiBusinessBizIdPaymentsPaymentIdGet({ bizId, paymentId: paymentId! })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.payment = resp;
			});
	}

	onDownloadReceipt(): void {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		this.paymentService
			.apiBusinessBizIdApplicationsApplicationIdPaymentReceiptGet$Response({
				bizId,
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.fileUtilService.downloadFile(resp.headers, resp.body);
			});
	}
}
