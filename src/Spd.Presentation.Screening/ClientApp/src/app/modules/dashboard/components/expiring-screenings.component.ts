import { Component } from '@angular/core';

@Component({
	selector: 'app-expiring-screenings',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Expiring Screenings</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-lg-block alert-icon me-2">schedule</mat-icon>
						<div>
							<div>We are currently processing applications that do NOT require follow-up within:</div>
							<div class="fw-semibold">
								10 business days for online applications and 20 business days for manual applications.
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class ExpiringScreeningsComponent {}
