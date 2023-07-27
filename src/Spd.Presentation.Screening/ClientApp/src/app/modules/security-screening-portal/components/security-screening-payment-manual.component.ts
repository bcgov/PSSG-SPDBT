import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { UtilService } from 'src/app/core/services/util.service';
import { SecurityScreeningRoutes } from '../security-screening-routing.module';
import { ApplicantApplicationStatusResponse } from './security-screening-list.component';

@Component({
	selector: 'app-security-screening-payment-manual',
	template: `
		<app-payment-manual
			(backRoute)="onBackRoute()"
			(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
		></app-payment-manual>
	`,
	styles: [],
})
export class SecurityScreeningPaymentManualComponent implements OnInit {
	applicationData: ApplicantApplicationStatusResponse | null = null;

	constructor(
		private router: Router,
		private location: Location,
		private paymentService: PaymentService,
		private utilService: UtilService
	) {}

	ngOnInit() {
		const applicationData = (this.location.getState() as any)?.applicationData;
		if (applicationData) {
			this.applicationData = applicationData;
		} else {
			this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
		}
	}

	onBackRoute(): void {
		this.router.navigate([SecurityScreeningRoutes.path(SecurityScreeningRoutes.CRC_LIST)]);
	}

	onDownloadManualPaymentForm(): void {
		this.paymentService
			.apiApplicantsScreeningsApplicationIdManualPaymentFormGet$Response({
				applicationId: this.applicationData?.id!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
