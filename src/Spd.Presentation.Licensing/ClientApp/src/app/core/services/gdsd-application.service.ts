import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	Document,
	GdsdAppCommandResponse,
	GdsdTeamLicenceAppAnonymousSubmitRequest,
	GdsdTeamLicenceAppResponse,
	GdsdTeamLicenceAppUpsertRequest,
	GoogleRecaptcha,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceTermCode,
	OtherTraining,
	ServiceTypeCode,
	TrainingSchoolInfo,
} from '@app/api/models';
import { GdsdLicensingService, LicenceAppDocumentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { HotToastService } from '@ngxpert/hot-toast';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	debounceTime,
	distinctUntilChanged,
	forkJoin,
	of,
	switchMap,
	take,
	tap,
} from 'rxjs';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { FormControlValidators } from '../validators/form-control.validators';
import { FormGroupValidators } from '../validators/form-group.validators';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { AuthenticationService } from './authentication.service';
import { CommonApplicationService } from './common-application.service';
import { ConfigService } from './config.service';
import { FileUtilService } from './file-util.service';
import { GdsdApplicationHelper } from './gdsd-application.helper';
import { LicenceDocumentsToSave, UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class GdsdApplicationService extends GdsdApplicationHelper {
	gdsdModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	gdsdModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(),
		applicationOriginTypeCode: new FormControl(), // placeholder to save
		bizTypeCode: new FormControl(), // placeholder to save
		licenceTermCode: new FormControl(), // placeholder to save

		serviceTypeData: this.serviceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		termsAndConditionsData: this.termsAndConditionsFormGroup,
		personalInformationData: this.gdsdPersonalInformationFormGroup,
		medicalInformationData: this.medicalInformationFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		dogTasksData: this.dogTasksFormGroup,
		dogCertificationSelectionData: this.dogCertificationSelectionFormGroup,
		dogInformationData: this.dogInformationFormGroup,
		dogGdsdData: this.dogGdsdFormGroup,
		dogMedicalData: this.dogMedicalFormGroup,
		accreditedGraduationData: this.accreditedGraduationFormGroup,
		trainingHistoryData: this.trainingHistoryFormGroup,
		schoolTrainingHistoryData: this.schoolTrainingHistoryFormGroup,
		otherTrainingHistoryData: this.otherTrainingHistoryFormGroup,
	});

	gdsdModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private hotToastService: HotToastService,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private gdsdLicensingService: GdsdLicensingService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService
	) {
		super(formBuilder, configService, utilService, fileUtilService);

		this.gdsdModelChangedSubscription = this.gdsdModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepSelectionComplete();
					const step2Complete = this.isStepPersonalInformationComplete();
					const step3Complete = this.isStepDogInformationComplete();
					const step4Complete = this.isStepTrainingInformationComplete();
					const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

					console.debug(
						'gdsdModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						step4Complete,
						this.gdsdModelFormGroup.getRawValue()
					);
					this.updateModelChangeFlags();
					this.gdsdModelValueChanges$.next(isValid);
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
	 * @returns
	 */
	isSaveAndExit(): boolean {
		if (this.applicationTypeFormGroup.get('applicationTypeCode')?.value != ApplicationTypeCode.New) {
			return false;
		}

		return true;
	}

	isStepSelectionComplete(): boolean {
		if (this.authenticationService.isLoggedIn()) {
			return this.dogCertificationSelectionFormGroup.valid;
		}

		return this.termsAndConditionsFormGroup.valid && this.dogCertificationSelectionFormGroup.valid;
	}

	isStepPersonalInformationComplete(): boolean {
		const isTrainedByAccreditedSchools =
			this.gdsdModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		console.debug(
			'isStepPersonalInformationComplete',
			isTrainedByAccreditedSchools,
			this.gdsdPersonalInformationFormGroup.valid,
			this.medicalInformationFormGroup.valid,
			this.photographOfYourselfFormGroup.valid,
			this.governmentPhotoIdFormGroup.valid,
			this.mailingAddressFormGroup.valid
		);

		if (isTrainedByAccreditedSchools) {
			return (
				this.gdsdPersonalInformationFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid &&
				this.governmentPhotoIdFormGroup.valid &&
				this.mailingAddressFormGroup.valid
			);
		}

		return (
			this.gdsdPersonalInformationFormGroup.valid &&
			this.medicalInformationFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.governmentPhotoIdFormGroup.valid &&
			this.mailingAddressFormGroup.valid
		);
	}

	isStepDogInformationComplete(): boolean {
		const isTrainedByAccreditedSchools =
			this.gdsdModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		// console.debug('isStepDogInformationComplete', this.dogGdsdFormGroup.valid, this.dogInformationFormGroup.valid, this.dogMedicalFormGroup.valid);

		if (isTrainedByAccreditedSchools) {
			return this.dogGdsdFormGroup.valid && this.dogInformationFormGroup.valid;
		}

		return this.dogInformationFormGroup.valid && this.dogMedicalFormGroup.valid;
	}

	isStepTrainingInformationComplete(): boolean {
		const isTrainedByAccreditedSchools =
			this.gdsdModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		if (isTrainedByAccreditedSchools) {
			const isServiceDog = this.gdsdModelFormGroup.get('dogGdsdData.isGuideDog')?.value === BooleanTypeCode.No;

			// console.debug(
			// 	'isStepTrainingInformationComplete',
			// 	this.accreditedGraduationFormGroup.valid,
			// 	this.dogTasksFormGroup.valid
			// );

			if (isServiceDog) {
				return this.accreditedGraduationFormGroup.valid && this.dogTasksFormGroup.valid;
			}

			return this.accreditedGraduationFormGroup.valid;
		}

		const hasAttendedTrainingSchool =
			this.gdsdModelFormGroup.get('trainingHistoryData.hasAttendedTrainingSchool')?.value === BooleanTypeCode.Yes;

		// console.debug(
		// 	'isStepTrainingInformationComplete',
		// 	hasAttendedTrainingSchool,
		// 	this.trainingHistoryFormGroup.valid,
		// 	this.schoolTrainingHistoryFormGroup.valid,
		// 	this.otherTrainingHistoryFormGroup.valid,
		// 	this.dogTasksFormGroup.valid
		// );

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
		this.gdsdModelFormGroup.reset();

		// clear the array data - this does not seem to get reset during a formgroup reset
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		while (otherTrainingsArray.length) {
			otherTrainingsArray.removeAt(0);
		}
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		while (schoolTrainingsArray.length) {
			schoolTrainingsArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.gdsdModelFormGroup.value);
	}

	/*************************************************************/
	// AUTHENTICATED
	/*************************************************************/

	/**
	 * Partial Save - Save the data as is.
	 * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	 */
	partialSaveLicenceStepAuthenticated(isSaveAndExit?: boolean): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdModelFormGroup.getRawValue();
		console.debug('[partialSaveLicenceStepAuthenticated] gdsdModelFormValue', gdsdModelFormValue);

		const body = this.getSaveBodyBase(gdsdModelFormValue) as GdsdTeamLicenceAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.gdsdLicensingService.apiGdsdTeamAppPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<GdsdAppCommandResponse>) => {
				this.hasValueChanged = false;

				let msg = 'Your application has been saved';
				if (isSaveAndExit) {
					msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
				}
				this.hotToastService.success(msg);

				if (!gdsdModelFormValue.licenceAppId) {
					this.gdsdModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
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
			licenceAppId: this.gdsdModelFormGroup.get('licenceAppId')?.value,
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
	createNewLicenceAuthenticated(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.createEmptyGdsd(serviceTypeCode).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					ServiceTypeCode.GdsdTeamCertification,
					ApplicationTypeCode.New
				);
			})
		);
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	submitLicenceNewAuthenticated(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdModelFormGroup.getRawValue();
		console.debug('[submitLicenceNewAuthenticated] gdsdModelFormValue', gdsdModelFormValue);

		const body = this.getSaveBodyBase(gdsdModelFormValue) as GdsdTeamLicenceAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.gdsdLicensingService.apiGdsdTeamAppSubmitPost$Response({ body });
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getGdsdToResume(licenceAppId: string): Observable<GdsdTeamLicenceAppResponse> {
		return this.loadPartialLicenceWithIdAuthenticated(licenceAppId).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode
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
		const accreditedGraduationAttachments = this.accreditedGraduationFormGroup.get('attachments') as FormControl;
		accreditedGraduationAttachments.setValue([]);

		const schoolTrainingAttachments = this.schoolTrainingHistoryFormGroup.get('attachments') as FormControl;
		schoolTrainingAttachments.setValue([]);

		const otherTrainingAttachments = this.otherTrainingHistoryFormGroup.get('attachments') as FormControl;
		otherTrainingAttachments.setValue([]);

		const practiceLogAttachments = this.otherTrainingHistoryFormGroup.get('practiceLogAttachments') as FormControl;
		practiceLogAttachments.setValue([]);
	}

	private loadPartialLicenceWithIdAuthenticated(licenceAppId: string): Observable<any> {
		this.reset();

		return this.gdsdLicensingService.apiGdsdTeamAppLicenceAppIdGet({ licenceAppId }).pipe(
			switchMap((appl: GdsdTeamLicenceAppResponse) => {
				return this.applyLicenceIntoModel(appl);
			})
		);
	}

	private applyLicenceIntoModel(appl: GdsdTeamLicenceAppResponse): Observable<any> {
		const serviceTypeData = { serviceTypeCode: appl.serviceTypeCode };
		const applicationTypeData = { applicationTypeCode: appl.applicationTypeCode };
		const dogCertificationSelectionData = {
			isDogTrainedByAccreditedSchool: this.utilService.booleanToBooleanType(appl.isDogTrainedByAccreditedSchool),
		};

		const personalInformationData = {
			givenName: appl.givenName,
			middleName: appl.middleName,
			surname: appl.surname,
			dateOfBirth: appl.dateOfBirth,
			contactPhoneNumber: appl.contactPhoneNumber,
			contactEmailAddress: appl.contactEmailAddress,
		};

		const mailingAddressData = {
			addressSelected: !!appl.mailingAddress,
			isAddressTheSame: false,
			addressLine1: appl.mailingAddress?.addressLine1,
			addressLine2: appl.mailingAddress?.addressLine2,
			city: appl.mailingAddress?.city,
			country: appl.mailingAddress?.country,
			postalCode: appl.mailingAddress?.postalCode,
			province: appl.mailingAddress?.province,
		};

		let medicalInformationData: any = null;
		let photographOfYourselfData: any = null;
		let dogTasksData: any = null;
		let dogInformationData: any = null;
		let dogGdsdData: any = null;
		let dogMedicalData: any = null;
		let accreditedGraduationData: any = null;
		let trainingHistoryData: any = null;

		const schoolSupportTrainingHistoryAttachments: Array<File> = [];
		const otherSupportTrainingHistoryAttachments: Array<File> = [];
		const otherTrainingHistoryPracticeAttachments: Array<File> = [];

		let schoolTrainingHistoryData = {
			schoolTrainings: Array(),
			attachments: schoolSupportTrainingHistoryAttachments,
		};
		let otherTrainingHistoryData = {
			otherTrainings: Array(),
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

		appl.documentInfos?.forEach((doc: Document) => {
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
					if (appl.trainingInfo?.hasAttendedTrainingSchool) {
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

		if (dogMedicalAttachments.length > 0) {
			dogMedicalData = {
				areInoculationsUpToDate: this.utilService.booleanToBooleanType(
					appl.dogInfoNewWithoutAccreditedSchool?.areInoculationsUpToDate
				),
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

		if (appl.isDogTrainedByAccreditedSchool) {
			if (appl.graduationInfo) {
				accreditedGraduationData = {
					accreditedSchoolName: appl.graduationInfo.accreditedSchoolName,
					schoolContactGivenName: appl.graduationInfo.schoolContactGivenName,
					schoolContactSurname: appl.graduationInfo.schoolContactSurname,
					schoolContactPhoneNumber: appl.graduationInfo.schoolContactPhoneNumber,
					schoolContactEmailAddress: appl.graduationInfo.schoolContactEmailAddress,
					attachments: accreditedGraduationAttachments,
				};
			}

			if (appl.dogInfoNewAccreditedSchool) {
				dogGdsdData = { isGuideDog: this.utilService.booleanToBooleanType(appl.dogInfoNewAccreditedSchool.isGuideDog) };

				dogInformationData = {
					dogName: appl.dogInfoNewAccreditedSchool.dogName,
					dogDateOfBirth: appl.dogInfoNewAccreditedSchool.dogDateOfBirth,
					dogBreed: appl.dogInfoNewAccreditedSchool.dogBreed,
					dogColorAndMarkings: appl.dogInfoNewAccreditedSchool.dogColorAndMarkings,
					dogGender: appl.dogInfoNewAccreditedSchool.dogGender,
					microchipNumber: appl.dogInfoNewAccreditedSchool.microchipNumber,
				};

				dogTasksData = {
					tasks: appl.dogInfoNewAccreditedSchool.serviceDogTasks,
				};
			}
		}

		if (!appl.isDogTrainedByAccreditedSchool && appl.dogInfoNewWithoutAccreditedSchool) {
			dogInformationData = {
				dogName: appl.dogInfoNewWithoutAccreditedSchool.dogName,
				dogDateOfBirth: appl.dogInfoNewWithoutAccreditedSchool.dogDateOfBirth,
				dogBreed: appl.dogInfoNewWithoutAccreditedSchool.dogBreed,
				dogColorAndMarkings: appl.dogInfoNewWithoutAccreditedSchool.dogColorAndMarkings,
				dogGender: appl.dogInfoNewWithoutAccreditedSchool.dogGender,
				microchipNumber: appl.dogInfoNewWithoutAccreditedSchool.microchipNumber,
			};

			if (appl.trainingInfo) {
				dogTasksData = {
					tasks: appl.trainingInfo.specializedTasksWhenPerformed,
				};

				trainingHistoryData = {
					hasAttendedTrainingSchool: this.utilService.booleanToBooleanType(appl.trainingInfo.hasAttendedTrainingSchool),
				};

				if (appl.trainingInfo.hasAttendedTrainingSchool) {
					schoolTrainingsArray = appl.trainingInfo.schoolTrainings ?? null;
					schoolTrainingHistoryData.attachments = schoolSupportTrainingHistoryAttachments;
				} else {
					otherTrainingsArray = appl.trainingInfo.otherTrainings ?? null;
					otherTrainingHistoryData.attachments = otherSupportTrainingHistoryAttachments;
					otherTrainingHistoryData.practiceLogAttachments = otherTrainingHistoryPracticeAttachments;
				}
			}
		}

		this.gdsdModelFormGroup.patchValue(
			{
				licenceAppId: appl.licenceAppId,
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				serviceTypeData,
				licenceTermCode: LicenceTermCode.TwoYears,
				applicationTypeData,

				personalInformationData,
				medicalInformationData,
				photographOfYourselfData,
				governmentPhotoIdData,
				mailingAddressData,
				dogTasksData,
				dogCertificationSelectionData,
				dogInformationData,
				dogGdsdData,
				dogMedicalData,
				accreditedGraduationData,
				trainingHistoryData,
				schoolTrainingHistoryData,
				otherTrainingHistoryData,
			},
			{
				emitEvent: false,
			}
		);

		if (schoolTrainingsArray) {
			this.schoolTrainingAddArray(schoolTrainingsArray);
		} else {
			this.schoolTrainingRowAdd();
		}

		if (otherTrainingsArray) {
			this.otherTrainingAddArray(otherTrainingsArray);
		} else {
			this.otherTrainingRowAdd();
		}

		console.debug('[createNewGdsdAuthenticated] gdsdModelFormGroup', this.gdsdModelFormGroup.value);
		return of(this.gdsdModelFormGroup.value);
	}

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/

	/**
	 * Create an empty permit
	 * @returns
	 */
	createNewGdsdAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.createEmptyGdsd(serviceTypeCode).pipe(
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

	private createEmptyGdsd(serviceTypeCode: ServiceTypeCode): Observable<any> {
		this.reset();

		const serviceTypeData = { serviceTypeCode };

		this.gdsdModelFormGroup.patchValue(
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

		return of(this.gdsdModelFormGroup.value);
	}

	/**
	 * Submit the data
	 * @returns
	 */
	submitAnonymous(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdModelFormGroup.getRawValue();
		console.debug('[submitAnonymous] gdsdModelFormValue', gdsdModelFormValue);

		const body = this.getSaveBodyBase(gdsdModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

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
		return this.postAnonymous(
			googleRecaptcha,
			existingDocumentIds,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	/**
	 * Post permit anonymous. This permit must not have any new documents (for example: with an update or replacement)
	 * @returns
	 */
	private postAnonymous(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSaveApis: Observable<string>[] | null,
		body: GdsdTeamLicenceAppAnonymousSubmitRequest
	) {
		console.debug('[postAnonymous]');

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
						// body.previousDocumentIds = [...existingDocumentIds]; // TODO gdsd previousDocumentIds

						return this.gdsdLicensingService.apiGdsdTeamAppAnonymousSubmitPost$Response({
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
						// body.previousDocumentIds = [...existingDocumentIds]; // TODO gdsd previousDocumentIds

						return this.gdsdLicensingService.apiGdsdTeamAppAnonymousSubmitPost$Response({
							body,
						});
					})
				)
				.pipe(take(1));
		}
	}

	// OTHER TRAINING array
	otherTrainingRowUsePersonalTraining(index: number): boolean {
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		const otherTrainingItem = otherTrainingsArray.at(index);
		const ctrl = otherTrainingItem.get('usePersonalDogTrainer') as FormControl;
		return ctrl?.value === BooleanTypeCode.Yes;
	}

	// OTHER TRAINING array
	otherTrainingRowRemove(index: number): void {
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		otherTrainingsArray.removeAt(index);
	}

	// OTHER TRAINING array
	otherTrainingRowAdd(train: OtherTraining | null = null): void {
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		otherTrainingsArray.push(
			new FormGroup(
				{
					trainingId: new FormControl(train?.trainingId ?? null), // placeholder for ID
					trainingDetail: new FormControl(train?.trainingDetail ?? null, [FormControlValidators.required]),
					usePersonalDogTrainer: new FormControl(train?.usePersonalDogTrainer ?? null, [Validators.required]),
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
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		schoolTrainingsArray.removeAt(index);
	}

	// SCHOOL TRAINING array
	schoolTrainingRowAdd(train: TrainingSchoolInfo | null = null): void {
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		schoolTrainingsArray.push(
			new FormGroup(
				{
					trainingId: new FormControl(train?.trainingId ?? null), // placeholder for ID
					trainingBizName: new FormControl(train?.trainingBizName ?? null, [FormControlValidators.required]),
					contactGivenName: new FormControl(train?.contactGivenName ?? null),
					contactSurname: new FormControl(train?.contactSurname ?? null, [FormControlValidators.required]),
					contactPhoneNumber: new FormControl(train?.contactPhoneNumber ?? null, [Validators.required]),
					contactEmailAddress: new FormControl(train?.contactEmailAddress ?? null, [FormControlValidators.email]),
					trainingStartDate: new FormControl(train?.trainingStartDate ?? null, [Validators.required]),
					trainingEndDate: new FormControl(train?.trainingEndDate ?? null, [Validators.required]),
					trainingName: new FormControl(train?.trainingName ?? null, [Validators.required]),
					totalTrainingHours: new FormControl(train?.totalTrainingHours ?? null, [Validators.required]),
					whatLearned: new FormControl(train?.whatLearned ?? null, [Validators.required]),
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
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
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
