import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { AuthConfigService } from './auth-config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	isLoginSubject$ = new BehaviorSubject<boolean>(false);

	constructor(private oauthService: OAuthService, private authConfigService: AuthConfigService) {}

	public async tryLogin(): Promise<{ state: any; loggedIn: boolean }> {
		await this.oauthService.loadDiscoveryDocumentAndTryLogin();
		const isLoggedIn = this.oauthService.hasValidAccessToken();

		let state = null;
		let loggedIn = false;

		if (isLoggedIn) {
			state = this.oauthService.state || null;
			loggedIn = isLoggedIn;
		}

		this.isLoginSubject$.next(true);
		return {
			state,
			loggedIn,
		};
	}

	public async login(state: any): Promise<boolean> {
		const isLoggedIn = this.oauthService.hasValidAccessToken();
		console.debug('[AuthenticationService.login] isLoggedIn', isLoggedIn);

		if (!isLoggedIn) {
			console.debug('[AuthenticationService.login] loadDiscoveryDocumentAndLogin');
			await this.oauthService.loadDiscoveryDocumentAndLogin({ state });
		}

		this.isLoginSubject$.next(true);
		return isLoggedIn;
	}

	public logout(): void {
		this.oauthService.logOut();
		this.isLoginSubject$.next(true);
	}

	public getToken(): string {
		return this.oauthService.getAccessToken();
	}

	public async configureOAuthService(redirectUri: string): Promise<void> {
		return this.authConfigService.getAuthConfig(redirectUri).then((authConfig) => {
			this.oauthService.configure(authConfig);
			this.oauthService.setupAutomaticSilentRefresh();
		});
	}
}
