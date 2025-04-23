import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	ApplicantProfileResponse,
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	Document,
	GdsdTeamAppCommandResponse,
	GdsdTeamLicenceAppAnonymousSubmitRequest,
	GdsdTeamLicenceAppChangeRequest,
	GoogleRecaptcha,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	LicenceTermCode,
	ServiceTypeCode,
} from '@app/api/models';
import {
	ApplicantProfileService,
	GdsdTeamLicensingService,
	LicenceAppDocumentService,
	LicenceService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { NgxMaskPipe } from 'ngx-mask';
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
import { FileUtilService } from './file-util.service';
import { RetiredDogApplicationHelper } from './retired-dog-application.helper';
import { LicenceDocumentsToSave, UtilService } from './util.service';

// export interface RetiredDogRequestExt extends GdsdTeamLicenceAppUpsertRequest RetiredDogRequest { // TODO RetiredDogRequestExt, RetiredDogChangeRequestExt
// 	documentInfos?: Array<Document> | null;
// }
// export interface RetiredDogChangeRequestExt extends RetiredDogChangeRequest {
// 	documentInfos?: Array<Document> | null;
// }

@Injectable({
	providedIn: 'root',
})
export class RetiredDogApplicationService extends RetiredDogApplicationHelper {
	retiredDogModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	retiredDogModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(),
		applicationOriginTypeCode: new FormControl(), // placeholder to save
		bizTypeCode: new FormControl(), // placeholder to save
		licenceTermCode: new FormControl(), // placeholder to save
		originalLicenceData: this.originalLicenceFormGroup, // placeholder to store data

		serviceTypeData: this.serviceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		termsAndConditionsData: this.termsAndConditionsFormGroup,

		personalInformationData: this.personalInformationFormGroup,
		dogGdsdCertificateData: this.dogGdsdCertificateFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		dogInfoData: this.dogInfoFormGroup,
		dogRetiredData: this.dogRetiredForm,
		dogLivingData: this.dogLivingForm,
	});

	retiredDogModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		utilService: UtilService,
		maskPipe: NgxMaskPipe,
		private authenticationService: AuthenticationService,
		private authUserBcscService: AuthUserBcscService,
		private fileUtilService: FileUtilService,
		private applicantProfileService: ApplicantProfileService,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private gdsdTeamLicensingService: GdsdTeamLicensingService,
		private licenceService: LicenceService
	) {
		super(formBuilder, utilService, maskPipe);

		this.retiredDogModelChangedSubscription = this.retiredDogModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepRetiredDogPersonalInfoComplete();
					const step2Complete = this.isStepRetiredDogDogInfoComplete();
					const isValid = step1Complete && step2Complete;

					console.debug(
						'retiredDogModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						this.retiredDogModelFormGroup.getRawValue()
					);
					this.updateModelChangeFlags();
					this.retiredDogModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepRetiredDogPersonalInfoComplete(): boolean {
		let dogGdsdCertificateDataValid = true;
		if (this.applicationTypeFormGroup.get('applicationTypeCode')?.value == ApplicationTypeCode.New) {
			dogGdsdCertificateDataValid = this.dogGdsdCertificateFormGroup.valid;
		}

		return (
			this.personalInformationFormGroup.valid &&
			dogGdsdCertificateDataValid &&
			this.photographOfYourselfFormGroup.valid &&
			this.mailingAddressFormGroup.valid
		);
	}

	/**
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepRetiredDogDogInfoComplete(): boolean {
		let dogRetiredDataValid = true;
		if (this.applicationTypeFormGroup.get('applicationTypeCode')?.value == ApplicationTypeCode.New) {
			dogRetiredDataValid = this.dogRetiredForm.valid;
		}

		return this.dogInfoFormGroup.valid && dogRetiredDataValid && this.dogLivingForm.valid;
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.retiredDogModelFormGroup.reset();

		console.debug('RESET', this.initialized, this.retiredDogModelFormGroup.value);
	}

	/*************************************************************/
	// AUTHENTICATED
	/*************************************************************/

	/**
	 * Create an empty authenticated licence
	 * @returns
	 */
	createNewApplAuthenticated(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.applicantProfileService
			.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
			.pipe(
				switchMap((applicantProfile: ApplicantProfileResponse) => {
					return this.createEmptyApplAuthenticated(applicantProfile, serviceTypeCode, ApplicationTypeCode.New).pipe(
						tap((_resp: any) => {
							this.initialized = true;

							this.commonApplicationService.setGdsdApplicationTitle(serviceTypeCode, ApplicationTypeCode.New);
						})
					);
				})
			);
	}

	private createEmptyApplAuthenticated(
		applicantProfile: ApplicantProfileResponse,
		serviceTypeCode: ServiceTypeCode,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		this.reset();

		const serviceTypeData = { serviceTypeCode };
		const applicationTypeData = { applicationTypeCode };

		const personalInformationData = {
			givenName: applicantProfile.givenName,
			middleName: applicantProfile.middleName1,
			surname: applicantProfile.surname,
			dateOfBirth: applicantProfile.dateOfBirth,
			phoneNumber: applicantProfile.phoneNumber,
			emailAddress: applicantProfile.emailAddress,
			hasBcscNameChanged: false,
		};

		const bcscMailingAddress = applicantProfile.mailingAddress;
		const mailingAddressData = {
			addressSelected: !!bcscMailingAddress && !!bcscMailingAddress.addressLine1,
			isAddressTheSame: false,
			addressLine1: bcscMailingAddress?.addressLine1,
			addressLine2: bcscMailingAddress?.addressLine2,
			city: bcscMailingAddress?.city,
			country: bcscMailingAddress?.country,
			postalCode: bcscMailingAddress?.postalCode,
			province: bcscMailingAddress?.province,
		};

		this.retiredDogModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				serviceTypeData,
				licenceTermCode: LicenceTermCode.TwoYears,
				applicationTypeData,

				personalInformationData,
				mailingAddressData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.retiredDogModelFormGroup.value);
	}

	/**
	 * Partial Save - Save the data as is.
	 * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	 */
	partialSaveLicenceStepAuthenticated(_isSaveAndExit?: boolean): any {
		//} Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const retiredDogModelFormValue = this.retiredDogModelFormGroup.getRawValue();
		return of(retiredDogModelFormValue);
		// console.debug('[partialSaveLicenceStepAuthenticated] retiredDogModelFormValue', retiredDogModelFormValue);

		// const body = this.getSaveBodyBaseNew(retiredDogModelFormValue) as GdsdTeamLicenceAppUpsertRequest;

		// body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		// return this.gdsdLicensingService.apiGdsdTeamAppPost$Response({ body }).pipe(
		// 	take(1),
		// 	tap((res: StrictHttpResponse<GdsdAppCommandResponse>) => {
		// 		this.hasValueChanged = false;

		// 		let msg = 'Your application has been saved';
		// 		if (isSaveAndExit) {
		// 			msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
		// 		}
		// 		this.utilService.toasterSuccess(msg);

		// 		if (!retiredDogModelFormValue.licenceAppId) {
		// 			this.retiredDogModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
		// 		}
		// 	})
		// );
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
	 * Determine if the Save & Exit process can occur
	 * @returns boolean
	 */
	isSaveAndExit(): boolean {
		const isLoggedIn = this.authenticationService.isLoggedIn();
		if (!isLoggedIn) {
			return false;
		}

		if (this.applicationTypeFormGroup.get('applicationTypeCode')?.value != ApplicationTypeCode.New) {
			return false;
		}

		return true;
	}

	/**
	 * Upload a file of a certain type. Return a reference to the file that will used when the licence is saved
	 * @param documentCode
	 * @param document
	 * @returns
	 */
	addUploadDocument(
		documentCode: LicenceDocumentTypeCode,
		documentFile: File
	): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
		return this.licenceAppDocumentService.apiLicenceApplicationDocumentsLicenceAppIdFilesPost$Response({
			licenceAppId: this.retiredDogModelFormGroup.get('licenceAppId')?.value,
			body: {
				documents: [documentFile],
				licenceDocumentTypeCode: documentCode,
			},
		});
	}

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/
	/**
	 * Create an empty application
	 * @returns
	 */
	createNewApplAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.createEmptyApplAnonymous(serviceTypeCode).pipe(
			tap((_resp: any) => {
				this.initialized = true;
				this.commonApplicationService.setGdsdApplicationTitle(serviceTypeCode);
			})
		);
	}

	/**
	 * Create an empty anonymous Gdsd
	 * @returns
	 */
	private createEmptyApplAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		this.reset();

		const serviceTypeData = { serviceTypeCode };

		this.retiredDogModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				licenceTermCode: LicenceTermCode.TwoYears,
				serviceTypeData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.retiredDogModelFormGroup.value);
	}

	/**
	 * Overwrite or change any data specific to the renewal flow
	 */
	private applyRenewalDataUpdatesToModel(retiredDogModelData: any, photoOfYourself: Blob): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		const photographOfYourselfData = retiredDogModelData.photographOfYourselfData;
		const originalLicenceData = retiredDogModelData.originalLicenceData;

		const originalPhotoOfYourselfLastUploadDateTime = retiredDogModelData.photographOfYourselfData.uploadedDateTime;
		originalLicenceData.originalPhotoOfYourselfExpired = this.utilService.getIsDate5YearsOrOlder(
			originalPhotoOfYourselfLastUploadDateTime
		);

		if (originalLicenceData.originalPhotoOfYourselfExpired) {
			// set flag - user will be forced to update their photo
			photographOfYourselfData.updatePhoto = BooleanTypeCode.Yes;
		}

		this.retiredDogModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				originalLicenceData,
				photographOfYourselfData,
			},
			{
				emitEvent: false,
			}
		);

		return this.setPhotographOfYourself(photoOfYourself).pipe(
			switchMap((_resp: any) => {
				return of(this.retiredDogModelFormGroup.value);
			})
		);
	}

	/**
	 * Overwrite or change any data specific to the replacment flow
	 */
	private applyReplacementDataUpdatesToModel(): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

		this.retiredDogModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.retiredDogModelFormGroup.value);
	}

	/**
	 * Apply the data from the Licence and Applicant Profile into the main model
	 */
	private applyLicenceProfileIntoModel(
		applicantProfile: ApplicantProfileResponse,
		associatedLicence: MainLicenceResponse | LicenceResponse
	): Observable<any> {
		return this.applyLicenceIntoModel(associatedLicence).pipe(
			switchMap((_resp: any) => {
				return this.applyProfileIntoModel(applicantProfile);
			})
		);
	}

	/**
	 * Apply the applicant profile data into the main model
	 */
	private applyProfileIntoModel(applicantProfile: ApplicantProfileResponse): Observable<any> {
		const personalInformationData = {
			givenName: applicantProfile.givenName,
			middleName: applicantProfile.middleName1,
			surname: applicantProfile.surname,
			dateOfBirth: applicantProfile.dateOfBirth,
			phoneNumber: applicantProfile.phoneNumber,
			emailAddress: applicantProfile.emailAddress,
			hasBcscNameChanged: false,
		};

		const bcscMailingAddress = applicantProfile?.mailingAddress;
		const mailingAddressData = {
			addressSelected: !!bcscMailingAddress && !!bcscMailingAddress.addressLine1,
			isAddressTheSame: false,
			addressLine1: bcscMailingAddress?.addressLine1,
			addressLine2: bcscMailingAddress?.addressLine2,
			city: bcscMailingAddress?.city,
			country: bcscMailingAddress?.country,
			postalCode: bcscMailingAddress?.postalCode,
			province: bcscMailingAddress?.province,
		};

		this.retiredDogModelFormGroup.patchValue(
			{
				personalInformationData,
				mailingAddressData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.retiredDogModelFormGroup.value);
	}

	/**
	 * Apply the licence data into the main model
	 */
	private applyLicenceIntoModel(associatedLicence: MainLicenceResponse | LicenceResponse): Observable<any> {
		const serviceTypeData = { serviceTypeCode: associatedLicence.serviceTypeCode };
		const personalInformationData = this.personalInformationFormGroup.value;

		if (associatedLicence && 'hasLoginNameChanged' in associatedLicence) {
			personalInformationData.hasBcscNameChanged = associatedLicence.hasLoginNameChanged ?? false;
		}

		const originalLicenceData = {
			originalApplicationId: associatedLicence?.licenceAppId ?? null,
			originalLicenceId: associatedLicence?.licenceId ?? null,
			originalLicenceNumber: associatedLicence?.licenceNumber ?? null,
			originalExpiryDate: associatedLicence?.expiryDate ?? null,
			originalLicenceTermCode: associatedLicence?.licenceTermCode ?? null,
			originalLicenceHolderName: associatedLicence?.licenceHolderName ?? null,
			originalLicenceHolderId: associatedLicence?.licenceHolderId ?? null,
			originalPhotoOfYourselfExpired: null,
		};

		let dogInfoData = {};
		if (associatedLicence.dogInfo) {
			dogInfoData = {
				dogName: associatedLicence.dogInfo.dogName,
				dogDateOfBirth: associatedLicence.dogInfo.dogDateOfBirth,
				dogBreed: associatedLicence.dogInfo.dogBreed,
				dogColorAndMarkings: associatedLicence.dogInfo.dogColorAndMarkings,
				dogGender: associatedLicence.dogInfo.dogGender,
				microchipNumber: associatedLicence.dogInfo.microchipNumber,
			};
		}

		const photographOfYourselfAttachments: Array<File> = [];
		let photographOfYourselfLastUploadedDateTime = '';

		if (associatedLicence.photoDocumentInfo) {
			const doc: Document = {
				documentExtension: associatedLicence?.photoDocumentInfo.documentExtension,
				documentName: associatedLicence?.photoDocumentInfo.documentName,
				documentUrlId: associatedLicence?.photoDocumentInfo.documentUrlId,
				expiryDate: associatedLicence?.photoDocumentInfo.expiryDate,
				licenceAppId: associatedLicence.licenceAppId,
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

		this.retiredDogModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				serviceTypeData,
				licenceTermCode: associatedLicence.licenceTermCode,
				originalLicenceData,
				dogId: associatedLicence?.dogId,

				personalInformationData,
				photographOfYourselfData,
				dogInfoData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.retiredDogModelFormGroup.value);
	}

	/**
	 * Load an existing licence application with an access code
	 * @param licenceAppId
	 * @returns
	 */
	getLicenceWithAccessCodeAnonymous(
		associatedLicence: LicenceResponse,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		return this.getLicenceOfTypeUsingAccessCodeAnonymous(applicationTypeCode, associatedLicence).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setGdsdApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					associatedLicence.licenceNumber!
				);
			})
		);
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
		if (applicationTypeCode === ApplicationTypeCode.Renewal) {
			return forkJoin([
				this.applicantProfileService.apiApplicantGet(),
				this.licenceService.apiLicencesLicencePhotoGet(),
			]).pipe(
				catchError((error) => of(error)),
				switchMap((resps: any[]) => {
					const applicantProfile = resps[0];
					const photoOfYourself = resps[1];

					return this.applyLicenceProfileIntoModel(applicantProfile, associatedLicence).pipe(
						switchMap((retiredDogModelData: any) => {
							return this.applyRenewalDataUpdatesToModel(retiredDogModelData, photoOfYourself);
						})
					);
				})
			);
		}

		// is Replacement
		return this.applicantProfileService.apiApplicantGet().pipe(
			switchMap((applicantProfile: ApplicantProfileResponse) => {
				return this.applyLicenceProfileIntoModel(applicantProfile, associatedLicence).pipe(
					switchMap((_resp: any) => {
						return this.applyReplacementDataUpdatesToModel();
					})
				);
			})
		);
	}

	/**
	 * Submit the application data for anonymous new
	 */
	submitLicenceAnonymous(): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		// TODO fix rt submitLicenceAnonymous
		const gdsdModelFormValue = this.retiredDogModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseNew(gdsdModelFormValue) as GdsdTeamLicenceAppAnonymousSubmitRequest;
		const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

		// const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		// body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		// const originalLicenceData = gdsdModelFormValue.originalLicenceData;
		// body.applicantId = originalLicenceData.originalLicenceHolderId;

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

		// delete body.documentInfos; // TODO uncomment

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.submitLicenceAnonymousDocuments(
			googleRecaptcha,
			[],
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	/**
	 * Submit the application data for anonymous replacement
	 */
	submitLicenceReplacementAnonymous(): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		const gdsdModelFormValue = this.retiredDogModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseChange(gdsdModelFormValue);
		const mailingAddressData = this.mailingAddressFormGroup.getRawValue();

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];
		body.documentInfos?.forEach((doc: Document) => {
			if (doc.documentUrlId) {
				existingDocumentIds.push(doc.documentUrlId);
			}
		});

		delete body.documentInfos;

		const originalLicenceData = gdsdModelFormValue.originalLicenceData; // TODO not done in other flows?
		body.applicantId = originalLicenceData.originalLicenceHolderId;

		const googleRecaptcha = { recaptchaCode: mailingAddressData.captchaFormGroup.token };
		return this.submitLicenceAnonymousDocuments(googleRecaptcha, existingDocumentIds, null, body);
	}

	/**
	 * Submit the application data for anonymous renewal or replacement including documents
	 * @returns
	 */
	private submitLicenceAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSaveApis: Observable<string>[] | null,
		body: GdsdTeamLicenceAppChangeRequest
	): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		// TODO RetiredDogRequest
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

						return this.postSubmitAnonymous(body);
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

						return this.postSubmitAnonymous(body);
					})
				)
				.pipe(take(1));
		}
	}

	/**
	 * Submit the application data for anonymous
	 * @returns
	 */
	private postSubmitAnonymous(
		body: GdsdTeamLicenceAppChangeRequest
	): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		if (body.applicationTypeCode == ApplicationTypeCode.New) {
			return this.gdsdTeamLicensingService.apiGdsdTeamAppAnonymousSubmitPost$Response({ body }).pipe(
				tap((_resp: any) => {
					const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
						body.serviceTypeCode!,
						body.applicationTypeCode!
					);
					this.utilService.toasterSuccess(successMessage);
				})
			);
		}

		return this.gdsdTeamLicensingService.apiGdsdTeamAppAnonymousChangePost$Response({ body }).pipe(
			tap((_resp: any) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					body.serviceTypeCode!,
					body.applicationTypeCode!
				);
				this.utilService.toasterSuccess(successMessage);
			})
		);
	}
}
