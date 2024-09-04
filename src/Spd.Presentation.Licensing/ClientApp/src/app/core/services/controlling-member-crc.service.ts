import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	ControllingMemberCrcAppCommandResponse,
	ControllingMemberCrcAppSubmitRequest,
	GoogleRecaptcha,
	IActionResult,
	LicenceDocumentTypeCode,
	LicenceTermCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { ControllingMemberCrcAppService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { HotToastService } from '@ngneat/hot-toast';
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
import { ApplicationService } from './application.service';
import { ConfigService } from './config.service';
import { ControllingMemberCrcHelper } from './controlling-member-crc.helper';
import { FileUtilService } from './file-util.service';
import { LicenceDocumentsToSave, UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class ControllingMemberCrcService extends ControllingMemberCrcHelper {
	controllingMembersModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	controllingMembersModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(),

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,

		personalInformationData: this.personalNameAndContactInformationFormGroup,
		aliasesData: this.aliasesFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,

		citizenshipData: this.citizenshipFormGroup,
		fingerprintProofData: this.fingerprintProofFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		bcSecurityLicenceHistoryData: this.bcSecurityLicenceHistoryFormGroup,
		policeBackgroundData: this.policeBackgroundFormGroup,
		mentalHealthConditionsData: this.mentalHealthConditionsFormGroup,
		consentAndDeclarationData: this.consentAndDeclarationFormGroup,
	});

	controllingMembersModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private controllingMemberCrcAppService: ControllingMemberCrcAppService,
		private commonApplicationService: ApplicationService,
		private hotToastService: HotToastService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.controllingMembersModelChangedSubscription = this.controllingMembersModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step1Complete = this.isStepPersonalInformationComplete();
					const step2Complete = this.isStepCitizenshipAndResidencyComplete();
					const step3Complete = this.isStepBackgroundComplete();
					const isValid = step1Complete && step2Complete && step3Complete;

					console.debug(
						'controllingMembersModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						this.controllingMembersModelFormGroup.getRawValue()
					);

					this.updateModelChangeFlags();
					this.controllingMembersModelValueChanges$.next(isValid);
				}
			});
	}

	isStepPersonalInformationComplete(): boolean {
		// console.debug(
		// 	'isStepPersonalInformationComplete',
		// 	this.personalNameAndContactInformationFormGroup.valid,
		// 	this.aliasesFormGroup.valid,
		// 	this.residentialAddressFormGroup.valid
		// );

		return (
			this.personalNameAndContactInformationFormGroup.valid &&
			this.aliasesFormGroup.valid &&
			this.residentialAddressFormGroup.valid
		);
	}

	isStepCitizenshipAndResidencyComplete(): boolean {
		// console.debug(
		// 	'isStepCitizenshipAndResidencyComplete',
		// 	this.citizenshipFormGroup.valid,
		// 	this.fingerprintProofFormGroup.valid,
		// 	this.bcDriversLicenceFormGroup.valid
		// );

		return (
			this.citizenshipFormGroup.valid && this.fingerprintProofFormGroup.valid && this.bcDriversLicenceFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBackgroundComplete(): boolean {
		// console.debug(
		// 	'isStepBackgroundComplete',
		// 	this.bcSecurityLicenceHistoryFormGroup.valid,
		// 	this.policeBackgroundFormGroup.valid,
		// 	this.mentalHealthConditionsFormGroup.valid
		// );

		return (
			this.bcSecurityLicenceHistoryFormGroup.valid &&
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid
		);
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
	 * When uploading a file, set the value as changed, and perform the upload
	 * @returns
	 */
	fileUploaded(
		_documentCode: LicenceDocumentTypeCode, // type of the document
		_document: File,
		_attachments: FormControl, // the FormControl containing the documents
		_fileUploadComponent: FileUploadComponent // the associated fileUploadComponent on the screen.
	) {
		this.hasValueChanged = true;

		// 	if (!this.isAutoSave()) return;

		// 	this.addUploadDocument(documentCode, document).subscribe({
		// 		next: (resp: any) => {
		// 			const matchingFile = attachments.value.find((item: File) => item.name == document.name);
		// 			matchingFile.documentUrlId = resp.body[0].documentUrlId;
		// 		},
		// 		error: (error: any) => {
		// 			console.log('An error occurred during file upload', error);

		// 			fileUploadComponent.removeFailedFile(document);
		// 		},
		// 	});
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

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewCrcAnonymous(): Observable<any> {
		return this.getCrcEmptyAnonymous().pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					WorkerLicenceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
					ApplicationTypeCode.New
				);
			})
		);
	}

	private getCrcEmptyAnonymous(): Observable<any> {
		this.reset();

		this.controllingMembersModelFormGroup.patchValue(
			{
				workerLicenceTypeData: {
					workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicenceControllingMemberCrc,
				},
			},
			{
				emitEvent: false,
			}
		);

		return of(this.controllingMembersModelFormGroup.value);
	}

	/**
	 * Submit the licence data anonymous
	 * @returns
	 */
	submitControllingMemberCrcAnonymous(): Observable<StrictHttpResponse<ControllingMemberCrcAppCommandResponse>> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();

		const body = this.getSaveBodyBaseAnonymous(controllingMembersModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(body, controllingMembersModelFormValue);

		body.parentBizLicApplicationId = '7943e30e-bf8f-ee11-b849-00505683fbf4'; // TODO remove hardcoding
		body.bizContactId = '40831603-075f-ee11-b846-00505683fbf4';
		body.workerLicenceTypeCode = WorkerLicenceTypeCode.SecurityBusinessLicenceControllingMemberCrc;
		body.licenceTermCode = LicenceTermCode.OneYear;
		body.applicationTypeCode = ApplicationTypeCode.New;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

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
					this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsAnonymousFilesPost({
						body: {
							Documents: newDocumentsOnly,
							LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.postCrcAnonymousDocuments(googleRecaptcha, documentsToSaveApis, body);
	}

	/**
	 * Post licence documents anonymous.
	 * @returns
	 */
	private postCrcAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		documentsToSaveApis: Observable<string>[],
		body: ControllingMemberCrcAppSubmitRequest
	) {
		return this.controllingMemberCrcAppService
			.apiControllingMemberCrcApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					return forkJoin(documentsToSaveApis);
				}),
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = [...resps];

					return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.controllingMembersModelFormGroup.reset();

		// clear the alias data - this does not seem to get reset during a formgroup reset
		const aliasesArray = this.consentAndDeclarationFormGroup.get('aliasesData.aliases') as FormArray;
		while (aliasesArray?.length) {
			aliasesArray.removeAt(0);
		}

		console.debug('RESET', this.initialized, this.controllingMembersModelFormGroup.value);
	}
}
