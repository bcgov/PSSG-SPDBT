import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from 'src/app/api/models';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-licence-payment-fail',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<app-payment-fail
					[numberOfAttemptsRemaining]="numberOfAttemptsRemaining"
					(backRoute)="onBackRoute()"
					(payNow)="onPayNow()"
					(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
				></app-payment-fail>
			</section>
		</div>
	`,
	styles: [],
})
export class LicencePaymentFailComponent implements OnInit {
	numberOfAttemptsRemaining: number = 0;
	payment: PaymentResponse | null = null;

	constructor(private route: ActivatedRoute, private router: Router, private utilService: UtilService) {}

	ngOnInit(): void {
		// const paymentId = this.route.snapshot.paramMap.get('id');
		// if (!paymentId) {
		// 	console.debug('LicencePaymentFailComponent - missing paymentId');
		// 	this.router.navigate([AppRoutes.ACCESS_DENIED]);
		// }
		// const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		// if (!orgId) {
		// 	console.debug('LicencePaymentFailComponent - missing orgId');
		// 	this.router.navigate([AppRoutes.ACCESS_DENIED]);
		// 	return;
		// }
		// this.paymentService
		// 	.apiOrgsOrgIdPaymentsPaymentIdGet({ paymentId: paymentId!, orgId })
		// 	.pipe(
		// 		switchMap((paymentResp: PaymentResponse) => {
		// 			this.payment = paymentResp;
		// 			return this.paymentService.apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet({
		// 				orgId,
		// 				applicationId: paymentResp.applicationId!,
		// 			});
		// 		})
		// 	)
		// 	.subscribe((numberOfFails) => {
		// 		const remaining = SPD_CONSTANTS.payment.maxNumberOfAttempts - numberOfFails;
		// 		this.numberOfAttemptsRemaining = remaining <= 0 ? 0 : remaining;
		// 	});
	}

	onBackRoute(): void {
		// this.router.navigate([LicenceRoutes.path(LicenceRoutes.PAYMENTS)]);
	}

	onPayNow(): void {
		// const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		// const body: PaymentLinkCreateRequest = {
		// 	applicationId: this.payment!.applicationId!,
		// 	paymentMethod: PaymentMethodCode.CreditCard,
		// 	description: `Payment for Case ID: ${this.payment!.caseNumber}`,
		// };
		// this.paymentService
		// 	.apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost({
		// 		orgId: orgId!,
		// 		applicationId: this.payment!.applicationId!,
		// 		body,
		// 	})
		// 	.pipe()
		// 	.subscribe((res: PaymentLinkResponse) => {
		// 		if (res.paymentLinkUrl) {
		// 			window.location.assign(res.paymentLinkUrl);
		// 		}
		// 	});
	}

	onDownloadManualPaymentForm(): void {
		// this.paymentService
		// 	.apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Response({
		// 		orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
		// 		applicationId: this.payment?.applicationId!,
		// 	})
		// 	.pipe()
		// 	.subscribe((resp: StrictHttpResponse<Blob>) => {
		// 		this.utilService.downloadFile(resp.headers, resp.body);
		// 	});
	}
}
