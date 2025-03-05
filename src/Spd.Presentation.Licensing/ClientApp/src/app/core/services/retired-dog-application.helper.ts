import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeCode, Document, DocumentRelatedInfo, LicenceDocumentTypeCode } from '@app/api/models';
import { SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { NgxMaskPipe } from 'ngx-mask';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';
import { GdsdCommonApplicationHelper } from './gdsd-common-application.helper';

export abstract class RetiredDogApplicationHelper extends GdsdCommonApplicationHelper {
	dogGdsdCertificateFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]), // LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool
	});

	retiredDogForm: FormGroup = this.formBuilder.group({
		dateOfRetirement: new FormControl('', [Validators.required]),
		isContinueToLiveWithDog: new FormControl('', [Validators.required]),
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
	getSaveBodyBaseNew(retiredDogModelFormGroup: any): any {
		// TODO fix } RetiredDogRequestExt {
		return this.getSaveBodyBase(retiredDogModelFormGroup);
	}

	/**
	 * get body the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBaseChange(retiredDogModelFormGroup: any): any {
		// TODO fix  RetiredDogChangeRequestExt {
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
	private getSaveBodyBase(retiredDogModelFormGroup: any): any {
		const serviceTypeData = retiredDogModelFormGroup.serviceTypeData;
		const applicationTypeData = retiredDogModelFormGroup.applicationTypeData;
		const personalInformationData = retiredDogModelFormGroup.personalInformationData;
		const dogGdsdCertificateData = retiredDogModelFormGroup.dogGdsdCertificateData;
		const photographOfYourselfData = retiredDogModelFormGroup.photographOfYourselfData;
		const mailingAddressData = retiredDogModelFormGroup.mailingAddressData;
		const dogInfoData = retiredDogModelFormGroup.dogInfoData;
		const retiredDogData = retiredDogModelFormGroup.retiredDogData;
		const originalLicenceData = retiredDogModelFormGroup.originalLicenceData;
		const documentInfos: Array<Document> = [];

		if (dogInfoData.dogDateOfBirth) {
			dogInfoData.dogDateOfBirth = this.utilService.dateToDbDate(dogInfoData.dogDateOfBirth);
		}

		if (personalInformationData.dateOfBirth) {
			personalInformationData.dateOfBirth = this.utilService.dateToDbDate(personalInformationData.dateOfBirth);
		}

		if (retiredDogData.dateOfRetirement) {
			retiredDogData.dateOfRetirement = this.utilService.dateToDbDate(retiredDogData.dateOfRetirement);
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
				licenceDocumentTypeCode: LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
			});
		});

		photographOfYourselfData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
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
			licenceAppId: retiredDogModelFormGroup.licenceAppId,
			originalLicenceId: originalLicenceData.originalLicenceId,
			applicationOriginTypeCode: retiredDogModelFormGroup.applicationOriginTypeCode,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			serviceTypeCode: serviceTypeData.serviceTypeCode,
			licenceTermCode: retiredDogModelFormGroup.licenceTermCode,

			...personalInformationData,
			mailingAddressData,
			...dogInfoData,
			dateOfRetirement: retiredDogData.dateOfRetirement,
			isContinueToLiveWithDog: this.utilService.booleanTypeToBoolean(retiredDogData.isContinueToLiveWithDog),

			documentKeyCodes: [],
			documentInfos,
			documentRelatedInfos,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getDocsToSaveBlobs(retiredDogModelFormGroup: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const applicationTypeData = retiredDogModelFormGroup.applicationTypeData;
		const photographOfYourselfData = retiredDogModelFormGroup.photographOfYourselfData;
		const dogGdsdCertificateData = retiredDogModelFormGroup.dogGdsdCertificateData;

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

		if (dogGdsdCertificateData.attachments) {
			const docs: Array<Blob> = [];
			dogGdsdCertificateData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
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

	getSummarydateOfRetirement(retiredDogModelData: any): string {
		return retiredDogModelData.retiredDogData.dateOfRetirement ?? '';
	}
	getSummaryliveWithDog(retiredDogModelData: any): string {
		return retiredDogModelData.retiredDogData.isContinueToLiveWithDog ?? '';
	}

	getSummarygdsdCertificateAttachments(retiredDogModelData: any): File[] | null {
		return retiredDogModelData.photographOfYourselfData.attachments ?? [];
	}

	getSummaryphotoOfYourselfAttachments(retiredDogModelData: any): File[] | null {
		return retiredDogModelData.dogGdsdCertificateData.attachments ?? [];
	}
}
