import { Injectable } from '@angular/core';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CommonApplicationService {
	applicationTitle$: BehaviorSubject<string> = new BehaviorSubject<string>('Licensing Application');

	updateTitle(title: string) {
		this.applicationTitle$.next(title);
	}

	setApplicationTitle(
		workerLicenceTypeCode: WorkerLicenceTypeCode | undefined = undefined,
		applicationTypeCode: ApplicationTypeCode | undefined = undefined,
		originalLicenceNumber: string | undefined = undefined
	) {
		console.log('setApplicationTitle', workerLicenceTypeCode, applicationTypeCode, originalLicenceNumber);

		let title = '';

		if (workerLicenceTypeCode) {
			switch (workerLicenceTypeCode) {
				case WorkerLicenceTypeCode.SecurityWorkerLicence: {
					title = 'Security Worker Licence';
					break;
				}
				case WorkerLicenceTypeCode.ArmouredVehiclePermit: {
					title = 'Armoured Vehicle Permit';
					break;
				}
				case WorkerLicenceTypeCode.BodyArmourPermit: {
					title = 'Body Armour Permit';
					break;
				}
			}

			if (applicationTypeCode) {
				title += ` - ${applicationTypeCode}`;
			}

			if (originalLicenceNumber) {
				title += ` of ${originalLicenceNumber}`;
			}
		} else {
			title = 'Licensing Application';
		}

		this.updateTitle(title);
	}
}
