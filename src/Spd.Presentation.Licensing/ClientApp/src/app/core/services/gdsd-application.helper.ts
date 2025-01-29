import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GdsdTeamLicenceAppAnonymousSubmitRequest } from '@app/api/models';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { SPD_CONSTANTS } from '../constants/constants';
import { FormControlValidators } from '../validators/form-control.validators';
import { CommonApplicationHelper } from './common-application.helper';

export abstract class GdsdApplicationHelper extends CommonApplicationHelper {
	gdsdPersonalInformationFormGroup: FormGroup = this.formBuilder.group(
		{
			givenName: new FormControl(''),
			middleName: new FormControl(''),
			surname: new FormControl('', [FormControlValidators.required]),
			dateOfBirth: new FormControl('', [Validators.required]),
			contactPhoneNumber: new FormControl('', [Validators.required]),
			contactEmailAddress: new FormControl(''),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => !!form.get('hasLegalNameChanged')?.value
				),
			],
		}
	);

	governmentPhotoIdFormGroup: FormGroup = this.formBuilder.group({
		photoTypeCode: new FormControl('', [Validators.required]),
		expiryDate: new FormControl(''),
		attachments: new FormControl([], [Validators.required]),
	});

	dogTrainingInformationFormGroup: FormGroup = this.formBuilder.group({
		isDogTrainedByAccreditedSchool: new FormControl('', [Validators.required]),
		isGuideDog: new FormControl('', [Validators.required]),
	});

	dogInformationFormGroup: FormGroup = this.formBuilder.group({
		dogName: new FormControl('', [Validators.required]),
		dogDateOfBirth: new FormControl('', [Validators.required]),
		dogBreed: new FormControl('', [Validators.required]),
		dogColorAndMarkings: new FormControl('', [Validators.required]),
		dogGender: new FormControl('', [Validators.required]),
		microchipNumber: new FormControl(''),
		serviceDogTasks: new FormControl('', [Validators.required]),
	});

	dogMedicalFormGroup: FormGroup = this.formBuilder.group({
		areInoculationsUpToDate: new FormControl('', [Validators.required]),
		spayOrNeuterAttachments: new FormControl([], [Validators.required]),
		attachments: new FormControl([], [Validators.required]),
	});

	accreditedGraduationFormGroup: FormGroup = this.formBuilder.group({
		accreditedSchoolName: new FormControl('', [Validators.required]),
		schoolContactGivenName: new FormControl(''),
		schoolContactSurname: new FormControl('', [FormControlValidators.required]),
		schoolContactPhoneNumber: new FormControl('', [Validators.required]),
		schoolContactEmailAddress: new FormControl('', [Validators.required]),
		attachments: new FormControl([], [Validators.required]),
	});

	trainingHistoryFormGroup: FormGroup = this.formBuilder.group({
		hasAttendedTrainingSchool: new FormControl('', [Validators.required]),
		trainingSchoolContactInfos: this.formBuilder.array([]),
		otherTrainings: this.formBuilder.array([]),
	});

	trainingSchoolFormGroup: FormGroup = this.formBuilder.group({
		trainingBizName: new FormControl(null, [FormControlValidators.required]),
		contactGivenName: new FormControl(''),
		contactSurname: new FormControl('', [FormControlValidators.required]),
		contactPhoneNumber: new FormControl('', [Validators.required]),
		contactEmailAddress: new FormControl(''),
		trainingDateFrom: new FormControl(''),
		trainingDateTo: new FormControl(''),
		nameOfTrainingProgram: new FormControl(''),
		hoursOfTraining: new FormControl(''),
		learnedDesc: new FormControl(''),
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

	otherTrainingFormGroup: FormGroup = this.formBuilder.group({
		trainingDetail: new FormControl(null, [FormControlValidators.required]),
		usePersonalDogTrainer: new FormControl(''),
		dogTrainerCredential: new FormControl(''),
		trainingTime: new FormControl('', [FormControlValidators.required]),
		trainerGivenName: new FormControl(''),
		trainerSurname: new FormControl('', [FormControlValidators.required]),
		trainerPhoneNumber: new FormControl('', [Validators.required]),
		trainerEmailAddress: new FormControl(''),
		hoursPracticingSkill: new FormControl(''),
		attachments: new FormControl([], [Validators.required]),
	});

	consentAndDeclarationFormGroup: FormGroup = this.formBuilder.group({
		check1: new FormControl(null, [Validators.requiredTrue]),
		applicantOrLegalGuardianName: new FormControl('', [Validators.required]),
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

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	getSaveBodyBase(gdsdModelFormValue: any): GdsdTeamLicenceAppAnonymousSubmitRequest {
		const mailingAddressData = gdsdModelFormValue.mailingAddressData;
		// const photographOfYourselfData = gdsdModelFormValue.photographOfYourselfData;
		const personalInformationData = gdsdModelFormValue.personalInformationData;
		const dogTrainingInformationData = gdsdModelFormValue.dogTrainingInformationData;
		const dogInformationData = gdsdModelFormValue.dogInformationData;
		const accreditedGraduationData = gdsdModelFormValue.accreditedGraduationData;

		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		dogInformationData.dogDateOfBirth = this.formatDatePipe.transform(
			dogInformationData.dogDateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		const dogInfoNewAccreditedSchoolData = {
			dogBreed: dogInformationData.dogBreed,
			dogColorAndMarkings: dogInformationData.dogColorAndMarkings,
			dogDateOfBirth: dogInformationData.dogDateOfBirth,
			dogGender: dogInformationData.dogGender,
			dogName: dogInformationData.dogName,
			isGuideDog: this.utilService.booleanTypeToBoolean(dogTrainingInformationData.isGuideDog),
			microchipNumber: dogInformationData.microchipNumber,
			serviceDogTasks: dogInformationData.serviceDogTasks,
		};

		const graduationInfoData = {
			accreditedSchoolName: accreditedGraduationData.accreditedSchoolName,
			schoolContactEmailAddress: accreditedGraduationData.schoolContactEmailAddress,
			schoolContactGivenName: accreditedGraduationData.schoolContactGivenName,
			schoolContactPhoneNumber: accreditedGraduationData.schoolContactPhoneNumber,
			schoolContactSurname: accreditedGraduationData.schoolContactSurname,
		};

		const body = {
			applicationOriginTypeCode: gdsdModelFormValue.applicationOriginTypeCode,
			applicationTypeCode: gdsdModelFormValue.applicationTypeCode,
			bizTypeCode: gdsdModelFormValue.bizTypeCode,
			serviceTypeCode: gdsdModelFormValue.serviceTypeCode,
			licenceTermCode: gdsdModelFormValue.licenceTermCode,
			...personalInformationData,
			documentKeyCodes: [],
			dogInfoNewAccreditedSchool: dogInfoNewAccreditedSchoolData,
			dogInfoNewWithoutAccreditedSchool: null,
			dogInfoRenew: null,
			isDogTrainedByAccreditedSchool: this.utilService.booleanTypeToBoolean(
				dogTrainingInformationData.isDogTrainedByAccreditedSchool
			),
			graduationInfo: graduationInfoData,
			mailingAddress: mailingAddressData,
			trainingInfo: null,
		};

		console.debug('[getSaveBodyBase] body returned', body);
		return body;
	}
}
