import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppInviteVerifyRequest } from 'src/app/api/models';
import { ApplicationService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { CrcRoutes } from './crc-routing.module';

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

	constructor(private route: ActivatedRoute, private router: Router, private applicationService: ApplicationService) {}

	async ngOnInit(): Promise<void> {
		const id = this.route.snapshot.paramMap.get('id');

		const invitationRequest: AppInviteVerifyRequest = { inviteEncryptedCode: id };
		this.applicationService
			.apiApplicationInvitationPost$Response({ body: invitationRequest })
			.pipe()
			.subscribe((resp: StrictHttpResponse<any>) => {
				if (resp.status == 202) {
					// returned with error
					this.message = resp.body.message;
				} else {
					// 200 success
					this.router.navigateByUrl(`/${CrcRoutes.MODULE_PATH}`, { state: { orgData: resp.body } });
				}
			});
	}
}
