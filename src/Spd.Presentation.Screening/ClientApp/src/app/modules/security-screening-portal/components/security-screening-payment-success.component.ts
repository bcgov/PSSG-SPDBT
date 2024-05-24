import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { UtilService } from 'src/app/core/services/util.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-success',
	template: `
		<app-payment-success
			[payment]="payment"
			(backRoute)="onBackRoute()"
			(downloadReceipt)="onDownloadReceipt()"
		></app-payment-success>
	`,
	styles: [],
})
export class SecurityScreeningPaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authUserService: AuthUserBcscService,
		private paymentService: PaymentService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		if (!this.authUserService.bcscUserWhoamiProfile?.applicantId) {
			console.debug(
				'SecurityScreeningPaymentSuccessComponent - bcscUserWhoamiProfile missing applicantId',
				this.authUserService.bcscUserWhoamiProfile
			);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('SecurityScreeningPaymentSuccessComponent - missing paymentId');
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

	onDownloadReceipt(): void {
		this.paymentService
			.apiApplicantsScreeningsApplicationIdPaymentReceiptGet$Response({
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
