import { Component, OnInit } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { MetalDealersApplicationService } from '@app/core/services/metal-dealers-application.service';

@Component({
	selector: 'app-metal-dealers-registration-received',
	template: `
		<app-container>
			<section class="step-section">
				<div class="row">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-6">
								<h2 class="fs-3 mt-0 mt-md-3">Registration Received</h2>
							</div>
						</div>

						<app-alert type="info" icon="info">
							Your registration has been received. A confirmation email will be sent to you. We will contact you if
							additional information is needed.
						</app-alert>
					</div>
				</div>

				<div class="row mt-4 no-print">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<a
							mat-flat-button
							aria-label="Close and navigate to Contact SPD site"
							color="primary"
							class="large w-100"
							[href]="contactSpdUrl"
							>Close</a
						>
					</div>
				</div>
			</section>
		</app-container>
	`,
	styles: [],
	standalone: false,
})
export class MetalDealersRegistrationReceivedComponent implements OnInit {
	contactSpdUrl = SPD_CONSTANTS.urls.contactSpdUrl;

	constructor(private metalDealersApplicationService: MetalDealersApplicationService) {}

	ngOnInit(): void {
		if (this.metalDealersApplicationService.initialized) {
			this.metalDealersApplicationService.reset();
		}
	}
}
