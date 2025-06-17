import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	GoogleRecaptcha,
	IActionResult,
	MdraRegistrationCommandResponse,
	MdraRegistrationRequest,
	ServiceTypeCode,
} from '@app/api/models';
import { LicenceAppDocumentService, MdraService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import {
	BehaviorSubject,
	debounceTime,
	distinctUntilChanged,
	forkJoin,
	Observable,
	of,
	Subscription,
	switchMap,
	take,
	tap,
} from 'rxjs';
import { CommonApplicationService } from './common-application.service';
import { ConfigService } from './config.service';
import { FileUtilService, SpdFile } from './file-util.service';
import { MetalDealersApplicationHelper } from './metal-dealers-application.helper';
import { LicenceDocumentsToSave, UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class MetalDealersApplicationService extends MetalDealersApplicationHelper {
	metalDealersModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	metalDealersModelFormGroup: FormGroup = this.formBuilder.group({
		applicationTypeData: this.applicationTypeFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
		businessOwnerData: this.businessOwnerFormGroup,
		businessManagerData: this.businessManagerFormGroup,
		businessAddressData: this.businessAddressFormGroup,
		businessMailingAddressData: this.businessMailingAddressFormGroup,
		branchesData: this.branchesFormGroup,
		consentAndDeclarationData: this.consentAndDeclarationFormGroup,
	});

	metalDealersModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private mdraService: MdraService
	) {
		super(formBuilder, configService, utilService, fileUtilService);

		this.metalDealersModelChangedSubscription = this.metalDealersModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const step2Complete = this.isStepBusinessInfoComplete();
					const step3Complete = this.isStepBranchOfficesComplete();
					const isValid = step2Complete && step3Complete;

					console.debug('metalDealersModelFormGroup CHANGED', this.metalDealersModelFormGroup.getRawValue());

					this.updateModelChangeFlags();

					this.metalDealersModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBusinessInfoComplete(): boolean {
		return (
			this.businessOwnerFormGroup.valid && this.businessManagerFormGroup.valid && this.businessAddressFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBranchOfficesComplete(): boolean {
		return this.branchesFormGroup.valid;
	}

	/**
	 * Create an empty registration
	 * @returns
	 */
	createNewRegistration(): Observable<any> {
		// this.reset();

		// this.commonApplicationService.setMdraApplicationTitle(ApplicationTypeCode.New);

		// this.initialized = true;
		// return of(this.metalDealersModelFormGroup.value);

		return this.getApplEmptyAnonymous().pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setMdraApplicationTitle(ApplicationTypeCode.New);
			})
		);
	}

	private getApplEmptyAnonymous(): Observable<any> {
		this.reset();

		this.metalDealersModelFormGroup.patchValue(
			{
				serviceTypeData: { serviceTypeCode: ServiceTypeCode.Mdra },
			},
			{
				emitEvent: false,
			}
		);

		return of(this.metalDealersModelFormGroup.value);
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		this.consentAndDeclarationFormGroup.reset();
		this.metalDealersModelFormGroup.reset();

		console.debug('RESET', this.initialized, this.metalDealersModelFormGroup.value);
	}

	/**
	 * Submit the application data for anonymous new
	 */
	submitLicenceAnonymous(): Observable<StrictHttpResponse<MdraRegistrationCommandResponse>> {
		const metalDealersModelFormValue = this.metalDealersModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(metalDealersModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(metalDealersModelFormValue);

		const { existingDocumentIds, documentsToSaveApis } = this.getDocumentData(documentsToSave);
		delete body.documentInfos;

		body.hasPotentialDuplicate = false;
		body.requireDuplicateCheck = true;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };

		return this.submitLicenceAnonymousDocuments(
			googleRecaptcha,
			existingDocumentIds,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	resubmitLicenceAnonymous(
		hasPotentialDuplicate: boolean,
		recaptchaCode: string
	): Observable<StrictHttpResponse<MdraRegistrationCommandResponse>> {
		const metalDealersModelFormValue = this.metalDealersModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(metalDealersModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(metalDealersModelFormValue);

		const { existingDocumentIds, documentsToSaveApis } = this.getDocumentData(documentsToSave);
		delete body.documentInfos;

		body.hasPotentialDuplicate = hasPotentialDuplicate;
		body.requireDuplicateCheck = false;

		const googleRecaptcha = { recaptchaCode: recaptchaCode };

		return this.submitLicenceAnonymousDocuments(
			googleRecaptcha,
			existingDocumentIds,
			documentsToSaveApis.length > 0 ? documentsToSaveApis : null,
			body
		);
	}

	/**
	 * Submit the application data for anonymous renewal or replacement including documents
	 * @returns
	 */
	private submitLicenceAnonymousDocuments(
		googleRecaptcha: GoogleRecaptcha,
		existingDocumentIds: Array<string>,
		documentsToSaveApis: Observable<string>[] | null,
		body: any // MdraRegistrationRequest
	): Observable<StrictHttpResponse<MdraRegistrationCommandResponse>> {
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
						body.previousDocumentIds = [...existingDocumentIds];

						return this.postSubmitAnonymous(body);
					})
				)
				.pipe(take(1));
		} else {
			// pass in the list of document ids that were in the original
			// application and are still being used
			body.previousDocumentIds = [...existingDocumentIds];

			return this.licenceAppDocumentService
				.apiLicenceApplicationDocumentsAnonymousKeyCodePost({ body: googleRecaptcha })
				.pipe(
					switchMap((_resp: IActionResult) => {
						return this.postSubmitAnonymous(body);
					})
				)
				.pipe(take(1));
		}
	}

	private getDocumentData(documentsToSave: Array<LicenceDocumentsToSave>): {
		existingDocumentIds: Array<string>;
		documentsToSaveApis: Observable<string>[];
	} {
		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];

		const documentsToSaveApis: Observable<string>[] = [];
		documentsToSave.forEach((docBody: LicenceDocumentsToSave) => {
			// Only pass new documents and get a keyCode for each of those.
			const newDocumentsOnly: Array<Blob> = [];
			docBody.documents.forEach((doc: any) => {
				const spdFile: SpdFile = doc as SpdFile;
				if (spdFile.documentUrlId) {
					existingDocumentIds.push(spdFile.documentUrlId);
				} else {
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

		return { existingDocumentIds, documentsToSaveApis };
	}

	private postSubmitAnonymous(
		body: MdraRegistrationRequest
	): Observable<StrictHttpResponse<MdraRegistrationCommandResponse>> {
		// if (body.applicationTypeCode == ApplicationTypeCode.New) {
		return this.mdraService.apiMdraRegistrationsPost$Response({ body });
		// }

		// return this.mdraService.apiMdraRegistrationsChangePost$Response({ body });
	}
}
