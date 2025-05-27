import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routes';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserIdirService } from 'src/app/core/services/auth-user-idir.service';

@Component({
    selector: 'app-identity-verification',
    template: `
		<app-psso-header></app-psso-header>

		<app-identify-verification-common
			[portal]="portal.Psso"
			[isPsaUser]="isPsaUser"
			[orgId]="orgId"
			[userId]="userId"
		></app-identify-verification-common>
	`,
    styles: [],
    standalone: false
})
export class IdentityVerificationComponent implements OnInit {
	orgId: string | null = null;
	userId: string | null = null;
	portal = PortalTypeCode;
	isPsaUser: boolean | undefined = this.authUserService.idirUserWhoamiProfile?.isPSA;

	constructor(private router: Router, private authUserService: AuthUserIdirService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.idirUserWhoamiProfile?.orgId;
		if (!orgId) {
			console.debug('IdentityVerificationComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
		this.userId = this.authUserService.idirUserWhoamiProfile?.userId!;
	}
}
