import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { IdentityProviderTypeCode } from '../code-types/code-types.models';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(private oauthService: OAuthService, private configService: ConfigService) { }

  //----------------------------------------------------------
  // *
  // *
  public async tryLogin(
    loginType: IdentityProviderTypeCode,
    returnComponentRoute: string
  ): Promise<{ state: any; loggedIn: boolean }> {
    await this.configService.configureOAuthService(loginType, window.location.origin + '/' + window.location.pathname.split('/')[1] + returnComponentRoute);

    const isLoggedIn = await this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then((_) => this.oauthService.hasValidAccessToken())
      .catch((_) => false);

    console.debug('[AuthenticationService.tryLogin] isLoggedIn', isLoggedIn, this.oauthService.hasValidAccessToken());

    return {
      state: this.oauthService.state || null,
      loggedIn: isLoggedIn,
    };
  }

  //----------------------------------------------------------
  // *
  // *
  public async login(
    loginType: IdentityProviderTypeCode,
    returnComponentRoute: string | undefined = undefined
  ): Promise<string | null> {
    await this.configService.configureOAuthService(loginType, window.location.origin + '/' + window.location.pathname.split('/')[1] + returnComponentRoute);

    const returnRoute = location.pathname.substring(1);
    console.debug('[AuthenticationService] LOGIN', returnComponentRoute, returnRoute);

    const isLoggedIn = await this.oauthService
      .loadDiscoveryDocumentAndLogin({
        state: returnComponentRoute,
      })
      .then((_) => this.oauthService.hasValidAccessToken())
      .catch((_) => false);

    console.debug('[AuthenticationService] ISLOGGEDIN', isLoggedIn, this.oauthService.state);

    if (isLoggedIn) {
      return Promise.resolve(this.oauthService.state ?? returnComponentRoute ?? null);
    }

    return Promise.resolve(null);
  }

  //----------------------------------------------------------
  // *
  // *
  public getToken(): string {
    return this.oauthService.getAccessToken();
  }

  //----------------------------------------------------------
  // *
  // *
  public isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
}
