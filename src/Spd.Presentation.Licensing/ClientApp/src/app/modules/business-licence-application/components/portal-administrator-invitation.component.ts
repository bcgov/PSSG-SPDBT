import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationRequest } from '@app/api/models';
import { BizPortalUserService } from '@app/api/services';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { takeWhile } from 'rxjs';

@Component({
	selector: 'app-portal-administrator-invitation',
	template: `
		@if (message) {
			<div class="container-fluid text-center mt-4">
				<mat-icon class="my-4">error</mat-icon>
				<h1>Portal Administrator Invitation</h1>
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
	standalone: false,
})
export class PortalAdministratorInvitationComponent implements OnInit {
	message = '';

	private subscribeAlive = true;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authProcessService: AuthProcessService,
		private bizPortalUserService: BizPortalUserService
	) {}

	async ngOnInit(): Promise<void> {
		const id = this.route.snapshot.paramMap.get('id');

		const redirectComponentRoute = `${BusinessLicenceApplicationRoutes.path(
			BusinessLicenceApplicationRoutes.PORTAL_ADMINISTRATOR_INVITATION
		)}/${id}`;

		// if the user is logged in to BCSC, log them out.
		this.authProcessService.logoutBcsc(redirectComponentRoute);

		await this.authProcessService.initializeBusinessLicenceInvitationBCeID(id!);

		this.authProcessService.waitUntilAuthentication$
			.pipe(takeWhile(() => this.subscribeAlive))
			.subscribe((isLoggedIn: boolean) => {
				if (isLoggedIn) {
					this.subscribeAlive = false;

					const invitationRequest: InvitationRequest = { inviteEncryptedCode: id };
					this.bizPortalUserService
						.apiBusinessPortalUsersInvitationPost({ body: invitationRequest })
						.pipe()
						.subscribe(async (resp: any) => {
							console.debug('InvitationUserComponent apiBusinessPortalUsersInvitationPost response', resp);

							if (resp?.isError) {
								this.message = resp.message;
							} else {
								const defaultBizId = resp.bizId;

								await this.authProcessService.initializeLicencingBCeID(defaultBizId);
								this.router.navigate([BusinessLicenceApplicationRoutes.pathBusinessLicence()], {
									queryParams: { bizId: defaultBizId },
								});
							}
						});
				}
			});
	}
}
