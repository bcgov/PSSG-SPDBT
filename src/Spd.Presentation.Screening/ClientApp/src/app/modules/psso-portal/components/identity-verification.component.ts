import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';

@Component({
	selector: 'app-identity-verification',
	template: `
		<app-identify-verification-common [portal]="portal.Psso" [orgId]="orgId"></app-identify-verification-common>
	`,
	styles: [],
})
export class IdentityVerificationComponent implements OnInit {
	orgId: string | null = null;
	portal = PortalTypeCode;

	constructor(private router: Router, private authUserService: AuthUserIdirService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.idirUserWhoamiProfile?.orgId;
		if (!orgId) {
			console.debug('IdentityVerificationComponent - orgId', orgId);
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
	}
}
