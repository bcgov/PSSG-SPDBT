import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentResponse } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { AppRoutes } from '@app/app-routing.module';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { ApplicationService } from '@app/core/services/application.service';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { switchMap } from 'rxjs';

@Component({
	selector: 'app-business-licence-payment-fail',
	template: `
		<section class="step-section">
			<app-payment-fail
				[numberOfAttemptsRemaining]="numberOfAttemptsRemaining"
				(payNow)="onPayNow()"
				(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
			></app-payment-fail>
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
		private authUserBceidService: AuthUserBceidService,
		private paymentService: PaymentService,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('BusinessLicencePaymentFailComponent - missing paymentId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		this.paymentService
			.apiBusinessBizIdPaymentsPaymentIdGet({ bizId, paymentId: paymentId! })
			.pipe(
				switchMap((paymentResp: PaymentResponse) => {
					this.payment = paymentResp;
					return this.paymentService.apiBusinessBizIdApplicationsApplicationIdPaymentAttemptsGet({
						bizId,
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
