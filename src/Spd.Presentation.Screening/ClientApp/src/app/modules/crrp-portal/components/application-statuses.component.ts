import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routes';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { ScreeningStatusResponse } from 'src/app/shared/components/screening-statuses-common.component';
import { CrrpRoutes } from '../crrp-routes';

@Component({
    selector: 'app-application-statuses',
    template: `
		<app-crrp-header></app-crrp-header>

		<app-screening-statuses-common
			[orgId]="orgId"
			[portal]="portal.Crrp"
			heading="Application Statuses"
			(emitPayNow)="onPayNow($event)"
			(emitVerifyIdentity)="onVerifyIdentity($event)"
		></app-screening-statuses-common>
	`,
    styles: [],
    standalone: false
})
export class ApplicationStatusesComponent implements OnInit {
	portal = PortalTypeCode;
	orgId = '';

	constructor(private router: Router, private authUserService: AuthUserBceidService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('ApplicationStatusesComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
	}

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
