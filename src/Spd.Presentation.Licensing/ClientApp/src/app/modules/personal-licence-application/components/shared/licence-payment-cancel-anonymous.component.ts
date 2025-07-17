import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app-routes';
import { CommonApplicationService } from '@app/core/services/common-application.service';

@Component({
	selector: 'app-licence-payment-cancel-anonymous',
	template: `
		<app-container>
			<section class="step-section">
				<app-payment-cancel
					(payNow)="onPayNow()"
					(downloadManualPaymentForm)="onDownloadManualPaymentForm()"
				></app-payment-cancel>
			</section>
		</app-container>
	`,
	styles: [],
	standalone: false,
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
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
		}
	}

	onPayNow(): void {
		this.commonApplicationService.payNowPersonalLicenceAnonymous(this.licenceAppId!);
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualPaymentFormUnauthenticated(this.licenceAppId!);
	}
}
