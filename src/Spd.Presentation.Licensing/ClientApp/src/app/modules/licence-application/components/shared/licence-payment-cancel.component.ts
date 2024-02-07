import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentLinkCreateRequest, PaymentLinkResponse, PaymentMethodCode } from '@app/api/models';
import { PaymentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { AppRoutes } from '@app/app-routing.module';
import { UtilService } from 'src/app/core/services/util.service';

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
		private utilService: UtilService,
		private paymentService: PaymentService
	) {}

	ngOnInit(): void {
		this.licenceAppId = this.route.snapshot.paramMap.get('id');
		if (!this.licenceAppId) {
			console.debug('LicencePaymentCancelComponent - missing licenceAppId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}
	}

	onPayNow(): void {
		const body: PaymentLinkCreateRequest = {
			applicationId: this.licenceAppId,
			paymentMethod: PaymentMethodCode.CreditCard,
			description: `Payment for Licence Application`,
		};
		this.paymentService
			.apiUnauthLicenceApplicationIdPaymentLinkPost({
				applicationId: this.licenceAppId!,
				body,
			})
			.pipe()
			.subscribe((res: PaymentLinkResponse) => {
				if (res.paymentLinkUrl) {
					window.location.assign(res.paymentLinkUrl);
				}
			});
	}

	onDownloadManualPaymentForm(): void {
		this.paymentService
			.apiUnauthLicenceApplicationIdManualPaymentFormGet$Response({
				applicationId: this.licenceAppId!,
			})
			.pipe()
			.subscribe((resp: StrictHttpResponse<Blob>) => {
				this.utilService.downloadFile(resp.headers, resp.body);
			});
	}
}
