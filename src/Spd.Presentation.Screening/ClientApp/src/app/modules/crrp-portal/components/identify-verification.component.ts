import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routes';
import { PortalTypeCode } from 'src/app/core/code-types/portal-type.model';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';

@Component({
    selector: 'app-identify-verification',
    template: `
		<app-crrp-header></app-crrp-header>

		<app-identify-verification-common [portal]="portal.Crrp" [orgId]="orgId"></app-identify-verification-common>
	`,
    styles: [],
    standalone: false
})
export class IdentifyVerificationComponent implements OnInit {
	orgId: string | null = null;
	portal = PortalTypeCode;

	constructor(private router: Router, private authUserService: AuthUserBceidService) {}

	ngOnInit(): void {
		const orgId = this.authUserService.bceidUserInfoProfile?.orgId;
		if (!orgId) {
			console.debug('IdentifyVerificationComponent - missing orgId');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
			return;
		}

		this.orgId = orgId;
	}
}
