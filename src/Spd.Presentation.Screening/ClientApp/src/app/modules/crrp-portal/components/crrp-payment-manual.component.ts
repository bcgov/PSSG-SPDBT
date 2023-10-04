import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationPaymentResponse } from 'src/app/api/models';
import { PaymentService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { UtilService } from 'src/app/core/services/util.service';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-crrp-payment-manual',
	template: `
		<app-crrp-header></app-crrp-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<app-payment-manual
				(backRoute)="onBackRoute()"
				(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
			></app-payment-manual>
		</section>
	`,
	styles: [],
})
export class CrrpPaymentManualComponent implements OnInit {
	applicationData: ApplicationPaymentResponse | null = null;

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
			this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
		}
	}

	onBackRoute(): void {
		this.router.navigate([CrrpRoutes.path(CrrpRoutes.PAYMENTS)]);
	}

	onDownloadManualPaymentForm(): void {
		this.paymentService
			.apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Response({
				orgId: this.applicationData?.orgId!,
				applicationId: this.applicationData?.id!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
