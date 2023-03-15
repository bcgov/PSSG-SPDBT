import { Injectable } from '@angular/core';
import { AuthConfig } from 'angular-oauth2-oidc';
import { lastValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BCeIdConfigurationResponseActionResult } from 'src/app/api/models';
import { BCeIdConfigurationService } from 'src/app/api/services';

@Injectable({
	providedIn: 'root',
})
export class AuthConfigService {
	public config: BCeIdConfigurationResponseActionResult | null = null;

	constructor(private bceIdConfigurationService: BCeIdConfigurationService) {}

	public async loadConfig(): Promise<BCeIdConfigurationResponseActionResult> {
		if (this.config !== null) {
			return this.config;
		}

		const config$ = this.bceIdConfigurationService.apiBceidConfigurationGet().pipe(
			tap((resp: BCeIdConfigurationResponseActionResult) => {
				this.config = { ...resp };
			})
		);

		return lastValueFrom(config$);
	}

	public async getAuthConfig(redirectUri: string): Promise<AuthConfig> {
		console.debug('[getAuthConfig] redirectUri', redirectUri);
		return await this.loadConfig().then((resp) => {
			const configResp = resp.value!;
			const config = {
				issuer: configResp.issuer!,
				clientId: configResp.clientId!,
				redirectUri,
				responseType: configResp.responseType!,
				scope: configResp.scope!,
				showDebugInformation: true,
				postLogoutRedirectUri: configResp.postLogoutRedirectUri!,
				// eslint-disable-next-line @typescript-eslint/naming-convention
				customQueryParams: { kc_idp_hint: 'bceidboth' },
			};
			console.debug('[getAuthConfig] config', config);
			return config;
		});
	}
}
