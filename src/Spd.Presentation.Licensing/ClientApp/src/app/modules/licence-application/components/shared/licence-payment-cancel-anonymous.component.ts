import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app-routing.module';
import { CommonApplicationService } from '../../services/common-application.service';

@Component({
	selector: 'app-licence-payment-cancel-anonymous',
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
export class LicencePaymentCancelAnonymousComponent implements OnInit {
	licenceAppId: string | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private commonApplicationService: CommonApplicationService
	) {}

	ngOnInit(): void {
		this.licenceAppId = this.route.snapshot.paramMap.get('id');
		if (!this.licenceAppId) {
			console.debug('LicencePaymentCancelAnonymousComponent - missing licenceAppId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
	}

	onPayNow(): void {
		this.commonApplicationService.payNowAnonymous(this.licenceAppId!, 'Payment for Application');
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualPaymentFormUnauthenticated(this.licenceAppId!);
	}
}
