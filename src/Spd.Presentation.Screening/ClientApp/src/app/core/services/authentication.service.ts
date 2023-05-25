import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { UserInfo, UserProfileResponse } from 'src/app/api/models';
import { UserProfileService } from 'src/app/api/services';
import {
	OrgSelectionDialogData,
	OrgSelectionModalComponent,
} from 'src/app/shared/components/org-selection-modal.component';
import { ConfigService } from './config.service';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private _waitUntilAuthentication$ = new BehaviorSubject<boolean>(false);
	waitUntilAuthentication$ = this._waitUntilAuthentication$.asObservable();

	loggedInUserTokenData: any = null;
	loggedInUserInfo: UserInfo | null = null;
	genericUploadEnabled: boolean = false;

	constructor(
		private oauthService: OAuthService,
		private userService: UserProfileService,
		private utilService: UtilService,
		private dialog: MatDialog,
		private configService: ConfigService
	) {}

	public async tryLogin(returnComponentRoute: string): Promise<{ state: any; loggedIn: boolean }> {
		await this.configureOAuthService(returnComponentRoute);

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
						const userInfosList = resp.userInfos?.filter((info) => info.orgId);
						const userInfos = userInfosList ? userInfosList : [];

						if (userInfos.length == 0) {
							console.error('User does not have any organizations');
						} else if (userInfos.length > 1) {
							this.orgSelection(userInfos);
						} else {
							this.setUserInfo(userInfos[0]);
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

	public async login(returnComponentRoute: string | undefined = undefined): Promise<string | null> {
		await this.configureOAuthService(window.location.origin + returnComponentRoute);

		const returnRoute = location.pathname.substring(1);
		console.debug('[AuthenticationService] login', returnComponentRoute, returnRoute);

		const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
			state: returnRoute,
		});

		if (isLoggedIn) {
			await this.setOrganization();

			this.notify(true);
			return Promise.resolve(this.oauthService.state || returnRoute);
		} else {
			this.notify(isLoggedIn);
			return Promise.resolve(null);
		}
	}

	public logout(): void {
		this.oauthService.logOut();
		this.utilService.clearAllSessionData();
		this.notify(false);
	}

	public getToken(): string {
		return this.oauthService.getAccessToken();
	}

	public isLoggedIn(): boolean {
		return this.oauthService.hasValidAccessToken();
	}

	public async configureOAuthService(redirectUri: string): Promise<void> {
		return this.configService.getAuthConfig(redirectUri).then((config) => {
			this.oauthService.configure(config);
			this.oauthService.setupAutomaticSilentRefresh();
		});
	}

	private async setOrganization(): Promise<any> {
		const resp: UserProfileResponse = await lastValueFrom(this.userService.apiUserGet());

		if (resp) {
			const uniqueUserInfoList = [
				...new Map(resp.userInfos?.filter((info) => info.orgId).map((item) => [item['orgId'], item])).values(),
			];

			if (uniqueUserInfoList.length == 0) {
				console.error('User does not have any organizations');
				return Promise.resolve(false);
			} else {
				if (uniqueUserInfoList.length > 1) {
					const result = await this.orgSelectionAsync(uniqueUserInfoList);
					this.setUserInfo(result);
				} else {
					this.setUserInfo(uniqueUserInfoList[0]);
				}
				this.notify(true);
				return Promise.resolve(true);
			}
		}
	}

	private orgSelectionAsync(userInfos: Array<UserInfo>): Promise<any> {
		const dialogOptions: OrgSelectionDialogData = {
			userInfos: userInfos,
		};

		return lastValueFrom(
			this.dialog
				.open(OrgSelectionModalComponent, {
					width: '500px',
					data: dialogOptions,
				})
				.afterClosed()
		);
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
			.subscribe((res: UserInfo) => {
				if (res) {
					this.setUserInfo(res);
					this.notify(true);
				}
			});
	}

	private setUserInfo(userInfo: UserInfo) {
		console.debug('setUserInfo', userInfo);
		this.loggedInUserInfo = userInfo;
		this.genericUploadEnabled = userInfo.orgSettings?.genericUploadEnabled ?? false;
	}

	private notify(isLoggedIn: boolean): void {
		const token = this.getToken();

		if (!token) {
			this.loggedInUserTokenData = null;
			this.loggedInUserInfo = null;
			return;
		} else {
			const decodedToken = this.utilService.getDecodedAccessToken(token);
			console.debug('[AuthenticationService.setDecodedToken] decodedToken', decodedToken);

			this.loggedInUserTokenData = decodedToken;
		}

		this._waitUntilAuthentication$.next(isLoggedIn);
	}
}
