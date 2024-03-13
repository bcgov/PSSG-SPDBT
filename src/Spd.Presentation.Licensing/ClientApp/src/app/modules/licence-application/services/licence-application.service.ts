import { Injectable, SecurityContext } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {
	Alias,
	ApplicantProfileResponse,
	ApplicantUpdateRequest,
	ApplicationTypeCode,
	BusinessTypeCode,
	Document,
	GoogleRecaptcha,
	HeightUnitCode,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	WorkerCategoryTypeCode,
	WorkerLicenceAppAnonymousSubmitRequest,
	WorkerLicenceAppResponse,
	WorkerLicenceCommandResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FileUtilService } from '@app/core/services/file-util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import * as moment from 'moment';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	catchError,
	debounceTime,
	distinctUntilChanged,
	forkJoin,
	map,
	of,
	switchMap,
	take,
	tap,
} from 'rxjs';
import {
	ApplicantLicenceAppService,
	ApplicantProfileService,
	LicenceService,
	SecurityWorkerLicensingService,
} from 'src/app/api/services';
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

	photographOfYourself: string | null = null;

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
		residentialAddress: this.residentialAddressFormGroup,
		mailingAddress: this.mailingAddressFormGroup,
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
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
	});

	licenceModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private securityWorkerLicensingService: SecurityWorkerLicensingService,
		private applicantLicenceAppService: ApplicantLicenceAppService,
		private licenceService: LicenceService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private commonApplicationService: CommonApplicationService,
		private applicantProfileService: ApplicantProfileService,
		private domSanitizer: DomSanitizer
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.licenceModelChangedSubscription = this.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

					const step1Complete = this.isStepLicenceSelectionComplete();
					const step2Complete = this.isStepBackgroundComplete();
					const step3Complete = this.isStepIdentificationComplete();
					const isValid = step1Complete && step2Complete && step3Complete;

					console.debug(
						'licenceModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						this.licenceModelFormGroup.getRawValue()
					);

					this.licenceModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.initialized = false;
		this.hasValueChanged = false;
		this.photographOfYourself = null;

		this.accessCodeFormGroup.reset();
		this.consentAndDeclarationFormGroup.reset();
		this.licenceModelFormGroup.reset();

		// clear the alias data - this does not seem to get reset during a formgroup reset
		const aliasesArray = this.licenceModelFormGroup.get('aliasesData.aliases') as FormArray;
		while (aliasesArray.length) {
			aliasesArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.licenceModelFormGroup.value);
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
	isStepLicenceSelectionComplete(): boolean {
		const hasNoExpired = this.expiredLicenceFormGroup.value.hasExpiredLicence == BooleanTypeCode.No;
		const captchaFormGroup = this.expiredLicenceFormGroup.get('captchaFormGroup') as FormGroup;

		// If the user toggles the 'has expired' flag multiple times, the form is never marked as valid
		// something to do with the recaptcha not revalidating properly
		if (hasNoExpired && !captchaFormGroup.valid) {
			captchaFormGroup.reset();
		}

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

		// const isSecurityGuard = this.categorySecurityGuardFormGroup.value.isInclude;
		// (!isSecurityGuard || this.restraintsAuthorizationFormGroup.valid) &&
		// (!isSecurityGuard || this.dogsAuthorizationFormGroup.valid) &&

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
		const updateNameOrGenderChange = this.personalInformationFormGroup?.get('hasLegalNameChanged')?.value ?? false;

		if (this.authenticationService.isLoggedIn()) {
			return (
				// console.debug(
				// 	'isStepIdentificationComplete',
				// 	this.citizenshipFormGroup.valid,
				// 	this.bcDriversLicenceFormGroup.valid,
				// 	this.characteristicsFormGroup.valid,
				// 	this.photographOfYourselfFormGroup.valid,
				// );
				this.citizenshipFormGroup.valid &&
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
		// console.debug('isSaveStep', this.soleProprietorFormGroup.valid, this.soleProprietorFormGroup.value);
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

	/*************************************************************/
	// AUTHENTICATED
	/*************************************************************/

	/**
	 * Load a user profile
	 * @returns
	 */
	loadUserProfile(): Observable<any> {
		return this.applicantProfileService
			.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
			.pipe(
				switchMap((resp: ApplicantProfileResponse) => {
					return this.createEmptyLicenceAuthenticated(resp, undefined).pipe(
						tap((_resp: any) => {
							this.initialized = true;

							this.commonApplicationService.setApplicationTitle();
						})
					);
				})
			);
	}

	/**
	 * Save the licence data as is.
	 * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	 */
	saveLicenceStepAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
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

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceToResume(licenceAppId: string): Observable<WorkerLicenceAppResponse> {
		return this.loadExistingLicenceWithIdAuthenticated(licenceAppId).pipe(
			tap((_resp: any) => {
				console.debug('[getLicenceToResume] _resp', _resp);
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeData.workerLicenceTypeCode,
					_resp.applicationTypeData.applicationTypeCode
				);
			})
		);
	}

	/**
	 * Load an existing licence application with an id for the provided application type
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceWithSelectionAuthenticated(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode
	): Observable<WorkerLicenceAppResponse> {
		return this.getLicenceOfTypeAuthenticated(licenceAppId, applicationTypeCode!).pipe(
			tap((_resp: any) => {
				this.licenceModelFormGroup.patchValue({ originalApplicationId: licenceAppId }, { emitEvent: false });

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeData.workerLicenceTypeCode,
					_resp.applicationTypeData.applicationTypeCode
				);

				console.debug('[getLicenceWithSelectionAuthenticated] licenceFormGroup', this.licenceModelFormGroup.value);
			})
		);
	}

	/**
	 * Create an empty authenticated licence
	 * @returns
	 */
	createNewLicenceAuthenticated(): Observable<any> {
		return this.applicantProfileService
			.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
			.pipe(
				switchMap((resp: ApplicantProfileResponse) => {
					return this.createEmptyLicenceAuthenticated(resp, ApplicationTypeCode.New).pipe(
						tap((_resp: any) => {
							this.initialized = true;

							this.commonApplicationService.setApplicationTitle(
								WorkerLicenceTypeCode.SecurityWorkerLicence,
								ApplicationTypeCode.New
							);
						})
					);
				})
			);
	}

	/**
	 * Save the login user profile
	 * @returns
	 */
	saveLoginUserProfile(): Observable<StrictHttpResponse<string>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body: ApplicantUpdateRequest = this.getProfileSaveBody(licenceModelFormValue);
		const documentsToSave = this.getProfileDocsToSaveAnonymousBlobs(licenceModelFormValue);

		// // Get the keyCode for the existing documents to save.
		// const existingDocumentIds: Array<string> = [];
		// let newDocumentsExist = false;
		// body.documentInfos?.forEach((doc: Document) => {
		// 	if (doc.documentUrlId) {
		// 		existingDocumentIds.push(doc.documentUrlId);
		// 	} else {
		// 		newDocumentsExist = true;
		// 	}
		// });

		// delete body.documentInfos;

		// // Get the keyCode for the existing documents to save.
		// const existingDocumentIds: Array<string> = [];
		// let newDocumentsExist = false;
		// body.documentInfos?.forEach((doc: Document) => {
		// 	if (doc.documentUrlId) {
		// 		existingDocumentIds.push(doc.documentUrlId);
		// 	} else {
		// 		newDocumentsExist = true;
		// 	}
		// });

		// delete body.documentInfos;

		/*
		const documentKeyCodes: null | Array<string> = []; xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
		policeBackgroundData.attachments?.forEach((doc: any) => {
			documentKeyCodes.push(doc.documentUrlId);
		});

		mentalHealthConditionsData.attachments?.forEach((doc: any) => {
			documentKeyCodes.push(doc.documentUrlId);
		});

		

		const documentInfos: Array<Document> = [];

		policeBackgroundData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			});
		});

		mentalHealthConditionsData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition,
			});
		});






		

		const documents: Array<LicenceDocumentsToSave> = [];
		if (policeBackgroundData.isPoliceOrPeaceOfficer === BooleanTypeCode.Yes && policeBackgroundData.attachments) {
			const docs: Array<Blob> = [];
			policeBackgroundData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				documents: docs,
			});
		}

		if (mentalHealthConditionsData.isTreatedForMHC === BooleanTypeCode.Yes && mentalHealthConditionsData.attachments) {
			const docs: Array<Blob> = [];
			mentalHealthConditionsData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition, documents: docs });
		}


*/

		console.debug('[submitLicenceAnonymous] licenceModelFormValue', licenceModelFormValue);
		console.debug('[submitLicenceAnonymous] getProfileSaveBody', body);
		console.debug('[submitLicenceAnonymous] getProfileDocsToSaveAnonymousBlobs', documentsToSave);
		// console.debug('[submitLicenceAnonymous] existingDocumentIds', existingDocumentIds);
		// console.debug('[submitLicenceAnonymous] newDocumentsExist', newDocumentsExist);

		// const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		// if (newDocumentsExist) {
		// 	return this.postLicenceAnonymousNewDocuments(googleRecaptcha, existingDocumentIds, documentsToSave, body);
		// } else {
		// 	return this.postLicenceAnonymousNoNewDocuments(googleRecaptcha, existingDocumentIds, body);
		// }

		return this.applicantProfileService.apiApplicantApplicantIdPut$Response({
			applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			body,
		});
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

	private createEmptyLicenceAuthenticated(
		profile: ApplicantProfileResponse,
		applicationTypeCode: ApplicationTypeCode | undefined
	): Observable<any> {
		this.reset();

		return this.applyLicenceProfileIntoModel(profile, applicationTypeCode);
	}

	private loadExistingLicenceWithIdAuthenticated(licenceAppId: string): Observable<WorkerLicenceAppResponse> {
		this.reset();

		return forkJoin([
			this.securityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		]).pipe(
			switchMap((resps: any[]) => {
				const workerLicenceResponse = resps[0];
				const profile = resps[1];

				return this.applyLicenceAndProfileIntoModel(workerLicenceResponse, profile);
			})
		);
	}

	private applyLicenceAndProfileIntoModel(
		workerLicence: WorkerLicenceAppResponse,
		profile: ApplicantProfileResponse | null | undefined
	): Observable<any> {
		return this.applyLicenceProfileIntoModel(profile ?? workerLicence, workerLicence.applicationTypeCode).pipe(
			switchMap((_resp: any) => {
				return this.applyLicenceIntoModel(workerLicence);
			})
		);
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	private getLicenceOfTypeAuthenticated(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return this.loadExistingLicenceWithIdAuthenticated(licenceAppId).pipe(
					switchMap((_resp: any) => {
						return this.applyRenewalDataUpdatesToModel(_resp);
					})
				);
			}
			case ApplicationTypeCode.Update: {
				return this.loadExistingLicenceWithIdAuthenticated(licenceAppId).pipe(
					switchMap((_resp: any) => {
						return this.applyUpdateDataUpdatesToModel(_resp);
					})
				);
			}
			case ApplicationTypeCode.Replacement: {
				return this.loadExistingLicenceWithIdAuthenticated(licenceAppId).pipe(
					switchMap((_resp: any) => {
						return this.applyReplacementDataUpdatesToModel(_resp);
					})
				);
			}
			default: {
				return this.loadExistingLicenceWithIdAuthenticated(licenceAppId);
			}
		}
	}

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/

	/**
	 * Search for an existing licence using access code
	 * @param licenceNumber
	 * @param accessCode
	 * @param recaptchaCode
	 * @returns
	 */
	getLicenceWithAccessCodeAnonymous(
		licenceNumber: string,
		accessCode: string,
		recaptchaCode: string
	): Observable<LicenceResponse> {
		return this.licenceService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, accessCode, body: { recaptchaCode } })
			.pipe(take(1));
	}

	/**
	 * Load an existing licence application with an access code
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceWithAccessCodeDataAnonymous(
		accessCodeData: any,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		return this.getLicenceOfTypeUsingAccessCodeAnonymous(applicationTypeCode!).pipe(
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

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeData.workerLicenceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					accessCodeData.licenceNumber
				);

				console.debug('[getLicenceWithAccessCodeData] licenceFormGroup', this.licenceModelFormGroup.value);
			})
		);
	}

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewLicenceAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.getLicenceEmptyAnonymous(workerLicenceTypeCode).pipe(
			tap((resp: any) => {
				console.debug('[createNewLicenceAnonymous] resp', resp);

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(workerLicenceTypeCode);
			})
		);
	}

	private getLicenceEmptyAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		this.reset();

		const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceTypeCode };

		this.licenceModelFormGroup.patchValue(
			{
				workerLicenceTypeData,
				profileConfirmationData: { isProfileUpToDate: true },
				mentalHealthConditionsData: { hasNewMentalHealthCondition: BooleanTypeCode.Yes },
			},
			{
				emitEvent: false,
			}
		);

		return of(this.licenceModelFormGroup.value);
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	private getLicenceOfTypeUsingAccessCodeAnonymous(applicationTypeCode: ApplicationTypeCode): Observable<any> {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return forkJoin([this.loadExistingLicenceAnonymous(), this.licenceService.apiLicencesLicencePhotoGet()]).pipe(
					catchError((error) => of(error)),
					map((resps: any[]) => {
						this.setPhotographOfYourself(resps[1]);
						return resps[0];
					}),
					switchMap((_resp: any) => {
						return this.applyRenewalDataUpdatesToModel(_resp);
					})
				);
			}
			case ApplicationTypeCode.Update: {
				return forkJoin([this.loadExistingLicenceAnonymous(), this.licenceService.apiLicencesLicencePhotoGet()]).pipe(
					catchError((error) => of(error)),
					map((resps: any[]) => {
						this.setPhotographOfYourself(resps[1]);
						return resps[0];
					}),
					switchMap((_resp: any) => {
						return this.applyUpdateDataUpdatesToModel(_resp);
					})
				);
			}
			default: {
				return this.loadExistingLicenceAnonymous().pipe(
					switchMap((_resp: any) => {
						return this.applyReplacementDataUpdatesToModel(_resp);
					})
				);
			}
		}
	}

	private loadExistingLicenceAnonymous(): Observable<any> {
		this.reset();

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationGet().pipe(
			switchMap((resp: WorkerLicenceAppResponse) => {
				return this.applyLicenceAndProfileIntoModel(resp, null);
			})
		);
	}

	private setPhotographOfYourself(image: Blob | null): void {
		if (!image || image.size == 0) {
			this.photographOfYourself = null;
			return;
		}

		const objectUrl = URL.createObjectURL(image);
		this.photographOfYourself = this.domSanitizer.sanitize(
			SecurityContext.RESOURCE_URL,
			this.domSanitizer.bypassSecurityTrustResourceUrl(objectUrl)
		);
	}

	/**
	 * Submit the licence data anonymous
	 * @returns
	 */
	submitLicenceAnonymous(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body = this.getSaveBodyAnonymous(licenceModelFormValue);
		const documentsToSave = this.getDocsToSaveAnonymousBlobs(licenceModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];
		let newDocumentsExist = false;
		body.documentInfos?.forEach((doc: Document) => {
			if (doc.documentUrlId) {
				existingDocumentIds.push(doc.documentUrlId);
			} else {
				newDocumentsExist = true;
			}
		});

		delete body.documentInfos;

		console.debug('[submitLicenceAnonymous] licenceModelFormValue', licenceModelFormValue);
		console.debug('[submitLicenceAnonymous] saveBodyAnonymous', body);
		console.debug('[submitLicenceAnonymous] documentsToSave', documentsToSave);
		console.debug('[submitLicenceAnonymous] existingDocumentIds', existingDocumentIds);
		console.debug('[submitLicenceAnonymous] newDocumentsExist', newDocumentsExist);

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		if (newDocumentsExist) {
			return this.postLicenceAnonymousNewDocuments(googleRecaptcha, existingDocumentIds, documentsToSave, body);
		} else {
			return this.postLicenceAnonymousNoNewDocuments(googleRecaptcha, existingDocumentIds, body);
		}
	}

	/**
	 * Submit the licence data for replacement anonymous
	 * @returns
	 */
	submitLicenceReplacementAnonymous(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body = this.getSaveBodyAnonymous(licenceModelFormValue);
		const mailingAddress = this.mailingAddressFormGroup.getRawValue();

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];
		body.documentInfos?.forEach((doc: Document) => {
			if (doc.documentUrlId) {
				existingDocumentIds.push(doc.documentUrlId);
			}
		});

		delete body.documentInfos;

		console.debug('[submitLicenceReplacementAnonymous] licenceModelFormValue', licenceModelFormValue);
		console.debug('[submitLicenceReplacementAnonymous] saveBodyAnonymous', body);

		const googleRecaptcha = { recaptchaCode: mailingAddress.captchaFormGroup.token };
		return this.postLicenceAnonymousNoNewDocuments(googleRecaptcha, existingDocumentIds, body);
	}

	/**
	 * Post licence anonymous. This licence must not have any new documents (for example: with an update or replacement)
	 * @returns
	 */
	private postLicenceAnonymousNoNewDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		body: WorkerLicenceAppAnonymousSubmitRequest
	) {
		return this.securityWorkerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					// pass in the list of document ids that were in the original
					// application and are still being used
					body.previousDocumentIds = [...existingDocumentIds];

					return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAnonymousSubmitPost$Response({
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
		existingDocumentIds: Array<string>,
		documentsToSave: Array<LicenceDocumentsToSave>,
		body: WorkerLicenceAppAnonymousSubmitRequest
	) {
		return this.securityWorkerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
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
								this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAnonymousFilesPost({
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

					return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAnonymousSubmitPost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/*************************************************************/
	// COMMON
	/*************************************************************/

	private applyLicenceProfileIntoModel(
		profile: ApplicantProfileResponse | WorkerLicenceAppResponse,
		applicationTypeCode: ApplicationTypeCode | undefined
	): Observable<any> {
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };

		const personalInformationData = {
			givenName: profile.givenName,
			middleName1: profile.middleName1,
			middleName2: profile.middleName2,
			surname: profile.surname,
			dateOfBirth: profile.dateOfBirth,
			genderCode: profile.genderCode,
			origGivenName: profile.givenName,
			origMiddleName1: profile.middleName1,
			origMiddleName2: profile.middleName2,
			origSurname: profile.surname,
			origDateOfBirth: profile.dateOfBirth,
			origGenderCode: profile.genderCode,
		};

		const contactInformationData = {
			emailAddress: profile.emailAddress,
			phoneNumber: profile.phoneNumber,
		};

		const residentialAddress = {
			addressSelected: true,
			isMailingTheSameAsResidential: false,
			addressLine1: profile.residentialAddress?.addressLine1,
			addressLine2: profile.residentialAddress?.addressLine2,
			city: profile.residentialAddress?.city,
			country: profile.residentialAddress?.country,
			postalCode: profile.residentialAddress?.postalCode,
			province: profile.residentialAddress?.province,
		};

		const mailingAddress = {
			addressSelected: true,
			isMailingTheSameAsResidential: false,
			addressLine1: profile.mailingAddress?.addressLine1,
			addressLine2: profile.mailingAddress?.addressLine2,
			city: profile.mailingAddress?.city,
			country: profile.mailingAddress?.country,
			postalCode: profile.mailingAddress?.postalCode,
			province: profile.mailingAddress?.province,
		};

		const policeBackgroundDataAttachments: Array<File> = [];
		const mentalHealthConditionsDataAttachments: Array<File> = [];

		profile.documentInfos?.forEach((doc: Document) => {
			switch (doc.licenceDocumentTypeCode) {
				case LicenceDocumentTypeCode.MentalHealthCondition: {
					const aFile = this.fileUtilService.dummyFile(doc);
					mentalHealthConditionsDataAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict: {
					const aFile = this.fileUtilService.dummyFile(doc);
					policeBackgroundDataAttachments.push(aFile);
					break;
				}
			}
		});

		const criminalHistoryData = {
			hasCriminalHistory: this.utilService.booleanToBooleanType(profile.hasCriminalHistory),
			criminalChargeDescription: '',
		};

		if ('criminalChargeDescription' in profile) {
			criminalHistoryData.criminalChargeDescription = profile.criminalChargeDescription ?? '';
		}

		const policeBackgroundData = {
			isPoliceOrPeaceOfficer: this.utilService.booleanToBooleanType(profile.isPoliceOrPeaceOfficer),
			policeOfficerRoleCode: profile.policeOfficerRoleCode,
			otherOfficerRole: profile.otherOfficerRole,
			attachments: policeBackgroundDataAttachments,
		};

		const mentalHealthConditionsData = {
			isTreatedForMHC: this.utilService.booleanToBooleanType(profile.isTreatedForMHC),
			attachments: mentalHealthConditionsDataAttachments,
		};

		this.licenceModelFormGroup.patchValue(
			{
				applicationTypeData,
				personalInformationData: { ...personalInformationData },
				residentialAddress: { ...residentialAddress },
				mailingAddress: { ...mailingAddress },
				contactInformationData: { ...contactInformationData },
				aliasesData: {
					previousNameFlag: this.utilService.booleanToBooleanType(profile.aliases && profile.aliases.length > 0),
					aliases: [],
				},
				criminalHistoryData,
				policeBackgroundData,
				mentalHealthConditionsData,
			},
			{
				emitEvent: false,
			}
		);

		const aliasesArray = this.licenceModelFormGroup.get('aliasesData.aliases') as FormArray;
		profile.aliases?.forEach((alias: Alias) => {
			aliasesArray.push(
				new FormGroup({
					givenName: new FormControl(alias.givenName),
					middleName1: new FormControl(alias.middleName1),
					middleName2: new FormControl(alias.middleName2),
					surname: new FormControl(alias.surname, [FormControlValidators.required]),
				})
			);
		});

		console.debug('[applyLicenceProfileIntoModel] licenceModelFormGroup', this.licenceModelFormGroup.value);
		return of(this.licenceModelFormGroup.value);
	}

	private applyLicenceIntoModel(resp: WorkerLicenceAppResponse): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
		const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };
		const soleProprietorData = {
			isSoleProprietor: resp.businessTypeCode === BusinessTypeCode.None ? BooleanTypeCode.No : BooleanTypeCode.Yes,
			businessTypeCode: resp.businessTypeCode,
		};

		const expiredLicenceData = {
			hasExpiredLicence: this.utilService.booleanToBooleanType(resp.hasExpiredLicence),
			expiredLicenceNumber: resp.expiredLicenceNumber,
			expiryDate: resp.expiryDate,
			expiredLicenceId: resp.expiredLicenceId,
		};

		const licenceTermData = {
			licenceTermCode: resp.licenceTermCode,
		};

		const bcDriversLicenceData = {
			hasBcDriversLicence: this.utilService.booleanToBooleanType(resp.hasBcDriversLicence),
			bcDriversLicenceNumber: resp.bcDriversLicenceNumber,
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

		const fingerprintProofDataAttachments: Array<File> = [];
		const citizenshipDataAttachments: Array<File> = [];
		const governmentIssuedAttachments: Array<File> = [];

		const citizenshipData: {
			isCanadianCitizen: BooleanTypeCode | null;
			canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
			notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
			expiryDate: string | null;
			attachments: File[];
			governmentIssuedPhotoTypeCode: LicenceDocumentTypeCode | null;
			governmentIssuedExpiryDate: string | null;
			governmentIssuedAttachments: File[];
		} = {
			isCanadianCitizen: null,
			canadianCitizenProofTypeCode: null,
			notCanadianCitizenProofTypeCode: null,
			expiryDate: null,
			attachments: [],
			governmentIssuedPhotoTypeCode: null,
			governmentIssuedExpiryDate: null,
			governmentIssuedAttachments: [],
		};

		const photographOfYourselfAttachments: Array<File> = [];
		let photographOfYourselfLastUploadedDateTime = '';

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
				case LicenceDocumentTypeCode.Bcid:
				case LicenceDocumentTypeCode.BcServicesCard:
				case LicenceDocumentTypeCode.CanadianFirearmsLicence:
				case LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional:
				case LicenceDocumentTypeCode.DriversLicenceAdditional:
				case LicenceDocumentTypeCode.NonCanadianPassport:
				case LicenceDocumentTypeCode.GovernmentIssuedPhotoId: {
					// Additional Government ID: GovernmentIssuedPhotoIdTypes

					const aFile = this.fileUtilService.dummyFile(doc);
					governmentIssuedAttachments.push(aFile);

					citizenshipData.governmentIssuedPhotoTypeCode = doc.licenceDocumentTypeCode;
					citizenshipData.governmentIssuedExpiryDate = doc.expiryDate ?? null;
					citizenshipData.governmentIssuedAttachments = governmentIssuedAttachments;

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

					const aFile = this.fileUtilService.dummyFile(doc);
					citizenshipDataAttachments.push(aFile);

					citizenshipData.isCanadianCitizen = this.utilService.booleanToBooleanType(resp.isCanadianCitizen);
					citizenshipData.canadianCitizenProofTypeCode = resp.isCanadianCitizen ? doc.licenceDocumentTypeCode : null;
					citizenshipData.notCanadianCitizenProofTypeCode = resp.isCanadianCitizen ? null : doc.licenceDocumentTypeCode;
					citizenshipData.expiryDate = doc.expiryDate ?? null;
					citizenshipData.attachments = citizenshipDataAttachments;

					break;
				}
				case LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate: {
					const armouredCarGuardExpiryDate = this.formatDatePipe.transform(
						doc.expiryDate,
						SPD_CONSTANTS.date.backendDateFormat
					);

					const aFile = this.fileUtilService.dummyFile(doc);
					attachmentsArmouredCarGuard.push(aFile);

					categoryArmouredCarGuardFormGroup = {
						isInclude: true,
						expiryDate: armouredCarGuardExpiryDate,
						attachments: attachmentsArmouredCarGuard,
					};
					break;
				}
				case LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate: {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachments1FireInvestigator.push(aFile);

					categoryFireInvestigatorFormGroup.isInclude = true;
					categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments = attachments1FireInvestigator;
					break;
				}
				case LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter: {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachments2FireInvestigator.push(aFile);

					categoryFireInvestigatorFormGroup.isInclude = true;
					categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments = attachments2FireInvestigator;

					break;
				}
				case LicenceDocumentTypeCode.CategoryLocksmithCertificateOfQualification:
				case LicenceDocumentTypeCode.CategoryLocksmithExperienceAndApprenticeship:
				case LicenceDocumentTypeCode.CategoryLocksmithApprovedLocksmithCourse: {
					const aFile = this.fileUtilService.dummyFile(doc);
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
					const aFile = this.fileUtilService.dummyFile(doc);
					attachments1PrivateInvestigator.push(aFile);

					categoryPrivateInvestigatorFormGroup.isInclude = true;
					categoryPrivateInvestigatorFormGroup.requirementCode = doc.licenceDocumentTypeCode;
					categoryPrivateInvestigatorFormGroup.attachments = attachments1PrivateInvestigator;
					break;
				}
				case LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingRecognizedCourse:
				case LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingOtherCoursesOrKnowledge: {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachments2PrivateInvestigator.push(aFile);

					categoryPrivateInvestigatorFormGroup.isInclude = true;
					categoryPrivateInvestigatorFormGroup.trainingCode = doc.licenceDocumentTypeCode;
					categoryPrivateInvestigatorFormGroup.trainingAttachments = attachments2PrivateInvestigator;
					break;
				}
				case LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionPrivateSecurityTrainingNetworkCompletion:
				case LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionOtherCourseCompletion: {
					const aFile = this.fileUtilService.dummyFile(doc);
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
					const aFile = this.fileUtilService.dummyFile(doc);
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
					const aFile = this.fileUtilService.dummyFile(doc);
					attachments2SecurityConsultant.push(aFile);

					categorySecurityConsultantFormGroup.isInclude = true;
					categorySecurityConsultantFormGroup.requirementCode = doc.licenceDocumentTypeCode;
					categorySecurityConsultantFormGroup.attachments = attachments2SecurityConsultant;

					break;
				}
				case LicenceDocumentTypeCode.CategorySecurityConsultantResume: {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachments1SecurityConsultant.push(aFile);

					categorySecurityConsultantFormGroup.isInclude = true;
					categorySecurityConsultantFormGroup.resumeAttachments = attachments1SecurityConsultant;

					break;
				}
				case LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCertificate:
				case LicenceDocumentTypeCode.CategorySecurityGuardPoliceExperienceOrTraining:
				case LicenceDocumentTypeCode.CategorySecurityGuardBasicSecurityTrainingCourseEquivalent: {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachmentsSecurityGuard.push(aFile);

					categorySecurityGuardFormGroup = {
						isInclude: true,
						requirementCode: doc.licenceDocumentTypeCode,
						attachments: attachmentsSecurityGuard,
					};

					break;
				}
				case LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate: {
					const aFile = this.fileUtilService.dummyFile(doc);
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
					const aFile = this.fileUtilService.dummyFile(doc);
					attachmentsRestraints.push(aFile);

					restraintsAuthorizationData = {
						carryAndUseRestraints: BooleanTypeCode.Yes,
						carryAndUseRestraintsDocument: doc.licenceDocumentTypeCode,
						attachments: attachmentsRestraints,
					};

					break;
				}
				case LicenceDocumentTypeCode.PhotoOfYourself: {
					photographOfYourselfLastUploadedDateTime = doc.uploadedDateTime ?? '';
					const aFile = this.fileUtilService.dummyFile(doc);
					photographOfYourselfAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.ProofOfFingerprint: {
					const aFile = this.fileUtilService.dummyFile(doc);
					fingerprintProofDataAttachments.push(aFile);
					break;
				}
			}
		});

		const fingerprintProofData = {
			attachments: fingerprintProofDataAttachments,
		};

		const photographOfYourselfData = {
			attachments: photographOfYourselfAttachments,
			uploadedDateTime: photographOfYourselfLastUploadedDateTime,
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
				bcDriversLicenceData,
				fingerprintProofData,
				characteristicsData,
				citizenshipData,
				photographOfYourselfData,
				// profileConfirmationData: { isProfileUpToDate: true },
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

		console.debug('[applyLicenceIntoModel] licenceModelFormGroup', this.licenceModelFormGroup.value);
		return of(this.licenceModelFormGroup.value);
	}

	private applyRenewalDataUpdatesToModel(resp: any): Observable<any> {
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
		// const aliasesData = { previousNameFlag: null, aliases: [] };
		const bcDriversLicenceData = {
			hasBcDriversLicence: null,
			bcDriversLicenceNumber: null,
		};

		// If they do not have canadian citizenship, they have to show proof for renewal
		let citizenshipData = {};
		if (!resp.citizenshipData.isCanadianCitizen) {
			citizenshipData = {
				isCanadianCitizen: BooleanTypeCode.No,
				canadianCitizenProofTypeCode: null,
				notCanadianCitizenProofTypeCode: null,
				expiryDate: null,
				attachments: [],
				governmentIssuedPhotoTypeCode: null,
				governmentIssuedExpiryDate: null,
				governmentIssuedAttachments: [],
			};
		}

		const mentalHealthConditionsData = {
			isTreatedForMHC: null,
			attachments: [],
			hasPreviousMhcFormUpload: resp.mentalHealthConditionsData.isTreatedForMHC === BooleanTypeCode.Yes,
		};

		const criminalHistoryData = {
			hasCriminalHistory: null,
			criminalChargeDescription: null,
		};

		const originalPhotoOfYourselfLastUpload = resp.photographOfYourselfData.uploadedDateTime;

		// We require a new photo every 5 years. Please provide a new photo for your licence
		const yearsDiff = moment().startOf('day').diff(moment(originalPhotoOfYourselfLastUpload).startOf('day'), 'years');
		const originalPhotoOfYourselfExpired = yearsDiff >= 5 ? true : false;

		let photographOfYourselfData = {};
		if (originalPhotoOfYourselfExpired) {
			// clear out data to force user to upload a new photo
			photographOfYourselfData = {
				attachments: [],
			};
		}

		// If applicant is renewing a licence where they already had authorization to use dogs,
		// clear attachments to force user to upload a new proof of qualification.
		const originalDogAuthorizationExists = resp.dogsAuthorizationData.useDogs === BooleanTypeCode.Yes;
		let dogsAuthorizationData = {};
		if (originalDogAuthorizationExists) {
			dogsAuthorizationData = {
				useDogs: resp.dogsAuthorizationData.useDogs,
				dogsPurposeFormGroup: {
					isDogsPurposeDetectionDrugs: resp.dogsAuthorizationData.isDogsPurposeDetectionDrugs,
					isDogsPurposeDetectionExplosives: resp.dogsAuthorizationData.isDogsPurposeDetectionExplosives,
					isDogsPurposeProtection: resp.dogsAuthorizationData.isDogsPurposeProtection,
				},
				attachments: [],
			};
		}

		this.licenceModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceTermCode: resp.licenceTermData.licenceTermCode,
				originalPhotoOfYourselfExpired,
				originalDogAuthorizationExists,

				soleProprietorData,
				licenceTermData,
				fingerprintProofData,
				bcDriversLicenceData,
				photographOfYourselfData,
				citizenshipData,
				dogsAuthorizationData,
				mentalHealthConditionsData,
				criminalHistoryData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyRenewalDataUpdatesToModel] licenceModel', this.licenceModelFormGroup.value);
		return of(this.licenceModelFormGroup.value);
	}

	private applyUpdateDataUpdatesToModel(resp: any): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };

		const mentalHealthConditionsData = {
			isTreatedForMHC: null,
			attachments: [],
			hasPreviousMhcFormUpload: resp.mentalHealthConditionsData.isTreatedForMHC === BooleanTypeCode.Yes,
		};
		const criminalHistoryData = {
			hasCriminalHistory: null,
			criminalChargeDescription: null,
		};

		this.licenceModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceTermCode: resp.licenceTermData.licenceTermCode,
				mentalHealthConditionsData,
				criminalHistoryData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyUpdateDataUpdatesToModel] licenceModel', this.licenceModelFormGroup.value);
		return of(this.licenceModelFormGroup.value);
	}

	private applyReplacementDataUpdatesToModel(resp: any): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

		const residentialAddress = {
			isMailingTheSameAsResidential: false, // Mailing address validation will only show when this is false.
		};

		this.licenceModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceTermCode: resp.licenceTermData.licenceTermCode,
				residentialAddress: { ...residentialAddress },
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyReplacementDataUpdatesToModel] licenceModel', this.licenceModelFormGroup.value);
		return of(this.licenceModelFormGroup.value);
	}
}
