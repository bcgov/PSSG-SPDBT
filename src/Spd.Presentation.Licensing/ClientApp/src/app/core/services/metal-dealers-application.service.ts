import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	ApplicationTypeCode,
	BranchInfo,
	GoogleRecaptcha,
	IActionResult,
	LicenceResponse,
	MdraRegistrationCommandResponse,
	MdraRegistrationRequest,
	MdraRegistrationResponse,
	ServiceTypeCode,
} from '@app/api/models';
import { LicenceAppDocumentService, MdraService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { NgxMaskPipe } from 'ngx-mask';
import {
	BehaviorSubject,
	catchError,
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
import { FileUtilService } from './file-util.service';
import { MetalDealersApplicationHelper } from './metal-dealers-application.helper';
import { LicenceDocumentsToSave, UtilService } from './util.service';

@Injectable({
	providedIn: 'root',
})
export class MetalDealersApplicationService extends MetalDealersApplicationHelper {
	metalDealersModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	metalDealersModelFormGroup: FormGroup = this.formBuilder.group({
		originalLicenceId: new FormControl(), // placeholder for Renewal / Update
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
		maskPipe: NgxMaskPipe,
		private commonApplicationService: CommonApplicationService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private mdraService: MdraService
	) {
		super(formBuilder, configService, utilService, fileUtilService, maskPipe);
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

	isRenewalOrUpdate(): boolean {
		const applicationTypeFormValue = this.applicationTypeFormGroup.value;
		const applicationTypeCode = applicationTypeFormValue.applicationTypeCode;
		return applicationTypeCode === ApplicationTypeCode.Renewal || applicationTypeCode === ApplicationTypeCode.Update;
	}

	/**
	 * Create an empty registration
	 * @returns
	 */
	createNewRegistration(): Observable<any> {
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
			{ serviceTypeData: { serviceTypeCode: ServiceTypeCode.Mdra } },
			{ emitEvent: false }
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
	 * Load an existing mdra registration
	 * @param licenceAppId
	 * @returns
	 */
	getMdraWithAccessCodeData(
		associatedLicence: LicenceResponse,
		applicationTypeCode: ApplicationTypeCode
	): Observable<MdraRegistrationResponse> {
		return this.getMdraUsingAccessCode(applicationTypeCode, associatedLicence).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					ServiceTypeCode.Mdra,
					_resp.applicationTypeData.applicationTypeCode,
					associatedLicence.licenceNumber!
				);
			})
		);
	}

	/**
	 * Load an existing mdra registration
	 * @param licenceAppId
	 * @returns
	 */
	private getMdraUsingAccessCode(
		applicationTypeCode: ApplicationTypeCode,
		associatedLicence: LicenceResponse
	): Observable<MdraRegistrationResponse> {
		return this.loadExistingMdra(associatedLicence).pipe(
			catchError((error) => of(error)),
			switchMap((resp: MdraRegistrationResponse) => {
				if (applicationTypeCode === ApplicationTypeCode.Renewal) {
					return this.applyRenewalSpecificDataToModel(resp);
				}
				return this.applyUpdateSpecificDataToModel(resp);
			})
		);
	}

	/**
	 * Load an existing mdra registration related to an access code search
	 * @returns
	 */
	private loadExistingMdra(associatedLicence: LicenceResponse): Observable<MdraRegistrationResponse> {
		this.reset();
		return this.mdraService.apiMdraRegistrationGet().pipe(
			tap((mdraLicenceAppl: MdraRegistrationResponse) => {
				return this.applyApplIntoModel({ associatedLicence, mdraLicenceAppl });
			})
		);
	}

	private applyApplIntoModel({
		associatedLicence,
		mdraLicenceAppl,
	}: {
		associatedLicence: LicenceResponse;
		mdraLicenceAppl: MdraRegistrationResponse;
	}): Observable<any> {
		// converted data might be missing original registration
		if (!mdraLicenceAppl) {
			this.metalDealersModelFormGroup.patchValue(
				{ originalLicenceId: associatedLicence ? associatedLicence.licenceId : null },
				{ emitEvent: false }
			);
			return of(this.metalDealersModelFormGroup.value);
		}

		const businessOwnerData = {
			bizLegalName: mdraLicenceAppl.bizLegalName,
			bizTradeName: mdraLicenceAppl.bizTradeName,
			bizOwnerGivenNames: mdraLicenceAppl.bizOwnerGivenNames,
			bizOwnerSurname: mdraLicenceAppl.bizOwnerSurname,
			bizEmailAddress: mdraLicenceAppl.bizEmailAddress,
			bizPhoneNumber: mdraLicenceAppl.bizPhoneNumber,
			attachments: [],
		};
		const businessManagerData = {
			bizManagerFullName: mdraLicenceAppl.bizManagerFullName,
			bizManagerPhoneNumber: mdraLicenceAppl.bizManagerPhoneNumber,
			bizManagerEmailAddress: mdraLicenceAppl.bizManagerEmailAddress,
		};
		const businessAddressData = {
			addressSelected: !!mdraLicenceAppl.bizAddress,
			addressLine1: mdraLicenceAppl.bizAddress?.addressLine1,
			addressLine2: mdraLicenceAppl.bizAddress?.addressLine2,
			city: mdraLicenceAppl.bizAddress?.city,
			postalCode: mdraLicenceAppl.bizAddress?.postalCode,
			province: mdraLicenceAppl.bizAddress?.province,
			country: mdraLicenceAppl.bizAddress?.country,
		};
		const businessMailingAddressData = {
			addressSelected: !!mdraLicenceAppl.bizMailingAddress,
			addressLine1: mdraLicenceAppl.bizMailingAddress?.addressLine1,
			addressLine2: mdraLicenceAppl.bizMailingAddress?.addressLine2,
			city: mdraLicenceAppl.bizMailingAddress?.city,
			postalCode: mdraLicenceAppl.bizMailingAddress?.postalCode,
			province: mdraLicenceAppl.bizMailingAddress?.province,
			country: mdraLicenceAppl.bizMailingAddress?.country,
		};

		this.metalDealersModelFormGroup.patchValue(
			{
				originalLicenceId: associatedLicence ? associatedLicence.licenceId : null,
				businessOwnerData,
				businessManagerData,
				businessAddressData,
				businessMailingAddressData,
			},
			{ emitEvent: false }
		);

		if (mdraLicenceAppl.branches && mdraLicenceAppl.branches.length > 0) {
			const branchList = [...mdraLicenceAppl.branches].sort((a, b) =>
				this.utilService.sortByDirection(a.branchAddress?.city?.toUpperCase(), b.branchAddress?.city?.toUpperCase())
			);
			const branchesArray = this.metalDealersModelFormGroup.get('branchesData.branches') as FormArray;
			branchList.forEach((branchInfo: BranchInfo) => {
				branchesArray.push(
					new FormGroup({
						branchId: new FormControl(branchInfo.branchId),
						addressSelected: new FormControl(true),
						addressLine1: new FormControl(branchInfo.branchAddress?.addressLine1),
						addressLine2: new FormControl(branchInfo.branchAddress?.addressLine2),
						city: new FormControl(branchInfo.branchAddress?.city),
						country: new FormControl(branchInfo.branchAddress?.country),
						postalCode: new FormControl(branchInfo.branchAddress?.postalCode),
						province: new FormControl(branchInfo.branchAddress?.province),
						branchManager: new FormControl(branchInfo.branchManager),
						branchPhoneNumber: new FormControl(branchInfo.branchPhoneNumber),
						branchEmailAddr: new FormControl(branchInfo.branchEmailAddr),
					})
				);
			});
		}
		return of(this.metalDealersModelFormGroup.value);
	}

	private applyRenewalSpecificDataToModel(_resp: MdraRegistrationResponse): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };
		this.metalDealersModelFormGroup.patchValue({ applicationTypeData }, { emitEvent: false });
		return of(this.metalDealersModelFormGroup.value);
	}

	private applyUpdateSpecificDataToModel(_resp: MdraRegistrationResponse): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };
		this.metalDealersModelFormGroup.patchValue({ applicationTypeData }, { emitEvent: false });
		return of(this.metalDealersModelFormGroup.value);
	}

	/**
	 * Submit the application data for anonymous new
	 */
	submitLicenceAnonymous(
		requireDuplicateCheck: boolean
	): Observable<StrictHttpResponse<MdraRegistrationCommandResponse>> {
		const metalDealersModelFormValue = this.metalDealersModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(metalDealersModelFormValue);
		const documentsToSave = this.getDocsToSaveBlobs(metalDealersModelFormValue);

		const documentsToSaveApis = this.getDocumentsToSaveApis(documentsToSave);
		delete body.documentInfos;

		body.hasPotentialDuplicate = false;
		body.requireDuplicateCheck = requireDuplicateCheck;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		return this.submitLicenceAnonymousDocuments(
			googleRecaptcha,
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

		const documentsToSaveApis = this.getDocumentsToSaveApis(documentsToSave);
		delete body.documentInfos;
		body.hasPotentialDuplicate = hasPotentialDuplicate;
		body.requireDuplicateCheck = false;
		const googleRecaptcha = { recaptchaCode: recaptchaCode };
		return this.submitLicenceAnonymousDocuments(
			googleRecaptcha,
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

						return this.postSubmitAnonymous(body);
					})
				)
				.pipe(take(1));
		} else {
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

	private getDocumentsToSaveApis(documentsToSave: Array<LicenceDocumentsToSave>): Observable<string>[] {
		const documentsToSaveApis: Observable<string>[] = [];

		documentsToSave.forEach((docBody: LicenceDocumentsToSave) => {
			// Only pass new documents and get a keyCode for each of those.
			const newDocumentsOnly: Array<Blob> = [];
			docBody.documents.forEach((doc: any) => {
				newDocumentsOnly.push(doc);
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

		return documentsToSaveApis;
	}

	private postSubmitAnonymous(
		body: MdraRegistrationRequest
	): Observable<StrictHttpResponse<MdraRegistrationCommandResponse>> {
		return this.mdraService.apiMdraRegistrationsPost$Response({ body });
	}
}
