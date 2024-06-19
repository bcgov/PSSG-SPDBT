import { Injectable, SecurityContext } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
	Alias,
	ApplicantProfileResponse,
	ApplicantUpdateRequest,
	ApplicationTypeCode,
	BizTypeCode,
	Document,
	GoogleRecaptcha,
	HeightUnitCode,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	WorkerCategoryTypeCode,
	WorkerLicenceAppResponse,
	WorkerLicenceAppSubmitRequest,
	WorkerLicenceAppUpsertRequest,
	WorkerLicenceCommandResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { HotToastService } from '@ngneat/hot-toast';
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
import { ApplicantProfileService, LicenceService, SecurityWorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { CommonApplicationService, MainLicenceResponse } from './common-application.service';
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
		applicantId: new FormControl(null), // when authenticated, the applicant id
		caseNumber: new FormControl(null), // placeholder to save info for display purposes

		originalLicenceData: this.originalLicenceFormGroup,

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
		private router: Router,
		private securityWorkerLicensingService: SecurityWorkerLicensingService,
		private licenceService: LicenceService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private commonApplicationService: CommonApplicationService,
		private applicantProfileService: ApplicantProfileService,
		private domSanitizer: DomSanitizer,
		private hotToastService: HotToastService
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

		if (this.authenticationService.isLoggedIn()) {
			return true;
		} else {
			return (
				this.policeBackgroundFormGroup.valid &&
				this.mentalHealthConditionsFormGroup.valid &&
				this.criminalHistoryFormGroup.valid &&
				this.fingerprintProofFormGroup.valid
			);
		}
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepIdentificationComplete(): boolean {
		const updateNameOrGenderChange = this.personalInformationFormGroup?.get('hasLegalNameChanged')?.value ?? false;

		if (this.authenticationService.isLoggedIn()) {
			// console.debug(
			// 	'isStepIdentificationComplete',
			// 	this.citizenshipFormGroup.valid,
			// 	this.fingerprintProofFormGroup.valid && this.bcDriversLicenceFormGroup.valid,
			// 	this.characteristicsFormGroup.valid,
			// 	this.photographOfYourselfFormGroup.valid
			// );
			return (
				this.citizenshipFormGroup.valid &&
				this.fingerprintProofFormGroup.valid &&
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
	 * Link two applicants
	 * @returns
	 */
	linkLicenceOrPermit(licenceNumber: string, accessCode: string): Observable<StrictHttpResponse<any>> {
		const newApplicantId = this.authUserBcscService.applicantLoginProfile?.applicantId!;

		return this.licenceService.apiLicenceLookupLicenceNumberGet$Response({ licenceNumber, accessCode }).pipe(
			switchMap((resp: StrictHttpResponse<LicenceResponse>) => {
				if (resp.status != 200) {
					return of(resp);
				}

				// Licence status does not matter for the merge

				return this.applicantProfileService.apiApplicantMergeOldApplicantIdNewApplicantIdGet$Response({
					oldApplicantId: resp.body.licenceHolderId!,
					newApplicantId,
				});
			})
		);
	}

	/**
	 * Determine if the Save & Exit process can occur
	 * @returns
	 */
	isSaveAndExit(): boolean {
		if (
			!this.authenticationService.isLoggedIn() ||
			this.applicationTypeFormGroup.get('applicationTypeCode')?.value != ApplicationTypeCode.New
		) {
			return false;
		}

		return true;
	}

	/**
	 * Determine if the step data should be saved. If the data has changed and category data exists;
	 * @returns
	 */
	isAutoSave(): boolean {
		if (!this.isSaveAndExit()) {
			return false;
		}

		const shouldSaveStep = this.hasValueChanged && this.soleProprietorFormGroup.valid;
		return shouldSaveStep;
	}

	/**
	 * Partial Save - Save the licence data as is.
	 * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	 */
	partialSaveLicenceStepAuthenticated(
		isSaveAndExit?: boolean
	): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAuthenticated(licenceModelFormValue) as WorkerLicenceAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				this.hasValueChanged = false;

				let msg = 'Licence information has been saved';
				if (isSaveAndExit) {
					msg =
						'Your application has been successfully saved. Please note that inactive applications will expire in 30 days';
				}
				this.hotToastService.success(msg);

				if (!licenceModelFormValue.licenceAppId) {
					this.licenceModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
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
	 * Save the login user profile
	 * @returns
	 */
	saveLoginUserProfile(): Observable<StrictHttpResponse<string>> {
		return this.saveUserProfile();
	}

	/**
	 * Save the user profile in a flow
	 * @returns
	 */
	saveUserProfileAndContinue(applicationTypeCode: ApplicationTypeCode): Observable<StrictHttpResponse<string>> {
		return this.saveUserProfile().pipe(
			tap((_resp: StrictHttpResponse<string>) => {
				this.continueToNextStep(applicationTypeCode);
			})
		);
	}

	/**
	 * Save the user profile in a flow
	 * @returns
	 */
	private continueToNextStep(applicationTypeCode: ApplicationTypeCode): void {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						LicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_AUTHENTICATED
					)
				);
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						LicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_AUTHENTICATED
					)
				);
				break;
			}
			case ApplicationTypeCode.Update: {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED
					)
				);
				break;
			}
			default: {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						LicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED
					)
				);
				break;
			}
		}
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceToResume(licenceAppId: string): Observable<WorkerLicenceAppResponse> {
		return this.loadExistingLicenceWithIdAuthenticated(licenceAppId).pipe(
			tap((_resp: any) => {
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
		applicationTypeCode: ApplicationTypeCode,
		userLicenceInformation: MainLicenceResponse
	): Observable<WorkerLicenceAppResponse> {
		return this.getLicenceOfTypeAuthenticated(licenceAppId, applicationTypeCode!, userLicenceInformation).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeData.workerLicenceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					_resp.originalLicenceData.originalLicenceNumber
				);
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
	private saveUserProfile(): Observable<StrictHttpResponse<string>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body: ApplicantUpdateRequest = this.getProfileSaveBody(licenceModelFormValue);
		const documentsToSave = this.getProfileDocsToSaveBlobs(licenceModelFormValue);

		// Get the keyCode for the existing documents to save.
		const documentsToSaveApis: Observable<string>[] = [];

		const existingDocumentIds: Array<string> = [];

		documentsToSave?.forEach((doc: LicenceDocumentsToSave) => {
			const newDocumentsOnly: Array<Blob> = [];

			doc.documents.forEach((item: Blob) => {
				const spdFile: SpdFile = item as SpdFile;
				if (spdFile.documentUrlId) {
					existingDocumentIds.push(spdFile.documentUrlId);
				} else {
					newDocumentsOnly.push(item);
				}
			});

			if (newDocumentsOnly.length > 0) {
				documentsToSaveApis.push(
					this.applicantProfileService.apiApplicantFilesPost({
						body: {
							Documents: newDocumentsOnly,
							LicenceDocumentTypeCode: doc.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		// console.debug('[saveUserProfile] licenceModelFormValue', licenceModelFormValue);
		// console.debug('[saveUserProfile] getProfileSaveBody', body);
		// console.debug('[saveUserProfile] getProfileDocsToSaveBlobs', documentsToSave);
		// console.debug('[saveUserProfile] existingDocumentIds', existingDocumentIds);
		// console.debug('[saveUserProfile] documentsToSaveApis', documentsToSaveApis);

		if (documentsToSaveApis.length > 0) {
			return forkJoin(documentsToSaveApis).pipe(
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = [...resps];
					// pass in the list of document ids that were in the original
					// application and are still being used
					body.previousDocumentIds = [...existingDocumentIds];

					return this.applicantProfileService.apiApplicantApplicantIdPut$Response({
						applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
						body,
					});
				})
			);
		} else {
			// pass in the list of document ids that were in the original
			// application and are still being used
			body.previousDocumentIds = [...existingDocumentIds];

			return this.applicantProfileService.apiApplicantApplicantIdPut$Response({
				applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
				body,
			});
		}
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	submitLicenceNewAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAuthenticated(licenceModelFormValue) as WorkerLicenceAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsSubmitPost$Response({ body });
	}

	submitLicenceRenewalOrUpdateOrReplaceAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAuthenticated(licenceModelFormValue) as WorkerLicenceAppSubmitRequest;
		const documentsToSave = this.getDocsToSaveBlobs(licenceModelFormValue, false);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		// Create list of APIs to call for the newly added documents
		const documentsToSaveApis: Observable<string>[] = [];

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];

		documentsToSave?.forEach((doc: LicenceDocumentsToSave) => {
			const newDocumentsOnly: Array<Blob> = [];

			doc.documents.forEach((item: Blob) => {
				const spdFile: SpdFile = item as SpdFile;
				if (spdFile.documentUrlId) {
					existingDocumentIds.push(spdFile.documentUrlId);
				} else {
					newDocumentsOnly.push(item);
				}
			});

			if (newDocumentsOnly.length > 0) {
				documentsToSaveApis.push(
					this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAuthenticatedFilesPost({
						body: {
							Documents: newDocumentsOnly,
							LicenceDocumentTypeCode: doc.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		// console.debug('[submitLicenceRenewalOrUpdateOrReplaceAuthenticated] body', body);
		// console.debug('[submitLicenceRenewalOrUpdateOrReplaceAuthenticated] documentsToSave', documentsToSave);
		// console.debug('[submitLicenceRenewalOrUpdateOrReplaceAuthenticated] existingDocumentIds', existingDocumentIds);

		if (documentsToSaveApis.length > 0) {
			return forkJoin(documentsToSaveApis).pipe(
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = [...resps];
					// pass in the list of document ids that were in the original
					// application and are still being used
					body.previousDocumentIds = [...existingDocumentIds];

					return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response({
						body,
					});
				})
			);
		} else {
			// pass in the list of document ids that were in the original
			// application and are still being used
			body.previousDocumentIds = [...existingDocumentIds];

			return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response({
				body,
			});
		}
	}

	private createEmptyLicenceAuthenticated(
		profile: ApplicantProfileResponse,
		applicationTypeCode: ApplicationTypeCode | undefined
	): Observable<any> {
		this.reset();

		return this.applyLicenceProfileIntoModel(profile, applicationTypeCode);
	}

	private loadExistingLicenceWithIdAuthenticated(
		licenceAppId: string,
		userLicenceInformation?: MainLicenceResponse
	): Observable<any> {
		this.reset();

		const apis: Observable<any>[] = [
			this.securityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const workerLicenceResponse = resps[0];
				const profileResponse = resps[1];

				if (workerLicenceResponse.expiredLicenceId) {
					return this.licenceService
						.apiLicencesLicenceIdGet({ licenceId: workerLicenceResponse.expiredLicenceId })
						.pipe(
							switchMap((licenceResponse: LicenceResponse) => {
								return this.applyLicenceAndProfileIntoModel(
									workerLicenceResponse,
									profileResponse,
									userLicenceInformation,
									licenceResponse
								);
							})
						);
				} else {
					return this.applyLicenceAndProfileIntoModel(workerLicenceResponse, profileResponse, userLicenceInformation);
				}
			})
		);
	}

	private applyLicenceAndProfileIntoModel(
		workerLicenceApplication: WorkerLicenceAppResponse,
		profile: ApplicantProfileResponse | null | undefined,
		userLicenceInformation?: MainLicenceResponse,
		expiredLicenceInformation?: LicenceResponse
	): Observable<any> {
		return this.applyLicenceProfileIntoModel(
			profile ?? workerLicenceApplication,
			workerLicenceApplication.applicationTypeCode,
			userLicenceInformation
		).pipe(
			switchMap((_resp: any) => {
				return this.applyLicenceIntoModel(workerLicenceApplication, expiredLicenceInformation);
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
		applicationTypeCode: ApplicationTypeCode,
		userLicenceInformation: MainLicenceResponse
	): Observable<any> {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Update: {
				return forkJoin([
					this.loadExistingLicenceWithIdAuthenticated(licenceAppId, userLicenceInformation),
					this.licenceService.apiLicencesLicencePhotoLicenceIdGet({ licenceId: userLicenceInformation?.licenceId! }),
				]).pipe(
					catchError((error) => of(error)),
					map((resps: any[]) => {
						this.setPhotographOfYourself(resps[1]);
						return resps[0];
					}),
					switchMap((_resp: any) => {
						if (applicationTypeCode === ApplicationTypeCode.Renewal) {
							return this.applyRenewalDataUpdatesToModel(_resp, true);
						}

						return this.applyUpdateDataUpdatesToModel(_resp);
					})
				);
			}
			default: {
				// ApplicationTypeCode.Replacement
				return this.loadExistingLicenceWithIdAuthenticated(licenceAppId, userLicenceInformation).pipe(
					switchMap((_resp: any) => {
						return this.applyReplacementDataUpdatesToModel(_resp);
					})
				);
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
				const personalInformationData = { ..._resp.personalInformationData };

				personalInformationData.cardHolderName = accessCodeData.linkedCardHolderName;
				personalInformationData.licenceHolderName = accessCodeData.linkedLicenceHolderName;

				const originalLicenceData = {
					originalApplicationId: accessCodeData.linkedLicenceAppId,
					originalLicenceId: accessCodeData.linkedLicenceId,
					originalLicenceNumber: accessCodeData.licenceNumber,
					originalExpiryDate: accessCodeData.linkedExpiryDate,
					originalLicenceTermCode: accessCodeData.linkedLicenceTermCode,
				};

				this.licenceModelFormGroup.patchValue(
					{
						originalLicenceData,
						personalInformationData,
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
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(workerLicenceTypeCode);
			})
		);
	}

	private getLicenceEmptyAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		this.reset();

		this.licenceModelFormGroup.patchValue(
			{
				workerLicenceTypeData: { workerLicenceTypeCode: workerLicenceTypeCode },
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
			case ApplicationTypeCode.Renewal:
			case ApplicationTypeCode.Update: {
				return forkJoin([this.loadExistingLicenceAnonymous(), this.licenceService.apiLicencesLicencePhotoGet()]).pipe(
					catchError((error) => of(error)),
					map((resps: any[]) => {
						this.setPhotographOfYourself(resps[1]);
						return resps[0];
					}),
					switchMap((_resp: any) => {
						if (applicationTypeCode === ApplicationTypeCode.Renewal) {
							return this.applyRenewalDataUpdatesToModel(_resp, false);
						}

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
		const [body, documentInfos] = this.getSaveBodyBaseAnonymous(licenceModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(licenceModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

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

		const existingDocumentIds: Array<string> = documentInfos
			.filter((item: Document) => !!item.documentUrlId)
			.map((item: Document) => item.documentUrlId!);

		// console.debug('[submitLicenceAnonymous] licenceModelFormValue', licenceModelFormValue);
		// console.debug('[submitLicenceAnonymous] body', body);
		// console.debug('[submitLicenceAnonymous] documentsToSave', documentsToSave);
		// console.debug('[submitLicenceAnonymous] existingDocumentIds', existingDocumentIds);
		// console.debug('[submitLicenceAnonymous] documentsToSaveApis', documentsToSaveApis);

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.postLicenceAnonymousDocuments(
			googleRecaptcha,
			existingDocumentIds,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	/**
	 * Submit the licence data for replacement anonymous
	 * @returns
	 */
	submitLicenceReplacementAnonymous(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.licenceModelFormGroup.getRawValue();
		const [body, documentInfos] = this.getSaveBodyBaseAnonymous(licenceModelFormValue);
		const mailingAddress = this.mailingAddressFormGroup.getRawValue();

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];
		documentInfos?.forEach((doc: Document) => {
			if (doc.documentUrlId) {
				existingDocumentIds.push(doc.documentUrlId);
			}
		});

		// console.debug('[submitLicenceReplacementAnonymous] licenceModelFormValue', licenceModelFormValue);
		// console.debug('[submitLicenceReplacementAnonymous] saveBodyAnonymous', body);

		const googleRecaptcha = { recaptchaCode: mailingAddress.captchaFormGroup.token };
		return this.postLicenceAnonymousDocuments(googleRecaptcha, existingDocumentIds, null, body);
	}

	/**
	 * Post licence documents anonymous.
	 * @returns
	 */
	private postLicenceAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSaveApis: Observable<string>[] | null,
		body: WorkerLicenceAppSubmitRequest
	) {
		if (documentsToSaveApis) {
			return this.securityWorkerLicensingService
				.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
				.pipe(
					switchMap((_resp: IActionResult) => {
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
		} else {
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
	}

	/*************************************************************/
	// COMMON
	/*************************************************************/

	private applyLicenceProfileIntoModel(
		profile: ApplicantProfileResponse | WorkerLicenceAppResponse,
		applicationTypeCode: ApplicationTypeCode | undefined,
		userLicenceInformation?: MainLicenceResponse
	): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };

		const personalInformationData = {
			givenName: profile.givenName,
			middleName1: profile.middleName1,
			middleName2: profile.middleName2,
			surname: profile.surname,
			dateOfBirth: profile.dateOfBirth,
			genderCode: profile.genderCode,
			hasGenderChanged: false,
			hasBcscNameChanged: userLicenceInformation?.hasLoginNameChanged === true ? true : false,
			origGivenName: profile.givenName,
			origMiddleName1: profile.middleName1,
			origMiddleName2: profile.middleName2,
			origSurname: profile.surname,
			origDateOfBirth: profile.dateOfBirth,
			origGenderCode: profile.genderCode,
			cardHolderName: userLicenceInformation?.cardHolderName ?? null,
			licenceHolderName: userLicenceInformation?.licenceHolderName ?? null,
		};

		const originalLicenceData = {
			originalApplicationId: userLicenceInformation?.licenceAppId ?? null,
			originalLicenceId: userLicenceInformation?.licenceId ?? null,
			originalLicenceNumber: userLicenceInformation?.licenceNumber ?? null,
			originalExpiryDate: userLicenceInformation?.licenceExpiryDate ?? null,
			originalLicenceTermCode: userLicenceInformation?.licenceTermCode ?? null,
			originalBizTypeCode: 'bizTypeCode' in profile ? profile.bizTypeCode : userLicenceInformation?.bizTypeCode,
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
			addressSelected: !!profile.mailingAddress,
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
				applicantId: 'applicantId' in profile ? profile.applicantId : null,
				workerLicenceTypeData,
				applicationTypeData,
				originalLicenceData,
				profileConfirmationData: { isProfileUpToDate: true },
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
					id: new FormControl(alias.id),
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

	private applyLicenceIntoModel(
		workerLicenceAppl: WorkerLicenceAppResponse,
		expiredLicenceInfo?: LicenceResponse
	): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceAppl.workerLicenceTypeCode };
		const applicationTypeData = { applicationTypeCode: workerLicenceAppl.applicationTypeCode };

		const soleProprietorData = {
			isSoleProprietor: workerLicenceAppl.bizTypeCode === BizTypeCode.None ? BooleanTypeCode.No : BooleanTypeCode.Yes,
			bizTypeCode: workerLicenceAppl.bizTypeCode,
		};

		const expiredLicenceData = {
			hasExpiredLicence: this.utilService.booleanToBooleanType(workerLicenceAppl.hasExpiredLicence),
			expiredLicenceId: expiredLicenceInfo?.licenceId,
			expiredLicenceHolderName: expiredLicenceInfo?.licenceHolderName,
			expiredLicenceNumber: expiredLicenceInfo?.licenceNumber,
			expiredLicenceExpiryDate: expiredLicenceInfo?.expiryDate,
			expiredLicenceStatusCode: expiredLicenceInfo?.licenceStatusCode,
		};

		const licenceTermData = {
			licenceTermCode: workerLicenceAppl.licenceTermCode,
		};

		const bcDriversLicenceData = {
			hasBcDriversLicence: this.utilService.booleanToBooleanType(workerLicenceAppl.hasBcDriversLicence),
			bcDriversLicenceNumber: workerLicenceAppl.bcDriversLicenceNumber,
		};

		let height = workerLicenceAppl.height ? workerLicenceAppl.height + '' : null;
		let heightInches = '';
		if (
			workerLicenceAppl.heightUnitCode == HeightUnitCode.Inches &&
			workerLicenceAppl.height &&
			workerLicenceAppl.height > 0
		) {
			height = Math.trunc(workerLicenceAppl.height / 12) + '';
			heightInches = (workerLicenceAppl.height % 12) + '';
		}

		const characteristicsData = {
			hairColourCode: workerLicenceAppl.hairColourCode,
			eyeColourCode: workerLicenceAppl.eyeColourCode,
			height,
			heightUnitCode: workerLicenceAppl.heightUnitCode,
			heightInches,
			weight: workerLicenceAppl.weight ? workerLicenceAppl.weight + '' : null,
			weightUnitCode: workerLicenceAppl.weightUnitCode,
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

		workerLicenceAppl.categoryCodes?.forEach((category: WorkerCategoryTypeCode) => {
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

		workerLicenceAppl.documentInfos?.forEach((doc: Document) => {
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

					citizenshipData.isCanadianCitizen = this.utilService.booleanToBooleanType(
						workerLicenceAppl.isCanadianCitizen
					);
					citizenshipData.canadianCitizenProofTypeCode = workerLicenceAppl.isCanadianCitizen
						? doc.licenceDocumentTypeCode
						: null;
					citizenshipData.notCanadianCitizenProofTypeCode = workerLicenceAppl.isCanadianCitizen
						? null
						: doc.licenceDocumentTypeCode;
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
							isDogsPurposeDetectionDrugs: workerLicenceAppl.isDogsPurposeDetectionDrugs,
							isDogsPurposeDetectionExplosives: workerLicenceAppl.isDogsPurposeDetectionExplosives,
							isDogsPurposeProtection: workerLicenceAppl.isDogsPurposeProtection,
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
			updatePhoto: null,
			updateAttachments: [],
		};

		this.licenceModelFormGroup.patchValue(
			{
				licenceAppId: workerLicenceAppl.licenceAppId,
				caseNumber: workerLicenceAppl.caseNumber,
				applicationPortalStatus: workerLicenceAppl.applicationPortalStatus,
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

	private applyRenewalDataUpdatesToModel(resp: any, isAuthenticated: boolean): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		// Remove data that should be re-prompted for
		const soleProprietorData = {
			isSoleProprietor: null,
			bizTypeCode: null,
		};
		const licenceTermData = {
			licenceTermCode: null,
		};

		// If they do not have canadian citizenship, they have to show proof for renewal
		let citizenshipData = {};
		const isCanadianCitizen = resp.citizenshipData.isCanadianCitizen === BooleanTypeCode.Yes;
		if (!isCanadianCitizen) {
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

		const policeBackgroundData = {
			isPoliceOrPeaceOfficer: null,
			policeOfficerRoleCode: null,
			otherOfficerRole: null,
			attachments: [],
		};

		const criminalHistoryData = {
			hasCriminalHistory: null,
			criminalChargeDescription: null,
		};

		const originalLicenceData = resp.originalLicenceData;
		originalLicenceData.originalLicenceTermCode = resp.licenceTermData.licenceTermCode;

		const photographOfYourselfData = { ...resp.photographOfYourselfData };
		originalLicenceData.originalPhotoOfYourselfExpired = false;

		if (resp.photographOfYourselfData.uploadedDateTime) {
			const originalPhotoOfYourselfLastUpload = moment(resp.photographOfYourselfData.uploadedDateTime).startOf('day');

			// We require a new photo every 5 years. Please provide a new photo for your licence
			const today = moment().startOf('day');
			const yearsDiff = today.diff(originalPhotoOfYourselfLastUpload, 'years');
			originalLicenceData.originalPhotoOfYourselfExpired = yearsDiff >= 5;

			if (originalLicenceData.originalPhotoOfYourselfExpired) {
				// set flag - user will be updating their photo
				photographOfYourselfData.updatePhoto = BooleanTypeCode.Yes;
			}
		}

		// If applicant is renewing a licence where they already had authorization to use dogs,
		// clear attachments to force user to upload a new proof of qualification.
		originalLicenceData.originalDogAuthorizationExists = resp.dogsAuthorizationData.useDogs === BooleanTypeCode.Yes;
		const dogsPurposeFormGroup = resp.dogsAuthorizationData.dogsPurposeFormGroup;
		let dogsAuthorizationData = {};
		if (originalLicenceData.originalDogAuthorizationExists) {
			dogsAuthorizationData = {
				useDogs: resp.dogsAuthorizationData.useDogs,
				dogsPurposeFormGroup: {
					isDogsPurposeDetectionDrugs: dogsPurposeFormGroup.isDogsPurposeDetectionDrugs,
					isDogsPurposeDetectionExplosives: dogsPurposeFormGroup.isDogsPurposeDetectionExplosives,
					isDogsPurposeProtection: dogsPurposeFormGroup.isDogsPurposeProtection,
				},
				attachments: [],
			};
		}

		this.licenceModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				profileConfirmationData: { isProfileUpToDate: false },
				originalLicenceData,

				soleProprietorData,
				licenceTermData,
				fingerprintProofData: isAuthenticated ? {} : { attachments: [] },
				photographOfYourselfData,
				citizenshipData,
				dogsAuthorizationData,
				mentalHealthConditionsData,
				policeBackgroundData,
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

		const originalLicenceData = resp.originalLicenceData;
		originalLicenceData.originalLicenceTermCode = resp.licenceTermData.licenceTermCode;

		const mentalHealthConditionsData = {
			isTreatedForMHC: null,
			attachments: [],
			hasPreviousMhcFormUpload: resp.mentalHealthConditionsData.isTreatedForMHC === BooleanTypeCode.Yes,
		};

		const policeBackgroundData = {
			isPoliceOrPeaceOfficer: null,
			policeOfficerRoleCode: null,
			otherOfficerRole: null,
			attachments: [],
		};

		const criminalHistoryData = {
			hasCriminalHistory: null,
			criminalChargeDescription: null,
		};

		this.licenceModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceData,
				profileConfirmationData: { isProfileUpToDate: false },
				mentalHealthConditionsData,
				policeBackgroundData,
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

		const originalLicenceData = resp.originalLicenceData;
		originalLicenceData.originalLicenceTermCode = resp.licenceTermData.licenceTermCode;

		const residentialAddress = {
			isMailingTheSameAsResidential: false, // Mailing address validation will only show when this is false.
		};

		this.licenceModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceData,
				profileConfirmationData: { isProfileUpToDate: false },
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
