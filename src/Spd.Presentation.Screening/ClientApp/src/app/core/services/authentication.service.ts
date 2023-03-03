import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	constructor(private oauthService: OAuthService) {}

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
		// return this.configService.getAuthConfig().then((authConfig) => {
		this.oauthService.configure({
			issuer: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard',
			clientId: 'spd-4592',
			redirectUri: redirectUri,
			responseType: 'code',
			scope: 'openid profile email offline_access',
			showDebugInformation: true,
			postLogoutRedirectUri: 'https://logontest7.gov.bc.ca/clp-cgi/logoff.cgi',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			customQueryParams: { kc_idp_hint: 'bceidboth' },
		});
		this.oauthService.setupAutomaticSilentRefresh();
		await Promise.resolve();
	}
}
