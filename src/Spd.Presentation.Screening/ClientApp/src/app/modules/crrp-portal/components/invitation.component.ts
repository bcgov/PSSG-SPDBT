import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationRequest } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { LoginTypeCode } from 'src/app/core/code-types/login-type.model';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CrrpRoutes } from '../crrp-routing.module';

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
export class InvitationComponent {
	message = '';

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authenticationService: AuthenticationService,
		private orgUserService: OrgUserService
	) {}

	async ngOnInit(): Promise<void> {
		const id = this.route.snapshot.paramMap.get('id');
		const invitationRequest: InvitationRequest = { inviteEncryptedCode: id };

		this.orgUserService
			.apiUserInvitationPost({ body: invitationRequest })
			.pipe()
			.subscribe((resp: any) => {
				if (resp?.isError) {
					this.message = resp.message;
				} else {
					this.authenticationService.login(LoginTypeCode.Bceid, CrrpRoutes.path()).then((_resp) => {
						this.router.navigate([CrrpRoutes.path(CrrpRoutes.HOME)]);
					});
				}
			});
	}
}
