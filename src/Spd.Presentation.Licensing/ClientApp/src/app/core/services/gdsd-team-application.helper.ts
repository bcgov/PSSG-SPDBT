import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	AccreditedSchoolQuestions,
	ApplicationTypeCode,
	Document,
	DocumentRelatedInfo,
	LicenceDocumentTypeCode,
	MailingAddress,
	NonAccreditedSchoolQuestions,
	OtherTraining,
	TrainingInfo,
	TrainingSchoolInfo,
} from '@app/api/models';
import { SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { NgxMaskPipe } from 'ngx-mask';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';
import { FormControlValidators } from '../validators/form-control.validators';
import { FormGroupValidators } from '../validators/form-group.validators';
import { GdsdCommonApplicationHelper } from './gdsd-common-application.helper';

export abstract class GdsdTeamApplicationHelper extends GdsdCommonApplicationHelper {
	medicalInformationFormGroup: FormGroup = this.formBuilder.group(
		{
			doctorIsProvidingNeedDogMedicalForm: new FormControl('', [FormControlValidators.required]),
			attachments: new FormControl([]), // LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'attachments',
					(form) => form.get('doctorIsProvidingNeedDogMedicalForm')?.value == BooleanTypeCode.No
				),
			],
		}
	);

	dogCertificationSelectionFormGroup: FormGroup = this.formBuilder.group({
		isDogTrainedByAccreditedSchool: new FormControl('', [FormControlValidators.required]),
	});

	dogGdsdFormGroup: FormGroup = this.formBuilder.group({
		isGuideDog: new FormControl('', [FormControlValidators.required]),
	});

	dogTasksFormGroup: FormGroup = this.formBuilder.group({
		tasks: new FormControl('', [FormControlValidators.required]),
	});

	dogRenewFormGroup: FormGroup = this.formBuilder.group({
		isAssistanceStillRequired: new FormControl('', [FormControlValidators.required]),
	});

	dogInoculationsFormGroup: FormGroup = this.formBuilder.group({
		areInoculationsUpToDate: new FormControl('', [FormControlValidators.required]),
	});

	dogMedicalFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog
	});

	graduationInfoFormGroup: FormGroup = this.formBuilder.group({
		accreditedSchoolId: new FormControl('', [FormControlValidators.required]),
		accreditedSchoolName: new FormControl(''),
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool
	});

	trainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		hasAttendedTrainingSchool: new FormControl('', [FormControlValidators.required]),
	});

	schoolTrainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		schoolTrainings: this.formBuilder.array([]),
		attachments: new FormControl([]), // LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument
	});

	otherTrainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		otherTrainings: this.formBuilder.array([]),
		attachments: new FormControl([]), // LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument
		practiceLogAttachments: new FormControl([]), // LicenceDocumentTypeCode.GdsdPracticeHoursLog
	});

	constructor(
		formBuilder: FormBuilder,
		protected utilService: UtilService,
		protected maskPipe: NgxMaskPipe
	) {
		super(formBuilder);
	}

	/**
	 * get body the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBaseNew(gdsdModelFormValue: any): any {
		return this.getSaveBodyBase(gdsdModelFormValue);
	}

	/**
	 * get body the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBaseChange(gdsdModelFormValue: any): any {
		const bodyBase = this.getSaveBodyBase(gdsdModelFormValue);

		const body = {
			licenceAppId: bodyBase.licenceAppId,
			applicantOrLegalGuardianName: null,
			applicationOriginTypeCode: bodyBase.applicationOriginTypeCode,
			applicationTypeCode: bodyBase.applicationTypeCode,
			serviceTypeCode: bodyBase.serviceTypeCode,
			licenceTermCode: bodyBase.licenceTermCode,
			givenName: bodyBase.givenName,
			middleName: bodyBase.middleName,
			surname: bodyBase.surname,
			dateOfBirth: bodyBase.dateOfBirth,
			phoneNumber: bodyBase.phoneNumber,
			emailAddress: bodyBase.emailAddress,
			originalLicenceId: bodyBase.originalLicenceId,
			dogId: bodyBase.dogId,
			dogInfo: bodyBase.dogInfo,
			isAssistanceStillRequired: bodyBase.isAssistanceStillRequired,
			documentKeyCodes: [],
			dogInfoRenew: bodyBase.dogInfoRenew,
			mailingAddress: bodyBase.mailingAddress,
			documentInfos: bodyBase.documentInfos,
			documentRelatedInfos: bodyBase.documentRelatedInfos,
		};

		console.debug('[getSaveBodyBaseChange]', body);
		return body;
	}

	/**
	 * get body the form group data into the correct structure
	 * @returns
	 */
	private getSaveBodyBase(gdsdModelFormValue: any): any {
		const serviceTypeData = gdsdModelFormValue.serviceTypeData;
		const applicationTypeData = gdsdModelFormValue.applicationTypeData;
		const dogCertificationSelectionData = gdsdModelFormValue.dogCertificationSelectionData;
		const personalInformationData = gdsdModelFormValue.personalInformationData;
		const governmentPhotoIdData = gdsdModelFormValue.governmentPhotoIdData;
		const mailingAddressData = gdsdModelFormValue.mailingAddressData;
		const photographOfYourselfData = gdsdModelFormValue.photographOfYourselfData;
		const dogTasksData = gdsdModelFormValue.dogTasksData;
		let dogInfoData = gdsdModelFormValue.dogInfoData;
		const dogRenewData = gdsdModelFormValue.dogRenewData;
		const originalLicenceData = gdsdModelFormValue.originalLicenceData;
		const documentInfos: Array<Document> = [];

		if (personalInformationData.dateOfBirth) {
			personalInformationData.dateOfBirth = this.utilService.dateToDbDate(personalInformationData.dateOfBirth);
		}

		if (personalInformationData.phoneNumber) {
			personalInformationData.phoneNumber = this.maskPipe.transform(
				personalInformationData.phoneNumber,
				SPD_CONSTANTS.phone.backendMask
			);
		}

		if (!dogInfoData.dogName) {
			dogInfoData = null;
		} else if (dogInfoData.dogDateOfBirth) {
			dogInfoData.dogDateOfBirth = this.utilService.dateToDbDate(dogInfoData.dogDateOfBirth);
		}

		photographOfYourselfData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
			});
		});

		governmentPhotoIdData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				expiryDate: this.utilService.dateToDbDate(governmentPhotoIdData.expiryDate),
				licenceDocumentTypeCode: governmentPhotoIdData.photoTypeCode,
			});
		});

		const isTrainedByAccreditedSchools =
			dogCertificationSelectionData.isDogTrainedByAccreditedSchool === BooleanTypeCode.Yes;

		let accreditedSchoolQuestionsData: AccreditedSchoolQuestions | null = null;
		let nonAccreditedSchoolQuestionsData: NonAccreditedSchoolQuestions | null = null;

		if (isTrainedByAccreditedSchools) {
			const dogGdsdData = gdsdModelFormValue.dogGdsdData;
			const isGuideDog = this.utilService.booleanTypeToBoolean(dogGdsdData.isGuideDog);
			if (isGuideDog != null) {
				accreditedSchoolQuestionsData = {
					isGuideDog,
					serviceDogTasks: isGuideDog ? null : dogTasksData.tasks,
				};

				const graduationInfoData = gdsdModelFormValue.graduationInfoData;

				if (graduationInfoData.schoolContactPhoneNumber) {
					graduationInfoData.schoolContactPhoneNumber = this.maskPipe.transform(
						graduationInfoData.schoolContactPhoneNumber,
						SPD_CONSTANTS.phone.backendMask
					);
				}

				graduationInfoData.attachments?.forEach((doc: any) => {
					documentInfos.push({
						documentUrlId: doc.documentUrlId,
						licenceDocumentTypeCode: LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
					});
				});

				accreditedSchoolQuestionsData.graduationInfo = graduationInfoData;
			}
		} else {
			const dogInoculationsData = gdsdModelFormValue.dogInoculationsData;
			const areInoculationsUpToDate = this.utilService.booleanTypeToBoolean(
				dogInoculationsData.areInoculationsUpToDate
			);
			const medicalInformationData = gdsdModelFormValue.medicalInformationData;
			const doctorIsProvidingNeedDogMedicalForm = this.utilService.booleanTypeToBoolean(
				medicalInformationData.doctorIsProvidingNeedDogMedicalForm
			);
			nonAccreditedSchoolQuestionsData = {
				areInoculationsUpToDate,
				doctorIsProvidingNeedDogMedicalForm,
			};

			const trainingHistoryData = gdsdModelFormValue.trainingHistoryData;
			const hasAttendedTrainingSchool = this.utilService.booleanTypeToBoolean(
				trainingHistoryData.hasAttendedTrainingSchool
			);

			const schoolTrainingHistoryData = gdsdModelFormValue.schoolTrainingHistoryData;
			let schoolTrainingsData = null;

			const otherTrainingHistoryData = gdsdModelFormValue.otherTrainingHistoryData;
			let otherTrainingsData = null;

			if (this.utilService.hasBooleanValue(hasAttendedTrainingSchool)) {
				if (hasAttendedTrainingSchool) {
					schoolTrainingsData = this.getSchoolTrainings(
						hasAttendedTrainingSchool,
						schoolTrainingHistoryData.schoolTrainings
					);
					schoolTrainingHistoryData.attachments?.forEach((doc: any) => {
						documentInfos.push({
							documentUrlId: doc.documentUrlId,
							licenceDocumentTypeCode: LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument,
						});
					});
				} else {
					otherTrainingsData = this.getOtherTrainings(
						hasAttendedTrainingSchool!,
						otherTrainingHistoryData.otherTrainings
					);
					otherTrainingHistoryData.attachments?.forEach((doc: any) => {
						documentInfos.push({
							documentUrlId: doc.documentUrlId,
							licenceDocumentTypeCode: LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument,
						});
					});
					otherTrainingHistoryData.practiceLogAttachments?.forEach((doc: any) => {
						documentInfos.push({
							documentUrlId: doc.documentUrlId,
							licenceDocumentTypeCode: LicenceDocumentTypeCode.GdsdPracticeHoursLog,
						});
					});
				}

				const trainingInfoData: TrainingInfo = {
					hasAttendedTrainingSchool,
					schoolTrainings: schoolTrainingsData,
					otherTrainings: otherTrainingsData,
					specializedTasksWhenPerformed: dogTasksData.tasks,
				};

				nonAccreditedSchoolQuestionsData.trainingInfo = trainingInfoData;
			}

			medicalInformationData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog,
				});
			});

			const dogMedicalData = gdsdModelFormValue.dogMedicalData;
			dogMedicalData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog,
				});
			});
		}

		const documentRelatedInfos: Array<DocumentRelatedInfo> =
			documentInfos
				.filter((doc) => doc.expiryDate)
				.map((doc: Document) => {
					return {
						expiryDate: doc.expiryDate,
						licenceDocumentTypeCode: doc.licenceDocumentTypeCode,
					} as DocumentRelatedInfo;
				}) ?? [];

		delete personalInformationData.hasBcscNameChanged;
		delete mailingAddressData.captchaFormGroup;

		const body = {
			licenceAppId: gdsdModelFormValue.licenceAppId,
			originalLicenceId: originalLicenceData.originalLicenceId,
			isAssistanceStillRequired: this.utilService.booleanTypeToBoolean(dogRenewData.isAssistanceStillRequired),
			dogId: gdsdModelFormValue.dogId,
			applicantOrLegalGuardianName: null,
			applicationOriginTypeCode: gdsdModelFormValue.applicationOriginTypeCode,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			serviceTypeCode: serviceTypeData.serviceTypeCode,
			licenceTermCode: gdsdModelFormValue.licenceTermCode,
			...personalInformationData,
			documentKeyCodes: [],
			accreditedSchoolQuestions: accreditedSchoolQuestionsData,
			nonAccreditedSchoolQuestions: nonAccreditedSchoolQuestionsData,
			dogInfo: dogInfoData,
			isDogTrainedByAccreditedSchool: this.utilService.booleanTypeToBoolean(
				dogCertificationSelectionData.isDogTrainedByAccreditedSchool
			),
			mailingAddress: mailingAddressData,
			documentInfos,
			documentRelatedInfos,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getDocsToSaveBlobs(gdsdModelFormValue: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const applicationTypeData = gdsdModelFormValue.applicationTypeData;
		const photographOfYourselfData = gdsdModelFormValue.photographOfYourselfData;
		const dogCertificationSelectionData = gdsdModelFormValue.dogCertificationSelectionData;
		const governmentPhotoIdData = gdsdModelFormValue.governmentPhotoIdData;
		const medicalInformationData = gdsdModelFormValue.medicalInformationData;
		const dogMedicalData = gdsdModelFormValue.dogMedicalData;
		const graduationInfoData = gdsdModelFormValue.graduationInfoData;
		const trainingHistoryData = gdsdModelFormValue.trainingHistoryData;

		const updatePhoto = photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
		if (applicationTypeData.applicationTypeCode === ApplicationTypeCode.New || !updatePhoto) {
			const docs: Array<Blob> = [];
			photographOfYourselfData.attachments?.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
		} else {
			const docs: Array<Blob> = [];
			photographOfYourselfData.updateAttachments?.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
		}

		if (governmentPhotoIdData.attachments) {
			const docs: Array<Blob> = [];
			governmentPhotoIdData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: governmentPhotoIdData.photoTypeCode, documents: docs });
		}

		const isTrainedByAccreditedSchools =
			this.utilService.booleanTypeToBoolean(dogCertificationSelectionData.isDogTrainedByAccreditedSchool) ?? false;

		if (isTrainedByAccreditedSchools) {
			if (graduationInfoData.attachments) {
				const docs: Array<Blob> = [];
				graduationInfoData.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
					documents: docs,
				});
			}
		} else {
			const hasAttendedTrainingSchool =
				this.utilService.booleanTypeToBoolean(trainingHistoryData.hasAttendedTrainingSchool) ?? false;

			if (medicalInformationData.doctorIsProvidingNeedDogMedicalForm == BooleanTypeCode.No) {
				if (medicalInformationData.attachments) {
					const docs: Array<Blob> = [];
					medicalInformationData.attachments.forEach((doc: SpdFile) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog,
						documents: docs,
					});
				}
			}

			if (dogMedicalData.attachments) {
				const docs: Array<Blob> = [];
				dogMedicalData.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog,
					documents: docs,
				});
			}

			if (hasAttendedTrainingSchool) {
				const docs: Array<Blob> = [];
				const schoolTrainingHistoryData = gdsdModelFormValue.schoolTrainingHistoryData;
				schoolTrainingHistoryData.attachments?.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument,
					documents: docs,
				});
			} else {
				const docs1: Array<Blob> = [];
				const otherTrainingHistoryData = gdsdModelFormValue.otherTrainingHistoryData;
				otherTrainingHistoryData.attachments?.forEach((doc: SpdFile) => {
					docs1.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument,
					documents: docs1,
				});
				const docs2: Array<Blob> = [];
				otherTrainingHistoryData.practiceLogAttachments?.forEach((doc: SpdFile) => {
					docs2.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.GdsdPracticeHoursLog,
					documents: docs2,
				});
			}
		}

		return documents;
	}

	private getSchoolTrainings(
		hasAttendedTrainingSchool: boolean,
		schoolTrainingArrayData: any
	): Array<TrainingSchoolInfo> | null {
		if (!hasAttendedTrainingSchool) return null;

		const trainingArray: Array<TrainingSchoolInfo> = [];
		schoolTrainingArrayData.forEach((train: any) => {
			const mailingAddress: MailingAddress = {
				addressLine1: train.addressLine1,
				addressLine2: train.addressLine2,
				city: train.city,
				country: train.country,
				postalCode: train.postalCode,
				province: train.province,
			};

			const trainingStartDate = this.utilService.dateToDbDate(train.trainingStartDate);
			const trainingEndDate = this.utilService.dateToDbDate(train.trainingEndDate);
			const contactPhoneNumber = train.contactPhoneNumber
				? this.maskPipe.transform(train.contactPhoneNumber, SPD_CONSTANTS.phone.backendMask)
				: null;

			trainingArray.push({
				trainingId: train.trainingId,
				contactEmailAddress: this.utilService.getStringOrNull(train.contactEmailAddress),
				contactGivenName: this.utilService.getStringOrNull(train.contactGivenName),
				contactPhoneNumber,
				contactSurname: train.contactSurname,
				totalTrainingHours: train.totalTrainingHours ?? null,
				trainingBizMailingAddress: mailingAddress,
				trainingBizName: train.trainingBizName,
				trainingEndDate,
				trainingStartDate,
				trainingName: train.trainingName,
				whatLearned: train.whatLearned,
			});
		});
		return trainingArray;
	}

	private getOtherTrainings(
		hasAttendedTrainingSchool: boolean,
		otherTrainingArrayData: any
	): Array<OtherTraining> | null {
		if (hasAttendedTrainingSchool) return null;

		const trainingArray: Array<OtherTraining> = [];
		otherTrainingArrayData.forEach((train: any) => {
			const usePersonalDogTrainer = this.utilService.booleanTypeToBoolean(train.usePersonalDogTrainer);

			if (usePersonalDogTrainer != null) {
				const trainerPhoneNumber =
					usePersonalDogTrainer && train.trainerPhoneNumber
						? this.maskPipe.transform(train.trainerPhoneNumber, SPD_CONSTANTS.phone.backendMask)
						: null;

				trainingArray.push({
					trainingId: train.trainingId,
					usePersonalDogTrainer,
					trainingDetail: train.trainingDetail,
					dogTrainerCredential: usePersonalDogTrainer ? train.dogTrainerCredential : null,
					hoursPracticingSkill: usePersonalDogTrainer ? train.hoursPracticingSkill : null,
					trainerEmailAddress: usePersonalDogTrainer
						? this.utilService.getStringOrNull(train.trainerEmailAddress)
						: null,
					trainerGivenName: usePersonalDogTrainer ? this.utilService.getStringOrNull(train.trainerGivenName) : null,
					trainerPhoneNumber,
					trainerSurname: usePersonalDogTrainer ? train.trainerSurname : null,
					trainingTime: usePersonalDogTrainer ? train.trainingTime : null,
				});
			}
		});
		return trainingArray;
	}

	getSummaryoriginalLicenceNumber(gdsdModelData: any): string {
		return gdsdModelData.originalLicenceData.originalLicenceNumber ?? '';
	}
	getSummaryoriginalExpiryDate(gdsdModelData: any): string {
		return gdsdModelData.originalLicenceData.originalExpiryDate ?? '';
	}
	getSummaryoriginalLicenceTermCode(gdsdModelData: any): string {
		return gdsdModelData.originalLicenceData.originalLicenceTermCode ?? '';
	}
	getSummaryoriginalLicenceHolderName(gdsdModelData: any): string {
		return gdsdModelData.originalLicenceData.originalLicenceHolderName ?? '';
	}

	getSummaryisDogTrainedByAccreditedSchool(gdsdModelData: any): string {
		return gdsdModelData.dogCertificationSelectionData.isDogTrainedByAccreditedSchool ?? '';
	}
	getSummaryisAssistanceStillRequired(gdsdModelData: any): string {
		return gdsdModelData.dogRenewData.isAssistanceStillRequired ?? '';
	}
	getSummarydogType(gdsdModelData: any): string {
		return gdsdModelData.dogGdsdData.isGuideDog === BooleanTypeCode.Yes
			? 'Guide dog (Trained as a guide for a blind person)'
			: 'Service dog (Trained to perform specific tasks to assist a person with a disability)';
	}
	getSummaryapplicantName(gdsdModelData: any): string {
		return (
			this.utilService.getFullNameWithOneMiddle(
				gdsdModelData.personalInformationData.givenName,
				gdsdModelData.personalInformationData.middleName,
				gdsdModelData.personalInformationData.surname
			) ?? ''
		);
	}
	getSummarydateOfBirth(gdsdModelData: any): string {
		return gdsdModelData.personalInformationData.dateOfBirth ?? '';
	}
	getSummaryemailAddress(gdsdModelData: any): string {
		return gdsdModelData.personalInformationData.emailAddress ?? '';
	}
	getSummaryphoneNumber(gdsdModelData: any): string {
		return gdsdModelData.personalInformationData.phoneNumber ?? '';
	}

	getSummaryaccreditedSchoolName(gdsdModelData: any): string {
		return gdsdModelData.graduationInfoData.accreditedSchoolName ?? '';
	}
	getSummaryaccreditedAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.graduationInfoData.attachments ?? [];
	}

	getSummaryschoolTrainings(gdsdModelData: any): Array<any> {
		return gdsdModelData.schoolTrainingHistoryData.schoolTrainings ?? [];
	}
	getSummaryissupportingDocumentTrainingSchoolsAttachments(gdsdModelData: any): boolean {
		if (gdsdModelData.schoolTrainingHistoryData.attachments) {
			return gdsdModelData.schoolTrainingHistoryData.attachments.length > 0;
		}
		return false;
	}
	getSummarysupportingDocumentTrainingSchoolsAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.schoolTrainingHistoryData.attachments ?? [];
	}

	getSummaryotherTrainings(gdsdModelData: any): Array<any> {
		return gdsdModelData.otherTrainingHistoryData.otherTrainings ?? [];
	}
	getSummaryissupportingDocumentOtherTrainingAttachments(gdsdModelData: any): boolean {
		if (gdsdModelData.otherTrainingHistoryData.attachments) {
			return gdsdModelData.otherTrainingHistoryData.attachments.length > 0;
		}
		return false;
	}
	getSummarysupportingDocumentOtherTrainingAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.otherTrainingHistoryData.attachments ?? [];
	}
	getSummaryispracticeLogsOtherTrainingAttachments(gdsdModelData: any): boolean {
		if (gdsdModelData.otherTrainingHistoryData.practiceLogAttachments) {
			return gdsdModelData.otherTrainingHistoryData.practiceLogAttachments.length > 0;
		}
		return false;
	}
	getSummarypracticeLogsOtherTrainingAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.otherTrainingHistoryData.practiceLogAttachments ?? [];
	}

	getSummaryspecializedTaskDetails(gdsdModelData: any): string {
		return gdsdModelData.dogTasksData.tasks ?? '';
	}

	getSummarydogName(gdsdModelData: any): string {
		return gdsdModelData.dogInfoData.dogName ?? '';
	}
	getSummarydogDateOfBirth(gdsdModelData: any): string {
		return gdsdModelData.dogInfoData.dogDateOfBirth ?? '';
	}
	getSummarydogBreed(gdsdModelData: any): string {
		return gdsdModelData.dogInfoData.dogBreed ?? '';
	}
	getSummarycolourAndMarkings(gdsdModelData: any): string {
		return gdsdModelData.dogInfoData.dogColorAndMarkings ?? '';
	}
	getSummarygenderCode(gdsdModelData: any): string {
		return gdsdModelData.dogInfoData.dogGender ?? '';
	}
	getSummarymicrochipNumber(gdsdModelData: any): string {
		return gdsdModelData.dogInfoData.microchipNumber ?? '';
	}

	getSummaryapplicationTypeCode(gdsdModelData: any): ApplicationTypeCode | null {
		return gdsdModelData.applicationTypeData?.applicationTypeCode ?? null;
	}
	getSummaryphotoOfYourselfAttachments(gdsdModelData: any): File[] | null {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(gdsdModelData);
		if (applicationTypeCode === ApplicationTypeCode.New) {
			return gdsdModelData.photographOfYourselfData.attachments ?? null;
		} else {
			const updatePhoto = gdsdModelData.photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
			const updateAttachments = gdsdModelData.photographOfYourselfData.updateAttachments ?? null;
			return updatePhoto ? updateAttachments : null;
		}
	}

	getSummaryareInoculationsUpToDate(gdsdModelData: any): string {
		return gdsdModelData.dogInoculationsData.areInoculationsUpToDate ?? '';
	}
	getSummarydogMedicalAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.dogMedicalData.attachments ?? [];
	}

	getSummaryisDoctorSendingGdsdMedicalForm(gdsdModelData: any): string {
		return gdsdModelData.medicalInformationData.doctorIsProvidingNeedDogMedicalForm ?? '';
	}
	getSummarymedicalInformationAttachments(gdsdModelData: any): File[] | null {
		if (this.getSummaryisDoctorSendingGdsdMedicalForm(gdsdModelData) != BooleanTypeCode.Yes) {
			return null;
		}
		return gdsdModelData.medicalInformationData.attachments ?? [];
	}

	getSummarygovernmentIssuedPhotoTypeCode(gdsdModelData: any): LicenceDocumentTypeCode | null {
		return gdsdModelData.governmentPhotoIdData.photoTypeCode ?? null;
	}
	getSummarygovernmentIssuedPhotoExpiryDate(gdsdModelData: any): string {
		return gdsdModelData.governmentPhotoIdData.expiryDate ?? '';
	}
	getSummarygovernmentIssuedPhotoAttachments(gdsdModelData: any): File[] {
		return gdsdModelData.governmentPhotoIdData.attachments ?? [];
	}
}
