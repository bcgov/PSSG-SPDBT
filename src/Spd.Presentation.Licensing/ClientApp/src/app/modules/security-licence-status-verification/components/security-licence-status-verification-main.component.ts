import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityLicenceStatusVerificationRoutes } from '../security-licence-status-verification-routes';

@Component({
	selector: 'app-security-licence-status-verification-main',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-12 my-auto">
							<h2 class="fs-3">Security licence status verification</h2>
						</div>
					</div>

					<mat-divider class="mat-divider-main mb-4"></mat-divider>
					<div class="text-minor-heading my-3">Verify a security worker licence</div>

					<div class="row">
						<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
							<app-alert type="info" icon="">
								Choose this option to check one or more security worker licence numbers. The system will show either
								VALID or INVALID for each number entered.
							</app-alert>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<button mat-flat-button color="primary" class="large" (click)="onVerifySwl()">
								Verify a security worker licence
							</button>
						</div>
					</div>

					<mat-divider class="mt-3 mb-4"></mat-divider>
					<div class="text-minor-heading my-3">Verify a security business licence</div>

					<div class="row">
						<div class="col-xl-8 col-lg-6 col-md-12 col-sm-12">
							<app-alert type="info" icon="">
								Select this option if you have one or a few security business licence numbers or names to check. You may
								enter a minimum of three letters to search by company name or you may enter a licence number. The
								results page will display the Legal Business Name, the Trade Name, the Licence Number, the Licence
								Status (valid, not valid), and the Licence Type of any of the businesses matching the search criteria.
							</app-alert>
						</div>
						<div class="col-xl-4 col-lg-6 col-md-12 col-sm-12">
							<button mat-flat-button color="primary" class="large" (click)="onVerifySbl()">
								Verify a security business licence
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
	standalone: false,
})
export class SecurityLicenceStatusVerificationMainComponent {
	constructor(private router: Router) {}

	onVerifySwl(): void {
		this.router.navigateByUrl(
			SecurityLicenceStatusVerificationRoutes.path(
				SecurityLicenceStatusVerificationRoutes.SECURITY_LICENCE_STATUS_VERIFICATION_SWL
			)
		);
	}

	onVerifySbl(): void {
		this.router.navigateByUrl(
			SecurityLicenceStatusVerificationRoutes.path(
				SecurityLicenceStatusVerificationRoutes.SECURITY_LICENCE_STATUS_VERIFICATION_SBL
			)
		);
	}
}
