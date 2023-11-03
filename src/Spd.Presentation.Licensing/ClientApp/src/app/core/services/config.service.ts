import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigurationResponse, IdentityProviderTypeCode } from 'src/app/api/models';
import { ConfigurationService } from 'src/app/api/services';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	public configs: ConfigurationResponse | null = null;

	constructor(private oauthService: OAuthService, private configurationService: ConfigurationService) {}

	public async configureOAuthService(loginType: IdentityProviderTypeCode, redirectUri: string): Promise<void> {
		if (loginType == IdentityProviderTypeCode.BusinessBceId) {
			return this.getBceidConfig(redirectUri).then((config) => {
				this.oauthService.configure(config);
				this.oauthService.setupAutomaticSilentRefresh();
			});
		}

		return this.getBcscConfig(redirectUri).then((config) => {
			this.oauthService.configure(config);
		});
	}

	private async getBceidConfig(redirectUri?: string): Promise<AuthConfig> {
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
		console.debug('[ConfigService] getBceidConfig', bceIdConfig, 'redirectUri', redirectUri);
		return bceIdConfig;
	}

	private async getBcscConfig(redirectUri?: string): Promise<AuthConfig> {
		const resp = this.configs?.bcscConfiguration!;

		const bcscConfig = {
			issuer: resp.issuer!,
			clientId: resp.clientId!,
			redirectUri,
			responseType: resp.responseType!,
			scope: resp.scope!,
			showDebugInformation: true,
			strictDiscoveryDocumentValidation: false,
		};
		console.debug('[ConfigService] getBcscConfig', bcscConfig, 'redirectUri', redirectUri);
		return bcscConfig;
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
