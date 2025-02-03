import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Document, DocumentRelatedInfo, LicenceDocumentTypeCode } from '@app/api/models';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';
import { FormControlValidators } from '../validators/form-control.validators';
import { CommonApplicationHelper } from './common-application.helper';

export abstract class GdsdApplicationHelper extends CommonApplicationHelper {
	gdsdPersonalInformationFormGroup: FormGroup = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		dateOfBirth: new FormControl('', [Validators.required]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
		contactEmailAddress: new FormControl(''),
	});

	governmentPhotoIdFormGroup: FormGroup = this.formBuilder.group({
		photoTypeCode: new FormControl('', [Validators.required]),
		expiryDate: new FormControl(''),
		attachments: new FormControl([], [Validators.required]),
	});

	medicalInformationFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]),
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
		attachments: new FormControl([], [Validators.required]),
	});

	accreditedGraduationFormGroup: FormGroup = this.formBuilder.group({
		accreditedSchoolName: new FormControl('', [Validators.required]),
		schoolContactGivenName: new FormControl(''),
		schoolContactSurname: new FormControl('', [FormControlValidators.required]),
		schoolContactPhoneNumber: new FormControl('', [Validators.required]),
		schoolContactEmailAddress: new FormControl('', [Validators.required]),
		attachments: new FormControl([], [Validators.required]),
	});

	trainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		hasAttendedTrainingSchool: new FormControl('', [Validators.required]),
	});

	schoolTrainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		schoolTrainings: this.formBuilder.array([]),
	});

	otherTrainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		otherTrainings: this.formBuilder.array([]),
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
		protected formatDatePipe: FormatDatePipe,
		protected utilService: UtilService,
		protected fileUtilService: FileUtilService
	) {
		super(formBuilder);
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBase(gdsdModelFormValue: any): any {
		const mailingAddressData = gdsdModelFormValue.mailingAddressData;
		const photographOfYourselfData = gdsdModelFormValue.photographOfYourselfData;
		const personalInformationData = gdsdModelFormValue.personalInformationData;
		const dogCertificationSelectionData = gdsdModelFormValue.dogCertificationSelectionData;
		const dogInformationData = gdsdModelFormValue.dogInformationData;
		const accreditedGraduationData = gdsdModelFormValue.accreditedGraduationData;
		const governmentPhotoIdData = { ...gdsdModelFormValue.governmentPhotoIdData };
		const medicalInformationData = { ...gdsdModelFormValue.medicalInformationData };
		const dogMedicalData = { ...gdsdModelFormValue.dogMedicalData };

		const documentInfos: Array<Document> = [];

		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		dogInformationData.dogDateOfBirth = this.formatDatePipe.transform(
			dogInformationData.dogDateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		const dogInfoNewAccreditedSchoolData = {
			dogBreed: dogInformationData.dogBreed,
			dogColorAndMarkings: dogInformationData.dogColorAndMarkings,
			dogDateOfBirth: dogInformationData.dogDateOfBirth,
			dogGender: dogInformationData.dogGender,
			dogName: dogInformationData.dogName,
			isGuideDog: this.utilService.booleanTypeToBoolean(dogCertificationSelectionData.isGuideDog),
			microchipNumber: dogInformationData.microchipNumber,
		};

		const graduationInfoData = {
			accreditedSchoolName: accreditedGraduationData.accreditedSchoolName,
			schoolContactEmailAddress: accreditedGraduationData.schoolContactEmailAddress,
			schoolContactGivenName: accreditedGraduationData.schoolContactGivenName,
			schoolContactPhoneNumber: accreditedGraduationData.schoolContactPhoneNumber,
			schoolContactSurname: accreditedGraduationData.schoolContactSurname,
		};

		photographOfYourselfData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
			});
		});

		governmentPhotoIdData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				expiryDate: governmentPhotoIdData.expiryDate
					? this.formatDatePipe.transform(governmentPhotoIdData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
					: null,
				documentIdNumber: null, // TODO GDSD document ID?  governmentPhotoIdData.governmentIssuedDocumentIdNumber,
				licenceDocumentTypeCode: governmentPhotoIdData.photoTypeCode,
			});
		});

		const isTrainedByAccreditedSchools =
			dogCertificationSelectionData.isDogTrainedByAccreditedSchool === BooleanTypeCode.Yes;

		if (isTrainedByAccreditedSchools) {
			accreditedGraduationData.attachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
				});
			});
		} else {
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
				.filter((doc) => doc.expiryDate || doc.documentIdNumber)
				.map((doc: Document) => {
					return {
						expiryDate: doc.expiryDate,
						documentIdNumber: doc.documentIdNumber,
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
			dogInfoNewWithoutAccreditedSchool: null,
			dogInfoRenew: null,
			isDogTrainedByAccreditedSchool: this.utilService.booleanTypeToBoolean(
				dogCertificationSelectionData.isDogTrainedByAccreditedSchool
			),
			graduationInfo: graduationInfoData,
			mailingAddress: mailingAddressData,
			trainingInfo: null,
			documentInfos,
			documentRelatedInfos,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
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
}
