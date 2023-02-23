import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	constructor(private oauthService: OAuthService) {}

	public async login(): Promise<string | void> {
		await this.configureOAuthService();
		const returnRoute = location.pathname.substring(1);
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

	// {
	// 	"confidential-port": 0,
	// 	"auth-server-url": "https://dev.loginproxy.gov.bc.ca/auth",
	// 	"realm": "standard",
	// 	"ssl-required": "external",
	// 	"public-client": true,
	// 	"resource": "spd-4592"
	// }
	//https://dev.loginproxy.gov.bc.ca/auth/realms/standard/.well-known/openid-configuration

	private async configureOAuthService(): Promise<void> {
		// return this.configService.getAuthConfig().then((authConfig) => {
		this.oauthService.configure({
			issuer: 'https://dev.loginproxy.gov.bc.ca/auth/realms/standard',
			clientId: 'spd-4592',
			redirectUri: window.location.origin + '/',
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
