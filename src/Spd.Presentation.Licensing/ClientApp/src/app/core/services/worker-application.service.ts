import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
	ServiceTypeCode,
	WeightUnitCode,
	WorkerCategoryTypeCode,
	WorkerLicenceAppResponse,
	WorkerLicenceAppSubmitRequest,
	WorkerLicenceCommandResponse,
} from '@app/api/models';
import {
	ApplicantProfileService,
	LicenceAppDocumentService,
	LicenceService,
	SecurityWorkerLicensingService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	catchError,
	debounceTime,
	distinctUntilChanged,
	forkJoin,
	of,
	switchMap,
	take,
	tap,
} from 'rxjs';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { AuthenticationService } from './authentication.service';
import { CommonApplicationService, MainLicenceResponse } from './common-application.service';
import { ConfigService } from './config.service';
import { FileUtilService, SpdFile } from './file-util.service';
import { LicenceDocumentsToSave, UtilService } from './util.service';
import { WorkerApplicationHelper } from './worker-application.helper';

export interface LicenceResponseExt extends LicenceResponse {
	inProgressApplications: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class WorkerApplicationService extends WorkerApplicationHelper {
	workerModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	workerModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(),
		applicantId: new FormControl(), // when authenticated, the applicant id
		caseNumber: new FormControl(), // placeholder to save info for display purposes
		latestApplicationId: new FormControl(), // placeholder for id
		isPreviouslyTreatedForMHC: new FormControl(''), // used to determine label to display

		soleProprietorBizAppId: new FormControl(), // placeholder for Simultaneous flow
		isSoleProprietorSimultaneousFlow: new FormControl(), // placeholder for Simultaneous flow

		originalLicenceData: this.originalLicenceFormGroup,

		personalInformationData: this.personalInformationFormGroup,
		aliasesData: this.aliasesFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
		profileConfirmationData: this.profileConfirmationFormGroup,

		serviceTypeData: this.serviceTypeFormGroup,
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

	workerModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private router: Router,
		private securityWorkerLicensingService: SecurityWorkerLicensingService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private licenceService: LicenceService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private commonApplicationService: CommonApplicationService,
		private applicantProfileService: ApplicantProfileService
	) {
		super(formBuilder, configService, utilService, fileUtilService);

		this.workerModelChangedSubscription = this.workerModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepLicenceSelectionComplete();
					const step2Complete = this.isStepBackgroundComplete();
					const step3Complete = this.isStepIdentificationComplete();
					const isValid = step1Complete && step2Complete && step3Complete;

					console.debug(
						'workerModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						this.workerModelFormGroup.getRawValue()
					);

					const isSoleProprietorYesNo = this.workerModelFormGroup.get('soleProprietorData.isSoleProprietor')?.value;
					const bizTypeCode = this.workerModelFormGroup.get('soleProprietorData.bizTypeCode')?.value;
					if (isSoleProprietorYesNo === BooleanTypeCode.No && bizTypeCode) {
						// if the sole proprietor flag is 'No', then empty the bizTypeCode. This is not user selected.
						const soleProprietorData = {
							isSoleProprietor: isSoleProprietorYesNo,
							bizTypeCode: null,
						};

						this.workerModelFormGroup.patchValue(
							{
								soleProprietorData,
							},
							{ emitEvent: false }
						);
					}

					this.updateModelChangeFlags();

					this.workerModelValueChanges$.next(isValid);
				}
			});
	}

	getIsPreviouslyTreatedForMHC(): boolean {
		return !!this.workerModelFormGroup.get('isPreviouslyTreatedForMHC')?.value;
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.workerModelFormGroup.reset();

		// clear the alias data - this does not seem to get reset during a formgroup reset
		const aliasesArray = this.workerModelFormGroup.get('aliasesData.aliases') as FormArray;
		while (aliasesArray.length) {
			aliasesArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.workerModelFormGroup.value);
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
		return this.licenceAppDocumentService.apiLicenceApplicationDocumentsLicenceAppIdFilesPost$Response({
			licenceAppId: this.workerModelFormGroup.get('licenceAppId')?.value,
			body: {
				documents: [document],
				licenceDocumentTypeCode: documentCode,
			},
		});
	}

	/**
	 * When uploading a file, set the value as changed, and perform the upload
	 * @returns
	 */
	fileUploaded(
		documentCode: LicenceDocumentTypeCode, // type of the document
		document: File,
		attachments: FormControl, // the FormControl containing the documents
		fileUploadComponent: FileUploadComponent // the associated fileUploadComponent on the screen.
	) {
		this.hasValueChanged = true;

		if (!this.isAutoSave()) return;

		this.addUploadDocument(documentCode, document).subscribe({
			next: (resp: any) => {
				const matchingFile = attachments.value.find((item: File) => item.name == document.name);
				matchingFile.documentUrlId = resp.body[0].documentUrlId;
			},
			error: (error: any) => {
				console.log('An error occurred during file upload', error);

				fileUploadComponent.removeFailedFile(document);
			},
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

		const isSecurityGuard = this.categorySecurityGuardFormGroup.value.isInclude;

		return (
			this.soleProprietorFormGroup.valid &&
			this.expiredLicenceFormGroup.valid &&
			this.licenceTermFormGroup.valid &&
			(!isSecurityGuard || this.restraintsAuthorizationFormGroup.valid) &&
			(!isSecurityGuard || this.dogsAuthorizationFormGroup.valid) &&
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
	isStepBackgroundComplete(includeFingerprints: boolean = true): boolean {
		// console.debug(
		// 	'isStepBackgroundComplete',
		// 	this.policeBackgroundFormGroup.valid,
		// 	this.mentalHealthConditionsFormGroup.valid,
		// 	this.criminalHistoryFormGroup.valid,
		// 	this.fingerprintProofFormGroup.valid
		// );
		const isValid =
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid &&
			this.criminalHistoryFormGroup.valid;

		if (includeFingerprints) {
			return isValid && this.fingerprintProofFormGroup.valid;
		}

		return isValid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepIdentificationComplete(): boolean {
		const applicationTypeCode = this.applicationTypeFormGroup.get('applicationTypeCode')?.value;
		let isCitizenshipStepValid = false;

		if (applicationTypeCode == ApplicationTypeCode.Renewal) {
			const citizenshipFormValue = this.citizenshipFormGroup.value;
			const showCitizenshipStep =
				!!citizenshipFormValue.showFullCitizenshipQuestion || !!citizenshipFormValue.showNonCanadianCitizenshipQuestion;
			isCitizenshipStepValid = showCitizenshipStep ? this.citizenshipFormGroup.valid : true;
		} else if (applicationTypeCode == ApplicationTypeCode.Update) {
			isCitizenshipStepValid = true;
		} else {
			isCitizenshipStepValid = this.citizenshipFormGroup.valid;
		}

		if (this.authenticationService.isLoggedIn()) {
			// console.debug(
			// 	'isStepIdentificationComplete',
			// 	isCitizenshipStepValid,
			// 	this.fingerprintProofFormGroup.valid && this.bcDriversLicenceFormGroup.valid,
			// 	this.characteristicsFormGroup.valid,
			// 	this.photographOfYourselfFormGroup.valid
			// );
			return (
				isCitizenshipStepValid &&
				this.bcDriversLicenceFormGroup.valid &&
				this.characteristicsFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid
			);
		} else {
			// console.debug(
			// 	'isStepIdentificationComplete',
			// 	this.personalInformationFormGroup.valid,
			// 	this.aliasesFormGroup.valid,
			// 	isCitizenshipStepValid,
			// 	this.bcDriversLicenceFormGroup.valid,
			// 	this.characteristicsFormGroup.valid,
			// 	photographOfYourselfFormGroupValid,
			// 	this.residentialAddressFormGroup.valid,
			// 	this.mailingAddressFormGroup.valid,
			// 	this.contactInformationFormGroup.valid
			// );

			return (
				this.personalInformationFormGroup.valid &&
				this.aliasesFormGroup.valid &&
				isCitizenshipStepValid &&
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
	submitNewSoleProprietorSimultaneousFlow(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.workerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseUpsertAuthenticated(licenceModelFormValue);

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsPost$Response({ body });
	}

	/**
	 * Partial Save - Save the licence data as is.
	 * @returns StrictHttpResponse<WorkerLicenceAppUpsertRequest>
	 */
	partialSaveLicenceStepAuthenticated(
		isSaveAndExit?: boolean
	): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.workerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseUpsertAuthenticated(licenceModelFormValue);

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<WorkerLicenceCommandResponse>) => {
				this.hasValueChanged = false;

				let msg = 'Your application has been saved';
				if (isSaveAndExit) {
					msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
				}
				this.utilService.toasterSuccess(msg);

				if (!licenceModelFormValue.licenceAppId) {
					this.workerModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
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
				switchMap((applicantProfile: ApplicantProfileResponse) => {
					return this.createEmptyApplAuthenticated({
						applicantProfile,
					}).pipe(
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
					PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						PersonalLicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_AUTHENTICATED
					)
				);
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						PersonalLicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_AUTHENTICATED
					)
				);
				break;
			}
			case ApplicationTypeCode.Update: {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						PersonalLicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED
					)
				);
				break;
			}
			default: {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.pathSecurityWorkerLicenceAuthenticated(
						PersonalLicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED
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
	getWorkerLicenceToResume(licenceAppId: string): Observable<WorkerLicenceAppResponse> {
		return this.loadPartialApplWithIdAuthenticated(licenceAppId).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
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
		applicationTypeCode: ApplicationTypeCode,
		associatedLicence: MainLicenceResponse
	): Observable<WorkerLicenceAppResponse> {
		return this.getLicenceOfTypeAuthenticated(applicationTypeCode, associatedLicence).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
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
	createNewLicenceAuthenticated(previousExpiredLicence: MainLicenceResponse | undefined): Observable<any> {
		return this.applicantProfileService
			.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
			.pipe(
				switchMap((applicantProfile: ApplicantProfileResponse) => {
					return this.createEmptyApplAuthenticated({
						applicantProfile,
						applicationTypeCode: ApplicationTypeCode.New,
						previousExpiredLicence,
					}).pipe(
						tap((_resp: any) => {
							this.initialized = true;
							this.commonApplicationService.setApplicationTitle(
								ServiceTypeCode.SecurityWorkerLicence,
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
		const licenceModelFormValue = this.workerModelFormGroup.getRawValue();
		const body: ApplicantUpdateRequest = this.getProfileSaveBody(licenceModelFormValue);

		return this.applicantProfileService.apiApplicantApplicantIdPut$Response({
			applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			body,
		});
		// }
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	submitLicenceNewAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.workerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseUpsertAuthenticated(licenceModelFormValue);

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsSubmitPost$Response({ body }).pipe(
			tap((_resp: any) => {
				this.reset();
			})
		);
	}

	submitLicenceChangeAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.workerModelFormGroup.getRawValue();
		const bodyUpsert = this.getSaveBodyBaseSubmitAuthenticated(licenceModelFormValue) as any;
		delete bodyUpsert.documentInfos;

		const body = bodyUpsert as WorkerLicenceAppSubmitRequest;

		const documentsToSave = this.getDocsToSaveBlobs(licenceModelFormValue);

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
					this.licenceAppDocumentService.apiLicenceApplicationDocumentsFilesPost({
						body: {
							documents: newDocumentsOnly,
							licenceDocumentTypeCode: doc.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

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

	private createEmptyApplAuthenticated({
		applicantProfile,
		applicationTypeCode,
		previousExpiredLicence,
	}: {
		applicantProfile: ApplicantProfileResponse;
		applicationTypeCode?: ApplicationTypeCode | undefined;
		previousExpiredLicence?: MainLicenceResponse | undefined;
	}): Observable<any> {
		this.reset();

		return this.applyProfileIntoModel({
			workerLicenceAppl: null,
			applicantProfile,
			applicationTypeCode,
			previousExpiredLicence,
		});
	}

	private loadPartialApplWithIdAuthenticated(licenceAppId: string): Observable<any> {
		this.reset();

		const apis: Observable<any>[] = [
			this.securityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const workerLicenceAppl = resps[0];
				const applicantProfile = resps[1];

				return this.loadLicenceApplAndProfile({ workerLicenceAppl, applicantProfile }).pipe(
					tap((_resp: any) => {
						// when resuming, populate the model with existing data for police, mhc and criminal history data
						const policeBackgroundDataAttachments: Array<File> = [];
						const mentalHealthConditionsDataAttachments: Array<File> = [];

						workerLicenceAppl.documentInfos?.forEach((doc: Document) => {
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
							hasCriminalHistory: this.utilService.booleanToBooleanType(workerLicenceAppl.hasCriminalHistory),
							criminalChargeDescription: '',
						};

						const policeBackgroundData = {
							isPoliceOrPeaceOfficer: this.utilService.booleanToBooleanType(workerLicenceAppl.isPoliceOrPeaceOfficer),
							policeOfficerRoleCode: workerLicenceAppl.policeOfficerRoleCode,
							otherOfficerRole: workerLicenceAppl.otherOfficerRole,
							attachments: policeBackgroundDataAttachments,
						};

						const mentalHealthConditionsData = {
							isTreatedForMHC: this.utilService.booleanToBooleanType(workerLicenceAppl.isTreatedForMHC),
							attachments: mentalHealthConditionsDataAttachments,
						};

						this.workerModelFormGroup.patchValue(
							{
								criminalHistoryData,
								policeBackgroundData,
								mentalHealthConditionsData,
							},
							{
								emitEvent: false,
							}
						);
					})
				);
			})
		);
	}

	private loadLatestApplAuthenticated(applicantId: string, associatedLicence: MainLicenceResponse): Observable<any> {
		this.reset();

		const apis: Observable<any>[] = [
			this.securityWorkerLicensingService.apiApplicantsApplicantIdSwlLatestGet({ applicantId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const workerLicenceAppl = resps[0];
				const applicantProfile = resps[1];

				// remove reference to expired licence - data is only used in the Resume authenticated flow.
				workerLicenceAppl.expiredLicenceId = null;
				workerLicenceAppl.expiredLicenceNumber = null;
				workerLicenceAppl.hasExpiredLicence = false;

				return this.loadLicenceApplAndProfile({ workerLicenceAppl, applicantProfile, associatedLicence });
			})
		);
	}

	/**
	 * Loads the a worker application and profile into the worker model
	 * @returns
	 */
	private loadLicenceApplAndProfile({
		workerLicenceAppl,
		applicantProfile,
		associatedLicence,
	}: {
		workerLicenceAppl: WorkerLicenceAppResponse;
		applicantProfile: ApplicantProfileResponse;
		associatedLicence?: MainLicenceResponse;
	}) {
		if (workerLicenceAppl.expiredLicenceId) {
			return this.licenceService.apiLicencesLicenceIdGet({ licenceId: workerLicenceAppl.expiredLicenceId }).pipe(
				switchMap((expiredLicence: LicenceResponse) => {
					return this.applyApplAndProfileIntoModel(
						workerLicenceAppl,
						applicantProfile,
						associatedLicence,
						expiredLicence
					);
				})
			);
		}

		return this.applyApplAndProfileIntoModel(workerLicenceAppl, applicantProfile, associatedLicence);
	}

	private applyApplAndProfileIntoModel(
		workerLicenceAppl: WorkerLicenceAppResponse,
		applicantProfile: ApplicantProfileResponse | null | undefined,
		associatedLicence?: MainLicenceResponse,
		associatedExpiredLicence?: LicenceResponse
	): Observable<any> {
		return this.applyProfileIntoModel({
			workerLicenceAppl,
			applicantProfile,
			applicationTypeCode: workerLicenceAppl.applicationTypeCode,
			associatedLicence,
		}).pipe(
			switchMap((_resp: any) => {
				return this.applyApplIntoModel({
					workerLicenceAppl,
					associatedLicence,
					associatedExpiredLicence,
				});
			})
		);
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	private getLicenceOfTypeAuthenticated(
		applicationTypeCode: ApplicationTypeCode,
		associatedLicence: MainLicenceResponse
	): Observable<any> {
		const applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId!;

		return forkJoin([
			this.loadLatestApplAuthenticated(applicantId, associatedLicence),
			this.licenceService.apiLicencesLicencePhotoLicenceIdGet({ licenceId: associatedLicence?.licenceId! }),
		]).pipe(
			catchError((error) => of(error)),
			switchMap((resps: any[]) => {
				const latestApplication = resps[0];
				const photoOfYourself = resps[1];

				if (applicationTypeCode === ApplicationTypeCode.Replacement) {
					return this.applyReplacementSpecificDataToModel(latestApplication, associatedLicence, photoOfYourself);
				}

				if (applicationTypeCode === ApplicationTypeCode.Renewal) {
					return this.applyRenewalSpecificDataToModel(latestApplication, true, associatedLicence, photoOfYourself);
				}

				return this.applyUpdateSpecificDataToModel(latestApplication, associatedLicence, photoOfYourself);
			})
		);
	}

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/

	/**
	 * Load an existing licence application with an access code
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceWithAccessCodeDataAnonymous(
		associatedLicence: LicenceResponse,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		return this.getLicenceOfTypeUsingAccessCodeAnonymous(applicationTypeCode, associatedLicence).pipe(
			tap((_resp: any) => {
				const personalInformationData = _resp.personalInformationData;

				personalInformationData.cardHolderName = associatedLicence.nameOnCard;
				personalInformationData.licenceHolderName = associatedLicence.licenceHolderName;

				const [
					categoryArmouredCarGuardFormGroup,
					categoryBodyArmourSalesFormGroup,
					categoryClosedCircuitTelevisionInstallerFormGroup,
					categoryElectronicLockingDeviceInstallerFormGroup,
					categoryFireInvestigatorFormGroup,
					categoryLocksmithFormGroup,
					categoryLocksmithSupFormGroup,
					categoryPrivateInvestigatorFormGroup,
					categoryPrivateInvestigatorSupFormGroup,
					categorySecurityAlarmInstallerFormGroup,
					categorySecurityAlarmInstallerSupFormGroup,
					categorySecurityAlarmMonitorFormGroup,
					categorySecurityAlarmResponseFormGroup,
					categorySecurityAlarmSalesFormGroup,
					categorySecurityConsultantFormGroup,
					categorySecurityGuardFormGroup,
					categorySecurityGuardSupFormGroup,
				] = this.initializeCategoryFormGroups(associatedLicence.categoryCodes);

				this.workerModelFormGroup.patchValue(
					{
						personalInformationData,

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
					},
					{ emitEvent: false }
				);

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					associatedLicence.licenceNumber!
				);
			})
		);
	}

	/**
	 * Load an existing licence application with an access code
	 * @param licenceAppId
	 * @returns
	 */
	populateSoleProprietorSimultaneousFlowAnonymous(): Observable<any> {
		return this.getSoleProprietorSimultaneousFlowAnonymous().pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode
				);
			})
		);
	}

	private getSoleProprietorSimultaneousFlowAnonymous(): Observable<any> {
		this.reset();

		return this.securityWorkerLicensingService.apiSpWorkerLicenceApplicationGet().pipe(
			switchMap((resp: WorkerLicenceAppResponse) => {
				return this.applyApplAndProfileIntoModel(resp, null);
			})
		);
	}

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewApplAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.getApplEmptyAnonymous(serviceTypeCode).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(serviceTypeCode);
			})
		);
	}

	private getApplEmptyAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		this.reset();

		const characteristicsData = {
			hairColourCode: null,
			eyeColourCode: null,
			height: null,
			heightUnitCode: HeightUnitCode.Inches,
			heightInches: null,
			weight: null,
			weightUnitCode: WeightUnitCode.Pounds,
		};

		this.workerModelFormGroup.patchValue(
			{
				serviceTypeData: { serviceTypeCode: serviceTypeCode },
				isPreviouslyTreatedForMHC: false,
				profileConfirmationData: { isProfileUpToDate: true },
				characteristicsData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.workerModelFormGroup.value);
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	private getLicenceOfTypeUsingAccessCodeAnonymous(
		applicationTypeCode: ApplicationTypeCode,
		associatedLicence: LicenceResponse
	): Observable<any> {
		return forkJoin([
			this.loadExistingLicenceApplAnonymous(associatedLicence),
			this.licenceService.apiLicencesLicencePhotoGet(),
		]).pipe(
			catchError((error) => of(error)),
			switchMap((resps: any[]) => {
				const latestApplication = resps[0];
				const photoOfYourself = resps[1];

				if (applicationTypeCode === ApplicationTypeCode.Replacement) {
					return this.applyReplacementSpecificDataToModel(latestApplication, associatedLicence, photoOfYourself);
				}

				if (applicationTypeCode === ApplicationTypeCode.Renewal) {
					return this.applyRenewalSpecificDataToModel(latestApplication, true, associatedLicence, photoOfYourself);
				}

				return this.applyUpdateSpecificDataToModel(latestApplication, associatedLicence, photoOfYourself);
			})
		);
	}

	private loadExistingLicenceApplAnonymous(associatedLicence: LicenceResponse): Observable<any> {
		this.reset();

		const apis: Observable<any>[] = [
			this.securityWorkerLicensingService.apiWorkerLicenceApplicationGet(),
			this.applicantProfileService.apiApplicantGet(),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const workerLicenceAppl = resps[0];
				const applicantProfile = resps[1];

				return this.applyProfileIntoModel({
					workerLicenceAppl,
					applicantProfile,
					applicationTypeCode: workerLicenceAppl.applicationTypeCode,
					associatedLicence,
				}).pipe(
					switchMap((_resp: any) => {
						// remove reference to expired licence - data is only used in the Resume authenticated flow.
						workerLicenceAppl.expiredLicenceId = null;
						workerLicenceAppl.expiredLicenceNumber = null;
						workerLicenceAppl.hasExpiredLicence = false;

						return this.applyApplIntoModel({
							workerLicenceAppl,
							associatedLicence,
						});
					})
				);
			})
		);
	}

	/**
	 * Submit the licence data anonymous
	 * @returns
	 */
	submitLicenceAnonymous(): Observable<StrictHttpResponse<WorkerLicenceCommandResponse>> {
		const licenceModelFormValue = this.workerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAnonymous(licenceModelFormValue);
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
					this.licenceAppDocumentService.apiLicenceApplicationDocumentsAnonymousFilesPost({
						body: {
							documents: newDocumentsOnly,
							licenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		const existingDocumentIds: Array<string> = body.documentInfos
			.filter((item: Document) => !!item.documentUrlId)
			.map((item: Document) => item.documentUrlId!);

		delete body.documentInfos;

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
		const licenceModelFormValue = this.workerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAnonymous(licenceModelFormValue);
		const mailingAddressData = this.mailingAddressFormGroup.getRawValue();

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];
		body.documentInfos?.forEach((doc: Document) => {
			if (doc.documentUrlId) {
				existingDocumentIds.push(doc.documentUrlId);
			}
		});

		delete body.documentInfos;

		const googleRecaptcha = { recaptchaCode: mailingAddressData.captchaFormGroup.token };
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
			return this.licenceAppDocumentService
				.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
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
			return this.licenceAppDocumentService
				.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
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
	private applyProfileIntoModel({
		workerLicenceAppl,
		applicantProfile,
		applicationTypeCode,
		associatedLicence,
		previousExpiredLicence,
	}: {
		workerLicenceAppl: WorkerLicenceAppResponse | null | undefined;
		applicantProfile: ApplicantProfileResponse | null | undefined;
		applicationTypeCode: ApplicationTypeCode | undefined;
		associatedLicence?: MainLicenceResponse | LicenceResponse;
		previousExpiredLicence?: MainLicenceResponse | undefined;
	}): Observable<any> {
		const serviceTypeData = { serviceTypeCode: ServiceTypeCode.SecurityWorkerLicence };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };

		let hasBcscNameChanged = false;
		if (associatedLicence && 'hasLoginNameChanged' in associatedLicence) {
			hasBcscNameChanged = associatedLicence.hasLoginNameChanged ?? false;
		}

		let expiredLicenceData: any = null;
		if (previousExpiredLicence?.licenceId) {
			expiredLicenceData = this.getExpiredLicenceData(
				this.utilService.booleanToBooleanType(true),
				previousExpiredLicence
			);
		}

		const profileData = applicantProfile ?? workerLicenceAppl;
		const personalInformationData = {
			givenName: profileData?.givenName,
			middleName1: profileData?.middleName1,
			middleName2: profileData?.middleName2,
			surname: profileData?.surname,
			dateOfBirth: profileData?.dateOfBirth,
			genderCode: profileData?.genderCode,
			hasGenderChanged: false,
			hasBcscNameChanged,
			origGivenName: profileData?.givenName,
			origMiddleName1: profileData?.middleName1,
			origMiddleName2: profileData?.middleName2,
			origSurname: profileData?.surname,
			origDateOfBirth: profileData?.dateOfBirth,
			origGenderCode: profileData?.genderCode,
			cardHolderName: associatedLicence?.nameOnCard ?? null,
			licenceHolderName: associatedLicence?.licenceHolderName ?? null,
		};

		const originalLicenceData = {
			originalApplicationId: associatedLicence?.licenceAppId ?? null,
			originalLicenceId: associatedLicence?.licenceId ?? null,
			originalLicenceNumber: associatedLicence?.licenceNumber ?? null,
			originalExpiryDate: associatedLicence?.expiryDate ?? null,
			originalLicenceTermCode: associatedLicence?.licenceTermCode ?? null,
			originalBizTypeCode: associatedLicence?.bizTypeCode,
			originalCategoryCodes: associatedLicence?.categoryCodes,
			linkedSoleProprietorExpiryDate: associatedLicence?.linkedSoleProprietorExpiryDate,
			linkedSoleProprietorLicenceId: associatedLicence?.linkedSoleProprietorLicenceId,
			originalPhotoOfYourselfExpired: null,
			originalDogAuthorizationExists: null,
			originalCarryAndUseRestraints: associatedLicence?.carryAndUseRestraints ?? null,
			originalUseDogs: associatedLicence?.useDogs ?? null,
			originalIsDogsPurposeDetectionDrugs: associatedLicence?.isDogsPurposeDetectionDrugs ?? null,
			originalIsDogsPurposeDetectionExplosives: associatedLicence?.isDogsPurposeDetectionExplosives ?? null,
			originalIsDogsPurposeProtection: associatedLicence?.isDogsPurposeProtection ?? null,
		};

		let height = profileData?.height ? profileData?.height + '' : null;
		let heightInches = '';
		if (profileData?.heightUnitCode == HeightUnitCode.Inches && profileData?.height && profileData?.height > 0) {
			height = Math.trunc(profileData?.height / 12) + '';
			heightInches = (profileData?.height % 12) + '';
		}

		const characteristicsData = {
			hairColourCode: profileData?.hairColourCode,
			eyeColourCode: profileData?.eyeColourCode,
			height,
			heightUnitCode: profileData?.heightUnitCode ?? HeightUnitCode.Inches,
			heightInches,
			weight: profileData?.weight ? profileData?.weight + '' : null,
			weightUnitCode: profileData?.weightUnitCode ?? WeightUnitCode.Pounds,
		};

		const contactInformationData = {
			emailAddress: profileData?.emailAddress,
			phoneNumber: profileData?.phoneNumber,
		};

		const residentialAddressData = {
			addressSelected: true,
			addressLine1: profileData?.residentialAddress?.addressLine1,
			addressLine2: profileData?.residentialAddress?.addressLine2,
			city: profileData?.residentialAddress?.city,
			country: profileData?.residentialAddress?.country,
			postalCode: profileData?.residentialAddress?.postalCode,
			province: profileData?.residentialAddress?.province,
		};

		const mailingAddressData = {
			addressSelected: !!profileData?.mailingAddress,
			isAddressTheSame: false,
			addressLine1: profileData?.mailingAddress?.addressLine1,
			addressLine2: profileData?.mailingAddress?.addressLine2,
			city: profileData?.mailingAddress?.city,
			country: profileData?.mailingAddress?.country,
			postalCode: profileData?.mailingAddress?.postalCode,
			province: profileData?.mailingAddress?.province,
		};

		this.workerModelFormGroup.patchValue(
			{
				applicantId: profileData && 'applicantId' in profileData ? profileData.applicantId : null,
				isPreviouslyTreatedForMHC: !!profileData?.isTreatedForMHC,
				serviceTypeData,
				applicationTypeData,
				expiredLicenceData,
				originalLicenceData,
				profileConfirmationData: { isProfileUpToDate: true },
				personalInformationData,
				residentialAddressData,
				mailingAddressData,
				contactInformationData,
				aliasesData: {
					previousNameFlag: this.utilService.booleanToBooleanType(
						profileData?.aliases && profileData?.aliases.length > 0
					),
					aliases: [],
				},
				characteristicsData,
			},
			{
				emitEvent: false,
			}
		);

		const aliasesArray = this.workerModelFormGroup.get('aliasesData.aliases') as FormArray;
		profileData?.aliases?.forEach((alias: Alias) => {
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

		return of(this.workerModelFormGroup.value);
	}

	private applyApplIntoModel({
		workerLicenceAppl,
		associatedLicence,
		associatedExpiredLicence,
	}: {
		workerLicenceAppl: WorkerLicenceAppResponse;
		associatedLicence?: MainLicenceResponse | LicenceResponse;
		associatedExpiredLicence?: LicenceResponse;
	}): Observable<any> {
		const serviceTypeData = { serviceTypeCode: workerLicenceAppl.serviceTypeCode };
		const applicationTypeData = { applicationTypeCode: workerLicenceAppl.applicationTypeCode };

		let bizTypeCode = workerLicenceAppl.bizTypeCode ?? BizTypeCode.None;

		let soleProprietorData = {};

		// Check if in a simultaneous flow
		const isSoleProprietorSimultaneousFlow = this.isSimultaneousFlow(bizTypeCode, associatedLicence);
		if (isSoleProprietorSimultaneousFlow) {
			soleProprietorData = {
				isSoleProprietor: BooleanTypeCode.Yes,
				bizTypeCode,
			};
		} else {
			// Check not a simultaneous flow, clear out any bad data
			bizTypeCode = BizTypeCode.None;
			soleProprietorData = {
				isSoleProprietor: BooleanTypeCode.No,
				bizTypeCode: null,
			};
		}

		const originalLicenceData = this.originalLicenceFormGroup.value;
		originalLicenceData.originalBizTypeCode = bizTypeCode;

		const hasExpiredLicence = workerLicenceAppl.hasExpiredLicence ?? false;
		const expiredLicenceData = this.getExpiredLicenceData(
			this.utilService.booleanToBooleanType(hasExpiredLicence),
			associatedExpiredLicence
		);

		const licenceTermData = {
			licenceTermCode: workerLicenceAppl.licenceTermCode,
		};

		const bcDriversLicenceData = {
			hasBcDriversLicence: this.utilService.booleanToBooleanType(workerLicenceAppl.hasBcDriversLicence),
			bcDriversLicenceNumber: workerLicenceAppl.bcDriversLicenceNumber,
		};

		const initialCategoryData = this.initializeCategoryFormGroups(workerLicenceAppl.categoryCodes);

		let categoryArmouredCarGuardFormGroup = initialCategoryData[0];
		const categoryBodyArmourSalesFormGroup = initialCategoryData[1];
		const categoryClosedCircuitTelevisionInstallerFormGroup = initialCategoryData[2];
		const categoryElectronicLockingDeviceInstallerFormGroup = initialCategoryData[3];
		const categoryFireInvestigatorFormGroup = initialCategoryData[4];
		let categoryLocksmithFormGroup = initialCategoryData[5];
		const categoryLocksmithSupFormGroup = initialCategoryData[6];
		const categoryPrivateInvestigatorFormGroup = initialCategoryData[7];
		let categoryPrivateInvestigatorSupFormGroup = initialCategoryData[8];
		let categorySecurityAlarmInstallerFormGroup = initialCategoryData[9];
		const categorySecurityAlarmInstallerSupFormGroup = initialCategoryData[10];
		const categorySecurityAlarmMonitorFormGroup = initialCategoryData[11];
		const categorySecurityAlarmResponseFormGroup = initialCategoryData[12];
		const categorySecurityAlarmSalesFormGroup = initialCategoryData[13];
		const categorySecurityConsultantFormGroup = initialCategoryData[14];
		let categorySecurityGuardFormGroup = initialCategoryData[15];
		const categorySecurityGuardSupFormGroup = initialCategoryData[16];

		let restraintsAuthorizationData: any = {
			carryAndUseRestraints: this.utilService.booleanToBooleanType(workerLicenceAppl.carryAndUseRestraints),
			carryAndUseRestraintsDocument: null,
			attachments: [],
		};
		let dogsAuthorizationData: any = {
			useDogs: this.utilService.booleanToBooleanType(workerLicenceAppl.useDogs),
			dogsPurposeFormGroup: {
				isDogsPurposeDetectionDrugs: null,
				isDogsPurposeDetectionExplosives: null,
				isDogsPurposeProtection: null,
			},
			attachments: [],
		};

		const fingerprintProofDataAttachments: Array<File> = [];
		const citizenshipDataAttachments: Array<File> = [];
		const governmentIssuedAttachments: Array<File> = [];

		const citizenshipData: {
			isCanadianCitizen: BooleanTypeCode | null;
			canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
			notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
			expiryDate: string | null;
			documentIdNumber: string | null;
			attachments: File[];
			governmentIssuedPhotoTypeCode: LicenceDocumentTypeCode | null;
			governmentIssuedExpiryDate: string | null;
			governmentIssuedDocumentIdNumber: string | null;
			governmentIssuedAttachments: File[];
			showFullCitizenshipQuestion: boolean | null;
			showNonCanadianCitizenshipQuestion: boolean | null;
		} = {
			isCanadianCitizen: null,
			canadianCitizenProofTypeCode: null,
			notCanadianCitizenProofTypeCode: null,
			expiryDate: null,
			documentIdNumber: null,
			attachments: [],
			governmentIssuedPhotoTypeCode: null,
			governmentIssuedExpiryDate: null,
			governmentIssuedAttachments: [],
			governmentIssuedDocumentIdNumber: null,
			showFullCitizenshipQuestion: null,
			showNonCanadianCitizenshipQuestion: null,
		};

		citizenshipData.isCanadianCitizen =
			workerLicenceAppl.isCanadianCitizen === null
				? null
				: this.utilService.booleanToBooleanType(workerLicenceAppl.isCanadianCitizen);

		// In converted data, 'isCanadianCitizen' may be null so we need to handle that.
		// Renew will show full 'Is Canadian Citizen' question if this value is missing,
		// otherwise if not Canadian, ask for proof of ability to work.
		const isCanadianCitizenHasValue = !!citizenshipData.isCanadianCitizen;
		citizenshipData.showFullCitizenshipQuestion = !isCanadianCitizenHasValue;

		const isCanadianCitizen = citizenshipData.isCanadianCitizen;
		citizenshipData.showNonCanadianCitizenshipQuestion = isCanadianCitizenHasValue && !isCanadianCitizen;

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
				case LicenceDocumentTypeCode.PermanentResidentCardAdditional:
				case LicenceDocumentTypeCode.NonCanadianPassport:
				case LicenceDocumentTypeCode.GovernmentIssuedPhotoId: {
					// Additional Government ID: GovernmentIssuedPhotoIdTypes

					const aFile = this.fileUtilService.dummyFile(doc);
					governmentIssuedAttachments.push(aFile);

					citizenshipData.governmentIssuedPhotoTypeCode = doc.licenceDocumentTypeCode;
					citizenshipData.governmentIssuedExpiryDate = doc.expiryDate ?? null;
					citizenshipData.governmentIssuedDocumentIdNumber = doc.documentIdNumber ?? null;
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

					citizenshipData.canadianCitizenProofTypeCode = workerLicenceAppl.isCanadianCitizen
						? doc.licenceDocumentTypeCode
						: null;
					citizenshipData.notCanadianCitizenProofTypeCode = workerLicenceAppl.isCanadianCitizen
						? null
						: doc.licenceDocumentTypeCode;
					citizenshipData.expiryDate = doc.expiryDate ?? null;
					citizenshipData.documentIdNumber = doc.documentIdNumber ?? null;
					citizenshipData.attachments = citizenshipDataAttachments;
					break;
				}
				case LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate: {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachmentsArmouredCarGuard.push(aFile);

					categoryArmouredCarGuardFormGroup = {
						isInclude: true,
						expiryDate: this.utilService.dateToDbDate(doc.expiryDate),
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

					categoryPrivateInvestigatorFormGroup.requirementCode = doc.licenceDocumentTypeCode;
					categoryPrivateInvestigatorFormGroup.attachments = attachments1PrivateInvestigator;
					break;
				}
				case LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingRecognizedCourse:
				case LicenceDocumentTypeCode.CategoryPrivateInvestigatorTrainingOtherCoursesOrKnowledge: {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachments2PrivateInvestigator.push(aFile);

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

					categorySecurityConsultantFormGroup.requirementCode = doc.licenceDocumentTypeCode;
					categorySecurityConsultantFormGroup.attachments = attachments2SecurityConsultant;

					break;
				}
				case LicenceDocumentTypeCode.CategorySecurityConsultantResume: {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachments1SecurityConsultant.push(aFile);

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
					if (associatedLicence) {
						// use the data from the licence when it exists. See below
						break;
					}

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
					if (associatedLicence) {
						// use the data from the licence when it exists. See below
						break;
					}

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
					// If there is a photo on the licence, use that one. See below
					if (!associatedLicence?.photoDocumentInfo) {
						photographOfYourselfLastUploadedDateTime = doc.uploadedDateTime ?? '';
						const aFile = this.fileUtilService.dummyFile(doc);
						photographOfYourselfAttachments.push(aFile);
					}
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

		if (associatedLicence?.photoDocumentInfo) {
			const doc: Document = {
				documentExtension: associatedLicence?.photoDocumentInfo.documentExtension,
				documentName: associatedLicence?.photoDocumentInfo.documentName,
				documentUrlId: associatedLicence?.photoDocumentInfo.documentUrlId,
				expiryDate: associatedLicence?.photoDocumentInfo.expiryDate,
				licenceAppId: workerLicenceAppl.licenceAppId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
				uploadedDateTime: associatedLicence?.photoDocumentInfo.uploadedDateTime,
			};
			const aFile = this.fileUtilService.dummyFile(doc);
			photographOfYourselfAttachments.push(aFile);
			photographOfYourselfLastUploadedDateTime = doc.uploadedDateTime ?? '';
		}

		const photographOfYourselfData = {
			attachments: photographOfYourselfAttachments,
			uploadedDateTime: photographOfYourselfLastUploadedDateTime,
			updatePhoto: null,
			updateAttachments: [],
		};

		// If an associatedLicence exists, use the dog data from here
		if (associatedLicence?.categoryCodes?.includes(WorkerCategoryTypeCode.SecurityGuard)) {
			const useDogs = associatedLicence.useDogs;
			const useDogsYesNo = this.utilService.booleanToBooleanType(useDogs);

			if (useDogs) {
				associatedLicence.dogDocumentInfos?.forEach((doc: Document) => {
					const aFile = this.fileUtilService.dummyFile(doc);
					attachmentsDogs.push(aFile);
				});
			}

			dogsAuthorizationData = {
				useDogs: useDogsYesNo,
				dogsPurposeFormGroup: {
					isDogsPurposeDetectionDrugs: useDogs ? associatedLicence?.isDogsPurposeDetectionDrugs : null,
					isDogsPurposeDetectionExplosives: useDogs ? associatedLicence?.isDogsPurposeDetectionExplosives : null,
					isDogsPurposeProtection: useDogs ? associatedLicence?.isDogsPurposeProtection : null,
				},
				attachments: useDogs ? attachmentsDogs : [],
			};

			const carryAndUseRestraints = associatedLicence.carryAndUseRestraints;
			const carryAndUseRestraintsYesNo = this.utilService.booleanToBooleanType(carryAndUseRestraints);

			let carryAndUseRestraintsDocument: LicenceDocumentTypeCode | null = null;
			if (carryAndUseRestraints) {
				associatedLicence.restraintsDocumentInfos?.forEach((doc: Document) => {
					carryAndUseRestraintsDocument = doc.licenceDocumentTypeCode ?? null;

					const aFile = this.fileUtilService.dummyFile(doc);
					attachmentsRestraints.push(aFile);
				});
			}

			restraintsAuthorizationData = {
				carryAndUseRestraints: carryAndUseRestraintsYesNo,
				carryAndUseRestraintsDocument,
				attachments: carryAndUseRestraints ? attachmentsRestraints : [],
			};
		}

		this.workerModelFormGroup.patchValue(
			{
				licenceAppId: workerLicenceAppl.licenceAppId,
				latestApplicationId: workerLicenceAppl.licenceAppId,
				caseNumber: workerLicenceAppl.caseNumber,
				soleProprietorBizAppId: isSoleProprietorSimultaneousFlow ? workerLicenceAppl.soleProprietorBizAppId : null,
				isSoleProprietorSimultaneousFlow,
				serviceTypeData,
				applicationTypeData,
				soleProprietorData,
				expiredLicenceData,
				originalLicenceData,
				licenceTermData,
				bcDriversLicenceData,
				fingerprintProofData,
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

		return of(this.workerModelFormGroup.value);
	}

	private initializeCategoryFormGroups(categoryCodes: WorkerCategoryTypeCode[] | null | undefined): any {
		let categoryArmouredCarGuardFormGroup: any = { isInclude: false };
		let categoryBodyArmourSalesFormGroup: any = { isInclude: false };
		let categoryClosedCircuitTelevisionInstallerFormGroup: any = { isInclude: false };
		let categoryElectronicLockingDeviceInstallerFormGroup: any = { isInclude: false };
		let categoryFireInvestigatorFormGroup: any = { isInclude: false };
		let categoryLocksmithFormGroup: any = { isInclude: false };
		let categoryLocksmithSupFormGroup: any = { isInclude: false };
		let categoryPrivateInvestigatorFormGroup: any = { isInclude: false };
		let categoryPrivateInvestigatorSupFormGroup: any = { isInclude: false };
		let categorySecurityAlarmInstallerFormGroup: any = { isInclude: false };
		let categorySecurityAlarmInstallerSupFormGroup: any = { isInclude: false };
		let categorySecurityAlarmMonitorFormGroup: any = { isInclude: false };
		let categorySecurityAlarmResponseFormGroup: any = { isInclude: false };
		let categorySecurityAlarmSalesFormGroup: any = { isInclude: false };
		let categorySecurityConsultantFormGroup: any = { isInclude: false };
		let categorySecurityGuardFormGroup: any = { isInclude: false };
		let categorySecurityGuardSupFormGroup: any = { isInclude: false };

		categoryCodes?.forEach((category: WorkerCategoryTypeCode) => {
			switch (category) {
				case WorkerCategoryTypeCode.ArmouredCarGuard:
					categoryArmouredCarGuardFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.BodyArmourSales:
					categoryBodyArmourSalesFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
					categoryClosedCircuitTelevisionInstallerFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
					categoryElectronicLockingDeviceInstallerFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.FireInvestigator:
					categoryFireInvestigatorFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.Locksmith:
					categoryLocksmithFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.LocksmithUnderSupervision:
					categoryLocksmithSupFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.PrivateInvestigator:
					categoryPrivateInvestigatorFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision:
					categoryPrivateInvestigatorSupFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.SecurityGuard:
					categorySecurityGuardFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
					categorySecurityGuardSupFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
					categorySecurityAlarmInstallerSupFormGroup = { isInclude: true, checkbox: true };
					break;
				case WorkerCategoryTypeCode.SecurityAlarmInstaller:
					categorySecurityAlarmInstallerFormGroup = { isInclude: true, checkbox: true };
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
				case WorkerCategoryTypeCode.SecurityConsultant:
					categorySecurityConsultantFormGroup = { isInclude: true, checkbox: true };
					break;
			}
		});

		return [
			categoryArmouredCarGuardFormGroup,
			categoryBodyArmourSalesFormGroup,
			categoryClosedCircuitTelevisionInstallerFormGroup,
			categoryElectronicLockingDeviceInstallerFormGroup,
			categoryFireInvestigatorFormGroup,
			categoryLocksmithFormGroup,
			categoryLocksmithSupFormGroup,
			categoryPrivateInvestigatorFormGroup,
			categoryPrivateInvestigatorSupFormGroup,
			categorySecurityAlarmInstallerFormGroup,
			categorySecurityAlarmInstallerSupFormGroup,
			categorySecurityAlarmMonitorFormGroup,
			categorySecurityAlarmResponseFormGroup,
			categorySecurityAlarmSalesFormGroup,
			categorySecurityConsultantFormGroup,
			categorySecurityGuardFormGroup,
			categorySecurityGuardSupFormGroup,
		];
	}

	private applyRenewalSpecificDataToModel(
		latestApplication: any,
		isAuthenticated: boolean,
		associatedLicence: MainLicenceResponse | LicenceResponse,
		photoOfYourself: Blob
	): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		const licenceTermData = {
			licenceTermCode: null, // Remove data that should be re-prompted for
		};

		// Check if in a simultaneous flow
		const isSoleProprietorSimultaneousFlow = this.isSimultaneousFlow(
			latestApplication.soleProprietorData.bizTypeCode,
			associatedLicence
		);

		let soleProprietorData = {};
		if (isSoleProprietorSimultaneousFlow) {
			soleProprietorData = {
				isSoleProprietor: null, // Remove data that should be re-prompted for
				bizTypeCode: latestApplication.soleProprietorData.bizTypeCode,
			};
		} else {
			soleProprietorData = {
				isSoleProprietor: BooleanTypeCode.No, // Remove data that should be re-prompted for
				bizTypeCode: null,
			};
		}

		const [
			categoryArmouredCarGuardFormGroup,
			categoryBodyArmourSalesFormGroup,
			categoryClosedCircuitTelevisionInstallerFormGroup,
			categoryElectronicLockingDeviceInstallerFormGroup,
			categoryFireInvestigatorFormGroup,
			categoryLocksmithFormGroup,
			categoryLocksmithSupFormGroup,
			categoryPrivateInvestigatorFormGroup,
			categoryPrivateInvestigatorSupFormGroup,
			categorySecurityAlarmInstallerFormGroup,
			categorySecurityAlarmInstallerSupFormGroup,
			categorySecurityAlarmMonitorFormGroup,
			categorySecurityAlarmResponseFormGroup,
			categorySecurityAlarmSalesFormGroup,
			categorySecurityConsultantFormGroup,
			categorySecurityGuardFormGroup,
			categorySecurityGuardSupFormGroup,
		] = this.initializeCategoryFormGroups(associatedLicence.categoryCodes);

		// If they do not have canadian citizenship, they have to show proof for renewal
		let citizenshipData = {};

		// In converted data, 'isCanadianCitizen' may be null so we need to handle that.
		// Renew will show full 'Is Canadian Citizen' question if this value is missing,
		// otherwise if not Canadian, ask for proof of ability to work.
		if (latestApplication.citizenshipData.isCanadianCitizen === BooleanTypeCode.No) {
			citizenshipData = {
				isCanadianCitizen: BooleanTypeCode.No,
				canadianCitizenProofTypeCode: null,
				notCanadianCitizenProofTypeCode: null,
				expiryDate: null,
				attachments: [],
				governmentIssuedPhotoTypeCode: null,
				governmentIssuedExpiryDate: null,
				governmentIssuedAttachments: [],
				showFullCitizenshipQuestion: false,
				showNonCanadianCitizenshipQuestion: true,
			};
		}

		const originalLicenceData = latestApplication.originalLicenceData;
		originalLicenceData.originalLicenceTermCode = latestApplication.licenceTermData.licenceTermCode;

		const photographOfYourselfData = latestApplication.photographOfYourselfData;

		const originalPhotoOfYourselfLastUploadDateTime = latestApplication.photographOfYourselfData.uploadedDateTime;
		originalLicenceData.originalPhotoOfYourselfExpired = this.utilService.getIsDate5YearsOrOlder(
			originalPhotoOfYourselfLastUploadDateTime
		);

		// if the photo is missing, set the flag as expired so that it is required
		if (!this.isPhotographOfYourselfEmpty(photoOfYourself)) {
			originalLicenceData.originalPhotoOfYourselfExpired = true;
		}

		if (originalLicenceData.originalPhotoOfYourselfExpired) {
			// set flag - user will be updating their photo
			photographOfYourselfData.updatePhoto = BooleanTypeCode.Yes;
		}

		// If applicant is renewing a licence where they already had authorization to use dogs,
		// clear attachments to force user to upload a new proof of qualification.
		originalLicenceData.originalDogAuthorizationExists =
			latestApplication.dogsAuthorizationData.useDogs === BooleanTypeCode.Yes;
		const dogsPurposeFormGroup = latestApplication.dogsAuthorizationData.dogsPurposeFormGroup;
		let dogsAuthorizationData = {};
		if (originalLicenceData.originalDogAuthorizationExists) {
			dogsAuthorizationData = {
				useDogs: latestApplication.dogsAuthorizationData.useDogs,
				dogsPurposeFormGroup: {
					isDogsPurposeDetectionDrugs: dogsPurposeFormGroup.isDogsPurposeDetectionDrugs,
					isDogsPurposeDetectionExplosives: dogsPurposeFormGroup.isDogsPurposeDetectionExplosives,
					isDogsPurposeProtection: dogsPurposeFormGroup.isDogsPurposeProtection,
				},
				attachments: [],
			};
		}

		// If not a simultaneous flow, clear out any bad data
		if (!isSoleProprietorSimultaneousFlow) {
			originalLicenceData.originalBizTypeCode = BizTypeCode.None;
			originalLicenceData.linkedSoleProprietorExpiryDate = null;
			originalLicenceData.linkedSoleProprietorLicenceId = null;
		}

		this.workerModelFormGroup.patchValue(
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
			},
			{
				emitEvent: false,
			}
		);

		return this.setPhotographOfYourself(photoOfYourself).pipe(
			switchMap((_resp: any) => {
				return of(this.workerModelFormGroup.value);
			})
		);
	}

	private applyUpdateSpecificDataToModel(
		latestApplication: any,
		associatedLicence: MainLicenceResponse | LicenceResponse,
		photoOfYourself: Blob
	): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };
		const originalLicenceData = latestApplication.originalLicenceData;
		const photographOfYourselfData = latestApplication.photographOfYourselfData;

		originalLicenceData.originalLicenceTermCode = latestApplication.licenceTermData.licenceTermCode;

		// if the photo is missing, set the flag as expired so that it is required
		if (!this.isPhotographOfYourselfEmpty(photoOfYourself)) {
			originalLicenceData.originalPhotoOfYourselfExpired = true;
		}

		if (originalLicenceData.originalPhotoOfYourselfExpired) {
			// set flag - user will be updating their photo
			photographOfYourselfData.updatePhoto = BooleanTypeCode.Yes;
		}

		// Check if in a simultaneous flow
		const isSoleProprietorSimultaneousFlow = this.isSimultaneousFlow(
			latestApplication.soleProprietorData.bizTypeCode,
			associatedLicence
		);

		let soleProprietorData = {};
		if (isSoleProprietorSimultaneousFlow) {
			soleProprietorData = {
				isSoleProprietor: BooleanTypeCode.Yes,
				bizTypeCode: latestApplication.soleProprietorData.bizTypeCode,
			};
		} else {
			// If not a simultaneous flow, clear out any bad data
			originalLicenceData.originalBizTypeCode = BizTypeCode.None;
			originalLicenceData.linkedSoleProprietorExpiryDate = null;
			originalLicenceData.linkedSoleProprietorLicenceId = null;

			soleProprietorData = {
				isSoleProprietor: BooleanTypeCode.No,
				bizTypeCode: null,
			};
		}

		const mentalHealthConditionsData = {
			isTreatedForMHC: null,
			attachments: [],
		};

		const [
			categoryArmouredCarGuardFormGroup,
			categoryBodyArmourSalesFormGroup,
			categoryClosedCircuitTelevisionInstallerFormGroup,
			categoryElectronicLockingDeviceInstallerFormGroup,
			categoryFireInvestigatorFormGroup,
			categoryLocksmithFormGroup,
			categoryLocksmithSupFormGroup,
			categoryPrivateInvestigatorFormGroup,
			categoryPrivateInvestigatorSupFormGroup,
			categorySecurityAlarmInstallerFormGroup,
			categorySecurityAlarmInstallerSupFormGroup,
			categorySecurityAlarmMonitorFormGroup,
			categorySecurityAlarmResponseFormGroup,
			categorySecurityAlarmSalesFormGroup,
			categorySecurityConsultantFormGroup,
			categorySecurityGuardFormGroup,
			categorySecurityGuardSupFormGroup,
		] = this.initializeCategoryFormGroups(associatedLicence.categoryCodes);

		const policeBackgroundData = {
			isPoliceOrPeaceOfficer: null,
			policeOfficerRoleCode: null,
			otherOfficerRole: null,
			attachments: [],
		};

		this.workerModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceData,
				profileConfirmationData: { isProfileUpToDate: false },
				mentalHealthConditionsData,
				policeBackgroundData,
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
				soleProprietorData,
			},
			{
				emitEvent: false,
			}
		);

		return this.setPhotographOfYourself(photoOfYourself).pipe(
			switchMap((_resp: any) => {
				return of(this.workerModelFormGroup.value);
			})
		);
	}

	private applyReplacementSpecificDataToModel(
		latestApplication: any,
		associatedLicence: MainLicenceResponse | LicenceResponse,
		photoOfYourself: Blob
	): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

		const originalLicenceData = latestApplication.originalLicenceData;
		originalLicenceData.originalLicenceTermCode = latestApplication.licenceTermData.licenceTermCode;

		// if the photo is missing, set the flag as expired so that it is required
		if (!this.isPhotographOfYourselfEmpty(photoOfYourself)) {
			originalLicenceData.originalPhotoOfYourselfExpired = true;
		}

		const mailingAddressData = {
			isAddressTheSame: false, // Mailing address validation will only show when this is false.
		};

		const [
			categoryArmouredCarGuardFormGroup,
			categoryBodyArmourSalesFormGroup,
			categoryClosedCircuitTelevisionInstallerFormGroup,
			categoryElectronicLockingDeviceInstallerFormGroup,
			categoryFireInvestigatorFormGroup,
			categoryLocksmithFormGroup,
			categoryLocksmithSupFormGroup,
			categoryPrivateInvestigatorFormGroup,
			categoryPrivateInvestigatorSupFormGroup,
			categorySecurityAlarmInstallerFormGroup,
			categorySecurityAlarmInstallerSupFormGroup,
			categorySecurityAlarmMonitorFormGroup,
			categorySecurityAlarmResponseFormGroup,
			categorySecurityAlarmSalesFormGroup,
			categorySecurityConsultantFormGroup,
			categorySecurityGuardFormGroup,
			categorySecurityGuardSupFormGroup,
		] = this.initializeCategoryFormGroups(associatedLicence.categoryCodes);

		this.workerModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceData,
				profileConfirmationData: { isProfileUpToDate: false },
				mailingAddressData,

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
			},
			{
				emitEvent: false,
			}
		);

		return of(this.workerModelFormGroup.value);
	}

	private isSimultaneousFlow(
		bizTypeCode: BizTypeCode | undefined,
		associatedLicence: MainLicenceResponse | LicenceResponse | undefined
	): boolean {
		if (!bizTypeCode && !associatedLicence) return false;

		if (!associatedLicence) {
			return this.commonApplicationService.isBusinessLicenceSoleProprietor(bizTypeCode!);
		}

		return (
			!!associatedLicence?.linkedSoleProprietorLicenceId &&
			associatedLicence.linkedSoleProprietorExpiryDate === associatedLicence.expiryDate
		);
	}
}
