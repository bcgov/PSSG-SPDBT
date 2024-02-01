import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { CrrpRoutes } from './crrp-routing.module';

@Component({
	selector: 'app-crrp-org-terms-and-conds',
	template: `
		<div class="container" *ngIf="isAuthenticated | async">
			<section class="step-section my-4">
				<div class="row m-4">
					<div class="col-lg-8 mx-auto">
						<h2>{{ authUserService.bceidUserInfoProfile?.orgName }}</h2>

						<h3 class="subheading fw-normal my-3">Terms and Conditions</h3>
						<p class="mb-4">Read, download, and accept the Terms of Use to continue.</p>

						<app-common-terms-and-conds (isSuccess)="onIsSuccess()"></app-common-terms-and-conds>
					</div>
				</div>
			</section>
		</div>
	`,
	styles: [
		`
			.subheading {
				color: grey;
			}
		`,
	],
})
export class CrrpOrgTermsAndCondsComponent implements OnInit {
	constants = SPD_CONSTANTS;
	isAuthenticated = this.authProcessService.waitUntilAuthentication$;
	invitationId: string | null = null;

	constructor(
		private route: ActivatedRoute,
		protected authUserService: AuthUserBceidService,
		private authProcessService: AuthProcessService,
		private router: Router
	) {}

	async ngOnInit(): Promise<void> {
		this.invitationId = this.route.snapshot.paramMap.get('id');
		if (!this.invitationId) {
			console.debug('CrrpOrgTermsAndCondsComponent - missing invitation id');
			this.router.navigate([AppRoutes.ACCESS_DENIED]);
		}

		await this.authProcessService.initializeCrrpUserInvitation(location.pathname);
	}

	onIsSuccess(): void {
		const url = `${CrrpRoutes.path(CrrpRoutes.INVITATION_ACCEPT)}/${this.invitationId}`;
		this.router.navigate([url]);
	}
}
