import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, IsActiveMatchOptions, QueryParamsHandling, Router } from '@angular/router';
import { lastValueFrom, take } from 'rxjs';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserBceidService } from 'src/app/core/services/auth-user-bceid.service';
import { CrrpRoutes } from './crrp-routing.module';

export interface NavigationItemType {
	label: string;
	path: string;
	routerLinkActiveOptions: IsActiveMatchOptions;
	accesslevel: 'all' | 'onlyAdmin';
	icon?: string;
	queryParamsHandling?: QueryParamsHandling;
}

// https://angular.io/api/router/IsActiveMatchOptions
export const DefaultRouterLinkActiveOptions: IsActiveMatchOptions = {
	matrixParams: 'ignored',
	paths: 'exact',
	fragment: 'ignored',
	queryParams: 'ignored',
};

@Component({
	selector: 'app-crrp',
	template: `
		<div class="container-fluid p-0" *ngIf="isAuthenticated | async">
			<!-- Hide the lhs menu when displaying the 'first time user' terms and conditions -->
			<div
				#firstTimeUserLink="routerLinkActive"
				[routerLink]="[crrpRoutes.path(crrpRoutes.ORG_TERMS_AND_CONDITIONS)]"
				routerLinkActive="d-none"
			></div>

			<div class="row flex-nowrap m-0" *ngIf="isReadyToDisplay">
				<div
					class="col-auto mat-sidenav px-0"
					[ngClass]="firstTimeUserLink.isActive ? 'd-none' : 'd-block'"
					style="background-color: var(--color-sidebar);"
				>
					<div
						class="d-flex flex-column align-items-sm-start pt-2 text-white "
						style="min-height: calc(100vh - 138px)!important;"
					>
						<a tabindex="-1" [routerLink]="[crrpRoutes.path(crrpRoutes.HOME)]" class="nav-link d-flex text-white w-100">
							<span class="d-none d-sm-inline mx-3 mt-2">Menu</span>
						</a>
						<hr class="d-none d-sm-inline w-100 text-white" />
						<ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-sm-start w-100">
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.HOME)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>house</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline">Dashboard</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.APPLICATION_STATUSES)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>people</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Application Statuses</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.CRIMINAL_RECORD_CHECKS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>post_add</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Criminal Record Checks</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.EXPIRING_CHECKS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>alarm</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Expiring Checks</span>
								</a>
							</li>
							<li class="nav-item w-100" *ngIf="isNotVolunteerOrg">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.PAYMENTS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>payment</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Payments</span>
								</a>
							</li>
							<hr class="d-none d-sm-inline w-100 text-white" />
							<li class="nav-item w-100" *ngIf="authUserService.isAllowedGenericUpload">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.GENERIC_UPLOADS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>cloud_upload</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Generic Uploads</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.IDENTITY_VERIFICATION)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>fingerprint</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Identity Verification</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.MANUAL_SUBMISSIONS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>description</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Manual Submissions</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.REPORTS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>article</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Monthly Reports</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.USERS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>person</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">User Management</span>
								</a>
							</li>
							<hr class="d-none d-sm-inline w-100 text-white" />
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.path(crrpRoutes.ORGANIZATION_PROFILE)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>settings</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Organization Profile</span>
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div class="col mat-sidenav-content py-3">
					<router-outlet></router-outlet>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.menu-item {
				top: -5px;
				position: relative;
			}
		`,
	],
})
export class CrrpComponent implements OnInit {
	isAuthenticated = this.authProcessService.waitUntilAuthentication$;
	isNotVolunteerOrg = false;
	isReadyToDisplay = false; // Prevent 'flashing' of home page before displaying first-time-user terms
	crrpRoutes = CrrpRoutes;

	constructor(
		private route: ActivatedRoute,
		protected authUserService: AuthUserBceidService,
		private authProcessService: AuthProcessService,
		private router: Router
	) {}

	async ngOnInit(): Promise<void> {
		// If an org id is supplied, use it as the user's selected organization during login
		const queryParams = await lastValueFrom(this.route.queryParams.pipe(take(1)));
		const defaultOrgId: string | undefined = queryParams['orgId'];

		const currentPath = location.pathname;
		// to handle relative urls, look for '/crrp/' to get the default route
		const startOfRoute = currentPath.indexOf('/' + CrrpRoutes.MODULE_PATH + '/');
		const defaultRoute = currentPath.substring(startOfRoute);

		console.debug('currentPath', currentPath, 'defaultRoute', defaultRoute);

		const nextRoute = await this.authProcessService.initializeCrrp(defaultOrgId, defaultRoute);

		if (this.authUserService.bceidUserInfoProfile?.isFirstTimeLogin) {
			this.router.navigateByUrl(CrrpRoutes.path(CrrpRoutes.ORG_TERMS_AND_CONDITIONS));
			this.isReadyToDisplay = true;
			return;
		}

		this.isReadyToDisplay = true;
		this.isNotVolunteerOrg = this.authUserService.bceidUserOrgProfile?.isNotVolunteerOrg ?? false;

		if (nextRoute) {
			await this.router.navigate([nextRoute], { queryParams: { orgId: defaultOrgId } });
		}
	}
}
