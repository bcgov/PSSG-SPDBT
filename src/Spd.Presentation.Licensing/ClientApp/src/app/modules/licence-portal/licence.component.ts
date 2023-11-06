import { Component } from '@angular/core';
import { IsActiveMatchOptions, QueryParamsHandling } from '@angular/router';
import { LicenceRoutes } from './licence-routing.module';

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
	selector: 'app-licence',
	template: `
		<div class="container-fluid p-0">
			<div class="row flex-nowrap m-0">
				<div class="col-auto px-0" style="background-color: var(--color-sidebar);">
					<div
						class="d-flex flex-column align-items-sm-start pt-2 text-white "
						style="min-height: calc(100vh - 138px)!important;"
					>
						<a
							[routerLink]="[licenceRoutes.path(licenceRoutes.IN_PROGRESS_APPLICATIONS)]"
							class="nav-link d-flex text-white w-100"
						>
							<span class="d-none d-sm-inline mx-3 mt-2">Menu</span>
						</a>
						<hr class="d-none d-sm-inline w-100 text-white" />
						<ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-sm-start w-100">
							<li class="nav-item w-100">
								<a
									[routerLink]="[licenceRoutes.path(licenceRoutes.IN_PROGRESS_APPLICATIONS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>pending_actions</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline">In-Progress Applications</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[licenceRoutes.path(licenceRoutes.SUBMITTED_APPLICATIONS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>file_copy</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Submitted Applications</span>
								</a>
							</li>
							<hr class="d-none d-sm-inline w-100 text-white" />
							<li class="nav-item w-100">
								<a
									[routerLink]="[licenceRoutes.path(licenceRoutes.NEW_LICENCE)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>post_add</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Apply for a new Licence</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[licenceRoutes.path(licenceRoutes.ACTIVE_LICENCES)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>file_copy</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Active Licences</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[licenceRoutes.path(licenceRoutes.EXPIRED_LICENCES)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>alarm</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Expired Licences</span>
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
export class LicenceComponent {
	licenceRoutes = LicenceRoutes;

	// constructor(
	// 	protected authUserService: AuthUserService,
	// 	private authProcessService: AuthProcessService,
	// 	private router: Router
	// ) {}

	// async ngOnInit(): Promise<void> {
	// 	const nextRoute = await this.authProcessService.initializeBCSC();
	// 	console.log('initialize nextRoute', nextRoute);

	// 	if (nextRoute) {
	// 		await this.router.navigate([nextRoute]);
	// 	}
	// }
}
