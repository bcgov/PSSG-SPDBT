import { Component } from '@angular/core';

@Component({
	selector: 'app-security-licence-status-verification-main',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-12 my-auto">
							<h2 class="fs-3">Security Licence Status Verification</h2>
						</div>
					</div>

					<div class="text-minor-heading my-3">Verify a Security Worker Licence</div>

					<div class="row">
						<div class="col-lg-8 col-md-12 col-sm-12">
							<div class="lh-base">
								Select this option if you have one or a few security worker licence number to check. It will return
								either VALID or INVALID for each licence number entered.
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-12 text-end">
							<button mat-flat-button color="primary" class="large w-auto" (click)="onVerifySwl()">
								Verify a Security Worker Licence
							</button>
						</div>
					</div>

					<mat-divider class="mb-3 mt-4 mat-divider-primary"></mat-divider>
					<div class="text-minor-heading my-3">Verify a Security Business Licence</div>

					<div class="row">
						<div class="col-lg-8 col-md-12 col-sm-12">
							<div class="lh-base">
								Select this option if you have one or a few security business licence numbers or names to check. You may
								enter a minimum of three letters to search by company name or you may enter a licence number. The
								results page will display the Legal Business Name, the Trade Name, the Licence Number, the Licence
								Status (valid, not valid), and the Licence Type of any of the businesses matching the search criteria.
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-12 text-end">
							<button mat-flat-button color="primary" class="large w-auto" (click)="onVerifySbl()">
								Verify a Security Business Licence
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: ``,
})
export class SecurityLicenceStatusVerificationMainComponent {
	title = 'test';
	onCancel(): void {}
	onVerifySwl(): void {}
	onVerifySbl(): void {}
}
