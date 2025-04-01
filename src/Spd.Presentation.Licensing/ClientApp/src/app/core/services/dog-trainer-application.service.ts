import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	ApplicantProfileResponse,
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	Document,
	DogSchoolResponse,
	DogTrainerAppCommandResponse,
	DogTrainerChangeRequest,
	DogTrainerRequest,
	GdsdAppCommandResponse,
	GdsdTeamLicenceAppAnonymousSubmitRequest,
	GdsdTeamLicenceAppChangeRequest,
	GoogleRecaptcha,
	IActionResult,
	LicenceDocumentTypeCode,
	LicenceResponse,
	LicenceTermCode,
	ServiceTypeCode,
} from '@app/api/models';
import {
	ApplicantProfileService,
	DogTrainerLicensingService,
	LicenceAppDocumentService,
	LicenceService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
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
import { CommonApplicationService, MainLicenceResponse } from './common-application.service';
import { ConfigService } from './config.service';
import { DogTrainerApplicationHelper } from './dog-trainer-application.helper';
import { FileUtilService } from './file-util.service';
import { LicenceDocumentsToSave, UtilService } from './util.service';

// export interface DogTrainerRequestExt extends DogTrainerRequest {  // TODO DogTrainerRequest
// 	documentInfos?: Array<Document> | null;
// }
// export interface DogTrainerChangeRequestExt extends DogTrainerChangeRequest {// TODO DogTrainerChangeRequest
// 	documentInfos?: Array<Document> | null;
// }

@Injectable({
	providedIn: 'root',
})
export class DogTrainerApplicationService extends DogTrainerApplicationHelper {
	dogTrainerModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	dogTrainerModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(),
		applicationOriginTypeCode: new FormControl(), // placeholder to save
		bizTypeCode: new FormControl(), // placeholder to save
		licenceTermCode: new FormControl(), // placeholder to save
		originalLicenceData: this.originalLicenceFormGroup, // placeholder to store data

		serviceTypeData: this.serviceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		termsAndConditionsData: this.termsAndConditionsFormGroup,

		trainingSchoolInfoData: this.trainingSchoolInfoFormGroup,
		dogTrainerData: this.dogTrainerFormGroup,
		dogTrainerAddressData: this.dogTrainerAddressFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
	});

	dogTrainerModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		utilService: UtilService,
		maskPipe: NgxMaskPipe,
		private fileUtilService: FileUtilService,
		private applicantProfileService: ApplicantProfileService,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private dogTrainerLicensingService: DogTrainerLicensingService,
		private licenceService: LicenceService,
		private configService: ConfigService
	) {
		super(formBuilder, utilService, maskPipe);

		this.dogTrainerModelChangedSubscription = this.dogTrainerModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepDogTrainerPersonalInfoComplete();
					const step2Complete = this.isStepDogTrainerTrainingSchoolComplete();
					const isValid = step1Complete && step2Complete;

					console.debug(
						'dogTrainerModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						this.dogTrainerModelFormGroup.getRawValue()
					);
					this.updateModelChangeFlags();
					this.dogTrainerModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepDogTrainerTrainingSchoolComplete(): boolean {
		if (this.applicationTypeFormGroup.get('applicationTypeCode')?.value != ApplicationTypeCode.New) {
			return true;
		}

		return this.trainingSchoolInfoFormGroup.valid;
	}

	/**
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepDogTrainerPersonalInfoComplete(): boolean {
		return (
			this.dogTrainerFormGroup.valid &&
			this.dogTrainerAddressFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.governmentPhotoIdFormGroup.valid
		);
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.dogTrainerModelFormGroup.reset();

		console.debug('RESET', this.initialized, this.dogTrainerModelFormGroup.value);
	}

	/**
	 * Create an empty application
	 * @returns
	 */
	createNewApplAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.configService.getAccreditedDogSchools().pipe(
			switchMap((_resp: DogSchoolResponse[]) => {
				return this.createEmptyApplAnonymous(serviceTypeCode).pipe(
					tap((_resp: any) => {
						this.initialized = true;
						this.commonApplicationService.setGdsdApplicationTitle(serviceTypeCode);
					})
				);
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

		this.dogTrainerModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				licenceTermCode: LicenceTermCode.TwoYears,
				serviceTypeData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.dogTrainerModelFormGroup.value);
	}

	/**
	 * Overwrite or change any data specific to the renewal flow
	 */
	private applyRenewalDataUpdatesToModel(dogTrainerModelData: any, photoOfYourself: Blob): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		const photographOfYourselfData = dogTrainerModelData.photographOfYourselfData;
		const originalLicenceData = dogTrainerModelData.originalLicenceData;

		const originalPhotoOfYourselfLastUploadDateTime = dogTrainerModelData.photographOfYourselfData.uploadedDateTime;
		originalLicenceData.originalPhotoOfYourselfExpired = this.utilService.getIsDate5YearsOrOlder(
			originalPhotoOfYourselfLastUploadDateTime
		);

		if (originalLicenceData.originalPhotoOfYourselfExpired) {
			// set flag - user will be forced to update their photo
			photographOfYourselfData.updatePhoto = BooleanTypeCode.Yes;
		}

		this.dogTrainerModelFormGroup.patchValue(
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
				console.debug('[applyRenewalDataUpdatesToModel] dogTrainerModelFormGroup', this.dogTrainerModelFormGroup.value);
				return of(this.dogTrainerModelFormGroup.value);
			})
		);
	}

	/**
	 * Overwrite or change any data specific to the replacment flow
	 */
	private applyReplacementDataUpdatesToModel(dogTrainerModelData: any): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };
		const dogTrainerAddressData = dogTrainerModelData.dogTrainerAddressData;

		this.mailingAddressFormGroup.patchValue({
			addressSelected: !!dogTrainerAddressData && !!dogTrainerAddressData.addressLine1,
			isAddressTheSame: false,
			addressLine1: dogTrainerAddressData?.addressLine1,
			addressLine2: dogTrainerAddressData?.addressLine2,
			city: dogTrainerAddressData?.city,
			country: dogTrainerAddressData?.country,
			postalCode: dogTrainerAddressData?.postalCode,
			province: dogTrainerAddressData?.province,
		});

		const captchaFormGroup = this.mailingAddressFormGroup.get('captchaFormGroup') as FormGroup;
		captchaFormGroup.patchValue({ displayCaptcha: true });

		this.dogTrainerModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyReplacementDataUpdatesToModel] dogTrainerModelFormGroup', this.dogTrainerModelFormGroup.value);
		return of(this.dogTrainerModelFormGroup.value);
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
		const dogTrainerData = {
			trainerGivenName: applicantProfile.givenName,
			trainerMiddleName: applicantProfile.middleName1,
			trainerSurname: applicantProfile.surname,
			trainerDateOfBirth: applicantProfile.dateOfBirth,
			trainerPhoneNumber: applicantProfile.phoneNumber,
			trainerEmailAddress: applicantProfile.emailAddress,
		};

		const applicantMailingAddress = applicantProfile?.mailingAddress;
		const dogTrainerAddressData = {
			addressSelected: !!applicantMailingAddress && !!applicantMailingAddress.addressLine1,
			isAddressTheSame: false,
			addressLine1: applicantMailingAddress?.addressLine1,
			addressLine2: applicantMailingAddress?.addressLine2,
			city: applicantMailingAddress?.city,
			country: applicantMailingAddress?.country,
			postalCode: applicantMailingAddress?.postalCode,
			province: applicantMailingAddress?.province,
		};

		this.dogTrainerModelFormGroup.patchValue(
			{
				dogTrainerData,
				dogTrainerAddressData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyProfileIntoModel] dogTrainerModelFormGroup', this.dogTrainerModelFormGroup.value);
		return of(this.dogTrainerModelFormGroup.value);
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

		this.dogTrainerModelFormGroup.patchValue(
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

		console.debug('[applyLicenceIntoModel] dogTrainerModelFormGroup', this.dogTrainerModelFormGroup.value);
		return of(this.dogTrainerModelFormGroup.value);
	}

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
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					associatedLicence.licenceNumber!
				);

				console.debug('[getLicenceWithAccessCodeData] dogTrainerModelFormGroup', this.dogTrainerModelFormGroup.value);
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
						switchMap((dogTrainerModelData: any) => {
							return this.applyRenewalDataUpdatesToModel(dogTrainerModelData, photoOfYourself);
						})
					);
				})
			);
		}

		// is Replacement
		return this.applicantProfileService.apiApplicantGet().pipe(
			switchMap((applicantProfile: ApplicantProfileResponse) => {
				return this.applyLicenceProfileIntoModel(applicantProfile, associatedLicence).pipe(
					switchMap((dogTrainerModelData: any) => {
						return this.applyReplacementDataUpdatesToModel(dogTrainerModelData);
					})
				);
			})
		);
	}

	/**
	 * Submit the application data for anonymous new
	 */
	submitLicenceNewAnonymous(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const dogTrainerModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseNew(dogTrainerModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(dogTrainerModelFormValue);

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

		delete body.documentInfos;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.submitLicenceNewAnonymousDocuments(
			googleRecaptcha,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	/**
	 * Submit the application data for anonymous new including documents
	 * @returns
	 */
	private submitLicenceNewAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		documentsToSaveApis: Observable<string>[] | null,
		body: GdsdTeamLicenceAppAnonymousSubmitRequest
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

						return this.postSubmitAnonymous(body);
					})
				)
				.pipe(take(1));
		} else {
			return this.licenceAppDocumentService
				.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
				.pipe(
					switchMap((_resp: IActionResult) => {
						return this.postSubmitAnonymous(body);
					})
				)
				.pipe(take(1));
		}
	}

	private postSubmitAnonymous(body: DogTrainerRequest): Observable<StrictHttpResponse<DogTrainerAppCommandResponse>> {
		return this.dogTrainerLicensingService.apiDogTrainerAppAnonymousSubmitPost$Response({ body }).pipe(
			tap((_resp: any) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					body.serviceTypeCode!,
					body.applicationTypeCode!
				);
				this.utilService.toasterSuccess(successMessage);
			})
		);
	}

	/**
	 * Submit the application data for anonymous renewal or replacement
	 */
	submitLicenceRenewalAnonymous(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const dogTrainerModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseChange(dogTrainerModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(dogTrainerModelFormValue);

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

		const existingDocumentIds: Array<string> =
			body.documentInfos
				?.filter((item: Document) => !!item.documentUrlId)
				.map((item: Document) => item.documentUrlId!) ?? [];

		delete body.documentInfos;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.submitLicenceRenewalOrReplaceAnonymousDocuments(
			googleRecaptcha,
			existingDocumentIds,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	/**
	 * Submit the application data for anonymous replacement
	 */
	submitLicenceReplacementAnonymous(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const dogTrainerModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseChange(dogTrainerModelFormValue);
		const mailingAddressData = this.mailingAddressFormGroup.getRawValue();

		delete body.documentInfos;

		const googleRecaptcha = { recaptchaCode: mailingAddressData.captchaFormGroup.token };
		return this.submitLicenceRenewalOrReplaceAnonymousDocuments(googleRecaptcha, [], null, body);
	}

	/**
	 * Submit the application data for anonymous renewal or replacement including documents
	 * @returns
	 */
	private submitLicenceRenewalOrReplaceAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSaveApis: Observable<string>[] | null,
		body: GdsdTeamLicenceAppChangeRequest
	): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
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

						return this.postChangeAnonymous(body);
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

						return this.postChangeAnonymous(body);
					})
				)
				.pipe(take(1));
		}
	}

	private postChangeAnonymous(
		body: DogTrainerChangeRequest
	): Observable<StrictHttpResponse<DogTrainerAppCommandResponse>> {
		return this.dogTrainerLicensingService.apiDogTrainerAppAnonymousChangePost$Response({ body }).pipe(
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
