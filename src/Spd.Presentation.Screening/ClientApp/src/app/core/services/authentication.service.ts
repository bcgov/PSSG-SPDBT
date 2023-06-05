import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { AuthUserService } from './auth-user.service';
import { ConfigService } from './config.service';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private _waitUntilAuthentication$ = new BehaviorSubject<boolean>(false);
	waitUntilAuthentication$ = this._waitUntilAuthentication$.asObservable();

	loggedInUserTokenData: any = null;

	constructor(
		private oauthService: OAuthService,
		private authUserService: AuthUserService,
		private utilService: UtilService,
		private configService: ConfigService
	) {}

	public async tryLogin(returnComponentRoute: string): Promise<{ state: any; loggedIn: boolean }> {
		await this.configureOAuthService(window.location.origin + returnComponentRoute);

		const isLoggedIn = await this.oauthService
			.loadDiscoveryDocumentAndTryLogin()
			.then((_) => this.oauthService.hasValidAccessToken())
			.catch((_) => false);

		console.debug('[AuthenticationService.tryLogin] isLoggedIn', isLoggedIn, this.oauthService.hasValidAccessToken());

		if (isLoggedIn) {
			this.authUserService.whoAmI().subscribe({
				next: (res) => {
					this.notify(true);
				},
				error: (err) => {
					console.error('Login Error', err);
					this.notify(false);
				},
			});
		} else {
			this.notify(false);
		}

		return {
			state: this.oauthService.state || null,
			loggedIn: isLoggedIn,
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
			const success = await this.authUserService.setOrgSelection();
			this.notify(success);
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

	private notify(isLoggedIn: boolean): void {
		const token = this.getToken();

		if (!isLoggedIn || !token) {
			this.authUserService.setOrgProfile();
			this._waitUntilAuthentication$.next(false);
		} else {
			const decodedToken = this.utilService.getDecodedAccessToken(token);
			console.debug('[AuthenticationService.setDecodedToken] decodedToken', decodedToken);
			this.loggedInUserTokenData = decodedToken;
			this._waitUntilAuthentication$.next(true);
		}
	}
}
