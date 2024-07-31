import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from '@app/app-routing.module';
import { ApplicationService } from '@app/core/services/application.service';

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
})
export class LicencePaymentCancelAnonymousComponent implements OnInit {
	licenceAppId: string | null = null;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private commonApplicationService: ApplicationService
	) {}

	ngOnInit(): void {
		this.licenceAppId = this.route.snapshot.paramMap.get('id');
		if (!this.licenceAppId) {
			console.debug('LicencePaymentCancelAnonymousComponent - missing licenceAppId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
	}

	onPayNow(): void {
		this.commonApplicationService.payNowAnonymous(this.licenceAppId!, 'Payment for Application/Licence');
	}

	onDownloadManualPaymentForm(): void {
		this.commonApplicationService.downloadManualPaymentFormUnauthenticated(this.licenceAppId!);
	}
}
