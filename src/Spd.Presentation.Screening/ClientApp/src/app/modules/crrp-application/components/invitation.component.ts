import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationRequest } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
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

	constructor(private route: ActivatedRoute, private router: Router, private orgUserService: OrgUserService) {}

	async ngOnInit(): Promise<void> {
		const id = this.route.snapshot.paramMap.get('id');
		const invitationRequest: InvitationRequest = { inviteEncryptedCode: id };

		this.orgUserService
			.apiInvitationPost({ body: invitationRequest })
			.pipe()
			.subscribe((resp: any) => {
				if (resp && resp.isError) {
					this.message = resp.message;
				} else {
					this.router.navigate([CrrpRoutes.crrpPath(CrrpRoutes.HOME)], {
						queryParams: { showMenu: true },
					});
				}
			});
	}
}
