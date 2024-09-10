import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationRequest } from '@app/api/models';
import { BizPortalUserService } from '@app/api/services';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { takeWhile } from 'rxjs';
import { BusinessLicenceApplicationRoutes } from '../business-licence-application-routing.module';

@Component({
	selector: 'app-business-manager-invitation',
	template: `
		<div class="container-fluid text-center mt-4" *ngIf="message">
			<mat-icon class="my-4">error</mat-icon>
			<h1>Business Manager Invitation</h1>
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
export class BusinessManagerInvitationComponent implements OnInit {
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
			BusinessLicenceApplicationRoutes.BUSINESS_MANAGER_INVITATION
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
