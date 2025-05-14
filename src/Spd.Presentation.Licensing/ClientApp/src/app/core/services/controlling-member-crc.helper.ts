import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicantProfileResponse,
	ApplicationTypeCode,
	ControllingMemberCrcAppSubmitRequest,
	ControllingMemberCrcAppUpsertRequest,
	Document,
	DocumentRelatedInfo,
	LicenceDocumentTypeCode,
	PoliceOfficerRoleCode,
} from '@app/api/models';
import { CommonApplicationHelper } from '@app/core/services/common-application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { FormControlValidators } from '../validators/form-control.validators';
import { FormGroupValidators } from '../validators/form-group.validators';

export abstract class ControllingMemberCrcHelper extends CommonApplicationHelper {
	bcSecurityLicenceHistoryFormGroup: FormGroup = this.formBuilder.group(
		{
			hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
			hasCourtJudgement: new FormControl('', [FormControlValidators.required]),
			criminalHistoryDetail: new FormControl(''),
			hasBankruptcyHistory: new FormControl(''),
			bankruptcyHistoryDetail: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'criminalHistoryDetail',
					(form) =>
						form.get('hasCriminalHistory')?.value == BooleanTypeCode.Yes ||
						form.get('hasCourtJudgement')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'hasBankruptcyHistory',
					(_form) => this.applicationTypeFormGroup.get('applicationTypeCode')?.value == ApplicationTypeCode.New
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'bankruptcyHistoryDetail',
					(form) => form.get('hasBankruptcyHistory')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		check2: new FormControl(null, [Validators.requiredTrue]),
		check3: new FormControl(null, [Validators.requiredTrue]),
		check4: new FormControl(null, [Validators.requiredTrue]),
		check5: new FormControl(null, [Validators.requiredTrue]),
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

	getSaveBodyBaseSubmitAuthenticated(controllingMemberCrcFormValue: any): ControllingMemberCrcAppSubmitRequest {
		const baseData = this.getSaveBodyBase(controllingMemberCrcFormValue);

		// converted data maybe missing this value.
		if (typeof baseData.hasBcDriversLicence !== 'boolean') {
			baseData.hasBcDriversLicence = false;
		}

		const returnBody: ControllingMemberCrcAppSubmitRequest = baseData;
		return returnBody;
	}

	getSaveBodyBaseUpsertAuthenticated(controllingMemberCrcFormValue: any): ControllingMemberCrcAppUpsertRequest {
		const baseData = this.getSaveBodyBase(controllingMemberCrcFormValue);

		const returnBody: ControllingMemberCrcAppUpsertRequest = baseData;
		return returnBody;
	}

	getSaveBodyBaseAnonymous(controllingMemberCrcFormValue: any): any {
		const baseData = this.getSaveBodyBase(controllingMemberCrcFormValue);
		console.debug('[getSaveBodyBaseAnonymous] baseData', baseData);

		return baseData;
	}

	private getSaveBodyBase(controllingMemberCrcFormValue: any): any {
		const serviceTypeData = controllingMemberCrcFormValue.serviceTypeData;
		const applicationTypeData = controllingMemberCrcFormValue.applicationTypeData;
		const bcDriversLicenceData = controllingMemberCrcFormValue.bcDriversLicenceData;
		const residentialAddressData = controllingMemberCrcFormValue.residentialAddressData;
		const citizenshipData = controllingMemberCrcFormValue.citizenshipData;
		const policeBackgroundData = controllingMemberCrcFormValue.policeBackgroundData;
		const fingerprintProofData = controllingMemberCrcFormValue.fingerprintProofData;
		const mentalHealthConditionsData = controllingMemberCrcFormValue.mentalHealthConditionsData;
		const personalInformationData = controllingMemberCrcFormValue.personalInformationData;
		const contactInformationData = controllingMemberCrcFormValue.contactInformationData;
		const bcSecurityLicenceHistoryData = controllingMemberCrcFormValue.bcSecurityLicenceHistoryData;

		const hasCriminalHistory = this.utilService.booleanTypeToBoolean(bcSecurityLicenceHistoryData.hasCriminalHistory);
		const isTreatedForMHC = this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC);
		const isPoliceOrPeaceOfficer = this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer);
		const policeOfficerRoleCode = isPoliceOrPeaceOfficer
			? policeBackgroundData.policeOfficerRoleCode
			: PoliceOfficerRoleCode.None;
		const otherOfficerRole =
			isPoliceOrPeaceOfficer && policeOfficerRoleCode === PoliceOfficerRoleCode.Other
				? policeBackgroundData.otherOfficerRole
				: null;

		const documentInfos: Array<Document> = [];

		fingerprintProofData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
			});
		});

		if (isPoliceOrPeaceOfficer && policeBackgroundData.attachments) {
			policeBackgroundData.attachments.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				});
			});
		}

		if (isTreatedForMHC && mentalHealthConditionsData.attachments) {
			mentalHealthConditionsData.attachments.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition,
				});
			});
		}

		citizenshipData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				expiryDate: this.utilService.dateToDbDate(citizenshipData.expiryDate),
				documentIdNumber: citizenshipData.documentIdNumber,
				licenceDocumentTypeCode:
					citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
						? citizenshipData.canadianCitizenProofTypeCode
						: citizenshipData.notCanadianCitizenProofTypeCode,
			});
		});

		const isIncludeAdditionalGovermentIdStepData = this.utilService.getSwlShowAdditionalGovIdData(
			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.notCanadianCitizenProofTypeCode
		);

		if (isIncludeAdditionalGovermentIdStepData && citizenshipData.governmentIssuedAttachments) {
			citizenshipData.governmentIssuedAttachments?.forEach((doc: any) => {
				documentInfos.push({
					documentUrlId: doc.documentUrlId,
					expiryDate: this.utilService.dateToDbDate(citizenshipData.governmentIssuedExpiryDate),
					documentIdNumber: citizenshipData.governmentIssuedDocumentIdNumber,
					licenceDocumentTypeCode: citizenshipData.governmentIssuedPhotoTypeCode,
				});
			});
		}

		personalInformationData.dateOfBirth = this.utilService.dateToDbDate(personalInformationData.dateOfBirth);

		const hasBcDriversLicence = this.utilService.booleanTypeToBoolean(bcDriversLicenceData.hasBcDriversLicence);
		const hasCourtJudgement = this.utilService.booleanTypeToBoolean(bcSecurityLicenceHistoryData.hasCourtJudgement);
		const hasBankruptcyHistory = this.utilService.booleanTypeToBoolean(
			bcSecurityLicenceHistoryData.hasBankruptcyHistory
		);
		const hasPreviousName = controllingMemberCrcFormValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes;

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
			serviceTypeCode: serviceTypeData.serviceTypeCode,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			bizContactId: controllingMemberCrcFormValue.bizContactId,
			controllingMemberAppId: controllingMemberCrcFormValue.controllingMemberAppId,
			parentBizLicApplicationId: controllingMemberCrcFormValue.parentBizLicApplicationId,
			inviteId: controllingMemberCrcFormValue.inviteId,
			applicantId: controllingMemberCrcFormValue.applicantId,
			//-----------------------------------
			givenName: personalInformationData.givenName,
			surname: personalInformationData.surname,
			middleName1: personalInformationData.middleName1,
			middleName2: personalInformationData.middleName2,
			dateOfBirth: personalInformationData.dateOfBirth,
			genderCode: personalInformationData.genderCode,
			emailAddress: contactInformationData.emailAddress,
			phoneNumber: contactInformationData.phoneNumber,
			//-----------------------------------
			hasPreviousName,
			aliases: hasPreviousName ? controllingMemberCrcFormValue.aliasesData.aliases : [],
			//-----------------------------------
			hasBcDriversLicence,
			bcDriversLicenceNumber: hasBcDriversLicence ? bcDriversLicenceData.bcDriversLicenceNumber : null,
			//-----------------------------------
			residentialAddress: residentialAddressData,
			//-----------------------------------
			isCanadianCitizen: this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen),
			//-----------------------------------
			hasCriminalHistory,
			hasCourtJudgement,
			hasBankruptcyHistory,
			bankruptcyHistoryDetail: hasBankruptcyHistory ? bcSecurityLicenceHistoryData.bankruptcyHistoryDetail : null,
			//-----------------------------------
			criminalHistoryDetail:
				hasCriminalHistory || hasCourtJudgement ? bcSecurityLicenceHistoryData.criminalHistoryDetail : null,
			//-----------------------------------
			isTreatedForMHC,
			//-----------------------------------
			isPoliceOrPeaceOfficer,
			policeOfficerRoleCode,
			otherOfficerRole,
			//-----------------------------------
			documentRelatedInfos: documentRelatedInfos,
			documentInfos: documentInfos,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getDocsToSaveBlobs(
		body: ControllingMemberCrcAppSubmitRequest,
		controllingMembersModelFormValue: any
	): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const citizenshipData = controllingMembersModelFormValue.citizenshipData;
		const fingerprintProofData = controllingMembersModelFormValue.fingerprintProofData;
		const policeBackgroundData = controllingMembersModelFormValue.policeBackgroundData;
		const mentalHealthConditionsData = controllingMembersModelFormValue.mentalHealthConditionsData;

		if (fingerprintProofData.attachments) {
			const docs: Array<Blob> = [];
			fingerprintProofData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint, documents: docs });
		}

		if (body.isPoliceOrPeaceOfficer && policeBackgroundData.attachments) {
			const docs: Array<Blob> = [];
			policeBackgroundData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				documents: docs,
			});
		}

		if (body.isTreatedForMHC && mentalHealthConditionsData.attachments) {
			const docs: Array<Blob> = [];
			mentalHealthConditionsData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition, documents: docs });
		}

		if (citizenshipData.attachments) {
			const docs: Array<Blob> = [];
			citizenshipData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			const citizenshipLicenceDocumentTypeCode =
				citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
					? citizenshipData.canadianCitizenProofTypeCode
					: citizenshipData.notCanadianCitizenProofTypeCode;
			documents.push({ licenceDocumentTypeCode: citizenshipLicenceDocumentTypeCode, documents: docs });
		}

		const isIncludeAdditionalGovermentIdStepData = this.utilService.getSwlShowAdditionalGovIdData(
			citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.notCanadianCitizenProofTypeCode
		);

		if (isIncludeAdditionalGovermentIdStepData && citizenshipData.governmentIssuedAttachments) {
			const docs: Array<Blob> = [];
			citizenshipData.governmentIssuedAttachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: citizenshipData.governmentIssuedPhotoTypeCode, documents: docs });
		}

		console.debug('[getDocsToSaveBlobs] documentsToSave', documents);
		return documents;
	}

	getApplicantPersonalInformationData(applicantProfile?: ApplicantProfileResponse): any {
		return {
			givenName: applicantProfile?.givenName,
			middleName1: applicantProfile?.middleName1,
			middleName2: applicantProfile?.middleName2,
			surname: applicantProfile?.surname,
			genderCode: applicantProfile?.genderCode,
			dateOfBirth: applicantProfile?.dateOfBirth,
			origGivenName: applicantProfile?.givenName,
			origMiddleName1: applicantProfile?.middleName1,
			origMiddleName2: applicantProfile?.middleName2,
			origSurname: applicantProfile?.surname,
			origDateOfBirth: applicantProfile?.dateOfBirth,
			origGenderCode: applicantProfile?.genderCode,
		};
	}

	getApplicanContactInformationData(applicantProfile?: ApplicantProfileResponse): any {
		return {
			emailAddress: applicantProfile?.emailAddress,
			phoneNumber: applicantProfile?.phoneNumber,
		};
	}

	getApplicantResidentialAddressData(applicantProfile?: ApplicantProfileResponse): any {
		return {
			addressSelected: !!applicantProfile?.residentialAddress?.addressLine1,
			addressLine1: applicantProfile?.residentialAddress?.addressLine1,
			addressLine2: applicantProfile?.residentialAddress?.addressLine2,
			city: applicantProfile?.residentialAddress?.city,
			country: applicantProfile?.residentialAddress?.country,
			postalCode: applicantProfile?.residentialAddress?.postalCode,
			province: applicantProfile?.residentialAddress?.province,
		};
	}
}
