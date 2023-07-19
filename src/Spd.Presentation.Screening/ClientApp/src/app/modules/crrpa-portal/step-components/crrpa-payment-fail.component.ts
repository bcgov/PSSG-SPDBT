import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
	ApplicantInvitePaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	PaymentResponse,
} from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';

@Component({
	selector: 'app-crrpa-payment-fail',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<app-payment-fail
					[payment]="payment"
					[numberOfAttempts]="numberOfAttempts"
					[isCancelledPaymentFlow]="isCancelledPaymentFlow"
					(payNow)="onPayNow()"
					(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
				></app-payment-fail>
			</section>
		</div>
	`,
	styles: [],
})
export class CrrpaPaymentFailComponent implements OnInit {
	isCancelledPaymentFlow: boolean = false;
	numberOfAttempts: number = 0;
	payment: PaymentResponse | null = null;

	constructor(private route: ActivatedRoute, private router: Router, private paymentService: PaymentService) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			this.isCancelledPaymentFlow = true;
		} else {
			this.paymentService
				.apiCrrpaPaymentsPaymentIdGet({ paymentId: paymentId! })
				.pipe(
					switchMap((paymentResp: PaymentResponse) => {
						this.payment = paymentResp;

						return this.paymentService.apiCrrpaApplicationIdPaymentAttemptsGet({
							applicationId: paymentResp.applicationId!,
						});
					})
				)
				.subscribe((numberOfFails) => {
					this.numberOfAttempts = numberOfFails;
				});
		}
	}

	onPayNow(): void {
		const body: ApplicantInvitePaymentLinkCreateRequest = {
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
		//TODO download manual payment form
	}
}
