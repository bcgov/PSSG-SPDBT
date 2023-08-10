import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from 'src/app/api/models';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-licence-payment-success',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<app-payment-success (backRoute)="onBackRoute()" (downloadReceipt)="onDownloadReceipt()"></app-payment-success>
			</section>
		</div>
	`,
	styles: [],
})
export class LicencePaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;

	constructor(private route: ActivatedRoute, private router: Router, private utilService: UtilService) {}

	ngOnInit(): void {
		// const paymentId = this.route.snapshot.paramMap.get('id');
		// if (!paymentId) {
		// 	console.debug('LicencePaymentSuccessComponent - missing paymentId');
		// 	this.router.navigate([AppRoutes.ACCESS_DENIED]);
		// }
		// const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		// if (!orgId) {
		// 	console.debug('LicencePaymentSuccessComponent - missing orgId');
		// 	this.router.navigate([AppRoutes.ACCESS_DENIED]);
		// 	return;
		// }
		// this.paymentService
		// 	.apiOrgsOrgIdPaymentsPaymentIdGet({ paymentId: paymentId!, orgId })
		// 	.pipe()
		// 	.subscribe((resp: PaymentResponse) => {
		// 		this.payment = resp;
		// 	});
	}

	onBackRoute(): void {
		// this.router.navigate([LicenceRoutes.path(LicenceRoutes.PAYMENTS)]);
	}

	onDownloadReceipt(): void {
		// this.paymentService
		// 	.apiOrgsOrgIdApplicationsApplicationIdPaymentReceiptGet$Response({
		// 		orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
		// 		applicationId: this.payment?.applicationId!,
		// 	})
		// 	.pipe()
		// 	.subscribe((resp: StrictHttpResponse<Blob>) => {
		// 		this.utilService.downloadFile(resp.headers, resp.body);
		// 	});
	}
}
