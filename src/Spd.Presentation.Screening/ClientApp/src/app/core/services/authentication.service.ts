import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { UserInfo, UserProfileResponse } from 'src/app/api/models';
import { UserProfileService } from 'src/app/api/services';
import {
	OrgSelectionDialogData,
	OrgSelectionModalComponent,
	OrgSelectionResponseData,
} from 'src/app/shared/components/org-selection-modal.component';
import { AuthConfigService } from './auth-config.service';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	isLoginSubject$ = new BehaviorSubject<boolean>(false);

	private _isLoginSuccessfulSubject$ = new BehaviorSubject<boolean>(false);
	isLoginSuccessful$ = this._isLoginSuccessfulSubject$.asObservable();

	loggedInUserData: any = null;
	// loggedInUserProfile: UserProfileResponse | null = null;
	loggedInUserId: string | null = null;
	loggedInOrgId: string | null = null;
	loggedInOrgName: string | null = null;

	constructor(
		private oauthService: OAuthService,
		private userService: UserProfileService,
		private utilService: UtilService,
		private dialog: MatDialog,
		private authConfigService: AuthConfigService
	) {}

	public async tryLogin(): Promise<{ state: any; loggedIn: boolean }> {
		this.isLoginSubject$.next(false);
		this._isLoginSuccessfulSubject$.next(false);

		await this.oauthService.loadDiscoveryDocumentAndTryLogin().then((isLoggedIn) => {
			const hasValidAccessToken = this.oauthService.hasValidAccessToken();
			console.debug(
				'[AuthenticationService.tryLogin] isLoggedIn',
				isLoggedIn,
				'hasValidAccessToken',
				hasValidAccessToken
			);
			if (hasValidAccessToken) {
				this.userService.apiUserGet().subscribe({
					next: (resp: UserProfileResponse) => {
						// this.loggedInUserProfile = resp;
						const userInfosList = resp.userInfos?.filter((info) => info.orgId);
						const userInfos = userInfosList ? userInfosList : [];

						if (userInfos.length == 0) {
							console.error('User does not have any organizations');
						} else if (userInfos.length > 1) {
							this.orgSelection(userInfos);
						} else {
							this.loggedInOrgId = userInfos[0].orgId!;
							this.loggedInOrgName = userInfos[0].orgName!;
							this.loggedInUserId = userInfos[0].userId!;
							this.notify(true);
						}
					},
					error: (err) => {
						console.error('[AuthenticationService] loadDiscoveryDocumentAndTryLogin Error', err);
					},
				});
			} else {
				this.notify(false);
			}
		});

		const isLoggedIn = this.oauthService.hasValidAccessToken();

		let state = null;
		let loggedIn = false;

		if (isLoggedIn) {
			state = this.oauthService.state || null;
			loggedIn = isLoggedIn;
		}

		return {
			state,
			loggedIn,
		};
	}

	public async login(state: any): Promise<boolean> {
		const isLoggedIn = this.oauthService.hasValidAccessToken();
		if (!isLoggedIn) {
			await this.oauthService.loadDiscoveryDocumentAndLogin({ state });
		}

		this.notify(isLoggedIn);
		return isLoggedIn;
	}

	public logout(): void {
		this.oauthService.logOut();
		this.utilService.clearOrgRegState();
		this.notify(false);
	}

	public getToken(): string {
		return this.oauthService.getAccessToken();
	}

	public isLoggedIn(): boolean {
		return this.oauthService.hasValidAccessToken();
	}

	public async configureOAuthService(redirectUri: string): Promise<void> {
		return this.authConfigService.getAuthConfig(redirectUri).then((authConfig) => {
			this.oauthService.configure(authConfig);
			this.oauthService.setupAutomaticSilentRefresh();
		});
	}

	private orgSelection(userInfos: Array<UserInfo>): void {
		const dialogOptions: OrgSelectionDialogData = {
			userInfos: userInfos,
		};

		this.dialog
			.open(OrgSelectionModalComponent, {
				width: '500px',
				data: dialogOptions,
			})
			.afterClosed()
			.subscribe((res: OrgSelectionResponseData) => {
				if (res) {
					this.loggedInOrgId = res.orgId;
					this.loggedInOrgName = res.orgName;
					this.loggedInUserId = res.userId;
					this.notify(true);
				}
			});
	}

	private notify(isLoggedIn: boolean): void {
		const token = this.getToken();
		if (!token) {
			this.loggedInUserData = null;
			// this.loggedInUserProfile = null;
			this.loggedInOrgId = null;
			this.loggedInOrgName = null;
			this.loggedInUserId = null;
			return;
		} else {
			const decodedToken = this.utilService.getDecodedAccessToken(token);
			console.debug('[AuthenticationService.setDecodedToken] decodedToken', decodedToken);
			this.loggedInUserData = decodedToken;
		}

		this.isLoginSubject$.next(true);
		this._isLoginSuccessfulSubject$.next(isLoggedIn);
	}
}
