import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app-routing.module';
import { CommonApplicationService } from '../../services/common-application.service';

@Component({
	selector: 'app-licence-payment-cancel',
	template: `
		<div class="container my-3">
			<section class="step-section">
				<app-common-payment-cancel
					(payNow)="onPayNow()"
					(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
				></app-common-payment-cancel>
			</section>
		</div>
	`,
	styles: [],
})
export class LicencePaymentCancelComponent implements OnInit {
	licenceAppId: string | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.licenceAppId = this.route.snapshot.paramMap.get('id');
		if (!this.licenceAppId) {
			console.debug('LicencePaymentCancelComponent - missing licenceAppId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
	}

	onPayNow(): void {
		this.commonApplicationService.payNowUnauthenticated(this.licenceAppId!, 'Payment for Application');
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualPaymentFormUnauthenticated(this.licenceAppId!);
	}
}
