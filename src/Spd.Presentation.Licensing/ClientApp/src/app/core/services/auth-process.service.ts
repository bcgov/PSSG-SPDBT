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
	// * Try - BCSC
	// *
	async tryInitializeBCSC(): Promise<boolean | null> {
		// this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const authInfo = await this.authenticationService.tryLogin(
			IdentityProviderTypeCode.BcServicesCard,
			LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED)
		);

		const identityClaims = this.oauthService.getIdentityClaims();
		console.debug('tryInitializeBCSC', authInfo, identityClaims);

		const isValidLogin = this.checkLoginIdentityIsValid(
			authInfo.loggedIn,
			IdentityProviderTypeCode.BcServicesCard,
			identityClaims ? identityClaims['preferred_username'] : undefined
		);

		if (!isValidLogin) {
			return Promise.resolve(null);
		}

		if (authInfo.loggedIn) {
			this.identityProvider = IdentityProviderTypeCode.BcServicesCard;
			this.notify(true);
			return Promise.resolve(true);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Try - BCeID
	// *
	async tryInitializeBCeID(): Promise<boolean | null> {
		// this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const authInfo = await this.authenticationService.tryLogin(
			IdentityProviderTypeCode.BusinessBceId,
			LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_ANONYMOUS)
		);

		const identityClaims = this.oauthService.getIdentityClaims();
		console.debug('tryInitializeBCeID', authInfo, identityClaims);

		const isValidLogin = this.checkLoginIdentityIsValid(
			authInfo.loggedIn,
			IdentityProviderTypeCode.BusinessBceId,
			identityClaims ? identityClaims['preferred_username'] : undefined
		);

		if (!isValidLogin) {
			this.logout();
			this.notify(false);
			return Promise.resolve(null);
		}

		if (authInfo.loggedIn) {
			this.identityProvider = IdentityProviderTypeCode.BusinessBceId;
			this.notify(true);
			return Promise.resolve(true);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Licencing Portal - BCSC
	// *
	async initializeLicencingBCSC(returnComponentRoute: string | undefined = undefined): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		console.debug(
			'initializeLicencingBCSC return',
			LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED)
		);

		const nextUrl = await this.authenticationService.login(
			this.identityProvider,
			returnComponentRoute
				? returnComponentRoute
				: LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_AUTHENTICATED)
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

		console.debug(
			'initializeLicencingBCeID return',
			LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_ANONYMOUS)
		);

		const nextUrl = await this.authenticationService.login(
			this.identityProvider,
			LicenceApplicationRoutes.path(LicenceApplicationRoutes.USER_APPLICATIONS_ANONYMOUS)
		);
		console.debug('initializeLicencingBCeID nextUrl', nextUrl);

		if (nextUrl) {
			const success = await this.authUserBceidService.whoAmIAsync();
			this.notify(success);

			const nextRoute = decodeURIComponent(nextUrl);
			return Promise.resolve(nextRoute);
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

		this.authUserBcscService.clearUserData();
		this.authUserBceidService.clearUserData();

		this.notify(false);

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			this.router.navigate([AppRoutes.LANDING]);
		}
	}

	public logoutBcsc(): void {
		const bcscIssuer = this.authenticationService.getBcscIssuer();
		const claims = this.oauthService.getIdentityClaims();
		if (claims && claims['iss'] === bcscIssuer) {
			this.oauthService.logOut({ redirectUrl: location.origin });
		}
	}

	public logoutBceid(): void {
		const bcscIssuer = this.authenticationService.getBcscIssuer();
		const claims = this.oauthService.getIdentityClaims();
		if (claims && claims['iss'] !== bcscIssuer) {
			this.oauthService.logOut({ redirectUrl: location.origin });
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

	//----------------------------------------------------------
	// * check that loginType matches oauthservice login type
	// *
	private checkLoginIdentityIsValid(
		isLoggedIn: boolean,
		loginType: IdentityProviderTypeCode,
		preferredUsername: string | undefined
	): boolean {
		if (!isLoggedIn) return true;

		let isValid = false;
		if (loginType == IdentityProviderTypeCode.BusinessBceId) {
			isValid = preferredUsername?.endsWith('bceidbusiness') ?? false;
		} else {
			// IdentityProviderTypeCode.BcServicesCard
			isValid = !preferredUsername;
		}

		return isValid;
	}
}
