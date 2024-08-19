import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	ControllingMemberCrcAppCommandResponse,
	ControllingMemberCrcAppSubmitRequest,
	LicenceDocumentTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { ControllingMemberCrcAppService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subscription, debounceTime, distinctUntilChanged, of, tap } from 'rxjs';
import { ApplicationService } from './application.service';
import { ConfigService } from './config.service';
import { ControllingMemberCrcHelper } from './controlling-member-crc.helper';
import { FileUtilService } from './file-util.service';
import { UtilService } from './util.service';

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
					const isValid = true; //step1Complete && step2Complete && step3Complete && step4Complete;
					console.debug(
						'controllingMembersModelFormGroup CHANGED',
						// step1Complete,
						// step2Complete,
						// step3Complete,
						// step4Complete,
						this.controllingMembersModelFormGroup.getRawValue()
					);

					this.updateModelChangeFlags();
					this.controllingMembersModelValueChanges$.next(isValid);
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
	 * When uploading a file, set the value as changed, and perform the upload
	 * @returns
	 */
	fileUploaded(
		documentCode: LicenceDocumentTypeCode, // type of the document
		document: File,
		attachments: FormControl, // the FormControl containing the documents
		fileUploadComponent: FileUploadComponent // the associated fileUploadComponent on the screen.
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

		// // Get the keyCode for the existing documents to save.
		// const existingDocumentIds: Array<string> = [];
		// body.documentInfos?.forEach((doc: Document) => {
		// 	if (doc.documentUrlId) {
		// 		existingDocumentIds.push(doc.documentUrlId);
		// 	}
		// });

		// delete body.documentInfos;

		// const googleRecaptcha = { recaptchaCode: mailingAddressData.captchaFormGroup.token };
		// return this.postLicenceAnonymousDocuments(googleRecaptcha, existingDocumentIds, null, body);
		return this.postLicenceAnonymousDocuments(body);

		// this.router.navigateByUrl(ControllingMemberCrcRoutes.path(ControllingMemberCrcRoutes.CONTROLLING_MEMBER_SUBMIT));
	}

	/**
	 * Post licence documents anonymous.
	 * @returns
	 */
	private postLicenceAnonymousDocuments(
		// googleRecaptcha: GoogleRecaptcha,
		// existingDocumentIds: Array<string>,
		// documentsToSaveApis: Observable<string>[] | null,
		body: ControllingMemberCrcAppSubmitRequest
	) {
		// if (documentsToSaveApis) {
		// 	return this.controllingMemberCrcAppService
		// 		.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
		// 		.pipe(
		// 			switchMap((_resp: IActionResult) => {
		// 				return forkJoin(documentsToSaveApis);
		// 			}),
		// 			switchMap((resps: string[]) => {
		// 				// pass in the list of document key codes
		// 				body.documentKeyCodes = [...resps];
		// 				// pass in the list of document ids that were in the original
		// 				// application and are still being used
		// 				body.previousDocumentIds = [...existingDocumentIds];

		// 				return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAnonymousSubmitPost$Response({
		// 					body,
		// 				});
		// 			})
		// 		)
		// 		.pipe(take(1));
		// } else {
		// 	return this.securityWorkerLicensingService
		// 		.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
		// 		.pipe(
		// 			switchMap((_resp: IActionResult) => {
		// 				// pass in the list of document ids that were in the original
		// 				// application and are still being used
		// 				body.previousDocumentIds = [...existingDocumentIds];

		// 				return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsAnonymousSubmitPost$Response({
		// 					body,
		// 				});
		// 			})
		// 		)
		// 		.pipe(take(1));
		// }
		return this.controllingMemberCrcAppService.apiControllingMemberCrcApplicationsAnonymousSubmitPost$Response({
			body,
		});
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
