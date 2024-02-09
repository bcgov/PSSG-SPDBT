import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	Alias,
	ApplicationTypeCode,
	BooleanTypeCode,
	BusinessTypeCode,
	Document,
	GoogleRecaptcha,
	HeightUnitCode,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	WorkerCategoryTypeCode,
	WorkerLicenceAppAnonymousSubmitRequest,
	WorkerLicenceCommandResponse,
	WorkerLicenceResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import * as moment from 'moment';
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
import { LicenceLookupService, SecurityWorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { CommonApplicationService } from './common-application.service';
import { LicenceApplicationHelper, LicenceDocument } from './licence-application.helper';

export class LicenceDocumentsToSave {
	'licenceDocumentTypeCode': LicenceDocumentTypeCode;
	'documents': Array<Blob>;
}

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService extends LicenceApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	licenceModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	licenceModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null),
		caseNumber: new FormControl(null), // placeholder to save info for display purposes

		originalApplicationId: new FormControl(null),
		originalLicenceId: new FormControl(null),
		originalLicenceNumber: new FormControl(null),
		originalExpiryDate: new FormControl(null),
		originalLicenceTermCode: new FormControl(null),
		originalBusinessTypeCode: new FormControl(null),
		originalPhotoOfYourselfExpired: new FormControl(false),
		originalDogAuthorizationExists: new FormControl(false),

		applicationPortalStatus: new FormControl(null),

		personalInformationData: this.personalInformationFormGroup,
		reprintLicenceData: this.reprintLicenceFormGroup,
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

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		private securityWorkerLicensingService: SecurityWorkerLicensingService,
		private licenceLookupService: LicenceLookupService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private commonApplicationService: CommonApplicationService,
		private utilService: UtilService
	) {
		super(formBuilder, configService, formatDatePipe);

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
			// TODO loadUserProfile
			tap((_resp: any) => {
				console.debug('loadUserProfile');

				this.initialized = true;
				console.debug('this.initialized', this.initialized);

				this.commonApplicationService.setApplicationTitle();
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
	): Observable<LicenceResponse> {
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

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeCode,
					applicationTypeCode,
					accessCodeData.licenceNumber
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
	private getLicenceOfType(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode
	): Observable<WorkerLicenceResponse> {
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
				console.debug('[createNewLicenceAnonymous] resp', resp);

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(workerLicenceTypeCode);
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

				this.commonApplicationService.setApplicationTitle();
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

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response({
			licenceAppId: this.licenceModelFormGroup.get('licenceAppId')?.value,
			body: doc,
		});
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
		// 	'reprintLicenceData',
		// 	this.reprintLicenceFormGroup.valid,
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

		const updateNameOrGenderChange = this.personalInformationFormGroup?.get('hasLegalNameChanged')?.value ?? false;

		if (this.authenticationService.isLoggedIn()) {
			return (
				this.citizenshipFormGroup.valid &&
				(showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true) &&
				this.bcDriversLicenceFormGroup.valid &&
				this.characteristicsFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid
			);
		} else {
			// console.debug(
			// 	'isStepIdentificationComplete',
			// 	this.personalInformationFormGroup.valid,
			// 	this.aliasesFormGroup.valid,
			// 	this.citizenshipFormGroup.valid,
			// 	showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true,
			// 	this.bcDriversLicenceFormGroup.valid,
			// 	this.characteristicsFormGroup.valid,
			// 	this.photographOfYourselfFormGroup.valid,
			// 	this.residentialAddressFormGroup.valid,
			// 	this.mailingAddressFormGroup.valid,
			// 	this.contactInformationFormGroup.valid,
			// 	updateNameOrGenderChange ? this.reprintLicenceFormGroup.valid : true
			// );

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
				this.contactInformationFormGroup.valid &&
				(updateNameOrGenderChange ? this.reprintLicenceFormGroup.valid : true)
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
	 * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	 */
	saveLicenceStep(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const body = this.getSaveBodyAuthenticated(this.licenceModelFormGroup.getRawValue());

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				const formValue = this.licenceModelFormGroup.getRawValue();
				if (!formValue.licenceAppId) {
					this.licenceModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
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
				mentalHealthConditionsData: { hasNewMentalHealthCondition: BooleanTypeCode.Yes },
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

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
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

				const bcDriversLicenceData = {
					hasBcDriversLicence: this.booleanToBooleanType(resp.hasBcDriversLicence),
					bcDriversLicenceNumber: resp.bcDriversLicenceNumber,
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

				let categoryBodyArmourSalesFormGroup: any = { isInclude: false };
				let categoryClosedCircuitTelevisionInstallerFormGroup: any = { isInclude: false };
				let categoryElectronicLockingDeviceInstallerFormGroup: any = { isInclude: false };
				let categoryLocksmithSupFormGroup: any = { isInclude: false };
				let categorySecurityGuardSupFormGroup: any = { isInclude: false };
				let categorySecurityAlarmInstallerSupFormGroup: any = { isInclude: false };
				let categorySecurityAlarmMonitorFormGroup: any = { isInclude: false };
				let categorySecurityAlarmResponseFormGroup: any = { isInclude: false };
				let categorySecurityAlarmSalesFormGroup: any = { isInclude: false };

				let restraintsAuthorizationData: any = {};
				let dogsAuthorizationData: any = {};

				let categoryArmouredCarGuardFormGroup: {
					isInclude: boolean;
					expiryDate: string | null;
					attachments: File[];
				} = {
					isInclude: false,
					expiryDate: null,
					attachments: [],
				};

				const categoryFireInvestigatorFormGroup: any = { isInclude: false };
				let categoryLocksmithFormGroup: any = { isInclude: false };
				const categoryPrivateInvestigatorFormGroup: any = { isInclude: false };
				let categoryPrivateInvestigatorSupFormGroup: any = { isInclude: false };
				let categorySecurityGuardFormGroup: any = { isInclude: false };
				let categorySecurityAlarmInstallerFormGroup: any = { isInclude: false };
				const categorySecurityConsultantFormGroup: any = { isInclude: false };

				resp.categoryCodes?.forEach((category: WorkerCategoryTypeCode) => {
					switch (category) {
						case WorkerCategoryTypeCode.BodyArmourSales:
							categoryBodyArmourSalesFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
							categoryClosedCircuitTelevisionInstallerFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
							categoryElectronicLockingDeviceInstallerFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.LocksmithUnderSupervision:
							categoryLocksmithSupFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
							categorySecurityGuardSupFormGroup = { isInclude: true, checkbox: true };
							break;
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
					}
				});

				const policeBackgroundDataAttachments: Array<File> = [];
				const fingerprintProofDataAttachments: Array<File> = [];
				const mentalHealthConditionsDataAttachments: Array<File> = [];
				const citizenshipDataAttachments: Array<File> = [];
				let citizenshipData: {
					isCanadianCitizen: BooleanTypeCode | null;
					canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
					notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
					expiryDate: string | null;
					attachments: File[];
				} = {
					isCanadianCitizen: null,
					canadianCitizenProofTypeCode: null,
					notCanadianCitizenProofTypeCode: null,
					expiryDate: null,
					attachments: [],
				};
				const additionalGovIdAttachments: Array<File> = [];
				let additionalGovIdData: {
					governmentIssuedPhotoTypeCode: LicenceDocumentTypeCode | null;
					expiryDate: string | null;
					attachments: File[];
				} = {
					governmentIssuedPhotoTypeCode: null,
					expiryDate: null,
					attachments: [],
				};
				const photographOfYourselfAttachments: Array<File> = [];

				const attachments1FireInvestigator: Array<File> = [];
				const attachments2FireInvestigator: Array<File> = [];
				const attachmentsLocksmith: Array<File> = [];
				const attachments1PrivateInvestigator: Array<File> = [];
				const attachments2PrivateInvestigator: Array<File> = [];
				const attachments1PrivateInvestigatorUnderSupervision: Array<File> = [];
				const attachmentsSecurityGuard: Array<File> = [];
				const attachmentsDogs: Array<File> = [];
				const attachmentsRestraints: Array<File> = [];
				const attachmentsSecurityAlarmInstaller: Array<File> = [];
				const attachments1SecurityConsultant: Array<File> = [];
				const attachments2SecurityConsultant: Array<File> = [];
				const attachmentsArmouredCarGuard: Array<File> = [];

				resp.documentInfos?.forEach((doc: Document) => {
					switch (doc.licenceDocumentTypeCode) {
						case LicenceDocumentTypeCode.BcServicesCard:
						case LicenceDocumentTypeCode.CanadianFirearmsLicence:
						case LicenceDocumentTypeCode.CertificateOfIndianStatus:
						case LicenceDocumentTypeCode.DriversLicence:
						case LicenceDocumentTypeCode.GovernmentIssuedPhotoId: {
							// Additional Government ID: GovernmentIssuedPhotoIdTypes

							const aFile = this.utilService.dummyFile(doc);
							additionalGovIdAttachments.push(aFile);

							additionalGovIdData = {
								governmentIssuedPhotoTypeCode: doc.licenceDocumentTypeCode,
								expiryDate: doc.expiryDate ?? null,
								attachments: additionalGovIdAttachments,
							};

							break;
						}
						case LicenceDocumentTypeCode.BirthCertificate:
						case LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen:
						case LicenceDocumentTypeCode.CanadianPassport:
						case LicenceDocumentTypeCode.CanadianCitizenship:
						case LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument:
						case LicenceDocumentTypeCode.DocumentToVerifyLegalWorkStatus:
						case LicenceDocumentTypeCode.PermanentResidentCard:
						case LicenceDocumentTypeCode.RecordOfLandingDocument:
						case LicenceDocumentTypeCode.StudyPermit:
						case LicenceDocumentTypeCode.WorkPermit: {
							// Is Canadian:  ProofOfCanadianCitizenshipTypes
							// Is Not Canadian: ProofOfAbilityToWorkInCanadaTypes

							const aFile = this.utilService.dummyFile(doc);
							citizenshipDataAttachments.push(aFile);

							citizenshipData = {
								isCanadianCitizen: this.booleanToBooleanType(resp.isCanadianCitizen),
								canadianCitizenProofTypeCode: resp.isCanadianCitizen ? doc.licenceDocumentTypeCode : null,
								notCanadianCitizenProofTypeCode: resp.isCanadianCitizen ? null : doc.licenceDocumentTypeCode,
								expiryDate: doc.expiryDate ?? null,
								attachments: citizenshipDataAttachments,
							};

							break;
						}
						case LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate: {
							const armouredCarGuardExpiryDate = this.formatDatePipe.transform(
								doc.expiryDate,
								SPD_CONSTANTS.date.backendDateFormat
							);

							const aFile = this.utilService.dummyFile(doc);
							attachmentsArmouredCarGuard.push(aFile);

							categoryArmouredCarGuardFormGroup = {
								isInclude: true,
								expiryDate: armouredCarGuardExpiryDate,
								attachments: attachmentsArmouredCarGuard,
							};
							break;
						}
						case LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate: {
							const aFile = this.utilService.dummyFile(doc);
							attachments1FireInvestigator.push(aFile);

							categoryFireInvestigatorFormGroup.isInclude = true;
							categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments = attachments1FireInvestigator;
							break;
						}
						case LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter: {
							const aFile = this.utilService.dummyFile(doc);
							attachments2FireInvestigator.push(aFile);

							categoryFireInvestigatorFormGroup.isInclude = true;
							categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments = attachments2FireInvestigator;

							break;
						}
						case LicenceDocumentTypeCode.CategoryLocksmithCertificateOfQualification:
						case LicenceDocumentTypeCode.CategoryLocksmithExperienceAndApprenticeship:
						case LicenceDocumentTypeCode.CategoryLocksmithApprovedLocksmithCourse: {
							const aFile = this.utilService.dummyFile(doc);
							attachmentsLocksmith.push(aFile);

							categoryLocksmithFormGroup = {
								isInclude: true,
								requirementCode: doc.licenceDocumentTypeCode,
								attachments: attachmentsLocksmith,
							};

							break;
						}
						case LicenceDocumentTypeCode.CategoryPrivateInvestigatorExperienceAndCourses:
						case LicenceDocumentTypeCode.CategoryPrivateInvestigatorTenYearsPoliceExperienceAndTraining:
						case LicenceDocumentTypeCode.CategoryPrivateInvestigatorKnowledgeAndExperience: {
							const aFile = this.utilService.dummyFile(doc);
							attachments1PrivateInvestigator.push(aFile);

							categoryPrivateInvestigatorFormGroup.isInclude = true;
							categoryPrivateInvestigatorFormGroup.requirementCode = doc.licenceDocumentTypeCode;
							categoryPrivateInvestigatorFormGroup.attachments = attachments1PrivateInvestigator;
							break;
						}
						case LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingRecognizedCourse:
						case LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingOtherCoursesOrKnowledge: {
							const aFile = this.utilService.dummyFile(doc);
							attachments2PrivateInvestigator.push(aFile);

							categoryPrivateInvestigatorFormGroup.isInclude = true;
							categoryPrivateInvestigatorFormGroup.trainingCode = doc.licenceDocumentTypeCode;
							categoryPrivateInvestigatorFormGroup.trainingAttachments = attachments2PrivateInvestigator;
							break;
						}
						case LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionPrivateSecurityTrainingNetworkCompletion:
						case LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionOtherCourseCompletion: {
							const aFile = this.utilService.dummyFile(doc);
							attachments1PrivateInvestigatorUnderSupervision.push(aFile);

							categoryPrivateInvestigatorSupFormGroup = {
								isInclude: true,
								requirementCode: doc.licenceDocumentTypeCode,
								attachments: attachments1PrivateInvestigatorUnderSupervision,
							};

							break;
						}
						case LicenceDocumentTypeCode.CategorySecurityAlarmInstallerTradesQualificationCertificate:
						case LicenceDocumentTypeCode.CategorySecurityAlarmInstallerExperienceOrTrainingEquivalent: {
							const aFile = this.utilService.dummyFile(doc);
							attachmentsSecurityAlarmInstaller.push(aFile);

							categorySecurityAlarmInstallerFormGroup = {
								isInclude: true,
								requirementCode: doc.licenceDocumentTypeCode,
								attachments: attachmentsSecurityAlarmInstaller,
							};
							break;
						}
						case LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters:
						case LicenceDocumentTypeCode.CategorySecurityConsultantRecommendationLetters: {
							const aFile = this.utilService.dummyFile(doc);
							attachments2SecurityConsultant.push(aFile);

							categorySecurityConsultantFormGroup.isInclude = true;
							categorySecurityConsultantFormGroup.requirementCode = doc.licenceDocumentTypeCode;
							categorySecurityConsultantFormGroup.attachments = attachments2SecurityConsultant;

							break;
						}
						case LicenceDocumentTypeCode.CategorySecurityConsultantResume: {
							const aFile = this.utilService.dummyFile(doc);
							attachments1SecurityConsultant.push(aFile);

							categorySecurityConsultantFormGroup.isInclude = true;
							categorySecurityConsultantFormGroup.resumeAttachments = attachments1SecurityConsultant;

							break;
						}
						case LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCertificate:
						case LicenceDocumentTypeCode.CategorySecurityGuardPoliceExperienceOrTraining:
						case LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCourseEquivalent: {
							const aFile = this.utilService.dummyFile(doc);
							attachmentsSecurityGuard.push(aFile);

							categorySecurityGuardFormGroup = {
								isInclude: true,
								requirementCode: doc.licenceDocumentTypeCode,
								attachments: attachmentsSecurityGuard,
							};

							break;
						}
						case LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate: {
							const aFile = this.utilService.dummyFile(doc);
							attachmentsDogs.push(aFile);

							dogsAuthorizationData = {
								useDogs: BooleanTypeCode.Yes,
								dogsPurposeFormGroup: {
									isDogsPurposeDetectionDrugs: resp.isDogsPurposeDetectionDrugs,
									isDogsPurposeDetectionExplosives: resp.isDogsPurposeDetectionExplosives,
									isDogsPurposeProtection: resp.isDogsPurposeProtection,
								},
								attachments: attachmentsDogs,
							};

							break;
						}
						case LicenceDocumentTypeCode.CategorySecurityGuardAstCertificate:
						case LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetter:
						case LicenceDocumentTypeCode.CategorySecurityGuardUseForceEmployerLetterAstEquivalent: {
							const aFile = this.utilService.dummyFile(doc);
							attachmentsRestraints.push(aFile);

							restraintsAuthorizationData = {
								carryAndUseRestraints: BooleanTypeCode.Yes,
								carryAndUseRestraintsDocument: doc.licenceDocumentTypeCode,
								attachments: attachmentsRestraints,
							};

							break;
						}
						case LicenceDocumentTypeCode.MentalHealthCondition: {
							const aFile = this.utilService.dummyFile(doc);
							mentalHealthConditionsDataAttachments.push(aFile);
							break;
						}
						case LicenceDocumentTypeCode.PhotoOfYourself: {
							const aFile = this.utilService.dummyFile(doc);
							photographOfYourselfAttachments.push(aFile);
							break;
						}
						case LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict: {
							const aFile = this.utilService.dummyFile(doc);
							policeBackgroundDataAttachments.push(aFile);
							break;
						}
						case LicenceDocumentTypeCode.ProofOfFingerprint: {
							const aFile = this.utilService.dummyFile(doc);
							fingerprintProofDataAttachments.push(aFile);
							break;
						}
					}
				});

				const policeBackgroundData = {
					isPoliceOrPeaceOfficer: this.booleanToBooleanType(resp.isPoliceOrPeaceOfficer),
					policeOfficerRoleCode: resp.policeOfficerRoleCode,
					otherOfficerRole: resp.otherOfficerRole,
					attachments: policeBackgroundDataAttachments,
				};

				const fingerprintProofData = {
					attachments: fingerprintProofDataAttachments,
				};

				const mentalHealthConditionsData = {
					isTreatedForMHC: this.booleanToBooleanType(resp.isTreatedForMHC),
					attachments: mentalHealthConditionsDataAttachments,
				};

				const photographOfYourselfData = {
					useBcServicesCardPhoto: this.booleanToBooleanType(resp.useBcServicesCardPhoto),
					attachments: photographOfYourselfAttachments,
				};

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: resp.licenceAppId,
						caseNumber: resp.caseNumber,
						originalBusinessTypeCode: soleProprietorData.businessTypeCode,
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
				const soleProprietorData = {
					isSoleProprietor: null,
					businessTypeCode: null,
				};
				const fingerprintProofData = {
					attachments: [],
				};
				const licenceTermData = {
					licenceTermCode: null,
				};
				const aliasesData = { previousNameFlag: null, aliases: [] };
				const bcDriversLicenceData = {
					hasBcDriversLicence: null,
					bcDriversLicenceNumber: null,
				};

				// If they were not born in Canada, they have to show proof for renewal
				let citizenshipData = {};
				let additionalGovIdData = {};
				if (!_resp.isCanadianCitizen) {
					citizenshipData = {
						isCanadianCitizen: null,
						canadianCitizenProofTypeCode: null,
						notCanadianCitizenProofTypeCode: null,
						expiryDate: null,
						attachments: [],
					};
					additionalGovIdData = {
						governmentIssuedPhotoTypeCode: null,
						expiryDate: null,
						attachments: [],
					};
				}
				const mentalHealthConditionsData = {
					isTreatedForMHC: null,
					attachments: [],
					hasPreviousMhcFormUpload: !!_resp.isTreatedForMHC,
				};
				const criminalHistoryData = {
					hasCriminalHistory: null,
					criminalChargeDescription: null,
				};

				let originalPhotoOfYourselfLastUpload = null;
				const photoOfYourselfDocs = _resp.documentInfos?.find(
					(item) => item.licenceDocumentTypeCode === LicenceDocumentTypeCode.PhotoOfYourself
				);
				if (photoOfYourselfDocs) {
					originalPhotoOfYourselfLastUpload = photoOfYourselfDocs.uploadedDateTime; // for testing: '2019-01-20T22:24:28+00:00';
				}

				// We require a new photo every 5 years. Please provide a new photo for your licence
				const yearsDiff = moment()
					.startOf('day')
					.diff(moment(originalPhotoOfYourselfLastUpload).startOf('day'), 'years');
				const originalPhotoOfYourselfExpired = yearsDiff >= 5 ? true : false;

				let photographOfYourselfData = {};
				if (originalPhotoOfYourselfExpired) {
					// clear out data to force user to upload a new photo
					photographOfYourselfData = {
						useBcServicesCardPhoto: BooleanTypeCode.No,
						attachments: [],
					};
				}

				// If applicant is renewing a licence where they already had authorization to use dogs,
				// clear attachments to force user to upload a new proof of qualification.
				const originalDogAuthorizationExists = _resp.useDogs;
				let dogsAuthorizationData = {};
				if (originalDogAuthorizationExists) {
					dogsAuthorizationData = {
						useDogs: this.booleanToBooleanType(_resp.useDogs),
						dogsPurposeFormGroup: {
							isDogsPurposeDetectionDrugs: _resp.isDogsPurposeDetectionDrugs,
							isDogsPurposeDetectionExplosives: _resp.isDogsPurposeDetectionExplosives,
							isDogsPurposeProtection: _resp.isDogsPurposeProtection,
						},
						attachments: [],
					};
				}

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: null,
						applicationTypeData,
						originalLicenceTermCode: _resp.licenceTermCode,
						originalPhotoOfYourselfExpired,
						originalDogAuthorizationExists,

						soleProprietorData,
						licenceTermData,
						fingerprintProofData,
						bcDriversLicenceData,
						aliasesData,
						photographOfYourselfData,
						citizenshipData,
						additionalGovIdData,
						dogsAuthorizationData,
						mentalHealthConditionsData,
						criminalHistoryData,
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
			tap((_resp: WorkerLicenceResponse) => {
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };

				const mentalHealthConditionsData = {
					isTreatedForMHC: null,
					attachments: [],
					hasPreviousMhcFormUpload: !!_resp.isTreatedForMHC,
				};
				const criminalHistoryData = {
					hasCriminalHistory: null,
					criminalChargeDescription: null,
				};

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: null,
						applicationTypeData,
						originalLicenceTermCode: _resp.licenceTermCode,
						mentalHealthConditionsData,
						criminalHistoryData,
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
						originalLicenceTermCode: _resp.licenceTermCode,
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
	submitLicenceNewAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const body = this.getSaveBodyAuthenticated(this.licenceModelFormGroup.getRawValue());

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		// delete body.documentExpiredInfos;

		console.debug('submitLicenceAuthenticated body', body);

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsSubmitPost$Response({ body });
	}

	/**
	 * Submit the licence data for renewal anonymous
	 * @returns
	 */
	submitLicenceAnonymous(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		console.debug('[submitLicenceAnonymous] licenceModelFormValue', licenceModelFormValue);

		const body = this.getSaveBodyAnonymous(licenceModelFormValue);
		console.debug('[submitLicenceAnonymous] saveBodyAnonymous', body);

		const documentsToSave = this.getDocsToSaveAnonymousBlobs(licenceModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		// Get the keyCode for the existing documents to save.
		const existingKeyCodes: Array<string> = [];
		let newDocumentsExist = false;
		body.documentInfos?.forEach((doc: Document) => {
			if (doc.documentUrlId) {
				existingKeyCodes.push(doc.documentUrlId);
			} else {
				newDocumentsExist = true;
			}
		});

		delete body.documentInfos;

		console.debug('[submitLicenceAnonymous] body', body);
		console.debug('[submitLicenceAnonymous] documentsToSave', documentsToSave);
		console.debug('[submitLicenceAnonymous] existingKeyCodes', existingKeyCodes);
		console.debug('[submitLicenceAnonymous] newDocumentsExist', newDocumentsExist);

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		if (newDocumentsExist) {
			return this.postLicenceAnonymousNewDocuments(googleRecaptcha, documentsToSave, body);
		} else {
			return this.postLicenceAnonymousNoNewDocuments(googleRecaptcha, body);
		}
	}

	/**
	 * Post licence anonymous. This licence must not have any new documents (for example: with an update or replacement)
	 * @returns
	 */
	private postLicenceAnonymousNoNewDocuments(
		googleRecaptcha: GoogleRecaptcha,
		body: WorkerLicenceAppAnonymousSubmitRequest
	) {
		return this.securityWorkerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((resp: string) => {
					const keyCode = resp;

					return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeSubmitPost$Response({
						keyCode,
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/**
	 * Post licence anonymous. This licence has new documents (for example: with new or renew)
	 * @returns
	 */
	private postLicenceAnonymousNewDocuments(
		googleRecaptcha: GoogleRecaptcha,
		documentsToSave: Array<LicenceDocumentsToSave>,
		body: WorkerLicenceAppAnonymousSubmitRequest
	) {
		let keyCode = '';

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];
		documentsToSave.forEach((docBody: LicenceDocumentsToSave) => {
			docBody.documents.forEach((doc: any) => {
				if (doc.documentUrlId) {
					existingDocumentIds.push(doc.documentUrlId);
				}
			});
		});

		return this.securityWorkerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((resp: string) => {
					keyCode = resp;

					const documentsToSaveApis: Observable<string>[] = [];
					documentsToSave.forEach((docBody: LicenceDocumentsToSave) => {
						// Only pass new documents and get a keyCode for each of those.
						const newDocumentsOnly: Array<Blob> = [];
						docBody.documents.forEach((doc: any) => {
							if (!doc.documentUrlId) {
								newDocumentsOnly.push(doc);
							}
						});

						// should always be at least one new document
						if (newDocumentsOnly.length > 0) {
							documentsToSaveApis.push(
								this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeFilesPost({
									keyCode,
									body: {
										Documents: newDocumentsOnly,
										LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
									},
								})
							);
						}
					});

					return forkJoin(documentsToSaveApis);
				}),
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = [...resps];
					// pass in the list of document ids that were in the original
					// application and are still being used
					body.previousDocumentIds = [...existingDocumentIds];

					return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeSubmitPost$Response({
						keyCode,
						body,
					});
				})
			)
			.pipe(take(1));
	}
}
