import { Component } from '@angular/core';
import { IsActiveMatchOptions, NavigationEnd, QueryParamsHandling, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CrrpRoutes } from './crrp-routing.module';

// export const DefaultRouterLinkActiveOptions: IsActiveMatchOptions = {
// 	matrixParams: 'ignored',
// 	paths: 'exact',
// 	fragment: 'ignored',
// 	queryParams: 'ignored',
// };

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
			<div class="row flex-nowrap m-0">
				<div class="col-auto px-0" style="background-color: var(--color-sidebar);" *ngIf="showNavigation">
					<div
						class="d-flex flex-column align-items-sm-start pt-2 text-white "
						style="min-height: calc(100vh - 138px)!important;"
					>
						<a [routerLink]="[crrpRoutes.crrpPath(crrpRoutes.HOME)]" class="nav-link d-flex text-white w-100">
							<span class="d-none d-sm-inline mx-3 mt-2">Menu</span>
						</a>
						<hr class="d-none d-sm-inline w-100 text-white" />
						<ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-sm-start w-100">
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.HOME)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>house</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline">Dashboard</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.APPLICATION_STATUSES)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>people</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Application Statuses</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.CRIMINAL_RECORD_CHECKS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>post_add</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Criminal Record Checks</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.EXPIRING_CHECKS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>alarm</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Expiring Checks</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.PAYMENTS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>payment</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Payments</span>
								</a>
							</li>
							<hr class="d-none d-sm-inline w-100 text-white" />
							<li class="nav-item w-100" *ngIf="authenticationService.genericUploadEnabled">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.GENERIC_UPLOADS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>cloud_upload</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Generic Uploads</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.IDENTITY_VERIFICATION)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>fingerprint</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Identity Verification</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.MANUAL_SUBMISSIONS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>post_add</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Manual Submissions</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.REPORTS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>article</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Reports</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.USERS)]"
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
									[routerLink]="[crrpRoutes.crrpPath(crrpRoutes.ORGANIZATION_PROFILE)]"
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
				<div class="col py-3">
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
export class CrrpComponent {
	showNavigation = true;
	isAuthenticated = this.authenticationService.waitUntilAuthentication$;
	crrpRoutes = CrrpRoutes;

	constructor(protected authenticationService: AuthenticationService, private router: Router) {}

	async ngOnInit(): Promise<void> {
		this.router.events.pipe(filter((evt) => evt instanceof NavigationEnd)).subscribe((evt) => {
			this.setShowNavigationFlag((evt as NavigationEnd).url);
		});

		const nextUrl = await this.authenticationService.login(CrrpRoutes.crrpPath());
		// console.debug('nextUrl', nextUrl);

		if (nextUrl) {
			const nextRoute = decodeURIComponent(nextUrl);
			// console.debug('nextRoute', nextRoute);

			this.setShowNavigationFlag(nextRoute);
			await this.router.navigate([nextRoute]);
		}
	}

	private setShowNavigationFlag(url: string): void {
		this.showNavigation = !url.includes(`${CrrpRoutes.MODULE_PATH}/${CrrpRoutes.INVITATION}`);
	}
}
