import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address, ApplicationOriginTypeCode, BranchInfo, Document, LicenceDocumentTypeCode } from '@app/api/models';
import { CommonApplicationHelper } from '@app/core/services/common-application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';

export abstract class MetalDealersApplicationHelper extends CommonApplicationHelper {
	businessOwnerFormGroup: FormGroup = this.formBuilder.group({
		bizLegalName: new FormControl('', [FormControlValidators.required]),
		bizTradeName: new FormControl('', [FormControlValidators.required]),
		bizOwnerGivenNames: new FormControl(''),
		bizOwnerSurname: new FormControl('', [FormControlValidators.required]),
		bizEmailAddress: new FormControl('', [FormControlValidators.required, FormControlValidators.email]),
		bizPhoneNumber: new FormControl(''),
		attachments: new FormControl([], [Validators.required]),
	});

	businessManagerFormGroup: FormGroup = this.formBuilder.group({
		bizManagerFullName: new FormControl('', [FormControlValidators.required]),
		bizManagerPhoneNumber: new FormControl(''),
		bizManagerEmailAddress: new FormControl('', [FormControlValidators.email]),
	});

	businessAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [FormControlValidators.required]),
	});

	businessMailingAddressFormGroup: FormGroup = this.formBuilder.group(
		{
			addressSelected: new FormControl(false),
			addressLine1: new FormControl(''),
			addressLine2: new FormControl(''),
			city: new FormControl(''),
			postalCode: new FormControl(''),
			province: new FormControl(''),
			country: new FormControl(''),
			isAddressTheSame: new FormControl(false),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredTrueValidator(
					'addressSelected',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'addressLine1',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'city',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'postalCode',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'province',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
				FormGroupValidators.conditionalRequiredValidator(
					'country',
					(_form) => _form.get('isAddressTheSame')?.value != true
				),
			],
		}
	);

	branchesFormGroup: FormGroup = this.formBuilder.group({
		branches: this.formBuilder.array([]),
	});

	branchFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [
			FormControlValidators.required,
			FormControlValidators.requiredValue(SPD_CONSTANTS.address.countryCA, SPD_CONSTANTS.address.countryCanada),
		]),
		branchManager: new FormControl('', [FormControlValidators.required]),
		branchPhoneNumber: new FormControl('', [FormControlValidators.required]),
		branchEmailAddr: new FormControl('', [FormControlValidators.email]),
	});

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		agreeToCompleteAndAccurate: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
		captchaFormGroup: new FormGroup({
			token: new FormControl('', FormControlValidators.required),
		}),
	});

	constructor(
		formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected utilService: UtilService,
		protected fileUtilService: FileUtilService
	) {
		super(formBuilder);
	}

	getDocsToSaveBlobs(mdraModelFormValue: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const businessOwnerData = mdraModelFormValue.businessOwnerData;
		if (businessOwnerData.attachments) {
			const docs: Array<Blob> = [];
			businessOwnerData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.BusinessLicenceDocuments, documents: docs });
		}

		return documents;
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBase(mdraModelFormValue: any): any {
		// const licenceAppId = mdraModelFormValue.licenceAppId;
		// const originalLicenceData = mdraModelFormValue.originalLicenceData;
		// const serviceTypeData = mdraModelFormValue.serviceTypeData;
		const applicationTypeData = mdraModelFormValue.applicationTypeData;
		const expiredLicenceData = mdraModelFormValue.expiredLicenceData;
		const businessOwnerData = mdraModelFormValue.businessOwnerData;
		const businessManagerData = mdraModelFormValue.businessManagerData;
		const businessAddressData = mdraModelFormValue.businessAddressData;
		const businessMailingAddressData = mdraModelFormValue.businessMailingAddressData;
		const branchesData = mdraModelFormValue.branchesData;

		const bizAddress: Address = {
			addressLine1: businessAddressData.addressLine1,
			addressLine2: businessAddressData.addressLine2,
			city: businessAddressData.city,
			postalCode: businessAddressData.postalCode,
			province: businessAddressData.province,
			country: businessAddressData.country,
		};

		let bizMailingAddress: Address = bizAddress;

		if (!businessMailingAddressData.isAddressTheSame) {
			bizMailingAddress = {
				addressLine1: businessMailingAddressData.addressLine1,
				addressLine2: businessMailingAddressData.addressLine2,
				city: businessMailingAddressData.city,
				postalCode: businessMailingAddressData.postalCode,
				province: businessMailingAddressData.province,
				country: businessMailingAddressData.country,
			};
		}

		const branches: Array<BranchInfo> = [];
		branchesData.branches.forEach((item: any) => {
			const branchAddress: Address = {
				addressLine1: item.addressLine1,
				addressLine2: item.addressLine2,
				city: item.city,
				country: item.country,
				postalCode: item.postalCode,
				province: item.province,
			};
			const branch: BranchInfo = {
				branchId: item.branchId,
				branchEmailAddr: item.branchEmailAddr,
				branchManager: item.branchManager,
				branchPhoneNumber: item.branchPhoneNumber,
				branchAddress,
			};
			branches.push(branch);
		});

		const documentInfos: Array<Document> = [];

		businessOwnerData.attachments?.forEach((doc: any) => {
			documentInfos.push({
				documentUrlId: doc.documentUrlId,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.BusinessLicenceDocuments,
			});
		});

		const hasExpiredLicence = expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes;
		const expiredLicenceId = hasExpiredLicence ? expiredLicenceData.expiredLicenceId : null;
		if (!hasExpiredLicence) {
			this.clearExpiredLicenceModelData();
		}

		const body = {
			applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			bizOwnerGivenNames: businessOwnerData.bizOwnerGivenNames,
			bizOwnerSurname: businessOwnerData.bizOwnerSurname,
			bizEmailAddress: businessOwnerData.bizEmailAddress,
			bizPhoneNumber: businessOwnerData.bizPhoneNumber,
			bizLegalName: businessOwnerData.bizLegalName,
			bizTradeName: businessOwnerData.bizTradeName,
			bizManagerFullName: businessManagerData.bizManagerFullName,
			bizManagerPhoneNumber: businessManagerData.bizManagerPhoneNumber,
			bizManagerEmailAddress: businessManagerData.bizManagerEmailAddress,
			bizAddress,
			bizMailingAddress,
			branches,
			// 	licenceAppId,
			// 	originalLicenceId: originalLicenceData.originalLicenceId,
			//-----------------------------------
			hasExpiredLicence,
			expiredLicenceId,
			//-----------------------------------
			documentInfos,
		};
		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getSummaryhasExpiredLicence(metalDealersModelData: any): string {
		return metalDealersModelData.expiredLicenceData.hasExpiredLicence ?? '';
	}
	getSummaryexpiredLicenceNumber(metalDealersModelData: any): string {
		return metalDealersModelData.expiredLicenceData.expiredLicenceNumber ?? '';
	}
	getSummaryexpiredLicenceExpiryDate(metalDealersModelData: any): string {
		return metalDealersModelData.expiredLicenceData.expiredLicenceExpiryDate ?? '';
	}
	getSummarybusinessOwnerDataname(metalDealersModelData: any): string {
		return (
			this.utilService.getFullName(
				metalDealersModelData.businessOwnerData.bizOwnerGivenNames,
				metalDealersModelData.businessOwnerData.bizOwnerSurname
			) ?? ''
		);
	}
	getSummarybusinessOwnerDatabizLegalName(metalDealersModelData: any): string {
		return metalDealersModelData.businessOwnerData.bizLegalName ?? '';
	}
	getSummarybusinessOwnerDatabizTradeName(metalDealersModelData: any): string {
		return metalDealersModelData.businessOwnerData.bizTradeName ?? '';
	}
	getSummarybusinessOwnerDatabizEmailAddress(metalDealersModelData: any): string {
		return metalDealersModelData.businessOwnerData.bizEmailAddress ?? '';
	}
	getSummarybusinessOwnerDatabizPhoneNumber(metalDealersModelData: any): string {
		return metalDealersModelData.businessOwnerData.bizPhoneNumber ?? '';
	}
	getSummarybusinessOwnerDataattachments(metalDealersModelData: any): File[] {
		return metalDealersModelData.businessOwnerData.attachments ?? [];
	}

	getSummarybusinessManagerDataname(metalDealersModelData: any): string {
		return metalDealersModelData.businessManagerData.bizManagerFullName;
	}
	getSummarybusinessManagerDatabizManagerEmailAddress(metalDealersModelData: any): string {
		return metalDealersModelData.businessManagerData.bizManagerEmailAddress ?? '';
	}
	getSummarybusinessManagerDatabizManagerPhoneNumber(metalDealersModelData: any): string {
		return metalDealersModelData.businessManagerData.bizManagerPhoneNumber ?? '';
	}

	getSummarybranchesDatabranches(metalDealersModelData: any): Array<any> {
		return metalDealersModelData.branchesData.branches ?? [];
	}

	getSummaryisAddressTheSame(metalDealersModelData: any): boolean {
		return metalDealersModelData.businessMailingAddressData?.isAddressTheSame ?? false;
	}
}
