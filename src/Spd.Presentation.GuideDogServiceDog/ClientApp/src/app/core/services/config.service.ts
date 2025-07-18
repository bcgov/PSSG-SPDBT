import { Injectable } from '@angular/core';
import { ConfigurationResponse, DogSchoolResponse } from '@app/api/models';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConfigurationService, DogSchoolService } from 'src/app/api/services';
import { UtilService } from './util.service';

export interface DogSchoolResponseExt {
	schoolId?: string;
	schoolName?: string | null;
	schoolAddress?: string | null;
}

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	public configs: ConfigurationResponse | null = null;
	public accreditedDogSchools: DogSchoolResponseExt[] | null = null;

	constructor(
		private oauthService: OAuthService,
		private utilService: UtilService,
		private dogSchoolService: DogSchoolService,
		private configurationService: ConfigurationService
	) {}

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

	public getAccreditedDogSchools(): Observable<Array<DogSchoolResponseExt>> {
		if (this.accreditedDogSchools) {
			return of(this.accreditedDogSchools);
		}
		return this.dogSchoolService.apiAccreditedDogSchoolsGet().pipe(
			tap((resp: Array<DogSchoolResponse>) => {
				const schools = resp.map((school: DogSchoolResponse) => {
					const formattedSchool: DogSchoolResponseExt = {
						schoolId: school.id,
						schoolName: school.schoolName,
						schoolAddress: this.utilService.getAddressString({
							addressLine1: school.addressLine1,
							addressLine2: school.addressLine2,
							city: school.city,
							province: school.province,
							postalCode: school.postalCode,
							country: school.country,
						}),
					};
					return formattedSchool;
				});
				console.debug('[ConfigService] getAccreditedDogSchools', schools);

				schools.sort((a: DogSchoolResponse, b: DogSchoolResponse) =>
					this.utilService.compareByStringUpper(a.schoolName, b.schoolName)
				);

				this.accreditedDogSchools = schools;
				return resp;
			})
		);
	}

	public async configureOAuthService(redirectUri: string): Promise<void> {
		return this.getBcscConfig(redirectUri).then((config) => {
			this.oauthService.configure(config);
			this.oauthService.setupAutomaticSilentRefresh();
		});
	}

	public getBcscIssuer(): string | null {
		const resp = this.configs?.bcscConfiguration ?? {};
		return resp.issuer ?? null;
	}

	public isProduction(): boolean {
		return this.configs?.environment === 'Production' || this.configs?.environment === 'Training';
	}

	public isDevelopment(): boolean {
		return this.configs?.environment === 'Development';
	}

	getBcscIdentityProvider(): string {
		const bcscConfiguration = this.configs?.bcscConfiguration!;
		return bcscConfiguration.identityProvider!;
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
			customQueryParams: { kc_idp_hint: resp.identityProvider },
		};
		console.debug('[ConfigService] getBcscConfig', bcscConfig, 'redirectUri', redirectUri);
		return bcscConfig;
	}
}
