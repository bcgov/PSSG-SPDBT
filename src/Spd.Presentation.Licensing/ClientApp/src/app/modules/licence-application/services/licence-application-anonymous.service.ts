import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { WorkerLicenceAppUpsertResponse } from 'src/app/api/models';
import { WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationService } from './licence-application.service';

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationAnonymousService {
	constructor(
		private workerLicensingService: WorkerLicensingService,
		private formatDatePipe: FormatDatePipe,
		private authUserBcscService: AuthUserBcscService,
		private utilService: UtilService,
		private licenceApplicationService: LicenceApplicationService
	) {}

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
				console.debug('NEW licenceModelFormGroup', resp);

				this.licenceApplicationService.initialized = true;
			})
		);
	}

	submitLicence(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const body = {}; //this.getSaveBody();

		return this.workerLicensingService.apiWorkerLicenceApplicationsSubmitAnonymousPost$Response({ body });
	}
}
