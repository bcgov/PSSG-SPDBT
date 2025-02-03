import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	BizTypeCode,
	GdsdAppCommandResponse,
	GdsdTeamLicenceAppAnonymousSubmitRequest,
	GoogleRecaptcha,
	IActionResult,
	LicenceTermCode,
	ServiceTypeCode,
} from '@app/api/models';
import { GdsdLicensingService, LicenceAppDocumentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	debounceTime,
	distinctUntilChanged,
	of,
	switchMap,
	take,
	tap,
} from 'rxjs';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { FormControlValidators } from '../validators/form-control.validators';
import { FormGroupValidators } from '../validators/form-group.validators';
import { CommonApplicationService } from './common-application.service';
import { ConfigService } from './config.service';
import { FileUtilService } from './file-util.service';
import { GdsdApplicationHelper } from './gdsd-application.helper';
import { UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class GdsdApplicationService extends GdsdApplicationHelper {
	gdsdModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	gdsdModelFormGroup: FormGroup = this.formBuilder.group({
		// licenceAppId: new FormControl(),
		// applicantId: new FormControl(), // when authenticated, the applicant id
		// caseNumber: new FormControl(), // placeholder to save info for display purposes
		applicationOriginTypeCode: new FormControl(), // placeholder to save
		applicationTypeCode: new FormControl(), // placeholder to save
		bizTypeCode: new FormControl(), // placeholder to save
		serviceTypeCode: new FormControl(), // placeholder to save
		licenceTermCode: new FormControl(), // placeholder to save

		termsAndConditionsData: this.termsAndConditionsFormGroup,
		personalInformationData: this.gdsdPersonalInformationFormGroup,
		medicalInformationData: this.medicalInformationFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		dogCertificationSelectionData: this.dogCertificationSelectionFormGroup,
		dogInformationData: this.dogInformationFormGroup,
		dogMedicalData: this.dogMedicalFormGroup,
		accreditedGraduationData: this.accreditedGraduationFormGroup,
		trainingHistoryData: this.trainingHistoryFormGroup,
		schoolTrainingHistoryData: this.schoolTrainingHistoryFormGroup,
		otherTrainingHistoryData: this.otherTrainingHistoryFormGroup,
	});

	gdsdModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private gdsdLicensingService: GdsdLicensingService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.gdsdModelChangedSubscription = this.gdsdModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				// if (this.initialized) {
				const step1Complete = this.isStepSelectionComplete();
				const step2Complete = this.isStepPersonalInformationComplete();
				const step3Complete = this.isStepDogInformationComplete();
				const step4Complete = this.isStepTrainingInformationComplete();
				const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

				console.debug(
					'gdsdModelFormGroup CHANGED',
					// 	step1Complete,
					// 	step2Complete,
					// 	step3Complete,
					this.gdsdModelFormGroup.getRawValue()
				);
				this.updateModelChangeFlags();
				this.gdsdModelValueChanges$.next(isValid);
				// }
			});
	}

	/**
	 * Determine if the step data should be saved. If the data has changed and category data exists;
	 * @returns
	 */
	isAutoSave(): boolean {
		if (!this.isSaveAndExit()) {
			return false;
		}

		return this.hasValueChanged;
	}

	/**
	 * Determine if the Save & Exit process can occur
	 * @returns
	 */
	isSaveAndExit(): boolean {
		if (this.applicationTypeFormGroup.get('applicationTypeCode')?.value != ApplicationTypeCode.New) {
			return false;
		}

		return true;
	}

	isStepSelectionComplete(): boolean {
		return this.termsAndConditionsFormGroup.valid;
	}

	isStepPersonalInformationComplete(): boolean {
		return (
			this.gdsdPersonalInformationFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.governmentPhotoIdFormGroup.valid &&
			this.mailingAddressFormGroup.valid
		);
	}

	isStepDogInformationComplete(): boolean {
		return (
			this.dogCertificationSelectionFormGroup.valid &&
			this.dogInformationFormGroup.valid &&
			this.accreditedGraduationFormGroup.valid
		);
	}

	isStepTrainingInformationComplete(): boolean {
		return false;
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.gdsdModelFormGroup.reset();

		// clear the array data - this does not seem to get reset during a formgroup reset
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		while (otherTrainingsArray.length) {
			otherTrainingsArray.removeAt(0);
		}
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		while (schoolTrainingsArray.length) {
			schoolTrainingsArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.gdsdModelFormGroup.value);
	}

	/*************************************************************/
	// ANONYMOUS
	/*************************************************************/

	/**
	 * Create an empty permit
	 * @returns
	 */
	createNewGdsdAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		return this.createEmptyGdsdAnonymous(serviceTypeCode).pipe(
			tap((_resp: any) => {
				this.initialized = true;
				this.commonApplicationService.setGdsdApplicationTitle(serviceTypeCode);
			})
		);
	}

	/**
	 * Create an empty anonymous Gdsd
	 * @returns
	 */

	private createEmptyGdsdAnonymous(serviceTypeCode: ServiceTypeCode): Observable<any> {
		this.reset();

		// const dogCertificationSelectionData = {
		// 	isDogTrainedByAccreditedSchool: BooleanTypeCode.No,
		// 	isGuideDog: BooleanTypeCode.No,
		// };

		// const trainingHistoryData = {
		// 	hasAttendedTrainingSchool: BooleanTypeCode.Yes,
		// 	// trainingSchoolContactInfos: [],
		// 	// otherTrainings: [],
		// };

		this.gdsdModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				applicationTypeCode: ApplicationTypeCode.New,
				bizTypeCode: BizTypeCode.None,
				serviceTypeCode,
				licenceTermCode: LicenceTermCode.TwoYears,

				// TODO temp hardcode data
				// dogCertificationSelectionData,
				// trainingHistoryData,
			},
			{
				emitEvent: false,
			}
		);

		this.schoolTrainingRowAdd();
		this.otherTrainingRowAdd();

		return of(this.gdsdModelFormGroup.value);
	}

	// OTHER TRAINING array
	otherTrainingRowUsePersonalTraining(index: number): boolean {
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		const otherTrainingItem = otherTrainingsArray.at(index);
		const ctrl = otherTrainingItem.get('usePersonalDogTrainer') as FormControl;
		return ctrl?.value === BooleanTypeCode.Yes;
	}

	// OTHER TRAINING array
	otherTrainingRowRemove(index: number): void {
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		otherTrainingsArray.removeAt(index);
	}

	// OTHER TRAINING array
	otherTrainingRowAdd(): void {
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		otherTrainingsArray.push(
			new FormGroup(
				{
					trainingDetail: new FormControl('', [FormControlValidators.required]),
					usePersonalDogTrainer: new FormControl('', [Validators.required]),
					dogTrainerCredential: new FormControl(''),
					trainingTime: new FormControl(''),
					trainerGivenName: new FormControl(''),
					trainerSurname: new FormControl(''),
					trainerPhoneNumber: new FormControl(''),
					trainerEmailAddress: new FormControl(''),
					hoursPracticingSkill: new FormControl(''),
					attachments: new FormControl([]),
				},
				{
					validators: [
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'dogTrainerCredential',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'trainingTime',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'trainerSurname',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'trainerPhoneNumber',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
						FormGroupValidators.conditionalDefaultRequiredValidator(
							'hoursPracticingSkill',
							(form) => form.get('usePersonalDogTrainer')?.value == BooleanTypeCode.Yes
						),
					],
				}
			)
		);
	}

	// OTHER TRAINING array
	otherTrainingAttachmentsItemControl(index: number): FormControl {
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		const otherTrainingItem = otherTrainingsArray.at(index);
		return otherTrainingItem.get('attachments') as FormControl;
	}

	// OTHER TRAINING array
	otherTrainingAttachmentsItemValue(index: number): File[] {
		const otherTrainingsArray = this.gdsdModelFormGroup.get('otherTrainingHistoryData.otherTrainings') as FormArray;
		const otherTrainingItem = otherTrainingsArray.at(index);
		const ctrl = otherTrainingItem.get('attachments') as FormControl;
		return ctrl?.value ?? [];
	}

	// SCHOOL TRAINING array
	schoolTrainingRowRemove(index: number): void {
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		schoolTrainingsArray.removeAt(index);
	}

	// SCHOOL TRAINING array
	schoolTrainingRowAdd(): void {
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		schoolTrainingsArray.push(
			new FormGroup({
				trainingBizName: new FormControl(null, [FormControlValidators.required]),
				contactGivenName: new FormControl(''),
				contactSurname: new FormControl('', [FormControlValidators.required]),
				contactPhoneNumber: new FormControl('', [Validators.required]),
				contactEmailAddress: new FormControl(''),
				trainingDateFrom: new FormControl('', [Validators.required]),
				trainingDateTo: new FormControl('', [Validators.required]),
				nameOfTrainingProgram: new FormControl('', [Validators.required]),
				hoursOfTraining: new FormControl('', [Validators.required]),
				learnedDesc: new FormControl('', [Validators.required]),
				addressSelected: new FormControl(false, [Validators.requiredTrue]),
				addressLine1: new FormControl('', [FormControlValidators.required]),
				addressLine2: new FormControl(''),
				city: new FormControl('', [FormControlValidators.required]),
				postalCode: new FormControl('', [FormControlValidators.required]),
				province: new FormControl('', [FormControlValidators.required]),
				country: new FormControl('', [FormControlValidators.required]),
			})
		);
	}

	// SCHOOL TRAINING array
	getSchoolTrainingFormGroup(index: number): FormGroup {
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		return schoolTrainingsArray.at(index) as FormGroup;
	}

	/**
	 * Submit the data
	 * @returns
	 */
	submitAnonymous(): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdModelFormGroup.getRawValue();
		console.debug('[submitAnonymous] gdsdModelFormValue', gdsdModelFormValue);

		const body = this.getSaveBodyBase(gdsdModelFormValue);
		// const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		// // Get the keyCode for the existing documents to save.
		// const existingDocumentIds: Array<string> = [];
		// let newDocumentsExist = false;
		// documentsToSave.forEach((docPermit: PermitDocumentsToSave) => {
		// 	docPermit.documents.forEach((doc: any) => {
		// 		if (doc.documentUrlId) {
		// 			existingDocumentIds.push(doc.documentUrlId);
		// 		} else {
		// 			newDocumentsExist = true;
		// 		}
		// 	});
		// });

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		// console.debug('[submitPermitAnonymous] newDocumentsExist', newDocumentsExist);

		// if (newDocumentsExist) {
		// 	return this.postPermitAnonymousNewDocuments(googleRecaptcha, existingDocumentIds, documentsToSave, body);
		// } else {
		return this.postAnonymous(googleRecaptcha, body); //, existingDocumentIds
		// }
	}

	/**
	 * Post permit anonymous. This permit must not have any new documents (for example: with an update or replacement)
	 * @returns
	 */
	private postAnonymous(
		googleRecaptcha: GoogleRecaptcha,
		// existingDocumentIds: Array<string>,
		body: GdsdTeamLicenceAppAnonymousSubmitRequest
	) {
		console.debug('[postAnonymous]');

		return this.licenceAppDocumentService
			.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					// pass in the list of document ids that were in the original
					// application and are still being used
					// body.previousDocumentIds = [...existingDocumentIds];

					return this.gdsdLicensingService.apiGdsdTeamAppAnonymousSubmitPost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}
}
