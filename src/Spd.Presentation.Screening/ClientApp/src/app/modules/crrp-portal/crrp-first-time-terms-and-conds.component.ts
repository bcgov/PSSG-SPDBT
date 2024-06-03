import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { CrrpRoutes } from './crrp-routing.module';

@Component({
	selector: 'app-crrp-first-time-terms-and-conds',
	template: `
		<div class="container">
			<section class="step-section my-4">
				<div class="row m-4">
					<div class="col-lg-10 mx-auto">
						<h2>Terms and Conditions</h2>

						<p class="mb-4">Read, download, and accept the Terms of Use to continue.</p>

						<app-crrp-terms-and-conds (isSuccess)="onIsSuccess()"></app-crrp-terms-and-conds>
					</div>
				</div>
			</section>
		</div>
	`,
	styles: [],
})
export class CrrpFirstTimeTermsAndCondsComponent implements OnInit {
	constructor(
		private router: Router,
		private authProcessService: AuthProcessService,
		private authUserService: AuthUserBceidService
	) {}

	ngOnInit(): void {
		const isLoggedIn = this.authProcessService.getCurrentWaitUntilAuthenticatedValue();
		if (!isLoggedIn) {
			this.router.navigate([AppRoutes.LANDING]);
		}
	}

	onIsSuccess(): void {
		const nextRoute = CrrpRoutes.path(CrrpRoutes.HOME);
		const defaultOrgId = this.authUserService.bceidUserOrgProfile?.id;
		this.router.navigate([nextRoute], { queryParams: { orgId: defaultOrgId } });
	}
}
