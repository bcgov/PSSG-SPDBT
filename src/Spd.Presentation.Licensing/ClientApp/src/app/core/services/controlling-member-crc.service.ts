import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	Alias,
	ApplicantProfileResponse,
	ApplicationTypeCode,
	ControllingMemberAppInviteVerifyResponse,
	ControllingMemberCrcAppCommandResponse,
	ControllingMemberCrcAppResponse,
	ControllingMemberCrcAppSubmitRequest,
	ControllingMemberCrcAppUpdateRequest,
	ControllingMemberCrcAppUpsertRequest,
	Document,
	GoogleRecaptcha,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	ServiceTypeCode,
} from '@app/api/models';
import { ApplicantProfileService, ControllingMemberCrcAppService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
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
import { ApplicationService } from './application.service';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { AuthenticationService } from './authentication.service';
import { ConfigService } from './config.service';
import { ControllingMemberCrcHelper } from './controlling-member-crc.helper';
import { FileUtilService } from './file-util.service';
import { LicenceDocument, LicenceDocumentsToSave, UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class ControllingMemberCrcService extends ControllingMemberCrcHelper {
	controllingMembersModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	controllingMembersModelFormGroup: FormGroup = this.formBuilder.group({
		inviteId: new FormControl(),
		applicantId: new FormControl(),
		controllingMemberAppId: new FormControl(),
		bizContactId: new FormControl(),
		parentBizLicApplicationId: new FormControl(),

		serviceTypeData: this.serviceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,

		personalInformationData: this.personalInformationFormGroup,
		contactInformationData: this.contactInformationFormGroup,
		aliasesData: this.aliasesFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,

		citizenshipData: this.citizenshipFormGroup,
		fingerprintProofData: this.fingerprintProofFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		bcSecurityLicenceHistoryData: this.bcSecurityLicenceHistoryFormGroup,
		policeBackgroundData: this.policeBackgroundFormGroup,
		mentalHealthConditionsData: this.mentalHealthConditionsFormGroup,
		consentAndDeclarationData: this.consentAndDeclarationFormGroup,
	});

	controllingMembersModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private applicantProfileService: ApplicantProfileService,
		private authenticationService: AuthenticationService,
		private authUserBcscService: AuthUserBcscService,
		private hotToastService: HotToastService,
		private controllingMemberCrcAppService: ControllingMemberCrcAppService,
		private commonApplicationService: ApplicationService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.controllingMembersModelChangedSubscription = this.controllingMembersModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepPersonalInformationComplete();
					const step2Complete = this.isStepCitizenshipAndResidencyComplete();
					const step3Complete = this.isStepBackgroundComplete();
					const isValid = step1Complete && step2Complete && step3Complete;

					console.debug(
						'controllingMembersModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						this.controllingMembersModelFormGroup.getRawValue()
					);

					this.updateModelChangeFlags();
					this.controllingMembersModelValueChanges$.next(isValid);
				}
			});
	}

	isStepPersonalInformationComplete(): boolean {
		// console.debug(
		// 	'isStepPersonalInformationComplete',
		// 	this.personalInformationFormGroup.valid,
		// 	this.contactInformationFormGroup.valid,
		// 	this.aliasesFormGroup.valid,
		// 	this.residentialAddressFormGroup.valid
		// );

		return (
			this.personalInformationFormGroup.valid &&
			this.contactInformationFormGroup.valid &&
			this.aliasesFormGroup.valid &&
			this.residentialAddressFormGroup.valid
		);
	}

	isStepCitizenshipAndResidencyComplete(): boolean {
		// console.debug(
		// 	'isStepCitizenshipAndResidencyComplete',
		// 	this.citizenshipFormGroup.valid,
		// 	this.fingerprintProofFormGroup.valid,
		// 	this.bcDriversLicenceFormGroup.valid
		// );

		return (
			this.citizenshipFormGroup.valid && this.fingerprintProofFormGroup.valid && this.bcDriversLicenceFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBackgroundComplete(): boolean {
		// console.debug(
		// 	'isStepBackgroundComplete',
		// 	this.bcSecurityLicenceHistoryFormGroup.valid,
		// 	this.policeBackgroundFormGroup.valid,
		// 	this.mentalHealthConditionsFormGroup.valid
		// );

		return (
			this.bcSecurityLicenceHistoryFormGroup.valid &&
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid
		);
	}

	/**
	 * Determine if the step data should be saved. If the data has changed and category data exists;
	 * @returns
	 */
	isAutoSave(): boolean {
		if (!this.isSaveAndExit()) {
			return false;
		}

		// file upload will fail in later steps if the 'controllingMemberAppId' isn't populated.
		const controllingMemberAppId = this.controllingMembersModelFormGroup.get('controllingMemberAppId')?.value;

		return this.hasValueChanged || !controllingMemberAppId;
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
		const doc: LicenceDocument = {
			Documents: [documentFile],
			LicenceDocumentTypeCode: documentCode,
		};

		return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsOriginalAppIdFilesPost$Response({
			originalAppId: this.controllingMembersModelFormGroup.get('controllingMemberAppId')?.value,
			body: doc,
		});
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
	 * Create an empty crc or if one already exists, resume it
	 * @returns
	 */
	createOrResumeCrc(
		crcInviteData: ControllingMemberAppInviteVerifyResponse,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		return this.applicantProfileService
			.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
			.pipe(
				switchMap((applicantProfile: ApplicantProfileResponse) => {
					if (applicationTypeCode === ApplicationTypeCode.New && crcInviteData.controllingMemberCrcAppId) {
						return this.loadDraftCrcIntoModel(crcInviteData, applicationTypeCode).pipe(
							tap((_resp: any) => {
								this.initialized = true;

								this.commonApplicationService.setApplicationTitle(
									ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
									applicationTypeCode
								);
							})
						);
					}

					return this.getCrcEmptyAuthenticated(crcInviteData, applicationTypeCode, applicantProfile).pipe(
						tap((_resp: any) => {
							this.initialized = true;

							this.commonApplicationService.setApplicationTitle(
								ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
								applicationTypeCode
							);
						})
					);
				})
			);
	}

	/**
	 * Create an empty anonymous crc
	 * @returns
	 */
	createNewOrUpdateCrcAnonymous(
		crcInviteData: ControllingMemberAppInviteVerifyResponse,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		if (applicationTypeCode === ApplicationTypeCode.New) {
			return this.getCrcEmptyAnonymous(crcInviteData, applicationTypeCode).pipe(
				tap((_resp: any) => {
					this.initialized = true;

					this.commonApplicationService.setApplicationTitle(
						ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
						applicationTypeCode
					);
				})
			);
		}

		return this.applicantProfileService.apiApplicantGet().pipe(
			switchMap((applicantProfile: ApplicantProfileResponse) => {
				return this.getCrcEmptyAnonymous(crcInviteData, applicationTypeCode, applicantProfile).pipe(
					tap((_resp: any) => {
						this.initialized = true;

						this.commonApplicationService.setApplicationTitle(
							ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
							applicationTypeCode
						);
					})
				);
			})
		);
	}

	/**
	 * Partial Save - Save the application data as is.
	 * @returns StrictHttpResponse<ControllingMemberCrcAppCommandResponse>
	 */
	partialSaveStep(isSaveAndExit?: boolean): Observable<any> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAuthenticated(
			controllingMembersModelFormValue
		) as ControllingMemberCrcAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsPost({ body }).pipe(
			tap((resp: ControllingMemberCrcAppCommandResponse) => {
				this.resetModelChangeFlags();

				let msg = 'Your application has been saved';
				if (isSaveAndExit) {
					msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
				}
				this.hotToastService.success(msg);

				if (!controllingMembersModelFormValue.controllingMemberAppId) {
					this.controllingMembersModelFormGroup.patchValue(
						{ controllingMemberAppId: resp.controllingMemberAppId! },
						{ emitEvent: false }
					);
				}
				return resp;
			})
		);
	}

	/**
	 * Submit the crc data authenticated NEW
	 * @returns
	 */
	submitControllingMemberCrcNewAuthenticated(): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAuthenticated(
			controllingMembersModelFormValue
		) as ControllingMemberCrcAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsSubmitPost$Response({ body });
	}

	/**
	 * Submit the crc data anonymous NEW
	 * @returns
	 */
	submitControllingMemberCrcNewAnonymous(): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();

		const body = this.getSaveBodyBaseAnonymous(controllingMembersModelFormValue);

		const documentsToSave = this.getDocsToSaveBlobs(body, controllingMembersModelFormValue);

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
					this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsAnonymousFilesPost({
						body: {
							Documents: newDocumentsOnly,
							LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.postCrcAnonymousDocuments(googleRecaptcha, ApplicationTypeCode.New, documentsToSaveApis, body);
	}

	/**
	 * Submit the crc data authenticated UPDATE
	 * @returns
	 */
	submitControllingMemberCrcUpdateAuthenticated(): Observable<
		StrictHttpResponse<ControllingMemberCrcAppCommandResponse>
	> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();
		const body = this.getSaveBodyBaseAuthenticated(controllingMembersModelFormValue);

		const documentsToSave = this.getDocsToSaveBlobs(body, controllingMembersModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		// Get the keyCode for the existing documents to save.
		// const existingDocumentIds: Array<string> = [];

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
					this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsAuthenticatedFilesPost({
						body: {
							Documents: newDocumentsOnly,
							LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		delete body.serviceTypeCode;
		delete body.applicationTypeCode;
		delete body.hasPreviousName;
		delete body.aliases;
		delete body.hasBcDriversLicence;
		delete body.bcDriversLicenceNumber;
		delete body.isCanadianCitizen;
		delete body.hasBankruptcyHistory;
		delete body.bankruptcyHistoryDetail;
		delete body.documentInfos;

		//*********************** */

		if (documentsToSaveApis.length > 0) {
			return forkJoin(documentsToSaveApis).pipe(
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = [...resps];
					// pass in the list of document ids that were in the original
					// application and are still being used
					body.previousDocumentIds = []; // [...existingDocumentIds];

					return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsUpdatePost$Response({
						body,
					});
				})
			);
		} else {
			// pass in the list of document ids that were in the original
			// application and are still being used
			body.previousDocumentIds = []; //[...existingDocumentIds];

			return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsUpdatePost$Response({
				body,
			});
		}
	}

	/**
	 * Submit the crc data anonymous UPDATE
	 * @returns
	 */
	submitControllingMemberCrcUpdateAnonymous(): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();

		const body = this.getSaveBodyBaseAnonymous(controllingMembersModelFormValue);

		const documentsToSave = this.getDocsToSaveBlobs(body, controllingMembersModelFormValue);

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
					this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsAnonymousFilesPost({
						body: {
							Documents: newDocumentsOnly,
							LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		delete body.serviceTypeCode;
		delete body.applicationTypeCode;
		delete body.hasPreviousName;
		delete body.aliases;
		delete body.hasBcDriversLicence;
		delete body.bcDriversLicenceNumber;
		delete body.isCanadianCitizen;
		delete body.hasBankruptcyHistory;
		delete body.bankruptcyHistoryDetail;
		delete body.documentInfos;

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.postCrcAnonymousDocuments(googleRecaptcha, ApplicationTypeCode.Update, documentsToSaveApis, body);
	}

	private loadDraftCrcIntoModel(
		crcInviteData: ControllingMemberAppInviteVerifyResponse,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		this.reset();

		return this.controllingMemberCrcAppService
			.apiControllingMemberCrcApplicationsOriginalAppIdGet({ originalAppId: crcInviteData.controllingMemberCrcAppId! })
			.pipe(
				switchMap((crcApp: ControllingMemberCrcAppResponse) => {
					return this.applyCrcAppIntoModel(crcApp, crcInviteData, applicationTypeCode);
				})
			);
	}

	private applyCrcAppIntoModel(
		crcAppl: ControllingMemberCrcAppResponse,
		crcInviteData: ControllingMemberAppInviteVerifyResponse,
		applicationTypeCode: ApplicationTypeCode
	): Observable<any> {
		const serviceTypeData = { serviceTypeCode: crcAppl.serviceTypeCode };
		const applicationTypeData = { applicationTypeCode };

		const personalInformationData = {
			givenName: crcAppl.givenName,
			middleName1: crcAppl.middleName1,
			middleName2: crcAppl.middleName2,
			surname: crcAppl.surname,
			genderCode: crcAppl.genderCode,
			dateOfBirth: crcAppl.dateOfBirth,
		};
		const contactInformationData = {
			emailAddress: crcAppl.emailAddress,
			phoneNumber: crcAppl.phoneNumber,
		};

		const bcDriversLicenceData = {
			hasBcDriversLicence: this.utilService.booleanToBooleanType(crcAppl.hasBcDriversLicence),
			bcDriversLicenceNumber: crcAppl.bcDriversLicenceNumber,
		};

		const fingerprintProofDataAttachments: Array<File> = [];
		const citizenshipDataAttachments: Array<File> = [];
		const governmentIssuedAttachments: Array<File> = [];

		const citizenshipData: {
			isCanadianCitizen: BooleanTypeCode | null;
			canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
			notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null;
			expiryDate: string | null;
			attachments: File[];
			governmentIssuedPhotoTypeCode: LicenceDocumentTypeCode | null;
			governmentIssuedExpiryDate: string | null;
			governmentIssuedAttachments: File[];
		} = {
			isCanadianCitizen: null,
			canadianCitizenProofTypeCode: null,
			notCanadianCitizenProofTypeCode: null,
			expiryDate: null,
			attachments: [],
			governmentIssuedPhotoTypeCode: null,
			governmentIssuedExpiryDate: null,
			governmentIssuedAttachments: [],
		};

		citizenshipData.isCanadianCitizen =
			crcAppl.isCanadianCitizen === null ? null : this.utilService.booleanToBooleanType(crcAppl.isCanadianCitizen);

		const policeBackgroundDataAttachments: Array<File> = [];
		const mentalHealthConditionsDataAttachments: Array<File> = [];

		crcAppl.documentInfos?.forEach((doc: Document) => {
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

					citizenshipData.canadianCitizenProofTypeCode = crcAppl.isCanadianCitizen ? doc.licenceDocumentTypeCode : null;
					citizenshipData.notCanadianCitizenProofTypeCode = crcAppl.isCanadianCitizen
						? null
						: doc.licenceDocumentTypeCode;
					citizenshipData.expiryDate = doc.expiryDate ?? null;
					citizenshipData.attachments = citizenshipDataAttachments;

					break;
				}
				case LicenceDocumentTypeCode.ProofOfFingerprint: {
					const aFile = this.fileUtilService.dummyFile(doc);
					fingerprintProofDataAttachments.push(aFile);
					break;
				}
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

		let residentialAddressData = {};
		if (crcAppl.residentialAddress?.addressLine1) {
			residentialAddressData = {
				addressSelected: !!crcAppl.residentialAddress?.addressLine1,
				addressLine1: crcAppl.residentialAddress?.addressLine1,
				addressLine2: crcAppl.residentialAddress?.addressLine2,
				city: crcAppl.residentialAddress?.city,
				country: crcAppl.residentialAddress?.country,
				postalCode: crcAppl.residentialAddress?.postalCode,
				province: crcAppl.residentialAddress?.province,
			};
		}

		const fingerprintProofData = {
			attachments: fingerprintProofDataAttachments,
		};

		const policeBackgroundData = {
			isPoliceOrPeaceOfficer: this.utilService.booleanToBooleanType(crcAppl.isPoliceOrPeaceOfficer),
			policeOfficerRoleCode: crcAppl.policeOfficerRoleCode,
			otherOfficerRole: crcAppl.otherOfficerRole,
			attachments: policeBackgroundDataAttachments,
		};

		const mentalHealthConditionsData = {
			isTreatedForMHC: this.utilService.booleanToBooleanType(crcAppl.isTreatedForMHC),
			attachments: mentalHealthConditionsDataAttachments,
		};

		const bcSecurityLicenceHistoryData = {
			hasCriminalHistory: this.utilService.booleanToBooleanType(crcAppl.hasCriminalHistory),
			criminalHistoryDetail: crcAppl.criminalHistoryDetail,
			hasBankruptcyHistory: this.utilService.booleanToBooleanType(crcAppl.hasBankruptcyHistory),
			bankruptcyHistoryDetail: crcAppl.bankruptcyHistoryDetail,
		};

		this.controllingMembersModelFormGroup.patchValue(
			{
				serviceTypeData,
				applicationTypeData,
				parentBizLicApplicationId: crcInviteData.bizLicAppId,
				bizContactId: crcInviteData.bizContactId,
				inviteId: crcInviteData.inviteId,
				applicantId: crcInviteData.contactId,
				controllingMemberAppId: crcAppl.controllingMemberAppId,

				personalInformationData,
				contactInformationData,
				aliasesData: {
					previousNameFlag: this.utilService.booleanToBooleanType(crcAppl.aliases && crcAppl.aliases.length > 0),
					aliases: [],
				},
				residentialAddressData,
				citizenshipData,
				fingerprintProofData,
				bcDriversLicenceData,
				bcSecurityLicenceHistoryData,
				policeBackgroundData,
				mentalHealthConditionsData,
			},
			{
				emitEvent: false,
			}
		);

		const aliasesArray = this.controllingMembersModelFormGroup.get('aliasesData.aliases') as FormArray;
		crcAppl.aliases?.forEach((alias: Alias) => {
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

		console.debug(
			'[applyCrcAppIntoModel] controllingMembersModelFormGroup',
			this.controllingMembersModelFormGroup.value
		);
		return of(this.controllingMembersModelFormGroup.value);
	}

	private getCrcEmptyAuthenticated(
		crcInviteData: ControllingMemberAppInviteVerifyResponse,
		applicationTypeCode: ApplicationTypeCode,
		applicantProfile: ApplicantProfileResponse
	): Observable<any> {
		this.reset();

		const personalInformationData = this.getApplicantPersonalInformationData(applicantProfile);
		const contactInformationData = this.getApplicanContactInformationData(applicantProfile);
		const residentialAddressData = this.getApplicantResidentialAddressData(applicantProfile);

		const mentalHealthConditionsData = {
			isTreatedForMHC: null,
			attachments: [],
			hasPreviousMhcFormUpload: !!applicantProfile.isTreatedForMHC,
		};

		this.controllingMembersModelFormGroup.patchValue(
			{
				serviceTypeData: {
					serviceTypeCode: ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
				},
				applicationTypeData: { applicationTypeCode },
				parentBizLicApplicationId: crcInviteData.bizLicAppId,
				bizContactId: crcInviteData.bizContactId,
				inviteId: crcInviteData.inviteId,
				applicantId: crcInviteData.contactId,
				personalInformationData,
				contactInformationData,
				residentialAddressData,
				mentalHealthConditionsData,
				aliasesData: {
					previousNameFlag: this.utilService.booleanToBooleanType(
						applicantProfile.aliases && applicantProfile.aliases.length > 0
					),
					aliases: [],
				},
			},
			{
				emitEvent: false,
			}
		);

		const aliasesArray = this.controllingMembersModelFormGroup.get('aliasesData.aliases') as FormArray;
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

		return of(this.controllingMembersModelFormGroup.value);
	}

	private getCrcEmptyAnonymous(
		crcInviteData: ControllingMemberAppInviteVerifyResponse,
		applicationTypeCode: ApplicationTypeCode,
		applicantProfile?: ApplicantProfileResponse
	): Observable<any> {
		this.reset();

		let personalInformationData = {};
		let contactInformationData = {};
		let residentialAddressData = {};

		let aliasesData = {};

		if (applicantProfile) {
			personalInformationData = this.getApplicantPersonalInformationData(applicantProfile);
			contactInformationData = this.getApplicanContactInformationData(applicantProfile);
			residentialAddressData = this.getApplicantResidentialAddressData(applicantProfile);

			aliasesData = {
				previousNameFlag: this.utilService.booleanToBooleanType(
					applicantProfile.aliases && applicantProfile.aliases.length > 0
				),
				aliases: [],
			};
		} else {
			personalInformationData = {
				givenName: crcInviteData?.givenName,
				middleName1: crcInviteData?.middleName1,
				middleName2: crcInviteData?.middleName2,
				surname: crcInviteData?.surname,
				genderCode: null,
				dateOfBirth: null,
			};
			contactInformationData = {
				emailAddress: crcInviteData?.emailAddress,
				phoneNumber: null,
			};
		}

		this.controllingMembersModelFormGroup.patchValue(
			{
				serviceTypeData: {
					serviceTypeCode: ServiceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
				},
				applicationTypeData: { applicationTypeCode },
				parentBizLicApplicationId: crcInviteData.bizLicAppId,
				bizContactId: crcInviteData.bizContactId,
				inviteId: crcInviteData.inviteId,
				applicantId: crcInviteData.contactId,
				personalInformationData,
				contactInformationData,
				residentialAddressData,
				aliasesData,
			},
			{
				emitEvent: false,
			}
		);

		if (applicantProfile) {
			const aliasesArray = this.controllingMembersModelFormGroup.get('aliasesData.aliases') as FormArray;
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
		}

		return of(this.controllingMembersModelFormGroup.value);
	}

	/**
	 * Post crc documents anonymous.
	 * @returns
	 */
	private postCrcAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		applicationTypeCode: ApplicationTypeCode,
		documentsToSaveApis: Observable<string>[],
		body: ControllingMemberCrcAppSubmitRequest | ControllingMemberCrcAppUpdateRequest
	) {
		return this.controllingMemberCrcAppService
			.apiControllingMemberCrcApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					return forkJoin(documentsToSaveApis);
				}),
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = [...resps];

					if (applicationTypeCode === ApplicationTypeCode.New) {
						return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response({
							body,
						});
					}

					return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsAnonymousUpdatePost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/**
	 * Reset the crc data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.controllingMembersModelFormGroup.reset();

		// clear the alias data - this does not seem to get reset during a formgroup reset
		const aliasesArray = this.consentAndDeclarationFormGroup.get('aliasesData.aliases') as FormArray;
		while (aliasesArray?.length) {
			aliasesArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.controllingMembersModelFormGroup.value);
	}
}
