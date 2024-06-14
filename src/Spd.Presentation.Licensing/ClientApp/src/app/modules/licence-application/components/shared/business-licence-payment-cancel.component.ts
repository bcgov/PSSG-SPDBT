import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app-routing.module';
import { CommonApplicationService } from '../../services/common-application.service';

@Component({
	selector: 'app-business-licence-payment-cancel',
	template: `
		<section class="step-section">
			<app-common-payment-cancel
				(payNow)="onPayNow()"
				(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
			></app-common-payment-cancel>
		</section>
	`,
	styles: [],
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
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
	}

	onPayNow(): void {
		this.commonApplicationService.payNowBusinessLicence(this.licenceAppId!, 'Payment for Application/Licence');
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualBusinessPaymentForm(this.licenceAppId!);
	}
}
