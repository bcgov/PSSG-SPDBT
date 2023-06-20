import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityProviderTypeCode } from 'src/app/api/models';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
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
				<mat-icon matTooltip="Logout" class="logout-button me-2" (click)="onLogout()">logout</mat-icon
				>{{ loggedInUserDisplay }}
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
		`,
	],
})
export class HeaderComponent implements OnInit {
	@Input() title = '';
	loggedInUserDisplay: string | null = null;

	constructor(
		protected router: Router,
		private authenticationService: AuthenticationService,
		private authUserService: AuthUserService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		this.authenticationService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			if (!isLoggedIn) {
				this.loggedInUserDisplay = null;
				return;
			}

			this.getUserInfo();
		});
	}

	onLogout(): void {
		this.authenticationService.logout();
	}

	private getUserInfo(): void {
		const loginType = this.authUserService.loginType;

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			console.debug(
				'applicantUserInfo',
				this.authUserService.applicantUserInfo,
				'applicantProfile',
				this.authUserService.applicantProfile
			);

			this.loggedInUserDisplay =
				this.authUserService.applicantUserInfo?.displayName ??
				`${this.authUserService.applicantProfile?.firstName} ${this.authUserService.applicantProfile?.lastName}`;
			return;
		}

		const userData = this.authUserService.userInfo;
		this.loggedInUserDisplay = userData ? this.utilService.getFullName(userData.firstName, userData.lastName) : null;
	}
}
