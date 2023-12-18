import { Component } from '@angular/core';

@Component({
	selector: 'app-step-confirm-updates',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm the updates for your licence or permit"></app-step-title>

				<div class="row mb-3">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<!-- <div class="text-minor-heading mt-4">Licence Information</div> -->
						<div class="row mt-0">
							<div class="col-lg-4 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Holder Name</div>
								<div class="summary-text-data">a</div>
							</div>
							<div class="col-lg-4 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Number</div>
								<div class="summary-text-data">b</div>
							</div>
							<div class="col-lg-4 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2 mt-lg-0">Expiry Date</div>
								<div class="summary-text-data">c</div>
							</div>
							<div class="col-lg-4 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2 mt-lg-0">Licence Term</div>
								<div class="summary-text-data">c</div>
							</div>
							<div class="col-lg-4 col-md-12 mt-lg-2">
								<div class="text-label d-block text-muted mt-2 mt-lg-0">Reprint Fee</div>
								<div class="summary-text-data">$20</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			.text-minor-heading {
				font-size: 1.1rem !important;
				color: var(--color-primary-light) !important;
				font-weight: 300 !important;
			}

			.text-label {
				font-size: 0.9rem !important;
			}
		`,
	],
})
export class StepConfirmUpdatesComponent {}
