import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PaymentLinkCreateRequest, PaymentLinkResponse, PaymentMethodCode, PaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { UtilService } from 'src/app/core/services/util.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-fail',
	template: `
		<app-payment-fail
			[payment]="payment"
			[numberOfAttemptsRemaining]="numberOfAttemptsRemaining"
			(backRoute)="onBackRoute()"
			(payNow)="onPayNow()"
			(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
		></app-payment-fail>
	`,
	styles: [],
})
export class SecurityScreeningPaymentFailComponent implements OnInit {
	numberOfAttemptsRemaining = 0;
	payment: PaymentResponse | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private paymentService: PaymentService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('SecurityScreeningPaymentFailComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		this.paymentService
			.apiApplicantsScreeningsPaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe(
				switchMap((paymentResp: PaymentResponse) => {
					this.payment = paymentResp;

					return this.paymentService.apiApplicantsScreeningsApplicationIdPaymentAttemptsGet({
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
		this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
	}

	onPayNow(): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: this.payment!.applicationId!,
			paymentMethod: PaymentMethodCode.CreditCard,
		};
		this.paymentService
			.apiApplicantsScreeningsApplicationIdPaymentLinkPost({
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
			.apiApplicantsScreeningsApplicationIdManualPaymentFormGet$Response({
				applicationId: this.payment?.applicationId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
