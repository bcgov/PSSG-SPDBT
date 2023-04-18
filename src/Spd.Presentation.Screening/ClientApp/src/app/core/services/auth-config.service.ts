import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BCeIdConfigurationResponse, RecaptchaConfigurationResponse } from 'src/app/api/models';
import { ConfigurationService } from 'src/app/api/services';

@Injectable({
	providedIn: 'root',
})
export class AuthConfigService {
	public bceIdConfig: BCeIdConfigurationResponse | null = null;
	public recaptchaConfig: RecaptchaConfigurationResponse | null = null;

	constructor(private configurationService: ConfigurationService) {}

	public async getAuthConfig(redirectUri: string): Promise<AuthConfig> {
		const resp = this.bceIdConfig!;
		const bceIdConfig = {
			issuer: resp.issuer!,
			clientId: resp.clientId!,
			redirectUri,
			responseType: resp.responseType!,
			scope: resp.scope!,
			showDebugInformation: true,
			postLogoutRedirectUri: resp.postLogoutRedirectUri!,
			customQueryParams: { kc_idp_hint: 'bceidboth' },
		};
		console.debug('[getAuthConfig] bceIdConfig', bceIdConfig, 'redirectUri', redirectUri);
		return bceIdConfig;
	}

	public getBceidConfig(): Observable<BCeIdConfigurationResponse> {
		if (this.bceIdConfig) {
			return of(this.bceIdConfig);
		}

		return this.configurationService.apiBceidConfigurationGet().pipe(
			tap((resp: BCeIdConfigurationResponse) => {
				this.bceIdConfig = { ...resp };
				return resp;
			})
		);
	}

	public getRecaptchaConfig(): Observable<RecaptchaConfigurationResponse> {
		if (this.recaptchaConfig) {
			return of(this.recaptchaConfig);
		}

		return this.configurationService.apiRecaptchaConfigurationGet().pipe(
			tap((resp: RecaptchaConfigurationResponse) => {
				this.recaptchaConfig = { ...resp };
				return resp;
			})
		);
	}
}
