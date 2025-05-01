import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityProviderTypeCode } from '@app/api/models';
import { AppRoutes } from '@app/app-routes';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { GuideDogServiceDogRoutes } from '@app/modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { AuthUserBceidService } from './auth-user-bceid.service';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class AuthProcessService {
	private _waitUntilAuthentication$ = new BehaviorSubject<boolean>(false);
	waitUntilAuthentication$ = this._waitUntilAuthentication$.asObservable();

	private _hasValidToken$ = new BehaviorSubject<boolean>(false);
	hasValidToken$ = this._hasValidToken$.asObservable();

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
	async initializeLicencingBCSC(
		returnComponentRoute: string | undefined = undefined,
		stateInfo: string | null = null
	): Promise<string | null> {
		this.notify(false);

		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const returningRoute = PersonalLicenceApplicationRoutes.pathUserApplications();

		const loginInfo = await this.authenticationService.login(
			this.identityProvider,
			returnComponentRoute ?? returningRoute,
			stateInfo
		);

		this.notifyValidToken(loginInfo.loggedIn);

		console.debug('[AuthProcessService] initializeLicencingBCSC loginInfo', returnComponentRoute, loginInfo);

		if (loginInfo.returnRoute) {
			const success = await this.authUserBcscService.applicantLoginAsync();
			this.notify(success);

			const nextRoute = decodeURIComponent(loginInfo.returnRoute);
			return Promise.resolve(nextRoute);
		}

		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// * Controlling Member Crc Invite - BCSC - try login
	// *
	async tryInitializeControllingMemberCrcInviteBcsc(returningRoute: string): Promise<string | null> {
		this.notify(false);

		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		// const returningRoute = ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_LOGIN);
		const loginInfo = await this.authenticationService.tryLogin(this.identityProvider, returningRoute);

		this.notifyValidToken(loginInfo.loggedIn);

		if (loginInfo.loggedIn) {
			const success = await this.authUserBcscService.applicantLoginAsync();
			this.notify(success);

			if (loginInfo.state) {
				const stateInfo = this.utilService.getSessionData(this.utilService.CM_CRC_STATE_KEY);
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
	// * Controlling Member Crc Invite - BCSC - login
	// *
	async initializeControllingMemberCrcInviteBcsc(
		stateInfo: string,
		returningRoute: string
	): Promise<{
		returnRoute: string | null;
		state: string | null;
		loggedIn: boolean;
	}> {
		this.notify(false);

		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		// const returningRoute = ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_LOGIN);
		const loginInfo = await this.authenticationService.login(this.identityProvider, returningRoute, stateInfo);

		this.notifyValidToken(loginInfo.loggedIn);

		if (loginInfo.loggedIn) {
			const success = await this.authUserBcscService.applicantLoginAsync();
			this.notify(success);

			return Promise.resolve(loginInfo);
		}

		return Promise.resolve(loginInfo);
	}

	//----------------------------------------------------------
	// * Licencing Portal - BCeID
	// *
	async initializeLicencingBCeID(
		defaultBizId: string | null = null,
		defaultRoute: string | null = null,
		state: string | undefined = undefined
	): Promise<{ returnRoute: string | null; state: string | null; loggedIn: boolean }> {
		this.notify(false);

		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const returningRoute = BusinessLicenceApplicationRoutes.pathBusinessApplications();

		console.debug('[AuthProcessService] initializeLicencingBCeID defaultBizId', defaultBizId);
		console.debug('[AuthProcessService] initializeLicencingBCeID return route', defaultRoute ?? returningRoute);
		console.debug('[AuthProcessService] initializeLicencingBCeID state', state);

		const loginInfo = await this.authenticationService.login(
			this.identityProvider,
			defaultRoute ?? returningRoute,
			state
		);

		this.notifyValidToken(loginInfo.loggedIn);

		console.debug('[AuthProcessService] initializeLicencingBCeID loginInfo', loginInfo, 'defaultBizId', defaultBizId);

		if (loginInfo.returnRoute) {
			const success = await this.authUserBceidService.whoAmIAsync(defaultBizId);
			this.notify(success);

			const nextRoute = decodeURIComponent(loginInfo.returnRoute);
			loginInfo.returnRoute = nextRoute;
			return Promise.resolve(loginInfo);
		}

		return Promise.resolve(loginInfo);
	}

	//----------------------------------------------------------
	// * Business Licencing Portal - BCeID - User Invitation
	// *
	async initializeBusinessLicenceInvitationBCeID(
		invitationId: string
	): Promise<{ returnRoute: string | null; state: string | null; loggedIn: boolean }> {
		this.notify(false);

		this.identityProvider = IdentityProviderTypeCode.BusinessBceId;

		const returningRoute = BusinessLicenceApplicationRoutes.path(
			`${BusinessLicenceApplicationRoutes.PORTAL_ADMINISTRATOR_INVITATION}/${invitationId}`
		);

		console.debug('[AuthProcessService] initializeBusinessLicenceInvitationBCeID returningRoute', returningRoute);

		const loginInfo = await this.authenticationService.login(this.identityProvider, returningRoute);

		this.notifyValidToken(loginInfo.loggedIn);

		console.debug('[AuthProcessService] initializeBusinessLicenceInvitationBCeID loginInfo', loginInfo);

		if (loginInfo.returnRoute) {
			this.notify(true);

			const nextRoute = decodeURIComponent(loginInfo.returnRoute);
			loginInfo.returnRoute = nextRoute;
			return Promise.resolve(loginInfo);
		}

		return Promise.resolve(loginInfo);
	}

	//----------------------------------------------------------
	// * Guide Dog Service Dog Portal - BCSC
	// *
	async initializeGuideDogServiceDogBCSC(
		returnComponentRoute: string | undefined = undefined,
		stateInfo: string | null = null
	): Promise<string | null> {
		this.notify(false);

		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const returningRoute = GuideDogServiceDogRoutes.pathGdsdMainApplications();

		const loginInfo = await this.authenticationService.login(
			this.identityProvider,
			returnComponentRoute ?? returningRoute,
			stateInfo
		);

		this.notifyValidToken(loginInfo.loggedIn);

		console.debug('[AuthProcessService] initializeGuideDogServiceDogBCSC loginInfo', returnComponentRoute, loginInfo);

		if (loginInfo.returnRoute) {
			const success = await this.authUserBcscService.applicantLoginAsync();
			this.notify(success);

			const nextRoute = decodeURIComponent(loginInfo.returnRoute);
			return Promise.resolve(nextRoute);
		}

		return Promise.resolve(null);
	}

	//----------------------------------------------------------
	// *
	// *
	public logout(): void {
		console.debug('[AuthProcessService] logout');

		const loginType = this.identityProvider;

		this.identityProvider = null;
		this.oauthService.logOut();
		this.utilService.clearAllSessionData();

		this.authUserBcscService.clearUserData();
		this.authUserBceidService.clearUserData();

		this.notify(false);

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			const currentPath = location.pathname;
			if (currentPath.includes(GuideDogServiceDogRoutes.MODULE_PATH)) {
				this.router.navigateByUrl(GuideDogServiceDogRoutes.path());
			} else {
				this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
			}
		}
	}

	//----------------------------------------------------------
	// *
	// *
	public logoutBcsc(redirectComponentRoute?: string): void {
		console.debug('[AuthProcessService] logoutBcsc', redirectComponentRoute);

		let redirectUri = location.origin;
		if (redirectComponentRoute) {
			redirectUri = this.authenticationService.createRedirectUrl(redirectComponentRoute);
		}

		const bceidIdentityProvider = this.authenticationService.getBceidIdentityProvider();
		const claims = this.oauthService.getIdentityClaims();
		const identity_provider = claims ? claims['identity_provider'] : null;
		const performLogout = !!(claims && identity_provider != bceidIdentityProvider);

		console.debug('[AuthProcessService] logoutBcsc redirectUri', redirectUri);
		console.debug('[AuthProcessService] logoutBcsc bceidIdentityProvider', bceidIdentityProvider);
		console.debug('[AuthProcessService] logoutBcsc identity_provider', identity_provider);
		console.debug('[AuthProcessService] logoutBcsc performLogout', performLogout);

		if (performLogout) {
			this.oauthService.logOut({ post_logout_redirect_uri: redirectUri });
		}
	}

	//----------------------------------------------------------
	// *
	// *
	public logoutBceid(redirectComponentRoute?: string): void {
		console.debug('[AuthProcessService] logoutBceid', redirectComponentRoute);

		let redirectUri = location.origin;
		if (redirectComponentRoute) {
			redirectUri = this.authenticationService.createRedirectUrl(redirectComponentRoute);
		}

		const bceidIdentityProvider = this.authenticationService.getBceidIdentityProvider();
		const claims = this.oauthService.getIdentityClaims();
		const identity_provider = claims ? claims['identity_provider'] : null;
		const performLogout = !!(claims && identity_provider === bceidIdentityProvider);

		console.debug('[AuthProcessService] logoutBceid redirectUri', redirectUri);
		console.debug('[AuthProcessService] logoutBcsc bceidIdentityProvider', bceidIdentityProvider);
		console.debug('[AuthProcessService] logoutBceid identity_provider', identity_provider);
		console.debug('[AuthProcessService] logoutBceid performLogout', performLogout);

		if (performLogout) {
			this.oauthService.logOut({ post_logout_redirect_uri: redirectUri });
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

	private notifyValidToken(hasValidToken: boolean): void {
		this._hasValidToken$.next(hasValidToken);
	}
}
