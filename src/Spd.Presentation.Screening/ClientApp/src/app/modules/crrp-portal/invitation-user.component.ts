import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationRequest } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { CrrpRoutes } from './crrp-routing.module';

@Component({
	selector: 'app-invitation',
	template: `
		<div class="container-fluid text-center mt-4" *ngIf="message">
			<mat-icon>no_accounts</mat-icon>
			<h1>Invite Denied</h1>
			<h4 class="mt-4">
				{{ message }}
			</h4>
			<p class="mt-4">Please contact your primary authorized user for assistance.</p>
		</div>
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
})
export class InvitationUserComponent implements OnInit {
	message = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authUserService: AuthUserBceidService,
		private orgUserService: OrgUserService
	) {}

	async ngOnInit(): Promise<void> {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) {
			console.debug('InvitationUserComponent - missing id');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		if (id) {
			const invitationRequest: InvitationRequest = { inviteEncryptedCode: id };
			this.orgUserService
				.apiUserInvitationPost({ body: invitationRequest })
				.pipe()
				.subscribe((resp: any) => {
					if (resp?.isError) {
						this.message = resp.message;
					} else {
						const defaultOrgId = this.authUserService.bceidUserInfoProfile?.orgId;
						this.router.navigate([CrrpRoutes.path(CrrpRoutes.HOME)], { queryParams: { orgId: defaultOrgId } });
					}
				});
		}
	}
}
