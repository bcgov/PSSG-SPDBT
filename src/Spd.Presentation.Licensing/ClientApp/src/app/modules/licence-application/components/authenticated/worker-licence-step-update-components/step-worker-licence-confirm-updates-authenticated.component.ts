import { Component } from '@angular/core';

@Component({
	selector: 'app-step-worker-licence-confirm-updates-authenticated',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm the updates for your licence or permit"></app-step-title>

				<div class="row mb-3">
					<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
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
	styles: [],
})
export class StepWorkerLicenceConfirmUpdatesAuthenticatedComponent {}
