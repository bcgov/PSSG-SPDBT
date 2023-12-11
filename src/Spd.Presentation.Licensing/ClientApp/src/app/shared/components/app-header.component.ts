import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityProviderTypeCode } from 'src/app/api/models';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { UtilService } from 'src/app/core/services/util.service';
import { LicenceApplicationRoutes } from 'src/app/modules/licence-application/licence-application-routing.module';

@Component({
	selector: 'app-header',
	template: `
		<mat-toolbar color="primary" class="app-header">
			<span>
				<img src="assets/gov_bc_logo_blue.png" alt="Government of BC Logo" class="gov-bc-logo" />
			</span>
			<mat-divider vertical class="app-header-divider mx-3"></mat-divider>
			<div class="app-header-text pl-3">{{ title }}</div>
			<span style="flex: 1 1 auto;"></span>

			<div *ngIf="loggedInUserDisplay">
				<button mat-button [matMenuTriggerFor]="menu" class="login-user-menu-button w-auto" style="font-size: inherit;">
					<mat-icon>more_vert</mat-icon> {{ loggedInUserDisplay }}
				</button>
				<mat-menu #menu="matMenu">
					<button mat-menu-item (click)="onUserProfile()">Your Profile</button>
					<button mat-menu-item (click)="onLogout()">Logout</button>
				</mat-menu>
			</div>
		</mat-toolbar>
	`,
	styles: [
		`
			.mat-toolbar-row,
			.mat-toolbar-single-row {
				height: 74px;
			}

			.gov-bc-logo {
				padding-bottom: 12px;
				cursor: pointer;
			}

			.app-header {
				border-bottom: 2px solid var(--color-yellow);
				box-shadow: 0px 5px 10px 0px rgb(169 169 169);
			}

			.app-header-text {
				white-space: normal;
				font-size: 1.3rem;
				cursor: pointer;
				line-height: 20px;
			}

			.app-header-divider {
				height: 70%;
				border-right-color: gray;
			}

			.logout-button {
				vertical-align: middle;
				cursor: pointer;
			}

			.login-user-menu-button:hover {
				background-color: var(--color-primary-dark);
			}

			@media (max-width: 767px) {
				.mat-toolbar-row,
				.mat-toolbar-single-row {
					padding: 0 8px !important;
				}
			}
		`,
	],
})
export class HeaderComponent implements OnInit {
	@Input() title = '';
	loggedInUserDisplay: string | null = null;

	constructor(
		private router: Router,
		private authUserBcscService: AuthUserBcscService,
		private authProcessService: AuthProcessService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			console.log('HeaderComponent isLoggedIn', isLoggedIn);
			if (!isLoggedIn) {
				this.loggedInUserDisplay = null;
				return;
			}

			this.getUserInfo();
		});
	}

	onUserProfile(): void {
		this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_USER_PROFILE));
	}

	onLogout(): void {
		this.authProcessService.logout();
	}

	private getUserInfo(): void {
		const loginType = this.authProcessService.identityProvider;

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			console.debug('bcscUserWhoamiProfile', this.authUserBcscService.bcscUserWhoamiProfile);

			const name = this.utilService.getFullName(
				this.authUserBcscService.bcscUserWhoamiProfile?.firstName,
				this.authUserBcscService.bcscUserWhoamiProfile?.lastName
			);
			this.loggedInUserDisplay = name ?? 'BCSC User';
			return;
		}

		// console.debug(
		// 	'BCeID bceidUserInfoProfile',
		// 	this.authUserBceidService.bceidUserInfoProfile,
		// 	'loggedInUserTokenData',
		// 	this.authProcessService.loggedInUserTokenData
		// );

		// const userData = this.authUserBceidService.bceidUserInfoProfile;
		// let name = '';
		// if (userData) {
		// 	name = this.utilService.getFullName(userData.firstName, userData.lastName);
		// }
		// if (!name) {
		// 	name = this.authProcessService.loggedInUserTokenData.display_name;
		// }
		// this.loggedInUserDisplay = name ?? 'BCeID User';
		this.loggedInUserDisplay = 'BCeID User';
	}
}
