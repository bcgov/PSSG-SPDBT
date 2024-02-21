import { Injectable } from '@angular/core';
import {
	ApplicationTypeCode,
	BusinessTypeCode,
	LicenceFeeListResponse,
	LicenceFeeResponse,
	LicenceTermCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { LicenceFeeService } from '@app/api/services';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CommonApplicationService {
	applicationTitle$: BehaviorSubject<[string, string]> = new BehaviorSubject<[string, string]>([
		'Licensing Application',
		'Licensing Application',
	]);

	licenceFees: Array<LicenceFeeResponse> = [];

	constructor(private licenceFeeService: LicenceFeeService) {
		this.licenceFeeService
			.apiLicenceFeeGet()
			.pipe()
			.subscribe((resp: LicenceFeeListResponse) => {
				this.licenceFees = resp.licenceFees ?? [];
			});
	}

	/**
	 * Get the licence fees for the licence and application type and business type
	 * @returns list of fees
	 */
	public getLicenceTermsAndFees(
		workerLicenceTypeCode: WorkerLicenceTypeCode | null,
		applicationTypeCode: ApplicationTypeCode | null,
		businessTypeCode: BusinessTypeCode | null,
		originalLicenceTermCode: LicenceTermCode | undefined = undefined
	): Array<LicenceFeeResponse> {
		// console.debug(
		// 	'getLicenceTermsAndFees',
		// 	workerLicenceTypeCode,
		// 	applicationTypeCode,
		// 	businessTypeCode,
		// 	originalLicenceTermCode
		// );

		if (!workerLicenceTypeCode || !businessTypeCode) {
			return [];
		}

		let hasValidSwl90DayLicence = false;
		if (applicationTypeCode === ApplicationTypeCode.Renewal && originalLicenceTermCode === LicenceTermCode.NinetyDays) {
			hasValidSwl90DayLicence = true;
		}

		return this.licenceFees?.filter(
			(item) =>
				item.workerLicenceTypeCode == workerLicenceTypeCode &&
				item.businessTypeCode == businessTypeCode &&
				(!applicationTypeCode || (applicationTypeCode && item.applicationTypeCode == applicationTypeCode)) &&
				item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
		);
	}

	setApplicationTitle(
		workerLicenceTypeCode: WorkerLicenceTypeCode | undefined = undefined,
		applicationTypeCode: ApplicationTypeCode | undefined = undefined,
		originalLicenceNumber: string | undefined = undefined
	) {
		let title = '';
		let mobileTitle = '';

		if (workerLicenceTypeCode) {
			switch (workerLicenceTypeCode) {
				case WorkerLicenceTypeCode.SecurityBusinessLicence: {
					title = 'Security Business Licence';
					mobileTitle = 'SBL';
					break;
				}
				case WorkerLicenceTypeCode.SecurityWorkerLicence: {
					title = 'Security Worker Licence';
					mobileTitle = 'SWL';
					break;
				}
				case WorkerLicenceTypeCode.ArmouredVehiclePermit: {
					title = 'Armoured Vehicle Permit';
					mobileTitle = 'AVP';
					break;
				}
				case WorkerLicenceTypeCode.BodyArmourPermit: {
					title = 'Body Armour Permit';
					mobileTitle = 'BAP';
					break;
				}
			}

			if (applicationTypeCode) {
				title += ` - ${applicationTypeCode}`;
				mobileTitle += ` ${applicationTypeCode}`;
			}

			if (originalLicenceNumber) {
				title += ` - ${originalLicenceNumber}`;
				mobileTitle += ` ${originalLicenceNumber}`;
			}
		} else {
			mobileTitle = title = 'Licensing Application';
		}

		this.applicationTitle$.next([title, mobileTitle]);
	}
}
