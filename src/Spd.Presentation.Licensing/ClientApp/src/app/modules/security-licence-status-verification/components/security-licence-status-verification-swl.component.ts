import { Component } from '@angular/core';

@Component({
	selector: 'app-security-licence-status-verification-swl',
	template: `
		<section class="step-section">
			<div class="row">
				<div class="col-xxl-11 col-xl-12 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<div class="row">
						<div class="col-xl-8 col-lg-8 col-md-8 col-sm-6 my-auto">
							<h2 class="fs-3">Verify a Security Worker Licence</h2>
						</div>

						<div class="col-xl-4 col-lg-4 col-md-12">
							<div class="d-flex justify-content-end">
								<button
									mat-stroked-button
									color="primary"
									class="large w-auto mb-3"
									aria-label="Back"
									(click)="onCancel()"
								>
									<mat-icon>arrow_back</mat-icon>Back
								</button>
							</div>
						</div>
						<div class="col-12 mb-3">
							<p>
								Enter a security worker licence number, or the full name as it appears on the licence, below. The
								results page will confirm if the licence number is valid and the name of the licensee.
							</p>
						</div>
					</div>
					<mat-divider class="mat-divider-main mb-3"></mat-divider>
				</div>
			</div>
		</section>
		<!-- 
		<div>Verify a Security Worker Licence</div>
		<div>
			Select this option if you have one or a few security worker licence number to check. It will return either VALID
			or INVALID for each licence number entered.
		</div>

		<div>Verify a Security Worker Licence</div>
		<div>
			Enter a security worker licence number, or the full name as it appears on the licence, below. The results page
			will confirm if the licence number is valid and the name of the licensee.
		</div>

		<div>Worker Licence Number:</div>
		<div>First Name:</div>
		<div>Last Name:</div>
		<div>Submit</div>

		<div>Verify a Security Business Licence</div>
		<div>
			Select this option if you have one or a few security business licence numbers or names to check. You may enter a
			minimum of three letters to search by company name or you may enter a licence number. The results page will
			display the Legal Business Name, the Trade Name, the Licence Number, the Licence Status (valid, not valid), and
			the Licence Type of any of the businesses matching the search criteria.
		</div> -->
	`,
	styles: ``,
})
export class SecurityLicenceStatusVerificationSwlComponent {
	title = 'test';
	onCancel(): void {}
}
