import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeCode, Document, DocumentRelatedInfo, LicenceDocumentTypeCode } from '@app/api/models';
import { SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { NgxMaskPipe } from 'ngx-mask';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';
import { FormControlValidators } from '../validators/form-control.validators';
import { GdsdCommonApplicationHelper } from './gdsd-common-application.helper';

export abstract class RetiredDogApplicationHelper extends GdsdCommonApplicationHelper {
	dogGdsdCertificateFormGroup: FormGroup = this.formBuilder.group({
		currentGDSDCertificateNumber: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.GdsdCertificate
	});

	dogRetiredForm: FormGroup = this.formBuilder.group({
		dogRetiredDate: new FormControl('', [Validators.required]),
	});

	dogLivingForm: FormGroup = this.formBuilder.group({
		confirmDogLiveWithYouAfterRetire: new FormControl('', [FormControlValidators.required]),
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
	getSaveBodyBaseChange(retiredDogModelFormGroup: any): any {
		const bodyBase = this.getSaveBodyBase(retiredDogModelFormGroup);

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
	getSaveBodyBase(retiredDogModelFormValue: any): any {
		const serviceTypeData = retiredDogModelFormValue.serviceTypeData;
		const applicationTypeData = retiredDogModelFormValue.applicationTypeData;
		const personalInformationData = retiredDogModelFormValue.personalInformationData;
		const dogGdsdCertificateData = retiredDogModelFormValue.dogGdsdCertificateData;
		const photographOfYourselfData = retiredDogModelFormValue.photographOfYourselfData;
		const governmentPhotoIdData = retiredDogModelFormValue.governmentPhotoIdData;
		const mailingAddressData = retiredDogModelFormValue.mailingAddressData;
		const dogInfoData = retiredDogModelFormValue.dogInfoData;
		const dogRetiredData = retiredDogModelFormValue.dogRetiredData;
		const dogLivingData = retiredDogModelFormValue.dogLivingData;
		const originalLicenceData = retiredDogModelFormValue.originalLicenceData;
		const documentInfos: Array<Document> = [];

		if (dogInfoData.dogDateOfBirth) {
			dogInfoData.dogDateOfBirth = this.utilService.dateToDbDate(dogInfoData.dogDateOfBirth);
		}

		if (personalInformationData.dateOfBirth) {
			personalInformationData.dateOfBirth = this.utilService.dateToDbDate(personalInformationData.dateOfBirth);
		}

		if (dogRetiredData.dogRetiredDate) {
			dogRetiredData.dogRetiredDate = this.utilService.dateToDbDate(dogRetiredData.dogRetiredDate);
		}

		if (personalInformationData.phoneNumber) {
			personalInformationData.phoneNumber = this.maskPipe.transform(
				personalInformationData.phoneNumber,
				SPD_CONSTANTS.phone.backendMask
			);
		}

		dogGdsdCertificateData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.GdsdCertificate,
			});
		});

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

		delete personalInformationData.hasBcscNameChanged;
		delete mailingAddressData.captchaFormGroup;

		const body = {
			licenceAppId: retiredDogModelFormValue.licenceAppId,
			originalLicenceId: originalLicenceData.originalLicenceId,
			applicantId: originalLicenceData.originalLicenceHolderId,
			dogId: retiredDogModelFormValue.dogId,
			applicationOriginTypeCode: retiredDogModelFormValue.applicationOriginTypeCode,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			serviceTypeCode: serviceTypeData.serviceTypeCode,
			licenceTermCode: retiredDogModelFormValue.licenceTermCode,

			...personalInformationData,
			mailingAddress: mailingAddressData,
			dogInfo: dogInfoData,
			dogRetiredDate: dogRetiredData.dogRetiredDate,
			confirmDogLiveWithYouAfterRetire: this.utilService.booleanTypeToBoolean(
				dogLivingData.confirmDogLiveWithYouAfterRetire
			),
			currentGDSDCertificateNumber: dogGdsdCertificateData.currentGDSDCertificateNumber,
			documentKeyCodes: [],
			documentInfos,
			documentRelatedInfos,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getDocsToSaveBlobs(retiredDogModelFormValue: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const applicationTypeData = retiredDogModelFormValue.applicationTypeData;
		const photographOfYourselfData = retiredDogModelFormValue.photographOfYourselfData;
		const governmentPhotoIdData = retiredDogModelFormValue.governmentPhotoIdData;
		const dogGdsdCertificateData = retiredDogModelFormValue.dogGdsdCertificateData;

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

		if (dogGdsdCertificateData.attachments) {
			const docs: Array<Blob> = [];
			dogGdsdCertificateData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.GdsdCertificate,
				documents: docs,
			});
		}

		return documents;
	}

	getSummaryoriginalLicenceNumber(retiredDogModelData: any): string {
		return retiredDogModelData.originalLicenceData.originalLicenceNumber ?? '';
	}
	getSummaryoriginalExpiryDate(retiredDogModelData: any): string {
		return retiredDogModelData.originalLicenceData.originalExpiryDate ?? '';
	}
	getSummaryoriginalLicenceTermCode(retiredDogModelData: any): string {
		return retiredDogModelData.originalLicenceData.originalLicenceTermCode ?? '';
	}
	getSummaryoriginalLicenceHolderName(retiredDogModelData: any): string {
		return retiredDogModelData.originalLicenceData.originalLicenceHolderName ?? '';
	}

	getSummaryapplicantName(retiredDogModelData: any): string {
		return (
			this.utilService.getFullNameWithOneMiddle(
				retiredDogModelData.personalInformationData.givenName,
				retiredDogModelData.personalInformationData.middleName,
				retiredDogModelData.personalInformationData.surname
			) ?? ''
		);
	}
	getSummarydateOfBirth(retiredDogModelData: any): string {
		return retiredDogModelData.personalInformationData.dateOfBirth ?? '';
	}
	getSummaryemailAddress(retiredDogModelData: any): string {
		return retiredDogModelData.personalInformationData.emailAddress ?? '';
	}
	getSummaryphoneNumber(retiredDogModelData: any): string {
		return retiredDogModelData.personalInformationData.phoneNumber ?? '';
	}

	getSummarydogName(retiredDogModelData: any): string {
		return retiredDogModelData.dogInfoData.dogName ?? '';
	}
	getSummarydogDateOfBirth(retiredDogModelData: any): string {
		return retiredDogModelData.dogInfoData.dogDateOfBirth ?? '';
	}
	getSummarydogBreed(retiredDogModelData: any): string {
		return retiredDogModelData.dogInfoData.dogBreed ?? '';
	}
	getSummarycolourAndMarkings(retiredDogModelData: any): string {
		return retiredDogModelData.dogInfoData.dogColorAndMarkings ?? '';
	}
	getSummarygenderCode(retiredDogModelData: any): string {
		return retiredDogModelData.dogInfoData.dogGender ?? '';
	}
	getSummarymicrochipNumber(retiredDogModelData: any): string {
		return retiredDogModelData.dogInfoData.microchipNumber ?? '';
	}

	getSummarydogRetiredDate(retiredDogModelData: any): string {
		return retiredDogModelData.dogRetiredData.dogRetiredDate ?? '';
	}
	getSummaryliveWithDog(retiredDogModelData: any): string {
		return retiredDogModelData.dogLivingData.confirmDogLiveWithYouAfterRetire ?? '';
	}

	getSummarycurrentGDSDCertificateNumber(retiredDogModelData: any): string {
		return retiredDogModelData.dogGdsdCertificateData.currentGDSDCertificateNumber ?? '';
	}
	getSummarygdsdCertificateAttachments(retiredDogModelData: any): File[] | null {
		return retiredDogModelData.dogGdsdCertificateData.attachments ?? [];
	}

	getSummaryapplicationTypeCode(retiredDogModelData: any): ApplicationTypeCode | null {
		return retiredDogModelData.applicationTypeData?.applicationTypeCode ?? null;
	}
	getSummaryphotoOfYourselfAttachments(retiredDogModelData: any): File[] | null {
		const applicationTypeCode = this.getSummaryapplicationTypeCode(retiredDogModelData);
		if (applicationTypeCode === ApplicationTypeCode.New) {
			return retiredDogModelData.photographOfYourselfData.attachments ?? null;
		} else {
			const updatePhoto = retiredDogModelData.photographOfYourselfData.updatePhoto === BooleanTypeCode.Yes;
			const updateAttachments = retiredDogModelData.photographOfYourselfData.updateAttachments ?? null;
			return updatePhoto ? updateAttachments : null;
		}
	}

	getSummarygovernmentIssuedPhotoTypeCode(retiredDogModelData: any): LicenceDocumentTypeCode | null {
		return retiredDogModelData.governmentPhotoIdData.photoTypeCode ?? null;
	}
	getSummarygovernmentIssuedPhotoExpiryDate(retiredDogModelData: any): string {
		return retiredDogModelData.governmentPhotoIdData.expiryDate ?? '';
	}
	getSummarygovernmentIssuedPhotoAttachments(retiredDogModelData: any): File[] {
		return retiredDogModelData.governmentPhotoIdData.attachments ?? [];
	}
}
