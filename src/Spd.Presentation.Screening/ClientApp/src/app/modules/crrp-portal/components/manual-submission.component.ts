import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';

@Component({
	selector: 'app-manual-submission',
	template: `
		<app-crrp-header></app-crrp-header>

		<app-manual-submission-common [portal]="portal.Crrp" [orgId]="orgId"></app-manual-submission-common>
	`,
	styles: [],
})
export class ManualSubmissionComponent implements OnInit {
	orgId: string | null = null;
	portal = PortalTypeCode;

	constructor(private router: Router, private authUserService: AuthUserBceidService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('ManualSubmissionComponent - orgId', orgId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
	}
}
