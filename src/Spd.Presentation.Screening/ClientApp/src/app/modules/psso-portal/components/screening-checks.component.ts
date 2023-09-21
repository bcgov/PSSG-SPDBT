import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';

@Component({
	selector: 'app-screening-checks',
	template: `
		<app-psso-header></app-psso-header>

		<app-screening-requests-common
			[portal]="portal.Psso"
			[isPsaUser]="isPsaUser"
			[orgId]="orgId"
			heading="Screening Checks"
			subtitle="Screening check links will expire 14 days after being sent"
		></app-screening-requests-common>
	`,
	styles: [],
})
export class ScreeningChecksComponent implements OnInit {
	orgId: string | null = null;
	portal = PortalTypeCode;
	isPsaUser: boolean | undefined = this.authUserService.idirUserWhoamiProfile?.isPSA;

	constructor(private router: Router, private authUserService: AuthUserIdirService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.idirUserWhoamiProfile?.orgId;
		if (!orgId) {
			console.debug('ScreeningChecksComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
	}

	onAddScreeningRequest(): void {}
}
