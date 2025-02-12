import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	BizTypeCode,
	Document,
	GdsdAppCommandResponse,
	GdsdTeamLicenceAppAnonymousSubmitRequest,
	GdsdTeamLicenceAppUpsertRequest,
	GoogleRecaptcha,
	IActionResult,
	LicenceTermCode,
	ServiceTypeCode,
} from '@app/api/models';
import { GdsdLicensingService, LicenceAppDocumentService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { HotToastService } from '@ngxpert/hot-toast';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	debounceTime,
	distinctUntilChanged,
	forkJoin,
	of,
	switchMap,
	take,
	tap,
} from 'rxjs';
import { BooleanTypeCode } from '../code-types/model-desc.models';
import { FormControlValidators } from '../validators/form-control.validators';
import { FormGroupValidators } from '../validators/form-group.validators';
import { AuthUserBcscService } from './auth-user-bcsc.service';
import { CommonApplicationService } from './common-application.service';
import { ConfigService } from './config.service';
import { FileUtilService } from './file-util.service';
import { GdsdApplicationHelper } from './gdsd-application.helper';
import { LicenceDocumentsToSave, UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class GdsdApplicationService extends GdsdApplicationHelper {
	gdsdModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	gdsdModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(),
		applicationOriginTypeCode: new FormControl(), // placeholder to save
		bizTypeCode: new FormControl(), // placeholder to save
		licenceTermCode: new FormControl(), // placeholder to save

		serviceTypeData: this.serviceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		termsAndConditionsData: this.termsAndConditionsFormGroup,
		personalInformationData: this.gdsdPersonalInformationFormGroup,
		medicalInformationData: this.medicalInformationFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		dogTasksData: this.dogTasksFormGroup,
		dogCertificationSelectionData: this.dogCertificationSelectionFormGroup,
		dogInformationData: this.dogInformationFormGroup,
		dogGdsdData: this.dogGdsdFormGroup,
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
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private hotToastService: HotToastService,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private gdsdLicensingService: GdsdLicensingService,
		private authUserBcscService: AuthUserBcscService
	) {
		super(formBuilder, configService, utilService, fileUtilService);

		this.gdsdModelChangedSubscription = this.gdsdModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepSelectionComplete();
					const step2Complete = this.isStepPersonalInformationComplete();
					const step3Complete = this.isStepDogInformationComplete();
					const step4Complete = this.isStepTrainingInformationComplete();
					const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

					console.debug(
						'gdsdModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						step4Complete,
						this.gdsdModelFormGroup.getRawValue()
					);
					this.updateModelChangeFlags();
					this.gdsdModelValueChanges$.next(isValid);
				}
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
		return this.termsAndConditionsFormGroup.valid && this.dogCertificationSelectionFormGroup.valid;
	}

	isStepPersonalInformationComplete(): boolean {
		const isTrainedByAccreditedSchools =
			this.gdsdModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		console.debug(
			'isStepPersonalInformationComplete',
			isTrainedByAccreditedSchools,
			this.gdsdPersonalInformationFormGroup.valid,
			this.medicalInformationFormGroup.valid,
			this.photographOfYourselfFormGroup.valid,
			this.governmentPhotoIdFormGroup.valid,
			this.mailingAddressFormGroup.valid
		);

		if (isTrainedByAccreditedSchools) {
			return (
				this.gdsdPersonalInformationFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid &&
				this.governmentPhotoIdFormGroup.valid &&
				this.mailingAddressFormGroup.valid
			);
		}

		return (
			this.gdsdPersonalInformationFormGroup.valid &&
			this.medicalInformationFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.governmentPhotoIdFormGroup.valid &&
			this.mailingAddressFormGroup.valid
		);
	}

	isStepDogInformationComplete(): boolean {
		const isTrainedByAccreditedSchools =
			this.gdsdModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		// console.debug('isStepDogInformationComplete', this.dogGdsdFormGroup.valid, this.dogInformationFormGroup.valid, this.dogMedicalFormGroup.valid);

		if (isTrainedByAccreditedSchools) {
			return this.dogGdsdFormGroup.valid && this.dogInformationFormGroup.valid;
		}

		return this.dogInformationFormGroup.valid && this.dogMedicalFormGroup.valid;
	}

	isStepTrainingInformationComplete(): boolean {
		const isTrainedByAccreditedSchools =
			this.gdsdModelFormGroup.get('dogCertificationSelectionData.isDogTrainedByAccreditedSchool')?.value ===
			BooleanTypeCode.Yes;

		if (isTrainedByAccreditedSchools) {
			const isServiceDog =
				this.gdsdModelFormGroup.get('dogCertificationSelectionData.isGuideDog')?.value === BooleanTypeCode.No;

			// console.debug(
			// 	'isStepTrainingInformationComplete',
			// 	this.accreditedGraduationFormGroup.valid,
			// 	this.dogTasksFormGroup.valid
			// );

			if (isServiceDog) {
				return this.accreditedGraduationFormGroup.valid && this.dogTasksFormGroup.valid;
			}

			return this.accreditedGraduationFormGroup.valid;
		}

		const hasAttendedTrainingSchool =
			this.gdsdModelFormGroup.get('trainingHistoryData.hasAttendedTrainingSchool')?.value === BooleanTypeCode.Yes;

		// console.debug(
		// 	'isStepTrainingInformationComplete',
		// 	hasAttendedTrainingSchool,
		// 	this.trainingHistoryFormGroup.valid,
		// 	this.schoolTrainingHistoryFormGroup.valid,
		// 	this.otherTrainingHistoryFormGroup.valid,
		// 	this.dogTasksFormGroup.valid
		// );

		if (hasAttendedTrainingSchool) {
			return (
				this.trainingHistoryFormGroup.valid && this.schoolTrainingHistoryFormGroup.valid && this.dogTasksFormGroup.valid
			);
		}

		return (
			this.trainingHistoryFormGroup.valid && this.otherTrainingHistoryFormGroup.valid && this.dogTasksFormGroup.valid
		);
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
	// AUTHENTICATED
	/*************************************************************/

	/**
	 * Partial Save - Save the data as is.
	 * @returns StrictHttpResponse<WorkerLicenceCommandResponse>
	 */
	partialSaveStepAuthenticated(isSaveAndExit?: boolean): Observable<StrictHttpResponse<GdsdAppCommandResponse>> {
		const gdsdModelFormValue = this.gdsdModelFormGroup.getRawValue();
		console.debug('[partialSaveStepAuthenticated] gdsdModelFormValue', gdsdModelFormValue);

		const body = this.getSaveBodyBase(gdsdModelFormValue) as GdsdTeamLicenceAppUpsertRequest;

		body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		return this.gdsdLicensingService.apiGdsdTeamAppPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<GdsdAppCommandResponse>) => {
				this.hasValueChanged = false;

				let msg = 'Your application has been saved';
				if (isSaveAndExit) {
					msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
				}
				this.hotToastService.success(msg);

				if (!gdsdModelFormValue.licenceAppId) {
					this.gdsdModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
	}

	/**
	 * Create an empty authenticated licence
	 * @returns
	 */
	createNewLicenceAuthenticated(): Observable<any> {
		// return this.applicantProfileService
		// 	.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
		// 	.pipe(
		// 		switchMap((applicantProfile: ApplicantProfileResponse) => {
		return this.createEmptyLicenceAuthenticated().pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					ServiceTypeCode.GdsdTeamCertification,
					ApplicationTypeCode.New
				);
			})
		);
		// 	})
		// );
	}

	private createEmptyLicenceAuthenticated(): Observable<any> {
		this.reset();

		return this.applyLicenceIntoModel();
	}

	private applyLicenceIntoModel(): Observable<any> {
		const serviceTypeData = { serviceTypeCode: ServiceTypeCode.GdsdTeamCertification };
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.New };

		this.gdsdModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				bizTypeCode: BizTypeCode.None,
				serviceTypeData,
				licenceTermCode: LicenceTermCode.TwoYears,
				applicationTypeData,
			},
			{
				emitEvent: false,
			}
		);

		this.schoolTrainingRowAdd();
		this.otherTrainingRowAdd();

		console.debug('[createNewGdsdAuthenticated] gdsdModelFormGroup', this.gdsdModelFormGroup.value);
		return of(this.gdsdModelFormGroup.value);
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

		const serviceTypeData = { serviceTypeCode: ServiceTypeCode.GdsdTeamCertification };
		// const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.New };

		this.gdsdModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				bizTypeCode: BizTypeCode.None,
				licenceTermCode: LicenceTermCode.TwoYears,
				serviceTypeData,
				// applicationTypeData,
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
					trainingId: new FormControl(''), // placeholder for ID
					trainingDetail: new FormControl('', [FormControlValidators.required]),
					usePersonalDogTrainer: new FormControl('', [Validators.required]),
					dogTrainerCredential: new FormControl(''),
					trainingTime: new FormControl(''),
					trainerGivenName: new FormControl(''),
					trainerSurname: new FormControl(''),
					trainerPhoneNumber: new FormControl(''),
					trainerEmailAddress: new FormControl('', [FormControlValidators.email]),
					hoursPracticingSkill: new FormControl(''),
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

	// SCHOOL TRAINING array
	schoolTrainingRowRemove(index: number): void {
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		schoolTrainingsArray.removeAt(index);
	}

	// SCHOOL TRAINING array
	schoolTrainingRowAdd(): void {
		const schoolTrainingsArray = this.gdsdModelFormGroup.get('schoolTrainingHistoryData.schoolTrainings') as FormArray;
		schoolTrainingsArray.push(
			new FormGroup(
				{
					trainingId: new FormControl(''), // placeholder for ID
					trainingBizName: new FormControl(null, [FormControlValidators.required]),
					contactGivenName: new FormControl(''),
					contactSurname: new FormControl('', [FormControlValidators.required]),
					contactPhoneNumber: new FormControl('', [Validators.required]),
					contactEmailAddress: new FormControl('', [FormControlValidators.email]),
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
				},
				{
					validators: [FormGroupValidators.daterangeValidator('trainingDateFrom', 'trainingDateTo')],
				}
			)
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
		const documentsToSave = this.getDocsToSaveBlobs(gdsdModelFormValue);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.applicantOrLegalGuardianName = consentData.applicantOrLegalGuardianName;

		const documentsToSaveApis: Observable<string>[] = [];
		documentsToSave.forEach((docBody: LicenceDocumentsToSave) => {
			// Only pass new documents and get a keyCode for each of those.
			const newDocumentsOnly: Array<Blob> = [];
			docBody.documents.forEach((doc: any) => {
				if (!doc.documentUrlId) {
					newDocumentsOnly.push(doc);
				}
			});

			// should always be at least one new document
			if (newDocumentsOnly.length > 0) {
				documentsToSaveApis.push(
					this.licenceAppDocumentService.apiLicenceApplicationDocumentsAnonymousFilesPost({
						body: {
							documents: newDocumentsOnly,
							licenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		const existingDocumentIds: Array<string> = body.documentInfos
			.filter((item: Document) => !!item.documentUrlId)
			.map((item: Document) => item.documentUrlId!);

		delete body.documentInfos;

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.postAnonymous(
			googleRecaptcha,
			existingDocumentIds,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	/**
	 * Post permit anonymous. This permit must not have any new documents (for example: with an update or replacement)
	 * @returns
	 */
	private postAnonymous(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSaveApis: Observable<string>[] | null,
		body: GdsdTeamLicenceAppAnonymousSubmitRequest
	) {
		console.debug('[postAnonymous]');

		if (documentsToSaveApis) {
			return this.licenceAppDocumentService
				.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
				.pipe(
					switchMap((_resp: IActionResult) => {
						return forkJoin(documentsToSaveApis);
					}),
					switchMap((resps: string[]) => {
						// pass in the list of document key codes
						body.documentKeyCodes = [...resps];
						// pass in the list of document ids that were in the original
						// application and are still being used
						// body.previousDocumentIds = [...existingDocumentIds]; // TODO gdsd previousDocumentIds

						return this.gdsdLicensingService.apiGdsdTeamAppAnonymousSubmitPost$Response({
							body,
						});
					})
				)
				.pipe(take(1));
		} else {
			return this.licenceAppDocumentService
				.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
				.pipe(
					switchMap((_resp: IActionResult) => {
						// pass in the list of document ids that were in the original
						// application and are still being used
						// body.previousDocumentIds = [...existingDocumentIds]; // TODO gdsd previousDocumentIds

						return this.gdsdLicensingService.apiGdsdTeamAppAnonymousSubmitPost$Response({
							body,
						});
					})
				)
				.pipe(take(1));
		}
	}
}
