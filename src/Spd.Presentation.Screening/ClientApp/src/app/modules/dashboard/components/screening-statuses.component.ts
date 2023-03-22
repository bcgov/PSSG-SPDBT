import { Component } from '@angular/core';

@Component({
	selector: 'app-screening-statuses',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Screening Statuses</h2>
					<div class="alert alert-warning d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-md-block alert-icon me-2">warning</mat-icon>
						<div>We are currently processing applications that do not require follow-up in up to 10 business days</div>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class ScreeningStatusesComponent {}
