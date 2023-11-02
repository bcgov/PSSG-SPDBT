import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { IdentityProviderTypeCode } from 'src/app/api/models';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LicenceApplicationRoutes } from 'src/app/modules/licence-application/licence-application-routing.module';
import { AuthUserBceidService } from './auth-user-bceid.service';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class AuthProcessService {
	private _waitUntilAuthentication$ = new BehaviorSubject<boolean>(false);
	waitUntilAuthentication$ = this._waitUntilAuthentication$.asObservable();

	loggedInUserTokenData: any = null;
	identityProvider: IdentityProviderTypeCode | null = null;

	constructor(
		private oauthService: OAuthService,
		private utilService: UtilService,
		private authenticationService: AuthenticationService,
		private authUserBcscService: AuthUserBcscService,
		private authUserBceidService: AuthUserBceidService,
		private router: Router
	) {}

	//----------------------------------------------------------
	// * Licencing Portal - BCSC
	// *
	async initializeLicencingBCSC(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		console.debug(
			'initializeLicencingBCSC return',
			LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS)
		);

		const nextUrl = await this.authenticationService.login(
			this.identityProvider,
			LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS)
		);
		console.debug('initializeLicencingBCSC nextUrl', nextUrl);

		if (nextUrl) {
			const success = await this.authUserBcscService.whoAmIAsync();
			this.notify(success);

			const nextRoute = decodeURIComponent(nextUrl);
			return Promise.resolve(nextRoute);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Licencing Portal - BCeID
	// *
	async initializeLicencingBCeID(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const nextUrl = await this.authenticationService.login(
			this.identityProvider,
			LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS)
		);
		console.debug('initializeLicencingBCeID nextUrl', nextUrl);

		if (nextUrl) {
			this.notify(true);
			return Promise.resolve(nextUrl);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// *
	// *
	public logout(): void {
		const loginType = this.identityProvider;

		this.identityProvider = null;
		this.oauthService.logOut();
		// this.utilService.clearAllSessionData();

		this.authUserBcscService.clearUserData();
		this.authUserBceidService.clearUserData();

		this.notify(false);

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			this.router.navigate([AppRoutes.LANDING]);
		}
	}

	private notify(isLoggedIn: boolean): void {
		const hasValidAccessToken = this.oauthService.hasValidAccessToken();

		if (!isLoggedIn || !hasValidAccessToken) {
			this.loggedInUserTokenData = null;
			this._waitUntilAuthentication$.next(false);
		} else {
			const token = this.authenticationService.getToken();
			this.loggedInUserTokenData = this.utilService.getDecodedAccessToken(token);
			console.debug('[AuthenticationService.setDecodedToken] loggedInUserTokenData', this.loggedInUserTokenData);
			this._waitUntilAuthentication$.next(true);
		}
	}
}
