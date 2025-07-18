import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	ApplicantProfileResponse,
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	Document,
	DogSchoolResponse,
	DogTrainerAppCommandResponse,
	DogTrainerAppResponse,
	DogTrainerChangeRequest,
	DogTrainerRequest,
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
import { FileUtilService, SpdFile } from './file-util.service';
import { LicenceDocumentsToSave, UtilService } from './util.service';

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
		trainerMailingAddressData: this.trainerMailingAddressFormGroup,
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
			this.trainerMailingAddressFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.governmentPhotoIdFormGroup.valid
		);
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		console.debug('reset DOG TRAINER');
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationDtFormGroup.reset();
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
	private applyApplDataToModel(
		latestApplication: DogTrainerAppResponse,
		photoOfYourself: Blob | null
	): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		const trainingSchoolInfoData = {
			accreditedSchoolId: latestApplication.accreditedSchoolId,
			accreditedSchoolName: latestApplication.accreditedSchoolName,
			schoolDirectorGivenName: latestApplication.schoolDirectorGivenName,
			schoolDirectorMiddleName: latestApplication.schoolDirectorMiddleName,
			schoolDirectorSurname: latestApplication.schoolDirectorSurname,
			schoolContactPhoneNumber: latestApplication.schoolContactPhoneNumber,
			schoolContactEmailAddress: latestApplication.schoolContactEmailAddress,
		};

		this.dogTrainerModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				trainingSchoolInfoData,
			},
			{
				emitEvent: false,
			}
		);

		return this.setPhotographOfYourself(photoOfYourself).pipe(
			switchMap((_resp: any) => {
				return of(this.dogTrainerModelFormGroup.value);
			})
		);
	}

	/**
	 * Overwrite or change any data specific to the renewal flow
	 */
	private applyRenewalSpecificDataToModel(dogTrainerModelData: any, photoOfYourself: Blob): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		const photographOfYourselfData = dogTrainerModelData.photographOfYourselfData;
		const originalLicenceData = dogTrainerModelData.originalLicenceData;

		const originalPhotoOfYourselfLastUploadDateTime = dogTrainerModelData.photographOfYourselfData.uploadedDateTime;
		originalLicenceData.originalPhotoOfYourselfExpired = this.utilService.getIsDate5YearsOrOlder(
			originalPhotoOfYourselfLastUploadDateTime
		);

		// if the photo is missing, set the flag as expired so that it is required
		if (!this.isPhotographOfYourselfEmpty(photoOfYourself)) {
			originalLicenceData.originalPhotoOfYourselfExpired = true;
		}

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
				return of(this.dogTrainerModelFormGroup.value);
			})
		);
	}

	/**
	 * Overwrite or change any data specific to the replacment flow
	 */
	private applyReplacementSpecificDataToModel(dogTrainerModelData: any, photoOfYourself: Blob): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };
		const trainerMailingAddressData = dogTrainerModelData.trainerMailingAddressData;

		const photographOfYourselfData = dogTrainerModelData.photographOfYourselfData;
		const originalLicenceData = dogTrainerModelData.originalLicenceData;

		// if the photo is missing, set the flag as expired so that it is required
		if (!this.isPhotographOfYourselfEmpty(photoOfYourself)) {
			originalLicenceData.originalPhotoOfYourselfExpired = true;

			// set flag - user will be forced to update their photo
			photographOfYourselfData.updatePhoto = BooleanTypeCode.Yes;
		}

		this.mailingAddressFormGroup.patchValue({
			isAddressTheSame: false,
			addressLine1: trainerMailingAddressData?.addressLine1,
			addressLine2: trainerMailingAddressData?.addressLine2,
			city: trainerMailingAddressData?.city,
			country: trainerMailingAddressData?.country,
			postalCode: trainerMailingAddressData?.postalCode,
			province: trainerMailingAddressData?.province,
		});

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
		const trainerMailingAddressData = {
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
				trainerMailingAddressData,
			},
			{
				emitEvent: false,
			}
		);

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

		return of(this.dogTrainerModelFormGroup.value);
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
		const apis: any = [
			this.applicantProfileService.apiApplicantGet(),
			this.dogTrainerLicensingService.apiDogTrainerAppGet(),
			this.licenceService.apiLicencesLicencePhotoGet(),
		];

		return forkJoin(apis).pipe(
			catchError((error) => of(error)),
			switchMap((resps: any[]) => {
				const applicantProfile = resps[0];
				const latestApplication = resps[1];
				const photoOfYourself = resps[2];

				return this.applyLicenceProfileIntoModel(applicantProfile, associatedLicence).pipe(
					switchMap((dogTrainerModelData: any) => {
						return this.applyApplDataToModel(latestApplication, photoOfYourself).pipe(
							tap((_resp: any) => {
								if (applicationTypeCode === ApplicationTypeCode.Replacement) {
									return this.applyReplacementSpecificDataToModel(dogTrainerModelData, photoOfYourself);
								}

								return this.applyRenewalSpecificDataToModel(dogTrainerModelData, photoOfYourself);
							})
						);
					})
				);
			})
		);
	}

	/**
	 * Submit the application data for anonymous new
	 */
	submitLicenceAnonymous(): Observable<StrictHttpResponse<DogTrainerAppCommandResponse>> {
		const dogTrainerModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(dogTrainerModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(dogTrainerModelFormValue);

		const { existingDocumentIds, documentsToSaveApis } = this.getDocumentData(documentsToSave);
		delete body.documentInfos;

		const consentData = this.consentAndDeclarationDtFormGroup.getRawValue();
		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };

		return this.submitLicenceAnonymousDocuments(
			googleRecaptcha,
			existingDocumentIds,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	private getDocumentData(documentsToSave: Array<LicenceDocumentsToSave>): {
		existingDocumentIds: Array<string>;
		documentsToSaveApis: Observable<string>[];
	} {
		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];

		const documentsToSaveApis: Observable<string>[] = [];
		documentsToSave.forEach((docBody: LicenceDocumentsToSave) => {
			// Only pass new documents and get a keyCode for each of those.
			const newDocumentsOnly: Array<Blob> = [];
			docBody.documents.forEach((doc: any) => {
				const spdFile: SpdFile = doc as SpdFile;
				if (spdFile.documentUrlId) {
					existingDocumentIds.push(spdFile.documentUrlId);
				} else {
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

		return { existingDocumentIds, documentsToSaveApis };
	}

	private postSubmitAnonymous(
		body: DogTrainerRequest | DogTrainerChangeRequest
	): Observable<StrictHttpResponse<DogTrainerAppCommandResponse>> {
		if (body.applicationTypeCode == ApplicationTypeCode.New) {
			return this.dogTrainerLicensingService.apiDogTrainerAppAnonymousSubmitPost$Response({ body });
		}

		return this.dogTrainerLicensingService.apiDogTrainerAppAnonymousChangePost$Response({ body });
	}

	/**
	 * Submit the application data for anonymous renewal or replacement including documents
	 * @returns
	 */
	private submitLicenceAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSaveApis: Observable<string>[] | null,
		body: any // DogTrainerRequest | DogTrainerChangeRequest
	): Observable<StrictHttpResponse<DogTrainerAppCommandResponse>> {
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
			// pass in the list of document ids that were in the original
			// application and are still being used
			body.previousDocumentIds = [...existingDocumentIds];

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
}
