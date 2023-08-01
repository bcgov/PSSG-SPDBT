import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserService } from 'src/app/core/services/auth-user.service';

@Component({
	selector: 'app-criminal-record-checks',
	template: `
		<app-crrp-header></app-crrp-header>

		<app-screening-requests-common
			[portal]="portal.Crrp"
			[orgId]="orgId"
			heading="Criminal Record Check Requests"
			subtitle="Criminal record check request links will expire 14 days after being sent"
		></app-screening-requests-common>
	`,
	styles: [],
})
export class CriminalRecordChecksComponent implements OnInit {
	orgId: string | null = null;
	portal = PortalTypeCode;

	constructor(private router: Router, private authUserService: AuthUserService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('CriminalRecordChecksComponent - orgId', orgId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
	}
}
