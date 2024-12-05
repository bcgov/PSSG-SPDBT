import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityLicenceStatusVerificationRoutes } from '../security-licence-status-verification-routes';

@Component({
	selector: 'app-security-licence-status-verification-sbl',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Verify a Security Business Licence</h2>
						</div>

						<div class="col-xl-4 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onBack()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
						<div class="col-12 mb-3">
							<app-alert type="info" icon="">
								Select this option if you have one or a few security business licence numbers or names to check. You may
								enter a minimum of three letters to search by company name or you may enter a licence number. The
								results page will display the Legal Business Name, the Trade Name, the Licence Number, the Licence
								Status (valid, not valid), and the Licence Type of any of the businesses matching the search criteria.
							</app-alert>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>
				</div>
			</div>
		</section>
	`,
	styles: ``,
})
export class SecurityLicenceStatusVerificationSblComponent {
	constructor(private router: Router) {}

	onBack(): void {
		this.router.navigateByUrl(SecurityLicenceStatusVerificationRoutes.path());
	}
}
