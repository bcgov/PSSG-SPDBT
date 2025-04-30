import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicantProfileResponse,
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	Document,
	DogSchoolResponse,
	GdsdTeamAppCommandResponse,
	GdsdTeamLicenceAppChangeRequest,
	GdsdTeamLicenceAppResponse,
	GdsdTeamLicenceAppUpsertRequest,
	GoogleRecaptcha,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	LicenceTermCode,
	OtherTraining,
	ServiceTypeCode,
	TrainingSchoolInfo,
} from '@app/api/models';
import {
	ApplicantProfileService,
	GdsdTeamLicensingService,
	LicenceAppDocumentService,
	LicenceService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
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
import { ConfigService } from './config.service';
import { FileUtilService, SpdFile } from './file-util.service';
import { GdsdTeamApplicationHelper } from './gdsd-team-application.helper';
import { LicenceDocumentsToSave, UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class GdsdTeamApplicationService extends GdsdTeamApplicationHelper {
	gdsdTeamModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	gdsdTeamModelFormGroup: FormGroup = this.formBuilder.group({
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
		medicalInformationData: this.medicalInformationFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		dogTasksData: this.dogTasksFormGroup,
		dogCertificationSelectionData: this.dogCertificationSelectionFormGroup,
		dogInfoData: this.dogInfoFormGroup,
		dogGdsdData: this.dogGdsdFormGroup,
		dogInoculationsData: this.dogInoculationsFormGroup,
		dogMedicalData: this.dogMedicalFormGroup,
		graduationInfoData: this.graduationInfoFormGroup,
		trainingHistoryData: this.trainingHistoryFormGroup,
		schoolTrainingHistoryData: this.schoolTrainingHistoryFormGroup,
		otherTrainingHistoryData: this.otherTrainingHistoryFormGroup,
		dogRenewData: this.dogRenewFormGroup,
	});

	gdsdTeamModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		utilService: UtilService,
		maskPipe: NgxMaskPipe,
		private fileUtilService: FileUtilService,
		private applicantProfileService: ApplicantProfileService,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private gdsdTeamLicensingService: GdsdTeamLicensingService,
		private configService: ConfigService,
		private licenceService: LicenceService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService
	) {
		super(formBuilder, utilService, maskPipe);

		this.gdsdTeamModelChangedSubscription = this.gdsdTeamModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepSelectionComplete();
					const step2Complete = this.isStepPersonalInfoComplete();
					const step3Complete = this.isStepDogInfoComplete();
					const step4Complete = this.isStepTrainingInfoComplete();
					const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

					console.debug(
						'gdsdTeamModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						step4Complete,
						this.gdsdTeamModelFormGroup.getRawValue()
					);
					this.updateModelChangeFlags();
					this.gdsdTeamModelValueChanges$.next(isValid);
				}
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
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepSelectionComplete(): boolean {
		const applicationTypeCode = this.gdsdTeamModelFormGroup.get('applicationTypeData.applicationTypeCode')?.value;
		if (applicationTypeCode === ApplicationTypeCode.Renewal) {
			return true;
		}

		if (this.authenticationService.isLoggedIn()) {
			return this.dogCertificationSelectionFormGroup.valid;
		}

		return this.termsAndConditionsFormGroup.valid && this.dogCertificationSelectionFormGroup.valid;
	}

	/**
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepPersonalInfoComplete(): boolean {
		const applicationTypeCode = this.gdsdTeamModelFormGroup.get('applicationTypeData.applicationTypeCode')?.value;

		if (applicationTypeCode === ApplicationTypeCode.Renewal) {
			return (
				this.personalInformationFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid &&
				this.governmentPhotoIdFormGroup.valid &&
				this.mailingAddressFormGroup.valid
			);
		}

		const isTrainedByAccreditedSchools =
			this.gdsdTeamModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		if (isTrainedByAccreditedSchools) {
			return (
				this.personalInformationFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid &&
				this.governmentPhotoIdFormGroup.valid &&
				this.mailingAddressFormGroup.valid
			);
		}

		return (
			this.personalInformationFormGroup.valid &&
			this.medicalInformationFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.governmentPhotoIdFormGroup.valid &&
			this.mailingAddressFormGroup.valid
		);
	}

	/**
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepDogInfoComplete(): boolean {
		const applicationTypeCode = this.gdsdTeamModelFormGroup.get('applicationTypeData.applicationTypeCode')?.value;

		// console.debug('isStepDogInformationComplete', applicationTypeCode, this.dogInformationFormGroup.valid, this.dogRenewFormGroup.valid );

		if (applicationTypeCode === ApplicationTypeCode.Renewal) {
			return this.dogRenewFormGroup.valid;
		}

		const isTrainedByAccreditedSchools =
			this.gdsdTeamModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		// console.debug('isStepDogInformationComplete', isTrainedByAccreditedSchools, this.dogGdsdFormGroup.valid, this.dogInformationFormGroup.valid, this.dogMedicalFormGroup.valid );

		if (isTrainedByAccreditedSchools) {
			return this.dogGdsdFormGroup.valid && this.dogInfoFormGroup.valid;
		}

		return this.dogInfoFormGroup.valid && this.dogMedicalFormGroup.valid;
	}

	/**
	 * Determine if the step is valid
	 * @returns boolean
	 */
	isStepTrainingInfoComplete(): boolean {
		const applicationTypeCode = this.gdsdTeamModelFormGroup.get('applicationTypeData.applicationTypeCode')?.value;

		if (applicationTypeCode === ApplicationTypeCode.Renewal) {
			return true;
		}

		const isTrainedByAccreditedSchools =
			this.gdsdTeamModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		if (isTrainedByAccreditedSchools) {
			const isServiceDog = this.gdsdTeamModelFormGroup.get('dogGdsdData.isGuideDog')?.value === BooleanTypeCode.No;

			// console.debug('isStepTrainingInformationComplete', isServiceDog, this.graduationInfoFormGroup.valid, this.dogTasksFormGroup.valid );

			if (isServiceDog) {
				return this.graduationInfoFormGroup.valid && this.dogTasksFormGroup.valid;
			}

			return this.graduationInfoFormGroup.valid;
		}

		const hasAttendedTrainingSchool =
			this.gdsdTeamModelFormGroup.get('trainingHistoryData.hasAttendedTrainingSchool')?.value === BooleanTypeCode.Yes;

		// console.debug('isStepTrainingInformationComplete', hasAttendedTrainingSchool, this.trainingHistoryFormGroup.valid,
		// this.schoolTrainingHistoryFormGroup.valid, this.otherTrainingHistoryFormGroup.valid, this.dogTasksFormGroup.valid );

		if (hasAttendedTrainingSchool) {
			return (
				this.trainingHistoryFormGroup.valid && this.schoolTrainingHistoryFormGroup.valid && this.dogTasksFormGroup.valid
			);
		}

		return (
			this.trainingHistoryFormGroup.valid && this.otherTrainingHistoryFormGroup.valid && this.dogTasksFormGroup.valid
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
		this.gdsdTeamModelFormGroup.reset();

		// clear the array data - this does not seem to get reset during a formgroup reset
		const otherTrainingsArray = this.gdsdTeamModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		while (otherTrainingsArray.length) {
			otherTrainingsArray.removeAt(0);
		}
		const schoolTrainingsArray = this.gdsdTeamModelFormGroup.get(
			'schoolTrainingHistoryData.schoolTrainings'
		) as FormArray;
		while (schoolTrainingsArray.length) {
			schoolTrainingsArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.gdsdTeamModelFormGroup.value);
	}

	/*************************************************************/
	// AUTHENTICATED
	/*************************************************************/

	/**
	 * Partial Save - Save the data as is.
	 * @returns StrictHttpResponse<GdsdTeamAppCommandResponse>
	 */
	partialSaveLicenceStepAuthenticated(
		isSaveAndExit?: boolean
	): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdTeamModelFormGroup.getRawValue();

		const body = this.getSaveBodyBaseNew(gdsdModelFormValue) as GdsdTeamLicenceAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.gdsdTeamLicensingService.apiGdsdTeamAppPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<GdsdTeamAppCommandResponse>) => {
				this.hasValueChanged = false;

				let msg = 'Your application has been saved';
				if (isSaveAndExit) {
					msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
				}
				this.utilService.toasterSuccess(msg);

				if (!gdsdModelFormValue.licenceAppId) {
					this.gdsdTeamModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
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
			licenceAppId: this.gdsdTeamModelFormGroup.get('licenceAppId')?.value,
			body: {
				documents: [documentFile],
				licenceDocumentTypeCode: documentCode,
			},
		});
	}

	/**
	 * Create an empty authenticated licence
	 * @returns
	 */
	createNewApplAuthenticated(serviceTypeCode: ServiceTypeCode): Observable<any> {
		const apis = [
			this.configService.getAccreditedDogSchools(),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const applicantProfile: ApplicantProfileResponse = resps[1];

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

		this.gdsdTeamModelFormGroup.patchValue(
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

		this.schoolTrainingRowAdd();
		this.otherTrainingRowAdd();

		return of(this.gdsdTeamModelFormGroup.value);
	}

	/**
	 * Submit the authenticated licence data - new/renew
	 * @returns
	 */
	submitLicenceAuthenticated(
		applicationTypeCode: ApplicationTypeCode
	): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		if (applicationTypeCode == ApplicationTypeCode.New) {
			return this.submitLicenceNewAuthenticated();
		}

		return this.submitLicenceChangeAuthenticated();
	}

	/**
	 * Submit the licence data - new
	 * @returns
	 */
	private submitLicenceNewAuthenticated(): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdTeamModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseNew(gdsdModelFormValue) as GdsdTeamLicenceAppUpsertRequest;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.gdsdTeamLicensingService.apiGdsdTeamAppSubmitPost$Response({ body }).pipe(
			tap((_resp: any) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					body.serviceTypeCode!,
					body.applicationTypeCode!
				);
				this.utilService.toasterSuccess(successMessage, false);
			})
		);
	}

	/**
	 * Submit the application data for authenticated renewal
	 * @returns
	 */
	private submitLicenceChangeAuthenticated(): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdTeamModelFormGroup.getRawValue();
		const bodyUpsert = this.getSaveBodyBaseChange(gdsdModelFormValue);
		delete bodyUpsert.documentInfos;

		const body = bodyUpsert as GdsdTeamLicenceAppChangeRequest;

		const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

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
		body: GdsdTeamLicenceAppChangeRequest
	): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		return this.gdsdTeamLicensingService.apiGdsdTeamAppChangePost$Response({ body }).pipe(
			tap((_resp: any) => {
				const successMessage = this.commonApplicationService.getSubmitSuccessMessage(
					body.serviceTypeCode!,
					body.applicationTypeCode!
				);
				this.utilService.toasterSuccess(successMessage, false);
			})
		);
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getGdsdToResume(licenceAppId: string): Observable<GdsdTeamLicenceAppResponse> {
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
			this.gdsdTeamLicensingService.apiGdsdTeamAppLicenceAppIdGet({ licenceAppId }),
			this.applicantProfileService.apiApplicantIdGet({
				id: this.authUserBcscService.applicantLoginProfile?.applicantId!,
			}),
			this.configService.getAccreditedDogSchools(),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const gdsdAppl: GdsdTeamLicenceAppResponse = resps[0];
				const applicantProfile: ApplicantProfileResponse = resps[1];

				return this.applyApplicationProfileIntoModel(gdsdAppl, applicantProfile);
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
	): Observable<GdsdTeamLicenceAppResponse> {
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
		// handle renewal
		if (applicationTypeCode === ApplicationTypeCode.Renewal) {
			return forkJoin([
				this.applicantProfileService.apiApplicantIdGet({ id: associatedLicence.licenceHolderId! }),
				this.licenceService.apiLicencesLicencePhotoLicenceIdGet({ licenceId: associatedLicence.licenceId! }),
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

		// handle replacement
		return this.applicantProfileService.apiApplicantIdGet({ id: associatedLicence.licenceHolderId! }).pipe(
			switchMap((applicantProfile: ApplicantProfileResponse) => {
				return this.applyLicenceProfileIntoModel(applicantProfile, associatedLicence).pipe(
					switchMap((_resp: any) => {
						return this.applyReplacementDataUpdatesToModel();
					})
				);
			})
		);
	}

	accreditedFlagChanged(isAccredited: boolean): void {
		if (isAccredited) {
			// empty attachments that are not related
			const medicalAttachments = this.medicalInformationFormGroup.get('attachments') as FormControl;
			medicalAttachments.setValue([]);

			const dogMedicalAttachments = this.dogMedicalFormGroup.get('attachments') as FormControl;
			dogMedicalAttachments.setValue([]);
			return;
		}

		// empty attachments that are not related to non-accredited
		const accreditedGraduationAttachments = this.graduationInfoFormGroup.get('attachments') as FormControl;
		accreditedGraduationAttachments.setValue([]);

		const schoolTrainingAttachments = this.schoolTrainingHistoryFormGroup.get('attachments') as FormControl;
		schoolTrainingAttachments.setValue([]);

		const otherTrainingAttachments = this.otherTrainingHistoryFormGroup.get('attachments') as FormControl;
		otherTrainingAttachments.setValue([]);

		const practiceLogAttachments = this.otherTrainingHistoryFormGroup.get('practiceLogAttachments') as FormControl;
		practiceLogAttachments.setValue([]);
	}

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

		this.gdsdTeamModelFormGroup.patchValue(
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
				return of(this.gdsdTeamModelFormGroup.value);
			})
		);
	}

	/**
	 * Overwrite or change any data specific to the replacment flow
	 */
	private applyReplacementDataUpdatesToModel(): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };
		const dogRenewData = { isAssistanceStillRequired: true };

		this.gdsdTeamModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				dogRenewData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.gdsdTeamModelFormGroup.value);
	}

	/**
	 * Apply the data from the Application and Applicant Profile into the main model
	 */
	private applyApplicationProfileIntoModel(
		gdsdAppl: GdsdTeamLicenceAppResponse,
		applicantProfile: ApplicantProfileResponse
	): Observable<any> {
		return this.applyApplicationIntoModel(gdsdAppl).pipe(
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
			addressSelected: !!bcscMailingAddress && !!bcscMailingAddress.addressLine1,
			isAddressTheSame: false,
			addressLine1: bcscMailingAddress?.addressLine1,
			addressLine2: bcscMailingAddress?.addressLine2,
			city: bcscMailingAddress?.city,
			country: bcscMailingAddress?.country,
			postalCode: bcscMailingAddress?.postalCode,
			province: bcscMailingAddress?.province,
		};

		this.gdsdTeamModelFormGroup.patchValue(
			{
				personalInformationData,
				mailingAddressData,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.gdsdTeamModelFormGroup.value);
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

		this.gdsdTeamModelFormGroup.patchValue(
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

		return of(this.gdsdTeamModelFormGroup.value);
	}

	/**
	 * Apply the application data into the main model
	 */
	private applyApplicationIntoModel(gdsdAppl: GdsdTeamLicenceAppResponse): Observable<any> {
		const serviceTypeData = { serviceTypeCode: gdsdAppl.serviceTypeCode };
		const applicationTypeData = { applicationTypeCode: gdsdAppl.applicationTypeCode };
		const dogCertificationSelectionData = {
			isDogTrainedByAccreditedSchool: this.utilService.booleanToBooleanType(gdsdAppl.isDogTrainedByAccreditedSchool),
		};

		const personalInformationData = {
			givenName: gdsdAppl.givenName,
			middleName: gdsdAppl.middleName,
			surname: gdsdAppl.surname,
			dateOfBirth: gdsdAppl.dateOfBirth,
			phoneNumber: gdsdAppl.phoneNumber,
			emailAddress: gdsdAppl.emailAddress,
			hasBcscNameChanged: false,
		};

		const bcscMailingAddress = gdsdAppl.mailingAddress;
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

		let medicalInformationData: any = null;
		let photographOfYourselfData: any = null;
		let dogTasksData: any = null;
		let dogInfoData: any = null;
		let dogGdsdData: any = null;
		let dogMedicalData: any = null;
		let graduationInfoData: any = null;
		let trainingHistoryData: any = null;

		const schoolSupportTrainingHistoryAttachments: Array<File> = [];
		const otherSupportTrainingHistoryAttachments: Array<File> = [];
		const otherTrainingHistoryPracticeAttachments: Array<File> = [];

		const schoolTrainingHistoryData = {
			schoolTrainings: [],
			attachments: schoolSupportTrainingHistoryAttachments,
		};
		const otherTrainingHistoryData = {
			otherTrainings: [],
			attachments: otherSupportTrainingHistoryAttachments,
			practiceLogAttachments: otherTrainingHistoryPracticeAttachments,
		};

		let schoolTrainingsArray: Array<TrainingSchoolInfo> | null = null;
		let otherTrainingsArray: Array<OtherTraining> | null = null;

		const photographOfYourselfAttachments: Array<File> = [];
		const governmentIssuedAttachments: Array<File> = [];
		const medicalInformationAttachments: Array<File> = [];
		const dogMedicalAttachments: Array<File> = [];
		const accreditedGraduationAttachments: Array<File> = [];

		const governmentPhotoIdData: {
			photoTypeCode: LicenceDocumentTypeCode | null;
			expiryDate: string | null;
			attachments: File[];
		} = {
			photoTypeCode: null,
			expiryDate: null,
			attachments: [],
		};

		gdsdAppl.documentInfos?.forEach((doc: Document) => {
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
				case LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog: {
					const aFile = this.fileUtilService.dummyFile(doc);
					medicalInformationAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog: {
					const aFile = this.fileUtilService.dummyFile(doc);
					dogMedicalAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool: {
					const aFile = this.fileUtilService.dummyFile(doc);
					accreditedGraduationAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument: {
					const aFile = this.fileUtilService.dummyFile(doc);
					if (gdsdAppl.nonAccreditedSchoolQuestions?.trainingInfo?.hasAttendedTrainingSchool) {
						schoolSupportTrainingHistoryAttachments.push(aFile);
					} else {
						otherSupportTrainingHistoryAttachments.push(aFile);
					}
					break;
				}
				case LicenceDocumentTypeCode.GdsdPracticeHoursLog: {
					const aFile = this.fileUtilService.dummyFile(doc);
					otherTrainingHistoryPracticeAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.PhotoOfYourself: {
					const aFile = this.fileUtilService.dummyFile(doc);
					photographOfYourselfAttachments.push(aFile);
					break;
				}
			}
		});

		if (medicalInformationAttachments.length > 0) {
			medicalInformationData = { attachments: medicalInformationAttachments };
		}

		const dogInoculationsData = {
			areInoculationsUpToDate: this.utilService.booleanToBooleanType(
				gdsdAppl.nonAccreditedSchoolQuestions?.areInoculationsUpToDate
			),
		};

		if (dogMedicalAttachments.length > 0) {
			dogMedicalData = {
				attachments: dogMedicalAttachments,
			};
		}

		if (photographOfYourselfAttachments.length > 0) {
			photographOfYourselfData = {
				updatePhoto: null,
				uploadedDateTime: null,
				attachments: photographOfYourselfAttachments,
				updateAttachments: [],
			};
		}

		if (gdsdAppl.dogInfo) {
			dogInfoData = {
				dogName: gdsdAppl.dogInfo.dogName,
				dogDateOfBirth: gdsdAppl.dogInfo.dogDateOfBirth,
				dogBreed: gdsdAppl.dogInfo.dogBreed,
				dogColorAndMarkings: gdsdAppl.dogInfo.dogColorAndMarkings,
				dogGender: gdsdAppl.dogInfo.dogGender,
				microchipNumber: gdsdAppl.dogInfo.microchipNumber,
			};
		}

		if (
			this.utilService.hasBooleanValue(gdsdAppl.isDogTrainedByAccreditedSchool) &&
			gdsdAppl.isDogTrainedByAccreditedSchool
		) {
			if (gdsdAppl.accreditedSchoolQuestions?.graduationInfo) {
				graduationInfoData = {
					accreditedSchoolId: gdsdAppl.accreditedSchoolQuestions?.graduationInfo.accreditedSchoolId,
					accreditedSchoolName: gdsdAppl.accreditedSchoolQuestions?.graduationInfo.accreditedSchoolName,
					attachments: accreditedGraduationAttachments,
				};
			}

			if (gdsdAppl.accreditedSchoolQuestions) {
				dogGdsdData = {
					isGuideDog: this.utilService.booleanToBooleanType(gdsdAppl.accreditedSchoolQuestions.isGuideDog),
				};

				dogTasksData = {
					tasks: gdsdAppl.accreditedSchoolQuestions.serviceDogTasks,
				};
			}
		}

		if (
			this.utilService.hasBooleanValue(gdsdAppl.isDogTrainedByAccreditedSchool) &&
			!gdsdAppl.isDogTrainedByAccreditedSchool &&
			gdsdAppl.nonAccreditedSchoolQuestions
		) {
			if (gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo) {
				dogTasksData = {
					tasks: gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.specializedTasksWhenPerformed,
				};

				if (
					this.utilService.hasBooleanValue(gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.hasAttendedTrainingSchool)
				) {
					trainingHistoryData = {
						hasAttendedTrainingSchool: this.utilService.booleanToBooleanType(
							gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.hasAttendedTrainingSchool
						),
					};

					if (gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.hasAttendedTrainingSchool) {
						schoolTrainingsArray = gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.schoolTrainings ?? null;
						schoolTrainingHistoryData.attachments = schoolSupportTrainingHistoryAttachments;
					} else {
						otherTrainingsArray = gdsdAppl.nonAccreditedSchoolQuestions.trainingInfo.otherTrainings ?? null;
						otherTrainingHistoryData.attachments = otherSupportTrainingHistoryAttachments;
						otherTrainingHistoryData.practiceLogAttachments = otherTrainingHistoryPracticeAttachments;
					}

					const schoolTrainingsArrayHasData = schoolTrainingsArray ? schoolTrainingsArray.length > 0 : false;
					const otherTrainingsArrayHasData = otherTrainingsArray ? otherTrainingsArray.length > 0 : false;

					// if neither array has data, then unset the flag to reprompt the user
					if (!schoolTrainingsArrayHasData && !otherTrainingsArrayHasData) {
						trainingHistoryData.hasAttendedTrainingSchool = null;
					}
				}
			}
		}

		this.gdsdTeamModelFormGroup.patchValue(
			{
				licenceAppId: gdsdAppl.licenceAppId,
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				serviceTypeData,
				licenceTermCode: gdsdAppl.licenceTermCode,
				applicationTypeData,

				personalInformationData,
				medicalInformationData,
				photographOfYourselfData,
				governmentPhotoIdData,
				mailingAddressData,
				dogTasksData,
				dogCertificationSelectionData,
				dogInfoData,
				dogGdsdData,
				dogInoculationsData,
				dogMedicalData,
				graduationInfoData,
				trainingHistoryData,
				schoolTrainingHistoryData,
				otherTrainingHistoryData,
			},
			{
				emitEvent: false,
			}
		);

		if (schoolTrainingsArray && schoolTrainingsArray.length > 0) {
			this.schoolTrainingAddArray(schoolTrainingsArray);
		} else {
			this.schoolTrainingRowAdd();
		}

		if (otherTrainingsArray && otherTrainingsArray.length > 0) {
			this.otherTrainingAddArray(otherTrainingsArray);
		} else {
			this.otherTrainingRowAdd();
		}

		return of(this.gdsdTeamModelFormGroup.value);
	}

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/

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

		this.gdsdTeamModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				licenceTermCode: LicenceTermCode.TwoYears,
				serviceTypeData,
			},
			{
				emitEvent: false,
			}
		);

		this.schoolTrainingRowAdd();
		this.otherTrainingRowAdd();

		return of(this.gdsdTeamModelFormGroup.value);
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
				const personalInformationData = _resp.personalInformationData;

				personalInformationData.cardHolderName = associatedLicence.nameOnCard;
				personalInformationData.licenceHolderName = associatedLicence.licenceHolderName;

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

	submitLicenceAnonymous(): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdTeamModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseNew(gdsdModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;
		const originalLicenceData = gdsdModelFormValue.originalLicenceData;
		body.applicantId = originalLicenceData.originalLicenceHolderId;

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
	 * Submit the application data for anonymous replacement
	 */
	submitLicenceReplacementAnonymous(): Observable<StrictHttpResponse<GdsdTeamAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdTeamModelFormGroup.getRawValue();
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

		const originalLicenceData = gdsdModelFormValue.originalLicenceData;
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

	// OTHER TRAINING array
	otherTrainingRowUsePersonalTraining(index: number): boolean {
		const otherTrainingsArray = this.gdsdTeamModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		const otherTrainingItem = otherTrainingsArray.at(index);
		const ctrl = otherTrainingItem.get('usePersonalDogTrainer') as FormControl;
		return ctrl?.value === BooleanTypeCode.Yes;
	}

	// OTHER TRAINING array
	otherTrainingRowRemove(index: number): void {
		const otherTrainingsArray = this.gdsdTeamModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		otherTrainingsArray.removeAt(index);
	}

	// OTHER TRAINING array
	otherTrainingRowAdd(train: OtherTraining | null = null): void {
		const otherTrainingsArray = this.gdsdTeamModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;

		const usePersonalDogTrainer = this.utilService.booleanToBooleanType(train?.usePersonalDogTrainer);

		otherTrainingsArray.push(
			new FormGroup(
				{
					trainingId: new FormControl(train?.trainingId ?? null), // placeholder for ID
					trainingDetail: new FormControl(train?.trainingDetail ?? null, [FormControlValidators.required]),
					usePersonalDogTrainer: new FormControl(usePersonalDogTrainer, [FormControlValidators.required]),
					dogTrainerCredential: new FormControl(train?.dogTrainerCredential ?? null),
					trainingTime: new FormControl(train?.trainingTime ?? null),
					trainerGivenName: new FormControl(train?.trainerGivenName ?? null),
					trainerSurname: new FormControl(train?.trainerSurname ?? null),
					trainerPhoneNumber: new FormControl(train?.trainerPhoneNumber ?? null),
					trainerEmailAddress: new FormControl(train?.trainerEmailAddress ?? null, [FormControlValidators.email]),
					hoursPracticingSkill: new FormControl(train?.hoursPracticingSkill ?? null),
				},
				{
					validators: [
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'dogTrainerCredential',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'trainingTime',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'trainerSurname',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'trainerPhoneNumber',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'hoursPracticingSkill',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
					],
				}
			)
		);
	}

	// SCHOOL TRAINING array
	schoolTrainingRowRemove(index: number): void {
		const schoolTrainingsArray = this.gdsdTeamModelFormGroup.get(
			'schoolTrainingHistoryData.schoolTrainings'
		) as FormArray;
		schoolTrainingsArray.removeAt(index);
	}

	// SCHOOL TRAINING array
	schoolTrainingRowAdd(train: TrainingSchoolInfo | null = null): void {
		const schoolTrainingsArray = this.gdsdTeamModelFormGroup.get(
			'schoolTrainingHistoryData.schoolTrainings'
		) as FormArray;
		schoolTrainingsArray.push(
			new FormGroup(
				{
					trainingId: new FormControl(train?.trainingId ?? null), // placeholder for ID
					trainingBizName: new FormControl(train?.trainingBizName ?? null, [FormControlValidators.required]),
					contactGivenName: new FormControl(train?.contactGivenName ?? null),
					contactSurname: new FormControl(train?.contactSurname ?? null, [FormControlValidators.required]),
					contactPhoneNumber: new FormControl(train?.contactPhoneNumber ?? null, [FormControlValidators.required]),
					contactEmailAddress: new FormControl(train?.contactEmailAddress ?? null, [FormControlValidators.email]),
					trainingStartDate: new FormControl(train?.trainingStartDate ?? null, [Validators.required]),
					trainingEndDate: new FormControl(train?.trainingEndDate ?? null, [Validators.required]),
					trainingName: new FormControl(train?.trainingName ?? null, [FormControlValidators.required]),
					totalTrainingHours: new FormControl(train?.totalTrainingHours ?? null, [Validators.required]),
					whatLearned: new FormControl(train?.whatLearned ?? null, [FormControlValidators.required]),
					addressSelected: new FormControl(!!train?.trainingBizMailingAddress?.addressLine1, [Validators.requiredTrue]),
					addressLine1: new FormControl(train?.trainingBizMailingAddress?.addressLine1 ?? null, [
						FormControlValidators.required,
					]),
					addressLine2: new FormControl(train?.trainingBizMailingAddress?.addressLine2 ?? null),
					city: new FormControl(train?.trainingBizMailingAddress?.city ?? null, [FormControlValidators.required]),
					postalCode: new FormControl(train?.trainingBizMailingAddress?.postalCode ?? null, [
						FormControlValidators.required,
					]),
					province: new FormControl(train?.trainingBizMailingAddress?.province ?? null, [
						FormControlValidators.required,
					]),
					country: new FormControl(train?.trainingBizMailingAddress?.country ?? null, [FormControlValidators.required]),
				},
				{
					validators: [FormGroupValidators.daterangeValidator('trainingStartDate', 'trainingEndDate')],
				}
			)
		);
	}

	// SCHOOL TRAINING array
	getSchoolTrainingFormGroup(index: number): FormGroup {
		const schoolTrainingsArray = this.gdsdTeamModelFormGroup.get(
			'schoolTrainingHistoryData.schoolTrainings'
		) as FormArray;
		return schoolTrainingsArray.at(index) as FormGroup;
	}

	schoolTrainingAddArray(schoolTrainings: Array<TrainingSchoolInfo> | null | undefined): void {
		if (!schoolTrainings) return;

		schoolTrainings.forEach((train: TrainingSchoolInfo) => {
			this.schoolTrainingRowAdd(train);
		});
	}

	otherTrainingAddArray(otherTrainings: Array<OtherTraining> | null | undefined): void {
		if (!otherTrainings) return;

		otherTrainings.forEach((train: OtherTraining) => {
			this.otherTrainingRowAdd(train);
		});
	}
}
