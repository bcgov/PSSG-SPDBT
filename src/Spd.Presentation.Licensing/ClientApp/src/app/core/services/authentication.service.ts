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
