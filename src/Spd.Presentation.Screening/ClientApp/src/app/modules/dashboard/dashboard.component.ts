import { Component } from '@angular/core';
import { IsActiveMatchOptions, QueryParamsHandling } from '@angular/router';

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
		<div class="container-fluid p-0">
			<div class="row flex-nowrap m-0">
				<div class="col-auto col-md-3 col-xl-2 px-0" style="background-color: var(--color-sidebar);">
					<div
						class="d-flex flex-column align-items-center align-items-sm-start pt-2 text-white "
						style="min-height: calc(100vh - 138px)!important;"
					>
						<a
							href="#"
							onclick="return false;"
							class="nav-link d-flex align-items-center mb-md-0 me-md-auto text-white text-decoration-none"
						>
							<span class="d-none d-sm-inline mx-3 mt-2">Authorized User</span>
						</a>
						<hr class="d-none  d-sm-inline" style="width: 100%; color: white;" />
						<ul
							class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start w-100"
							id="menu"
						>
							<li class="nav-item w-100">
								<a
									[routerLink]="['/dashboard/home']"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>house</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline">Home</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="['/dashboard/generic-upload']"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>logout</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Generic Uploads</span>
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
export class DashboardComponent {}
