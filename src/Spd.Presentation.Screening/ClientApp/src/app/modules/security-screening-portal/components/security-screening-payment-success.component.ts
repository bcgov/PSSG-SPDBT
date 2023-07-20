import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { ApplicantApplicationResponse, PaymentResponse } from 'src/app/api/models';
import { ApplicantService, PaymentService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';

@Component({
	selector: 'app-security-screening-payment-success',
	template: `
		<app-payment-success [payment]="payment" [sendEmailTo]="email" (backRoute)="onBackRoute()"></app-payment-success>
	`,
	styles: [],
})
export class SecurityScreeningPaymentSuccessComponent implements OnInit {
	payment: PaymentResponse | null = null;
	email: string | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authUserService: AuthUserService,
		private paymentService: PaymentService,
		private applicantService: ApplicantService
	) {}

	ngOnInit(): void {
		if (!this.authUserService.bcscUserWhoamiProfile?.applicantId) {
			console.debug(
				'SecurityScreeningPaymentSuccessComponent - bcscUserWhoamiProfile missing applicantId',
				this.authUserService.bcscUserWhoamiProfile
			);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			console.debug('SecurityScreeningPaymentSuccessComponent - paymentId', paymentId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		this.paymentService
			.apiApplicantsScreeningsPaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe(
				switchMap((paymentResp: PaymentResponse) => {
					this.payment = paymentResp;

					return this.applicantService.apiApplicantsApplicantIdScreeningsApplicationIdGet({
						applicantId: this.authUserService.bcscUserWhoamiProfile?.applicantId!,
						applicationId: paymentResp.applicationId!,
					});
				})
			)
			.subscribe((resp: ApplicantApplicationResponse) => {
				this.email = resp.emailAddress ?? null;
			});
	}

	onBackRoute(): void {
		this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
	}
}
