import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LicenceApplicationService } from './licence-application.service';

@Injectable({
	providedIn: 'root',
})
export class LicenceUserService {
	constructor(private licenceApplicationService: LicenceApplicationService) {}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewLicence(): Observable<any> {
		return this.licenceApplicationService.createNewLicenceAuthenticated().pipe(
			tap((resp: any) => {
				console.debug('NEW LicenceUserService licenceModelFormGroup', resp);
				this.licenceApplicationService.initialized = true;
			})
		);
	}
}
