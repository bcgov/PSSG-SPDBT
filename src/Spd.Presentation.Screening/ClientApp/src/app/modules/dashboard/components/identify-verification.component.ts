import { Component } from '@angular/core';

@Component({
	selector: 'app-identify-verification',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-4 p-md-4 p-sm-0">
			<div class="row">
				<div class="col-12">
					<h2 class="mb-2 fw-normal">
						Identity Verification
						<div class="mt-2 fs-5 fw-light">Confirm the applicant's identity</div>
					</h2>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class IdentifyVerificationComponent {}
