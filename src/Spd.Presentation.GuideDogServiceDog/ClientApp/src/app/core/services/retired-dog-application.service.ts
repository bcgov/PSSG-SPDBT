import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	ApplicantProfileResponse,
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	Document,
	GoogleRecaptcha,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	LicenceTermCode,
	RetiredDogAppCommandResponse,
	RetiredDogLicenceAppAnonymousSubmitRequest,
	RetiredDogLicenceAppChangeRequest,
	RetiredDogLicenceAppResponse,
	RetiredDogLicenceAppUpsertRequest,
	ServiceTypeCode,
} from '@app/api/models';
import {
	ApplicantProfileService,
	LicenceAppDocumentService,
	LicenceService,
	RetiredDogLicensingService,
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
import { SPD_CONSTANTS } from '../constants/constants';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { AuthenticationService } from './authentication.service';
import { CommonApplicationService, MainLicenceResponse } from './common-application.service';
import { FileUtilService, SpdFile } from './file-util.service';
import { RetiredDogApplicationHelper } from './retired-dog-application.helper';
import { LicenceDocumentsToSave, UtilService } from './util.service';

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
		dogId: new FormControl(), // placeholder to save

		serviceTypeData: this.serviceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		termsAndConditionsData: this.termsAndConditionsFormGroup,

		personalInformationData: this.personalInformationFormGroup,
		dogGdsdCertificateData: this.dogGdsdCertificateFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
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
		private retiredDogLicensingService: RetiredDogLicensingService,
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
			this.governmentPhotoIdFormGroup.valid &&
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
		console.debug('reset RETIRED DOG');
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
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getRdToResume(licenceAppId: string): Observable<RetiredDogLicenceAppResponse> {
		return this.loadPartialApplWithIdAuthenticated(licenceAppId).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setGdsdApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode
				);
			})
		);
	}

	private loadPartialApplWithIdAuthenticated(licenceAppId: string): Observable<any> {
		this.reset();

		const apis: Observable<any>[] = [
			this.retiredDogLicensingService.apiRetiredDogAppLicenceAppIdGet({ licenceAppId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const rdAppl: RetiredDogLicenceAppResponse = resps[0];
				const applicantProfile: ApplicantProfileResponse = resps[1];

				return this.applyApplicationProfileIntoModel(rdAppl, applicantProfile);
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
	): Observable<RetiredDogLicenceAppResponse> {
		return this.getLicenceOfTypeAuthenticated(applicationTypeCode, associatedLicence).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setGdsdApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					_resp.originalLicenceData.originalLicenceNumber
				);
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
		return forkJoin([
			this.applicantProfileService.apiApplicantIdGet({ id: associatedLicence.licenceHolderId! }),
			this.licenceService.apiLicencesLicencePhotoLicenceIdGet({ licenceId: associatedLicence.licenceId! }),
		]).pipe(
			catchError((error) => of(error)),
			switchMap((resps: any[]) => {
				const applicantProfile = resps[0];
				const photoOfYourself = resps[1];

				return this.applyLicenceProfileIntoModel(applicantProfile, associatedLicence).pipe(
					switchMap((retiredDogModelData: any) => {
						if (applicationTypeCode === ApplicationTypeCode.Replacement) {
							return this.applyReplacementSpecificDataToModel(retiredDogModelData, photoOfYourself);
						}

						return this.applyRenewalSpecificDataToModel(retiredDogModelData, photoOfYourself);
					})
				);
			})
		);
	}

	/**
	 * Partial Save - Save the data as is.
	 * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	 */
	partialSaveLicenceStepAuthenticated(): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
		const rdModelFormValue = this.retiredDogModelFormGroup.getRawValue();

		const body = this.getSaveBodyBase(rdModelFormValue) as RetiredDogLicenceAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.retiredDogLicensingService.apiRetiredDogAppPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<RetiredDogAppCommandResponse>) => {
				this.hasValueChanged = false;

				if (!rdModelFormValue.licenceAppId) {
					this.retiredDogModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
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
	 * Determine if the step data should be saved - if the data has changed
	 * @returns
	 */
	isAutoSave(): boolean {
		if (!this.isSaveAndExit()) {
			return false;
		}

		// file upload will fail in later steps if the 'licenceAppId' isn't populated.
		const licenceAppId = this.retiredDogModelFormGroup.get('licenceAppId')?.value;

		return this.hasValueChanged || !licenceAppId;
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
	private applyRenewalSpecificDataToModel(retiredDogModelData: any, photoOfYourself: Blob): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		const photographOfYourselfData = retiredDogModelData.photographOfYourselfData;
		const originalLicenceData = retiredDogModelData.originalLicenceData;

		const originalPhotoOfYourselfLastUploadDateTime = retiredDogModelData.photographOfYourselfData.uploadedDateTime;
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
	private applyReplacementSpecificDataToModel(retiredDogModelData: any, photoOfYourself: Blob): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

		const originalLicenceData = retiredDogModelData.originalLicenceData;
		const photographOfYourselfData = retiredDogModelData.photographOfYourselfData;

		// if the photo is missing, set the flag as expired so that it is required
		if (!this.isPhotographOfYourselfEmpty(photoOfYourself)) {
			originalLicenceData.originalPhotoOfYourselfExpired = true;

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

		return of(this.retiredDogModelFormGroup.value);
	}

	/**
	 * Apply the data from the Application and Applicant Profile into the main model
	 */
	private applyApplicationProfileIntoModel(
		rdAppl: RetiredDogLicenceAppResponse,
		applicantProfile: ApplicantProfileResponse
	): Observable<any> {
		return this.applyApplicationIntoModel(rdAppl).pipe(
			switchMap((_resp: any) => {
				return this.applyProfileIntoModel(applicantProfile);
			})
		);
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
	 * Apply the application data into the main model
	 */
	private applyApplicationIntoModel(rdAppl: RetiredDogLicenceAppResponse): Observable<any> {
		const serviceTypeData = { serviceTypeCode: rdAppl.serviceTypeCode };
		const applicationTypeData = { applicationTypeCode: rdAppl.applicationTypeCode };

		const personalInformationData = {
			givenName: rdAppl.givenName,
			middleName: rdAppl.middleName,
			surname: rdAppl.surname,
			dateOfBirth: rdAppl.dateOfBirth,
			phoneNumber: rdAppl.phoneNumber,
			emailAddress: rdAppl.emailAddress,
			hasBcscNameChanged: false,
		};

		const bcscMailingAddress = rdAppl.mailingAddress;
		const mailingAddressData = {
			isAddressTheSame: false,
			addressLine1: bcscMailingAddress?.addressLine1,
			addressLine2: bcscMailingAddress?.addressLine2,
			city: bcscMailingAddress?.city,
			country: bcscMailingAddress?.country,
			postalCode: bcscMailingAddress?.postalCode,
			province: bcscMailingAddress?.province,
		};

		let photographOfYourselfData: any = null;
		let dogInfoData: any = null;

		const photographOfYourselfAttachments: Array<File> = [];
		const governmentIssuedAttachments: Array<File> = [];
		const dogGdsdCertificateAttachments: Array<File> = [];

		const governmentPhotoIdData: {
			photoTypeCode: LicenceDocumentTypeCode | null;
			expiryDate: string | null;
			attachments: File[];
		} = {
			photoTypeCode: null,
			expiryDate: null,
			attachments: [],
		};

		rdAppl.documentInfos?.forEach((doc: Document) => {
			switch (doc.licenceDocumentTypeCode) {
				case LicenceDocumentTypeCode.Bcid:
				case LicenceDocumentTypeCode.BcServicesCard:
				case LicenceDocumentTypeCode.CanadianFirearmsLicence:
				case LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional:
				case LicenceDocumentTypeCode.DriversLicenceAdditional:
				case LicenceDocumentTypeCode.PermanentResidentCardAdditional:
				case LicenceDocumentTypeCode.PassportAdditional: {
					// Additional Government ID: GovernmentIssuedPhotoIdTypes
					const aFile = this.fileUtilService.dummyFile(doc);
					governmentIssuedAttachments.push(aFile);

					governmentPhotoIdData.photoTypeCode = doc.licenceDocumentTypeCode;
					governmentPhotoIdData.expiryDate = doc.expiryDate ?? null;
					governmentPhotoIdData.attachments = governmentIssuedAttachments;
					break;
				}
				case LicenceDocumentTypeCode.GdsdCertificate: {
					const aFile = this.fileUtilService.dummyFile(doc);
					dogGdsdCertificateAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.PhotoOfYourself: {
					const aFile = this.fileUtilService.dummyFile(doc);
					photographOfYourselfAttachments.push(aFile);
					break;
				}
			}
		});

		const dogGdsdCertificateData = {
			currentGDSDCertificateNumber: rdAppl.currentGDSDCertificateNumber,
			attachments: dogGdsdCertificateAttachments,
		};

		if (photographOfYourselfAttachments.length > 0) {
			photographOfYourselfData = {
				updatePhoto: null,
				uploadedDateTime: null,
				attachments: photographOfYourselfAttachments,
				updateAttachments: [],
			};
		}

		if (rdAppl.dogInfo) {
			dogInfoData = {
				dogName: rdAppl.dogInfo.dogName,
				dogDateOfBirth: rdAppl.dogInfo.dogDateOfBirth,
				dogBreed: rdAppl.dogInfo.dogBreed,
				dogColorAndMarkings: rdAppl.dogInfo.dogColorAndMarkings,
				dogGender: rdAppl.dogInfo.dogGender,
				microchipNumber: rdAppl.dogInfo.microchipNumber,
			};
		}

		const dogRetiredData = { dogRetiredDate: rdAppl.dogRetiredDate };

		const dogLivingData = {
			confirmDogLiveWithYouAfterRetire: this.utilService.booleanToBooleanType(rdAppl.confirmDogLiveWithYouAfterRetire),
		};

		this.retiredDogModelFormGroup.patchValue(
			{
				licenceAppId: rdAppl.licenceAppId,
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				serviceTypeData,
				licenceTermCode: rdAppl.licenceTermCode,
				applicationTypeData,

				personalInformationData,
				dogGdsdCertificateData,
				photographOfYourselfData,
				governmentPhotoIdData,
				mailingAddressData,
				dogInfoData,
				dogRetiredData,
				dogLivingData,
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
						if (applicationTypeCode === ApplicationTypeCode.Replacement) {
							return this.applyReplacementSpecificDataToModel(retiredDogModelData, photoOfYourself);
						}

						return this.applyRenewalSpecificDataToModel(retiredDogModelData, photoOfYourself);
					})
				);
			})
		);
	}

	/**
	 * Submit the authenticated licence data - new/renew
	 * @returns
	 */
	submitLicenceAuthenticated(
		applicationTypeCode: ApplicationTypeCode
	): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
		if (applicationTypeCode == ApplicationTypeCode.New) {
			return this.submitLicenceNewAuthenticated();
		}

		return this.submitLicenceChangeAuthenticated();
	}

	/**
	 * Submit the licence data - new
	 * @returns
	 */
	private submitLicenceNewAuthenticated(): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
		const rdModelFormValue = this.retiredDogModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(rdModelFormValue) as RetiredDogLicenceAppUpsertRequest;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.retiredDogLicensingService.apiRetiredDogAppSubmitPost$Response({ body }).pipe(
			tap((_resp: any) => {
				this.reset();

				const successMessage = SPD_CONSTANTS.message.submissionSuccess;
				this.utilService.dialogSuccess(successMessage);
			})
		);
	}

	/**
	 * Submit the application data for authenticated renewal
	 * @returns
	 */
	private submitLicenceChangeAuthenticated(): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
		const rdModelFormValue = this.retiredDogModelFormGroup.getRawValue();
		const bodyUpsert = this.getSaveBodyBaseChange(rdModelFormValue);
		delete bodyUpsert.documentInfos;

		const body = bodyUpsert as RetiredDogLicenceAppChangeRequest;
		const documentsToSave = this.getDocsToSaveBlobs(rdModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		// Create list of APIs to call for the newly added documents
		const documentsToSaveApis: Observable<any>[] = [];

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

					return this.postChangeAuthenticated(body);
				})
			);
		} else {
			// pass in the list of document ids that were in the original
			// application and are still being used
			body.previousDocumentIds = [...existingDocumentIds];

			return this.postChangeAuthenticated(body);
		}
	}

	private postChangeAuthenticated(
		body: RetiredDogLicenceAppChangeRequest
	): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
		return this.retiredDogLicensingService.apiRetiredDogAppChangePost$Response({ body }).pipe(
			tap((_resp: any) => {
				this.reset();

				const successMessage = SPD_CONSTANTS.message.submissionSuccess;
				this.utilService.dialogSuccess(successMessage);
			})
		);
	}

	submitLicenceAnonymous(): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
		const rdModelFormValue = this.retiredDogModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(rdModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(rdModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];

		const documentsToSaveApis: Observable<string>[] = [];
		documentsToSave.forEach((docBody: LicenceDocumentsToSave) => {
			// Only pass new documents and get a keyCode for each of those.
			const newDocumentsOnly: Array<Blob> = [];
			docBody.documents.forEach((doc: any) => {
				if (doc.documentUrlId) {
					existingDocumentIds.push(doc.documentUrlId);
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

		delete body.documentInfos;

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };

		return this.submitLicenceAnonymousDocuments(
			googleRecaptcha,
			existingDocumentIds,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	/**
	 * Submit the application data for anonymous renewal or replacement including documents
	 * @returns
	 */
	private submitLicenceAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSaveApis: Observable<string>[] | null,
		body: RetiredDogLicenceAppChangeRequest
	): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
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
		body: RetiredDogLicenceAppAnonymousSubmitRequest | RetiredDogLicenceAppChangeRequest
	): Observable<StrictHttpResponse<RetiredDogAppCommandResponse>> {
		if (body.applicationTypeCode == ApplicationTypeCode.New) {
			return this.retiredDogLicensingService.apiRetiredDogAppAnonymousSubmitPost$Response({ body });
		}

		return this.retiredDogLicensingService.apiRetiredDogAppAnonymousChangePost$Response({ body });
	}
}
