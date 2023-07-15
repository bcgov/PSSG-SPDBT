import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {
	OrgPaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	PaymentResponse,
} from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-fail',
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
export class CrrpPaymentFailComponent implements OnInit {
	isCancelledPayment: boolean = false;
	numberOfAttempts: number = 0;
	applicationId: string | null = null;
	caseNumber: string | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authUserService: AuthUserService,
		private paymentService: PaymentService
	) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('CrrpPaymentFailComponent - paymentId', paymentId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('CrrpPaymentFailComponent - orgId', orgId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.paymentService
			.apiOrgsOrgIdPaymentsPaymentIdGet({ paymentId: paymentId!, orgId })
			.pipe(
				switchMap((paymentResp: PaymentResponse) => {
					this.applicationId = paymentResp.applicationId!;
					this.caseNumber = paymentResp.caseNumber!;

					return this.paymentService.apiOrgsOrgIdApplicationsApplicationIdPaymentAttemptsGet({
						orgId,
						applicationId: paymentResp.applicationId!,
					});
				})
			)
			.subscribe((numberOfFails) => {
				this.numberOfAttempts = numberOfFails;
			});
	}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}

	onPayNow(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		const body: OrgPaymentLinkCreateRequest = {
			applicationId: this.applicationId!,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Case ID: ${this.caseNumber}`,
		};
		this.paymentService
			.apiOrgsOrgIdApplicationsApplicationIdPaymentLinkPost({
				orgId: orgId!,
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
