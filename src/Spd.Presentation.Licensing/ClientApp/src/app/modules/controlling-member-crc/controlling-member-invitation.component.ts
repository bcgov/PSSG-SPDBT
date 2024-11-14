import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BizMembersService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { UtilService } from '@app/core/services/util.service';
import { ControllingMemberCrcRoutes } from './controlling-member-crc-routes';

@Component({
	selector: 'app-controlling-member-invitation',
	template: `
		<div class="container-fluid text-center mt-4" *ngIf="message">
			<mat-icon class="my-4">error</mat-icon>
			<h1>CRC Invitation</h1>
			<h2 class="mt-4">
				{{ message }}
			</h2>
			<p class="mt-4">Please contact your business manager for assistance.</p>
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
export class ControllingMemberInvitationComponent implements OnInit {
	message = '';

	constructor(
		private route: ActivatedRoute,
		private utilService: UtilService,
		private router: Router,
		private bizMembersService: BizMembersService
	) {}

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (!id) {
			console.debug('ControllingMemberInvitationComponent - missing id');
			this.message = 'A CRC Invitation link must be clicked before navigating to this page';
			return;
		}

		this.utilService.clearSessionData(SPD_CONSTANTS.sessionStorage.cmCrcStateKey);

		const body = { inviteEncryptedCode: id };
		this.bizMembersService
			.apiControllingMembersInvitesPost$Response({ body })
			.pipe()
			.subscribe((resp: StrictHttpResponse<any>) => {
				if (resp.status == 202) {
					// returned with error
					this.message = resp.body.message;
				} else {
					// 200 success
					this.router.navigateByUrl(
						`/${ControllingMemberCrcRoutes.MODULE_PATH}/${ControllingMemberCrcRoutes.CONTROLLING_MEMBER_LOGIN}`,
						{
							state: { crcInviteData: resp.body },
						}
					);
				}
			});
	}
}
