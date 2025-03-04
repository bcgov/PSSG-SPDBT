import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeCode, Document, DocumentRelatedInfo, LicenceDocumentTypeCode } from '@app/api/models';
import { SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { NgxMaskPipe } from 'ngx-mask';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';
import { FormControlValidators } from '../validators/form-control.validators';
import { GdsdCommonApplicationHelper } from './gdsd-common-application.helper';

export abstract class DogTrainerApplicationHelper extends GdsdCommonApplicationHelper {
	trainingSchoolInfoFormGroup: FormGroup = this.formBuilder.group({
		accreditedSchoolName: new FormControl('', [Validators.required]),
		schoolDirectorGivenName: new FormControl(''),
		schoolDirectoMiddleName: new FormControl(''),
		schoolDirectorSurname: new FormControl('', [Validators.required]),
		schoolDirectorPhoneNumber: new FormControl('', [Validators.required]),
		schoolDirectorEmailAddress: new FormControl('', [FormControlValidators.email]),
	});

	trainingSchoolAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [FormControlValidators.required]),
	});

	dogTrainerFormGroup: FormGroup = this.formBuilder.group({
		trainerGivenName: new FormControl(''),
		trainerMiddleName: new FormControl(''),
		trainerSurname: new FormControl('', [Validators.required]),
		trainerDateOfBirth: new FormControl('', [Validators.required]),
		trainerPhoneNumber: new FormControl('', [Validators.required]),
		trainerEmailAddress: new FormControl('', [FormControlValidators.email]),
	});

	dogTrainerAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [FormControlValidators.required]),
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
	getSaveBodyBaseNew(dogTrainerModelFormGroup: any): any {
		return this.getSaveBodyBase(dogTrainerModelFormGroup);
	}

	/**
	 * get body the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBaseChange(dogTrainerModelFormGroup: any): any {
		const bodyBase = this.getSaveBodyBase(dogTrainerModelFormGroup);

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
	private getSaveBodyBase(dogTrainerModelFormGroup: any): any {
		const serviceTypeData = dogTrainerModelFormGroup.serviceTypeData;
		const applicationTypeData = dogTrainerModelFormGroup.applicationTypeData;
		const trainingSchoolInfoData = dogTrainerModelFormGroup.trainingSchoolInfoData;
		const trainingSchoolAddressData = dogTrainerModelFormGroup.trainingSchoolAddressData;
		const dogTrainerData = dogTrainerModelFormGroup.dogTrainerData;
		const dogTrainerAddressData = dogTrainerModelFormGroup.dogTrainerAddressData;
		const governmentPhotoIdData = dogTrainerModelFormGroup.governmentPhotoIdData;
		const photographOfYourselfData = dogTrainerModelFormGroup.photographOfYourselfData;
		const originalLicenceData = dogTrainerModelFormGroup.originalLicenceData;
		const documentInfos: Array<Document> = [];

		if (dogTrainerData.trainerDateOfBirth) {
			dogTrainerData.trainerDateOfBirth = this.utilService.dateToDbDate(dogTrainerData.trainerDateOfBirth);
		}

		if (dogTrainerData.trainerPhoneNumber) {
			dogTrainerData.trainerPhoneNumber = this.maskPipe.transform(
				dogTrainerData.trainerPhoneNumber,
				SPD_CONSTANTS.phone.backendMask
			);
		}

		if (trainingSchoolInfoData.schoolDirectorPhoneNumber) {
			trainingSchoolInfoData.schoolDirectorPhoneNumber = this.maskPipe.transform(
				trainingSchoolInfoData.schoolDirectorPhoneNumber,
				SPD_CONSTANTS.phone.backendMask
			);
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
			licenceAppId: dogTrainerModelFormGroup.licenceAppId,
			originalLicenceId: originalLicenceData.originalLicenceId,
			applicationOriginTypeCode: dogTrainerModelFormGroup.applicationOriginTypeCode,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			serviceTypeCode: serviceTypeData.serviceTypeCode,
			licenceTermCode: dogTrainerModelFormGroup.licenceTermCode,

			...trainingSchoolInfoData,
			schoolMailingAddress: trainingSchoolAddressData,
			...dogTrainerData,
			trainerMailingAddress: dogTrainerAddressData,

			documentKeyCodes: [],
			documentInfos,
			documentRelatedInfos,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getDocsToSaveBlobs(dogTrainerModelFormGroup: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const applicationTypeData = dogTrainerModelFormGroup.applicationTypeData;
		const photographOfYourselfData = dogTrainerModelFormGroup.photographOfYourselfData;
		const governmentPhotoIdData = dogTrainerModelFormGroup.governmentPhotoIdData;

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

		return documents;
	}

	getSummaryoriginalLicenceNumber(dogTrainerModelData: any): string {
		return dogTrainerModelData.originalLicenceData.originalLicenceNumber ?? '';
	}
	getSummaryoriginalExpiryDate(dogTrainerModelData: any): string {
		return dogTrainerModelData.originalLicenceData.originalExpiryDate ?? '';
	}
	getSummaryoriginalLicenceTermCode(dogTrainerModelData: any): string {
		return dogTrainerModelData.originalLicenceData.originalLicenceTermCode ?? '';
	}
	getSummaryoriginalLicenceHolderName(dogTrainerModelData: any): string {
		return dogTrainerModelData.originalLicenceData.originalLicenceHolderName ?? '';
	}

	getSummaryaccreditedSchoolName(dogTrainerModelData: any): string {
		return dogTrainerModelData.trainingSchoolInfoData.accreditedSchoolName ?? '';
	}
	getSummaryschoolDirectorName(dogTrainerModelData: any): string {
		return (
			this.utilService.getFullNameWithOneMiddle(
				dogTrainerModelData.trainingSchoolInfoData.schoolDirectorGivenName,
				dogTrainerModelData.trainingSchoolInfoData.schoolDirectorMiddleName,
				dogTrainerModelData.trainingSchoolInfoData.schoolDirectorSurname
			) ?? ''
		);
	}
	getSummaryschoolDirectorEmailAddress(dogTrainerModelData: any): string {
		return dogTrainerModelData.trainingSchoolInfoData.schoolDirectorEmailAddress ?? '';
	}
	getSummaryschoolDirectorPhoneNumber(dogTrainerModelData: any): string {
		return dogTrainerModelData.trainingSchoolInfoData.schoolDirectorPhoneNumber ?? '';
	}

	getSummarytrainerName(dogTrainerModelData: any): string {
		return (
			this.utilService.getFullNameWithOneMiddle(
				dogTrainerModelData.dogTrainerData.trainerGivenName,
				dogTrainerModelData.dogTrainerData.trainerMiddleName,
				dogTrainerModelData.dogTrainerData.trainerSurname
			) ?? ''
		);
	}
	getSummarytrainerdateOfBirth(dogTrainerModelData: any): string {
		return dogTrainerModelData.dogTrainerData.trainerDateOfBirth ?? '';
	}
	getSummarytraineremailAddress(dogTrainerModelData: any): string {
		return dogTrainerModelData.dogTrainerData.trainerEmailAddress ?? '';
	}
	getSummarytrainerphoneNumber(dogTrainerModelData: any): string {
		return dogTrainerModelData.dogTrainerData.trainerPhoneNumber ?? '';
	}

	getSummaryphotoOfYourselfAttachments(dogTrainerModelData: any): File[] | null {
		return dogTrainerModelData.photographOfYourselfData.attachments ?? [];
	}

	getSummarygovernmentIssuedPhotoTypeCode(dogTrainerModelData: any): LicenceDocumentTypeCode | null {
		return dogTrainerModelData.governmentPhotoIdData.photoTypeCode ?? null;
	}
	getSummarygovernmentIssuedPhotoExpiryDate(dogTrainerModelData: any): string {
		return dogTrainerModelData.governmentPhotoIdData.expiryDate ?? '';
	}
	getSummarygovernmentIssuedPhotoAttachments(dogTrainerModelData: any): File[] {
		return dogTrainerModelData.governmentPhotoIdData.attachments ?? [];
	}
}
