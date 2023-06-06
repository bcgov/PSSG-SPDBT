import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { LoginTypeCode } from '../code-types/login-type.model';
import { AuthUserService } from './auth-user.service';
import { ConfigService } from './config.service';
import { UtilService } from './util.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
	private _waitUntilAuthentication$ = new BehaviorSubject<boolean>(false);
	waitUntilAuthentication$ = this._waitUntilAuthentication$.asObservable();

	loggedInUserTokenData: any = null;

	constructor(
		private oauthService: OAuthService,
		private authUserService: AuthUserService,
		private utilService: UtilService,
		private configService: ConfigService
	) {}

	public async tryLogin(
		loginType: LoginTypeCode,
		returnComponentRoute: string
	): Promise<{ state: any; loggedIn: boolean }> {
		await this.configureOAuthService(loginType, window.location.origin + returnComponentRoute);

		const isLoggedIn = await this.oauthService
			.loadDiscoveryDocumentAndTryLogin()
			.then((_) => this.oauthService.hasValidAccessToken())
			.catch((_) => false);

		console.debug('[AuthenticationService.tryLogin] isLoggedIn', isLoggedIn, this.oauthService.hasValidAccessToken());

		if (isLoggedIn) {
			this.authUserService.whoAmI().subscribe({
				next: (res) => {
					this.notify(true);
				},
				error: (err) => {
					console.error('Login Error', err);
					this.notify(false);
				},
			});
		} else {
			this.notify(false);
		}

		return {
			state: this.oauthService.state || null,
			loggedIn: isLoggedIn,
		};
	}

	public async login(
		loginType: LoginTypeCode,
		returnComponentRoute: string | undefined = undefined
	): Promise<string | null> {
		await this.configureOAuthService(loginType, window.location.origin + returnComponentRoute);

		const returnRoute = location.pathname.substring(1);
		console.debug('[AuthenticationService] login', returnComponentRoute, returnRoute);

		const isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
			state: returnRoute,
		});

		// this.oauthService.initLoginFlow(returnRoute);
		// const isLoggedIn = this.oauthService.hasValidAccessToken();
		console.debug('[xxxxxxxxxxxxxxxxx] login hasValidAccessToken', this.oauthService.hasValidAccessToken());

		if (isLoggedIn) {
			// const temp = await this.oauthService.loadUserProfile();
			// console.log('xxxxxxxxxxxxxxxxx');

			// this.oauthService.loadUserProfile().then((user) => {
			// 	console.log('user : ', user);
			// });

			// const decodedToken = this.utilService.getDecodedAccessToken(temp.body);
			// console.log('decodedToken', decodedToken);
			// this.notify(isLoggedIn);

			const success = await this.authUserService.setOrgSelection();
			this.notify(success);
			return Promise.resolve(this.oauthService.state || returnRoute);
		} else {
			this.notify(isLoggedIn);
			return Promise.resolve(null);
		}
	}

	// public async loginx(
	// 	loginType: LoginTypeCode,
	// 	returnComponentRoute: string | undefined = undefined
	// ): Promise<string | null> {
	// 	await this.configureOAuthService(loginType, window.location.origin + returnComponentRoute);

	// 	const returnRoute = location.pathname.substring(1);
	// 	console.debug('[AuthenticationService] login', returnComponentRoute);

	// 	let isLoggedIn = this.oauthService.hasValidAccessToken();
	// 	if (!isLoggedIn) {
	// 		if (loginType == LoginTypeCode.Bceid) {
	// 			isLoggedIn = await this.oauthService.loadDiscoveryDocumentAndLogin({
	// 				state: returnRoute,
	// 			});
	// 		} else {
	// 			// this.oauthService.initLoginFlow(returnRoute);
	// 			// isLoggedIn = this.oauthService.hasValidAccessToken();
	// 		}
	// 	}
	// 	console.debug('[xxxxxxxxxxxxxxxxx] login hasValidAccessToken', this.oauthService.hasValidAccessToken());
	// 	console.debug('[xxxxxxxxxxxxxxxxx] login hasValidIdToken', this.oauthService.hasValidIdToken());

	// 	console.debug('[AuthenticationService] login isLoggedIn', isLoggedIn);
	// 	if (isLoggedIn) {
	// 		// if (loginType == LoginTypeCode.Bcsc) {
	// 		// 	const temp = await this.oauthService.loadUserProfile();
	// 		// 	console.log('temp', temp);
	// 		// }

	// 		const success = await this.authUserService.setOrgSelection();
	// 		this.notify(success);
	// 		return Promise.resolve(this.oauthService.state || returnRoute);
	// 	} else {
	// 		this.notify(isLoggedIn);
	// 		return Promise.resolve(null);
	// 	}
	// }

	public logout(): void {
		this.oauthService.logOut();
		this.utilService.clearAllSessionData();
		this.notify(false);
	}

	public getToken(): string {
		return this.oauthService.getAccessToken();
	}

	public isLoggedIn(): boolean {
		return this.oauthService.hasValidAccessToken();
	}

	public async configureOAuthService(loginType: LoginTypeCode, redirectUri: string): Promise<void> {
		if (loginType == LoginTypeCode.Bceid) {
			return this.configService.getBceidConfig(redirectUri).then((config) => {
				this.oauthService.configure(config);
				this.oauthService.setupAutomaticSilentRefresh();
			});
		}

		return this.configService.getBcscConfig(redirectUri).then((config) => {
			this.oauthService.configure(config);
			this.oauthService.setupAutomaticSilentRefresh();
		});
	}

	private notify(isLoggedIn: boolean): void {
		const token = this.getToken();

		if (!isLoggedIn || !token) {
			this.authUserService.setOrgProfile();
			this._waitUntilAuthentication$.next(false);
		} else {
			const decodedToken = this.utilService.getDecodedAccessToken(token);
			console.debug('[AuthenticationService.setDecodedToken] decodedToken', decodedToken);
			this.loggedInUserTokenData = decodedToken;
			this._waitUntilAuthentication$.next(true);
		}
	}
}
