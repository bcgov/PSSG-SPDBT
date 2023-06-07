import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { AppRoutes } from 'src/app/app-routing.module';
import { IdentityProviderTypeCode } from '../code-types/code-types.models';
import { AuthUserService } from './auth-user.service';
import { ConfigService } from './config.service';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private _waitUntilAuthentication$ = new BehaviorSubject<boolean>(false);
	waitUntilAuthentication$ = this._waitUntilAuthentication$.asObservable();

	loggedInUserTokenData: any = null;

	constructor(
		private router: Router,
		private oauthService: OAuthService,
		private authUserService: AuthUserService,
		private utilService: UtilService,
		private configService: ConfigService
	) {}

	public async tryLogin(
		loginType: IdentityProviderTypeCode,
		returnComponentRoute: string
	): Promise<{ state: any; loggedIn: boolean }> {
		await this.configureOAuthService(loginType, window.location.origin + returnComponentRoute);

		const isLoggedIn = await this.oauthService
			.loadDiscoveryDocumentAndTryLogin()
			.then((_) => this.oauthService.hasValidAccessToken())
			.catch((_) => false);

		console.debug('[AuthenticationService.tryLogin] isLoggedIn', isLoggedIn, this.oauthService.hasValidAccessToken());

		if (isLoggedIn) {
			const success = await this.authUserService.whoAmIAsync(loginType);
			this.notify(success);
		} else {
			this.notify(false);
		}

		return {
			state: this.oauthService.state || null,
			loggedIn: isLoggedIn,
		};
	}

	public async login(
		loginType: IdentityProviderTypeCode,
		returnComponentRoute: string | undefined = undefined
	): Promise<string | null> {
		await this.configureOAuthService(loginType, window.location.origin + returnComponentRoute);

		const returnRoute = location.pathname.substring(1);
		console.debug('[AuthenticationService] login', returnComponentRoute, returnRoute);

		const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
			state: returnRoute,
		});

		if (isLoggedIn) {
			const success = await this.authUserService.whoAmIAsync(loginType);
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

		if (this.authUserService.loginType == IdentityProviderTypeCode.BcServicesCard) {
			this.router.navigate([AppRoutes.LANDING]);
		}
	}

	public getToken(): string {
		return this.oauthService.getAccessToken();
	}

	public isLoggedIn(): boolean {
		return this.oauthService.hasValidAccessToken();
	}

	public async configureOAuthService(loginType: IdentityProviderTypeCode, redirectUri: string): Promise<void> {
		if (loginType == IdentityProviderTypeCode.BusinessBceId) {
			return this.configService.getBceidConfig(redirectUri).then((config) => {
				this.oauthService.configure(config);
				this.oauthService.setupAutomaticSilentRefresh();
			});
		}

		return this.configService.getBcscConfig(redirectUri).then((config) => {
			this.oauthService.configure(config);
			this.oauthService.setupAutomaticSilentRefresh();
		});
	}

	private notify(isLoggedIn: boolean): void {
		const hasValidAccessToken = this.oauthService.hasValidAccessToken();

		if (!isLoggedIn || !hasValidAccessToken) {
			this._waitUntilAuthentication$.next(false);
		} else {
			const token = this.getToken();
			this.loggedInUserTokenData = this.utilService.getDecodedAccessToken(token);
			console.debug('[AuthenticationService.setDecodedToken] loggedInUserTokenData', this.loggedInUserTokenData);
			this._waitUntilAuthentication$.next(true);
		}
	}
}
