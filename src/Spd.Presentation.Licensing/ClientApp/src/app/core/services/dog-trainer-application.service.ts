import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	ApplicantProfileResponse,
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	Document,
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
	GdsdLicensingService,
	LicenceAppDocumentService,
	LicenceService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
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
import { CommonApplicationService, MainLicenceResponse } from './common-application.service';
import { ConfigService } from './config.service';
import { DogTrainerApplicationHelper } from './dog-trainer-application.helper';
import { FileUtilService } from './file-util.service';
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
		trainingSchoolAddressData: this.residentialAddressFormGroup,
		dogTrainerData: this.dogTrainerFormGroup,
		dogTrainerAddressData: this.residentialAddressFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
	});

	dogTrainerModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private applicantProfileService: ApplicantProfileService,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private gdsdLicensingService: GdsdLicensingService,
		private licenceService: LicenceService
	) {
		super(formBuilder, configService, utilService, fileUtilService);

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
		return true;
	}
	/**
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepDogTrainerPersonalInfoComplete(): boolean {
		return true;
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

	// /*************************************************************/
	// // AUTHENTICATED
	// /*************************************************************/

	// /**
	//  * Partial Save - Save the data as is.
	//  * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	//  */
	// partialSaveLicenceStepAuthenticated(isSaveAndExit?: boolean): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
	// 	const gdsdModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
	// 	console.debug('[partialSaveLicenceStepAuthenticated] gdsdModelFormValue', gdsdModelFormValue);

	// 	const body = this.getSaveBodyBaseNew(gdsdModelFormValue) as GdsdTeamLicenceAppUpsertRequest;

	// 	body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

	// 	return this.gdsdLicensingService.apiGdsdTeamAppPost$Response({ body }).pipe(
	// 		take(1),
	// 		tap((res: StrictHttpResponse<GdsdAppCommandResponse>) => {
	// 			this.hasValueChanged = false;

	// 			let msg = 'Your application has been saved';
	// 			if (isSaveAndExit) {
	// 				msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
	// 			}
	// 			this.utilService.toasterSuccess(msg);

	// 			if (!gdsdModelFormValue.licenceAppId) {
	// 				this.dogTrainerModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
	// 			}
	// 		})
	// 	);
	// }

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

		// 	if (!this.isAutoSave()) return;

		// 	this.addUploadDocument(documentCode, document).subscribe({
		// 		next: (resp: any) => {
		// 			const matchingFile = attachments.value.find((item: File) => item.name == document.name);
		// 			matchingFile.documentUrlId = resp.body[0].documentUrlId;
		// 		},
		// 		error: (error: any) => {
		// 			console.log('An error occurred during file upload', error);

		// 			fileUploadComponent.removeFailedFile(document);
		// 		},
		// 	});
	}

	// /**
	//  * Upload a file of a certain type. Return a reference to the file that will used when the licence is saved
	//  * @param documentCode
	//  * @param document
	//  * @returns
	//  */
	// addUploadDocument(
	// 	documentCode: LicenceDocumentTypeCode,
	// 	documentFile: File
	// ): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
	// 	return this.licenceAppDocumentService.apiLicenceApplicationDocumentsLicenceAppIdFilesPost$Response({
	// 		licenceAppId: this.dogTrainerModelFormGroup.get('licenceAppId')?.value,
	// 		body: {
	// 			documents: [documentFile],
	// 			licenceDocumentTypeCode: documentCode,
	// 		},
	// 	});
	// }

	// /**
	//  * Create an empty authenticated licence
	//  * @returns
	//  */
	// createNewLicenceAuthenticated(serviceTypeCode: ServiceTypeCode): Observable<any> {
	// 	return this.applicantProfileService
	// 		.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
	// 		.pipe(
	// 			switchMap((applicantProfile: ApplicantProfileResponse) => {
	// 				return this.createEmptyGdsdAuthenticated(applicantProfile, serviceTypeCode, ApplicationTypeCode.New).pipe(
	// 					tap((_resp: any) => {
	// 						this.initialized = true;

	// 						this.commonApplicationService.setApplicationTitle(serviceTypeCode, ApplicationTypeCode.New);
	// 					})
	// 				);
	// 			})
	// 		);
	// }

	// private createEmptyGdsdAuthenticated(
	// 	applicantProfile: ApplicantProfileResponse,
	// 	serviceTypeCode: ServiceTypeCode,
	// 	applicationTypeCode: ApplicationTypeCode
	// ): Observable<any> {
	// 	this.reset();

	// 	const serviceTypeData = { serviceTypeCode };
	// 	const applicationTypeData = { applicationTypeCode };

	// 	const personalInformationData = {
	// 		givenName: applicantProfile.givenName,
	// 		middleName: applicantProfile.middleName1,
	// 		surname: applicantProfile.surname,
	// 		dateOfBirth: applicantProfile.dateOfBirth,
	// 		phoneNumber: applicantProfile.phoneNumber,
	// 		emailAddress: applicantProfile.emailAddress,
	// 		hasBcscNameChanged: false,
	// 	};

	// 	const bcscMailingAddress = applicantProfile.mailingAddress;
	// 	const mailingAddressData = {
	// 		addressSelected: !!bcscMailingAddress && !!bcscMailingAddress.addressLine1,
	// 		isAddressTheSame: false,
	// 		addressLine1: bcscMailingAddress?.addressLine1,
	// 		addressLine2: bcscMailingAddress?.addressLine2,
	// 		city: bcscMailingAddress?.city,
	// 		country: bcscMailingAddress?.country,
	// 		postalCode: bcscMailingAddress?.postalCode,
	// 		province: bcscMailingAddress?.province,
	// 	};

	// 	this.dogTrainerModelFormGroup.patchValue(
	// 		{
	// 			applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
	// 			serviceTypeData,
	// 			licenceTermCode: LicenceTermCode.TwoYears,
	// 			applicationTypeData,

	// 			personalInformationData,
	// 			mailingAddressData,
	// 		},
	// 		{
	// 			emitEvent: false,
	// 		}
	// 	);

	// 	this.schoolTrainingRowAdd();
	// 	this.otherTrainingRowAdd();

	// 	console.debug('[createEmptyGdsdAuthenticated] dogTrainerModelFormGroup', this.dogTrainerModelFormGroup.value);
	// 	return of(this.dogTrainerModelFormGroup.value);
	// }

	// /**
	//  * Submit the licence data - new
	//  * @returns
	//  */
	// submitLicenceNewAuthenticated(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
	// 	const gdsdModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
	// 	const body = this.getSaveBodyBaseNew(gdsdModelFormValue) as GdsdTeamLicenceAppUpsertRequest;

	// 	const consentData = this.consentAndDeclarationFormGroup.getRawValue();
	// 	body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

	// 	body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

	// 	return this.gdsdLicensingService.apiGdsdTeamAppSubmitPost$Response({ body }).pipe(
	// 		tap((_resp: any) => {
	// 			const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
	// 				body.serviceTypeCode!,
	// 				body.applicationTypeCode!
	// 			);
	// 			this.utilService.toasterSuccess(successMessage, false);
	// 		})
	// 	);
	// }

	// /**
	//  * Submit the application data for authenticated renewal
	//  * @returns
	//  */
	// submitLicenceRenewalAuthenticated(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
	// 	const gdsdModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
	// 	const bodyUpsert = this.getSaveBodyBaseChange(gdsdModelFormValue);
	// 	delete bodyUpsert.documentInfos;

	// 	const body = bodyUpsert as GdsdTeamLicenceAppChangeRequest;

	// 	const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

	// 	const consentData = this.consentAndDeclarationFormGroup.getRawValue();
	// 	body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

	// 	body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

	// 	// Create list of APIs to call for the newly added documents
	// 	const documentsToSaveApis: Observable<any>[] = [];

	// 	// Get the keyCode for the existing documents to save.
	// 	const existingDocumentIds: Array<string> = [];

	// 	documentsToSave?.forEach((doc: LicenceDocumentsToSave) => {
	// 		const newDocumentsOnly: Array<Blob> = [];

	// 		doc.documents.forEach((item: Blob) => {
	// 			const spdFile: SpdFile = item as SpdFile;
	// 			if (spdFile.documentUrlId) {
	// 				existingDocumentIds.push(spdFile.documentUrlId);
	// 			} else {
	// 				newDocumentsOnly.push(item);
	// 			}
	// 		});

	// 		if (newDocumentsOnly.length > 0) {
	// 			documentsToSaveApis.push(
	// 				this.licenceAppDocumentService.apiLicenceApplicationDocumentsFilesPost({
	// 					body: {
	// 						documents: newDocumentsOnly,
	// 						licenceDocumentTypeCode: doc.licenceDocumentTypeCode,
	// 					},
	// 				})
	// 			);
	// 		}
	// 	});

	// 	if (documentsToSaveApis.length > 0) {
	// 		return forkJoin(documentsToSaveApis).pipe(
	// 			switchMap((resps: string[]) => {
	// 				// pass in the list of document key codes
	// 				body.documentKeyCodes = [...resps];
	// 				// pass in the list of document ids that were in the original
	// 				// application and are still being used
	// 				body.previousDocumentIds = [...existingDocumentIds];

	// 				return this.postChangeAuthenticated(body);
	// 			})
	// 		);
	// 	} else {
	// 		// pass in the list of document ids that were in the original
	// 		// application and are still being used
	// 		body.previousDocumentIds = [...existingDocumentIds];

	// 		return this.postChangeAuthenticated(body);
	// 	}
	// }

	// /**
	//  * Submit the application data for authenticated replacement
	//  */
	// submitLicenceReplacementAuthenticated(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
	// 	const gdsdModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
	// 	const body = this.getSaveBodyBaseChange(gdsdModelFormValue);

	// 	delete body.documentInfos;

	// 	body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

	// 	return this.postChangeAuthenticated(body);
	// }

	// private postChangeAuthenticated(
	// 	body: GdsdTeamLicenceAppChangeRequest
	// ): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
	// 	return this.gdsdLicensingService.apiGdsdTeamAppChangePost$Response({ body }).pipe(
	// 		tap((_resp: any) => {
	// 			const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
	// 				body.serviceTypeCode!,
	// 				body.applicationTypeCode!
	// 			);
	// 			this.utilService.toasterSuccess(successMessage, false);
	// 		})
	// 	);
	// }

	// /**
	//  * Load an existing licence application
	//  * @param licenceAppId
	//  * @returns
	//  */
	// getGdsdToResume(licenceAppId: string): Observable<GdsdTeamLicenceAppResponse> {
	// 	return this.loadPartialApplWithIdAuthenticated(licenceAppId).pipe(
	// 		tap((_resp: any) => {
	// 			this.initialized = true;

	// 			this.commonApplicationService.setApplicationTitle(
	// 				_resp.serviceTypeData.serviceTypeCode,
	// 				_resp.applicationTypeData.applicationTypeCode
	// 			);
	// 		})
	// 	);
	// }

	// private loadPartialApplWithIdAuthenticated(licenceAppId: string): Observable<any> {
	// 	this.reset();

	// 	const apis: Observable<any>[] = [
	// 		this.gdsdLicensingService.apiGdsdTeamAppLicenceAppIdGet({ licenceAppId }),
	// 		this.applicantProfileService.apiApplicantIdGet({
	// 			id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
	// 		}),
	// 	];

	// 	return forkJoin(apis).pipe(
	// 		switchMap((resps: any[]) => {
	// 			const gdsdAppl: GdsdTeamLicenceAppResponse = resps[0];
	// 			const applicantProfile: ApplicantProfileResponse = resps[1];

	// 			return this.applyApplicationProfileIntoModel(gdsdAppl, applicantProfile);
	// 		})
	// 	);
	// }

	// /**
	//  * Load an existing licence application with an id for the provided application type
	//  * @param licenceAppId
	//  * @returns
	//  */
	// getLicenceWithSelectionAuthenticated(
	// 	applicationTypeCode: ApplicationTypeCode,
	// 	associatedLicence: MainLicenceResponse
	// ): Observable<GdsdTeamLicenceAppResponse> {
	// 	return this.getLicenceOfTypeAuthenticated(applicationTypeCode, associatedLicence).pipe(
	// 		tap((_resp: any) => {
	// 			this.initialized = true;

	// 			this.commonApplicationService.setApplicationTitle(
	// 				_resp.serviceTypeData.serviceTypeCode,
	// 				_resp.applicationTypeData.applicationTypeCode,
	// 				_resp.originalLicenceData.originalLicenceNumber
	// 			);
	// 		})
	// 	);
	// }

	// /**
	//  * Load an existing licence application with a certain type
	//  * @param licenceAppId
	//  * @returns
	//  */
	// private getLicenceOfTypeAuthenticated(
	// 	applicationTypeCode: ApplicationTypeCode,
	// 	associatedLicence: MainLicenceResponse
	// ): Observable<any> {
	// 	// handle renewal
	// 	if (applicationTypeCode === ApplicationTypeCode.Renewal) {
	// 		return forkJoin([
	// 			this.applicantProfileService.apiApplicantIdGet({ id: associatedLicence.licenceHolderId! }),
	// 			this.licenceService.apiLicencesLicencePhotoLicenceIdGet({ licenceId: associatedLicence.licenceId! }),
	// 		]).pipe(
	// 			catchError((error) => of(error)),
	// 			switchMap((resps: any[]) => {
	// 				const applicantProfile = resps[0];
	// 				const photoOfYourself = resps[1];

	// 				return this.applyLicenceProfileIntoModel(applicantProfile, associatedLicence).pipe(
	// 					switchMap((gdsdModelData: any) => {
	// 						return this.applyRenewalDataUpdatesToModel(gdsdModelData, photoOfYourself);
	// 					})
	// 				);
	// 			})
	// 		);
	// 	}

	// 	// handle replacement
	// 	return this.applicantProfileService.apiApplicantIdGet({ id: associatedLicence.licenceHolderId! }).pipe(
	// 		switchMap((applicantProfile: ApplicantProfileResponse) => {
	// 			return this.applyLicenceProfileIntoModel(applicantProfile, associatedLicence).pipe(
	// 				switchMap((_resp: any) => {
	// 					return this.applyReplacementDataUpdatesToModel();
	// 				})
	// 			);
	// 		})
	// 	);
	// }

	/**
	 * Overwrite or change any data specific to the renewal flow
	 */
	private applyRenewalDataUpdatesToModel(gdsdModelData: any, photoOfYourself: Blob): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		const photographOfYourselfData = gdsdModelData.photographOfYourselfData;
		const originalLicenceData = gdsdModelData.originalLicenceData;

		const originalPhotoOfYourselfLastUploadDateTime = gdsdModelData.photographOfYourselfData.uploadedDateTime;
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
	private applyReplacementDataUpdatesToModel(): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };
		const dogRenewData = { isAssistanceStillRequired: true };

		this.dogTrainerModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				dogRenewData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyReplacementDataUpdatesToModel] dogTrainerModelFormGroup', this.dogTrainerModelFormGroup.value);
		return of(this.dogTrainerModelFormGroup.value);
	}

	// /**
	//  * Apply the data from the Application and Applicant Profile into the main model
	//  */
	// private applyApplicationProfileIntoModel(
	// 	gdsdAppl: GdsdTeamLicenceAppResponse,
	// 	applicantProfile: ApplicantProfileResponse
	// ): Observable<any> {
	// 	return this.applyApplicationIntoModel(gdsdAppl).pipe(
	// 		switchMap((_resp: any) => {
	// 			return this.applyProfileIntoModel(applicantProfile);
	// 		})
	// 	);
	// }

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

		this.dogTrainerModelFormGroup.patchValue(
			{
				personalInformationData,
				mailingAddressData,
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

	// /**
	//  * Apply the application data into the main model
	//  */
	// private applyApplicationIntoModel(gdsdAppl: GdsdTeamLicenceAppResponse): Observable<any> {
	// 	const serviceTypeData = { serviceTypeCode: gdsdAppl.serviceTypeCode };
	// 	const applicationTypeData = { applicationTypeCode: gdsdAppl.applicationTypeCode };
	// 	const dogCertificationSelectionData = {
	// 		isDogTrainedByAccreditedSchool: this.utilService.booleanToBooleanType(gdsdAppl.isDogTrainedByAccreditedSchool),
	// 	};

	// 	const personalInformationData = {
	// 		givenName: gdsdAppl.givenName,
	// 		middleName: gdsdAppl.middleName,
	// 		surname: gdsdAppl.surname,
	// 		dateOfBirth: gdsdAppl.dateOfBirth,
	// 		phoneNumber: gdsdAppl.phoneNumber,
	// 		emailAddress: gdsdAppl.emailAddress,
	// 		hasBcscNameChanged: false,
	// 	};

	// 	const bcscMailingAddress = gdsdAppl.mailingAddress;
	// 	const mailingAddressData = {
	// 		addressSelected: !!bcscMailingAddress && !!bcscMailingAddress.addressLine1,
	// 		isAddressTheSame: false,
	// 		addressLine1: bcscMailingAddress?.addressLine1,
	// 		addressLine2: bcscMailingAddress?.addressLine2,
	// 		city: bcscMailingAddress?.city,
	// 		country: bcscMailingAddress?.country,
	// 		postalCode: bcscMailingAddress?.postalCode,
	// 		province: bcscMailingAddress?.province,
	// 	};

	// 	let medicalInformationData: any = null;
	// 	let photographOfYourselfData: any = null;
	// 	let dogTasksData: any = null;
	// 	let dogInfoData: any = null;
	// 	let dogGdsdData: any = null;
	// 	let dogMedicalData: any = null;
	// 	let graduationInfoData: any = null;
	// 	let trainingHistoryData: any = null;

	// 	const schoolSupportTrainingHistoryAttachments: Array<File> = [];
	// 	const otherSupportTrainingHistoryAttachments: Array<File> = [];
	// 	const otherTrainingHistoryPracticeAttachments: Array<File> = [];

	// 	const schoolTrainingHistoryData = {
	// 		schoolTrainings: [],
	// 		attachments: schoolSupportTrainingHistoryAttachments,
	// 	};
	// 	const otherTrainingHistoryData = {
	// 		otherTrainings: [],
	// 		attachments: otherSupportTrainingHistoryAttachments,
	// 		practiceLogAttachments: otherTrainingHistoryPracticeAttachments,
	// 	};

	// 	let schoolTrainingsArray: Array<TrainingSchoolInfo> | null = null;
	// 	let otherTrainingsArray: Array<OtherTraining> | null = null;

	// 	const photographOfYourselfAttachments: Array<File> = [];
	// 	const governmentIssuedAttachments: Array<File> = [];
	// 	const medicalInformationAttachments: Array<File> = [];
	// 	const dogMedicalAttachments: Array<File> = [];
	// 	const accreditedGraduationAttachments: Array<File> = [];

	// 	const governmentPhotoIdData: {
	// 		photoTypeCode: LicenceDocumentTypeCode | null;
	// 		expiryDate: string | null;
	// 		attachments: File[];
	// 	} = {
	// 		photoTypeCode: null,
	// 		expiryDate: null,
	// 		attachments: [],
	// 	};

	// 	gdsdAppl.documentInfos?.forEach((doc: Document) => {
	// 		switch (doc.licenceDocumentTypeCode) {
	// 			case LicenceDocumentTypeCode.Bcid:
	// 			case LicenceDocumentTypeCode.BcServicesCard:
	// 			case LicenceDocumentTypeCode.CanadianFirearmsLicence:
	// 			case LicenceDocumentTypeCode.CertificateOfIndianStatusAdditional:
	// 			case LicenceDocumentTypeCode.DriversLicenceAdditional:
	// 			case LicenceDocumentTypeCode.PermanentResidentCardAdditional:
	// 			case LicenceDocumentTypeCode.PassportAdditional: {
	// 				// Additional Government ID: GovernmentIssuedPhotoIdTypes
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				governmentIssuedAttachments.push(aFile);

	// 				governmentPhotoIdData.photoTypeCode = doc.licenceDocumentTypeCode;
	// 				governmentPhotoIdData.expiryDate = doc.expiryDate ?? null;
	// 				governmentPhotoIdData.attachments = governmentIssuedAttachments;
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				medicalInformationAttachments.push(aFile);
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				dogMedicalAttachments.push(aFile);
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				accreditedGraduationAttachments.push(aFile);
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				if (gdsdAppl.nonAccreditedSchoolQuestions?.trainingInfo?.hasAttendedTrainingSchool) {
	// 					schoolSupportTrainingHistoryAttachments.push(aFile);
	// 				} else {
	// 					otherSupportTrainingHistoryAttachments.push(aFile);
	// 				}
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.GdsdPracticeHoursLog: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				otherTrainingHistoryPracticeAttachments.push(aFile);
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.PhotoOfYourself: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				photographOfYourselfAttachments.push(aFile);
	// 				break;
	// 			}
	// 		}
	// 	});

	// 	if (medicalInformationAttachments.length > 0) {
	// 		medicalInformationData = { attachments: medicalInformationAttachments };
	// 	}

	// 	if (dogMedicalAttachments.length > 0) {
	// 		dogMedicalData = {
	// 			areInoculationsUpToDate: this.utilService.booleanToBooleanType(
	// 				gdsdAppl.nonAccreditedSchoolQuestions?.areInoculationsUpToDate
	// 			),
	// 			attachments: dogMedicalAttachments,
	// 		};
	// 	}

	// 	if (photographOfYourselfAttachments.length > 0) {
	// 		photographOfYourselfData = {
	// 			updatePhoto: null,
	// 			uploadedDateTime: null,
	// 			attachments: photographOfYourselfAttachments,
	// 			updateAttachments: [],
	// 		};
	// 	}

	// 	if (gdsdAppl.dogInfo) {
	// 		dogInfoData = {
	// 			dogName: gdsdAppl.dogInfo.dogName,
	// 			dogDateOfBirth: gdsdAppl.dogInfo.dogDateOfBirth,
	// 			dogBreed: gdsdAppl.dogInfo.dogBreed,
	// 			dogColorAndMarkings: gdsdAppl.dogInfo.dogColorAndMarkings,
	// 			dogGender: gdsdAppl.dogInfo.dogGender,
	// 			microchipNumber: gdsdAppl.dogInfo.microchipNumber,
	// 		};
	// 	}

	// 	if (
	// 		this.utilService.hasBooleanValue(gdsdAppl.isDogTrainedByAccreditedSchool) &&
	// 		gdsdAppl.isDogTrainedByAccreditedSchool
	// 	) {
	// 		if (gdsdAppl.accreditedSchoolQuestions?.graduationInfo) {
	// 			graduationInfoData = {
	// 				accreditedSchoolName: gdsdAppl.accreditedSchoolQuestions?.graduationInfo.accreditedSchoolName,
	// 				schoolContactGivenName: gdsdAppl.accreditedSchoolQuestions?.graduationInfo.schoolContactGivenName,
	// 				schoolContactSurname: gdsdAppl.accreditedSchoolQuestions?.graduationInfo.schoolContactSurname,
	// 				schoolContactPhoneNumber: gdsdAppl.accreditedSchoolQuestions?.graduationInfo.schoolContactPhoneNumber,
	// 				schoolContactEmailAddress: gdsdAppl.accreditedSchoolQuestions?.graduationInfo.schoolContactEmailAddress,
	// 				attachments: accreditedGraduationAttachments,
	// 			};
	// 		}

	// 		if (gdsdAppl.accreditedSchoolQuestions) {
	// 			dogGdsdData = {
	// 				isGuideDog: this.utilService.booleanToBooleanType(gdsdAppl.accreditedSchoolQuestions.isGuideDog),
	// 			};

	// 			dogTasksData = {
	// 				tasks: gdsdAppl.accreditedSchoolQuestions.serviceDogTasks,
	// 			};
	// 		}
	// 	}

	// 	if (
	// 		this.utilService.hasBooleanValue(gdsdAppl.isDogTrainedByAccreditedSchool) &&
	// 		!gdsdAppl.isDogTrainedByAccreditedSchool &&
	// 		gdsdAppl.nonAccreditedSchoolQuestions
	// 	) {
	// 		if (gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo) {
	// 			dogTasksData = {
	// 				tasks: gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.specializedTasksWhenPerformed,
	// 			};

	// 			if (
	// 				this.utilService.hasBooleanValue(gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.hasAttendedTrainingSchool)
	// 			) {
	// 				trainingHistoryData = {
	// 					hasAttendedTrainingSchool: this.utilService.booleanToBooleanType(
	// 						gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.hasAttendedTrainingSchool
	// 					),
	// 				};

	// 				if (gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.hasAttendedTrainingSchool) {
	// 					schoolTrainingsArray = gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.schoolTrainings ?? null;
	// 					schoolTrainingHistoryData.attachments = schoolSupportTrainingHistoryAttachments;
	// 				} else {
	// 					otherTrainingsArray = gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.otherTrainings ?? null;
	// 					otherTrainingHistoryData.attachments = otherSupportTrainingHistoryAttachments;
	// 					otherTrainingHistoryData.practiceLogAttachments = otherTrainingHistoryPracticeAttachments;
	// 				}

	// 				const schoolTrainingsArrayHasData = schoolTrainingsArray ? schoolTrainingsArray.length > 0 : false;
	// 				const otherTrainingsArrayHasData = otherTrainingsArray ? otherTrainingsArray.length > 0 : false;

	// 				// if neither array has data, then unset the flag to reprompt the user
	// 				if (!schoolTrainingsArrayHasData && !otherTrainingsArrayHasData) {
	// 					trainingHistoryData.hasAttendedTrainingSchool = null;
	// 				}
	// 			}
	// 		}
	// 	}

	// 	this.dogTrainerModelFormGroup.patchValue(
	// 		{
	// 			licenceAppId: gdsdAppl.licenceAppId,
	// 			applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
	// 			serviceTypeData,
	// 			licenceTermCode: gdsdAppl.licenceTermCode,
	// 			applicationTypeData,

	// 			personalInformationData,
	// 			medicalInformationData,
	// 			photographOfYourselfData,
	// 			governmentPhotoIdData,
	// 			mailingAddressData,
	// 			dogTasksData,
	// 			dogCertificationSelectionData,
	// 			dogInfoData,
	// 			dogGdsdData,
	// 			dogMedicalData,
	// 			graduationInfoData,
	// 			trainingHistoryData,
	// 			schoolTrainingHistoryData,
	// 			otherTrainingHistoryData,
	// 		},
	// 		{
	// 			emitEvent: false,
	// 		}
	// 	);

	// 	if (schoolTrainingsArray && schoolTrainingsArray.length > 0) {
	// 		this.schoolTrainingAddArray(schoolTrainingsArray);
	// 	} else {
	// 		this.schoolTrainingRowAdd();
	// 	}

	// 	if (otherTrainingsArray && otherTrainingsArray.length > 0) {
	// 		this.otherTrainingAddArray(otherTrainingsArray);
	// 	} else {
	// 		this.otherTrainingRowAdd();
	// 	}

	// 	console.debug('[applyApplicationIntoModel] dogTrainerModelFormGroup', this.dogTrainerModelFormGroup.value);
	// 	return of(this.dogTrainerModelFormGroup.value);
	// }

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/

	/**
	 * Create an empty application
	 * @returns
	 */
	createNewAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.createEmptyAnonymous(serviceTypeCode).pipe(
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
	private createEmptyAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
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
				const personalInformationData = { ..._resp.personalInformationData };

				personalInformationData.cardHolderName = associatedLicence.nameOnCard;
				personalInformationData.licenceHolderName = associatedLicence.licenceHolderName;

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					associatedLicence.licenceNumber!
				);

				console.debug('[getLicenceWithAccessCodeData] licenceFormGroup', this.dogTrainerModelFormGroup.value);
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
						switchMap((gdsdModelData: any) => {
							return this.applyRenewalDataUpdatesToModel(gdsdModelData, photoOfYourself);
						})
					);
				})
			);
		}

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
	submitLicenceNewAnonymous(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const gdsdModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseNew(gdsdModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		const originalLicenceData = gdsdModelFormValue.originalLicenceData;
		body.applicantId = originalLicenceData.originalLicenceHolderId;

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

	private postSubmitAnonymous(
		body: GdsdTeamLicenceAppChangeRequest
	): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		return this.gdsdLicensingService.apiGdsdTeamAppAnonymousSubmitPost$Response({ body }).pipe(
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
		const gdsdModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseChange(gdsdModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		const originalLicenceData = gdsdModelFormValue.originalLicenceData;
		body.applicantId = originalLicenceData.originalLicenceHolderId;

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
		const gdsdModelFormValue = this.dogTrainerModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseChange(gdsdModelFormValue);
		const mailingAddressData = this.mailingAddressFormGroup.getRawValue();

		delete body.documentInfos;

		const originalLicenceData = gdsdModelFormValue.originalLicenceData;
		body.applicantId = originalLicenceData.originalLicenceHolderId;

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
		body: GdsdTeamLicenceAppChangeRequest
	): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		return this.gdsdLicensingService.apiGdsdTeamAppAnonymousChangePost$Response({ body }).pipe(
			tap((_resp: any) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					body.serviceTypeCode!,
					body.applicationTypeCode!
				);
				this.utilService.toasterSuccess(successMessage);
			})
		);
	}

	// // OTHER TRAINING array
	// otherTrainingRowUsePersonalTraining(index: number): boolean {
	// 	const otherTrainingsArray = this.dogTrainerModelFormGroup.get(
	// 		'otherTrainingHistoryData.otherTrainings'
	// 	) as FormArray;
	// 	const otherTrainingItem = otherTrainingsArray.at(index);
	// 	const ctrl = otherTrainingItem.get('usePersonalDogTrainer') as FormControl;
	// 	return ctrl?.value === BooleanTypeCode.Yes;
	// }

	// // OTHER TRAINING array
	// otherTrainingRowRemove(index: number): void {
	// 	const otherTrainingsArray = this.dogTrainerModelFormGroup.get(
	// 		'otherTrainingHistoryData.otherTrainings'
	// 	) as FormArray;
	// 	otherTrainingsArray.removeAt(index);
	// }

	// // OTHER TRAINING array
	// otherTrainingRowAdd(train: OtherTraining | null = null): void {
	// 	const otherTrainingsArray = this.dogTrainerModelFormGroup.get(
	// 		'otherTrainingHistoryData.otherTrainings'
	// 	) as FormArray;

	// 	const usePersonalDogTrainer = this.utilService.booleanToBooleanType(train?.usePersonalDogTrainer);

	// 	otherTrainingsArray.push(
	// 		new FormGroup(
	// 			{
	// 				trainingId: new FormControl(train?.trainingId ?? null), // placeholder for ID
	// 				trainingDetail: new FormControl(train?.trainingDetail ?? null, [FormControlValidators.required]),
	// 				usePersonalDogTrainer: new FormControl(usePersonalDogTrainer, [Validators.required]),
	// 				dogTrainerCredential: new FormControl(train?.dogTrainerCredential ?? null),
	// 				trainingTime: new FormControl(train?.trainingTime ?? null),
	// 				trainerGivenName: new FormControl(train?.trainerGivenName ?? null),
	// 				trainerSurname: new FormControl(train?.trainerSurname ?? null),
	// 				trainerPhoneNumber: new FormControl(train?.trainerPhoneNumber ?? null),
	// 				trainerEmailAddress: new FormControl(train?.trainerEmailAddress ?? null, [FormControlValidators.email]),
	// 				hoursPracticingSkill: new FormControl(train?.hoursPracticingSkill ?? null),
	// 			},
	// 			{
	// 				validators: [
	// 					FormGroupValidators.conditionalDefaultRequiredValidator(
	// 						'dogTrainerCredential',
	// 						(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
	// 					),
	// 					FormGroupValidators.conditionalDefaultRequiredValidator(
	// 						'trainingTime',
	// 						(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
	// 					),
	// 					FormGroupValidators.conditionalDefaultRequiredValidator(
	// 						'trainerSurname',
	// 						(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
	// 					),
	// 					FormGroupValidators.conditionalDefaultRequiredValidator(
	// 						'trainerPhoneNumber',
	// 						(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
	// 					),
	// 					FormGroupValidators.conditionalDefaultRequiredValidator(
	// 						'hoursPracticingSkill',
	// 						(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
	// 					),
	// 				],
	// 			}
	// 		)
	// 	);
	// }

	// // SCHOOL TRAINING array
	// schoolTrainingRowRemove(index: number): void {
	// 	const schoolTrainingsArray = this.dogTrainerModelFormGroup.get(
	// 		'schoolTrainingHistoryData.schoolTrainings'
	// 	) as FormArray;
	// 	schoolTrainingsArray.removeAt(index);
	// }

	// // SCHOOL TRAINING array
	// schoolTrainingRowAdd(train: TrainingSchoolInfo | null = null): void {
	// 	const schoolTrainingsArray = this.dogTrainerModelFormGroup.get(
	// 		'schoolTrainingHistoryData.schoolTrainings'
	// 	) as FormArray;
	// 	schoolTrainingsArray.push(
	// 		new FormGroup(
	// 			{
	// 				trainingId: new FormControl(train?.trainingId ?? null), // placeholder for ID
	// 				trainingBizName: new FormControl(train?.trainingBizName ?? null, [FormControlValidators.required]),
	// 				contactGivenName: new FormControl(train?.contactGivenName ?? null),
	// 				contactSurname: new FormControl(train?.contactSurname ?? null, [FormControlValidators.required]),
	// 				contactPhoneNumber: new FormControl(train?.contactPhoneNumber ?? null, [Validators.required]),
	// 				contactEmailAddress: new FormControl(train?.contactEmailAddress ?? null, [FormControlValidators.email]),
	// 				trainingStartDate: new FormControl(train?.trainingStartDate ?? null, [Validators.required]),
	// 				trainingEndDate: new FormControl(train?.trainingEndDate ?? null, [Validators.required]),
	// 				trainingName: new FormControl(train?.trainingName ?? null, [Validators.required]),
	// 				totalTrainingHours: new FormControl(train?.totalTrainingHours ?? null, [Validators.required]),
	// 				whatLearned: new FormControl(train?.whatLearned ?? null, [Validators.required]),
	// 				addressSelected: new FormControl(!!train?.trainingBizMailingAddress?.addressLine1, [Validators.requiredTrue]),
	// 				addressLine1: new FormControl(train?.trainingBizMailingAddress?.addressLine1 ?? null, [
	// 					FormControlValidators.required,
	// 				]),
	// 				addressLine2: new FormControl(train?.trainingBizMailingAddress?.addressLine2 ?? null),
	// 				city: new FormControl(train?.trainingBizMailingAddress?.city ?? null, [FormControlValidators.required]),
	// 				postalCode: new FormControl(train?.trainingBizMailingAddress?.postalCode ?? null, [
	// 					FormControlValidators.required,
	// 				]),
	// 				province: new FormControl(train?.trainingBizMailingAddress?.province ?? null, [
	// 					FormControlValidators.required,
	// 				]),
	// 				country: new FormControl(train?.trainingBizMailingAddress?.country ?? null, [FormControlValidators.required]),
	// 			},
	// 			{
	// 				validators: [FormGroupValidators.daterangeValidator('trainingStartDate', 'trainingEndDate')],
	// 			}
	// 		)
	// 	);
	// }

	// // SCHOOL TRAINING array
	// getSchoolTrainingFormGroup(index: number): FormGroup {
	// 	const schoolTrainingsArray = this.dogTrainerModelFormGroup.get(
	// 		'schoolTrainingHistoryData.schoolTrainings'
	// 	) as FormArray;
	// 	return schoolTrainingsArray.at(index) as FormGroup;
	// }

	// schoolTrainingAddArray(schoolTrainings: Array<TrainingSchoolInfo> | null | undefined): void {
	// 	if (!schoolTrainings) return;

	// 	schoolTrainings.forEach((train: TrainingSchoolInfo) => {
	// 		this.schoolTrainingRowAdd(train);
	// 	});
	// }

	// otherTrainingAddArray(otherTrainings: Array<OtherTraining> | null | undefined): void {
	// 	if (!otherTrainings) return;

	// 	otherTrainings.forEach((train: OtherTraining) => {
	// 		this.otherTrainingRowAdd(train);
	// 	});
	// }
}
