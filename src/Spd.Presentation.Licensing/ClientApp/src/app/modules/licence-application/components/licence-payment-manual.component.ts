import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationPaymentResponse } from 'src/app/api/models';

@Component({
	selector: 'app-licence-payment-manual',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<app-payment-manual (downloadManualPaymentForm)="onDownloadManualPaymentForm()"></app-payment-manual>
			</section>
		</div>
	`,
	styles: [],
})
export class LicencePaymentManualComponent implements OnInit {
	applicationData: ApplicationPaymentResponse | null = null;

	constructor(private router: Router, private location: Location) {}

	ngOnInit() {
		// const applicationData = (this.location.getState() as any)?.applicationData;
		// if (applicationData) {
		// 	this.applicationData = applicationData;
		// } else {
		// 	this.router.navigate([LicenceApplicationRoutes.path(LicenceApplicationRoutes.PAYMENTS)]);
		// }
	}

	onBackRoute(): void {
		// this.router.navigate([LicenceApplicationRoutes.path(LicenceApplicationRoutes.PAYMENTS)]);
	}

	onDownloadManualPaymentForm(): void {
		// this.paymentService
		// 	.apiOrgsOrgIdApplicationsApplicationIdManualPaymentFormGet$Response({
		// 		orgId: this.applicationData?.orgId!,
		// 		applicationId: this.applicationData?.id!,
		// 	})
		// 	.pipe()
		// 	.subscribe((resp: StrictHttpResponse<Blob>) => {
		// 		this.utilService.downloadFile(resp.headers, resp.body);
		// 	});
	}
}
