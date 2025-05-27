import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { IdentityProviderTypeCode } from '../code-types/code-types.models';
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
	public async tryLogin(
		loginType: IdentityProviderTypeCode,
		returnComponentRoute: string
	): Promise<{ state: string | null; loggedIn: boolean }> {
		await this.configService.configureOAuthService(loginType, this.createRedirectUrl(returnComponentRoute));

		const isLoggedIn = await this.oauthService
			.loadDiscoveryDocumentAndTryLogin()
			.then((_) => this.oauthService.hasValidAccessToken())
			.catch((_) => false);

		console.debug('[AuthenticationService.tryLogin] isLoggedIn', isLoggedIn, this.oauthService.hasValidAccessToken());

		return {
			state: this.oauthService.state ?? null,
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
		await this.configService.configureOAuthService(loginType, this.createRedirectUrl(returnComponentRoute ?? ''));

		const returnRoute = returnComponentRoute;
		console.debug('[AuthenticationService] LOGIN', returnRoute);

		const isLoggedIn = await this.oauthService
			.loadDiscoveryDocumentAndLogin({
				state: returnRoute,
			})
			.then((_) => this.oauthService.hasValidAccessToken())
			.catch((_) => false);

		console.debug('[AuthenticationService] ISLOGGEDIN', isLoggedIn, this.oauthService.state);

		if (isLoggedIn) {
			return Promise.resolve(this.oauthService.state || returnRoute || null);
		}

		return Promise.resolve(null);
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

	private createRedirectUrl(componentUrl: string): string {
		let baseUrl = `${location.origin}${this.href}`;
		if (baseUrl.endsWith('/')) {
			baseUrl = baseUrl.substring(0, baseUrl.length - 1);
		}
		return `${baseUrl}${componentUrl}`;
	}
}
