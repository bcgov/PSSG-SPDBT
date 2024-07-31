import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { IdentityProviderTypeCode } from '@app/api/models';
import { OAuthService } from 'angular-oauth2-oidc';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private href: string;

	constructor(
		@Inject(APP_BASE_HREF) href: string,
		private oauthService: OAuthService,
		private configService: ConfigService
	) {
		this.href = href;
	}

	//----------------------------------------------------------
	// *
	// *
	public async login(
		loginType: IdentityProviderTypeCode,
		returnComponentRoute: string | undefined = undefined
	): Promise<string | null> {
		console.debug('[AuthenticationService] LOGIN loginType', loginType, 'returnComponentRoute', returnComponentRoute);

		const redirectUri = this.createRedirectUrl(returnComponentRoute ?? '');

		console.debug('[AuthenticationService] redirectUrl', redirectUri);
		await this.configService.configureOAuthService(loginType, redirectUri);

		const returnRoute = location.pathname.substring(1);
		console.debug('[AuthenticationService] LOGIN returnRoute', returnRoute);

		const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
			state: returnRoute, // TODO needed?
		});
		console.debug('[AuthenticationService] ISLOGGEDIN', isLoggedIn, 'oauthService.state', this.oauthService.state);

		if (isLoggedIn) {
			return Promise.resolve(this.oauthService.state || returnRoute || null);
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

	//----------------------------------------------------------
	// *
	// *
	public createRedirectUrl(componentUrl: string): string {
		let baseUrl = `${location.origin}${this.href}`;
		if (baseUrl.endsWith('/')) {
			baseUrl = baseUrl.substring(0, baseUrl.length - 1);
		}
		return `${baseUrl}${componentUrl}`;
	}
}
