import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	Document,
	DocumentRelatedInfo,
	LicenceDocumentTypeCode,
	MailingAddress,
	OtherTraining,
	TrainingSchoolInfo,
} from '@app/api/models';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { FormControlValidators } from '../validators/form-control.validators';
import { CommonApplicationHelper } from './common-application.helper';

export abstract class GdsdApplicationHelper extends CommonApplicationHelper {
	gdsdPersonalInformationFormGroup: FormGroup = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		dateOfBirth: new FormControl('', [Validators.required]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
		contactEmailAddress: new FormControl('', [FormControlValidators.email]),
	});

	governmentPhotoIdFormGroup: FormGroup = this.formBuilder.group({
		photoTypeCode: new FormControl('', [Validators.required]),
		expiryDate: new FormControl(''),
		attachments: new FormControl([], [Validators.required]),
	});

	medicalInformationFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog
	});

	dogCertificationSelectionFormGroup: FormGroup = this.formBuilder.group({
		isDogTrainedByAccreditedSchool: new FormControl('', [Validators.required]),
		isGuideDog: new FormControl('', [Validators.required]),
	});

	dogTasksFormGroup: FormGroup = this.formBuilder.group({
		tasks: new FormControl('', [Validators.required]),
	});

	dogInformationFormGroup: FormGroup = this.formBuilder.group({
		dogName: new FormControl('', [Validators.required]),
		dogDateOfBirth: new FormControl('', [Validators.required]),
		dogBreed: new FormControl('', [Validators.required]),
		dogColorAndMarkings: new FormControl('', [Validators.required]),
		dogGender: new FormControl('', [Validators.required]),
		microchipNumber: new FormControl(''),
	});

	dogMedicalFormGroup: FormGroup = this.formBuilder.group({
		areInoculationsUpToDate: new FormControl('', [Validators.required]),
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog
	});

	accreditedGraduationFormGroup: FormGroup = this.formBuilder.group({
		accreditedSchoolName: new FormControl('', [Validators.required]),
		schoolContactGivenName: new FormControl(''),
		schoolContactSurname: new FormControl('', [Validators.required]),
		schoolContactPhoneNumber: new FormControl('', [Validators.required]),
		schoolContactEmailAddress: new FormControl('', [FormControlValidators.email]),
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool
	});

	trainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		hasAttendedTrainingSchool: new FormControl('', [Validators.required]),
	});

	schoolTrainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		schoolTrainings: this.formBuilder.array([]),
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument
	});

	otherTrainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		otherTrainings: this.formBuilder.array([]),
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.DogTrainingCurriculumCertificateSupportingDocument
		practiceLogAttachments: new FormControl([]), // LicenceDocumentTypeCode.GdsdPracticeHoursLog
	});

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		applicantOrLegalGuardianName: new FormControl('', [Validators.required]),
		agreeToCompleteAndAccurate: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
		captchaFormGroup: new FormGroup(
			{
				displayCaptcha: new FormControl(false),
				token: new FormControl(''),
			},
			{
				validators: [
					FormGroupValidators.conditionalRequiredValidator(
						'token',
						(form) => form.get('displayCaptcha')?.value == true
					),
				],
			}
		),
	});

	constructor(
		formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected utilService: UtilService,
		protected fileUtilService: FileUtilService
	) {
		super(formBuilder);
	}

	/**
	 * getSummarythe form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBase(gdsdModelFormValue: any): any {
		const mailingAddressData = gdsdModelFormValue.mailingAddressData;
		const photographOfYourselfData = gdsdModelFormValue.photographOfYourselfData;
		const personalInformationData = gdsdModelFormValue.personalInformationData;
		const dogCertificationSelectionData = gdsdModelFormValue.dogCertificationSelectionData;
		const dogTasksData = gdsdModelFormValue.dogTasksData;
		const dogInformationData = gdsdModelFormValue.dogInformationData;
		const accreditedGraduationData = gdsdModelFormValue.accreditedGraduationData;
		const governmentPhotoIdData = gdsdModelFormValue.governmentPhotoIdData;
		const medicalInformationData = gdsdModelFormValue.medicalInformationData;
		const dogMedicalData = gdsdModelFormValue.dogMedicalData;
		const trainingHistoryData = gdsdModelFormValue.trainingHistoryData;

		const documentInfos: Array<Document> = [];

		personalInformationData.dateOfBirth = this.utilService.dateToDbDate(personalInformationData.dateOfBirth);
		personalInformationData.dogDateOfBirth = this.utilService.dateToDbDate(personalInformationData.dogDateOfBirth);

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

		let dogInfoNewAccreditedSchoolData: any = null;
		let dogInfoNewWithoutAccreditedSchoolData: any = null;
		let trainingInfoData: any = null;
		let graduationInfoData: any = null;
		const dogInfoRenewData: any = null;

		if (isTrainedByAccreditedSchools) {
			graduationInfoData = {
				accreditedSchoolName: accreditedGraduationData.accreditedSchoolName,
				schoolContactEmailAddress: accreditedGraduationData.schoolContactEmailAddress,
				schoolContactGivenName: accreditedGraduationData.schoolContactGivenName,
				schoolContactPhoneNumber: accreditedGraduationData.schoolContactPhoneNumber,
				schoolContactSurname: accreditedGraduationData.schoolContactSurname,
			};

			const isGuideDog = this.utilService.booleanTypeToBoolean(dogCertificationSelectionData.isGuideDog);
			dogInfoNewAccreditedSchoolData = {
				dogBreed: dogInformationData.dogBreed,
				dogColorAndMarkings: dogInformationData.dogColorAndMarkings,
				dogDateOfBirth: dogInformationData.dogDateOfBirth,
				dogGender: dogInformationData.dogGender,
				dogName: dogInformationData.dogName,
				isGuideDog,
				microchipNumber: dogInformationData.microchipNumber,
				serviceDogTasks: isGuideDog ? null : dogTasksData.tasks,
			};

			accreditedGraduationData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
				});
			});
		} else {
			dogInfoNewWithoutAccreditedSchoolData = {
				areInoculationsUpToDate: this.utilService.booleanTypeToBoolean(dogMedicalData.areInoculationsUpToDate),
				dogBreed: dogInformationData.dogBreed,
				dogColorAndMarkings: dogInformationData.dogColorAndMarkings,
				dogDateOfBirth: dogInformationData.dogDateOfBirth,
				dogGender: dogInformationData.dogGender,
				dogName: dogInformationData.dogName,
				isGuideDog: this.utilService.booleanTypeToBoolean(dogCertificationSelectionData.isGuideDog),
				microchipNumber: dogInformationData.microchipNumber,
			};

			const hasAttendedTrainingSchool =
				this.utilService.booleanTypeToBoolean(trainingHistoryData.hasAttendedTrainingSchool) ?? false;

			const schoolTrainingHistoryData = gdsdModelFormValue.schoolTrainingHistoryData;
			let schoolTrainingsData = null;

			const otherTrainingHistoryData = gdsdModelFormValue.otherTrainingHistoryData;
			let otherTrainingsData = null;

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
				otherTrainingsData = this.getOtherTrainings(hasAttendedTrainingSchool, otherTrainingHistoryData.otherTrainings);
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

			trainingInfoData = {
				hasAttendedTrainingSchool,
				schoolTrainings: schoolTrainingsData,
				otherTrainings: otherTrainingsData,
				specializedTasksWhenPerformed: dogTasksData.tasks,
			};

			medicalInformationData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.MedicalFormConfirmingNeedDog,
				});
			});
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

		const body = {
			applicantOrLegalGuardianName: null,
			applicationOriginTypeCode: gdsdModelFormValue.applicationOriginTypeCode,
			applicationTypeCode: gdsdModelFormValue.applicationTypeCode,
			bizTypeCode: gdsdModelFormValue.bizTypeCode,
			serviceTypeCode: gdsdModelFormValue.serviceTypeCode,
			licenceTermCode: gdsdModelFormValue.licenceTermCode,
			...personalInformationData,
			documentKeyCodes: [],
			dogInfoNewAccreditedSchool: dogInfoNewAccreditedSchoolData,
			dogInfoNewWithoutAccreditedSchool: dogInfoNewWithoutAccreditedSchoolData,
			dogInfoRenew: dogInfoRenewData,
			isDogTrainedByAccreditedSchool: this.utilService.booleanTypeToBoolean(
				dogCertificationSelectionData.isDogTrainedByAccreditedSchool
			),
			graduationInfo: graduationInfoData,
			mailingAddress: mailingAddressData,
			trainingInfo: trainingInfoData,
			documentInfos,
			documentRelatedInfos,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
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

			const trainingStartDate = this.utilService.dateToDbDate(train.trainingDateFrom);
			const trainingEndDate = this.utilService.dateToDbDate(train.trainingDateTo);

			trainingArray.push({
				contactEmailAddress: train.contactEmailAddress,
				contactGivenName: train.contactGivenName,
				contactPhoneNumber: train.contactPhoneNumber,
				contactSurname: train.contactSurname,
				totalTrainingHours: train.hoursOfTraining,
				trainingBizMailingAddress: mailingAddress,
				trainingBizName: train.trainingBizName,
				trainingEndDate,
				trainingStartDate,
				trainingName: train.nameOfTrainingProgram,
				whatLearned: train.learnedDesc,
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
			const usePersonalDogTrainer = this.utilService.booleanTypeToBoolean(train.usePersonalDogTrainer) ?? false;
			trainingArray.push({
				dogTrainerCredential: train.dogTrainerCredential,
				hoursPracticingSkill: train.hoursPracticingSkill,
				trainerEmailAddress: train.trainerEmailAddress,
				trainerGivenName: train.trainerGivenName,
				trainerPhoneNumber: train.trainerPhoneNumber,
				trainerSurname: train.trainerSurname,
				trainingDetail: train.trainingDetail,
				trainingTime: train.trainingTime,
				usePersonalDogTrainer,
			});
		});
		return trainingArray;
	}

	getDocsToSaveBlobs(gdsdModelFormValue: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const photographOfYourselfData = gdsdModelFormValue.photographOfYourselfData;
		const dogCertificationSelectionData = { ...gdsdModelFormValue.dogCertificationSelectionData };
		const governmentPhotoIdData = { ...gdsdModelFormValue.governmentPhotoIdData };
		const medicalInformationData = { ...gdsdModelFormValue.medicalInformationData };
		const dogMedicalData = { ...gdsdModelFormValue.dogMedicalData };
		const accreditedGraduationData = { ...gdsdModelFormValue.accreditedGraduationData };

		if (photographOfYourselfData.attachments) {
			const docs: Array<Blob> = [];
			photographOfYourselfData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
		}

		if (governmentPhotoIdData.attachments) {
			const docs: Array<Blob> = [];
			governmentPhotoIdData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: governmentPhotoIdData.governmentIssuedPhotoTypeCode, documents: docs });
		}

		const isTrainedByAccreditedSchools =
			dogCertificationSelectionData.isDogTrainedByAccreditedSchool === BooleanTypeCode.Yes;

		if (isTrainedByAccreditedSchools) {
			if (accreditedGraduationData.attachments) {
				const docs: Array<Blob> = [];
				accreditedGraduationData.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
					documents: docs,
				});
			}
		} else {
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
		}

		return documents;
	}

	getSummaryisDogTrainedByAccreditedSchool(gdsdModelData: any): string {
		return gdsdModelData.dogCertificationSelectionData.isDogTrainedByAccreditedSchool ?? '';
	}
	getSummaryisGuideDog(gdsdModelData: any): string {
		return gdsdModelData.dogCertificationSelectionData.isGuideDog === BooleanTypeCode.Yes ? 'Guide Dog' : 'Service Dog';
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
		return gdsdModelData.personalInformationData.contactEmailAddress ?? '';
	}
	getSummaryphoneNumber(gdsdModelData: any): string {
		return gdsdModelData.personalInformationData.contactPhoneNumber ?? '';
	}

	getSummaryaccreditedSchoolName(gdsdModelData: any): string {
		return gdsdModelData.accreditedGraduationData.accreditedSchoolName ?? '';
	}
	getSummaryaccreditedContactName(gdsdModelData: any): string {
		return (
			this.utilService.getFullName(
				gdsdModelData.accreditedGraduationData.schoolContactGivenName,
				gdsdModelData.accreditedGraduationData.schoolContactSurname
			) ?? ''
		);
	}
	getSummaryaccreditedPhoneNumber(gdsdModelData: any): string {
		return gdsdModelData.accreditedGraduationData.schoolContactPhoneNumber ?? '';
	}
	getSummaryaccreditedEmailAddress(gdsdModelData: any): string {
		return gdsdModelData.accreditedGraduationData.schoolContactEmailAddress ?? '';
	}
	getSummaryaccreditedAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.accreditedGraduationData.attachments ?? [];
	}

	getSummaryschoolTrainings(gdsdModelData: any): Array<any> {
		return gdsdModelData.schoolTrainingHistoryData.schoolTrainings ?? [];
	}
	getSummarysupportingDocumenTrainingSchoolsAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.schoolTrainingHistoryData.attachments ?? [];
	}

	getSummaryotherTrainings(gdsdModelData: any): Array<any> {
		return gdsdModelData.otherTrainingHistoryData.otherTrainings ?? [];
	}
	getSummarysupportingDocumentOtherTrainingAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.otherTrainingHistoryData.attachments ?? [];
	}
	getSummaryisPracticeLogsOtherTrainingAttachments(gdsdModelData: any): boolean {
		const attachments = gdsdModelData.otherTrainingHistoryData.practiceLogAttachments ?? [];
		return attachments.length > 0;
	}
	getSummarypracticeLogsOtherTrainingAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.otherTrainingHistoryData.practiceLogAttachments ?? [];
	}

	getSummaryspecializedTaskDetails(gdsdModelData: any): string {
		return gdsdModelData.dogTasksData.tasks ?? '';
	}

	getSummarydogName(gdsdModelData: any): string {
		return gdsdModelData.dogInformationData.dogName ?? '';
	}
	getSummarydogDateOfBirth(gdsdModelData: any): string {
		return gdsdModelData.dogInformationData.dogDateOfBirth ?? '';
	}
	getSummarydogBreed(gdsdModelData: any): string {
		return gdsdModelData.dogInformationData.dogBreed ?? '';
	}
	getSummarycolourAndMarkings(gdsdModelData: any): string {
		return gdsdModelData.dogInformationData.dogColorAndMarkings ?? '';
	}
	getSummarygenderCode(gdsdModelData: any): string {
		return gdsdModelData.dogInformationData.dogGender ?? '';
	}
	getSummarymicrochipNumber(gdsdModelData: any): string {
		return gdsdModelData.dogInformationData.microchipNumber ?? '';
	}

	getSummaryphotoOfYourselfAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.photographOfYourselfData.attachments ?? [];
	}

	getSummaryareInoculationsUpToDate(gdsdModelData: any): string {
		return gdsdModelData.dogMedicalData.areInoculationsUpToDate ?? '';
	}
	getSummarydogMedicalAttachments(gdsdModelData: any): File[] | null {
		return gdsdModelData.dogMedicalData.attachments ?? [];
	}

	getSummarymedicalInformationAttachments(gdsdModelData: any): File[] | null {
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
