import { Injectable, SecurityContext } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
	Alias,
	ApplicantProfileResponse,
	ApplicantUpdateRequest,
	ApplicationTypeCode,
	ArmouredVehiclePermitReasonCode,
	BodyArmourPermitReasonCode,
	Document,
	GoogleRecaptcha,
	HeightUnitCode,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	LicenceTermCode,
	PermitAppCommandResponse,
	PermitAppSubmitRequest,
	PermitCommandResponse,
	PermitLicenceAppResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
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
import { ApplicantProfileService, LicenceService, PermitService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { CommonApplicationService, UserLicenceResponse } from './common-application.service';
import { LicenceDocument } from './licence-application.helper';
import { LicenceDocumentsToSave } from './licence-application.service';
import { PermitApplicationHelper } from './permit-application.helper';

export class PermitDocumentsToSave {
	'licenceDocumentTypeCode': LicenceDocumentTypeCode;
	'documents': Array<Blob>;
}

@Injectable({
	providedIn: 'root',
})
export class PermitApplicationService extends PermitApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	photographOfYourself: string | null = null;

	permitModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	permitModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null),

		originalApplicationId: new FormControl(null),
		originalLicenceId: new FormControl(null),
		originalLicenceNumber: new FormControl(null),
		originalExpiryDate: new FormControl(null),

		applicationPortalStatus: new FormControl(null),

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		licenceTermData: this.licenceTermFormGroup,

		expiredLicenceData: this.expiredLicenceFormGroup,
		permitRequirementData: this.permitRequirementFormGroup,
		employerData: this.employerInformationFormGroup,
		permitRationaleData: this.permitRationaleFormGroup,

		personalInformationData: this.personalInformationFormGroup,
		criminalHistoryData: this.criminalHistoryFormGroup,
		aliasesData: this.aliasesFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,

		residentialAddress: this.residentialAddressFormGroup,
		mailingAddress: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
		printPermitData: this.printPermitFormGroup,
		profileConfirmationData: this.profileConfirmationFormGroup,
	});

	permitModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private router: Router,
		private permitService: PermitService,
		private licenceService: LicenceService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private commonApplicationService: CommonApplicationService,
		private applicantProfileService: ApplicantProfileService,
		private domSanitizer: DomSanitizer
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.permitModelChangedSubscription = this.permitModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

					const step1Complete = this.isStepPermitDetailsComplete();
					const step2Complete = this.isStepPurposeAndRationaleComplete();
					const step3Complete = this.isStepIdentificationComplete();
					const step4Complete = this.isStepContactComplete();

					const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

					console.debug(
						'permitModelFormGroup CHANGED',
						// step1Complete,
						// step2Complete,
						// step3Complete,
						// step4Complete,
						this.permitModelFormGroup.getRawValue()
					);

					this.permitModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * Reset the permit data
	 */
	reset(): void {
		this.initialized = false;
		this.hasValueChanged = false;
		this.photographOfYourself = null;

		this.accessCodeFormGroup.reset();
		this.consentAndDeclarationFormGroup.reset();
		this.permitModelFormGroup.reset();

		// clear the alias data - this does not seem to get reset during a formgroup reset
		const aliasesArray = this.permitModelFormGroup.get('aliasesData.aliases') as FormArray;
		while (aliasesArray.length) {
			aliasesArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.permitModelFormGroup.value);
	}

	/**
	 * Upload a file of a certain type. Return a reference to the file that will used when the permit is saved
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

		return this.permitService.apiPermitApplicationsLicenceAppIdFilesPost$Response({
			licenceAppId: this.permitModelFormGroup.get('licenceAppId')?.value,
			body: doc,
		});
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepPermitDetailsComplete(): boolean {
		const hasNoExpired = this.expiredLicenceFormGroup.value.hasExpiredLicence == BooleanTypeCode.No;
		const captchaFormGroup = this.expiredLicenceFormGroup.get('captchaFormGroup') as FormGroup;

		// If the user toggles the 'has expired' flag multiple times, the form is never marked as valid
		// something to do with the recaptcha not revalidating properly
		if (hasNoExpired && !captchaFormGroup.valid) {
			captchaFormGroup.reset();
		}

		return this.expiredLicenceFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepPurposeAndRationaleComplete(): boolean {
		const workerLicenceTypeCode = this.permitModelFormGroup.get('workerLicenceTypeData.workerLicenceTypeCode')?.value;

		let showEmployerInformation = false;
		if (workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit) {
			const bodyArmourRequirement = this.permitModelFormGroup.get(
				'permitRequirementData.bodyArmourRequirementFormGroup'
			)?.value;

			showEmployerInformation = !!bodyArmourRequirement.isMyEmployment;
		} else {
			const armouredVehicleRequirement = this.permitModelFormGroup.get(
				'permitRequirementData.armouredVehicleRequirementFormGroup'
			)?.value;

			showEmployerInformation = !!armouredVehicleRequirement.isMyEmployment;
		}

		// console.debug(
		// 	'isStepPurposeAndRationaleComplete',
		// 	this.permitRequirementFormGroup.valid,
		// 	!showEmployerInformation || (showEmployerInformation && this.employerInformationFormGroup.valid),
		// 	this.permitRationaleFormGroup.valid
		// );

		return (
			this.permitRequirementFormGroup.valid &&
			(!showEmployerInformation || (showEmployerInformation && this.employerInformationFormGroup.valid)) &&
			this.permitRationaleFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepIdentificationComplete(): boolean {
		if (this.authenticationService.isLoggedIn()) {
			// console.debug(
			// 	'isStepIdentificationComplete',
			// 	this.citizenshipFormGroup.valid,
			// 	this.bcDriversLicenceFormGroup.valid,
			// 	this.characteristicsFormGroup.valid,
			// 	this.photographOfYourselfFormGroup.valid
			// );

			return (
				this.citizenshipFormGroup.valid &&
				this.bcDriversLicenceFormGroup.valid &&
				this.characteristicsFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid
			);
		} else {
			// console.debug(
			// 	'isStepIdentificationComplete',
			// 	this.personalInformationFormGroup.valid,
			// 	this.criminalHistoryFormGroup.valid,
			// 	this.aliasesFormGroup.valid,
			// 	this.citizenshipFormGroup.valid,
			// 	this.bcDriversLicenceFormGroup.valid,
			// 	this.characteristicsFormGroup.valid,
			// 	this.photographOfYourselfFormGroup.valid
			// );

			return (
				this.personalInformationFormGroup.valid &&
				this.criminalHistoryFormGroup.valid &&
				this.aliasesFormGroup.valid &&
				this.citizenshipFormGroup.valid &&
				this.bcDriversLicenceFormGroup.valid &&
				this.characteristicsFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid
			);
		}
	}

	isStepContactComplete(): boolean {
		// console.debug(
		// 	'isStepContactComplete',
		// 	this.residentialAddressFormGroup.valid &&
		// 		this.mailingAddressFormGroup.valid &&
		// 		this.contactInformationFormGroup.valid
		// );

		return (
			this.residentialAddressFormGroup.valid &&
			this.mailingAddressFormGroup.valid &&
			this.contactInformationFormGroup.valid
		);
	}

	/**
	 * Determine if the step data should be saved. If the data has changed and category data exists;
	 * @returns
	 */
	isAutoSave(): boolean {
		return false;
		// if (
		// 	!this.authenticationService.isLoggedIn() ||
		// 	this.applicationTypeFormGroup.get('applicationTypeCode')?.value != ApplicationTypeCode.New
		// ) {
		// 	return false;
		// }

		// return this.hasValueChanged;
	}

	/**
	 * Save the permit data
	 * @returns
	 */
	saveLicenceStepAuthenticated(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const body = this.getSaveBodyBaseAuthenticated(this.permitModelFormGroup.getRawValue());
		return this.permitService.apiPermitApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<PermitAppCommandResponse>) => {
				const formValue = this.permitModelFormGroup.getRawValue();
				if (!formValue.licenceAppId) {
					this.permitModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
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
					return this.createEmptyPermitAuthenticated(resp, undefined, undefined).pipe(
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
		const licenceModelFormValue = this.permitModelFormGroup.getRawValue();
		const body: ApplicantUpdateRequest = this.getProfileSaveBody(licenceModelFormValue);

		return this.applicantProfileService.apiApplicantApplicantIdPut$Response({
			applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			body,
		});
	}

	/**
	 * Save the user profile in a flow
	 * @returns
	 */
	saveUserProfileAndContinue(applicationTypeCode: ApplicationTypeCode): Observable<StrictHttpResponse<string>> {
		return this.saveUserProfile().pipe(
			tap((_resp: StrictHttpResponse<string>) => {
				switch (applicationTypeCode) {
					case ApplicationTypeCode.Renewal: {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathPermitAuthenticated(LicenceApplicationRoutes.PERMIT_RENEWAL_AUTHENTICATED)
						);
						break;
					}
					case ApplicationTypeCode.Update: {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathPermitAuthenticated(LicenceApplicationRoutes.PERMIT_UPDATE_AUTHENTICATED)
						);
						break;
					}
					default: {
						this.router.navigateByUrl(
							LicenceApplicationRoutes.pathPermitAuthenticated(LicenceApplicationRoutes.PERMIT_NEW_AUTHENTICATED)
						);
						break;
					}
				}
			})
		);
	}

	/**
	 * Partial Save - Save the licence data as is.
	 * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	 */
	savePermitStepAuthenticated(): Observable<StrictHttpResponse<PermitCommandResponse>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAuthenticated(permitModelFormValue);

		// body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId; // TODO set applicantId type in permit

		console.debug('savePermitStepAuthenticated PARTIAL SAVE', permitModelFormValue, body);

		return this.permitService.apiPermitApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<PermitCommandResponse>) => {
				const formValue = this.permitModelFormGroup.getRawValue();
				if (!formValue.licenceAppId) {
					this.permitModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getPermitToResume(licenceAppId: string): Observable<PermitLicenceAppResponse> {
		return this.loadExistingPermitWithIdAuthenticated(licenceAppId).pipe(
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
	 * Create an empty permit
	 * @returns
	 */
	createNewPermitAuthenticated(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.applicantProfileService
			.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
			.pipe(
				switchMap((profile: ApplicantProfileResponse) => {
					return this.createEmptyPermitAuthenticated(profile, workerLicenceTypeCode, ApplicationTypeCode.New).pipe(
						tap((_resp: any) => {
							this.initialized = true;

							this.commonApplicationService.setApplicationTitle(workerLicenceTypeCode, ApplicationTypeCode.New);
						})
					);
				})
			);
	}

	/**
	 * Load an existing permit application with an id for the provided application type
	 * @param licenceAppId
	 * @returns
	 */
	getPermitWithSelectionAuthenticated(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode,
		userLicenceInformation: UserLicenceResponse
	): Observable<PermitLicenceAppResponse> {
		return this.getPermitOfTypeAuthenticated(licenceAppId, applicationTypeCode, userLicenceInformation).pipe(
			tap((_resp: any) => {
				this.permitModelFormGroup.patchValue({ originalApplicationId: licenceAppId }, { emitEvent: false });

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeData.workerLicenceTypeCode,
					_resp.applicationTypeData.applicationTypeCode
				);

				console.debug('[getPermitWithSelectionAuthenticated] permitModelFormGroup', this.permitModelFormGroup.value);
			})
		);
	}

	/**
	 * Save the login user profile
	 * @returns
	 */
	private saveUserProfile(): Observable<StrictHttpResponse<string>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();
		const body: ApplicantUpdateRequest = this.getProfileSaveBody(permitModelFormValue);

		console.debug('[saveUserProfile] permitModelFormValue', permitModelFormValue);
		console.debug('[saveUserProfile] getProfileSaveBody', body);

		return this.applicantProfileService.apiApplicantApplicantIdPut$Response({
			applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			body,
		});
	}

	/**
	 * Submit the permit data
	 * @returns
	 */
	submitPermitAuthenticated(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const body = this.getSaveBodyBaseAuthenticated(this.permitModelFormGroup.getRawValue());

		return this.permitService.apiPermitApplicationsAnonymousSubmitPost$Response({ body });
	}

	submitPermitRenewalOrUpdateAuthenticated(): void {
		//} Observable<StrictHttpResponse<PermitAppSubmitRequest>> {//WorkerLicenceCommandResponse
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAuthenticated(permitModelFormValue) as PermitAppSubmitRequest;
		const documentsToSave = this.getDocsToSaveBlobs(permitModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		// Create list of APIs to call for the newly added documents
		// const documentsToSaveApis: Observable<string>[] = [];

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
				// documentsToSaveApis.push(
				// 	this.permitService.apiWorkerLicenceApplicationsAuthenticatedFilesPost({
				// 		body: {
				// 			Documents: newDocumentsOnly,
				// 			LicenceDocumentTypeCode: doc.licenceDocumentTypeCode,
				// 		},
				// 	})
				// );
			}
		});

		console.debug('[submitPermitRenewalOrUpdateAuthenticated] body', body);
		console.debug('[submitPermitRenewalOrUpdateAuthenticated] documentsToSave', documentsToSave);
		console.debug('[submitPermitRenewalOrUpdateAuthenticated] existingDocumentIds', existingDocumentIds);

		// if (documentsToSaveApis.length > 0) {
		// 	return forkJoin(documentsToSaveApis).pipe(
		// 		switchMap((resps: string[]) => {
		// 			// pass in the list of document key codes
		// 			body.documentKeyCodes = [...resps];
		// 			// pass in the list of document ids that were in the original
		// 			// application and are still being used
		// 			body.previousDocumentIds = [...existingDocumentIds];

		// 			return this.permitService.apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response({
		// 				body,
		// 			});
		// 		})
		// 	);
		// } else {
		// 	// pass in the list of document ids that were in the original
		// 	// application and are still being used
		// 	body.previousDocumentIds = [...existingDocumentIds];

		// 	return this.permitService.apiWorkerLicenceApplicationsAuthenticatedSubmitPost$Response({
		// 		body,
		// 	});
		// }
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	private getPermitOfTypeAuthenticated(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode,
		userLicenceInformation: UserLicenceResponse
	): Observable<PermitLicenceAppResponse> {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return forkJoin([
					this.loadExistingPermitWithIdAuthenticated(licenceAppId, userLicenceInformation),
					this.licenceService.apiLicencesLicencePhotoLicenceIdGet({ licenceId: userLicenceInformation?.licenceId! }),
				]).pipe(
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
				return forkJoin([
					this.loadExistingPermitWithIdAuthenticated(licenceAppId, userLicenceInformation),
					this.licenceService.apiLicencesLicencePhotoLicenceIdGet({ licenceId: userLicenceInformation?.licenceId! }),
				]).pipe(
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
				return this.loadExistingPermitWithIdAuthenticated(licenceAppId);
			}
		}
	}

	/**
	 * Create an empty permit just containing profile data
	 * @returns
	 */
	private createEmptyPermitAuthenticated(
		profile: ApplicantProfileResponse,
		workerLicenceTypeCode: WorkerLicenceTypeCode | undefined,
		applicationTypeCode: ApplicationTypeCode | undefined
	): Observable<any> {
		this.reset();

		return this.applyPermitProfileIntoModel(profile, workerLicenceTypeCode, applicationTypeCode);
	}

	/**
	 * Load a permit using an ID
	 * @returns
	 */
	private loadExistingPermitWithIdAuthenticated(
		licenceAppId: string,
		userLicenceInformation?: UserLicenceResponse
	): Observable<PermitLicenceAppResponse> {
		this.reset();

		return forkJoin([
			this.permitService.apiPermitApplicationsLicenceAppIdGet({ licenceAppId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		]).pipe(
			switchMap((resps: any[]) => {
				const permitLicenceAppResponse = resps[0];
				const profile = resps[1];

				return this.applyPermitAndProfileIntoModel(permitLicenceAppResponse, profile, userLicenceInformation);
			})
		);
	}

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/

	/**
	 * Search for an existing permit using access code
	 * @param licenceNumber
	 * @param accessCode
	 * @param recaptchaCode
	 * @returns
	 */
	getPermitWithAccessCodeAnonymous(
		licenceNumber: string,
		accessCode: string,
		recaptchaCode: string
	): Observable<LicenceResponse> {
		return this.licenceService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, accessCode, body: { recaptchaCode } })
			.pipe(take(1));
	}

	/**
	 * Load an existing permit application
	 * @param licenceAppId
	 * @returns
	 */
	getPermitWithAccessCodeDataAnonymous(
		accessCodeData: any,
		applicationTypeCode: ApplicationTypeCode
	): Observable<PermitLicenceAppResponse> {
		return this.getPermitOfTypeUsingAccessCode(applicationTypeCode!).pipe(
			tap((_resp: any) => {
				const personalInformationData = { ..._resp.personalInformationData };

				personalInformationData.cardHolderName = accessCodeData.linkedCardHolderName;
				personalInformationData.licenceHolderName = accessCodeData.linkedLicenceHolderName;

				this.permitModelFormGroup.patchValue(
					{
						originalApplicationId: accessCodeData.linkedLicenceAppId,
						originalLicenceId: accessCodeData.linkedLicenceId,
						originalLicenceNumber: accessCodeData.licenceNumber,
						originalExpiryDate: accessCodeData.linkedExpiryDate,
						originalLicenceTermCode: accessCodeData.linkedLicenceTermCode,
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

				console.debug('[getPermitWithAccessCodeDataAnonymous] permitModelFormGroup', this.permitModelFormGroup.value);
			})
		);
	}

	/**
	 * Create an empty permit
	 * @returns
	 */
	createNewPermitAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.createEmptyPermitAnonymous(workerLicenceTypeCode).pipe(
			tap((resp: any) => {
				console.debug('[createNewPermitAnonymous] resp', resp);

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(resp.workerLicenceTypeCode);
			})
		);
	}

	/**
	 * Load an existing permit application
	 * @param licenceAppId
	 * @returns
	 */
	private getPermitOfTypeUsingAccessCode(
		applicationTypeCode: ApplicationTypeCode
	): Observable<PermitLicenceAppResponse> {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return forkJoin([this.loadExistingPermitAnonymous(), this.licenceService.apiLicencesLicencePhotoGet()]).pipe(
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
			default: {
				// Must be ApplicationTypeCode.Update: there is no replacement for Permits
				return forkJoin([this.loadExistingPermitAnonymous(), this.licenceService.apiLicencesLicencePhotoGet()]).pipe(
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
		}
	}

	/**
	 * Set the current photo of yourself
	 * @returns
	 */
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
	 * Create an empty anonymous permit
	 * @returns
	 */

	private createEmptyPermitAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		this.reset();

		this.permitModelFormGroup.patchValue(
			{
				workerLicenceTypeData: { workerLicenceTypeCode: workerLicenceTypeCode },
				permitRequirementData: { workerLicenceTypeCode: workerLicenceTypeCode },
				licenceTermData: { licenceTermCode: LicenceTermCode.FiveYears },
				profileConfirmationData: { isProfileUpToDate: true },
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[createEmptyPermitAnonymous] permitModelFormGroup', this.permitModelFormGroup.value);
		return of(this.permitModelFormGroup.value);
	}

	/**
	 * Submit the permit data
	 * @returns
	 */
	submitPermitAnonymous(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAnonymous(permitModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(permitModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];
		let newDocumentsExist = false;
		documentsToSave.forEach((docPermit: PermitDocumentsToSave) => {
			docPermit.documents.forEach((doc: any) => {
				if (doc.documentUrlId) {
					existingDocumentIds.push(doc.documentUrlId);
				} else {
					newDocumentsExist = true;
				}
			});
		});

		console.debug('[submitPermitAnonymous] permitModelFormValue', permitModelFormValue);
		console.debug('[submitPermitAnonymous] saveBodyAnonymous', body);
		console.debug('[submitPermitAnonymous] documentsToSave', documentsToSave);
		console.debug('[submitPermitAnonymous] existingDocumentIds', existingDocumentIds);
		console.debug('[submitPermitAnonymous] newDocumentsExist', newDocumentsExist);

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		if (newDocumentsExist) {
			return this.postPermitAnonymousNewDocuments(googleRecaptcha, existingDocumentIds, documentsToSave, body);
		} else {
			return this.postPermitAnonymousNoNewDocuments(googleRecaptcha, existingDocumentIds, body);
		}
	}

	/**
	 * Post permit anonymous. This permit must not have any new documents (for example: with an update or replacement)
	 * @returns
	 */
	private postPermitAnonymousNoNewDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		body: PermitAppSubmitRequest
	) {
		return this.permitService
			.apiPermitApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					// pass in the list of document ids that were in the original
					// application and are still being used
					body.previousDocumentIds = [...existingDocumentIds];

					return this.permitService.apiPermitApplicationsAnonymousSubmitPost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/**
	 * Post permit anonymous. This permit has new documents (for example: with new or renew)
	 * @returns
	 */
	private postPermitAnonymousNewDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSave: Array<PermitDocumentsToSave>,
		body: PermitAppSubmitRequest
	) {
		return this.permitService
			.apiPermitApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					const documentsToSaveApis: Observable<string>[] = [];
					documentsToSave.forEach((docBody: PermitDocumentsToSave) => {
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
								this.permitService.apiPermitApplicationsAnonymousFilesPost({
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

					return this.permitService.apiPermitApplicationsAnonymousSubmitPost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/**
	 * Load an existing permit related to an access code search
	 * @returns
	 */
	private loadExistingPermitAnonymous(): Observable<PermitLicenceAppResponse> {
		this.reset();

		return this.permitService.apiPermitApplicationGet().pipe(
			switchMap((resp: PermitLicenceAppResponse) => {
				return this.applyPermitAndProfileIntoModel(resp, null);
			})
		);
	}

	/*************************************************************/
	// COMMON
	/*************************************************************/

	private applyPermitAndProfileIntoModel(
		permitLicenceApplication: PermitLicenceAppResponse,
		profile: ApplicantProfileResponse | null | undefined,
		userLicenceInformation?: UserLicenceResponse
	): Observable<any> {
		return this.applyPermitProfileIntoModel(
			profile ?? permitLicenceApplication,
			permitLicenceApplication.workerLicenceTypeCode!,
			permitLicenceApplication.applicationTypeCode,
			userLicenceInformation
		).pipe(
			switchMap((_resp: any) => {
				return this.applyPermitIntoModel(permitLicenceApplication);
			})
		);
	}

	private applyPermitProfileIntoModel(
		profile: ApplicantProfileResponse | PermitLicenceAppResponse,
		workerLicenceTypeCode: WorkerLicenceTypeCode | undefined,
		applicationTypeCode: ApplicationTypeCode | undefined,
		userLicenceInformation?: UserLicenceResponse
	): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceTypeCode };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };

		const personalInformationData = {
			givenName: profile.givenName,
			middleName1: profile.middleName1,
			middleName2: profile.middleName2,
			surname: profile.surname,
			dateOfBirth: profile.dateOfBirth,
			genderCode: profile.genderCode,
			hasGenderChanged: false,
			hasBcscNameChanged: userLicenceInformation?.hasBcscNameChanged === true ? true : false,
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
			originalBusinessTypeCode: userLicenceInformation?.businessTypeCode ?? null,
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
			addressSelected: profile.mailingAddress ? true : false,
			isMailingTheSameAsResidential: false,
			addressLine1: profile.mailingAddress?.addressLine1,
			addressLine2: profile.mailingAddress?.addressLine2,
			city: profile.mailingAddress?.city,
			country: profile.mailingAddress?.country,
			postalCode: profile.mailingAddress?.postalCode,
			province: profile.mailingAddress?.province,
		};

		const criminalHistoryData = {
			hasCriminalHistory: this.utilService.booleanToBooleanType(profile.hasCriminalHistory),
			criminalChargeDescription: '',
		};

		this.permitModelFormGroup.patchValue(
			{
				workerLicenceTypeData,
				applicationTypeData,
				...originalLicenceData,
				licenceTermData: { licenceTermCode: LicenceTermCode.FiveYears },
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
			},
			{
				emitEvent: false,
			}
		);

		const aliasesArray = this.permitModelFormGroup.get('aliasesData.aliases') as FormArray;
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

		console.debug('[applyPermitProfileIntoModel] permitModelFormGroup', this.permitModelFormGroup.value);
		return of(this.permitModelFormGroup.value);
	}

	private applyPermitIntoModel(resp: PermitLicenceAppResponse): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
		const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };

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

		const bodyArmourRequirementFormGroup = {
			isOutdoorRecreation: resp.bodyArmourPermitReasonCodes?.includes(BodyArmourPermitReasonCode.OutdoorRecreation),
			isPersonalProtection: resp.bodyArmourPermitReasonCodes?.includes(BodyArmourPermitReasonCode.PersonalProtection),
			isMyEmployment: resp.bodyArmourPermitReasonCodes?.includes(BodyArmourPermitReasonCode.MyEmployment),
			isTravelForConflict: resp.bodyArmourPermitReasonCodes?.includes(
				BodyArmourPermitReasonCode.TravelInResponseToInternationalConflict
			),
			isOther: resp.bodyArmourPermitReasonCodes?.includes(BodyArmourPermitReasonCode.Other),
		};

		const armouredVehicleRequirementFormGroup = {
			isPersonalProtection: resp.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.PersonalProtection
			),
			isMyEmployment: resp.armouredVehiclePermitReasonCodes?.includes(ArmouredVehiclePermitReasonCode.MyEmployment),
			isProtectionOfAnotherPerson: resp.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.ProtectionOfAnotherPerson
			),
			isProtectionOfPersonalProperty: resp.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty
			),
			isProtectionOfOthersProperty: resp.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.ProtectionOfOtherProperty
			),
			isOther: resp.armouredVehiclePermitReasonCodes?.includes(ArmouredVehiclePermitReasonCode.Other),
		};

		const permitRequirementData = {
			workerLicenceTypeCode: resp.workerLicenceTypeCode,
			bodyArmourRequirementFormGroup: bodyArmourRequirementFormGroup,
			armouredVehicleRequirementFormGroup: armouredVehicleRequirementFormGroup,
			otherReason: resp.permitOtherRequiredReason,
		};

		const employerData = {
			employerName: resp.employerName,
			supervisorName: resp.supervisorName,
			supervisorEmailAddress: resp.supervisorEmailAddress,
			supervisorPhoneNumber: resp.supervisorPhoneNumber,
			addressSelected: resp.employerPrimaryAddress?.addressLine1 ? true : resp.employerPrimaryAddress?.addressLine1,
			addressLine1: resp.employerPrimaryAddress?.addressLine1,
			addressLine2: resp.employerPrimaryAddress?.addressLine2,
			city: resp.employerPrimaryAddress?.city,
			postalCode: resp.employerPrimaryAddress?.postalCode,
			province: resp.employerPrimaryAddress?.province,
			country: resp.employerPrimaryAddress?.country,
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

		const citizenshipData: {
			isCanadianCitizen: BooleanTypeCode | null;
			isCanadianResident: BooleanTypeCode | null;
			canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
			proofOfResidentStatusCode: LicenceDocumentTypeCode | null;
			proofOfCitizenshipCode: LicenceDocumentTypeCode | null;
			expiryDate: string | null;
			attachments: File[];
			governmentIssuedPhotoTypeCode: LicenceDocumentTypeCode | null;
			governmentIssuedExpiryDate: string | null;
			governmentIssuedAttachments: File[];
		} = {
			isCanadianCitizen: this.utilService.booleanToBooleanType(resp.isCanadianCitizen),
			isCanadianResident: this.utilService.booleanToBooleanType(resp.isCanadianResident),
			canadianCitizenProofTypeCode: null,
			proofOfResidentStatusCode: null,
			proofOfCitizenshipCode: null,
			expiryDate: null,
			attachments: [],
			governmentIssuedPhotoTypeCode: null,
			governmentIssuedExpiryDate: null,
			governmentIssuedAttachments: [],
		};

		const rationaleAttachments: Array<File> = [];
		const citizenshipDataAttachments: Array<File> = [];
		const governmentIssuedAttachments: Array<File> = [];
		const photographOfYourselfAttachments: Array<File> = [];
		let photographOfYourselfLastUploadedDateTime = '';

		resp.documentInfos?.forEach((doc: Document) => {
			switch (
				doc.licenceDocumentTypeCode // TODO verify permit auth licence doc types are correct here
			) {
				case LicenceDocumentTypeCode.DriversLicenceAdditional:
				case LicenceDocumentTypeCode.PermanentResidentCardAdditional:
				case LicenceDocumentTypeCode.Bcid:
				case LicenceDocumentTypeCode.BcServicesCard:
				case LicenceDocumentTypeCode.CanadianFirearmsLicence:
				case LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional:
				case LicenceDocumentTypeCode.NonCanadianPassport: {
					const aFile = this.fileUtilService.dummyFile(doc);
					governmentIssuedAttachments.push(aFile);

					citizenshipData.governmentIssuedPhotoTypeCode = doc.licenceDocumentTypeCode;
					citizenshipData.governmentIssuedExpiryDate = doc.expiryDate ?? null;
					citizenshipData.governmentIssuedAttachments = governmentIssuedAttachments;
					break;
				}
				case LicenceDocumentTypeCode.BirthCertificate: //ProofOfCanadianCitizenshipTypes
				case LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen:
				case LicenceDocumentTypeCode.CanadianPassport:
				case LicenceDocumentTypeCode.CanadianCitizenship:
				case LicenceDocumentTypeCode.DriversLicence: //PermitProofOfCitizenshipTypes
				case LicenceDocumentTypeCode.GovernmentIssuedPhotoId:
				case LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument: //PermitProofOfResidenceStatusTypes
				case LicenceDocumentTypeCode.PermanentResidentCard:
				case LicenceDocumentTypeCode.RecordOfLandingDocument:
				case LicenceDocumentTypeCode.StudyPermit:
				case LicenceDocumentTypeCode.WorkPermit: {
					const aFile = this.fileUtilService.dummyFile(doc);
					citizenshipDataAttachments.push(aFile);

					citizenshipData.canadianCitizenProofTypeCode = resp.isCanadianCitizen ? doc.licenceDocumentTypeCode : null;
					citizenshipData.proofOfResidentStatusCode =
						!resp.isCanadianCitizen && resp.isCanadianResident ? doc.licenceDocumentTypeCode : null;
					citizenshipData.proofOfCitizenshipCode =
						!resp.isCanadianCitizen && !resp.isCanadianResident ? doc.licenceDocumentTypeCode : null;
					citizenshipData.expiryDate = doc.expiryDate ?? null;
					citizenshipData.attachments = citizenshipDataAttachments;
					break;
				}
				case LicenceDocumentTypeCode.PhotoOfYourself: {
					photographOfYourselfLastUploadedDateTime = doc.uploadedDateTime ?? '';
					const aFile = this.fileUtilService.dummyFile(doc);
					photographOfYourselfAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.ArmouredVehicleRationale:
				case LicenceDocumentTypeCode.BodyArmourRationale: {
					const aFile = this.fileUtilService.dummyFile(doc);
					rationaleAttachments.push(aFile);
					break;
				}
			}
		});

		const photographOfYourselfData = {
			attachments: photographOfYourselfAttachments,
			uploadedDateTime: photographOfYourselfLastUploadedDateTime,
		};

		const permitRationaleData = {
			rationale: resp.rationale,
			attachments: rationaleAttachments,
		};

		this.permitModelFormGroup.patchValue(
			{
				licenceAppId: resp.licenceAppId,
				applicationPortalStatus: resp.applicationPortalStatus,
				workerLicenceTypeData,
				permitRequirementData,
				permitRationaleData,
				employerData,
				applicationTypeData,
				expiredLicenceData,
				licenceTermData,
				bcDriversLicenceData,
				characteristicsData,
				citizenshipData,
				photographOfYourselfData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyPermitIntoModel] permitModelFormGroup', this.permitModelFormGroup.value);
		return of(this.permitModelFormGroup.value);
	}

	private applyRenewalDataUpdatesToModel(resp: any): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeData.workerLicenceTypeCode };
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };
		const permitRequirementData = { workerLicenceTypeCode: resp.workerLicenceTypeData.workerLicenceTypeCode };

		const licenceTermData = {
			licenceTermCode: LicenceTermCode.FiveYears,
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

		this.permitModelFormGroup.patchValue(
			{
				licenceAppId: null,
				workerLicenceTypeData,
				applicationTypeData,
				profileConfirmationData: { isProfileUpToDate: false },
				permitRequirementData,
				licenceTermData,
				criminalHistoryData,
				photographOfYourselfData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.permitModelFormGroup.value);
	}

	private applyUpdateDataUpdatesToModel(resp: any): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };
		const permitRequirementData = { workerLicenceTypeCode: resp.workerLicenceTypeData.workerLicenceTypeCode };

		const licenceTermData = {
			licenceTermCode: LicenceTermCode.FiveYears,
		};
		const criminalHistoryData = {
			hasCriminalHistory: null,
			criminalChargeDescription: null,
		};

		this.permitModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				profileConfirmationData: { isProfileUpToDate: false },
				permitRequirementData,
				licenceTermData,
				criminalHistoryData,
			},
			{
				emitEvent: false,
			}
		);
		return of(this.permitModelFormGroup.value);
	}
}
