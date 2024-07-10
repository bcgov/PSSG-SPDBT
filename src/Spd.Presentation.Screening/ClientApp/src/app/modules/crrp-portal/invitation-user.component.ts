import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeWhile } from 'rxjs';
import { InvitationRequest } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
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

	private subscribeAlive = true;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authProcessService: AuthProcessService,
		private orgUserService: OrgUserService
	) {}

	async ngOnInit(): Promise<void> {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) {
			console.debug('InvitationUserComponent - missing id');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		await this.authProcessService.initializeCrrpUserInvitation(id!);

		this.authProcessService.waitUntilAuthentication$
			.pipe(takeWhile(() => this.subscribeAlive))
			.subscribe((isLoggedIn: boolean) => {
				if (isLoggedIn) {
					this.subscribeAlive = false;

					const invitationRequest: InvitationRequest = { inviteEncryptedCode: id };
					this.orgUserService
						.apiUserInvitationPost({ body: invitationRequest })
						.pipe()
						.subscribe(async (resp: any) => {
							console.debug('InvitationUserComponent apiUserInvitationPost', resp);

							if (resp?.isError) {
								this.message = resp.message;
							} else {
								const defaultOrgId = resp.orgId;

								await this.authProcessService.initializeCrrp(defaultOrgId);
								this.router.navigate([CrrpRoutes.path(CrrpRoutes.HOME)], { queryParams: { orgId: defaultOrgId } });
							}
						});
				}
			});
	}
}
