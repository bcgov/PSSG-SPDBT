import { Component } from '@angular/core';

@Component({
	selector: 'app-dashboard-home',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-4 p-md-4 p-sm-0">
			<div class="row">
				<div class="col-sm-12">
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-md-block alert-icon me-2">schedule</mat-icon>
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
export class DashboardHomeComponent {}
