import { Component } from '@angular/core';

@Component({
	selector: 'app-dashboard-home',
	template: `
		<app-dashboard-header title="Organization Name" subtitle="Security Screening Portal"></app-dashboard-header>
		<section class="step-section my-4 p-md-4 p-sm-0">
			<div class="row">
				<div class="col-sm-12">
					<h2 class="mb-2 fw-normal">Dashboard</h2>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class DashboardHomeComponent {}
