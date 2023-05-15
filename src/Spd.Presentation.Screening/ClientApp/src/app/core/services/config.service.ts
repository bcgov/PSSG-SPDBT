import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigurationResponse } from 'src/app/api/models';
import { ConfigurationService } from 'src/app/api/services';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	public configs: ConfigurationResponse | null = null;

	constructor(private configurationService: ConfigurationService) {}

	public async getAuthConfig(redirectUri?: string): Promise<AuthConfig> {
		const resp = this.configs?.oidcConfiguration!;
		const bceIdConfig = {
			issuer: resp.issuer!,
			clientId: resp.clientId!,
			redirectUri,
			responseType: resp.responseType!,
			scope: resp.scope!,
			showDebugInformation: true,
			postLogoutRedirectUri: resp.postLogoutRedirectUri!,
			customQueryParams: { kc_idp_hint: 'bceidbusiness' },
		};
		console.debug('[getAuthConfig] bceIdConfig', bceIdConfig, 'redirectUri', redirectUri);
		return bceIdConfig;
	}

	public getConfigs(): Observable<ConfigurationResponse> {
		if (this.configs) {
			return of(this.configs);
		}

		return this.configurationService.apiConfigurationGet().pipe(
			tap((resp: ConfigurationResponse) => {
				this.configs = { ...resp };
				return resp;
			})
		);
	}
}
