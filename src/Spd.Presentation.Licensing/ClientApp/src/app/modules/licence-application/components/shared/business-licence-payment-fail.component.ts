import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { AppRoutes } from '@app/app-routing.module';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { switchMap } from 'rxjs';
import { CommonApplicationService } from '../../services/common-application.service';

@Component({
	selector: 'app-business-licence-payment-fail',
	template: `
		<section class="step-section">
			<app-common-payment-fail
				[numberOfAttemptsRemaining]="numberOfAttemptsRemaining"
				(payNow)="onPayNow()"
				(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
			></app-common-payment-fail>
		</section>
	`,
	styles: [],
})
export class BusinessLicencePaymentFailComponent implements OnInit {
	numberOfAttemptsRemaining = 0;
	payment: PaymentResponse | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private paymentService: PaymentService,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('BusinessLicencePaymentFailComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
		this.paymentService
			.apiAuthBizLicencePaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe(
				switchMap((paymentResp: PaymentResponse) => {
					this.payment = paymentResp;
					return this.paymentService.apiAuthLicenceApplicationIdPaymentAttemptsGet({
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
		this.commonApplicationService.payNowBusinessLicence(
			this.payment!.applicationId!,
			`Payment for: ${this.payment!.caseNumber}`
		);
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualBusinessPaymentForm(this.payment?.applicationId!);
	}
}
