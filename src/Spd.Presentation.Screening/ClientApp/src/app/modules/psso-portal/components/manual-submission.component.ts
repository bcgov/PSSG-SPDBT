import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';

@Component({
	selector: 'app-manual-submission',
	template: ` <app-manual-submission-common [portal]="portal.Psso" [orgId]="orgId"></app-manual-submission-common> `,
	styles: [],
})
export class ManualSubmissionComponent implements OnInit {
	orgId: string | null = null;
	portal = PortalTypeCode;

	constructor(private router: Router, private authUserService: AuthUserIdirService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.idirUserWhoamiProfile?.orgId;
		if (!orgId) {
			console.debug('ManualSubmissionComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
	}
}
