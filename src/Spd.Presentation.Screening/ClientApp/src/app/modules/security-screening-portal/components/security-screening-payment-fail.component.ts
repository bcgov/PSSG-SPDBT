import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { PaymentLinkCreateRequest, PaymentLinkResponse, PaymentMethodCode, PaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
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
	numberOfAttemptsRemaining: number = 0;
	payment: PaymentResponse | null = null;

	constructor(private route: ActivatedRoute, private router: Router, private paymentService: PaymentService) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('SecurityScreeningPaymentFailComponent - paymentId', paymentId);
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
			description: `Payment for Case ID: ${this.payment!.caseNumber}`,
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
		//TODO download manual payment form
	}
}
