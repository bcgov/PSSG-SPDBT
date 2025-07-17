import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app-routes';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-licence-payment-cancel',
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
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
		}
	}

	onPayNow(): void {
		this.commonApplicationService.payNowPersonalLicenceAuthenticated(this.licenceAppId!);
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualPaymentFormAuthenticated(this.licenceAppId!);
	}
}
