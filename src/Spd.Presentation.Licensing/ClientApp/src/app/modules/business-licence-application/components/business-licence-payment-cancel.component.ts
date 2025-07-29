import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonApplicationService } from '@app/core/services/common-application.service';
import { BusinessLicenceApplicationRoutes } from '../business-license-application-routes';

@Component({
	selector: 'app-business-licence-payment-cancel',
	template: `
		<section class="step-section">
			<app-payment-cancel
				(payNow)="onPayNow()"
				(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
			></app-payment-cancel>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class BusinessLicencePaymentCancelComponent implements OnInit {
	licenceAppId: string | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.licenceAppId = this.route.snapshot.paramMap.get('id');
		if (!this.licenceAppId) {
			console.debug('BusinessLicencePaymentCancelComponent - missing licenceAppId');
			this.router.navigateByUrl(BusinessLicenceApplicationRoutes.pathBusinessApplications());
		}
	}

	onPayNow(): void {
		this.commonApplicationService.payNowBusinessLicence(this.licenceAppId!);
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualBusinessPaymentForm(this.licenceAppId!);
	}
}
