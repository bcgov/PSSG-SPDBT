import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LicenceApplicationService } from './licence-application.service';

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationAnonymousService {
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
		return this.licenceApplicationService.createNewLicenceAnonymous().pipe(
			tap((resp: any) => {
				console.debug('NEW LicenceApplicationAnonymousService licenceModelFormGroup', resp);
				this.licenceApplicationService.initialized = true;
			})
		);
	}
}
