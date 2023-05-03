import { Component } from '@angular/core';
import { IsActiveMatchOptions, QueryParamsHandling } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DashboardRoutes } from './dashboard-routing.module';

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
	selector: 'app-dashboard',
	template: `
		<div class="container-fluid p-0" *ngIf="isAuthenticated | async">
			<div class="row flex-nowrap m-0">
				<div class="col-auto px-0" style="background-color: var(--color-sidebar);">
					<div
						class="d-flex flex-column align-items-sm-start pt-2 text-white "
						style="min-height: calc(100vh - 138px)!important;"
					>
						<a
							[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.HOME)]"
							class="nav-link d-flex text-white w-100"
						>
							<span class="d-none d-sm-inline mx-3 mt-2">CRRP</span>
						</a>
						<hr class="d-none d-sm-inline w-100 text-white" />
						<ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-sm-start w-100">
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.HOME)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>house</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline">Dashboard</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.CRIMINAL_RECORD_CHECKS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>post_add</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Criminal Record Checks</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.APPLICATION_STATUSES)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>people</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Application Statuses</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.EXPIRING_CHECKS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>alarm</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Expiring Checks</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.PAYMENTS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>payment</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Outstanding Payments</span>
								</a>
							</li>
							<hr class="d-none d-sm-inline w-100 text-white" />
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.GENERIC_UPLOADS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>cloud_upload</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Generic Uploads</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.IDENTITY_VERIFICATION)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>fingerprint</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Identity Verification</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.MANUAL_SUBMISSIONS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>post_add</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Manual Submissions</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.REPORTS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>article</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Reports</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.USERS)]"
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
									[routerLink]="[dashboardRoutes.dashboardPath(dashboardRoutes.ORGANIZATION_PROFILE)]"
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
export class DashboardComponent {
	isAuthenticated = this.authenticationService.isLoginSuccessful$;
	dashboardRoutes = DashboardRoutes;

	constructor(private authenticationService: AuthenticationService) {}

	async ngOnInit(): Promise<void> {
		await this.authenticationService.configureOAuthService(
			window.location.origin + `/${DashboardRoutes.dashboardPath(DashboardRoutes.HOME)}`
		);

		const authInfo = await this.authenticationService.tryLogin();
	}
}
