import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-application-statuses',
	template: `
		<app-crrp-header></app-crrp-header>

		<section class="step-section my-3 px-md-4 py-md-3 p-sm-0">
			<div class="row">
				<div class="col-xl-8 col-lg-10 col-md-12 col-sm-12">
					<h2 class="mb-2 fw-normal">Application Statuses</h2>
					<app-applications-banner></app-applications-banner>
				</div>
			</div>

			<app-screening-statuses-common
				portal="CRRP"
				title="Application Statuses"
				(emitPayNow)="onPayNow($event)"
				(emitVerifyIdentity)="onVerifyIdentity($event)"
			></app-screening-statuses-common>
		</section>
	`,
	styles: [],
})
export class ApplicationStatusesComponent {
	constructor(private router: Router) {}

	onPayNow(application: ScreeningStatusResponse): void {
		this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.PAYMENTS), {
			state: { caseId: application.applicationNumber },
		});
	}

	onVerifyIdentity(application: ScreeningStatusResponse): void {
		this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.IDENTITY_VERIFICATION), {
			state: { caseId: application.applicationNumber },
		});
	}
}
