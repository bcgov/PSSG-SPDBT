import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityProviderTypeCode } from 'src/app/api/models';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { UtilService } from 'src/app/core/services/util.service';

@Component({
	selector: 'app-header',
	template: `
		<mat-toolbar color="primary" class="header">
			<span>
				<img src="assets/gov_bc_logo_blue.png" alt="Government of BC Logo" class="gov-bc-logo" />
			</span>
			<mat-divider vertical class="header-divider mx-3"></mat-divider>
			<div class="header-text pl-3">{{ title }}</div>
			<span style="flex: 1 1 auto;"></span>
			<div *ngIf="loggedInUserDisplay">
				<mat-icon matTooltip="Logout" class="logout-button me-2" (click)="onLogout()">logout</mat-icon>
				<span class="d-none d-sm-inline">{{ loggedInUserDisplay }}</span>
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

			.header {
				border-bottom: 2px solid var(--color-yellow);
				box-shadow: 0px 5px 10px 0px rgb(169 169 169);
			}

			.header-text {
				white-space: normal;
				font-size: 1.3rem;
				cursor: pointer;
				line-height: 20px;
			}

			.header-divider {
				height: 70%;
				border-right-color: gray;
			}

			.logout-button {
				vertical-align: middle;
				cursor: pointer;
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
		protected router: Router,
		private authUserService: AuthUserService,
		private authProcessService: AuthProcessService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			if (!isLoggedIn) {
				this.loggedInUserDisplay = null;
				return;
			}

			this.getUserInfo();
		});
	}

	onLogout(): void {
		this.authProcessService.logout();
	}

	private getUserInfo(): void {
		const loginType = this.authUserService.loginType;

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			console.debug(
				'BcServicesCard applicantUserInfo',
				this.authUserService.applicantUserInfo,
				'applicantProfile',
				this.authUserService.applicantProfile
			);

			let name = this.authUserService.applicantUserInfo?.displayName;
			if (!name) {
				name = this.utilService.getFullName(
					this.authUserService.applicantProfile?.firstName,
					this.authUserService.applicantProfile?.lastName
				);
			}
			this.loggedInUserDisplay = name ?? 'User';
			return;
		}

		console.debug(
			'BCeID userInfo',
			this.authUserService.userInfo,
			'loggedInUserTokenData',
			this.authProcessService.loggedInUserTokenData
		);

		const userData = this.authUserService.userInfo;
		let name = '';
		if (userData) {
			name = this.utilService.getFullName(userData.firstName, userData.lastName);
		}
		if (!name) {
			name = this.authProcessService.loggedInUserTokenData.display_name;
		}
		this.loggedInUserDisplay = name ?? 'User';
	}
}
