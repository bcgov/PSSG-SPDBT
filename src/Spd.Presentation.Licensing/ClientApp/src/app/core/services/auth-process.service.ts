import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { IdentityProviderTypeCode } from 'src/app/api/models';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LicenceRoutes } from 'src/app/modules/licence-portal/licence-routing.module';
import { AuthUserBcscService } from '../auth-user-bcsc.service';
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
		private router: Router
	) {}

	//----------------------------------------------------------
	// * Licencing Portal
	// *
	async initializeLicencing(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const nextUrl = await this.authenticationService.login(this.identityProvider, LicenceRoutes.path());
		console.debug('initializeLicencing nextUrl', nextUrl);

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
	// * Crrpa Screening
	// *
	// async tryInitializeCrrpa(): Promise<string | null> {
	// 	this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

	// 	//auth step 1 - user is not logged in, no state at all
	// 	//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
	// 	const authInfo = await this.authenticationService.tryLogin(this.identityProvider, CrrpaRoutes.path());

	// 	if (authInfo.loggedIn) {
	// 		const success = await this.authUserBcscService.applicantUserInfoAsync();
	// 		this.notify(success);

	// 		if (authInfo.state) {
	// 			const stateInfo = this.utilService.getSessionData(this.utilService.CRRPA_PORTAL_STATE_KEY);
	// 			if (stateInfo) {
	// 				return Promise.resolve(stateInfo);
	// 			}
	// 		}
	// 		return Promise.resolve(null);
	// 	}

	// 	this.notify(false);
	// 	return Promise.resolve(null);
	// }

	//----------------------------------------------------------
	// * Crrpa Screening
	// *
	// async initializeCrrpa(): Promise<string | null> {
	// 	this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

	// 	const nextUrl = await this.authenticationService.login(this.identityProvider, CrrpaRoutes.path());
	// 	console.debug('initializeCrrpa nextUrl', nextUrl);

	// 	if (nextUrl) {
	// 		const success = await this.authUserBcscService.applicantUserInfoAsync();
	// 		this.notify(success);

	// 		const nextRoute = decodeURIComponent(nextUrl);
	// 		return Promise.resolve(nextRoute);
	// 	}

	// 	this.notify(false);
	// 	return Promise.resolve(null);
	// }

	//----------------------------------------------------------
	// *
	// *
	public logout(): void {
		const loginType = this.identityProvider;

		this.identityProvider = null;
		this.oauthService.logOut();
		// this.utilService.clearAllSessionData();

		this.authUserBcscService.clearUserData();

		this.notify(false);

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			this.router.navigate([AppRoutes.LANDING]);
		}
	}

	private notify(isLoggedIn: boolean): void {
		const hasValidAccessToken = this.oauthService.hasValidAccessToken();

		if (!isLoggedIn || !hasValidAccessToken) {
			this._waitUntilAuthentication$.next(false);
		} else {
			const token = this.authenticationService.getToken();
			this.loggedInUserTokenData = this.utilService.getDecodedAccessToken(token);
			console.debug('[AuthenticationService.setDecodedToken] loggedInUserTokenData', this.loggedInUserTokenData);
			this._waitUntilAuthentication$.next(true);
		}
	}
}
