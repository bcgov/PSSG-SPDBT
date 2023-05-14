import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationRequest } from 'src/app/api/models';
import { OrgUserService } from 'src/app/api/services';

@Component({
	selector: 'app-invitation',
	template: `
		<div class="row">
			<div class="col-xl-6 col-lg-5 col-md-6 col-sm-12 mx-auto mt-4 p-4">
				<section class="step-section m-4 px-md-4 py-md-3 p-sm-0">
					<h2 class="mb-2 fw-normal">Invitation</h2>
					<div class="alert alert-danger d-flex align-items-center" role="alert">
						<mat-icon class="d-none d-lg-block alert-icon me-2">warning</mat-icon>
						<div>
							<div>Invitation failed:</div>
							<div class="fw-semibold">The invitation has expired</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	`,
	styles: [],
})
export class InvitationComponent {
	constructor(private route: ActivatedRoute, private router: Router, private orgUserService: OrgUserService) {}

	async ngOnInit(): Promise<void> {
		console.log('[InvitationComponent] paramMap', this.route.snapshot.paramMap);
		const id = this.route.snapshot.paramMap.get('id');
		console.log('[InvitationComponent] paramMap keys', id);

		var invitationRequest: InvitationRequest = { inviteEncryptedCode: id };
		this.orgUserService
			.apiInvitationPost({ body: invitationRequest })
			.pipe()
			.subscribe((_resp: any) => {
				console.debug('[InvitationComponent] apiInvitationsPost', _resp);
				// this.router.navigateByUrl(CrrpRoutes.crrpPath(CrrpRoutes.HOME));
			});
	}
}
