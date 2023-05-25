import { Component } from '@angular/core';

@Component({
	selector: 'app-screening-statuses',
	template: `
		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Screening Statuses</h2>
					<!-- <app-banner></app-banner> -->
				</div>
			</div>

			<app-status-statistics></app-status-statistics>
		</section>
	`,
	styles: [],
})
export class ScreeningStatusesComponent {}
