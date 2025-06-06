import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

		const returningRoute = AppRoutes.pathGdsdMainApplications();

		const loginInfo = await this.authenticationService.login(returnComponentRoute ?? returningRoute, stateInfo);

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

		this.oauthService.logOut();

		this.authUserBcscService.clearUserData();

		this.notify(false);

		this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
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

		this.oauthService.logOut({ post_logout_redirect_uri: redirectUri });
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
