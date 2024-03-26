import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
	PaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	PaymentResponse,
	PaymentTypeCode,
} from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-crrpa-payment-fail',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<app-payment-fail
					[payment]="payment"
					[numberOfAttemptsRemaining]="numberOfAttemptsRemaining"
					[isCancelledPaymentFlow]="isCancelledPaymentFlow"
					[isPayBySecureLink]="isPayBySecureLink"
					(payNow)="onPayNow()"
					(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
				></app-payment-fail>
			</section>
		</div>
	`,
	styles: [],
})
export class CrrpaPaymentFailComponent implements OnInit {
	isCancelledPaymentFlow = false;
	numberOfAttemptsRemaining = 0;
	payment: PaymentResponse | null = null;
	isPayBySecureLink = false;

	constructor(
		private route: ActivatedRoute,
		private authProcessService: AuthProcessService,
		private paymentService: PaymentService,
		private utilService: UtilService
	) {}

	async ngOnInit(): Promise<void> {
		await this.authProcessService.tryInitializeCrrpa();

		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			this.isCancelledPaymentFlow = true;
		} else {
			this.paymentService
				.apiCrrpaPaymentsPaymentIdGet({ paymentId: paymentId })
				.pipe(
					switchMap((paymentResp: PaymentResponse) => {
						this.payment = paymentResp;

						return this.paymentService.apiCrrpaApplicationIdPaymentAttemptsGet({
							applicationId: paymentResp.applicationId!,
						});
					})
				)
				.subscribe((numberOfFails) => {
					this.isPayBySecureLink = this.payment?.paymentType == PaymentTypeCode.PayBcSecurePaymentLink;
					if (this.isPayBySecureLink) {
						this.numberOfAttemptsRemaining = 0;
					} else {
						const remaining = SPD_CONSTANTS.payment.maxNumberOfAttempts - numberOfFails;
						this.numberOfAttemptsRemaining = remaining <= 0 ? 0 : remaining;
					}
				});
		}
	}

	onPayNow(): void {
		if (this.authProcessService.isLoggedIn()) {
			this.authProcessService.refreshToken();
		}

		const body: PaymentLinkCreateRequest = {
			applicationId: this.payment!.applicationId!,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Case ID: ${this.payment!.caseNumber}`,
		};
		this.paymentService
			.apiCrrpaPaymentLinkPost({
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
			.apiCrrpaApplicationIdManualPaymentFormGet$Response({
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
