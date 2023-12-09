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
				console.debug('NEW licenceModelFormGroup', resp);

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
				console.debug('LOAD licenceModelFormGroup', resp);

				this.licenceApplicationService.initialized = true;
			})
		);
	}

	// /**
	//  * Save the licence data
	//  * @returns
	//  */
	// saveLicenceStep(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
	// 	return this.licenceApplicationService.saveLicenceStep();
	// }

	// /**
	//  * Submit the licence data
	//  * @returns
	//  */
	// submitLicence(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
	// 	const body = {}; //this.getSaveBody();
	// 	return this.workerLicensingService.apiWorkerLicenceApplicationsSubmitPost$Response({ body });
	// }

	// /**
	//  * If this step is complete, mark the step as complete in the wizard
	//  * @returns
	//  */
	// isStep1Complete(): boolean {
	// 	return this.licenceApplicationService.isStep1Complete();
	// }

	// /**
	//  * If this step is complete, mark the step as complete in the wizard
	//  * @returns
	//  */
	// isStep2Complete(): boolean {
	// 	return this.licenceApplicationService.isStep2Complete();
	// }

	// /**
	//  * If this step is complete, mark the step as complete in the wizard
	//  * @returns
	//  */
	// isStep3Complete(): boolean {
	// 	return this.licenceApplicationService.isStep3Complete();
	// }

	// /**
	//  * If this step is complete, mark the step as complete in the wizard
	//  * @returns
	//  */
	// isStep4Complete(): boolean {
	// 	return this.licenceApplicationService.isStep4Complete();
	// }
}
