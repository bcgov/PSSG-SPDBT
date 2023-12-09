import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { WorkerLicensingService } from 'src/app/api/services';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationService } from './licence-application.service';

@Injectable({
	providedIn: 'root',
})
export class LicenceUserService {
	// licenceUserModelFormGroup: FormGroup = this.formBuilder.group({
	// 	personalInformationData: this.personalInformationFormGroup,
	// 	aliasesData: this.aliasesFormGroup,
	// 	residentialAddressData: this.residentialAddressFormGroup,
	// 	mailingAddressData: this.mailingAddressFormGroup,
	// 	contactInformationData: this.contactInformationFormGroup,
	// });

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
	// override reset(): void {
	// 	super.reset();

	// 	this.licenceUserModelFormGroup.reset();

	// 	const aliases = this.licenceUserModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
	// 	aliases.clear();

	// 	console.debug('RESET licenceUserModelFormGroup', this.licenceUserModelFormGroup.value);
	// }

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewLicenceUser(): Observable<any> {
		this.licenceApplicationService.reset();

		// const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
		// if (bcscUserWhoamiProfile) {
		// 	this.licenceApplicationService.licenceUserModelFormGroup.patchValue(
		// 		{
		// 			personalInformationData: {
		// 				givenName: bcscUserWhoamiProfile.firstName,
		// 				middleName1: bcscUserWhoamiProfile.middleName1,
		// 				middleName2: bcscUserWhoamiProfile.middleName2,
		// 				surname: bcscUserWhoamiProfile.lastName,
		// 				dateOfBirth: bcscUserWhoamiProfile.birthDate,
		// 				genderCode: bcscUserWhoamiProfile.gender,
		// 			},
		// 			residentialAddressData: {
		// 				addressSelected: true,
		// 				isMailingTheSameAsResidential: false,
		// 				addressLine1: bcscUserWhoamiProfile.residentialAddress?.addressLine1,
		// 				addressLine2: bcscUserWhoamiProfile.residentialAddress?.addressLine2,
		// 				city: bcscUserWhoamiProfile.residentialAddress?.city,
		// 				country: bcscUserWhoamiProfile.residentialAddress?.country,
		// 				postalCode: bcscUserWhoamiProfile.residentialAddress?.postalCode,
		// 				province: bcscUserWhoamiProfile.residentialAddress?.province,
		// 			},
		// 		},
		// 		{ emitEvent: false }
		// 	);
		// } else {
		// 	this.licenceApplicationService.licenceUserModelFormGroup.patchValue(
		// 		{
		// 			residentialAddressData: {
		// 				isMailingTheSameAsResidential: false,
		// 			},
		// 		},
		// 		{ emitEvent: false }
		// 	);
		// }

		// console.debug('NEW licenceUserModelFormGroup', this.licenceApplicationService.licenceUserModelFormGroup.value);

		// this.licenceApplicationService.initialized = true;
		return of(this.licenceApplicationService.licenceModelFormGroupAuthenticated.value);
	}
}
