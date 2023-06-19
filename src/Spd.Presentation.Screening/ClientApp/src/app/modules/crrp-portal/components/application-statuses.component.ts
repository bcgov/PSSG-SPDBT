import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-application-statuses',
	template: `
		<app-crrp-header></app-crrp-header>

		<app-screening-statuses-common
			[portal]="portal.Crrp"
			heading="Application Statuses"
			(emitPayNow)="onPayNow($event)"
			(emitVerifyIdentity)="onVerifyIdentity($event)"
		></app-screening-statuses-common>
	`,
	styles: [],
})
export class ApplicationStatusesComponent {
	portal = PortalTypeCode;

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
