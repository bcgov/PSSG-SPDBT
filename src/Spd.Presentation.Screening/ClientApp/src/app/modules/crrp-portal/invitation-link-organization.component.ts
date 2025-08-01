import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { OrgInviteVerifyResponse } from 'src/app/api/models';
import { OrgService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routes';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { CrrpRoutes } from './crrp-routes';

@Component({
    selector: 'app-invitation-link-organization',
    template: `
		@if (message) {
		  <div class="container-fluid text-center mt-4">
		    <mat-icon>no_accounts</mat-icon>
		    <h1>Invite Denied</h1>
		    <h4 class="mt-4">
		      {{ message }}
		    </h4>
		    <p class="mt-4">Please contact your primary authorized user for assistance.</p>
		  </div>
		}
		`,
    styles: [
        `
			.mat-icon {
				font-size: 50px;
				width: 50px;
				height: 50px;
				vertical-align: bottom;
				margin-right: 4px;
			}
		`,
    ],
    standalone: false
})
export class InvitationLinkOrganizationComponent implements OnInit {
	message = '';

	private subscribeAlive = true;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private orgService: OrgService,
		private authProcessService: AuthProcessService
	) {}

	async ngOnInit(): Promise<void> {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) {
			console.debug('InvitationLinkOrganizationComponent - missing id');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		let defaultOrgId = '';

		const currentPath = location.pathname;
		// to handle relative urls, look for '/crrp/' to get the default route
		const startOfRoute = currentPath.indexOf('/' + CrrpRoutes.MODULE_PATH + '/');
		const defaultRoute = currentPath.substring(startOfRoute);

		this.orgService
			.apiOrgsInviteLinkVerifyGet({ encodedOrgId: id! })
			.pipe()
			.subscribe(async (resp: OrgInviteVerifyResponse) => {
				console.debug('InvitationLinkOrganizationComponent apiOrgsInviteLinkVerifyGet', resp);
				if (!resp.linkIsValid) {
					this.message = resp.errMsg!;
					return;
				}

				defaultOrgId = resp.orgId!;
				await this.authProcessService.initializeCrrpOrgLinkBceid(defaultOrgId!, defaultRoute);
			});

		this.authProcessService.waitUntilAuthentication$
			.pipe(takeWhile(() => this.subscribeAlive))
			.subscribe((isLoggedIn: boolean) => {
				if (isLoggedIn) {
					this.subscribeAlive = false;

					this.router.navigate([CrrpRoutes.path(CrrpRoutes.HOME)], { queryParams: { orgId: defaultOrgId } });
				}
			});
	}
}
