import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { BusinessLicenceApplicationRoutes } from '../business-license-application-routes';

@Component({
	selector: 'app-business-licence-payment-success',
	template: `
		<section class="step-section">
			<app-payment-success [payment]="payment" (downloadReceipt)="onDownloadReceipt()"></app-payment-success>
		</section>
	`,
	styles: [],
	standalone: false,
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
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
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
