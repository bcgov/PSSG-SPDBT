import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { IdentityProviderTypeCode } from 'src/app/api/models';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CrrpRoutes } from 'src/app/modules/crrp-portal/crrp-routing.module';
import { CrrpaRoutes } from 'src/app/modules/crrpa-portal/crrpa-routing.module';
import { OrgRegistrationRoutes } from 'src/app/modules/org-registration-portal/org-registration-routing.module';
import { PssoRoutes } from 'src/app/modules/psso-portal/psso-routing.module';
import { SecurityScreeningRoutes } from 'src/app/modules/security-screening-portal/security-screening-routing.module';
import { AuthUserBceidService } from './auth-user-bceid.service';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { AuthUserIdirService } from './auth-user-idir.service';
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
		private authUserBceidService: AuthUserBceidService,
		private authUserBcscService: AuthUserBcscService,
		private authUserIdirService: AuthUserIdirService,
		private router: Router
	) {}

	//----------------------------------------------------------
	// * CRRP Portal
	// *
	async initializeCrrp(defaultOrgId: string | null = null): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const nextUrl = await this.authenticationService.login(this.identityProvider, CrrpRoutes.path(CrrpRoutes.HOME));
		console.debug('initializeCrrp nextUrl', nextUrl);

		if (nextUrl) {
			const success = await this.authUserBceidService.whoAmIAsync(defaultOrgId);
			if (!success) {
				this.notify(success);
				console.debug('initializeCrrp - not success', this.identityProvider, nextUrl, success);
				this.router.navigate([AppRoutes.ACCESS_DENIED]);
				return Promise.resolve(null);
			}

			this.notify(success);

			const nextRoute = decodeURIComponent(nextUrl);
			return Promise.resolve(nextRoute);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Security Screening Portal
	// *
	async initializeSecurityScreening(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const nextUrl = await this.authenticationService.login(this.identityProvider, SecurityScreeningRoutes.path());
		console.debug('initializeSecurityScreening nextUrl', nextUrl);

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
	async tryInitializeCrrpa(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin(this.identityProvider, CrrpaRoutes.path());

		if (authInfo.loggedIn) {
			const success = await this.authUserBcscService.applicantUserInfoAsync();
			this.notify(success);

			if (authInfo.state) {
				const stateInfo = this.utilService.getSessionData(this.utilService.CRC_PORTAL_STATE_KEY);
				if (stateInfo) {
					return Promise.resolve(stateInfo);
				}
			}
			return Promise.resolve(null);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Crrpa Screening
	// *
	async initializeCrrpa(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const nextUrl = await this.authenticationService.login(this.identityProvider, CrrpaRoutes.path());
		console.debug('initializeCrrpa nextUrl', nextUrl);

		if (nextUrl) {
			const success = await this.authUserBcscService.applicantUserInfoAsync();
			this.notify(success);

			const nextRoute = decodeURIComponent(nextUrl);
			return Promise.resolve(nextRoute);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * PSSO Portal
	// *
	async initializePsso(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.Idir;

		const nextUrl = await this.authenticationService.login(
			this.identityProvider,
			PssoRoutes.path(PssoRoutes.SCREENING_STATUSES)
		);
		console.debug('initializePsso nextUrl', nextUrl);

		if (nextUrl) {
			const success = await this.authUserIdirService.whoAmIAsync();

			if (!success) {
				this.notify(true);
				console.debug('initializePsso - not success', this.identityProvider, nextUrl, success);
				this.router.navigate([AppRoutes.ACCESS_DENIED]);
				return Promise.resolve(null);
			}

			this.notify(success);

			const nextRoute = decodeURIComponent(nextUrl);
			return Promise.resolve(nextRoute);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Org Registration Portal
	// *
	async tryInitializeOrgReg(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin(this.identityProvider, OrgRegistrationRoutes.path());
		console.debug('tryInitializeOrgReg', authInfo);

		if (authInfo.loggedIn) {
			this.notify(true);

			if (authInfo.state) {
				const stateInfo = this.utilService.getSessionData(this.utilService.ORG_REG_STATE_KEY);
				return Promise.resolve(stateInfo);
			}
			return Promise.resolve(null);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Org Registration Portal
	// *
	async initializeOrgReg(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const nextUrl = await this.authenticationService.login(this.identityProvider, OrgRegistrationRoutes.path());
		console.debug('initializeOrgReg nextUrl', nextUrl);

		if (nextUrl) {
			// User is already logged in and clicks Login button.
			// For example, complete a registration then refresh the page.
			// Want it to start at the beginning and continue past login page.
			// this.postLoginNavigate(stateInfo);
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
		this.utilService.clearAllSessionData();

		this.authUserBceidService.clearUserData();
		this.authUserBcscService.clearUserData();
		this.authUserIdirService.clearUserData();

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
