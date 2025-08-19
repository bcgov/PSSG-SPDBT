import { Injectable } from '@angular/core';
import { ConfigurationResponse, IdentityProviderTypeCode, LicenceFeeResponse } from '@app/api/models';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/api/services';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	public config: ConfigurationResponse | null = null;

	constructor(
		private oauthService: OAuthService,
		private configurationService: ConfigurationService
	) {}

	public getConfigs(): Observable<ConfigurationResponse> {
		if (this.config) {
			return of(this.config);
		}
		return this.configurationService.apiConfigurationGet().pipe(
			tap((resp: ConfigurationResponse) => {
				this.config = { ...resp };
				return resp;
			})
		);
	}

	public async configureOAuthService(loginType: IdentityProviderTypeCode, redirectUri: string): Promise<void> {
		if (loginType == IdentityProviderTypeCode.BusinessBceId) {
			return this.getBceidConfig(redirectUri).then((config) => {
				this.oauthService.configure(config);
				this.oauthService.setupAutomaticSilentRefresh();
			});
		}

		return this.getBcscConfig(redirectUri).then((config) => {
			this.oauthService.configure(config);
			this.oauthService.setupAutomaticSilentRefresh();
		});
	}

	public getBcscIssuer(): string | null {
		const resp = this.config?.bcscConfiguration ?? {};
		return resp.issuer ?? null;
	}

	public getLicenceFees(): Array<LicenceFeeResponse> {
		return this.config?.licenceFees ?? [];
	}

	public isEnableMdraFeatures(): boolean {
		return this.config?.enableMdraFeatures ?? false;
	}

	public isEnableSecurityBusinessMergeFeatures(): boolean {
		return this.config?.enableSecurityBusinessMergeFeatures ?? false;
	}

	public isEnableAnonymousPermitFeatures(): boolean {
		return this.config?.enableAnonymousPermitFeatures ?? false;
	}

	public isProduction(): boolean {
		return this.config?.environment === 'Production' || this.config?.environment === 'Training';
	}

	public isDevelopment(): boolean {
		return this.config?.environment === 'Development';
	}

	getBcscIdentityProvider(): string {
		const bcscConfiguration = this.config?.bcscConfiguration!;
		return bcscConfiguration.identityProvider!;
	}

	getBceidIdentityProvider(): string {
		const bceidConfiguration = this.config?.oidcConfiguration!;
		return bceidConfiguration.identityProvider!;
	}

	private async getBceidConfig(redirectUri?: string): Promise<AuthConfig> {
		const resp = this.config?.oidcConfiguration!;
		const bceIdConfig = {
			issuer: resp.issuer!,
			clientId: resp.clientId!,
			redirectUri,
			responseType: resp.responseType!,
			scope: resp.scope!,
			showDebugInformation: true,
			postLogoutRedirectUri: resp.postLogoutRedirectUri!,
			customQueryParams: { kc_idp_hint: resp.identityProvider },
		};
		console.debug('[ConfigService] getBceidConfig', bceIdConfig, 'redirectUri', redirectUri);
		return bceIdConfig;
	}

	private async getBcscConfig(redirectUri?: string): Promise<AuthConfig> {
		const resp = this.config?.bcscConfiguration!;
		const bcscConfig = {
			issuer: resp.issuer!,
			clientId: resp.clientId!,
			redirectUri,
			responseType: resp.responseType!,
			scope: resp.scope!,
			showDebugInformation: true,
			customQueryParams: { kc_idp_hint: resp.identityProvider },
		};
		console.debug('[ConfigService] getBcscConfig', bcscConfig, 'redirectUri', redirectUri);
		return bcscConfig;
	}
}
