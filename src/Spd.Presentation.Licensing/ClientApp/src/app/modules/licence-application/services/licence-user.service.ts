import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { LicenceFeeService, WorkerLicensingService } from 'src/app/api/services';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationHelper } from './licence-application.helper';

@Injectable({
	providedIn: 'root',
})
export class LicenceUserService extends LicenceApplicationHelper {
	licenceUserModelFormGroup: FormGroup = this.formBuilder.group({
		personalInformationData: this.personalInformationFormGroup,
		aliasesData: this.aliasesFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
	});

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		workerLicensingService: WorkerLicensingService,
		licenceFeeService: LicenceFeeService,
		formatDatePipe: FormatDatePipe,
		private authUserBcscService: AuthUserBcscService
	) {
		super(formBuilder, configService, licenceFeeService, workerLicensingService, formatDatePipe);
	}

	/**
	 * Reset the licence formgroup
	 */
	override reset(): void {
		super.reset();

		this.licenceUserModelFormGroup.reset();

		const aliases = this.licenceUserModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		aliases.clear();

		console.debug('RESET licenceUserModelFormGroup', this.licenceUserModelFormGroup.value);
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewLicenceUser(): Observable<any> {
		this.licenceUserModelFormGroup.reset();

		const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
		if (bcscUserWhoamiProfile) {
			this.licenceUserModelFormGroup.patchValue(
				{
					personalInformationData: {
						givenName: bcscUserWhoamiProfile.firstName,
						middleName1: bcscUserWhoamiProfile.middleName1,
						middleName2: bcscUserWhoamiProfile.middleName2,
						surname: bcscUserWhoamiProfile.lastName,
						dateOfBirth: bcscUserWhoamiProfile.birthDate,
						genderCode: bcscUserWhoamiProfile.gender,
					},
					residentialAddressData: {
						addressSelected: true,
						isMailingTheSameAsResidential: false,
						addressLine1: bcscUserWhoamiProfile.residentialAddress?.addressLine1,
						addressLine2: bcscUserWhoamiProfile.residentialAddress?.addressLine2,
						city: bcscUserWhoamiProfile.residentialAddress?.city,
						country: bcscUserWhoamiProfile.residentialAddress?.country,
						postalCode: bcscUserWhoamiProfile.residentialAddress?.postalCode,
						province: bcscUserWhoamiProfile.residentialAddress?.province,
					},
				},
				{ emitEvent: false }
			);
		} else {
			this.licenceUserModelFormGroup.patchValue(
				{
					residentialAddressData: {
						isMailingTheSameAsResidential: false,
					},
				},
				{ emitEvent: false }
			);
		}

		console.debug('NEW licenceUserModelFormGroup', this.licenceUserModelFormGroup.value);

		this.initialized = true;
		return of(this.licenceUserModelFormGroup.value);
	}
}
