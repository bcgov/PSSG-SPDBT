import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { ApplicationHelper } from '@app/core/services/application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { SPD_CONSTANTS } from '../constants/constants';
import { FormControlValidators } from '../validators/form-control.validators';
import { FormGroupValidators } from '../validators/form-group.validators';

export abstract class ControllingMemberCrcHelper extends ApplicationHelper {
	personalNameAndContactInformationFormGroup: FormGroup = this.formBuilder.group({
		givenName: new FormControl(''),
		middleName1: new FormControl(''),
		middleName2: new FormControl(''),
		surname: new FormControl('', [FormControlValidators.required]),
		genderCode: new FormControl('', [FormControlValidators.required]),
		dateOfBirth: new FormControl('', [Validators.required]),
		emailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		phoneNumber: new FormControl('', [Validators.required]),
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

	bcSecurityLicenceHistoryFormGroup: FormGroup = this.formBuilder.group(
		{
			hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
			criminalHistoryDetail: new FormControl(''),
			hasBankruptcyHistory: new FormControl('', [FormControlValidators.required]),
			bankruptcyHistoryDetail: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'criminalHistoryDetail',
					(form) => form.get('hasCriminalHistory')?.value == BooleanTypeCode.Yes
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
		agreeToCompleteAndAccurate: new FormControl(null, [Validators.requiredTrue]),
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
		protected formatDatePipe: FormatDatePipe,
		protected utilService: UtilService,
		protected fileUtilService: FileUtilService
	) {
		super(formBuilder);
	}

	getSaveBodyBaseAnonymous(controllingMemberCrcFormValue: any): any {
		const baseData = this.getSaveBodyBase(controllingMemberCrcFormValue, false);
		console.debug('[getSaveBodyBaseAnonymous] baseData', baseData);

		return baseData;
	}

	private getSaveBodyBase(controllingMemberCrcFormValue: any, isAuthenticated: boolean): any {
		const bcDriversLicenceData = { ...controllingMemberCrcFormValue.bcDriversLicenceData };
		const residentialAddressData = { ...controllingMemberCrcFormValue.residentialAddressData };
		const citizenshipData = { ...controllingMemberCrcFormValue.citizenshipData };
		const policeBackgroundData = { ...controllingMemberCrcFormValue.policeBackgroundData };
		// const fingerprintProofData = { ...controllingMemberCrcFormValue.fingerprintProofData };
		const mentalHealthConditionsData = { ...controllingMemberCrcFormValue.mentalHealthConditionsData };
		const personalInformationData = {
			...controllingMemberCrcFormValue.personalInformationData,
		};
		const bcSecurityLicenceHistoryData = controllingMemberCrcFormValue.bcSecurityLicenceHistoryData;

		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		const accessCode = ''; // TODO addess accessCode

		const hasBcDriversLicence = this.utilService.booleanTypeToBoolean(bcDriversLicenceData.hasBcDriversLicence);
		const hasBankruptcyHistory = this.utilService.booleanTypeToBoolean(
			bcSecurityLicenceHistoryData.hasBankruptcyHistory
		);
		const hasCriminalHistory = this.utilService.booleanTypeToBoolean(bcSecurityLicenceHistoryData.hasCriminalHistory);

		const body = {
			accessCode,
			givenName: personalInformationData.givenName,
			surname: personalInformationData.surname,
			middleName1: personalInformationData.middleName1,
			middleName2: personalInformationData.middleName2,
			dateOfBirth: personalInformationData.dateOfBirth,
			emailAddress: personalInformationData.emailAddress,
			phoneNumber: personalInformationData.phoneNumber,
			genderCode: personalInformationData.genderCode,
			//-----------------------------------
			hasPreviousName: this.utilService.booleanTypeToBoolean(
				controllingMemberCrcFormValue.aliasesData.previousNameFlag
			),
			aliases:
				controllingMemberCrcFormValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes
					? controllingMemberCrcFormValue.aliasesData.aliases
					: [],
			//-----------------------------------
			hasBcDriversLicence,
			bcDriversLicenceNumber: hasBcDriversLicence ? bcDriversLicenceData.bcDriversLicenceNumber : null,
			//-----------------------------------
			residentialAddress: residentialAddressData,
			//-----------------------------------
			isCanadianCitizen: this.utilService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen),
			//-----------------------------------
			hasBankruptcyHistory,
			bankruptcyHistoryDetail: hasBankruptcyHistory ? bcSecurityLicenceHistoryData.bankruptcyHistoryDetail : null,
			//-----------------------------------
			hasCriminalHistory,
			criminalHistoryDetail: hasCriminalHistory ? bcSecurityLicenceHistoryData.criminalHistoryDetail : null,
			//-----------------------------------
			isTreatedForMHC: this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC),
			// hasNewMentalHealthCondition: this.utilService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC), // used by the backend for an Update or Renewal
			//-----------------------------------
			isPoliceOrPeaceOfficer: this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer),
			policeOfficerRoleCode: policeBackgroundData.policeOfficerRoleCode,
			otherOfficerRole: policeBackgroundData.otherOfficerRole,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}
}
