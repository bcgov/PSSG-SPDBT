import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { AppRoutes } from 'src/app/app-routing.module';
import { AuthUserService } from 'src/app/core/services/auth-user.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { LicenceRoutes } from 'src/app/modules/licence-portal/licence-routing.module';
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
	// * Licence Portal
	// *
	async tryInitializeLicencePortal(): Promise<string | null> {
		//auth step 1 - user is not logged in, no state at all
		//auth step 3 - angular loads again here, KC posts the token, oidc lib reads token and returns state
		const authInfo = await this.authenticationService.tryLogin(LicenceRoutes.path());

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
	// * Licence Portal
	// *
	async initializeLicencePortal(): Promise<string | null> {
		const nextUrl = await this.authenticationService.login(LicenceRoutes.path());

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
	// *
	// *
	public logout(): void {
		this.oauthService.logOut();
		this.utilService.clearAllSessionData();
		this.authUserService.clearUserData();
		this.notify(false);

		this.router.navigate([AppRoutes.LANDING]);
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
