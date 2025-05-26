import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityProviderTypeCode } from '@app/api/models';
import { AppRoutes } from '@app/app.routes';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
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
		private router: Router
	) {}

	//----------------------------------------------------------
	// * Guide Dog Service Dog Portal - BCSC
	// *
	async initializeGuideDogServiceDogBCSC(
		returnComponentRoute: string | undefined = undefined,
		stateInfo: string | null = null
	): Promise<string | null> {
		this.notify(false);

		this.identityProvider = IdentityProviderTypeCode.BcServicesCard;

		const returningRoute = AppRoutes.pathGdsdMainApplications();

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

		this.authUserBcscService.clearUserData();

		this.notify(false);

		if (loginType == IdentityProviderTypeCode.BcServicesCard) {
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
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

		// TODO fix
		// const bceidIdentityProvider = this.authenticationService.getBceidIdentityProvider();
		// const claims = this.oauthService.getIdentityClaims();
		// const identity_provider = claims ? claims['identity_provider'] : null;
		// const performLogout = !!(claims && identity_provider != bceidIdentityProvider);

		// console.debug('[AuthProcessService] logoutBcsc redirectUri', redirectUri);
		// console.debug('[AuthProcessService] logoutBcsc bceidIdentityProvider', bceidIdentityProvider);
		// console.debug('[AuthProcessService] logoutBcsc identity_provider', identity_provider);
		// console.debug('[AuthProcessService] logoutBcsc performLogout', performLogout);

		// if (performLogout) {
		this.oauthService.logOut({ post_logout_redirect_uri: redirectUri });
		// }
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
