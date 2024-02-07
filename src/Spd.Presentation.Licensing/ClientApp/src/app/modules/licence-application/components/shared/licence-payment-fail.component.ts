import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentLinkCreateRequest, PaymentLinkResponse, PaymentMethodCode, PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routing.module';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { switchMap } from 'rxjs';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-licence-payment-fail',
	template: `
		<div class="container my-3">
			<section class="step-section">
				<app-common-payment-fail
					[numberOfAttemptsRemaining]="numberOfAttemptsRemaining"
					(payNow)="onPayNow()"
					(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
				></app-common-payment-fail>
			</section>
		</div>
	`,
	styles: [],
})
export class LicencePaymentFailComponent implements OnInit {
	numberOfAttemptsRemaining = 0;
	payment: PaymentResponse | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private utilService: UtilService,
		private paymentService: PaymentService
	) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('LicencePaymentFailComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
		this.paymentService
			.apiUnauthLicencePaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe(
				switchMap((paymentResp: PaymentResponse) => {
					this.payment = paymentResp;
					return this.paymentService.apiUnauthLicenceApplicationIdPaymentAttemptsGet({
						applicationId: paymentResp.applicationId!,
					});
				})
			)
			.subscribe((numberOfFails) => {
				const remaining = SPD_CONSTANTS.payment.maxNumberOfAttempts - numberOfFails;
				this.numberOfAttemptsRemaining = remaining <= 0 ? 0 : remaining;
			});
	}

	onPayNow(): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: this.payment!.applicationId!,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Case ID: ${this.payment!.caseNumber}`,
		};
		this.paymentService
			.apiUnauthLicenceApplicationIdPaymentLinkPost({
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
			.apiUnauthLicenceApplicationIdManualPaymentFormGet$Response({
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
