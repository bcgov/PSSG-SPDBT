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
import { PssoaRoutes } from 'src/app/modules/pssoa-portal/pssoa-routing.module';
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

	public getCurrentWaitUntilAuthenticatedValue(): boolean {
		return this._waitUntilAuthentication$.getValue();
	}

	public refreshToken(): void {
		this.oauthService.refreshToken();
	}

	public isLoggedIn(): boolean {
		return this.authenticationService.isLoggedIn();
	}

	//----------------------------------------------------------
	// * CRRP Portal
	// *
	async initializeCrrp(defaultOrgId: string | null = null, defaultRoute: string | null = null): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const nextRoute = defaultRoute ?? CrrpRoutes.path(CrrpRoutes.HOME);
		const nextUrl = await this.authenticationService.login(this.identityProvider, nextRoute);
		console.debug('[initializeCrrp] nextUrl', nextUrl);

		if (nextUrl) {
			const success = await this.authUserBceidService.whoAmIAsync(defaultOrgId);
			if (!success) {
				this.notify(success);
				console.debug('initializeCrrp - whoami not successful', this.identityProvider, nextUrl, success);
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
	// * CRRP Portal - Invitation for Organization to link to BCeID
	// *
	async initializeCrrpOrgLinkBceid(defaultOrgId: string, defaultRoute: string | null = null): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const nextRoute = defaultRoute ?? CrrpRoutes.path(CrrpRoutes.HOME);
		const nextUrl = await this.authenticationService.login(this.identityProvider, nextRoute);
		console.debug('[initializeCrrpOrgLinkBceid] nextUrl', nextUrl);

		if (nextUrl) {
			const linksuccess = await this.authUserBceidService.linkBceidPrimaryUsers(defaultOrgId);
			if (!linksuccess) {
				this.notify(linksuccess);
				console.debug(
					'[initializeCrrpOrgLinkBceid] - link not successful',
					this.identityProvider,
					nextUrl,
					linksuccess
				);
				return Promise.resolve(null);
			}

			const success = await this.authUserBceidService.whoAmIAsync(defaultOrgId);
			if (!success) {
				this.notify(success);
				console.debug('[initializeCrrpOrgLinkBceid] - whoami not successful', this.identityProvider, nextUrl, success);
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
	// * CRRP Portal - User Invitation
	// * sign in but do not call whoami/org endpoints
	//
	async initializeCrrpUserInvitation(invitationId: string): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const nextRoute = CrrpRoutes.path(`${CrrpRoutes.INVITATION}/${invitationId}`);
		const nextUrl = await this.authenticationService.login(this.identityProvider, nextRoute);
		console.debug('[initializeCrrpUserInvitation] nextUrl', nextUrl);

		if (nextUrl) {
			this.notify(true);

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

		const nextRoute = SecurityScreeningRoutes.path();
		const nextUrl = await this.authenticationService.login(this.identityProvider, nextRoute);
		console.debug('[initializeSecurityScreening] nextUrl', nextUrl);

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
				const stateInfo = this.utilService.getSessionData(this.utilService.CRRPA_PORTAL_STATE_KEY);
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

		const nextRoute = CrrpaRoutes.path();
		const nextUrl = await this.authenticationService.login(this.identityProvider, nextRoute);
		console.debug('[initializeCrrpa] nextUrl', nextUrl);

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

		const nextRoute = PssoRoutes.path(PssoRoutes.SCREENING_STATUSES);
		const nextUrl = await this.authenticationService.login(this.identityProvider, nextRoute);
		console.debug('[initializePsso] nextUrl', nextUrl);

		if (nextUrl) {
			const success = await this.authUserIdirService.whoAmIAsync();

			if (!success) {
				this.notify(true);
				console.debug('initializePsso - whoami not successful', this.identityProvider, nextUrl, success);
				this.router.navigate([AppRoutes.ACCESS_DENIED]);
				return Promise.resolve(null);
			}

			// SPDBT-2412 - show login failure if orgName is missing
			const idirUserWhoamiProfile = this.authUserIdirService.idirUserWhoamiProfile;
			if (!idirUserWhoamiProfile?.orgName) {
				this.router.navigate([AppRoutes.LOGIN_FAILURE], {
					state: {
						identityProviderTypeCode: IdentityProviderTypeCode.Idir,
						orgCodeFromIdir: idirUserWhoamiProfile?.orgCodeFromIdir,
					},
				});
				this.logout(true);
				this.notify(false);
				return Promise.resolve(null);
			}

			this.notify(success);

			let nextRoute = decodeURIComponent(nextUrl);

			// SPDBT-1535 - if this is the first time logging in, override the next route.
			if (this.authUserIdirService.idirUserWhoamiProfile?.isFirstTimeLogin) {
				nextRoute = PssoRoutes.path(PssoRoutes.ORG_TERMS_AND_CONDITIONS);
			}
			console.debug('[initializePsso] nextRoute', nextRoute);
			return Promise.resolve(nextRoute);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Pssoa Screening
	// *
	async tryInitializePssoa(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin(this.identityProvider, PssoaRoutes.path());

		if (authInfo.loggedIn) {
			const success = await this.authUserBcscService.applicantUserInfoAsync();
			this.notify(success);

			if (authInfo.state) {
				const stateInfo = this.utilService.getSessionData(this.utilService.PSSOA_PORTAL_STATE_KEY);
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
	// * Pssoa Screening
	// *
	async initializePssoa(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const nextRoute = PssoaRoutes.path();
		const nextUrl = await this.authenticationService.login(this.identityProvider, nextRoute);
		console.debug('[initializePssoa] nextUrl', nextUrl);

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
	// * Org Registration Portal
	// *
	async tryInitializeOrgReg(): Promise<string | null> {
		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin(this.identityProvider, OrgRegistrationRoutes.path());
		console.debug('tryInitializeOrgReg', authInfo);

		const identityClaims = this.oauthService.getIdentityClaims();
		const isValidLogin = this.checkLoginIdentityIsValid(
			authInfo.loggedIn,
			this.identityProvider,
			identityClaims ? identityClaims['preferred_username'] : undefined
		);

		if (!isValidLogin) {
			this.logout();
			this.notify(false);
			return Promise.resolve(null);
		}

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

		const nextRoute = OrgRegistrationRoutes.path();
		const nextUrl = await this.authenticationService.login(this.identityProvider, nextRoute);
		console.debug('[initializeOrgReg] nextUrl', nextUrl);

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
	public logout(noRedirectToLogoutUrl: boolean = false): void {
		const loginType = this.identityProvider;

		this.identityProvider = null;
		this.oauthService.logOut(noRedirectToLogoutUrl);
		this.utilService.clearAllSessionData();

		this.authUserBceidService.clearUserData();
		this.authUserBcscService.clearUserData();
		this.authUserIdirService.clearUserData();

		this.notify(false);

		if (!noRedirectToLogoutUrl && loginType == IdentityProviderTypeCode.BcServicesCard) {
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
		} else if (loginType == IdentityProviderTypeCode.Idir) {
			isValid = preferredUsername?.endsWith('idir') ?? false;
		} else {
			// IdentityProviderTypeCode.BcServicesCard
			isValid = !preferredUsername;
		}

		return isValid;
	}
}
