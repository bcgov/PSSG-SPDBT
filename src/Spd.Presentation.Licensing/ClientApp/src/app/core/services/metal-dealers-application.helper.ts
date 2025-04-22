import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonApplicationHelper } from '@app/core/services/common-application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { SPD_CONSTANTS } from '../constants/constants';

export abstract class MetalDealersApplicationHelper extends CommonApplicationHelper {
	businessOwnerFormGroup: FormGroup = this.formBuilder.group({
		legalBusinessName: new FormControl('', [FormControlValidators.required]),
		tradeName: new FormControl('', [FormControlValidators.required]),
		givenName: new FormControl(''),
		middleName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		emailAddress: new FormControl('', [FormControlValidators.required, FormControlValidators.email]),
		attachments: new FormControl([], [Validators.required]),
	});

	businessManagerFormGroup: FormGroup = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		phoneNumber: new FormControl('', [FormControlValidators.required]),
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

	getFullNameWithMiddle(
		givenName: string | null | undefined,
		middleName: string | null | undefined,
		surname: string | null | undefined
	): string {
		const userNameArray: string[] = [];
		if (givenName) {
			userNameArray.push(givenName);
		}
		if (middleName) {
			userNameArray.push(middleName);
		}
		if (surname) {
			userNameArray.push(surname);
		}
		return userNameArray.join(' ');
	}

	getSummarybusinessOwnerDataname(metalDealersModelData: any): string {
		return this.getFullNameWithMiddle(
			metalDealersModelData.businessOwnerData.givenName,
			metalDealersModelData.businessOwnerData.middleName,
			metalDealersModelData.businessOwnerData.surname
		);
	}
	getSummarybusinessOwnerDatalegalBusinessName(metalDealersModelData: any): string {
		return metalDealersModelData.businessOwnerData.legalBusinessName ?? '';
	}
	getSummarybusinessOwnerDatatradeName(metalDealersModelData: any): string {
		return metalDealersModelData.businessOwnerData.tradeName ?? '';
	}
	getSummarybusinessOwnerDataattachments(metalDealersModelData: any): File[] {
		return metalDealersModelData.businessOwnerData.attachments ?? [];
	}

	getSummarybusinessManagerDataname(metalDealersModelData: any): string {
		return this.getFullNameWithMiddle(
			metalDealersModelData.businessManagerData.givenName,
			metalDealersModelData.businessManagerData.middleName,
			metalDealersModelData.businessManagerData.surname
		);
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
