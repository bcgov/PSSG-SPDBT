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
		accreditedSchoolId: new FormControl('', [FormControlValidators.required]),
		accreditedSchoolName: new FormControl(''),
		schoolDirectorGivenName: new FormControl(''),
		schoolDirectorMiddleName: new FormControl(''),
		schoolDirectorSurname: new FormControl('', [FormControlValidators.required]),
		schoolContactPhoneNumber: new FormControl('', [FormControlValidators.required]),
		schoolContactEmailAddress: new FormControl('', [FormControlValidators.email]),
	});

	dogTrainerFormGroup: FormGroup = this.formBuilder.group({
		trainerGivenName: new FormControl(''),
		trainerMiddleName: new FormControl(''),
		trainerSurname: new FormControl('', [FormControlValidators.required]),
		trainerDateOfBirth: new FormControl('', [Validators.required]),
		trainerPhoneNumber: new FormControl('', [FormControlValidators.required]),
		trainerEmailAddress: new FormControl('', [FormControlValidators.email]),
	});

	trainerMailingAddressFormGroup: FormGroup = this.formBuilder.group({
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
	getSaveBodyBaseNewOrRenewal(dogTrainerModelFormGroup: any): any {
		return this.getSaveBodyBase(dogTrainerModelFormGroup);
	}

	/**
	 * get body the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBaseReplacement(dogTrainerModelFormGroup: any): any {
		const body = this.getSaveBodyBase(dogTrainerModelFormGroup);

		const mailingAddressData = this.mailingAddressFormGroup.getRawValue();
		body.trainerMailingAddress = mailingAddressData;

		return body;
	}

	/**
	 * get body the form group data into the correct structure
	 * @returns
	 */
	private getSaveBodyBase(dogTrainerModelFormGroup: any): any {
		const serviceTypeData = dogTrainerModelFormGroup.serviceTypeData;
		const applicationTypeData = dogTrainerModelFormGroup.applicationTypeData;
		const dogTrainerData = dogTrainerModelFormGroup.dogTrainerData;
		const trainerMailingAddressData = dogTrainerModelFormGroup.trainerMailingAddressData;
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

		const trainingSchoolInfoData = dogTrainerModelFormGroup.trainingSchoolInfoData;
		if (trainingSchoolInfoData.schoolContactPhoneNumber) {
			trainingSchoolInfoData.schoolContactPhoneNumber = this.maskPipe.transform(
				trainingSchoolInfoData.schoolContactPhoneNumber,
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
			...dogTrainerData,
			trainerMailingAddress: trainerMailingAddressData,

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
	getSummaryschoolContactEmailAddress(dogTrainerModelData: any): string {
		return dogTrainerModelData.trainingSchoolInfoData.schoolContactEmailAddress ?? '';
	}
	getSummaryschoolContactPhoneNumber(dogTrainerModelData: any): string {
		return dogTrainerModelData.trainingSchoolInfoData.schoolContactPhoneNumber ?? '';
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

	getSummaryapplicationTypeCode(dogTrainerModelData: any): ApplicationTypeCode | null {
		return dogTrainerModelData.applicationTypeData?.applicationTypeCode ?? null;
	}
	getSummaryphotoOfYourselfAttachments(dogTrainerModelData: any): File[] | null {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(dogTrainerModelData);
		if (applicationTypeCode === ApplicationTypeCode.New) {
			return dogTrainerModelData.photographOfYourselfData.attachments ?? null;
		} else {
			const updatePhoto = dogTrainerModelData.photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
			const updateAttachments = dogTrainerModelData.photographOfYourselfData.updateAttachments ?? null;
			return updatePhoto ? updateAttachments : null;
		}
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
