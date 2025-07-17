import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { AppRoutes } from '@app/app-routes';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { switchMap } from 'rxjs';

@Component({
	selector: 'app-licence-payment-fail-anonymous',
	template: `
		<app-container>
			<section class="step-section">
				<app-payment-fail
					[numberOfAttemptsRemaining]="numberOfAttemptsRemaining"
					(payNow)="onPayNow()"
					(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
				></app-payment-fail>
			</section>
		</app-container>
	`,
	styles: [],
	standalone: false,
})
export class LicencePaymentFailAnonymousComponent implements OnInit {
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
			console.debug('LicencePaymentFailComponent - missing paymentId');
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
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
		this.commonApplicationService.payNowPersonalLicenceAnonymous(this.payment!.applicationId!);
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualPaymentFormUnauthenticated(this.payment?.applicationId!);
	}
}
