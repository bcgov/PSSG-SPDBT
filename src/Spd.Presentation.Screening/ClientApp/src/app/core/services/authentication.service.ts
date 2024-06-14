import { Inject, Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { IdentityProviderTypeCode } from '../code-types/code-types.models';
import { ConfigService } from './config.service';
import { APP_BASE_HREF } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  constructor(
    @Inject(APP_BASE_HREF) private baseHref: string,
    private oauthService: OAuthService,
    private configService: ConfigService) { }

  //----------------------------------------------------------
  // *
  // *
  public async tryLogin(
    loginType: IdentityProviderTypeCode,
    returnComponentRoute: string
  ): Promise<{ state: any; loggedIn: boolean }> {
    await this.configService.configureOAuthService(loginType, this.createReturnUrl(returnComponentRoute));

    const isLoggedIn = await this.oauthService
      .loadDiscoveryDocumentAndTryLogin()
      .then((_) => this.oauthService.hasValidAccessToken())
      .catch((_) => false);

    console.debug('[AuthenticationService.tryLogin] isLoggedIn', isLoggedIn, this.oauthService.hasValidAccessToken());

    return {
      state: this.oauthService.state ?? null,
      loggedIn: isLoggedIn,
    };
  }

  //----------------------------------------------------------
  // *
  // *
  public async login(
    loginType: IdentityProviderTypeCode,
    returnComponentRoute: string
  ): Promise<string | null> {
    await this.configService.configureOAuthService(loginType, this.createReturnUrl(returnComponentRoute));

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

  private createReturnUrl(returnComponentRoute: string): string {
    const url = window.location.origin + this.baseHref + returnComponentRoute;
    console.debug('[AuthenticationService.createReturnUrl] url', url);
    return url;
  }
}
