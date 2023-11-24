import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PaymentLinkCreateRequest, PaymentLinkResponse, PaymentMethodCode, PaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { UtilService } from 'src/app/core/services/util.service';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-fail',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<app-payment-fail
				[payment]="payment"
				[numberOfAttemptsRemaining]="numberOfAttemptsRemaining"
				(backRoute)="onBackRoute()"
				(payNow)="onPayNow()"
				(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
			></app-payment-fail>
		</section>
	`,
	styles: [],
})
export class CrrpPaymentFailComponent implements OnInit {
	numberOfAttemptsRemaining = 0;
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
			console.debug('CrrpPaymentFailComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('CrrpPaymentFailComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.paymentService
			.apiOrgsOrgIdPaymentsPaymentIdGet({ paymentId: paymentId!, orgId })
			.pipe(
				switchMap((paymentResp: PaymentResponse) => {
					this.payment = paymentResp;

					return this.paymentService.apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet({
						orgId,
						applicationId: paymentResp.applicationId!,
					});
				})
			)
			.subscribe((numberOfFails) => {
				const remaining = SPD_CONSTANTS.payment.maxNumberOfAttempts - numberOfFails;
				this.numberOfAttemptsRemaining = remaining <= 0 ? 0 : remaining;
			});
	}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}

	onPayNow(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		const body: PaymentLinkCreateRequest = {
			applicationId: this.payment!.applicationId!,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Case ID: ${this.payment!.caseNumber}`,
		};
		this.paymentService
			.apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost({
				orgId: orgId!,
				applicationId: this.payment!.applicationId!,
				body,
			})
			.pipe()
			.subscribe((res: PaymentLinkResponse) => {
				if (res.paymentLinkUrl) {
					window.location.assign(res.paymentLinkUrl);
				}
			});
	}

	onDownloadManualPaymentForm(): void {
		this.paymentService
			.apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Response({
				orgId: this.authUserService.bceidUserInfoProfile?.orgId!,
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
