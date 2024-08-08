import { Component, OnDestroy, OnInit } from '@angular/core';
import { IdentityProviderTypeCode } from '@app/api/models';
import { AuthProcessService } from '@app/core/services/auth-process.service';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { AuthUserBcscService } from '@app/core/services/auth-user-bcsc.service';
import { UtilService } from '@app/core/services/util.service';
import { ApplicationService } from '@app/core/services/application.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-spd-header',
	template: `
		<mat-toolbar color="primary" class="spd-header">
			<span>
				<img src="assets/gov_bc_logo_blue.png" alt="Government of BC Logo" class="gov-bc-logo" />
			</span>
			<mat-divider vertical class="app-header-divider mx-3"></mat-divider>
			<div class="app-header-text pl-3">
				<span class="desktop"> {{ fullTitle }}</span>
				<span class="mobile"> {{ mobileTitle }} </span>
			</div>
			<span style="flex: 1 1 auto;"></span>

			<!-- <mat-chip-option class="me-3" *ngIf="env" disabled>{{ env }}</mat-chip-option> -->

			<div *ngIf="loggedInUserDisplay">
				<mat-icon matTooltip="Logout" class="logout-button me-2" (click)="onLogout()">logout</mat-icon>
				<span class="d-none d-md-inline">{{ loggedInUserDisplay }}</span>
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
			}

			.spd-header {
				border-bottom: 2px solid var(--color-yellow);
				box-shadow: 0px 5px 10px 0px rgb(169 169 169);
			}

			.app-header-text {
				white-space: normal;
				font-size: 1.3rem;
				line-height: 20px;
			}

			.logout-button {
				vertical-align: middle;
				cursor: pointer;
			}

			span.mobile {
				display: none;
			}
			span.desktop {
				display: block;
			}
			@media screen and (max-width: 480px) {
				span.mobile {
					display: block;
				}
				span.desktop {
					display: none;
				}
			}

			.app-header-divider {
				height: 70%;
				border-right-color: gray;
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
export class SpdHeaderComponent implements OnInit, OnDestroy {
	fullTitle = '';
	mobileTitle = '';
	loggedInUserDisplay: string | null = null;

	// env: string | null | undefined = null; // TODO add display of env

	private applicationTitleSubscription!: Subscription;

	constructor(
		private authUserBcscService: AuthUserBcscService,
		private authUserBceidService: AuthUserBceidService,
		private authProcessService: AuthProcessService,
		private commonApplicationService: ApplicationService,
		// private configService: ConfigService,
		private utilService: UtilService
	) {}

	ngOnInit(): void {
		this.authProcessService.waitUntilAuthentication$.subscribe((isLoggedIn: boolean) => {
			console.debug('[HeaderComponent] isLoggedIn', isLoggedIn);
			if (!isLoggedIn) {
				this.loggedInUserDisplay = null;
				return;
			}

			this.getUserInfo();
		});

		// this.env = this.configService.isProduction() ? null : this.configService.configs?.environment;

		this.applicationTitleSubscription = this.commonApplicationService.applicationTitle$.subscribe(
			(_resp: [string, string]) => {
				this.fullTitle = _resp[0];
				this.mobileTitle = _resp[1];
			}
		);
	}

	ngOnDestroy() {
		if (this.applicationTitleSubscription) this.applicationTitleSubscription.unsubscribe();
	}

	onLogout(): void {
		this.authProcessService.logout();
	}

	private getUserInfo(): void {
		const loginType = this.authProcessService.identityProvider;

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			const name = this.utilService.getFullName(
				this.authUserBcscService.applicantLoginProfile?.firstName,
				this.authUserBcscService.applicantLoginProfile?.lastName
			);
			this.loggedInUserDisplay = name ?? 'BCSC User';
			return;
		}

		const userData = this.authUserBceidService.bceidUserProfile;
		let name: string | null = null;
		if (userData) {
			name = this.utilService.getFullName(userData.firstName, userData.lastName);
		}
		if (!name) {
			name = this.authProcessService.loggedInUserTokenData.display_name;
		}
		this.loggedInUserDisplay = name ?? 'BCeID User';
	}
}
