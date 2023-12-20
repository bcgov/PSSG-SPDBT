import { Injectable } from '@angular/core';
import { IdentityProviderTypeCode } from '@app/api/models';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	constructor(private oauthService: OAuthService, private configService: ConfigService) {}

	//----------------------------------------------------------
	// *
	// *
	public async tryLogin(
		loginType: IdentityProviderTypeCode,
		returnComponentRoute: string
	): Promise<{ state: any; loggedIn: boolean }> {
		await this.configService.configureOAuthService(loginType, window.location.origin + returnComponentRoute);

		const isLoggedIn = await this.oauthService
			.loadDiscoveryDocumentAndTryLogin()
			.then((_) => this.oauthService.hasValidAccessToken())
			.catch((_) => false);

		console.debug('[AuthenticationService.tryLogin] isLoggedIn', isLoggedIn, this.oauthService.hasValidAccessToken());

		// if (isLoggedIn) {
		// 	const tokenExpiration = this.oauthService.getAccessTokenExpiration();

		// 	const g = new Date(tokenExpiration);
		// 	console.log('aatokenExpiration', g);

		// 	const f = new Date();
		// 	console.log('aanow', f);

		// 	const diffMs = g.getTime() - f.getTime();
		// 	const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

		// 	this.oauthService.silentRefreshTimeout = diffMins * 1000;
		// 	console.log('aasilentRefreshTimeout', this.oauthService.silentRefreshTimeout / 1000);
		// }

		return {
			state: this.oauthService.state || null,
			loggedIn: isLoggedIn,
		};
	}

	//----------------------------------------------------------
	// *
	// *
	public async login(
		loginType: IdentityProviderTypeCode,
		returnComponentRoute: string | undefined = undefined
	): Promise<string | null> {
		await this.configService.configureOAuthService(loginType, window.location.origin + returnComponentRoute);

		const returnRoute = location.pathname.substring(1);
		console.debug('[AuthenticationService] LOGIN', returnComponentRoute, returnRoute);

		const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
			state: returnRoute,
		});
		console.debug('[AuthenticationService] ISLOGGEDIN', isLoggedIn, this.oauthService.state);

		if (isLoggedIn) {
			// const tokenExpiration = this.oauthService.getAccessTokenExpiration();

			// const g = new Date(tokenExpiration);
			// console.log('tokenExpiration', g);

			// const f = new Date();
			// console.log('now', f);

			// const diffMs = g.getTime() - f.getTime();
			// const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

			// this.oauthService.silentRefreshTimeout = diffMins * 1000;
			// console.log('silentRefreshTimeout', this.oauthService.silentRefreshTimeout / 1000);

			return Promise.resolve(this.oauthService.state || returnRoute);
		}

		return Promise.resolve(null);
	}

	public getBcscIssuer(): string | null {
		return this.configService.getBcscIssuer();
	}

	//----------------------------------------------------------
	// *
	// *
	public getToken(): string {
		return this.oauthService.getAccessToken();
	}

	//----------------------------------------------------------
	// *
	// *
	public isLoggedIn(): boolean {
		return this.oauthService.hasValidAccessToken();
	}
}
