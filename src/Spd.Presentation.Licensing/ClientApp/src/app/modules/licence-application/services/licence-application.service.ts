import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	Alias,
	ApplicationTypeCode,
	BooleanTypeCode,
	BusinessTypeCode,
	Document,
	HeightUnitCode,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceFeeListResponse,
	LicenceFeeResponse,
	LicenceLookupResponse,
	LicenceTermCode,
	WorkerCategoryTypeCode,
	WorkerLicenceAppCategoryData,
	WorkerLicenceAppUpsertResponse,
	WorkerLicenceResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import {
	BehaviorSubject,
	debounceTime,
	distinctUntilChanged,
	forkJoin,
	Observable,
	of,
	Subscription,
	switchMap,
	take,
	tap,
} from 'rxjs';
import { LicenceFeeService, LicenceLookupService, WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { PrivateInvestigatorTrainingCode, RestraintDocumentTypeCode } from 'src/app/core/code-types/model-desc.models';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationHelper, LicenceDocument } from './licence-application.helper';

export class LicenceDocumentsToSave {
	'licenceDocumentTypeCode': LicenceDocumentTypeCode;
	'documents': Array<Blob>;
}

export class WorkerLicenceAppAnonymousSubmitRequest {
	'workerLicenceTypeCode'?: string | null;
	'applicationTypeCode'?: string | null;
	'businessTypeCode'?: boolean | null;
	'givenName'?: string | null;
	'middleName1'?: string | null;
	'middleName2'?: string | null;
	'surname'?: string | null;
	'dateOfBirth'?: string | null;
	'genderCode'?: string | null;
	'oneLegalName'?: boolean | null;
	'expiredLicenceNumber'?: string | null;
	'expiredLicenceId'?: string | null;
	'hasExpiredLicence'?: boolean | null;
	'licenceTermCode'?: string | null;
	'hasCriminalHistory'?: boolean | null;
	'hasPreviousName'?: boolean | null;
	'hasBcDriversLicence'?: boolean | null;
	'bcDriversLicenceNumber'?: string | null;
	'hairColourCode'?: string | null;
	'eyeColourCode'?: string | null;
	'height'?: number | null;
	'heightUnitCode'?: string | null;
	'weight'?: number | null;
	'weightUnitCode'?: string | null;
	'contactEmailAddress'?: string | null;
	'contactPhoneNumber'?: string | null;
	'isMailingTheSameAsResidential'?: boolean | null;
	'isPoliceOrPeaceOfficer'?: boolean | null;
	'policeOfficerRoleCode'?: string | null;
	'otherOfficerRole'?: string | null;
	'isTreatedForMHC'?: boolean | null;
	'useBcServicesCardPhoto'?: boolean | null;
	'carryAndUseRestraints'?: boolean | null;
	'useDogs'?: boolean | null;
	'isDogsPurposeProtection'?: boolean | null;
	'isDogsPurposeDetectionDrugs'?: boolean | null;
	'isDogsPurposeDetectionExplosives'?: boolean | null;
	'isCanadianCitizen'?: boolean | null;
	'aliases'?: Array<{
		givenName?: string | null;
		middleName1?: string | null;
		middleName2?: string | null;
		surname?: string | null;
	}>;
	'residentialAddressData'?: {
		addressLine1?: string | null;
		addressLine2?: string | null;
		city?: string | null;
		country?: string | null;
		postalCode?: string | null;
		province?: string | null;
	};
	'mailingAddressData'?: {
		addressLine1?: string | null;
		addressLine2?: string | null;
		city?: string | null;
		country?: string | null;
		postalCode?: string | null;
		province?: string | null;
	};
	'categoryCodes'?: Array<string>;
	'documentInfos'?: Array<{
		licenceDocumentTypeCode?: string;
		expiryDate?: string | null;
	}>;
}

export class WorkerLicenceApplicationsSubmitAnonymousPost {
	'docs': Array<Blob>;
	'WorkerLicenceAppAnonymousSubmitRequest': WorkerLicenceAppAnonymousSubmitRequest;
}

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService extends LicenceApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	licenceModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	licenceFeesSecurityWorkerLicence: Array<LicenceFeeResponse> = [];

	licenceModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null),

		originalApplicationId: new FormControl(null),
		originalLicenceId: new FormControl(null),
		originalLicenceNumber: new FormControl(null),
		originalExpiryDate: new FormControl(null),
		originalLicenceTermCode: new FormControl(null),
		originalBusinessTypeCode: new FormControl(null),

		caseNumber: new FormControl(null), // TODO needed?
		applicationPortalStatus: new FormControl(null),
		personalInformationData: this.personalInformationFormGroup,
		aliasesData: this.aliasesFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
		profileConfirmationData: this.profileConfirmationFormGroup,

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

	// licenceUserModelFormGroup: FormGroup = this.formBuilder.group({
	// 	personalInformationData: this.personalInformationFormGroup,
	// 	aliasesData: this.aliasesFormGroup,
	// 	residentialAddressData: this.residentialAddressFormGroup,
	// 	mailingAddressData: this.mailingAddressFormGroup,
	// 	contactInformationData: this.contactInformationFormGroup,
	// });

	licenceModelChangedSubscription!: Subscription;
	// licenceModelAnonymousChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		private licenceFeeService: LicenceFeeService,
		private workerLicensingService: WorkerLicensingService,
		private licenceLookupService: LicenceLookupService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private utilService: UtilService
	) {
		super(formBuilder, configService, formatDatePipe);

		this.licenceFeeService
			.apiLicenceFeeWorkerLicenceTypeCodeGet({ workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence })
			.pipe()
			.subscribe((resp: LicenceFeeListResponse) => {
				this.licenceFeesSecurityWorkerLicence = resp.licenceFees ?? [];
			});

		this.licenceModelChangedSubscription = this.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

					const step1Complete = this.isStepLicenceSelectionComplete();
					const step2Complete = this.isStepBackgroundComplete();
					const step3Complete = this.isStepIdentificationComplete();
					const isValid = step1Complete && step2Complete && step3Complete;

					// console.debug(
					// 	'licenceModelFormGroup CHANGED',
					// 	step1Complete,
					// 	step2Complete,
					// 	step3Complete,
					// 	this.licenceModelFormGroup.getRawValue()
					// );

					this.licenceModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * Load a user profile
	 * @returns
	 */
	loadUserProfile(): Observable<WorkerLicenceResponse> {
		return this.createEmptyLicenceAuthenticated().pipe(
			// TODO update
			tap((_resp: any) => {
				console.debug('loadUserProfile');

				this.initialized = true;
				console.debug('this.initialized', this.initialized);
			})
		);
	}

	/**
	 * Search for an existing licence using access code
	 * @param licenceNumber
	 * @param accessCode
	 * @param recaptchaCode
	 * @returns
	 */
	getLicenceWithAccessCode(
		licenceNumber: string,
		accessCode: string,
		recaptchaCode: string
	): Observable<LicenceLookupResponse> {
		return this.licenceLookupService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, accessCode, body: { recaptchaCode } })
			.pipe(take(1));
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceNew(licenceAppId: string): Observable<WorkerLicenceResponse> {
		console.debug('getLicenceNew', licenceAppId);

		return this.loadLicenceNew(licenceAppId).pipe(
			tap((resp: any) => {
				console.debug('LOAD loadLicenceNew', resp);
				this.initialized = true;
			})
		);
	}

	/**
	 * Load an existing licence application with an access code
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceWithAccessCodeData(
		accessCodeData: any,
		applicationTypeCode: ApplicationTypeCode
	): Observable<WorkerLicenceResponse> {
		return this.getLicenceOfType(accessCodeData.linkedLicenceAppId, applicationTypeCode!).pipe(
			tap((_resp: any) => {
				this.licenceModelFormGroup.patchValue(
					{
						originalApplicationId: accessCodeData.linkedLicenceAppId,
						originalLicenceId: accessCodeData.linkedLicenceId,
						originalLicenceNumber: accessCodeData.licenceNumber,
						originalExpiryDate: accessCodeData.linkedExpiryDate,
					},
					{ emitEvent: false }
				);
				console.debug('[getLicenceWithAccessCodeData] licenceFormGroup', this.licenceModelFormGroup.value);
			})
		);
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceOfType(licenceAppId: string, applicationTypeCode: ApplicationTypeCode): Observable<WorkerLicenceResponse> {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return this.loadLicenceRenewal(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('[getLicenceOfType] Renewal', licenceAppId, applicationTypeCode, resp);
						this.initialized = true;
					})
				);
			}
			case ApplicationTypeCode.Update: {
				return this.loadLicenceUpdate(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('[getLicenceOfType] Update', licenceAppId, applicationTypeCode, resp);
						this.initialized = true;
					})
				);
			}
			default: {
				//case ApplicationTypeCode.Replacement: {
				return this.loadLicenceReplacement(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('[getLicenceOfType] Replacement', licenceAppId, applicationTypeCode, resp);
						this.initialized = true;
					})
				);
			}
		}
	}

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewLicenceAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.createEmptyLicenceAnonymous(workerLicenceTypeCode).pipe(
			tap((resp: any) => {
				console.debug('NEW LicenceApplicationService createNewLicenceAnonymous', resp);

				this.initialized = true;
			})
		);
	}

	/**
	 * Create an empty authenticated licence
	 * @returns
	 */
	createNewLicenceAuthenticated(): Observable<any> {
		return this.createEmptyLicenceAuthenticated().pipe(
			tap((resp: any) => {
				console.debug('NEW LicenceApplicationService createNewLicenceAuthenticated', resp);

				this.initialized = true;
			})
		);
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.initialized = false;
		console.debug('reset.initialized', this.initialized);
		this.hasValueChanged = false;

		this.licenceModelFormGroup.reset();

		const aliases = this.licenceModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		aliases.clear();
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
	 * Get the licence fees for the licence and application type and business type
	 * @returns list of fees
	 */
	public getLicenceTermsAndFees(): Array<LicenceFeeResponse> {
		const workerLicenceTypeCode = this.licenceModelFormGroup.get('workerLicenceTypeData.workerLicenceTypeCode')?.value;
		const applicationTypeCode = this.licenceModelFormGroup.get('applicationTypeData.applicationTypeCode')?.value;

		let businessTypeCode = '';
		if (applicationTypeCode === ApplicationTypeCode.New) {
			businessTypeCode = this.licenceModelFormGroup.get('soleProprietorData.businessTypeCode')?.value;
		} else {
			businessTypeCode = this.licenceModelFormGroup.get('originalBusinessTypeCode')?.value;
		}

		// console.debug('getLicenceTermsAndFees', workerLicenceTypeCode, applicationTypeCode, businessTypeCode);

		if (!workerLicenceTypeCode || !applicationTypeCode || !businessTypeCode) {
			return [];
		}

		let hasValidSwl90DayLicence = false;
		if (applicationTypeCode === ApplicationTypeCode.Renewal && businessTypeCode === LicenceTermCode.NintyDays) {
			hasValidSwl90DayLicence = true;
		}

		// console.debug(
		// 	'getLicenceTermsAndFees',
		// 	workerLicenceTypeCode,
		// 	applicationTypeCode,
		// 	businessTypeCode,
		// 	this.licenceFeesSecurityWorkerLicence?.filter(
		// 		(item) =>
		// 			item.workerLicenceTypeCode == workerLicenceTypeCode &&
		// 			item.businessTypeCode == businessTypeCode &&
		// 			item.applicationTypeCode == applicationTypeCode &&
		// 			item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
		// 	)
		// );

		return this.licenceFeesSecurityWorkerLicence?.filter(
			(item) =>
				item.workerLicenceTypeCode == workerLicenceTypeCode &&
				item.businessTypeCode == businessTypeCode &&
				item.applicationTypeCode == applicationTypeCode &&
				item.hasValidSwl90DayLicence === hasValidSwl90DayLicence
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	// isStep1Complete(): boolean {
	// 	// console.debug(
	// 	// 	'isStep1Complete',
	// 	// 	this.profileFormGroup.valid,
	// 	// 	this.workerLicenceTypeFormGroup.valid,
	// 	// 	this.applicationTypeFormGroup.valid,
	// 	// );

	// 	let isValid!: boolean;
	// 	if (this.authenticationService.isLoggedIn()) {
	// 		isValid =
	// 			this.profileConfirmationFormGroup.valid &&
	// 			this.personalInformationFormGroup.valid &&
	// 			this.aliasesFormGroup.valid &&
	// 			this.residentialAddressFormGroup.valid &&
	// 			this.mailingAddressFormGroup.valid &&
	// 			this.contactInformationFormGroup.valid;
	// 		this.workerLicenceTypeFormGroup.valid && this.applicationTypeFormGroup.valid;
	// 	} else {
	// 		isValid = this.workerLicenceTypeFormGroup.valid && this.applicationTypeFormGroup.valid;
	// 	}

	// 	return isValid;
	// }

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepLicenceSelectionComplete(): boolean {
		// console.debug(
		// 	'personalInformationData',
		// 	this.personalInformationFormGroup.valid,
		// 	'aliasesData',
		// 	this.aliasesFormGroup.valid,
		// 	'expiredLicenceData',
		// 	this.expiredLicenceFormGroup.valid,
		// 	'residentialAddressData',
		// 	this.residentialAddressFormGroup.valid,
		// 	'mailingAddressData',
		// 	this.mailingAddressFormGroup.valid,
		// 	'contactInformationData',
		// 	this.contactInformationFormGroup.valid,
		// 	'profileConfirmationData',
		// 	this.profileConfirmationFormGroup.valid,
		// 	'workerLicenceTypeData',
		// 	this.workerLicenceTypeFormGroup.valid,
		// 	'applicationTypeData',
		// 	this.applicationTypeFormGroup.valid,
		// 	'soleProprietorData',
		// 	this.soleProprietorFormGroup.valid,
		// 	'licenceTermData',
		// 	this.licenceTermFormGroup.valid,
		// 	'restraintsAuthorizationData',
		// 	this.restraintsAuthorizationFormGroup.valid,
		// 	'dogsAuthorizationData',
		// 	this.dogsAuthorizationFormGroup.valid,
		// 	'categoryArmouredCarGuardFormGroup',
		// 	this.categoryArmouredCarGuardFormGroup.valid,
		// 	'categoryBodyArmourSalesFormGroup',
		// 	this.categoryBodyArmourSalesFormGroup.valid,
		// 	'categoryClosedCircuitTelevisionInstallerFormGroup',
		// 	this.categoryClosedCircuitTelevisionInstallerFormGroup.valid,
		// 	'categoryElectronicLockingDeviceInstallerFormGroup',
		// 	this.categoryElectronicLockingDeviceInstallerFormGroup.valid,
		// 	'categoryFireInvestigatorFormGroup',
		// 	this.categoryFireInvestigatorFormGroup.valid,
		// 	'categoryLocksmithFormGroup',
		// 	this.categoryLocksmithFormGroup.valid,
		// 	'categoryLocksmithSupFormGroup',
		// 	this.categoryLocksmithSupFormGroup.valid,
		// 	'categoryPrivateInvestigatorFormGroup',
		// 	this.categoryPrivateInvestigatorFormGroup.valid,
		// 	'categoryPrivateInvestigatorSupFormGroup',
		// 	this.categoryPrivateInvestigatorSupFormGroup.valid,
		// 	'categorySecurityAlarmInstallerFormGroup',
		// 	this.categorySecurityAlarmInstallerFormGroup.valid,
		// 	'categorySecurityAlarmInstallerSupFormGroup',
		// 	this.categorySecurityAlarmInstallerSupFormGroup.valid,
		// 	'categorySecurityConsultantFormGroup',
		// 	this.categorySecurityConsultantFormGroup.valid,
		// 	'categorySecurityAlarmMonitorFormGroup',
		// 	this.categorySecurityAlarmMonitorFormGroup.valid,
		// 	'categorySecurityAlarmResponseFormGroup',
		// 	this.categorySecurityAlarmResponseFormGroup.valid,
		// 	'categorySecurityAlarmSalesFormGroup',
		// 	this.categorySecurityAlarmSalesFormGroup.valid,
		// 	'categorySecurityGuardFormGroup',
		// 	this.categorySecurityGuardFormGroup.valid,
		// 	'categorySecurityGuardSupFormGroup',
		// 	this.categorySecurityGuardSupFormGroup.valid,
		// 	'policeBackgroundData',
		// 	this.policeBackgroundFormGroup.valid,
		// 	'mentalHealthConditionsData',
		// 	this.mentalHealthConditionsFormGroup.valid,
		// 	'criminalHistoryData',
		// 	this.criminalHistoryFormGroup.valid,
		// 	'fingerprintProofData',
		// 	this.fingerprintProofFormGroup.valid,
		// 	'citizenshipData',
		// 	this.citizenshipFormGroup.valid,
		// 	'additionalGovIdData',
		// 	this.additionalGovIdFormGroup.valid,
		// 	'bcDriversLicenceData',
		// 	this.bcDriversLicenceFormGroup.valid,
		// 	'characteristicsData',
		// 	this.characteristicsFormGroup.valid,
		// 	'photographOfYourselfData',
		// 	this.photographOfYourselfFormGroup.valid
		// );
		// console.debug(
		// 	'isStepLicenceSelectionComplete',
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
	isStepBackgroundComplete(): boolean {
		// console.debug(
		// 	'isStepBackgroundComplete',
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
	isStepIdentificationComplete(): boolean {
		const showAdditionalGovermentIdStep = this.citizenshipFormGroup
			? (this.citizenshipFormGroup.value.isCanadianCitizen == BooleanTypeCode.Yes &&
					this.citizenshipFormGroup.value.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			  (this.citizenshipFormGroup.value.isCanadianCitizen == BooleanTypeCode.No &&
					this.citizenshipFormGroup.value.notCanadianCitizenProofTypeCode !=
						LicenceDocumentTypeCode.PermanentResidentCard)
			: true;

		// console.debug(
		// 	'isStep4Complete',
		// 	this.personalInformationFormGroup.valid,
		// 	this.aliasesFormGroup.valid,
		// 	this.citizenshipFormGroup.valid,
		// 	showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true,
		// 	this.bcDriversLicenceFormGroup.valid,
		// 	this.characteristicsFormGroup.valid,
		// 	this.photographOfYourselfFormGroup.valid,
		// 	this.residentialAddressFormGroup.valid,
		// 	this.mailingAddressFormGroup.valid,
		// 	this.contactInformationFormGroup.valid
		// );
		// console.debug('showAdditionalGovermentIdStep', showAdditionalGovermentIdStep, this.additionalGovIdFormGroup.valid);

		if (this.authenticationService.isLoggedIn()) {
			return (
				this.citizenshipFormGroup.valid &&
				(showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true) &&
				this.bcDriversLicenceFormGroup.valid &&
				this.characteristicsFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid
			);
		} else {
			return (
				this.personalInformationFormGroup.valid &&
				this.aliasesFormGroup.valid &&
				this.citizenshipFormGroup.valid &&
				(showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true) &&
				this.bcDriversLicenceFormGroup.valid &&
				this.characteristicsFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid &&
				this.residentialAddressFormGroup.valid &&
				this.mailingAddressFormGroup.valid &&
				this.contactInformationFormGroup.valid
			);
		}
	}

	/**
	 * Determine if the step data should be saved. If the data has changed and category data exists;
	 * @returns
	 */
	isSaveStep(): boolean {
		// console.log('isSaveStep', this.soleProprietorFormGroup.valid, this.soleProprietorFormGroup.value);
		const shouldSaveStep = this.hasValueChanged && this.soleProprietorFormGroup.valid;
		// const shouldSaveStep =
		// 	this.hasValueChanged &&
		// 	((this.categoryArmouredCarGuardFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryBodyArmourSalesFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryClosedCircuitTelevisionInstallerFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryElectronicLockingDeviceInstallerFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryFireInvestigatorFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryLocksmithFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryLocksmithSupFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryPrivateInvestigatorSupFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmInstallerFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmInstallerSupFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityConsultantFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmMonitorFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmResponseFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmSalesFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityGuardFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityGuardSupFormGroup.get('isInclude')?.value ?? false));

		console.debug('shouldSaveStep', shouldSaveStep);
		return shouldSaveStep;
	}

	/**
	 * Save the licence data as is.
	 * @returns StrictHttpResponse<WorkerLicenceAppUpsertResponse>
	 */
	saveLicenceStep(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const body = this.getSaveBody(this.licenceModelFormGroup.getRawValue());
		return this.workerLicensingService.apiWorkerLicenceApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => {
				const formValue = this.licenceModelFormGroup.getRawValue();
				if (!formValue.licenceAppId) {
					this.licenceModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
	}

	/**
	 * Submit the new licence data.
	 * @returns StrictHttpResponse<WorkerLicenceAppUpsertResponse>
	 */
	submitLicenceNew(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		if (this.authenticationService.isLoggedIn()) {
			return this.submitLicenceNewAuthenticated();
		} else {
			return this.submitLicenceNewAnonymous();
		}
	}

	/**
	 * Submit the licence data for replacement anonymous
	 * @returns
	 */
	submitLicenceReplacementAnonymous(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body = this.getSaveBodyAnonymous(licenceModelFormValue);
		const consentData = this.consentAndDeclarationFormGroup.getRawValue();

		// console.debug('submitLicenceReplacementAnonymous body', body);

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.workerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((resp: string) => {
					const keyCode = resp;

					return this.workerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeSubmitPost$Response({
						keyCode,
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/**
	 * Submit the licence data for renewal anonymous
	 * @returns
	 */
	submitLicenceRenewalAnonymous(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		let keyCode = '';
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body = this.getSaveBodyAnonymous(licenceModelFormValue);
		const documentInfos = this.getDocsToSaveAnonymous(licenceModelFormValue);
		const consentData = this.consentAndDeclarationFormGroup.getRawValue();

		// Get the keyCode for the existing documents to save.
		const existingKeyCodes: Array<string> = [];
		documentInfos.forEach((docBody: LicenceDocumentsToSave) => {
			docBody.documents.forEach((doc: any) => {
				if (doc.documentUrlId) {
					existingKeyCodes.push(doc.documentUrlId);
				}
			});
		});

		console.debug('xxxxxxxxxxxxxxxxxxxx existingDocumentKeys', existingKeyCodes);

		console.debug('xxxxxxxxxxxxxxxxxxxx licenceModelFormGroup', this.licenceModelFormGroup.getRawValue());
		console.log('xxxxxxxxxxxxxxxxxxxx body', body);

		console.debug('[submitLicenceRenewalAnonymous] body', body);
		console.debug('[submitLicenceRenewalAnonymous] documentInfos', documentInfos);

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.workerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((resp: string) => {
					keyCode = resp;

					const documentsToSave: Observable<string>[] = [];
					documentInfos.forEach((docBody: LicenceDocumentsToSave) => {
						// Only pass new documents and get a keyCode for each of those.
						const newDocumentsOnly: Array<Blob> = [];
						docBody.documents.forEach((doc: any) => {
							if (!doc.documentUrlId) {
								newDocumentsOnly.push(doc);
							}
						});

						if (newDocumentsOnly.length > 0) {
							documentsToSave.push(
								this.workerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeFilesPost({
									keyCode,
									body: {
										Documents: newDocumentsOnly,
										LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
									},
								})
							);
						}
					});

					return forkJoin(documentsToSave);
				}),
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.fileKeyCodes = [...resps, ...existingKeyCodes];

					return this.workerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeSubmitPost$Response({
						keyCode,
						body,
					});
				})
			)
			.pipe(take(1));
	}

	private createEmptyLicenceAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		this.reset();

		const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceTypeCode };
		const photographOfYourselfData = { useBcServicesCardPhoto: BooleanTypeCode.No };

		this.licenceModelFormGroup.patchValue(
			{
				workerLicenceTypeData,
				photographOfYourselfData,
				profileConfirmationData: { isProfileUpToDate: true },
			},
			{
				emitEvent: false,
			}
		);

		return of(this.licenceModelFormGroup.value);
	}

	private createEmptyLicenceAuthenticated(): Observable<any> {
		this.reset();

		const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
		if (bcscUserWhoamiProfile) {
			const personalInformationData = {
				givenName: bcscUserWhoamiProfile.firstName,
				middleName1: bcscUserWhoamiProfile.middleName1,
				middleName2: bcscUserWhoamiProfile.middleName2,
				surname: bcscUserWhoamiProfile.lastName,
				dateOfBirth: bcscUserWhoamiProfile.birthDate,
				genderCode: bcscUserWhoamiProfile.gender,
			};

			const residentialAddressData = {
				addressSelected: true,
				isMailingTheSameAsResidential: false,
				addressLine1: bcscUserWhoamiProfile.residentialAddress?.addressLine1,
				addressLine2: bcscUserWhoamiProfile.residentialAddress?.addressLine2,
				city: bcscUserWhoamiProfile.residentialAddress?.city,
				country: bcscUserWhoamiProfile.residentialAddress?.country,
				postalCode: bcscUserWhoamiProfile.residentialAddress?.postalCode,
				province: bcscUserWhoamiProfile.residentialAddress?.province,
			};

			this.licenceModelFormGroup.patchValue(
				{
					personalInformationData: { ...personalInformationData },
					residentialAddressData: { ...residentialAddressData },
					aliasesData: { previousNameFlag: BooleanTypeCode.No },
				},
				{
					emitEvent: false,
				}
			);
		} else {
			const residentialAddressData = {
				isMailingTheSameAsResidential: false,
			};

			this.licenceModelFormGroup.patchValue(
				{
					residentialAddressData: { ...residentialAddressData },
					aliasesData: { previousNameFlag: BooleanTypeCode.No },
				},
				{
					emitEvent: false,
				}
			);
		}

		return of(this.licenceModelFormGroup.value);
	}

	private loadSpecificLicence(licenceAppId: string): Observable<WorkerLicenceResponse> {
		this.reset();

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
			tap((resp: WorkerLicenceResponse) => {
				const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
				const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };
				const soleProprietorData = {
					isSoleProprietor: resp.businessTypeCode === BusinessTypeCode.None ? BooleanTypeCode.No : BooleanTypeCode.Yes,
					businessTypeCode: resp.businessTypeCode,
				};

				const expiredLicenceData = {
					hasExpiredLicence: this.booleanToBooleanType(resp.hasExpiredLicence),
					expiredLicenceNumber: resp.expiredLicenceNumber,
					expiryDate: resp.expiryDate,
					expiredLicenceId: resp.expiredLicenceId,
				};

				const licenceTermData = {
					licenceTermCode: resp.licenceTermCode,
				};

				const policeBackgroundDataAttachments: Array<File> = [];
				if (resp.policeOfficerDocument?.documentResponses) {
					resp.policeOfficerDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						policeBackgroundDataAttachments.push(aFile);
					});
				}

				const policeBackgroundData = {
					isPoliceOrPeaceOfficer: this.booleanToBooleanType(resp.isPoliceOrPeaceOfficer),
					policeOfficerRoleCode: resp.policeOfficerRoleCode,
					otherOfficerRole: resp.otherOfficerRole,
					attachments: policeBackgroundDataAttachments,
				};

				const bcDriversLicenceData = {
					hasBcDriversLicence: this.booleanToBooleanType(resp.hasBcDriversLicence),
					bcDriversLicenceNumber: resp.bcDriversLicenceNumber,
				};

				const fingerprintProofDataAttachments: Array<File> = [];
				if (resp.fingerprintProofDocument?.documentResponses) {
					resp.fingerprintProofDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						fingerprintProofDataAttachments.push(aFile);
					});
				}

				const fingerprintProofData = {
					attachments: fingerprintProofDataAttachments,
				};

				const mentalHealthConditionsDataAttachments: Array<File> = [];
				if (resp.mentalHealthDocument?.documentResponses) {
					resp.mentalHealthDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						mentalHealthConditionsDataAttachments.push(aFile);
					});
				}

				const mentalHealthConditionsData = {
					isTreatedForMHC: this.booleanToBooleanType(resp.isTreatedForMHC),
					attachments: mentalHealthConditionsDataAttachments,
				};

				const criminalHistoryData = {
					hasCriminalHistory: this.booleanToBooleanType(resp.hasCriminalHistory),
				};

				const aliasesData = {
					previousNameFlag: resp.hasPreviousName ? this.booleanToBooleanType(resp.hasPreviousName) : BooleanTypeCode.No,
				};

				let personalInformationData = {};
				if (bcscUserWhoamiProfile) {
					personalInformationData = {
						givenName: bcscUserWhoamiProfile.firstName,
						middleName1: bcscUserWhoamiProfile.middleName1,
						middleName2: bcscUserWhoamiProfile.middleName2,
						surname: bcscUserWhoamiProfile.lastName,
						genderCode: bcscUserWhoamiProfile.gender,
						dateOfBirth: bcscUserWhoamiProfile.birthDate,
						origGivenName: bcscUserWhoamiProfile.firstName,
						origMiddleName1: bcscUserWhoamiProfile.middleName1,
						origMiddleName2: bcscUserWhoamiProfile.middleName2,
						origSurname: bcscUserWhoamiProfile.lastName,
						origGenderCode: bcscUserWhoamiProfile.gender,
						origDateOfBirth: bcscUserWhoamiProfile.birthDate,
					};
				} else {
					personalInformationData = {
						givenName: resp.givenName,
						middleName1: resp.middleName1,
						middleName2: resp.middleName2,
						surname: resp.surname,
						genderCode: resp.genderCode,
						dateOfBirth: resp.dateOfBirth,
						origGivenName: resp.givenName,
						origMiddleName1: resp.middleName1,
						origMiddleName2: resp.middleName2,
						origSurname: resp.surname,
						origGenderCode: resp.genderCode,
						origDateOfBirth: resp.dateOfBirth,
					};
				}

				const citizenshipDataAttachments: Array<File> = [];
				if (resp.citizenshipDocument?.documentResponses) {
					resp.citizenshipDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						citizenshipDataAttachments.push(aFile);
					});
				}

				const citizenshipData = {
					isCanadianCitizen: this.booleanToBooleanType(resp.isCanadianCitizen),
					canadianCitizenProofTypeCode: resp.isCanadianCitizen
						? resp.citizenshipDocument?.licenceDocumentTypeCode
						: null,
					notCanadianCitizenProofTypeCode: resp.isCanadianCitizen
						? null
						: resp.citizenshipDocument?.licenceDocumentTypeCode,
					expiryDate: resp.citizenshipDocument?.expiryDate,
					attachments: citizenshipDataAttachments,
				};

				const additionalGovIdAttachments: Array<File> = [];
				if (resp.additionalGovIdDocument?.documentResponses) {
					resp.additionalGovIdDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						additionalGovIdAttachments.push(aFile);
					});
				}

				const additionalGovIdData = {
					governmentIssuedPhotoTypeCode: resp.additionalGovIdDocument?.licenceDocumentTypeCode,
					expiryDate: resp.additionalGovIdDocument?.expiryDate,
					attachments: additionalGovIdAttachments,
				};

				let height = resp.height ? resp.height + '' : null;
				let heightInches = '';
				if (resp.heightUnitCode == HeightUnitCode.Inches && resp.height && resp.height > 0) {
					height = Math.trunc(resp.height / 12) + '';
					heightInches = (resp.height % 12) + '';
				}

				const characteristicsData = {
					hairColourCode: resp.hairColourCode,
					eyeColourCode: resp.eyeColourCode,
					height,
					heightUnitCode: resp.heightUnitCode,
					heightInches,
					weight: resp.weight ? resp.weight + '' : null,
					weightUnitCode: resp.weightUnitCode,
				};

				const photographOfYourselfAttachments: Array<File> = [];
				if (resp.idPhotoDocument?.documentResponses) {
					resp.idPhotoDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						photographOfYourselfAttachments.push(aFile);
					});
				}

				const photographOfYourselfData = {
					useBcServicesCardPhoto: this.booleanToBooleanType(resp.useBcServicesCardPhoto),
					attachments: photographOfYourselfAttachments,
				};

				const contactInformationData = {
					contactEmailAddress: resp.contactEmailAddress,
					contactPhoneNumber: resp.contactPhoneNumber,
				};

				let residentialAddressData = {};
				const isMailingTheSameAsResidential = resp.isMailingTheSameAsResidential ?? false;
				if (bcscUserWhoamiProfile) {
					residentialAddressData = {
						addressSelected: true,
						isMailingTheSameAsResidential: isMailingTheSameAsResidential,
						addressLine1: bcscUserWhoamiProfile.residentialAddress?.addressLine1,
						addressLine2: bcscUserWhoamiProfile.residentialAddress?.addressLine2,
						city: bcscUserWhoamiProfile.residentialAddress?.city,
						country: bcscUserWhoamiProfile.residentialAddress?.country,
						postalCode: bcscUserWhoamiProfile.residentialAddress?.postalCode,
						province: bcscUserWhoamiProfile.residentialAddress?.province,
					};
				} else {
					residentialAddressData = {
						...resp.residentialAddressData,
						isMailingTheSameAsResidential: isMailingTheSameAsResidential,
						addressSelected: !!resp.residentialAddressData?.addressLine1,
					};
				}

				let mailingAddressData = {};
				// if (!isMailingTheSameAsResidential) {
				mailingAddressData = {
					...resp.mailingAddressData,
					addressSelected: !!resp.mailingAddressData?.addressLine1,
				};
				// }

				let restraintsAuthorizationData: any = {};
				let dogsAuthorizationData: any = {};
				let categoryArmouredCarGuardFormGroup: any = { isInclude: false };
				let categoryBodyArmourSalesFormGroup: any = { isInclude: false };
				let categoryClosedCircuitTelevisionInstallerFormGroup: any = { isInclude: false };
				let categoryElectronicLockingDeviceInstallerFormGroup: any = { isInclude: false };
				let categoryFireInvestigatorFormGroup: any = { isInclude: false };
				let categoryLocksmithFormGroup: any = { isInclude: false };
				let categoryLocksmithSupFormGroup: any = { isInclude: false };
				let categoryPrivateInvestigatorFormGroup: any = { isInclude: false };
				let categoryPrivateInvestigatorSupFormGroup: any = { isInclude: false };
				let categorySecurityGuardFormGroup: any = { isInclude: false };
				let categorySecurityGuardSupFormGroup: any = { isInclude: false };
				let categorySecurityAlarmInstallerFormGroup: any = { isInclude: false };
				let categorySecurityAlarmInstallerSupFormGroup: any = { isInclude: false };
				let categorySecurityAlarmMonitorFormGroup: any = { isInclude: false };
				let categorySecurityAlarmResponseFormGroup: any = { isInclude: false };
				let categorySecurityAlarmSalesFormGroup: any = { isInclude: false };
				let categorySecurityConsultantFormGroup: any = { isInclude: false };
				resp.categoryData?.forEach((category: WorkerLicenceAppCategoryData) => {
					switch (category.workerCategoryTypeCode) {
						case WorkerCategoryTypeCode.ArmouredCarGuard: {
							const attachmentsArmouredCarGuard: Array<File> = [];
							let armouredCarGuardExpiryDate = '';
							category.documents?.forEach((doc: Document) => {
								armouredCarGuardExpiryDate = this.formatDatePipe.transform(
									doc.expiryDate,
									SPD_CONSTANTS.date.backendDateFormat
								);
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									attachmentsArmouredCarGuard.push(aFile);
								});
							});
							categoryArmouredCarGuardFormGroup = {
								isInclude: true,
								expiryDate: armouredCarGuardExpiryDate,
								attachments: attachmentsArmouredCarGuard,
							};
							break;
						}
						case WorkerCategoryTypeCode.BodyArmourSales:
							categoryBodyArmourSalesFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
							categoryClosedCircuitTelevisionInstallerFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
							categoryElectronicLockingDeviceInstallerFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.FireInvestigator: {
							const attachments1FireInvestigator: Array<File> = [];
							const attachments2FireInvestigator: Array<File> = [];
							category.documents?.forEach((doc: Document) => {
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									if (
										doc.licenceDocumentTypeCode == LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate
									) {
										attachments1FireInvestigator.push(aFile);
									} else if (
										doc.licenceDocumentTypeCode == LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter
									) {
										attachments2FireInvestigator.push(aFile);
									}
								});
							});
							categoryFireInvestigatorFormGroup = {
								isInclude: true,
								fireCourseCertificateAttachments: attachments1FireInvestigator,
								fireVerificationLetterAttachments: attachments2FireInvestigator,
							};
							break;
						}
						case WorkerCategoryTypeCode.Locksmith: {
							const attachmentsLocksmith: Array<File> = [];
							let requirementCodeLocksmith = '';
							category.documents?.forEach((doc: Document) => {
								requirementCodeLocksmith = doc.licenceDocumentTypeCode ?? '';
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									attachmentsLocksmith.push(aFile);
								});
							});
							categoryLocksmithFormGroup = {
								isInclude: true,
								requirementCode: requirementCodeLocksmith,
								attachments: attachmentsLocksmith,
							};
							break;
						}
						case WorkerCategoryTypeCode.LocksmithUnderSupervision:
							categoryLocksmithSupFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.PrivateInvestigator: {
							const attachments1PrivateInvestigator: Array<File> = [];
							const attachments2PrivateInvestigator: Array<File> = [];
							let requirementCodePrivateInvestigator = '';
							let trainingCodePrivateInvestigator = '';
							category.documents?.forEach((doc: Document) => {
								const licenceDocumentTypeCodePrivateInvestigator = doc.licenceDocumentTypeCode ?? '';
								if (
									licenceDocumentTypeCodePrivateInvestigator ==
										PrivateInvestigatorTrainingCode.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge ||
									licenceDocumentTypeCodePrivateInvestigator ==
										PrivateInvestigatorTrainingCode.CategoryPrivateInvestigator_TrainingRecognizedCourse
								) {
									trainingCodePrivateInvestigator = doc.licenceDocumentTypeCode ?? '';
								} else {
									requirementCodePrivateInvestigator = doc.licenceDocumentTypeCode ?? '';
								}
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									if (
										licenceDocumentTypeCodePrivateInvestigator ==
											PrivateInvestigatorTrainingCode.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge ||
										licenceDocumentTypeCodePrivateInvestigator ==
											PrivateInvestigatorTrainingCode.CategoryPrivateInvestigator_TrainingRecognizedCourse
									) {
										attachments2PrivateInvestigator.push(aFile);
									} else {
										attachments1PrivateInvestigator.push(aFile);
									}
								});
							});
							categoryPrivateInvestigatorFormGroup = {
								isInclude: true,
								requirementCode: requirementCodePrivateInvestigator,
								attachments: attachments1PrivateInvestigator,
								trainingCode: trainingCodePrivateInvestigator,
								trainingAttachments: attachments2PrivateInvestigator,
							};
							break;
						}
						case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision: {
							const attachments1PrivateInvestigatorUnderSupervision: Array<File> = [];
							let requirementCodePrivateInvestigatorUnderSupervision = '';
							category.documents?.forEach((doc: Document) => {
								requirementCodePrivateInvestigatorUnderSupervision = doc.licenceDocumentTypeCode ?? '';
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									attachments1PrivateInvestigatorUnderSupervision.push(aFile);
								});
							});
							categoryPrivateInvestigatorSupFormGroup = {
								isInclude: true,
								requirementCode: requirementCodePrivateInvestigatorUnderSupervision,
								attachments: attachments1PrivateInvestigatorUnderSupervision,
							};
							break;
						}
						case WorkerCategoryTypeCode.SecurityGuard: {
							const attachmentsSecurityGuard: Array<File> = [];
							const attachmentsDogs: Array<File> = [];
							const attachmentsRestraints: Array<File> = [];
							let requirementCodeSecurityGuard = '';
							let carryAndUseRestraintsDocument = '';
							category.documents?.forEach((doc: Document) => {
								const isDogRelated =
									doc.licenceDocumentTypeCode === LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate;
								const isRestraintRelated = (Object.keys(RestraintDocumentTypeCode) as Array<any>).includes(
									doc.licenceDocumentTypeCode
								);
								if (isDogRelated) {
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachmentsDogs.push(aFile);
									});
								} else if (isRestraintRelated) {
									carryAndUseRestraintsDocument = doc.licenceDocumentTypeCode ?? '';
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachmentsRestraints.push(aFile);
									});
								} else {
									requirementCodeSecurityGuard = doc.licenceDocumentTypeCode ?? '';
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachmentsSecurityGuard.push(aFile);
									});
								}
							});
							restraintsAuthorizationData = {
								carryAndUseRestraints: this.booleanToBooleanType(resp.carryAndUseRestraints),
								carryAndUseRestraintsDocument,
								attachments: attachmentsRestraints,
							};
							dogsAuthorizationData = {
								useDogs: this.booleanToBooleanType(resp.useDogs),
								dogsPurposeFormGroup: {
									isDogsPurposeDetectionDrugs: resp.isDogsPurposeDetectionDrugs,
									isDogsPurposeDetectionExplosives: resp.isDogsPurposeDetectionExplosives,
									isDogsPurposeProtection: resp.isDogsPurposeProtection,
								},
								attachments: attachmentsDogs,
							};
							categorySecurityGuardFormGroup = {
								isInclude: true,
								requirementCode: requirementCodeSecurityGuard,
								attachments: attachmentsSecurityGuard,
							};
							break;
						}
						case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
							categorySecurityGuardSupFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityAlarmInstaller: {
							const attachmentsSecurityAlarmInstaller: Array<File> = [];
							let requirementCodeSecurityAlarmInstaller = '';
							category.documents?.forEach((doc: Document) => {
								requirementCodeSecurityAlarmInstaller = doc.licenceDocumentTypeCode ?? '';
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									attachmentsSecurityAlarmInstaller.push(aFile);
								});
							});
							categorySecurityAlarmInstallerFormGroup = {
								isInclude: true,
								requirementCode: requirementCodeSecurityAlarmInstaller,
								attachments: attachmentsSecurityAlarmInstaller,
							};
							break;
						}
						case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
							categorySecurityAlarmInstallerSupFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityAlarmMonitor:
							categorySecurityAlarmMonitorFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityAlarmResponse:
							categorySecurityAlarmResponseFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityAlarmSales:
							categorySecurityAlarmSalesFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityConsultant: {
							const attachments1SecurityConsultant: Array<File> = [];
							const attachments2SecurityConsultant: Array<File> = [];
							let requirementCodeSecurityConsultant = '';
							category.documents?.forEach((doc: Document) => {
								const licenceDocumentTypeCodeSecurityConsultant = doc.licenceDocumentTypeCode ?? '';
								if (
									licenceDocumentTypeCodeSecurityConsultant != LicenceDocumentTypeCode.CategorySecurityConsultantResume
								) {
									requirementCodeSecurityConsultant = doc.licenceDocumentTypeCode ?? '';
								}
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									if (
										licenceDocumentTypeCodeSecurityConsultant ===
										LicenceDocumentTypeCode.CategorySecurityConsultantResume
									) {
										attachments1SecurityConsultant.push(aFile);
									} else {
										attachments2SecurityConsultant.push(aFile);
									}
								});
							});
							categorySecurityConsultantFormGroup = {
								isInclude: true,
								requirementCode: requirementCodeSecurityConsultant,
								attachments: attachments2SecurityConsultant,
								resumeAttachments: attachments1SecurityConsultant,
							};
							break;
						}
					}
				});

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: resp.licenceAppId,
						originalBusinessTypeCode: soleProprietorData.businessTypeCode,
						caseNumber: resp.caseNumber,
						applicationPortalStatus: resp.applicationPortalStatus,
						workerLicenceTypeData,
						applicationTypeData,
						soleProprietorData,
						expiredLicenceData,
						licenceTermData,
						policeBackgroundData,
						bcDriversLicenceData,
						mentalHealthConditionsData,
						fingerprintProofData,
						criminalHistoryData,
						aliasesData,
						personalInformationData,
						characteristicsData,
						citizenshipData,
						additionalGovIdData,
						photographOfYourselfData,
						contactInformationData,
						profileConfirmationData: { isProfileUpToDate: true },
						residentialAddressData: { ...residentialAddressData },
						mailingAddressData: { ...mailingAddressData },
						categoryArmouredCarGuardFormGroup,
						categoryBodyArmourSalesFormGroup,
						categoryClosedCircuitTelevisionInstallerFormGroup,
						categoryElectronicLockingDeviceInstallerFormGroup,
						categoryFireInvestigatorFormGroup,
						categoryLocksmithFormGroup,
						categoryLocksmithSupFormGroup,
						categoryPrivateInvestigatorFormGroup,
						categoryPrivateInvestigatorSupFormGroup,
						categorySecurityGuardFormGroup,
						categorySecurityGuardSupFormGroup,
						categorySecurityAlarmInstallerFormGroup,
						categorySecurityAlarmInstallerSupFormGroup,
						categorySecurityAlarmMonitorFormGroup,
						categorySecurityAlarmResponseFormGroup,
						categorySecurityAlarmSalesFormGroup,
						categorySecurityConsultantFormGroup,
						restraintsAuthorizationData,
						dogsAuthorizationData,
					},
					{
						emitEvent: false,
					}
				);

				const aliasesArray = this.licenceModelFormGroup.get('aliasesData.aliases') as FormArray;
				resp.aliases?.forEach((alias: Alias) => {
					aliasesArray.push(
						new FormGroup({
							givenName: new FormControl(alias.givenName),
							middleName1: new FormControl(alias.middleName1),
							middleName2: new FormControl(alias.middleName2),
							surname: new FormControl(alias.surname, [FormControlValidators.required]),
						})
					);
				});

				this.licenceModelFormGroup.setControl('aliasesData.aliases', aliasesArray);

				console.debug('[loadSpecificLicence] licenceModelFormGroup', this.licenceModelFormGroup.value);
			}),
			take(1)
		);
	}

	/**
	 * Load an existing draft licence application
	 * @param licenceAppId
	 * @returns
	 */
	private loadLicenceNew(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificLicence(licenceAppId).pipe(
			tap((resp: any) => {
				console.debug('LOAD loadLicenceNew', resp);
			})
		);
	}

	/**
	 * Load an existing licence application for renewal
	 * @param licenceAppId
	 * @returns
	 */
	private loadLicenceRenewal(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificLicence(licenceAppId).pipe(
			tap((_resp: WorkerLicenceResponse) => {
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

				// Remove data that should be re-prompted for
				// const soleProprietorData = {
				// 	isSoleProprietor: null,
				// 	businessTypeCode: null,
				// };
				// const fingerprintProofData = {
				// 	attachments: [],
				// };
				// const licenceTermData = {
				// 	licenceTermCode: null,
				// };
				// const aliasesData = { previousNameFlag: null, aliases: [] };
				// const bcDriversLicenceData = {
				// 	hasBcDriversLicence: null,
				// 	bcDriversLicenceNumber: null,
				// };
				// const citizenshipData = {
				// 	isCanadianCitizen: null,
				// 	canadianCitizenProofTypeCode: null,
				// 	notCanadianCitizenProofTypeCode: null,
				// 	expiryDate: null,
				// 	attachments: [],
				// };
				// const additionalGovIdData = {
				// 	governmentIssuedPhotoTypeCode: null,
				// 	expiryDate: null,
				// 	attachments: [],
				// };

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: null,
						applicationTypeData,
						originalLicenceTermCode: _resp.licenceTermCode,

						// soleProprietorData,
						// licenceTermData,
						// fingerprintProofData,
						// bcDriversLicenceData,
						// aliasesData,
						// citizenshipData,
						// additionalGovIdData,
						// restraintsAuthorizationData,
						// dogsAuthorizationData,
					},
					{
						emitEvent: false,
					}
				);

				console.debug('[loadLicenceRenewal] licenceModel', this.licenceModelFormGroup.value);
			})
		);
	}

	/**
	 * Load an existing licence application for update
	 * @param licenceAppId
	 * @returns
	 */
	private loadLicenceUpdate(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificLicence(licenceAppId).pipe(
			tap((_resp: any) => {
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };

				// TODO Update: Remove data that should be re-prompted for

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: null,
						applicationTypeData,
					},
					{
						emitEvent: false,
					}
				);

				console.debug('[loadLicenceUpdate] licenceModel', this.licenceModelFormGroup.value);
			})
		);
	}

	/**
	 * Load an existing licence application for replacement
	 * @param licenceAppId
	 * @returns
	 */
	private loadLicenceReplacement(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificLicence(licenceAppId).pipe(
			tap((_resp: any) => {
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

				const residentialAddressData = {
					isMailingTheSameAsResidential: false, // Mailing address validation will only show when this is false.
				};

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: null,
						applicationTypeData,
						residentialAddressData: { ...residentialAddressData },
					},
					{
						emitEvent: false,
					}
				);

				console.debug('[loadLicenceReplacement] licenceModel', this.licenceModelFormGroup.value);
			})
		);
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	private submitLicenceNewAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const body = this.getSaveBody(this.licenceModelFormGroup.getRawValue());
		console.debug('submitLicenceAuthenticated body', body);

		return this.workerLicensingService.apiWorkerLicenceApplicationsSubmitPost$Response({ body });
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	private submitLicenceNewAnonymous(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		let keyCode = '';
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body = this.getSaveBodyAnonymous(licenceModelFormValue);
		console.debug('submitLicenceNewAnonymous body', body);

		const documentInfos = this.getDocsToSaveAnonymous(licenceModelFormValue);
		// console.debug('submitLicenceNewAnonymous documentInfos', documentInfos);

		const formValue = this.consentAndDeclarationFormGroup.getRawValue();

		const googleRecaptcha = { recaptchaCode: formValue.captchaFormGroup.token };
		return this.workerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((resp: string) => {
					keyCode = resp;

					const documentsToSave: Observable<string>[] = [];
					documentInfos.forEach((docBody: LicenceDocumentsToSave) => {
						documentsToSave.push(
							this.workerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeFilesPost({
								keyCode,
								body: {
									Documents: docBody.documents,
									LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
								},
							})
						);
					});

					return forkJoin(documentsToSave);
				}),
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.fileKeyCodes = resps;

					return this.workerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeSubmitPost$Response({
						keyCode,
						body,
					});
				})
			)
			.pipe(take(1));
	}
}
