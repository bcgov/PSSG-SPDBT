import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		governmentPhotoIdData: this.governmentPhotoIdFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		dogTrainingInformationData: this.dogTrainingInformationFormGroup,
		dogInformationData: this.dogInformationFormGroup,
		accreditedGraduationData: this.accreditedGraduationFormGroup,
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
			this.dogTrainingInformationFormGroup.valid &&
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

		// clear the alias data - this does not seem to get reset during a formgroup reset
		// const aliasesArray = this.gdsdModelFormGroup.get('aliasesData.aliases') as FormArray;
		// while (aliasesArray.length) {
		// 	aliasesArray.removeAt(0); // TODO gdsd any arrays to clear?
		// }

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

		this.gdsdModelFormGroup.patchValue(
			{
				applicationOriginTypeCode: ApplicationOriginTypeCode.Portal,
				applicationTypeCode: ApplicationTypeCode.New,
				bizTypeCode: BizTypeCode.None,
				serviceTypeCode,
				licenceTermCode: LicenceTermCode.TwoYears,

				//   //gdsdPersonalInformationFormGroup:
				//   contactEmail?: string | null;
				//   contactPhoneNumber?: string | null;
				//   dateOfBirth?: string;
				//   legalGivenName?: string | null;
				//   middleName?: string | null;
				//   surname: string | null;
				// //mailingAddressFormGroup
				// mailingAddress?: MailingAddress;

				//   documentKeyCodes?: Array<string> | null;
				//   dogInfoNewCreditSchool?: DogInfoNewCreditSchool;
				//   dogInfoNewWithoutCreditSchool?: DogInfoNewWithoutCreditSchool;
				//   dogInfoRenew?: DogInfoRenew;
				//   dogTrainedByAccreditSchool?: boolean;
				//   graduationInfo?: GraduationInfo;
				//   trainingInfo?: TrainingInfo;
			},
			{
				emitEvent: false,
			}
		);

		return of(this.gdsdModelFormGroup.value);
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
		// body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

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

					return this.gdsdLicensingService.apiGdsdTeamAppAnonymousSubmitChangePost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}
}
