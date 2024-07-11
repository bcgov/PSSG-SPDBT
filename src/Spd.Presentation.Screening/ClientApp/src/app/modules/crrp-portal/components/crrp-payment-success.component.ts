import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-success',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<app-payment-success
				[payment]="payment"
				[showCloseButton]="false"
				(backRoute)="onBackRoute()"
				(downloadReceipt)="onDownloadReceipt()"
			></app-payment-success>
		</section>
	`,
	styles: [],
})
export class CrrpPaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authUserService: AuthUserBceidService,
		private paymentService: PaymentService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('CrrpPaymentSuccessComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('CrrpPaymentSuccessComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.paymentService
			.apiOrgsOrgIdPaymentsPaymentIdGet({ paymentId: paymentId!, orgId })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.payment = resp;
			});
	}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}

	onDownloadReceipt(): void {
		this.paymentService
			.apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
