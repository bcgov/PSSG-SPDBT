import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
	ApplicationTypeCode,
	BusinessTypeCode,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceFeeListResponse,
	LicenceFeeResponse,
	WorkerLicenceTypeCode,
} from 'src/app/api/models';
import { LicenceFeeService, WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationHelper, LicenceDocument } from './licence-application.helper';

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService extends LicenceApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	licenceModelLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	licenceFees: Array<LicenceFeeResponse> = [];
	licenceFeeTermCodes: Array<LicenceFeeResponse> = [];

	private licenceModelFormGroupAnonymous: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null, [FormControlValidators.required]),
		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		soleProprietorData: this.soleProprietorFormGroup,
		personalInformationData: this.personalInformationFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
		licenceTermData: this.licenceTermFormGroup,
		restraintsAuthorizationData: this.restraintsAuthorizationFormGroup,
		dogsAuthorizationData: this.dogsAuthorizationFormGroup,

		categoryArmouredCarGuardFormGroup: this.categoryArmouredCarGuardFormGroup,
		categoryBodyArmourSalesFormGroup: this.categoryBodyArmourSalesFormGroup,
		categoryClosedCircuitTelevisionInstallerFormGroup: this.categoryClosedCircuitTelevisionInstallerFormGroup,
		categoryElectronicLockingDeviceInstallerFormGroup: this.categoryElectronicLockingDeviceInstallerFormGroup,
		categoryFireInvestigatorFormGroup: this.categoryFireInvestigatorFormGroup,
		categoryLocksmithFormGroup: this.categoryLocksmithFormGroup,
		categoryLocksmithSupFormGroup: this.categoryLocksmithSupFormGroup,
		categoryPrivateInvestigatorFormGroup: this.categoryPrivateInvestigatorFormGroup,
		categoryPrivateInvestigatorSupFormGroup: this.categoryPrivateInvestigatorSupFormGroup,
		categorySecurityAlarmInstallerFormGroup: this.categorySecurityAlarmInstallerFormGroup,
		categorySecurityAlarmInstallerSupFormGroup: this.categorySecurityAlarmInstallerSupFormGroup,
		categorySecurityConsultantFormGroup: this.categorySecurityConsultantFormGroup,
		categorySecurityAlarmMonitorFormGroup: this.categorySecurityAlarmMonitorFormGroup,
		categorySecurityAlarmResponseFormGroup: this.categorySecurityAlarmResponseFormGroup,
		categorySecurityAlarmSalesFormGroup: this.categorySecurityAlarmSalesFormGroup,
		categorySecurityGuardFormGroup: this.categorySecurityGuardFormGroup,
		categorySecurityGuardSupFormGroup: this.categorySecurityGuardSupFormGroup,

		policeBackgroundData: this.policeBackgroundFormGroup,
		mentalHealthConditionsData: this.mentalHealthConditionsFormGroup,
		criminalHistoryData: this.criminalHistoryFormGroup,
		fingerprintProofData: this.fingerprintProofFormGroup,

		aliasesData: this.aliasesFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		additionalGovIdData: this.additionalGovIdFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
	});

	private licenceModelFormGroupAuthenticated: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null, [FormControlValidators.required]),
		contactId: new FormControl(null, [FormControlValidators.required]),
		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		soleProprietorData: this.soleProprietorFormGroup,
		licenceTermData: this.licenceTermFormGroup,
		restraintsAuthorizationData: this.restraintsAuthorizationFormGroup,
		dogsAuthorizationData: this.dogsAuthorizationFormGroup,
		categoryArmouredCarGuardFormGroup: this.categoryArmouredCarGuardFormGroup,
		categoryBodyArmourSalesFormGroup: this.categoryBodyArmourSalesFormGroup,
		categoryClosedCircuitTelevisionInstallerFormGroup: this.categoryClosedCircuitTelevisionInstallerFormGroup,
		categoryElectronicLockingDeviceInstallerFormGroup: this.categoryElectronicLockingDeviceInstallerFormGroup,
		categoryFireInvestigatorFormGroup: this.categoryFireInvestigatorFormGroup,
		categoryLocksmithFormGroup: this.categoryLocksmithFormGroup,
		categoryLocksmithSupFormGroup: this.categoryLocksmithSupFormGroup,
		categoryPrivateInvestigatorFormGroup: this.categoryPrivateInvestigatorFormGroup,
		categoryPrivateInvestigatorSupFormGroup: this.categoryPrivateInvestigatorSupFormGroup,
		categorySecurityAlarmInstallerFormGroup: this.categorySecurityAlarmInstallerFormGroup,
		categorySecurityAlarmInstallerSupFormGroup: this.categorySecurityAlarmInstallerSupFormGroup,
		categorySecurityConsultantFormGroup: this.categorySecurityConsultantFormGroup,
		categorySecurityAlarmMonitorFormGroup: this.categorySecurityAlarmMonitorFormGroup,
		categorySecurityAlarmResponseFormGroup: this.categorySecurityAlarmResponseFormGroup,
		categorySecurityAlarmSalesFormGroup: this.categorySecurityAlarmSalesFormGroup,
		categorySecurityGuardFormGroup: this.categorySecurityGuardFormGroup,
		categorySecurityGuardSupFormGroup: this.categorySecurityGuardSupFormGroup,
		policeBackgroundData: this.policeBackgroundFormGroup,
		mentalHealthConditionsData: this.mentalHealthConditionsFormGroup,
		criminalHistoryData: this.criminalHistoryFormGroup,
		fingerprintProofData: this.fingerprintProofFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		additionalGovIdData: this.additionalGovIdFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
	});

	licenceUserModelFormGroup: FormGroup = this.formBuilder.group({
		personalInformationData: this.personalInformationFormGroup,
		aliasesData: this.aliasesFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
	});

	licenceModelFormGroup: FormGroup = this.licenceModelFormGroupAnonymous;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		private licenceFeeService: LicenceFeeService,
		private workerLicensingService: WorkerLicensingService,
		private authUserBcscService: AuthUserBcscService
	) {
		super(formBuilder, configService, formatDatePipe);

		this.licenceFeeService
			.apiLicenceFeeWorkerLicenceTypeCodeGet({ workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence })
			.pipe()
			.subscribe((resp: LicenceFeeListResponse) => {
				this.licenceFees = resp.licenceFees ?? [];
			});
	}

	createNewLicenceAnonymous(): Observable<any> {
		this.reset();

		this.licenceModelFormGroup = this.licenceModelFormGroupAnonymous;
		return of(this.licenceModelFormGroup.value);
	}

	createNewLicenceAuthenticated(): Observable<any> {
		this.reset();

		this.licenceModelFormGroup = this.licenceModelFormGroupAuthenticated;

		const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
		if (bcscUserWhoamiProfile) {
			this.personalInformationFormGroup.patchValue({
				givenName: bcscUserWhoamiProfile.firstName,
				middleName1: bcscUserWhoamiProfile.middleName1,
				middleName2: bcscUserWhoamiProfile.middleName2,
				surname: bcscUserWhoamiProfile.lastName,
				dateOfBirth: bcscUserWhoamiProfile.birthDate,
				genderCode: bcscUserWhoamiProfile.gender,
			});

			this.residentialAddressFormGroup.patchValue({
				addressSelected: true,
				isMailingTheSameAsResidential: false,
				addressLine1: bcscUserWhoamiProfile.residentialAddress?.addressLine1,
				addressLine2: bcscUserWhoamiProfile.residentialAddress?.addressLine2,
				city: bcscUserWhoamiProfile.residentialAddress?.city,
				country: bcscUserWhoamiProfile.residentialAddress?.country,
				postalCode: bcscUserWhoamiProfile.residentialAddress?.postalCode,
				province: bcscUserWhoamiProfile.residentialAddress?.province,
			});

			this.licenceUserModelFormGroup.patchValue({
				personalInformationData: this.personalInformationFormGroup,
				residentialAddressData: this.residentialAddressFormGroup,
			});
		} else {
			this.residentialAddressFormGroup.patchValue({
				isMailingTheSameAsResidential: false,
			});
			this.licenceUserModelFormGroup.patchValue({
				residentialAddressData: this.residentialAddressFormGroup,
			});
		}

		return of(this.licenceModelFormGroup.value);
	}

	/**
	 * Reset the licence data
	 */
	reset(): void {
		this.hasValueChanged = false;
		this.initialized = false;
		this.licenceFeeTermCodes = [];

		this.licenceUserModelFormGroup.reset();
		const aliases1 = this.licenceUserModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		aliases1.clear();

		this.licenceModelFormGroupAuthenticated.reset();

		this.licenceModelFormGroupAnonymous.reset();
		const aliases2 = this.licenceModelFormGroupAnonymous.controls['aliasesData'].get('aliases') as FormArray;
		aliases2.clear();
	}

	/**
	 * Upload a file of a certain type. Return a reference to the file that will used when the licence is saved
	 * @param documentCode
	 * @param document
	 * @returns
	 */
	addUploadDocument(
		documentCode: LicenceDocumentTypeCode,
		document: File
	): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
		const doc: LicenceDocument = {
			Documents: [document],
			LicenceDocumentTypeCode: documentCode,
		};

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response({
			licenceAppId: this.licenceModelFormGroup.get('licenceAppId')?.value,
			body: doc,
		});
	}

	/**
	 * Set the licence fees for the licence and application type
	 * @returns list of fees
	 */
	protected setLicenceTermsAndFees(): void {
		const workerLicenceTypeCode = WorkerLicenceTypeCode.SecurityWorkerLicence; // this.workerLicenceTypeFormGroup.value.workerLicenceTypeData?.workerLicenceTypeCode;
		const applicationTypeCode = ApplicationTypeCode.New; // this.applicationTypeFormGroup.value.applicationTypeData?.applicationTypeCode;
		// const businessTypeCode = //TODO what to do about business type code??

		if (!workerLicenceTypeCode || !applicationTypeCode) {
			return;
		}

		const fees = this.licenceFees?.filter(
			(item) =>
				item.workerLicenceTypeCode == workerLicenceTypeCode &&
				item.businessTypeCode == BusinessTypeCode.NonRegisteredPartnership &&
				item.applicationTypeCode == applicationTypeCode
		);

		console.debug('setLicenceTermsAndFees', fees);
		this.licenceFeeTermCodes.push(...fees);
		console.debug('this.licenceFeeTermCodes', this.licenceFeeTermCodes);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStep1Complete(): boolean {
		// console.debug(
		// 	'isStep1Complete',
		// 	this.workerLicenceTypeFormGroup.valid,
		// 	this.applicationTypeFormGroup.valid,
		// );

		const isValid = this.workerLicenceTypeFormGroup.valid && this.applicationTypeFormGroup.valid;
		if (isValid && this.licenceFeeTermCodes.length === 0) {
			this.setLicenceTermsAndFees();
		}

		return isValid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStep2Complete(): boolean {
		// console.debug(
		// 	'isStep2Complete',
		// 	this.soleProprietorFormGroup.valid,
		// 	this.expiredLicenceFormGroup.valid,
		// 	this.licenceTermFormGroup.valid,
		// 	this.restraintsAuthorizationFormGroup.valid,
		// 	this.dogsAuthorizationFormGroup.valid,
		// 	this.categoryArmouredCarGuardFormGroup.valid,
		// 	this.categoryBodyArmourSalesFormGroup.valid,
		// 	this.categoryClosedCircuitTelevisionInstallerFormGroup.valid,
		// 	this.categoryElectronicLockingDeviceInstallerFormGroup.valid,
		// 	this.categoryFireInvestigatorFormGroup.valid,
		// 	this.categoryLocksmithFormGroup.valid,
		// 	this.categoryLocksmithSupFormGroup.valid,
		// 	this.categoryPrivateInvestigatorFormGroup.valid,
		// 	this.categoryPrivateInvestigatorSupFormGroup.valid,
		// 	this.categorySecurityAlarmInstallerFormGroup.valid,
		// 	this.categorySecurityAlarmInstallerSupFormGroup.valid,
		// 	this.categorySecurityConsultantFormGroup.valid,
		// 	this.categorySecurityAlarmMonitorFormGroup.valid,
		// 	this.categorySecurityAlarmResponseFormGroup.valid,
		// 	this.categorySecurityAlarmSalesFormGroup.valid,
		// 	this.categorySecurityGuardFormGroup.valid,
		// 	this.categorySecurityGuardSupFormGroup.valid
		// );

		return (
			this.soleProprietorFormGroup.valid &&
			this.expiredLicenceFormGroup.valid &&
			this.licenceTermFormGroup.valid &&
			this.restraintsAuthorizationFormGroup.valid &&
			this.dogsAuthorizationFormGroup.valid &&
			this.categoryArmouredCarGuardFormGroup.valid &&
			this.categoryBodyArmourSalesFormGroup.valid &&
			this.categoryClosedCircuitTelevisionInstallerFormGroup.valid &&
			this.categoryElectronicLockingDeviceInstallerFormGroup.valid &&
			this.categoryFireInvestigatorFormGroup.valid &&
			this.categoryLocksmithFormGroup.valid &&
			this.categoryLocksmithSupFormGroup.valid &&
			this.categoryPrivateInvestigatorFormGroup.valid &&
			this.categoryPrivateInvestigatorSupFormGroup.valid &&
			this.categorySecurityAlarmInstallerFormGroup.valid &&
			this.categorySecurityAlarmInstallerSupFormGroup.valid &&
			this.categorySecurityConsultantFormGroup.valid &&
			this.categorySecurityAlarmMonitorFormGroup.valid &&
			this.categorySecurityAlarmResponseFormGroup.valid &&
			this.categorySecurityAlarmSalesFormGroup.valid &&
			this.categorySecurityGuardFormGroup.valid &&
			this.categorySecurityGuardSupFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStep3Complete(): boolean {
		// console.debug(
		// 	'isStep3Complete',
		// 	this.policeBackgroundFormGroup.valid,
		// 	this.mentalHealthConditionsFormGroup.valid,
		// 	this.criminalHistoryFormGroup.valid,
		// 	this.fingerprintProofFormGroup.valid
		// );

		return (
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid &&
			this.criminalHistoryFormGroup.valid &&
			this.fingerprintProofFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStep4Complete(): boolean {
		// console.debug(
		// 	'isStep4Complete',
		// 	this.personalInformationFormGroup.valid,
		// 	this.aliasesFormGroup.valid,
		// 	this.citizenshipFormGroup.valid,
		// 	this.additionalGovIdFormGroup.valid,
		// 	this.bcDriversLicenceFormGroup.valid,
		// 	this.characteristicsFormGroup.valid,
		// 	this.photographOfYourselfFormGroup.valid,
		// 	this.residentialAddressFormGroup.valid,
		// 	this.mailingAddressFormGroup.valid,
		// 	this.contactInformationFormGroup.valid
		// );

		return (
			this.personalInformationFormGroup.valid &&
			this.aliasesFormGroup.valid &&
			this.citizenshipFormGroup.valid &&
			this.additionalGovIdFormGroup.valid &&
			this.bcDriversLicenceFormGroup.valid &&
			this.characteristicsFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.residentialAddressFormGroup.valid &&
			this.mailingAddressFormGroup.valid &&
			this.contactInformationFormGroup.valid
		);
	}
}
