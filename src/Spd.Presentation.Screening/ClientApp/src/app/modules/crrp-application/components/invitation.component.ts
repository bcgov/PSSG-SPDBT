import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationRequest } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';
import { CrrpRoutes } from '../crrp-routing.module';

@Component({
	selector: 'app-invitation',
	template: `
		<div class="container-fluid text-center mt-4" *ngIf="message">
			<h1>Invite Denied</h1>
			<p class="mt-4">
				<strong> {{ message }} </strong>
			</p>
		</div>
	`,
	styles: [],
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
