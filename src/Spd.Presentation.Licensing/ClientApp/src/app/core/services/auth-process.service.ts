import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { IdentityProviderTypeCode } from 'src/app/api/models';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { CrcRoutes } from 'src/app/modules/crc-portal/crc-routing.module';
import { CrrpRoutes } from 'src/app/modules/crrp-portal/crrp-routing.module';
import { OrgRegistrationRoutes } from 'src/app/modules/org-registration-portal/org-registration-routing.module';
import { PssoRoutes } from 'src/app/modules/psso-portal/psso-routing.module';
import { SecurityScreeningRoutes } from 'src/app/modules/security-screening-portal/security-screening-routing.module';
import { UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class AuthProcessService {
	private _waitUntilAuthentication$ = new BehaviorSubject<boolean>(false);
	waitUntilAuthentication$ = this._waitUntilAuthentication$.asObservable();

	loggedInUserTokenData: any = null;

	constructor(
		private oauthService: OAuthService,
		private utilService: UtilService,
		private authenticationService: AuthenticationService,
		private authUserService: AuthUserService,
		private router: Router
	) {}

	//----------------------------------------------------------
	// * CRRP Portal
	// *
	async initializeCrrp(): Promise<string | null> {
		const identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const nextUrl = await this.authenticationService.login(identityProvider, CrrpRoutes.path(CrrpRoutes.HOME));
		console.debug('CrrpComponent nextUrl', nextUrl);

		if (nextUrl) {
			const success = await this.authUserService.whoAmIAsync(identityProvider);

			if (!success) {
				this.notify(true);
				this.router.navigate([AppRoutes.ACCESS_DENIED]);
				return Promise.resolve(null);
			}

			this.notify(success);

			const userInfoMsgType = this.authUserService.bceidUserInfoProfile?.userInfoMsgType;
			if (userInfoMsgType) {
				this.router.navigate([AppRoutes.ACCESS_DENIED], { state: { userInfoMsgType: userInfoMsgType } });
				return Promise.resolve(null);
			}

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
		const identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const nextUrl = await this.authenticationService.login(identityProvider, SecurityScreeningRoutes.path());

		if (nextUrl) {
			const success = await this.authUserService.whoAmIAsync(identityProvider);
			this.notify(success);

			const nextRoute = decodeURIComponent(nextUrl);
			return Promise.resolve(nextRoute);
		}

		this.notify(false);
		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Crc Screening
	// *
	async tryInitializeCrc(): Promise<string | null> {
		const identityProvider = IdentityProviderTypeCode.BcServicesCard;

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin(identityProvider, CrcRoutes.path());

		if (authInfo.loggedIn) {
			const success = await this.authUserService.applicantUserInfoAsync();
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
	// * Crc Screening
	// *
	async initializeCrc(): Promise<string | null> {
		const identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const nextUrl = await this.authenticationService.login(identityProvider, CrcRoutes.path());

		if (nextUrl) {
			const success = await this.authUserService.applicantUserInfoAsync();
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
		const identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const nextUrl = await this.authenticationService.login(
			identityProvider,
			PssoRoutes.path(PssoRoutes.SCREENING_STATUSES)
		); // TODO change to IDIR

		if (nextUrl) {
			const success = await this.authUserService.whoAmIAsync(identityProvider);

			if (!success) {
				this.notify(true);
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
		const identityProvider = IdentityProviderTypeCode.BusinessBceId;

		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin(identityProvider, OrgRegistrationRoutes.path());
		console.log('tryInitializeOrgReg', authInfo);

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
		const nextUrl = await this.authenticationService.login(
			IdentityProviderTypeCode.BusinessBceId,
			OrgRegistrationRoutes.path()
		);
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
		const loginType = this.authUserService.loginType;

		this.oauthService.logOut();
		this.utilService.clearAllSessionData();
		this.authUserService.clearUserData();
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
