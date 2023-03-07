import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BCeIdConfigurationResponse } from 'src/app/api/models';
import { BCeIdOauthConfigurationService } from 'src/app/api/services';

@Injectable({
	providedIn: 'root',
})
export class AuthConfigService {
	public config: BCeIdConfigurationResponse | null = null;

	constructor(private bceIdOauthConfigurationService: BCeIdOauthConfigurationService) {}

	public async loadConfig(): Promise<BCeIdConfigurationResponse> {
		if (this.config !== null) {
			return this.config;
		}

		const config$ = this.bceIdOauthConfigurationService.apiBceidConfigurationGet().pipe(
			tap((resp: BCeIdConfigurationResponse) => {
				this.config = { ...resp };
			})
		);

		return lastValueFrom(config$);
	}

	public async getAuthConfig(redirectUri: string): Promise<AuthConfig> {
		return await this.loadConfig().then((resp) => ({
			issuer: resp.issuer!,
			clientId: resp.clientId!,
			redirectUri,
			responseType: resp.responseType!,
			scope: resp.scope!,
			showDebugInformation: true,
			postLogoutRedirectUri: resp.postLogoutRedirectUri!,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			customQueryParams: { kc_idp_hint: 'bceidboth' },
		}));
	}
}
