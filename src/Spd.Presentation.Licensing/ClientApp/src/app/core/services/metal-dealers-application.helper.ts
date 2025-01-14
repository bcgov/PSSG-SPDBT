import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { CommonApplicationHelper } from '@app/core/services/common-application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
import { FormGroupValidators } from '@app/core/validators/form-group.validators';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { SPD_CONSTANTS } from '../constants/constants';

export abstract class MetalDealersApplicationHelper extends CommonApplicationHelper {
	registerFormGroup: FormGroup = this.formBuilder.group(
		{
			applicationTypeCode: new FormControl('', [FormControlValidators.required]),
			registrationNumber: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredTrueValidator(
					'registrationNumber',
					(_form) =>
						_form.get('applicationTypeCode')?.value === ApplicationTypeCode.Update ||
						_form.get('applicationTypeCode')?.value === ApplicationTypeCode.Renewal
				),
			],
		}
	);

	businessOwnerFormGroup: FormGroup = this.formBuilder.group({
		legalBusinessName: new FormControl('', [FormControlValidators.required]),
		tradeName: new FormControl('', [FormControlValidators.required]),
		givenName: new FormControl(''),
		middleName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		attachments: new FormControl([]),
	});

	businessManagerFormGroup: FormGroup = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		phoneNumber: new FormControl('', [FormControlValidators.required]),
		emailAddress: new FormControl('', [FormControlValidators.email]),
	});

	businessAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false),
		addressLine1: new FormControl(''),
		addressLine2: new FormControl(''),
		city: new FormControl(''),
		postalCode: new FormControl(''),
		province: new FormControl(''),
		country: new FormControl(''),
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
		protected formatDatePipe: FormatDatePipe,
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

	getSummarybusinessOwnerDataname(modelData: any): string {
		return this.getFullNameWithMiddle(
			modelData.businessOwnerData.givenName,
			modelData.businessOwnerData.middleName,
			modelData.businessOwnerData.surname
		);
	}
	getSummarybusinessOwnerDatalegalBusinessName(modelData: any): string {
		return modelData.businessOwnerData.legalBusinessName ?? '';
	}
	getSummarybusinessOwnerDatatradeName(modelData: any): string {
		return modelData.businessOwnerData.tradeName ?? '';
	}

	getSummarybusinessManagerDataname(modelData: any): string {
		return this.getFullNameWithMiddle(
			modelData.businessManagerData.givenName,
			modelData.businessManagerData.middleName,
			modelData.businessManagerData.surname
		);
	}
	getSummarybusinessManagerDataphoneNumber(modelData: any): string {
		return modelData.businessManagerData.phoneNumber ?? '';
	}
	getSummarybusinessManagerDataemailAddress(modelData: any): string {
		return modelData.businessManagerData.emailAddress ?? '';
	}
}
