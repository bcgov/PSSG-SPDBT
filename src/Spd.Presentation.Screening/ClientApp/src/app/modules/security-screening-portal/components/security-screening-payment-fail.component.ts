import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
	ApplicantPaymentLinkCreateRequest,
	PaymentLinkResponse,
	PaymentMethodCode,
	PaymentResponse,
} from 'src/app/api/models';
import { ApplicantService } from 'src/app/api/services';
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

	constructor(private route: ActivatedRoute, private router: Router, private applicantService: ApplicantService) {}

	ngOnInit(): void {
		const paymentId = this.route.snapshot.paramMap.get('id');
		if (!paymentId) {
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		// import { forkJoin } from 'rxjs';
		// forkJoin([
		// 	this.applicantService.apiApplicantsScreeningsPaymentsPaymentIdGet({ paymentId: paymentId! }),
		// 	this.applicantService.apiApplicantsScreeningsPaymentsPaymentIdGet({ paymentId: paymentId! }),
		// ]).subscribe(([paymentResponse1, paymentResponse2]) => {
		// 	this.applicationId = paymentResponse1.applicationId!;
		// 	this.caseNumber = paymentResponse1.caseNumber!;
		// });

		this.applicantService
			.apiApplicantsScreeningsPaymentsPaymentIdGet({ paymentId: paymentId! })
			.pipe()
			.subscribe((resp: PaymentResponse) => {
				this.applicationId = resp.applicationId!;
				this.caseNumber = resp.caseNumber!;
			});

		// TODO get the number of attempts
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
		this.applicantService
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
