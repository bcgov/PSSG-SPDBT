import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
	PermitLicenceAppResponse,
	ServiceTypeCode,
	WeightUnitCode,
} from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { PersonalLicenceApplicationRoutes } from '@app/modules/personal-licence-application/personal-licence-application-routes';
import { OptionsPipe } from '@app/shared/pipes/options.pipe';
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
import {
	ApplicantProfileService,
	LicenceAppDocumentService,
	LicenceService,
	PermitService,
} from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { LicenceDocumentsToSave, UtilService } from 'src/app/core/services/util.service';
import { CommonApplicationService, MainLicenceResponse } from './common-application.service';
import { PermitApplicationHelper } from './permit-application.helper';

export class PermitDocumentsToSave {
	'licenceDocumentTypeCode': LicenceDocumentTypeCode;
	'documents': Array<Blob>;
}

@Injectable({
	providedIn: 'root',
})
export class PermitApplicationService extends PermitApplicationHelper {
	permitModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	permitModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(),
		applicantId: new FormControl(), // when authenticated, the applicant id
		caseNumber: new FormControl(), // placeholder to save info for display purposes

		originalLicenceData: this.originalLicenceFormGroup,

		serviceTypeData: this.serviceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		licenceTermData: this.licenceTermFormGroup,

		expiredLicenceData: this.expiredLicenceFormGroup,
		permitRequirementData: this.permitRequirementFormGroup,
		employerData: this.employerInformationFormGroup,
		permitRationaleData: this.permitRationaleFormGroup,

		personalInformationData: this.personalInformationFormGroup,
		reprintLicenceData: this.reprintLicenceFormGroup,
		criminalHistoryData: this.criminalHistoryFormGroup,
		aliasesData: this.aliasesFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,

		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
		profileConfirmationData: this.profileConfirmationFormGroup,

		policeBackgroundData: this.policeBackgroundFormGroup, // placeholder to store current values for the user - not displayed
		mentalHealthConditionsData: this.mentalHealthConditionsFormGroup, // placeholder to store current values for the user - not displayed
	});

	permitModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		optionsPipe: OptionsPipe,
		private router: Router,
		private permitService: PermitService,
		private licenceService: LicenceService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private commonApplicationService: CommonApplicationService,
		private applicantProfileService: ApplicantProfileService
	) {
		super(formBuilder, configService, utilService, fileUtilService, optionsPipe);

		this.permitModelChangedSubscription = this.permitModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepPermitDetailsComplete();
					const step2Complete = this.isStepPurposeAndRationaleComplete();
					const step3Complete = this.isStepIdentificationComplete();
					const step4Complete = this.isStepContactComplete();

					const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

					console.debug(
						'permitModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						step4Complete,
						this.permitModelFormGroup.getRawValue()
					);

					this.updateModelChangeFlags();

					this.permitModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * Reset the permit data
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

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
		return this.licenceAppDocumentService.apiLicenceApplicationDocumentsLicenceAppIdFilesPost$Response({
			licenceAppId: this.permitModelFormGroup.get('licenceAppId')?.value,
			body: {
				documents: [document],
				licenceDocumentTypeCode: documentCode,
			},
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
		const serviceTypeCode = this.permitModelFormGroup.get('serviceTypeData.serviceTypeCode')?.value;

		let showEmployerInformation = false;
		if (serviceTypeCode === ServiceTypeCode.BodyArmourPermit) {
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
				this.criminalHistoryFormGroup.valid &&
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

	getShowEmployerInformation(serviceTypeCode: ServiceTypeCode): boolean {
		const permitRequirementData = this.permitModelFormGroup.get('permitRequirementData')?.value;

		if (serviceTypeCode === ServiceTypeCode.BodyArmourPermit) {
			const bodyArmourRequirement = permitRequirementData.bodyArmourRequirementFormGroup;
			return !!bodyArmourRequirement.isMyEmployment;
		} else {
			const armouredVehicleRequirement = permitRequirementData.armouredVehicleRequirementFormGroup;
			return !!armouredVehicleRequirement.isMyEmployment;
		}
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

		return this.hasValueChanged;
	}

	/**
	 * Partial Save - Save the permit data as is.
	 * @returns StrictHttpResponse<PermitAppCommandResponse>
	 */
	partialSavePermitStepAuthenticated(
		isSaveAndExit?: boolean
	): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseUpsertAuthenticated(permitModelFormValue);

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.permitService.apiPermitApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<PermitAppCommandResponse>) => {
				this.resetModelChangeFlags();

				let msg = 'Your application has been saved';
				if (isSaveAndExit) {
					msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
				}
				this.utilService.toasterSuccess(msg);

				if (!permitModelFormValue.licenceAppId) {
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
				switchMap((applicantProfile: ApplicantProfileResponse) => {
					return this.createEmptyPermitAuthenticated({
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
	saveUserProfileAndContinue(
		serviceTypeCode: ServiceTypeCode,
		applicationTypeCode: ApplicationTypeCode
	): Observable<StrictHttpResponse<string>> {
		return this.saveUserProfile().pipe(
			tap((_resp: StrictHttpResponse<string>) => {
				this.continueToNextStep(serviceTypeCode, applicationTypeCode);
			})
		);
	}

	/**
	 * Save the user profile in a flow
	 * @returns
	 */
	private continueToNextStep(serviceTypeCode: ServiceTypeCode, applicationTypeCode: ApplicationTypeCode): void {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
						PersonalLicenceApplicationRoutes.PERMIT_RENEWAL_AUTHENTICATED
					)
				);
				break;
			}
			case ApplicationTypeCode.Update: {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
						PersonalLicenceApplicationRoutes.PERMIT_UPDATE_AUTHENTICATED
					),
					{ state: { serviceTypeCode: serviceTypeCode } }
				);
				break;
			}
			default: {
				this.router.navigateByUrl(
					PersonalLicenceApplicationRoutes.pathPermitAuthenticated(
						PersonalLicenceApplicationRoutes.PERMIT_NEW_AUTHENTICATED
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
	getPermitToResume(licenceAppId: string): Observable<PermitLicenceAppResponse> {
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
	 * Create an empty permit
	 * @returns
	 */
	createNewPermitAuthenticated(
		serviceTypeCode: ServiceTypeCode,
		previousExpiredPermit: MainLicenceResponse | undefined
	): Observable<any> {
		return this.applicantProfileService
			.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
			.pipe(
				switchMap((applicantProfile: ApplicantProfileResponse) => {
					return this.createEmptyPermitAuthenticated({
						applicantProfile,
						serviceTypeCode,
						applicationTypeCode: ApplicationTypeCode.New,
						previousExpiredPermit,
					}).pipe(
						tap((_resp: any) => {
							this.initialized = true;

							this.commonApplicationService.setApplicationTitle(serviceTypeCode, ApplicationTypeCode.New);
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
		associatedLicence: MainLicenceResponse
	): Observable<PermitLicenceAppResponse> {
		return this.getPermitOfTypeAuthenticated(licenceAppId, applicationTypeCode, associatedLicence).pipe(
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
	 * Save the login user profile
	 * @returns
	 */
	private saveUserProfile(): Observable<StrictHttpResponse<string>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();
		const body: ApplicantUpdateRequest = this.getProfileSaveBody(permitModelFormValue);

		return this.applicantProfileService
			.apiApplicantApplicantIdPut$Response({
				applicantId: this.authUserBcscService.applicantLoginProfile?.applicantId!,
				body,
			})
			.pipe(
				tap((_resp: any) => {
					this.resetModelChangeFlags();
				})
			);
	}

	/**
	 * Submit the permit data
	 * @returns
	 */
	submitPermitNewAuthenticated(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseUpsertAuthenticated(permitModelFormValue);

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		return this.permitService.apiPermitApplicationsSubmitPost$Response({ body }).pipe(
			tap((_resp: any) => {
				this.reset();
			})
		);
	}

	submitPermitRenewalOrUpdateAuthenticated(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();

		const bodyUpsert = this.getSaveBodyBaseSubmitAuthenticated(permitModelFormValue) as any;
		delete bodyUpsert.documentInfos;

		const body = bodyUpsert as PermitAppSubmitRequest;

		const documentsToSave = this.getDocsToSaveBlobs(permitModelFormValue);

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

					return this.permitService
						.apiPermitApplicationsChangePost$Response({
							body,
						})
						.pipe(
							tap((_resp: any) => {
								this.reset();
							})
						);
				})
			);
		} else {
			// pass in the list of document ids that were in the original
			// application and are still being used
			body.previousDocumentIds = [...existingDocumentIds];

			return this.permitService
				.apiPermitApplicationsChangePost$Response({
					body,
				})
				.pipe(
					tap((_resp: any) => {
						this.reset();
					})
				);
		}
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	private getPermitOfTypeAuthenticated(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode,
		associatedLicence: MainLicenceResponse
	): Observable<PermitLicenceAppResponse> {
		return forkJoin([
			this.loadExistingPermitWithIdAuthenticated(licenceAppId, associatedLicence),
			this.licenceService.apiLicencesLicencePhotoLicenceIdGet({ licenceId: associatedLicence?.licenceId! }),
		]).pipe(
			catchError((error) => of(error)),
			switchMap((resps: any[]) => {
				const latestLicence = resps[0];
				const photoOfYourself = resps[1];

				if (applicationTypeCode === ApplicationTypeCode.Renewal) {
					return this.applyRenewalSpecificDataToModel(latestLicence, photoOfYourself);
				}

				return this.applyUpdateSpecificDataToModel(latestLicence, photoOfYourself);
			})
		);
	}

	/**
	 * Create an empty permit just containing profile data
	 * @returns
	 */
	private createEmptyPermitAuthenticated({
		applicantProfile,
		serviceTypeCode,
		applicationTypeCode,
		previousExpiredPermit,
	}: {
		applicantProfile: ApplicantProfileResponse;
		serviceTypeCode?: ServiceTypeCode | undefined;
		applicationTypeCode?: ApplicationTypeCode | undefined;
		previousExpiredPermit?: MainLicenceResponse | undefined;
	}): Observable<any> {
		this.reset();

		return this.applyProfileIntoModel({
			applicantProfile,
			serviceTypeCode,
			applicationTypeCode,
			previousExpiredPermit,
		});
	}

	/**
	 * Load a permit using an ID
	 * @returns
	 */
	private loadExistingPermitWithIdAuthenticated(
		licenceAppId: string,
		associatedLicence?: MainLicenceResponse
	): Observable<PermitLicenceAppResponse> {
		this.reset();

		return forkJoin([
			this.permitService.apiPermitApplicationsLicenceAppIdGet({ licenceAppId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		]).pipe(
			switchMap((resps: any[]) => {
				const permitLicenceAppl = resps[0];
				const applicantProfile = resps[1];

				// remove reference to expired licence - data is only used in the Resume authenticated flow.
				permitLicenceAppl.expiredLicenceId = null;
				permitLicenceAppl.expiredLicenceNumber = null;
				permitLicenceAppl.hasExpiredLicence = false;

				return this.applyApplAndProfileIntoModel({
					permitLicenceAppl,
					applicantProfile,
					associatedLicence,
				});
			})
		);
	}

	/**
	 * Load a permit using an ID
	 * @returns
	 */
	private loadPartialApplWithIdAuthenticated(licenceAppId: string): Observable<PermitLicenceAppResponse> {
		this.reset();

		const apis: Observable<any>[] = [
			this.permitService.apiPermitApplicationsLicenceAppIdGet({ licenceAppId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const permitLicenceAppl = resps[0];
				const applicantProfile = resps[1];

				return this.loadLicenceApplAndProfile(permitLicenceAppl, applicantProfile).pipe(
					tap((_resp: any) => {
						const criminalHistoryData = {
							hasCriminalHistory: this.utilService.booleanToBooleanType(permitLicenceAppl.hasCriminalHistory),
							criminalChargeDescription: '',
						};

						this.permitModelFormGroup.patchValue(
							{
								criminalHistoryData,
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

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/

	/**
	 * Load an existing permit application
	 * @param licenceAppId
	 * @returns
	 */
	getPermitWithAccessCodeDataAnonymous(
		associatedLicence: LicenceResponse,
		applicationTypeCode: ApplicationTypeCode
	): Observable<PermitLicenceAppResponse> {
		return this.getPermitOfTypeUsingAccessCode(applicationTypeCode, associatedLicence).pipe(
			tap((_resp: any) => {
				const personalInformationData = _resp.personalInformationData;

				personalInformationData.cardHolderName = associatedLicence.nameOnCard;
				personalInformationData.licenceHolderName = associatedLicence.licenceHolderName;

				this.permitModelFormGroup.patchValue({ personalInformationData }, { emitEvent: false });

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
	 * Create an empty permit
	 * @returns
	 */
	createNewPermitAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.createEmptyPermitAnonymous(serviceTypeCode).pipe(
			tap((resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(resp.serviceTypeCode);
			})
		);
	}

	/**
	 * Load an existing permit application
	 * @param licenceAppId
	 * @returns
	 */
	private getPermitOfTypeUsingAccessCode(
		applicationTypeCode: ApplicationTypeCode,
		associatedLicence: LicenceResponse
	): Observable<PermitLicenceAppResponse> {
		return forkJoin([
			this.loadExistingPermitAnonymous(associatedLicence),
			this.licenceService.apiLicencesLicencePhotoGet(),
		]).pipe(
			catchError((error) => of(error)),
			switchMap((resps: any[]) => {
				const latestLicence = resps[0];
				const photoOfYourself = resps[1];

				if (applicationTypeCode === ApplicationTypeCode.Renewal) {
					return this.applyRenewalSpecificDataToModel(latestLicence, photoOfYourself);
				}

				return this.applyUpdateSpecificDataToModel(latestLicence, photoOfYourself);
			})
		);
	}

	/**
	 * Create an empty anonymous permit
	 * @returns
	 */

	private createEmptyPermitAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
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

		this.permitModelFormGroup.patchValue(
			{
				serviceTypeData: { serviceTypeCode: serviceTypeCode },
				permitRequirementData: { serviceTypeCode: serviceTypeCode },
				licenceTermData: { licenceTermCode: LicenceTermCode.FiveYears },
				profileConfirmationData: { isProfileUpToDate: true },
				characteristicsData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.permitModelFormGroup.value);
	}

	/**
	 * Submit the permit data
	 * @returns
	 */
	submitPermitAnonymous(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();

		const body = this.getSaveBodyBaseSubmitAnonymous(permitModelFormValue);
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
		return this.licenceAppDocumentService
			.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					// pass in the list of document ids that were in the original
					// application and are still being used
					body.previousDocumentIds = [...existingDocumentIds];

					return this.permitService.apiPermitApplicationsAnonymousSubmitChangePost$Response({
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
		return this.licenceAppDocumentService
			.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
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
								this.licenceAppDocumentService.apiLicenceApplicationDocumentsAnonymousFilesPost({
									body: {
										documents: newDocumentsOnly,
										licenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
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

					return this.permitService.apiPermitApplicationsAnonymousSubmitChangePost$Response({
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
	private loadExistingPermitAnonymous(associatedLicence: LicenceResponse): Observable<PermitLicenceAppResponse> {
		this.reset();

		return this.permitService.apiPermitApplicationGet().pipe(
			switchMap((permitLicenceAppl: PermitLicenceAppResponse) => {
				// remove reference to expired licence - data is only used in the Resume authenticated flow.
				permitLicenceAppl.expiredLicenceId = null;
				permitLicenceAppl.expiredLicenceNumber = null;
				permitLicenceAppl.hasExpiredLicence = false;

				return this.applyApplAndProfileIntoModel({ permitLicenceAppl, associatedLicence });
			})
		);
	}

	/*************************************************************/
	// COMMON
	/*************************************************************/

	/**
	 * Loads the a worker application and profile into the worker model
	 * @returns
	 */
	private loadLicenceApplAndProfile(
		permitLicenceAppl: PermitLicenceAppResponse,
		applicantProfile: ApplicantProfileResponse,
		associatedLicence?: MainLicenceResponse
	) {
		if (permitLicenceAppl.expiredLicenceId) {
			return this.licenceService.apiLicencesLicenceIdGet({ licenceId: permitLicenceAppl.expiredLicenceId }).pipe(
				switchMap((associatedExpiredLicence: LicenceResponse) => {
					return this.applyApplAndProfileIntoModel({
						permitLicenceAppl,
						applicantProfile,
						associatedLicence,
						associatedExpiredLicence,
					});
				})
			);
		}

		return this.applyApplAndProfileIntoModel({ permitLicenceAppl, applicantProfile, associatedLicence });
	}

	private applyApplAndProfileIntoModel({
		permitLicenceAppl,
		applicantProfile,
		associatedLicence,
		associatedExpiredLicence,
	}: {
		permitLicenceAppl: PermitLicenceAppResponse;
		applicantProfile?: ApplicantProfileResponse;
		associatedLicence?: MainLicenceResponse | LicenceResponse;
		associatedExpiredLicence?: LicenceResponse;
	}): Observable<any> {
		return this.applyProfileIntoModel({
			applicantProfile: applicantProfile ?? permitLicenceAppl,
			serviceTypeCode: permitLicenceAppl.serviceTypeCode,
			applicationTypeCode: permitLicenceAppl.applicationTypeCode,
			associatedLicence,
		}).pipe(
			switchMap((_resp: any) => {
				return this.applyApplIntoModel(permitLicenceAppl, associatedLicence, associatedExpiredLicence);
			})
		);
	}

	private applyProfileIntoModel({
		applicantProfile,
		serviceTypeCode,
		applicationTypeCode,
		associatedLicence,
		previousExpiredPermit,
	}: {
		applicantProfile: ApplicantProfileResponse | PermitLicenceAppResponse;
		serviceTypeCode?: ServiceTypeCode | undefined;
		applicationTypeCode?: ApplicationTypeCode | undefined;
		associatedLicence?: MainLicenceResponse | LicenceResponse;
		previousExpiredPermit?: MainLicenceResponse | undefined;
	}): Observable<any> {
		const serviceTypeData = { serviceTypeCode: serviceTypeCode };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };

		let hasBcscNameChanged = false;
		if (associatedLicence) {
			hasBcscNameChanged = 'hasLoginNameChanged' in associatedLicence ? associatedLicence?.hasLoginNameChanged : false;
		}

		let expiredLicenceData: any = null;
		if (previousExpiredPermit?.licenceId) {
			expiredLicenceData = this.getExpiredLicenceData(
				this.utilService.booleanToBooleanType(true),
				previousExpiredPermit
			);
		}

		const personalInformationData = {
			givenName: applicantProfile.givenName,
			middleName1: applicantProfile.middleName1,
			middleName2: applicantProfile.middleName2,
			surname: applicantProfile.surname,
			dateOfBirth: applicantProfile.dateOfBirth,
			genderCode: applicantProfile.genderCode,
			hasGenderChanged: false,
			hasBcscNameChanged,
			origGivenName: applicantProfile.givenName,
			origMiddleName1: applicantProfile.middleName1,
			origMiddleName2: applicantProfile.middleName2,
			origSurname: applicantProfile.surname,
			origDateOfBirth: applicantProfile.dateOfBirth,
			origGenderCode: applicantProfile.genderCode,
			cardHolderName: associatedLicence?.nameOnCard ?? null,
			licenceHolderName: associatedLicence?.licenceHolderName ?? null,
		};

		const originalLicenceData = {
			originalApplicationId: associatedLicence?.licenceAppId ?? null,
			originalLicenceId: associatedLicence?.licenceId ?? null,
			originalLicenceNumber: associatedLicence?.licenceNumber ?? null,
			originalExpiryDate: associatedLicence?.expiryDate ?? null,
			originalLicenceTermCode: associatedLicence?.licenceTermCode ?? null,
			originalBizTypeCode:
				'bizTypeCode' in applicantProfile ? applicantProfile.bizTypeCode : associatedLicence?.bizTypeCode,
		};

		let height = applicantProfile.height ? applicantProfile.height + '' : null;
		let heightInches = '';
		if (
			applicantProfile.heightUnitCode == HeightUnitCode.Inches &&
			applicantProfile.height &&
			applicantProfile.height > 0
		) {
			height = Math.trunc(applicantProfile.height / 12) + '';
			heightInches = (applicantProfile.height % 12) + '';
		}

		const characteristicsData = {
			hairColourCode: applicantProfile.hairColourCode,
			eyeColourCode: applicantProfile.eyeColourCode,
			height,
			heightUnitCode: applicantProfile.heightUnitCode ?? HeightUnitCode.Inches,
			heightInches,
			weight: applicantProfile.weight ? applicantProfile.weight + '' : null,
			weightUnitCode: applicantProfile.weightUnitCode ?? WeightUnitCode.Pounds,
		};

		const contactInformationData = {
			emailAddress: applicantProfile.emailAddress,
			phoneNumber: applicantProfile.phoneNumber,
		};

		const residentialAddressData = {
			addressSelected: true,
			addressLine1: applicantProfile.residentialAddress?.addressLine1,
			addressLine2: applicantProfile.residentialAddress?.addressLine2,
			city: applicantProfile.residentialAddress?.city,
			country: applicantProfile.residentialAddress?.country,
			postalCode: applicantProfile.residentialAddress?.postalCode,
			province: applicantProfile.residentialAddress?.province,
		};

		const mailingAddressData = {
			addressSelected: !!applicantProfile.mailingAddress,
			isAddressTheSame: false,
			addressLine1: applicantProfile.mailingAddress?.addressLine1,
			addressLine2: applicantProfile.mailingAddress?.addressLine2,
			city: applicantProfile.mailingAddress?.city,
			country: applicantProfile.mailingAddress?.country,
			postalCode: applicantProfile.mailingAddress?.postalCode,
			province: applicantProfile.mailingAddress?.province,
		};

		this.permitModelFormGroup.patchValue(
			{
				applicantId: 'applicantId' in applicantProfile ? applicantProfile.applicantId : null,
				serviceTypeData,
				applicationTypeData,
				originalLicenceData,
				expiredLicenceData,
				licenceTermData: { licenceTermCode: LicenceTermCode.FiveYears },
				profileConfirmationData: { isProfileUpToDate: true },
				personalInformationData,
				residentialAddressData,
				mailingAddressData,
				contactInformationData,
				aliasesData: {
					previousNameFlag: this.utilService.booleanToBooleanType(
						applicantProfile.aliases && applicantProfile.aliases.length > 0
					),
					aliases: [],
				},
				characteristicsData,
			},
			{
				emitEvent: false,
			}
		);

		const aliasesArray = this.permitModelFormGroup.get('aliasesData.aliases') as FormArray;
		applicantProfile.aliases?.forEach((alias: Alias) => {
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

		return of(this.permitModelFormGroup.value);
	}

	private applyApplIntoModel(
		permitLicenceAppl: PermitLicenceAppResponse,
		associatedLicence?: MainLicenceResponse | LicenceResponse,
		associatedExpiredLicence?: LicenceResponse
	): Observable<any> {
		const serviceTypeData = { serviceTypeCode: permitLicenceAppl.serviceTypeCode };
		const applicationTypeData = { applicationTypeCode: permitLicenceAppl.applicationTypeCode };

		const hasExpiredLicence = permitLicenceAppl.hasExpiredLicence ?? false;
		const expiredLicenceData = this.getExpiredLicenceData(
			this.utilService.booleanToBooleanType(hasExpiredLicence),
			associatedExpiredLicence
		);

		const licenceTermData = {
			licenceTermCode: permitLicenceAppl.licenceTermCode,
		};

		const bcDriversLicenceData = {
			hasBcDriversLicence: this.utilService.booleanToBooleanType(permitLicenceAppl.hasBcDriversLicence),
			bcDriversLicenceNumber: permitLicenceAppl.bcDriversLicenceNumber,
		};

		// if this is a permit update, use the data supplied in 'updateLicenceData' (where applicable),
		// other use the data in the 'resp'
		const permitLicenceData = associatedLicence ?? permitLicenceAppl;

		const bodyArmourRequirementFormGroup = {
			isOutdoorRecreation: permitLicenceData.bodyArmourPermitReasonCodes?.includes(
				BodyArmourPermitReasonCode.OutdoorRecreation
			),
			isPersonalProtection: permitLicenceData.bodyArmourPermitReasonCodes?.includes(
				BodyArmourPermitReasonCode.PersonalProtection
			),
			isMyEmployment: permitLicenceData.bodyArmourPermitReasonCodes?.includes(BodyArmourPermitReasonCode.MyEmployment),
			isTravelForConflict: permitLicenceData.bodyArmourPermitReasonCodes?.includes(
				BodyArmourPermitReasonCode.TravelInResponseToInternationalConflict
			),
			isOther: permitLicenceData.bodyArmourPermitReasonCodes?.includes(BodyArmourPermitReasonCode.Other),
		};

		const armouredVehicleRequirementFormGroup = {
			isPersonalProtection: permitLicenceData.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.PersonalProtection
			),
			isMyEmployment: permitLicenceData.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.MyEmployment
			),
			isProtectionOfAnotherPerson: permitLicenceData.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.ProtectionOfAnotherPerson
			),
			isProtectionOfPersonalProperty: permitLicenceData.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.ProtectionOfPersonalProperty
			),
			isProtectionOfOthersProperty: permitLicenceData.armouredVehiclePermitReasonCodes?.includes(
				ArmouredVehiclePermitReasonCode.ProtectionOfOtherProperty
			),
			isOther: permitLicenceData.armouredVehiclePermitReasonCodes?.includes(ArmouredVehiclePermitReasonCode.Other),
		};

		const permitRequirementData = {
			serviceTypeCode: permitLicenceAppl.serviceTypeCode,
			bodyArmourRequirementFormGroup: bodyArmourRequirementFormGroup,
			armouredVehicleRequirementFormGroup: armouredVehicleRequirementFormGroup,
			otherReason: permitLicenceData.permitOtherRequiredReason,
		};

		const employerData = {
			employerName: permitLicenceData.employerName,
			supervisorName: permitLicenceData.supervisorName,
			supervisorEmailAddress: permitLicenceData.supervisorEmailAddress,
			supervisorPhoneNumber: permitLicenceData.supervisorPhoneNumber,
			addressSelected: !!permitLicenceData.employerPrimaryAddress?.addressLine1,
			addressLine1: permitLicenceData.employerPrimaryAddress?.addressLine1,
			addressLine2: permitLicenceData.employerPrimaryAddress?.addressLine2,
			city: permitLicenceData.employerPrimaryAddress?.city,
			postalCode: permitLicenceData.employerPrimaryAddress?.postalCode,
			province: permitLicenceData.employerPrimaryAddress?.province,
			country: permitLicenceData.employerPrimaryAddress?.country,
		};

		const citizenshipData: {
			isCanadianCitizen: BooleanTypeCode | null;
			isCanadianResident: BooleanTypeCode | null;
			canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
			proofOfResidentStatusCode: LicenceDocumentTypeCode | null;
			proofOfCitizenshipCode: LicenceDocumentTypeCode | null;
			expiryDate: string | null;
			documentIdNumber: string | null;
			attachments: File[];
		} = {
			isCanadianCitizen: this.utilService.booleanToBooleanType(permitLicenceAppl.isCanadianCitizen),
			isCanadianResident: this.utilService.booleanToBooleanType(permitLicenceAppl.isCanadianResident),
			canadianCitizenProofTypeCode: null,
			proofOfResidentStatusCode: null,
			proofOfCitizenshipCode: null,
			expiryDate: null,
			documentIdNumber: null,
			attachments: [],
		};

		const rationaleAttachments: Array<File> = [];
		const citizenshipDataAttachments: Array<File> = [];
		const photographOfYourselfAttachments: Array<File> = [];
		let photographOfYourselfLastUploadedDateTime = '';

		if (associatedLicence) {
			associatedLicence?.rationalDocumentInfos?.forEach((doc: Document) => {
				const aFile = this.fileUtilService.dummyFile(doc);
				rationaleAttachments.push(aFile);
			});
		}

		permitLicenceAppl.documentInfos?.forEach((doc: Document) => {
			switch (doc.licenceDocumentTypeCode) {
				case LicenceDocumentTypeCode.DriversLicenceAdditional:
				case LicenceDocumentTypeCode.PermanentResidentCardAdditional:
				case LicenceDocumentTypeCode.Bcid:
				case LicenceDocumentTypeCode.BcServicesCard:
				case LicenceDocumentTypeCode.CanadianFirearmsLicence:
				case LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional:
				case LicenceDocumentTypeCode.PassportAdditional: {
					// remove Gov Issued uploads
					break;
				}
				case LicenceDocumentTypeCode.BirthCertificate: //ProofOfCanadianCitizenshipTypes
				case LicenceDocumentTypeCode.CertificateOfIndianStatusForCitizen:
				case LicenceDocumentTypeCode.CanadianPassport:
				case LicenceDocumentTypeCode.CanadianCitizenship:
				case LicenceDocumentTypeCode.DriversLicence: //PermitProofOfCitizenshipTypes
				case LicenceDocumentTypeCode.GovernmentIssuedPhotoId:
				case LicenceDocumentTypeCode.NonCanadianPassport:
				case LicenceDocumentTypeCode.ConfirmationOfPermanentResidenceDocument: //PermitProofOfResidenceStatusTypes
				case LicenceDocumentTypeCode.PermanentResidentCard:
				case LicenceDocumentTypeCode.RecordOfLandingDocument:
				case LicenceDocumentTypeCode.StudyPermit:
				case LicenceDocumentTypeCode.WorkPermit: {
					const aFile = this.fileUtilService.dummyFile(doc);
					citizenshipDataAttachments.push(aFile);

					citizenshipData.canadianCitizenProofTypeCode = permitLicenceAppl.isCanadianCitizen
						? doc.licenceDocumentTypeCode
						: null;
					citizenshipData.proofOfResidentStatusCode =
						!permitLicenceAppl.isCanadianCitizen && permitLicenceAppl.isCanadianResident
							? doc.licenceDocumentTypeCode
							: null;
					citizenshipData.proofOfCitizenshipCode =
						!permitLicenceAppl.isCanadianCitizen && !permitLicenceAppl.isCanadianResident
							? doc.licenceDocumentTypeCode
							: null;
					citizenshipData.expiryDate = doc.expiryDate ?? null;
					citizenshipData.documentIdNumber = doc.documentIdNumber ?? null;
					citizenshipData.attachments = citizenshipDataAttachments;
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
				case LicenceDocumentTypeCode.ArmouredVehicleRationale:
				case LicenceDocumentTypeCode.BodyArmourRationale: {
					if (!associatedLicence) {
						const aFile = this.fileUtilService.dummyFile(doc);
						rationaleAttachments.push(aFile);
					}
					break;
				}
			}
		});

		if (associatedLicence?.photoDocumentInfo) {
			const doc: Document = {
				documentExtension: associatedLicence?.photoDocumentInfo.documentExtension,
				documentName: associatedLicence?.photoDocumentInfo.documentName,
				documentUrlId: associatedLicence?.photoDocumentInfo.documentUrlId,
				expiryDate: associatedLicence?.photoDocumentInfo.expiryDate,
				licenceAppId: permitLicenceAppl.licenceAppId,
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

		const permitRationaleData = {
			rationale: permitLicenceData.rationale,
			attachments: rationaleAttachments,
		};

		this.permitModelFormGroup.patchValue(
			{
				licenceAppId: permitLicenceAppl.licenceAppId,
				caseNumber: permitLicenceAppl.caseNumber,
				serviceTypeData,
				permitRequirementData,
				permitRationaleData,
				employerData,
				applicationTypeData,
				expiredLicenceData,
				licenceTermData,
				bcDriversLicenceData,
				citizenshipData,
				photographOfYourselfData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.permitModelFormGroup.value);
	}

	private applyRenewalSpecificDataToModel(resp: any, photoOfYourself: Blob | null): Observable<any> {
		const serviceTypeData = { serviceTypeCode: resp.serviceTypeData.serviceTypeCode };
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };
		const permitRequirementData = { serviceTypeCode: resp.serviceTypeData.serviceTypeCode };

		const originalLicenceData = resp.originalLicenceData;
		originalLicenceData.originalLicenceTermCode = resp.licenceTermData.licenceTermCode;

		const licenceTermData = {
			licenceTermCode: LicenceTermCode.FiveYears,
		};

		const photographOfYourselfData = resp.photographOfYourselfData;

		const originalPhotoOfYourselfLastUploadDateTime = resp.photographOfYourselfData.uploadedDateTime;
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

		this.permitModelFormGroup.patchValue(
			{
				licenceAppId: null,
				serviceTypeData,
				applicationTypeData,
				originalLicenceData,

				profileConfirmationData: { isProfileUpToDate: false },
				permitRequirementData,
				licenceTermData,
				photographOfYourselfData,
			},
			{
				emitEvent: false,
			}
		);

		return this.setPhotographOfYourself(photoOfYourself).pipe(
			switchMap((_resp: any) => {
				return of(this.permitModelFormGroup.value);
			})
		);
	}

	private applyUpdateSpecificDataToModel(resp: any, photoOfYourself: Blob | null): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };
		const permitRequirementData = { serviceTypeCode: resp.serviceTypeData.serviceTypeCode };
		const originalLicenceData = resp.originalLicenceData;
		const photographOfYourselfData = resp.photographOfYourselfData;

		originalLicenceData.originalLicenceTermCode = resp.licenceTermData.licenceTermCode;

		// if the photo is missing, set the flag as expired so that it is required
		if (!this.isPhotographOfYourselfEmpty(photoOfYourself)) {
			originalLicenceData.originalPhotoOfYourselfExpired = true;
		}

		if (originalLicenceData.originalPhotoOfYourselfExpired) {
			// set flag - user will be updating their photo
			photographOfYourselfData.updatePhoto = BooleanTypeCode.Yes;
		}

		const licenceTermData = {
			licenceTermCode: LicenceTermCode.FiveYears,
		};

		this.permitModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceData,
				profileConfirmationData: { isProfileUpToDate: false },
				permitRequirementData,
				licenceTermData,
				photographOfYourselfData,
			},
			{
				emitEvent: false,
			}
		);

		return this.setPhotographOfYourself(photoOfYourself).pipe(
			switchMap((_resp: any) => {
				return of(this.permitModelFormGroup.value);
			})
		);
	}
}
