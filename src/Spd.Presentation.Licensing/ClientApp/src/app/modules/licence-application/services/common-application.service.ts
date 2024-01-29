import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
	ApplicationTypeCode,
	BusinessTypeCode,
	LicenceFeeListResponse,
	LicenceFeeResponse,
	LicenceTermCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { LicenceFeeService } from '@app/api/services';
import { ConfigService } from '@app/core/services/config.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CommonApplicationService {
	applicationTitle$: BehaviorSubject<string> = new BehaviorSubject<string>('Licensing Application');

	// licenceFeesSecurityWorkerLicence: Array<LicenceFeeResponse> = [];
	// licenceFeesArmouredVehiclePermit: Array<LicenceFeeResponse> = [];
	// licenceFeesBodyArmourPermit: Array<LicenceFeeResponse> = [];

	licenceFees: Array<LicenceFeeResponse> = [];

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		private licenceFeeService: LicenceFeeService
	) {
		this.licenceFeeService
			.apiLicenceFeeWorkerLicenceTypeCodeGet({ workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence }) // TODO remove workerLicenceTypeCode
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
		if (!workerLicenceTypeCode || !applicationTypeCode || !businessTypeCode) {
			return [];
		}

		let hasValidSwl90DayLicence = false;
		if (applicationTypeCode === ApplicationTypeCode.Renewal && originalLicenceTermCode === LicenceTermCode.NinetyDays) {
			hasValidSwl90DayLicence = true;
		}

		// console.debug(
		// 	'getLicenceTermsAndFees',
		// 	workerLicenceTypeCode,
		// 	applicationTypeCode,
		// 	businessTypeCode,
		// 	originalLicenceTermCode,
		// 	hasValidSwl90DayLicence,
		// 	this.licenceFees?.filter(
		// 		(item) =>
		// 			item.workerLicenceTypeCode == workerLicenceTypeCode &&
		// 			item.applicationTypeCode == applicationTypeCode &&
		// 			item.businessTypeCode == businessTypeCode &&
		// 			item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
		// 	)
		// );

		return this.licenceFees?.filter(
			(item) =>
				item.workerLicenceTypeCode == workerLicenceTypeCode &&
				item.businessTypeCode == businessTypeCode &&
				item.applicationTypeCode == applicationTypeCode &&
				item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
		);
	}

	// private updateTitle(title: string) {
	// 	this.applicationTitle$.next(title);
	// }

	setApplicationTitle(
		workerLicenceTypeCode: WorkerLicenceTypeCode | undefined = undefined,
		applicationTypeCode: ApplicationTypeCode | undefined = undefined,
		originalLicenceNumber: string | undefined = undefined
	) {
		// console.debug('setApplicationTitle', workerLicenceTypeCode, applicationTypeCode, originalLicenceNumber);

		let title = '';

		if (workerLicenceTypeCode) {
			switch (workerLicenceTypeCode) {
				case WorkerLicenceTypeCode.BusinessLicence: {
					title = 'Business Licence';
					break;
				}
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

		this.applicationTitle$.next(title);
	}
}
