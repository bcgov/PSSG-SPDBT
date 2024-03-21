import { Component, OnInit } from '@angular/core';
import { IsActiveMatchOptions, QueryParamsHandling, Router } from '@angular/router';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { PssoRoutes } from './psso-routing.module';

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
	selector: 'app-psso',
	template: `
		<div class="container-fluid p-0" *ngIf="isAuthenticated$ | async">
			<div class="row flex-nowrap m-0">
				<div class="col-auto mat-sidenav px-0" style="background-color: var(--color-sidebar);">
					<div
						class="d-flex flex-column align-items-sm-start pt-2 text-white "
						style="min-height: calc(100vh - 138px)!important;"
					>
						<a
							tabindex="-1"
							[routerLink]="[pssoRoutes.path(pssoRoutes.SCREENING_STATUSES)]"
							class="nav-link d-flex text-white w-100"
						>
							<span class="d-none d-sm-inline mx-3 mt-2">Menu</span>
						</a>
						<hr class="d-none d-sm-inline w-100 text-white" />
						<ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-sm-start w-100">
							<li class="nav-item w-100">
								<a
									[routerLink]="[pssoRoutes.path(pssoRoutes.SCREENING_STATUSES)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>people</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Application Statuses</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[pssoRoutes.path(pssoRoutes.SCREENING_CHECKS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>post_add</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Criminal Record Checks</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[pssoRoutes.path(pssoRoutes.IDENTITY_VERIFICATION)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>fingerprint</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Identity Verification</span>
								</a>
							</li>
							<li class="nav-item w-100">
								<a
									[routerLink]="[pssoRoutes.path(pssoRoutes.MANUAL_SUBMISSIONS)]"
									routerLinkActive="active"
									class="nav-link align-middle text-white w-100"
								>
									<mat-icon>description</mat-icon>
									<span class="menu-item ms-2 d-none d-sm-inline text-white">Manual Submissions</span>
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
export class PssoComponent implements OnInit {
	isAuthenticated$ = this.authProcessService.waitUntilAuthentication$;
	pssoRoutes = PssoRoutes;

	constructor(private authProcessService: AuthProcessService, private router: Router) {}

	async ngOnInit(): Promise<void> {
		const nextRoute = await this.authProcessService.initializePsso();

		if (nextRoute) {
			await this.router.navigate([nextRoute]);
		}
	}
}
