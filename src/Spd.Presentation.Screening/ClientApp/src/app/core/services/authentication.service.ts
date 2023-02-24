import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	constructor(private oauthService: OAuthService) {}

	public async login(redirectUri: string = window.location.origin): Promise<string | void> {
		await this.configureOAuthService(redirectUri);
		const returnRoute = location.pathname.substring(1);
		console.log('returnRoute', returnRoute);
		const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
			state: returnRoute,
		});
		if (isLoggedIn) {
			return Promise.resolve(this.oauthService.state || returnRoute);
		}
	}

	public logout(): void {
		this.oauthService.logOut();
	}

	public getToken(): string {
		return this.oauthService.getAccessToken();
	}

	private async configureOAuthService(redirectUri: string): Promise<void> {
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
	}
}
