import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { AuthConfigService } from './auth-config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	constructor(private oauthService: OAuthService, private authConfigService: AuthConfigService) {}

	public async tryLogin(): Promise<{ state: any; loggedIn: boolean }> {
		await this.oauthService.loadDiscoveryDocumentAndTryLogin();
		const isLoggedIn = this.oauthService.hasValidAccessToken();
		if (isLoggedIn) {
			return {
				state: this.oauthService.state || null,
				loggedIn: isLoggedIn,
			};
		}
		return {
			state: null,
			loggedIn: false,
		};
	}

	public async login(state: any): Promise<boolean> {
		const isLoggedIn = this.oauthService.hasValidAccessToken();
		if (!isLoggedIn) {
			await this.oauthService.loadDiscoveryDocumentAndLogin({ state });
		}
		return isLoggedIn;
	}

	public logout(): void {
		this.oauthService.logOut();
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
