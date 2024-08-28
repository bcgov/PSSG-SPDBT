import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ControllingMemberCrcAppSubmitRequest, LicenceDocumentTypeCode } from '@app/api/models';
import { ApplicationHelper } from '@app/core/services/application.helper';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
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

	getSaveBodyBaseAnonymous(controllingMemberCrcFormValue: any): ControllingMemberCrcAppSubmitRequest {
		const baseData = this.getSaveBodyBase(controllingMemberCrcFormValue, false);
		console.debug('[getSaveBodyBaseAnonymous] baseData', baseData);

		return baseData;
	}

	private getSaveBodyBase(
		controllingMemberCrcFormValue: any,
		_isAuthenticated: boolean
	): ControllingMemberCrcAppSubmitRequest {
		const bcDriversLicenceData = { ...controllingMemberCrcFormValue.bcDriversLicenceData };
		const residentialAddressData = { ...controllingMemberCrcFormValue.residentialAddressData };
		const citizenshipData = { ...controllingMemberCrcFormValue.citizenshipData };
		const policeBackgroundData = { ...controllingMemberCrcFormValue.policeBackgroundData };
		const mentalHealthConditionsData = { ...controllingMemberCrcFormValue.mentalHealthConditionsData };
		const personalInformationData = {
			...controllingMemberCrcFormValue.personalInformationData,
		};
		const bcSecurityLicenceHistoryData = controllingMemberCrcFormValue.bcSecurityLicenceHistoryData;

		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		const hasBcDriversLicence = this.utilService.booleanTypeToBoolean(bcDriversLicenceData.hasBcDriversLicence);
		const hasBankruptcyHistory = this.utilService.booleanTypeToBoolean(
			bcSecurityLicenceHistoryData.hasBankruptcyHistory
		);
		const hasCriminalHistory = this.utilService.booleanTypeToBoolean(bcSecurityLicenceHistoryData.hasCriminalHistory);

		const body = {
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
			//-----------------------------------
			isPoliceOrPeaceOfficer: this.utilService.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer),
			policeOfficerRoleCode: policeBackgroundData.policeOfficerRoleCode,
			otherOfficerRole: policeBackgroundData.otherOfficerRole,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}

	getDocsToSaveBlobs(
		body: ControllingMemberCrcAppSubmitRequest,
		controllingMembersModelFormValue: any
	): Array<LicenceDocumentsToSave> {
		const documents: Array<LicenceDocumentsToSave> = [];

		const citizenshipData = { ...controllingMembersModelFormValue.citizenshipData };
		const fingerprintProofData = { ...controllingMembersModelFormValue.fingerprintProofData };
		const policeBackgroundData = { ...controllingMembersModelFormValue.policeBackgroundData };
		const mentalHealthConditionsData = { ...controllingMembersModelFormValue.mentalHealthConditionsData };

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
}
