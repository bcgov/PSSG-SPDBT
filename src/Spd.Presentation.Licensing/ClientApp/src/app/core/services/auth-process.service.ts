import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityProviderTypeCode } from '@app/api/models';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
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
	async initializeLicencingBCSC(returnComponentRoute: string | undefined = undefined): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const returningRoute = LicenceApplicationRoutes.pathUserApplications();

		const nextUrl = await this.authenticationService.login(
			this.identityProvider,
			returnComponentRoute ?? returningRoute
		);
		console.debug('initializeLicencingBCSC nextUrl', returnComponentRoute, nextUrl);

		if (nextUrl) {
			const success = await this.authUserBcscService.applicantLoginAsync();
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
	async initializeLicencingBCeID(
		defaultBizId: string | null = null,
		defaultRoute: string | null = null
	): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const returningRoute = LicenceApplicationRoutes.pathBusinessApplications();

		const nextUrl = await this.authenticationService.login(this.identityProvider, defaultRoute ?? returningRoute);
		console.debug('initializeLicencingBCeID nextUrl', nextUrl, 'defaultBizId', defaultBizId);

		if (nextUrl) {
			const success = await this.authUserBceidService.whoAmIAsync(defaultBizId);
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
			this.router.navigateByUrl(LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION));
		}
	}

	//----------------------------------------------------------
	// *
	// *
	public logoutBcsc(): void {
		console.debug('logoutBcsc');

		const bcscIssuer = this.authenticationService.getBcscIssuer();
		const claims = this.oauthService.getIdentityClaims();
		if (claims && claims['iss'] === bcscIssuer) {
			this.oauthService.logOut({ redirectUrl: location.origin });
		}
	}

	//----------------------------------------------------------
	// *
	// *
	public logoutBceid(): void {
		console.debug('logoutBceid');

		const bcscIssuer = this.authenticationService.getBcscIssuer();
		const claims = this.oauthService.getIdentityClaims();
		if (claims && claims['iss'] !== bcscIssuer) {
			this.oauthService.logOut({ redirectUrl: location.origin });
		}
	}

	//----------------------------------------------------------
	// *
	// *
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
