import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Address, ApplicationOriginTypeCode, BranchInfo } from '@app/api/models';
import { CommonApplicationHelper } from '@app/core/services/common-application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { SPD_CONSTANTS } from '../constants/constants';

export abstract class MetalDealersApplicationHelper extends CommonApplicationHelper {
	businessOwnerFormGroup: FormGroup = this.formBuilder.group({
		bizLegalName: new FormControl('', [FormControlValidators.required]),
		bizTradeName: new FormControl(''),
		givenName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		emailAddress: new FormControl('', [FormControlValidators.required, FormControlValidators.email]),
		attachments: new FormControl([], [Validators.required]),
	});

	businessManagerFormGroup: FormGroup = this.formBuilder.group({
		fullName: new FormControl('', [FormControlValidators.required]),
		phoneNumber: new FormControl(''),
		emailAddress: new FormControl('', [FormControlValidators.email]),
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

	branchesFormGroup: FormGroup = this.formBuilder.group(
		{
			branches: this.formBuilder.array([]),
		},
		{
			validators: [FormGroupValidators.branchrequiredValidator('branches')],
		}
	);

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
		givenName: new FormControl(''),
		middleName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		phoneNumber: new FormControl('', [FormControlValidators.required]),
		emailAddress: new FormControl('', [FormControlValidators.email]),
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

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	private getSaveBodyBase(mdraModelFormValue: any): any {
		const licenceAppId = mdraModelFormValue.licenceAppId;
		const originalLicenceData = mdraModelFormValue.originalLicenceData;
		const serviceTypeData = mdraModelFormValue.serviceTypeData;
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

		// const isCanadianCitizen = this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen);

		// citizenshipData.attachments?.forEach((doc: any) => {
		// 	let licenceDocumentTypeCode = citizenshipData.canadianCitizenProofTypeCode;
		// 	if (!isCanadianCitizen) {
		// 		if (citizenshipData.isCanadianResident == BooleanTypeCode.Yes) {
		// 			licenceDocumentTypeCode = citizenshipData.proofOfResidentStatusCode;
		// 		} else {
		// 			licenceDocumentTypeCode = citizenshipData.proofOfCitizenshipCode;
		// 		}
		// 	}

		// 	documentInfos.push({
		// 		documentUrlId: doc.documentUrlId,
		// 		expiryDate: this.utilService.dateToDbDate(citizenshipData.expiryDate),
		// 		documentIdNumber: citizenshipData.documentIdNumber,
		// 		licenceDocumentTypeCode,
		// 	});
		// });

		// }

		// const documentRelatedInfos: Array<DocumentRelatedInfo> =
		// 	documentInfos
		// 		.filter((doc) => doc.expiryDate || doc.documentIdNumber)
		// 		.map((doc: Document) => {
		// 			return {
		// 				expiryDate: doc.expiryDate,
		// 				documentIdNumber: doc.documentIdNumber,
		// 				licenceDocumentTypeCode: doc.licenceDocumentTypeCode,
		// 			} as DocumentRelatedInfo;
		// 		}) ?? [];

		// const hasExpiredLicence = expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes;
		// const expiredLicenceId = hasExpiredLicence ? expiredLicenceData.expiredLicenceId : null;
		// if (!hasExpiredLicence) {
		// 	this.clearExpiredLicenceModelData();
		// }

		const body = {
			applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			bizOwnerFirstName: businessOwnerData.givenName,
			bizOwnerLastName: businessOwnerData.surname,
			bizOwnerMiddleName: businessOwnerData.middleName,
			bizEmailAddress: businessOwnerData.emailAddress,
			bizLegalName: businessOwnerData.bizLegalName,
			bizTradeName: businessOwnerData.bizTradeName,
			bizManagerFirstName: businessManagerData.givenName,
			bizManagerLastName: businessManagerData.surname,
			bizManagerMiddleName: businessManagerData.middleName,
			bizPhoneNumber: businessManagerData.phoneNumber,
			bizAddress,
			bizMailingAddress,
			branches,
			//   documentKeyCodes: Array<string> | null;

			// 	licenceAppId,
			// 	originalApplicationId: originalLicenceData.originalApplicationId,
			// 	originalLicenceId: originalLicenceData.originalLicenceId,
			// 	applicationTypeCode: applicationTypeData.applicationTypeCode,
			// 	serviceTypeCode: serviceTypeData.serviceTypeCode,
			// 	//-----------------------------------
			// 	hasExpiredLicence,
			// 	expiredLicenceId,
			// 	//-----------------------------------
			// 	documentRelatedInfos: documentRelatedInfos,
			// 	documentInfos: isAuthenticated ? documentInfos : undefined,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getFullNameWithMiddle(givenName: string | null | undefined, surname: string | null | undefined): string {
		const userNameArray: string[] = [];
		if (givenName) {
			userNameArray.push(givenName);
		}
		if (surname) {
			userNameArray.push(surname);
		}
		return userNameArray.join(' ');
	}

	getSummarybusinessOwnerDataname(metalDealersModelData: any): string {
		return this.getFullNameWithMiddle(
			metalDealersModelData.businessOwnerData.givenName,
			metalDealersModelData.businessOwnerData.surname
		);
	}
	getSummarybusinessOwnerDatabizLegalName(metalDealersModelData: any): string {
		return metalDealersModelData.businessOwnerData.bizLegalName ?? '';
	}
	getSummarybusinessOwnerDatabizTradeName(metalDealersModelData: any): string {
		return metalDealersModelData.businessOwnerData.bizTradeName ?? '';
	}
	getSummarybusinessOwnerDataattachments(metalDealersModelData: any): File[] {
		return metalDealersModelData.businessOwnerData.attachments ?? [];
	}

	getSummarybusinessManagerDataname(metalDealersModelData: any): string {
		return metalDealersModelData.businessManagerData.fullName;
	}
	getSummarybusinessManagerDataphoneNumber(metalDealersModelData: any): string {
		return metalDealersModelData.businessManagerData.phoneNumber ?? '';
	}
	getSummarybusinessManagerDataemailAddress(metalDealersModelData: any): string {
		return metalDealersModelData.businessManagerData.emailAddress ?? '';
	}
	getSummarybranchesDatabranches(metalDealersModelData: any): Array<any> {
		return metalDealersModelData.branchesData.branches ?? [];
	}

	getSummaryisAddressTheSame(metalDealersModelData: any): boolean {
		return metalDealersModelData.businessMailingAddressData?.isAddressTheSame ?? false;
	}
}
