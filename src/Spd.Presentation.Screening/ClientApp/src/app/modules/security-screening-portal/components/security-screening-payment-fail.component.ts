import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
	ApplicantPaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	PaymentResponse,
} from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-fail',
	template: `
		<app-payment-fail
			[numberOfAttempts]="numberOfAttempts"
			[isCancelledPayment]="isCancelledPayment"
			(backRoute)="onBackRoute()"
			(payNow)="onPayNow()"
			(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
		></app-payment-fail>
	`,
	styles: [],
})
export class SecurityScreeningPaymentFailComponent implements OnInit {
	isCancelledPayment: boolean = false;
	numberOfAttempts: number = 0;
	applicationId: string | null = null;
	caseNumber: string | null = null;

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
					this.applicationId = paymentResp.applicationId!;
					this.caseNumber = paymentResp.caseNumber!;

					return this.paymentService.apiApplicantsScreeningsApplicationIdPaymentAttemptsGet({
						applicationId: paymentResp.applicationId!,
					});
				})
			)
			.subscribe((numberOfFails) => {
				this.numberOfAttempts = numberOfFails;
			});
	}

	onBackRoute(): void {
		this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
	}

	onPayNow(): void {
		const body: ApplicantPaymentLinkCreateRequest = {
			applicationId: this.applicationId!,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Case ID: ${this.caseNumber}`,
		};
		this.paymentService
			.apiApplicantsScreeningsApplicationIdPaymentLinkPost({
				applicationId: this.applicationId!,
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
