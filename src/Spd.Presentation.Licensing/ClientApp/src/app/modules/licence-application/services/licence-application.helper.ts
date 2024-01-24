import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	AdditionalGovIdDocument,
	BusinessTypeCode,
	CitizenshipDocument,
	Document,
	DocumentBase,
	FingerprintProofDocument,
	HeightUnitCode,
	IdPhotoDocument,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	MentalHealthDocument,
	PoliceOfficerDocument,
	PoliceOfficerRoleCode,
	WorkerCategoryTypeCode,
	WorkerLicenceAppAnonymousSubmitRequestJson,
	WorkerLicenceAppCategoryData,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { SpdFile } from '@app/core/services/util.service';
import { BooleanTypeCode, SelectOptions, WorkerCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceDocumentsToSave } from './licence-application.service';

export interface LicenceStepperStepComponent {
	onStepNext(formNumber: number): void;
	onStepPrevious(): void;
	onFormValidNextStep(formNumber: number): void;
	onStepSelectionChange(event: StepperSelectionEvent): void;
	onGoToNextStep(): void;
	onGoToFirstStep(): void;
	onGoToLastStep(): void;
}

export interface LicenceChildStepperStepComponent {
	isFormValid(): boolean;
}

export interface LicenceDocument {
	Documents?: Array<File>;
	LicenceDocumentTypeCode?: LicenceDocumentTypeCode;
}

export enum LicenceDocumentChanged {
	categoryArmouredCarGuard = 'categoryArmouredCarGuard',
	categoryFireInvestigator = 'categoryFireInvestigator',
	categoryLocksmith = 'categoryLocksmith',
	categoryPrivateInvestigator = 'categoryPrivateInvestigator',
	categoryPrivateInvestigatorSup = 'categoryPrivateInvestigatorSup',
	categorySecurityGuard = 'categorySecurityGuard',
	categorySecurityAlarmInstaller = 'categorySecurityAlarmInstaller',
	categorySecurityConsultant = 'categorySecurityConsultant',
	citizenship = 'citizenship',
	dogsAuthorization = 'dogsAuthorization',
	restraintsAuthorization = 'restraintsAuthorization',
	additionalGovermentId = 'additionalGovermentId',
	mentalHealthConditions = 'mentalHealthConditions',
	photographOfYourself = 'photographOfYourself',
	policeBackground = 'policeBackground',
	proofOfFingerprint = 'proofOfFingerprint',
}

export abstract class LicenceApplicationHelper {
	booleanTypeCodes = BooleanTypeCode;

	workerLicenceTypeFormGroup: FormGroup = this.formBuilder.group({
		workerLicenceTypeCode: new FormControl('', [Validators.required]),
	});

	applicationTypeFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeCode: new FormControl('', [Validators.required]),
	});

	accessCodeFormGroup: FormGroup = this.formBuilder.group({
		licenceNumber: new FormControl('OPENTEST1', [FormControlValidators.required]), // TODO removed hard-coded
		accessCode: new FormControl('6H0GXD0JZK', [FormControlValidators.required]), // TODO removed hard-coded
		linkedLicenceId: new FormControl(null, [FormControlValidators.required]),
		linkedLicenceAppId: new FormControl(null),
		linkedExpiryDate: new FormControl(null),
		captchaFormGroup: new FormGroup({
			token: new FormControl('', FormControlValidators.required),
		}),
	});

	personalInformationFormGroup = this.formBuilder.group(
		{
			givenName: new FormControl(''),
			middleName1: new FormControl(''),
			middleName2: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			genderCode: new FormControl('', [FormControlValidators.required]),
			dateOfBirth: new FormControl('', [Validators.required]),
			isNeedProofOfLegalNameChange: new FormControl(false),
			origGivenName: new FormControl(''),
			origMiddleName1: new FormControl(''),
			origMiddleName2: new FormControl(''),
			origSurname: new FormControl(''),
			origGenderCode: new FormControl(''),
			origDateOfBirth: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isNeedProofOfLegalNameChange')?.value
				),
			],
		}
	);

	soleProprietorFormGroup = this.formBuilder.group(
		{
			isSoleProprietor: new FormControl('', [FormControlValidators.required]),
			businessTypeCode: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'businessTypeCode',
					(form) => form.get('isSoleProprietor')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

	expiredLicenceFormGroup = this.formBuilder.group(
		{
			hasExpiredLicence: new FormControl('', [FormControlValidators.required]),
			expiredLicenceNumber: new FormControl(),
			expiredLicenceId: new FormControl(),
			expiryDate: new FormControl(),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'expiredLicenceNumber',
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiredLicenceId',
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'expiryDate',
					(form) => form.get('hasExpiredLicence')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

	licenceTermFormGroup: FormGroup = this.formBuilder.group({
		licenceTermCode: new FormControl('', [FormControlValidators.required]),
	});

	aliasesFormGroup: FormGroup = this.formBuilder.group({
		previousNameFlag: new FormControl(null, [FormControlValidators.required]),
		aliases: this.formBuilder.array([]),
	});

	categoryBodyArmourSalesFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categoryClosedCircuitTelevisionInstallerFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categoryElectronicLockingDeviceInstallerFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categoryLocksmithSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityAlarmInstallerSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityAlarmMonitorFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityAlarmResponseFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityAlarmSalesFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categorySecurityGuardSupFormGroup = this.formBuilder.group({
		isInclude: new FormControl(false),
	});
	categoryArmouredCarGuardFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			expiryDate: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator('expiryDate', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);
	categoryFireInvestigatorFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			fireCourseCertificateAttachments: new FormControl([]),
			fireVerificationLetterAttachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'fireCourseCertificateAttachments',
					(form) => form.get('isInclude')?.value
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'fireVerificationLetterAttachments',
					(form) => form.get('isInclude')?.value
				),
			],
		}
	);
	categoryLocksmithFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);
	categoryPrivateInvestigatorSupFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);
	categoryPrivateInvestigatorFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			trainingCode: new FormControl(''),
			attachments: new FormControl([]),
			trainingAttachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalRequiredValidator('trainingCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'trainingAttachments',
					(form) => form.get('isInclude')?.value
				),
			],
		}
	);
	categorySecurityAlarmInstallerFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);
	categorySecurityConsultantFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
			resumeAttachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'resumeAttachments',
					(form) => form.get('isInclude')?.value
				),
			],
		}
	);
	categorySecurityGuardFormGroup: FormGroup = this.formBuilder.group(
		{
			isInclude: new FormControl(false),
			requirementCode: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator('requirementCode', (form) => form.get('isInclude')?.value),
				FormGroupValidators.conditionalDefaultRequiredValidator('attachments', (form) => form.get('isInclude')?.value),
			],
		}
	);

	restraintsAuthorizationFormGroup: FormGroup = this.formBuilder.group(
		{
			carryAndUseRestraints: new FormControl(''),
			carryAndUseRestraintsDocument: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'carryAndUseRestraints',
					(_form) => this.categorySecurityGuardFormGroup?.get('isInclude')?.value ?? false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'carryAndUseRestraintsDocument',
					(form) => form.get('carryAndUseRestraints')?.value == this.booleanTypeCodes.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('carryAndUseRestraints')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

	dogsAuthorizationFormGroup: FormGroup = this.formBuilder.group(
		{
			useDogs: new FormControl(''),
			dogsPurposeFormGroup: new FormGroup(
				{
					isDogsPurposeProtection: new FormControl(false),
					isDogsPurposeDetectionDrugs: new FormControl(false),
					isDogsPurposeDetectionExplosives: new FormControl(false),
				},
				FormGroupValidators.atLeastOneCheckboxValidator('useDogs', BooleanTypeCode.Yes)
			),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalRequiredValidator(
					'useDogs',
					(_form) => this.categorySecurityGuardFormGroup?.get('isInclude')?.value ?? false
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('useDogs')?.value == this.booleanTypeCodes.Yes
				),
			],
		}
	);

	policeBackgroundFormGroup: FormGroup = this.formBuilder.group(
		{
			isPoliceOrPeaceOfficer: new FormControl('', [FormControlValidators.required]),
			policeOfficerRoleCode: new FormControl(''),
			otherOfficerRole: new FormControl(''),
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'policeOfficerRoleCode',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'otherOfficerRole',
					(form) => form.get('policeOfficerRoleCode')?.value == PoliceOfficerRoleCode.Other
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	mentalHealthConditionsFormGroup: FormGroup = this.formBuilder.group(
		{
			isTreatedForMHC: new FormControl('', [FormControlValidators.required]),
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isTreatedForMHC')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	criminalHistoryFormGroup: FormGroup = this.formBuilder.group({
		hasCriminalHistory: new FormControl('', [FormControlValidators.required]),
	});

	fingerprintProofFormGroup: FormGroup = this.formBuilder.group({
		attachments: new FormControl('', [Validators.required]),
	});

	citizenshipFormGroup: FormGroup = this.formBuilder.group(
		{
			isCanadianCitizen: new FormControl('', [FormControlValidators.required]),
			canadianCitizenProofTypeCode: new FormControl(''),
			notCanadianCitizenProofTypeCode: new FormControl(''),
			expiryDate: new FormControl(''),
			attachments: new FormControl([], [Validators.required]),
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
						form.get('notCanadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.WorkPermit ||
						form.get('notCanadianCitizenProofTypeCode')?.value == LicenceDocumentTypeCode.StudyPermit
				),
			],
		}
	);

	additionalGovIdFormGroup: FormGroup = this.formBuilder.group(
		{
			governmentIssuedPhotoTypeCode: new FormControl(''),
			expiryDate: new FormControl(''),
			attachments: new FormControl([]),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'governmentIssuedPhotoTypeCode',
					(_form) =>
						(this.citizenshipFormGroup.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							this.citizenshipFormGroup.get('canadianCitizenProofTypeCode')?.value !=
								LicenceDocumentTypeCode.CanadianPassport) ||
						(this.citizenshipFormGroup.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							this.citizenshipFormGroup.get('notCanadianCitizenProofTypeCode')?.value !=
								LicenceDocumentTypeCode.PermanentResidentCard)
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(_form) =>
						(this.citizenshipFormGroup.get('isCanadianCitizen')?.value == BooleanTypeCode.Yes &&
							this.citizenshipFormGroup.get('canadianCitizenProofTypeCode')?.value !=
								LicenceDocumentTypeCode.CanadianPassport) ||
						(this.citizenshipFormGroup.get('isCanadianCitizen')?.value == BooleanTypeCode.No &&
							this.citizenshipFormGroup.get('notCanadianCitizenProofTypeCode')?.value !=
								LicenceDocumentTypeCode.PermanentResidentCard)
				),
			],
		}
	);

	bcDriversLicenceFormGroup: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl('', [FormControlValidators.required]),
		bcDriversLicenceNumber: new FormControl(),
	});

	characteristicsFormGroup: FormGroup = this.formBuilder.group({
		hairColourCode: new FormControl('', [FormControlValidators.required]),
		eyeColourCode: new FormControl('', [FormControlValidators.required]),
		height: new FormControl('', [FormControlValidators.required]),
		heightUnitCode: new FormControl('', [FormControlValidators.required]),
		heightInches: new FormControl(''),
		weight: new FormControl('', [FormControlValidators.required]),
		weightUnitCode: new FormControl('', [FormControlValidators.required]),
	});

	photographOfYourselfFormGroup: FormGroup = this.formBuilder.group(
		{
			useBcServicesCardPhoto: new FormControl('', [FormControlValidators.required]),
			attachments: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('useBcServicesCardPhoto')?.value == this.booleanTypeCodes.No
				),
			],
		}
	);

	profileConfirmationFormGroup: FormGroup = this.formBuilder.group({
		isProfileUpToDate: new FormControl('', [Validators.requiredTrue]),
	});

	contactInformationFormGroup: FormGroup = this.formBuilder.group({
		contactEmailAddress: new FormControl('', [Validators.required, FormControlValidators.email]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
	});

	residentialAddressFormGroup: FormGroup = this.formBuilder.group({
		addressSelected: new FormControl(false, [Validators.requiredTrue]),
		addressLine1: new FormControl('', [FormControlValidators.required]),
		addressLine2: new FormControl(''),
		city: new FormControl('', [FormControlValidators.required]),
		postalCode: new FormControl('', [FormControlValidators.required]),
		province: new FormControl('', [FormControlValidators.required]),
		country: new FormControl('', [FormControlValidators.required]),
		isMailingTheSameAsResidential: new FormControl(false),
	});

	mailingAddressFormGroup: FormGroup = this.formBuilder.group(
		{
			addressSelected: new FormControl(false),
			addressLine1: new FormControl(''),
			addressLine2: new FormControl(''),
			city: new FormControl(''),
			postalCode: new FormControl(''),
			province: new FormControl(''),
			country: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredTrueValidator(
					'addressSelected',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'addressLine1',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'city',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'postalCode',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'province',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
				FormGroupValidators.conditionalRequiredValidator(
					'country',
					(_form) => this.residentialAddressFormGroup.get('isMailingTheSameAsResidential')?.value == false
				),
			],
		}
	);

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		agreeToCompleteAndAccurate: new FormControl(null, [Validators.requiredTrue]),
		dateSigned: new FormControl({ value: null, disabled: true }),
		captchaFormGroup: new FormGroup(
			{
				displayCaptcha: new FormControl(false),
				token: new FormControl('', FormControlValidators.required),
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
		protected formBuilder: FormBuilder,
		protected configService: ConfigService,
		protected formatDatePipe: FormatDatePipe
	) {}

	getSaveBodyAnonymous(licenceModelFormValue: any): WorkerLicenceAppAnonymousSubmitRequestJson {
		const savebody = this.getSaveBody(licenceModelFormValue);
		const documentInfos = this.getSaveDocumentInfosAnonymous(licenceModelFormValue);

		// console.debug('[getSaveBodyAnonymous] documentInfos', documentInfos);

		const categoryData = savebody.categoryData ?? [];
		const categoryCodes: Array<WorkerCategoryTypeCode> = categoryData.map(
			(item: WorkerLicenceAppCategoryData) => item.workerCategoryTypeCode!
		);

		const requestBody: WorkerLicenceAppAnonymousSubmitRequestJson = {
			originalApplicationId: savebody.originalApplicationId,
			originalLicenceId: savebody.originalLicenceId,
			workerLicenceTypeCode: savebody.workerLicenceTypeCode,
			applicationTypeCode: savebody.applicationTypeCode,
			businessTypeCode: savebody.businessTypeCode,
			givenName: savebody.givenName,
			middleName1: savebody.middleName1,
			middleName2: savebody.middleName2,
			surname: savebody.surname,
			dateOfBirth: savebody.dateOfBirth,
			genderCode: savebody.genderCode,
			expiredLicenceNumber: savebody.expiredLicenceNumber,
			expiredLicenceId: savebody.expiredLicenceId,
			hasExpiredLicence: savebody.hasExpiredLicence,
			licenceTermCode: savebody.licenceTermCode,
			hasCriminalHistory: savebody.hasCriminalHistory,
			hasPreviousName: savebody.hasPreviousName,
			hasBcDriversLicence: savebody.hasBcDriversLicence,
			bcDriversLicenceNumber: savebody.bcDriversLicenceNumber,
			hairColourCode: savebody.hairColourCode,
			eyeColourCode: savebody.eyeColourCode,
			height: savebody.height,
			heightUnitCode: savebody.heightUnitCode,
			weight: savebody.weight,
			weightUnitCode: savebody.weightUnitCode,
			contactEmailAddress: savebody.contactEmailAddress,
			contactPhoneNumber: savebody.contactPhoneNumber,
			isMailingTheSameAsResidential: savebody.isMailingTheSameAsResidential ?? false,
			isPoliceOrPeaceOfficer: savebody.isPoliceOrPeaceOfficer,
			policeOfficerRoleCode: savebody.policeOfficerRoleCode,
			otherOfficerRole: savebody.otherOfficerRole,
			isTreatedForMHC: savebody.isTreatedForMHC,
			useBcServicesCardPhoto: savebody.useBcServicesCardPhoto,
			carryAndUseRestraints: savebody.carryAndUseRestraints ?? null,
			useDogs: savebody.useDogs ?? null,
			isDogsPurposeProtection: savebody.isDogsPurposeProtection ?? null,
			isDogsPurposeDetectionDrugs: savebody.isDogsPurposeDetectionDrugs ?? null,
			isDogsPurposeDetectionExplosives: savebody.isDogsPurposeDetectionExplosives ?? null,
			isCanadianCitizen: savebody.isCanadianCitizen,
			aliases: savebody.aliases ? [...savebody.aliases] : [],
			residentialAddressData: { ...savebody.residentialAddressData },
			mailingAddressData: { ...savebody.mailingAddressData },
			categoryCodes: categoryCodes,
			documentInfos,
		};
		// console.log('requestBody', requestBody);

		console.log('getSaveBodyAnonymous requestBody', requestBody);
		return requestBody;
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	getSaveBody(licenceModelFormValue: any): any {
		console.debug('[getSaveBody] licenceModelFormGroup', licenceModelFormValue);

		const licenceAppId = licenceModelFormValue.licenceAppId;
		const originalApplicationId = licenceModelFormValue.originalApplicationId;
		const originalLicenceId = licenceModelFormValue.originalLicenceId;
		const workerLicenceTypeData = { ...licenceModelFormValue.workerLicenceTypeData };
		const applicationTypeData = { ...licenceModelFormValue.applicationTypeData };
		const soleProprietorData = { ...licenceModelFormValue.soleProprietorData };
		const bcDriversLicenceData = { ...licenceModelFormValue.bcDriversLicenceData };
		const contactInformationData = { ...licenceModelFormValue.contactInformationData };
		const expiredLicenceData = { ...licenceModelFormValue.expiredLicenceData };
		const characteristicsData = { ...licenceModelFormValue.characteristicsData };
		const residentialAddressData = { ...licenceModelFormValue.residentialAddressData };
		const mailingAddressData = { ...licenceModelFormValue.mailingAddressData };
		const citizenshipData = { ...licenceModelFormValue.citizenshipData };
		const additionalGovIdData = { ...licenceModelFormValue.additionalGovIdData };
		const policeBackgroundData = { ...licenceModelFormValue.policeBackgroundData };
		const fingerprintProofData = { ...licenceModelFormValue.fingerprintProofData };
		const mentalHealthConditionsData = { ...licenceModelFormValue.mentalHealthConditionsData };
		const photographOfYourselfData = { ...licenceModelFormValue.photographOfYourselfData };

		let dogsAuthorizationData = {};
		let restraintsAuthorizationData = {};

		const personalInformationData = { ...licenceModelFormValue.personalInformationData };
		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		const categoryData: Array<WorkerLicenceAppCategoryData> = [];
		if (licenceModelFormValue.categoryArmouredCarGuardFormGroup.isInclude) {
			categoryData.push(this.getCategoryArmouredCarGuard(licenceModelFormValue.categoryArmouredCarGuardFormGroup));
		}

		if (licenceModelFormValue.categoryBodyArmourSalesFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.BodyArmourSales,
			});
		}

		if (licenceModelFormValue.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
			});
		}

		if (licenceModelFormValue.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
			});
		}

		if (licenceModelFormValue.categoryFireInvestigatorFormGroup.isInclude) {
			categoryData.push(this.getCategoryFireInvestigator(licenceModelFormValue.categoryFireInvestigatorFormGroup));
		}

		if (licenceModelFormValue.categoryLocksmithFormGroup.isInclude) {
			categoryData.push(this.getCategoryLocksmith(licenceModelFormValue.categoryLocksmithFormGroup));
		}

		if (licenceModelFormValue.categoryLocksmithSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.LocksmithUnderSupervision,
			});
		}

		if (licenceModelFormValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			categoryData.push(
				this.getCategoryPrivateInvestigator(licenceModelFormValue.categoryPrivateInvestigatorFormGroup)
			);
		}

		if (licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			categoryData.push(
				this.getCategoryPrivateInvestigatorSup(licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup)
			);
		}

		if (licenceModelFormValue.categorySecurityGuardFormGroup.isInclude) {
			const dogsPurposeFormGroup = licenceModelFormValue.dogsAuthorizationData.dogsPurposeFormGroup;
			const isDetectionDrugs = dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false;
			const isDetectionExplosives = dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ?? false;
			const isProtection = dogsPurposeFormGroup.isDogsPurposeProtection ?? false;
			dogsAuthorizationData = {
				useDogs: this.booleanTypeToBoolean(licenceModelFormValue.dogsAuthorizationData.useDogs),
				isDogsPurposeDetectionDrugs: licenceModelFormValue.dogsAuthorizationData.useDogs ? isDetectionDrugs : null,
				isDogsPurposeDetectionExplosives: licenceModelFormValue.dogsAuthorizationData.useDogs
					? isDetectionExplosives
					: null,
				isDogsPurposeProtection: licenceModelFormValue.dogsAuthorizationData.useDogs ? isProtection : null,
			};
			restraintsAuthorizationData = {
				carryAndUseRestraints: this.booleanTypeToBoolean(
					licenceModelFormValue.restraintsAuthorizationData.carryAndUseRestraints
				),
			};
			categoryData.push(
				this.getCategorySecurityGuard(
					licenceModelFormValue.categorySecurityGuardFormGroup,
					licenceModelFormValue.dogsAuthorizationData,
					licenceModelFormValue.restraintsAuthorizationData
				)
			);
		}
		if (licenceModelFormValue.categorySecurityGuardSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
			});
		}

		if (licenceModelFormValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			categoryData.push(
				this.getCategorySecurityAlarmInstaller(licenceModelFormValue.categorySecurityAlarmInstallerFormGroup)
			);
		}

		if (licenceModelFormValue.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
			});
		}

		if (licenceModelFormValue.categorySecurityAlarmMonitorFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmMonitor,
			});
		}

		if (licenceModelFormValue.categorySecurityAlarmResponseFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmResponse,
			});
		}

		if (licenceModelFormValue.categorySecurityAlarmSalesFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmSales,
			});
		}

		if (licenceModelFormValue.categorySecurityConsultantFormGroup.isInclude) {
			categoryData.push(
				this.getCategorySecurityConsultantInstaller(licenceModelFormValue.categorySecurityConsultantFormGroup)
			);
		}
		let policeOfficerDocument: PoliceOfficerDocument | null = null;
		if (policeBackgroundData.attachments) {
			const policeOfficerDocuments: Array<LicenceAppDocumentResponse> = [];
			policeBackgroundData.attachments.forEach((doc: any) => {
				policeOfficerDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			policeOfficerDocument = {
				documentResponses: policeOfficerDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			};
		}

		let mentalHealthDocument: MentalHealthDocument | null = null;
		if (mentalHealthConditionsData.attachments) {
			const mentalHealthDocuments: Array<LicenceAppDocumentResponse> = [];
			mentalHealthConditionsData.attachments.forEach((doc: any) => {
				mentalHealthDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			mentalHealthDocument = {
				documentResponses: mentalHealthDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition,
			};
		}

		let fingerprintProofDocument: FingerprintProofDocument | null = null;
		if (fingerprintProofData.attachments) {
			const fingerprintProofDocuments: Array<LicenceAppDocumentResponse> = [];
			fingerprintProofData.attachments.forEach((doc: any) => {
				fingerprintProofDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			fingerprintProofDocument = {
				documentResponses: fingerprintProofDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
			};
		}

		let citizenshipDocument: CitizenshipDocument | null = null;
		if (citizenshipData.attachments) {
			const citizenshipDocuments: Array<LicenceAppDocumentResponse> = [];
			citizenshipData.attachments.forEach((doc: any) => {
				citizenshipDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			citizenshipDocument = {
				documentResponses: citizenshipDocuments,
				expiryDate: citizenshipData.expiryDate
					? this.formatDatePipe.transform(citizenshipData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
					: null,
				licenceDocumentTypeCode:
					citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
						? citizenshipData.canadianCitizenProofTypeCode
						: citizenshipData.notCanadianCitizenProofTypeCode,
			};
		}

		let additionalGovIdDocument: AdditionalGovIdDocument | null = null;
		const isIncludeAdditionalGovermentIdStepData = this.includeAdditionalGovermentIdStepData(
			citizenshipData.isCanadianCitizen,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.notCanadianCitizenProofTypeCode
		);

		if (isIncludeAdditionalGovermentIdStepData && additionalGovIdData.attachments) {
			const additionalGovIdDocuments: Array<LicenceAppDocumentResponse> = [];
			additionalGovIdData.attachments.forEach((doc: any) => {
				additionalGovIdDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			additionalGovIdDocument = {
				documentResponses: additionalGovIdDocuments,
				expiryDate: additionalGovIdData.expiryDate
					? this.formatDatePipe.transform(additionalGovIdData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
					: null,
				licenceDocumentTypeCode: additionalGovIdData.governmentIssuedPhotoTypeCode,
			};
		} else {
			this.additionalGovIdFormGroup.reset();
		}

		let idPhotoDocument: IdPhotoDocument | null = null;
		if (photographOfYourselfData.attachments) {
			const photographOfYourselfDocuments: Array<LicenceAppDocumentResponse> = [];
			photographOfYourselfData.attachments.forEach((doc: any) => {
				photographOfYourselfDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			idPhotoDocument = {
				documentResponses: photographOfYourselfDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
			};
		}

		if (characteristicsData.heightUnitCode == HeightUnitCode.Inches) {
			const ft: number = +characteristicsData.height;
			const inch: number = +characteristicsData.heightInches;
			characteristicsData.height = String(ft * 12 + inch);
		}

		const expiredLicenceExpiryDate = expiredLicenceData.expiryDate
			? this.formatDatePipe.transform(expiredLicenceData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
			: null;

		// | WorkerLicenceAppUpsertRequest | WorkerLicenceAppSubmitRequest | WorkerLicenceAppAnonymousSubmitRequestJson
		const body = {
			licenceAppId,
			originalApplicationId,
			originalLicenceId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			//-----------------------------------
			businessTypeCode:
				soleProprietorData.isSoleProprietor === BooleanTypeCode.No
					? BusinessTypeCode.None
					: soleProprietorData.businessTypeCode,
			//-----------------------------------
			hasPreviousName: this.booleanTypeToBoolean(licenceModelFormValue.aliasesData.previousNameFlag),
			aliases:
				licenceModelFormValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes
					? licenceModelFormValue.aliasesData.aliases
					: [],
			//-----------------------------------
			hasBcDriversLicence: this.booleanTypeToBoolean(bcDriversLicenceData.hasBcDriversLicence),
			bcDriversLicenceNumber:
				bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
					? bcDriversLicenceData.bcDriversLicenceNumber
					: null,
			//-----------------------------------
			...contactInformationData,
			//-----------------------------------
			hasExpiredLicence: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes,
			expiredLicenceNumber:
				expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceNumber : null,
			expiredLicenceId:
				expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceId : null,
			expiryDate: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceExpiryDate : null,
			//-----------------------------------
			...characteristicsData,
			//-----------------------------------
			...personalInformationData,
			//-----------------------------------
			hasCriminalHistory: this.booleanTypeToBoolean(licenceModelFormValue.criminalHistoryData.hasCriminalHistory),
			//-----------------------------------
			licenceTermCode: licenceModelFormValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			isMailingTheSameAsResidential: residentialAddressData.isMailingTheSameAsResidential,
			mailingAddressData: residentialAddressData.isMailingTheSameAsResidential
				? residentialAddressData
				: mailingAddressData,
			residentialAddressData,
			//-----------------------------------
			isCanadianCitizen: this.booleanTypeToBoolean(citizenshipData.isCanadianCitizen),
			citizenshipDocument,
			additionalGovIdDocument,
			//-----------------------------------
			fingerprintProofDocument,
			//-----------------------------------
			useBcServicesCardPhoto: this.booleanTypeToBoolean(photographOfYourselfData.useBcServicesCardPhoto),
			idPhotoDocument,
			//-----------------------------------
			isTreatedForMHC: this.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC),
			mentalHealthDocument,
			//-----------------------------------
			isPoliceOrPeaceOfficer: this.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer),
			policeOfficerRoleCode: policeBackgroundData.policeOfficerRoleCode,
			otherOfficerRole: policeBackgroundData.otherOfficerRole,
			policeOfficerDocument,
			//-----------------------------------
			categoryData,
			...dogsAuthorizationData,
			...restraintsAuthorizationData,
		};
		console.debug('getSaveBody body returned', body);
		return body;
	}

	getDocsToSaveAnonymous(licenceModelFormValue: any): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];
		// const formValue = this.licenceModelFormGroup.getRawValue();//licenceModelFormValue

		const citizenshipData = { ...licenceModelFormValue.citizenshipData };
		const additionalGovIdData = { ...licenceModelFormValue.additionalGovIdData };
		const policeBackgroundData = { ...licenceModelFormValue.policeBackgroundData };
		const fingerprintProofData = { ...licenceModelFormValue.fingerprintProofData };
		const mentalHealthConditionsData = { ...licenceModelFormValue.mentalHealthConditionsData };
		const photographOfYourselfData = { ...licenceModelFormValue.photographOfYourselfData };

		console.debug('xxxxxxxxxxxxxxxxxxxx getDocsToSaveAnonymous fingerprintProofData', fingerprintProofData);

		if (licenceModelFormValue.categoryArmouredCarGuardFormGroup.isInclude) {
			const docs: Array<Blob> = [];
			licenceModelFormValue.categoryArmouredCarGuardFormGroup.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
				documents: docs,
			});
		}

		if (licenceModelFormValue.categoryFireInvestigatorFormGroup.isInclude) {
			if (licenceModelFormValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments.forEach(
					(doc: SpdFile) => {
						docs.push(doc);
					}
				);
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
					documents: docs,
				});
			}

			if (licenceModelFormValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments.forEach(
					(doc: SpdFile) => {
						docs.push(doc);
					}
				);
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categoryLocksmithFormGroup.isInclude) {
			if (licenceModelFormValue.categoryLocksmithFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryLocksmithFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categoryLocksmithFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			if (licenceModelFormValue.categoryPrivateInvestigatorFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryPrivateInvestigatorFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categoryPrivateInvestigatorFormGroup.requirementCode,
					documents: docs,
				});
			}
			if (licenceModelFormValue.categoryPrivateInvestigatorFormGroup.trainingAttachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryPrivateInvestigatorFormGroup.trainingAttachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categoryPrivateInvestigatorFormGroup.trainingCode,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			if (licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categoryPrivateInvestigatorSupFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categorySecurityGuardFormGroup.isInclude) {
			if (licenceModelFormValue.categorySecurityGuardFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categorySecurityGuardFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categorySecurityGuardFormGroup.requirementCode,
					documents: docs,
				});
			}

			if (this.booleanTypeToBoolean(licenceModelFormValue.dogsAuthorizationData.useDogs)) {
				if (licenceModelFormValue.dogsAuthorizationData.attachments) {
					const docs: Array<Blob> = [];
					licenceModelFormValue.dogsAuthorizationData.attachments.forEach((doc: SpdFile) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate,
						documents: docs,
					});
				}
			}

			if (this.booleanTypeToBoolean(licenceModelFormValue.restraintsAuthorizationData.carryAndUseRestraints)) {
				if (licenceModelFormValue.restraintsAuthorizationData.attachments) {
					const docs: Array<Blob> = [];
					licenceModelFormValue.restraintsAuthorizationData.attachments.forEach((doc: SpdFile) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: licenceModelFormValue.restraintsAuthorizationData.carryAndUseRestraintsDocument,
						documents: docs,
					});
				}
			}
		}

		if (licenceModelFormValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			if (licenceModelFormValue.categorySecurityAlarmInstallerData.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categorySecurityAlarmInstallerData.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categorySecurityAlarmInstallerData.requirementCode,
					documents: docs,
				});
			}
		}

		if (licenceModelFormValue.categorySecurityConsultantFormGroup.isInclude) {
			if (licenceModelFormValue.categorySecurityConsultantFormGroup.attachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categorySecurityConsultantFormGroup.attachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: licenceModelFormValue.categorySecurityConsultantFormGroup.requirementCode,
					documents: docs,
				});
			}
			if (licenceModelFormValue.categorySecurityConsultantFormGroup.resumeAttachments) {
				const docs: Array<Blob> = [];
				licenceModelFormValue.categorySecurityConsultantFormGroup.resumeAttachments.forEach((doc: SpdFile) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityConsultantResume,
					documents: docs,
				});
			}
		}

		if (policeBackgroundData.attachments) {
			const docs: Array<Blob> = [];
			policeBackgroundData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				documents: docs,
			});
		}

		if (mentalHealthConditionsData.attachments) {
			const docs: Array<Blob> = [];
			mentalHealthConditionsData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition, documents: docs });
		}

		if (fingerprintProofData.attachments) {
			const docs: Array<Blob> = [];
			fingerprintProofData.attachments.forEach((doc: SpdFile) => {
				console.debug('xxxxxxxxxxxxxxxxxxxx doc', doc);
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint, documents: docs });
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

		const isIncludeAdditionalGovermentIdStepData = this.includeAdditionalGovermentIdStepData(
			citizenshipData.isCanadianCitizen,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.notCanadianCitizenProofTypeCode
		);

		if (isIncludeAdditionalGovermentIdStepData && additionalGovIdData.attachments) {
			const docs: Array<Blob> = [];
			additionalGovIdData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: additionalGovIdData.governmentIssuedPhotoTypeCode, documents: docs });
		}

		if (photographOfYourselfData.attachments) {
			const docs: Array<Blob> = [];
			photographOfYourselfData.attachments.forEach((doc: SpdFile) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
		}

		return documents;
	}

	/**
	 * Get the valid list of categories based upon the current selections
	 * @param categoryList
	 * @returns
	 */
	getValidCategoryList(categoryList: string[]): SelectOptions<string>[] {
		const invalidCategories = this.configService.configs?.invalidWorkerLicenceCategoryMatrixConfiguration ?? {};
		let updatedList = [...WorkerCategoryTypes];

		categoryList.forEach((item) => {
			updatedList = updatedList.filter((cat) => !invalidCategories[item].includes(cat.code as WorkerCategoryTypeCode));
		});

		return [...updatedList];
	}

	/**
	 * Get the category data formatted for saving
	 * @param armouredCarGuardData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategoryArmouredCarGuard(armouredCarGuardData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (armouredCarGuardData.attachments) {
			const categoryArmouredCarGuardDocuments: Array<LicenceAppDocumentResponse> = [];
			armouredCarGuardData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				categoryArmouredCarGuardDocuments.push(licenceAppDocumentResponse);
			});

			const expiryDate = armouredCarGuardData.expiryDate
				? this.formatDatePipe.transform(armouredCarGuardData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
				: null;

			documents.push({
				documentResponses: categoryArmouredCarGuardDocuments,
				expiryDate,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
			});
		}
		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.ArmouredCarGuard,
			documents: documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param fireInvestigatorData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategoryFireInvestigator(fireInvestigatorData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (fireInvestigatorData.fireCourseCertificateAttachments) {
			const fireCourseCertificateDocuments: Array<LicenceAppDocumentResponse> = [];
			fireInvestigatorData.fireCourseCertificateAttachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				fireCourseCertificateDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: fireCourseCertificateDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
			});
		}
		if (fireInvestigatorData.fireVerificationLetterAttachments) {
			const fireVerificationLetterDocuments: Array<LicenceAppDocumentResponse> = [];
			fireInvestigatorData.fireVerificationLetterAttachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				fireVerificationLetterDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: fireVerificationLetterDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.FireInvestigator,
			documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param locksmithData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategoryLocksmith(locksmithData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (locksmithData.attachments) {
			const categoryLocksmithDocuments: Array<LicenceAppDocumentResponse> = [];
			locksmithData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				categoryLocksmithDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: categoryLocksmithDocuments,
				licenceDocumentTypeCode: locksmithData.requirementCode,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.Locksmith,
			documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param privateInvestigatorData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategoryPrivateInvestigator(privateInvestigatorData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (privateInvestigatorData.attachments) {
			const privateInvestigatorDocuments: Array<LicenceAppDocumentResponse> = [];
			privateInvestigatorData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				privateInvestigatorDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: privateInvestigatorDocuments,
				licenceDocumentTypeCode: privateInvestigatorData.requirementCode,
			});
		}
		if (privateInvestigatorData.trainingAttachments) {
			const privateInvestigatorTrainingDocuments: Array<LicenceAppDocumentResponse> = [];
			privateInvestigatorData.trainingAttachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				privateInvestigatorTrainingDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: privateInvestigatorTrainingDocuments,
				licenceDocumentTypeCode: privateInvestigatorData.trainingCode,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigator,
			documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param privateInvestigatorSupData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategoryPrivateInvestigatorSup(privateInvestigatorSupData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (privateInvestigatorSupData.attachments) {
			const privateInvestigatorSupDocuments: Array<LicenceAppDocumentResponse> = [];
			privateInvestigatorSupData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				privateInvestigatorSupDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: privateInvestigatorSupDocuments,
				licenceDocumentTypeCode: privateInvestigatorSupData.requirementCode,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
			documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityGuardData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategorySecurityGuard(
		categorySecurityGuardData: any,
		dogsAuthorizationData: any,
		restraintsAuthorizationData: any
	): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];
		if (categorySecurityGuardData.attachments) {
			const categorySecurityGuardDocuments: Array<LicenceAppDocumentResponse> = [];

			categorySecurityGuardData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				categorySecurityGuardDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: categorySecurityGuardDocuments,
				licenceDocumentTypeCode: categorySecurityGuardData.requirementCode,
			});
		}

		if (this.booleanTypeToBoolean(dogsAuthorizationData.useDogs)) {
			if (dogsAuthorizationData.attachments) {
				const categorySecurityGuardDogDocuments: Array<LicenceAppDocumentResponse> = [];
				dogsAuthorizationData.attachments.forEach((doc: any) => {
					const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
						documentUrlId: doc.documentUrlId,
					};
					categorySecurityGuardDogDocuments.push(licenceAppDocumentResponse);
				});

				documents.push({
					documentResponses: categorySecurityGuardDogDocuments,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate,
				});
			}
		}

		if (this.booleanTypeToBoolean(restraintsAuthorizationData.carryAndUseRestraints)) {
			if (restraintsAuthorizationData.attachments) {
				const categorySecurityGuardRestraintDocuments: Array<LicenceAppDocumentResponse> = [];
				restraintsAuthorizationData.attachments.forEach((doc: any) => {
					const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
						documentUrlId: doc.documentUrlId,
					};
					categorySecurityGuardRestraintDocuments.push(licenceAppDocumentResponse);
				});

				documents.push({
					documentResponses: categorySecurityGuardRestraintDocuments,
					licenceDocumentTypeCode: restraintsAuthorizationData.carryAndUseRestraintsDocument,
				});
			}
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuard,
			documents: documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityAlarmInstallerData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategorySecurityAlarmInstaller(categorySecurityAlarmInstallerData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (categorySecurityAlarmInstallerData.attachments) {
			const categorySecurityAlarmInstallerDocuments: Array<LicenceAppDocumentResponse> = [];

			categorySecurityAlarmInstallerData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				categorySecurityAlarmInstallerDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: categorySecurityAlarmInstallerDocuments,
				licenceDocumentTypeCode: categorySecurityAlarmInstallerData.requirementCode,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstaller,
			documents: documents,
		};
	}

	/**
	 * Get the category data formatted for saving
	 * @param categorySecurityConsultantData
	 * @returns WorkerLicenceAppCategoryData
	 */
	getCategorySecurityConsultantInstaller(categorySecurityConsultantData: any): WorkerLicenceAppCategoryData {
		const documents: Array<Document> = [];

		if (categorySecurityConsultantData.attachments) {
			const securityConsultantDocuments: Array<LicenceAppDocumentResponse> = [];
			categorySecurityConsultantData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				securityConsultantDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: securityConsultantDocuments,
				licenceDocumentTypeCode: categorySecurityConsultantData.requirementCode,
			});
		}
		if (categorySecurityConsultantData.resumeAttachments) {
			const securityConsultantResumeDocuments: Array<LicenceAppDocumentResponse> = [];
			categorySecurityConsultantData.resumeAttachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				securityConsultantResumeDocuments.push(licenceAppDocumentResponse);
			});

			documents.push({
				documentResponses: securityConsultantResumeDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityConsultantResume,
			});
		}

		return {
			workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityConsultant,
			documents,
		};
	}

	/**
	 * Convert BooleanTypeCode to boolean
	 * @param value
	 * @returns
	 */
	booleanTypeToBoolean(value: BooleanTypeCode | null): boolean | null {
		if (!value) return null;

		if (value == BooleanTypeCode.Yes) return true;
		return false;
	}

	/**
	 * Convert boolean to BooleanTypeCode
	 * @param value
	 * @returns
	 */
	public booleanToBooleanType(value: boolean | null | undefined): BooleanTypeCode | null {
		const isBooleanType = typeof value === 'boolean';
		if (!isBooleanType) return null;

		return value ? BooleanTypeCode.Yes : BooleanTypeCode.No;
	}

	private getSaveDocumentInfosAnonymous(licenceModelFormValue: any): Array<DocumentBase> {
		const documents: Array<DocumentBase> = [];
		const savebody = this.getSaveBody(licenceModelFormValue);

		savebody.categoryData?.forEach((item: WorkerLicenceAppCategoryData) => {
			item.documents?.forEach((doc: Document) => {
				if (doc.expiryDate) {
					documents.push({ licenceDocumentTypeCode: doc.licenceDocumentTypeCode!, expiryDate: doc.expiryDate });
				}
			});
		});

		if (savebody.citizenshipDocument?.expiryDate) {
			documents.push({
				licenceDocumentTypeCode: savebody.citizenshipDocument.licenceDocumentTypeCode,
				expiryDate: savebody.citizenshipDocument.expiryDate,
			});
		}

		if (savebody.additionalGovIdDocument?.expiryDate) {
			documents.push({
				licenceDocumentTypeCode: savebody.additionalGovIdDocument.licenceDocumentTypeCode,
				expiryDate: savebody.additionalGovIdDocument.expiryDate,
			});
		}

		console.debug('submitLicenceAnonymous documentInfos', documents);
		return documents;
	}

	includeAdditionalGovermentIdStepData(
		isCanadianCitizen: BooleanTypeCode,
		canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null,
		notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null
	): boolean {
		return (
			(isCanadianCitizen == BooleanTypeCode.Yes &&
				canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			(isCanadianCitizen == BooleanTypeCode.No &&
				notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard)
		);
	}
}
