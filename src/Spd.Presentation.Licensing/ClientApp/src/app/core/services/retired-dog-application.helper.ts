import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeCode, Document, DocumentRelatedInfo, LicenceDocumentTypeCode } from '@app/api/models';
import { SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { FormControlValidators } from '../validators/form-control.validators';
import { GdsdCommonApplicationHelper } from './gdsd-common-application.helper';

export abstract class RetiredDogApplicationHelper extends GdsdCommonApplicationHelper {
	dogGdsdCertificateFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]), // TODO LicenceDocumentTypeCode.VeterinarianConfirmationForSpayedNeuteredDog
	});

	retiredDogForm: FormGroup = this.formBuilder.group({
		dateOfRetirement: new FormControl('', [Validators.required]),
		isContinueToLiveWithDog: new FormControl('', [Validators.required]),
	});

	trainingSchoolInfoFormGroup: FormGroup = this.formBuilder.group({
		accreditedSchoolName: new FormControl('', [Validators.required]),
		schoolDirectorGivenName: new FormControl(''),
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
		protected utilService: UtilService
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

		if (dogTrainerData.dateOfBirth) {
			dogTrainerData.dateOfBirth = this.utilService.dateToDbDate(dogTrainerData.dateOfBirth);
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
