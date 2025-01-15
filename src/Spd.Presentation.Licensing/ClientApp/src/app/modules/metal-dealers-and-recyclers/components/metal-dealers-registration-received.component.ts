import { Component } from '@angular/core';
import { SPD_CONSTANTS } from '@app/core/constants/constants';

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

							<div class="no-print col-6">
								<div class="d-flex justify-content-end">
									<button
										mat-flat-button
										color="primary"
										class="large w-auto m-2"
										aria-label="Print"
										(click)="onPrint()"
									>
										<mat-icon class="d-none d-md-block">print</mat-icon>Print
									</button>
								</div>
							</div>
						</div>

						<mat-divider class="mat-divider-main mb-4"></mat-divider>

						<app-alert type="info" icon="info"> Your registration has been received. </app-alert>

						<div class="my-4 text-center">We will contact you if we need more information.</div>

						<div class="row mb-3">
							<div class="col-md-6 col-sm-12 mt-2">
								<div class="d-block payment__text-label text-md-end">Application Number</div>
							</div>
							<div class="col-md-6 col-sm-12 mt-md-2">
								<div class="payment__text">---</div>
							</div>
							<div class="col-md-6 col-sm-12 mt-2">
								<div class="d-block payment__text-label text-md-end">Business Name</div>
							</div>
							<div class="col-md-6 col-sm-12 mt-md-2">
								<div class="payment__text">---</div>
							</div>
							<div class="col-md-6 col-sm-12 mt-2">
								<div class="d-block payment__text-label text-md-end">Business Owner</div>
							</div>
							<div class="col-md-6 col-sm-12 mt-md-2">
								<div class="payment__text">---</div>
							</div>
						</div>
					</div>
				</div>

				<div class="row mt-4 no-print">
					<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
						<a mat-flat-button color="primary" class="large w-100" [href]="contactSpdUrl">Close</a>
					</div>
				</div>
			</section>
		</app-container>
	`,
	styles: [],
	standalone: false,
})
export class MetalDealersRegistrationReceivedComponent {
	contactSpdUrl = SPD_CONSTANTS.urls.contactSpdUrl;

	onPrint(): void {
		window.print();
	}
}
