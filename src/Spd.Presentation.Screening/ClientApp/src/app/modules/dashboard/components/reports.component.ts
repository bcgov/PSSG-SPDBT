import { Component } from '@angular/core';

@Component({
	selector: 'app-reports',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Reports</h2>
					<div class="mt-2 fs-5 fw-light">These are the available reports</div>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class ReportsComponent {}
