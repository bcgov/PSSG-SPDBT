import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { WorkerLicenceResponse } from 'src/app/api/models';
import { LicenceApplicationService } from './licence-application.service';

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationAuthenticatedService {
	constructor(private licenceApplicationService: LicenceApplicationService) {}

	/**
	 * Reset the licence formgroup
	 */
	reset(): void {
		this.licenceApplicationService.reset();
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewLicence(): Observable<any> {
		return this.licenceApplicationService.createNewLicenceAuthenticated().pipe(
			tap((resp: any) => {
				console.debug('NEW LicenceApplicationAuthenticatedService licenceModelFormGroup', resp);
				this.licenceApplicationService.initialized = true;
			})
		);
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	loadDraftLicence(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.licenceApplicationService.loadDraftLicenceAuthenticated(licenceAppId).pipe(
			tap((resp: any) => {
				console.debug('LOAD LicenceApplicationAuthenticatedService licenceModelFormGroup', resp);
				this.licenceApplicationService.initialized = true;
			})
		);
	}
}
