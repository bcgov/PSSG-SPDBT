import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { ApplicationHelper } from '@app/core/services/application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { FormControlValidators } from '../validators/form-control.validators';
import { FormGroupValidators } from '../validators/form-group.validators';

export abstract class ControllingMembersHelper extends ApplicationHelper {
	bcSecurityLicenceHistoryFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl([], [Validators.required]),
	});

	citizenshipFormGroup: FormGroup = this.formBuilder.group(
		{
			isCanadianCitizen: new FormControl('', [FormControlValidators.required]),
			canadianCitizenProofTypeCode: new FormControl(''),
			notCanadianCitizenProofTypeCode: new FormControl(''),
			expiryDate: new FormControl(''),
			attachments: new FormControl([], [Validators.required]),
			governmentIssuedPhotoTypeCode: new FormControl(''),
			governmentIssuedExpiryDate: new FormControl(''),
			governmentIssuedAttachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'canadianCitizenProofTypeCode',
					(form) => form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'notCanadianCitizenProofTypeCode',
					(form) => form.get('isCanadianCitizen')?.value == BooleanTypeCode.No
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							(form.get('notCanadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.WorkPermit ||
								form.get('notCanadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.StudyPermit))
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedPhotoTypeCode',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value != LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('notCanadianCitizenProofTypeCode')?.value != LicenceDocumentTypeCode.PermanentResidentCard)
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedAttachments',
					(form) =>
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							form.get('canadianCitizenProofTypeCode')?.value != LicenceDocumentTypeCode.CanadianPassport) ||
						(form.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							form.get('notCanadianCitizenProofTypeCode')?.value != LicenceDocumentTypeCode.PermanentResidentCard)
				),
			],
		}
	);

	constructor(
		formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected formatDatePipe: FormatDatePipe,
		protected utilService: UtilService,
		protected fileUtilService: FileUtilService
	) {
		super(formBuilder);
	}

	// getDocsToSaveBlobs(controllingMembersModelFormValue: any): Array<LicenceDocumentsToSave> {
	// 	const companyBrandingData = { ...controllingMembersModelFormValue.companyBrandingData };
	// 	const liabilityData = { ...controllingMembersModelFormValue.liabilityData };
	// 	const controllingMembersData = { ...controllingMembersModelFormValue.controllingMembersData };

	// 	const documents: Array<LicenceDocumentsToSave> = [];

	// 	if (!companyBrandingData.noLogoOrBranding) {
	// 		const docs: Array<Blob> = [];
	// 		companyBrandingData.attachments?.forEach((doc: any) => {
	// 			docs.push(doc);
	// 		});
	// 		documents.push({
	// 			licenceDocumentTypeCode: LicenceDocumentTypeCode.BizBranding,
	// 			documents: docs,
	// 		});
	// 	}

	// 	if (liabilityData.attachments?.length > 0) {
	// 		const docs: Array<Blob> = [];
	// 		liabilityData.attachments?.forEach((doc: any) => {
	// 			docs.push(doc);
	// 		});
	// 		documents.push({
	// 			licenceDocumentTypeCode: LicenceDocumentTypeCode.BizInsurance,
	// 			documents: docs,
	// 		});
	// 	}

	// 	if (controllingMembersData.attachments) {
	// 		const docs: Array<Blob> = [];
	// 		controllingMembersData.attachments.forEach((doc: any) => {
	// 			docs.push(doc);
	// 		});
	// 		documents.push({
	// 			licenceDocumentTypeCode: LicenceDocumentTypeCode.CorporateRegistryDocument,
	// 			documents: docs,
	// 		});
	// 	}

	// 	return documents;
	// }

	getSaveBodyBase(controllingMembersModelFormValue: any): any {
		// 	const bizId = controllingMembersModelFormValue.bizId;
		// 	const licenceAppId = controllingMembersModelFormValue.licenceAppId;
		// 	const workerLicenceTypeData = { ...controllingMembersModelFormValue.workerLicenceTypeData };
		// 	const applicationTypeData = { ...controllingMembersModelFormValue.applicationTypeData };
		// 	const expiredLicenceData = { ...controllingMembersModelFormValue.expiredLicenceData };
		// 	const companyBrandingData = { ...controllingMembersModelFormValue.companyBrandingData };
		// 	const applicantData = { ...controllingMembersModelFormValue.applicantData };
		// 	const originalLicenceData = { ...controllingMembersModelFormValue.originalLicenceData };

		// 	const bizTypeCode = controllingMembersModelFormValue.businessInformationData.bizTypeCode;

		// 	let privateInvestigatorSwlInfo: SwlContactInfo = {};
		// 	let useDogs: boolean | null = null;

		// 	const categoryCodes = this.getSaveBodyCategoryCodes(controllingMembersModelFormValue.categoryData);
		// 	const documentInfos = this.getSaveBodyDocumentInfos(controllingMembersModelFormValue);

		// 	// Business Manager information is only supplied in non-sole proprietor flow
		// 	let applicantContactInfo: ContactInfo = {};
		// 	let applicantIsBizManager: boolean | null = null;

		// 	// Only save members if business is not a sole proprietor
		// 	let members: Members = {
		// 		employees: [],
		// 		nonSwlControllingMembers: [],
		// 		swlControllingMembers: [],
		// 	};
		// 	if (!this.isSoleProprietor(bizTypeCode)) {
		// 		members = {
		// 			employees: this.saveEmployeesBody(controllingMembersModelFormValue.employeesData),
		// 			nonSwlControllingMembers: this.saveControllingMembersWithoutSwlBody(
		// 				controllingMembersModelFormValue.controllingMembersData
		// 			),
		// 			swlControllingMembers: this.saveControllingMembersWithSwlBody(controllingMembersModelFormValue.controllingMembersData),
		// 		};
		// 	}

		// 	const hasExpiredLicence = expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes;
		// 	const expiredLicenceId = hasExpiredLicence ? expiredLicenceData.expiredLicenceId : null;
		// 	if (!hasExpiredLicence) {
		// 		this.clearExpiredLicenceModelData();
		// 	}

		const body = {
			// 		bizId,
			// 		bizTypeCode,
			// 		licenceAppId,
			// 		latestApplicationId: controllingMembersModelFormValue.latestApplicationId,
			// 		applicationTypeCode: applicationTypeData.applicationTypeCode,
			// 		workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			// 		licenceTermCode: controllingMembersModelFormValue.licenceTermData.licenceTermCode,
			// 		//-----------------------------------
			// 		members,
			// 		//-----------------------------------
			// 		originalApplicationId: originalLicenceData ? originalLicenceData.originalApplicationId : null,
			// 		originalLicenceId: originalLicenceData ? originalLicenceData.originalLicenceId : null,
			// 		//-----------------------------------
			// 		categoryCodes: [...categoryCodes],
			// 		documentInfos: [...documentInfos],
			// 		privateInvestigatorSwlInfo,
			// 		useDogs,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	// getSaveBodyDocumentInfos(controllingMembersModelFormValue: any): Array<Document> {
	// 	const companyBrandingData = { ...controllingMembersModelFormValue.companyBrandingData };
	// 	const liabilityData = { ...controllingMembersModelFormValue.liabilityData };
	// 	const controllingMembersData = { ...controllingMembersModelFormValue.controllingMembersData };

	// 	const documents: Array<Document> = [];

	// 	if (!companyBrandingData.noLogoOrBranding) {
	// 		companyBrandingData.attachments?.forEach((doc: any) => {
	// 			documents.push({
	// 				documentUrlId: doc.documentUrlId,
	// 				licenceDocumentTypeCode: LicenceDocumentTypeCode.BizBranding,
	// 			});
	// 		});
	// 	}

	// 	if (liabilityData.attachments?.length > 0) {
	// 		liabilityData.attachments?.forEach((doc: any) => {
	// 			documents.push({
	// 				documentUrlId: doc.documentUrlId,
	// 				licenceDocumentTypeCode: LicenceDocumentTypeCode.BizInsurance,
	// 			});
	// 		});
	// 	}

	// 	return documents;
	// }

	// isRenewalOrUpdate(applicationTypeCode: ApplicationTypeCode | undefined): boolean {
	// 	if (!applicationTypeCode) return false;

	// 	return applicationTypeCode === ApplicationTypeCode.Renewal || applicationTypeCode === ApplicationTypeCode.Update;
	// }

	// isUpdate(applicationTypeCode: ApplicationTypeCode | undefined): boolean {
	// 	if (!applicationTypeCode) return false;

	// 	return applicationTypeCode === ApplicationTypeCode.Update;
	// }
}
