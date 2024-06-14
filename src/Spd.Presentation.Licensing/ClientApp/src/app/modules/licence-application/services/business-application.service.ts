import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
	Address,
	ApplicationTypeCode,
	BizLicAppCommandResponse,
	BizLicAppResponse,
	BizProfileResponse,
	BizProfileUpdateRequest,
	BranchInfo,
	Document,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	Members,
	NonSwlContactInfo,
	SwlContactInfo,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BizLicensingService, BizProfileService, LicenceService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { UtilService } from '@app/core/services/util.service';
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
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { BusinessApplicationHelper } from './business-application.helper';
import { CommonApplicationService, MainLicenceResponse } from './common-application.service';
import { LicenceDocument } from './licence-application.helper';

export interface ControllingMemberContactInfo extends NonSwlContactInfo {
	licenceId?: string | null;
	contactId?: string | null;
	licenceHolderName: string;
	licenceNumber?: string | null;
	licenceStatusCode?: string;
	expiryDate?: string | null;
	clearanceStatus?: string | null;
}

@Injectable({
	providedIn: 'root',
})
export class BusinessApplicationService extends BusinessApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	businessModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	businessModelFormGroup: FormGroup = this.formBuilder.group({
		bizId: new FormControl(null),
		licenceAppId: new FormControl(null),

		isBcBusinessAddress: new FormControl(), // placeholder for flag
		isBusinessLicenceSoleProprietor: new FormControl(), // placeholder for flag
		isRenewalShortForm: new FormControl(), // placeholder for flag

		originalLicenceData: this.originalBusinessLicenceFormGroup,

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
		businessInformationData: this.businessInformationFormGroup,
		companyBrandingData: this.companyBrandingFormGroup,
		liabilityData: this.liabilityFormGroup,

		categoryData: this.categoryFormGroup,
		categoryArmouredCarGuardFormGroup: this.categoryArmouredCarGuardFormGroup,
		categoryPrivateInvestigatorFormGroup: this.categoryPrivateInvestigatorFormGroup,
		categorySecurityGuardFormGroup: this.categorySecurityGuardFormGroup,

		licenceTermData: this.licenceTermFormGroup,
		businessManagerData: this.businessManagerFormGroup,
		businessAddressData: this.businessAddressFormGroup,
		businessMailingAddressData: this.businessMailingAddressFormGroup,
		bcBusinessAddressData: this.bcBusinessAddressFormGroup,

		branchesInBcData: this.branchesInBcFormGroup,
		controllingMembersData: this.controllingMembersFormGroup,
		employeesData: this.employeesFormGroup,
	});

	businessModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		utilService: UtilService,
		fileUtilService: FileUtilService,
		private router: Router,
		private licenceService: LicenceService,
		private bizProfileService: BizProfileService,
		private bizLicensingService: BizLicensingService,
		private authUserBceidService: AuthUserBceidService,
		private commonApplicationService: CommonApplicationService,
		private hotToastService: HotToastService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.businessModelChangedSubscription = this.businessModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

					const bizTypeCode = this.businessModelFormGroup.get('businessInformationData.bizTypeCode')?.value;
					const province = this.businessModelFormGroup.get('businessAddressData.province')?.value;
					const country = this.businessModelFormGroup.get('businessAddressData.country')?.value;
					const isBcBusinessAddress = this.utilService.isBcAddress(province, country);
					const isBusinessLicenceSoleProprietor = this.isSoleProprietor(bizTypeCode);

					this.businessModelFormGroup.patchValue(
						{ isBcBusinessAddress, isBusinessLicenceSoleProprietor },
						{ emitEvent: false }
					);

					const step1Complete = this.isStepBackgroundInformationComplete();
					const step2Complete = this.isStepLicenceSelectionComplete();
					const step3Complete = isBusinessLicenceSoleProprietor ? true : this.isStepContactInformationComplete();
					const step4Complete = isBusinessLicenceSoleProprietor
						? true
						: this.isStepControllingMembersAndEmployeesComplete();
					const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

					console.debug(
						'businessModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						step4Complete,
						this.businessModelFormGroup.getRawValue()
					);

					this.businessModelValueChanges$.next(isValid);
				}
			});
	}

	isBcBusinessAddress(): boolean {
		return this.businessModelFormGroup.get('isBcBusinessAddress')?.value;
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
	 * Partial Save - Save the licence data as is.
	 * @returns StrictHttpResponse<BizLicAppCommandResponse>
	 */
	partialSaveBusinessLicenceStep(isSaveAndExit?: boolean): Observable<any> {
		const businessModelFormValue = this.businessModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(businessModelFormValue);

		return this.bizLicensingService.apiBusinessLicenceApplicationPost$Response({ body }).pipe(
			take(1),
			tap((resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
				this.hasValueChanged = false;

				let msg = 'Business Licence information has been saved';
				if (isSaveAndExit) {
					msg =
						'Your application has been successfully saved. Please note that inactive applications will expire in 30 days';
				}
				this.hotToastService.success(msg);

				if (!businessModelFormValue.licenceAppId) {
					this.businessModelFormGroup.patchValue({ licenceAppId: resp.body.licenceAppId! }, { emitEvent: false });
				}
				return resp;
			})
		);
	}

	getBusinessProfile(): Observable<BizProfileResponse> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizProfileService.apiBizIdGet({ id: bizId });
	}

	submitBusinessLicenceNew(): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
		const businessModelFormValue = this.businessModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(businessModelFormValue);

		console.log('body', body); // TODO fix body for submit
		// body.applicantId = this.authUserBcscService.applicantLoginProfile?.applicantId;

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		return this.bizLicensingService.apiBusinessLicenceApplicationSubmitPost$Response({ body });
	}

	/**
	 * Upload a file of a certain type. Return a reference to the file that will used when the licence is saved
	 * @param documentCode
	 * @param document
	 * @returns
	 */
	addUploadDocument(
		documentCode: LicenceDocumentTypeCode,
		documentFile: File
	): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
		const doc: LicenceDocument = {
			Documents: [documentFile],
			LicenceDocumentTypeCode: documentCode,
		};

		return this.bizLicensingService.apiBusinessLicenceApplicationLicenceAppIdFilesPost$Response({
			licenceAppId: this.businessModelFormGroup.get('licenceAppId')?.value,
			body: doc,
		});
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
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBackgroundInformationComplete(): boolean {
		// console.debug(
		// 	'isStepBackgroundInformationComplete',
		// 	this.expiredLicenceFormGroup.valid,
		// 	this.companyBrandingFormGroup.valid,
		// 	this.liabilityFormGroup.valid
		// );

		return this.expiredLicenceFormGroup.valid && this.companyBrandingFormGroup.valid && this.liabilityFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepLicenceSelectionComplete(): boolean {
		// console.debug(
		// 	'isStepLicenceSelectionComplete',
		// 	this.categoryFormGroup.valid,
		// 	this.categoryPrivateInvestigatorFormGroup.valid,
		// 	this.categoryArmouredCarGuardFormGroup.valid,
		// 	this.categorySecurityGuardFormGroup.valid,
		// 	this.licenceTermFormGroup.valid
		// );

		return this.categoryFormGroup.valid && this.licenceTermFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepContactInformationComplete(): boolean {
		// console.debug('isStepContactInformationComplete', this.businessManagerFormGroup.valid);

		return this.businessManagerFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepControllingMembersAndEmployeesComplete(): boolean {
		// console.debug(
		// 	'isStepControllingMembersAndEmployeesComplete',
		// 	this.controllingMembersFormGroup.valid,
		// 	this.employeesFormGroup.valid
		// );

		return this.controllingMembersFormGroup.valid && this.employeesFormGroup.valid;
	}

	/**
	 * Save the controlling members and employees
	 * @returns
	 */
	saveControllingMembersAndEmployees(): Observable<any> {
		const businessModelFormValue = this.businessModelFormGroup.getRawValue();
		const bizId = businessModelFormValue.bizId;
		const licenceAppId = businessModelFormValue.licenceAppId;

		// if (businessModelFormValue.controllingMembersData.attachments) {
		// TODO save controllingMember attachments
		// }

		const body: Members = {
			employees: this.saveEmployeesBody(businessModelFormValue.employeesData),
			nonSwlControllingMembers: this.saveControllingMembersWithoutSwlBody(
				businessModelFormValue.controllingMembersData
			),
			swlControllingMembers: this.saveControllingMembersWithSwlBody(businessModelFormValue.controllingMembersData),
		};

		return this.bizLicensingService.apiBusinessLicenceApplicationBizIdApplicationIdMembersPost({
			bizId,
			applicationId: licenceAppId,
			body,
		});
	}

	/**
	 * Save the login user profile
	 * @returns
	 */
	saveLoginBusinessProfile(): Observable<StrictHttpResponse<string>> {
		return this.saveBusinessProfile();
	}

	/**
	 * Save the user profile in a flow
	 * @returns
	 */
	saveBusinessProfileAndContinue(applicationTypeCode: ApplicationTypeCode): Observable<StrictHttpResponse<string>> {
		return this.saveBusinessProfile().pipe(
			tap((_resp: StrictHttpResponse<string>) => {
				this.continueToNextStep(applicationTypeCode);
			})
		);
	}

	/**
	 * Save the user profile in a flow
	 * @returns
	 */
	private continueToNextStep(applicationTypeCode: ApplicationTypeCode): void {
		switch (applicationTypeCode) {
			// 	case ApplicationTypeCode.Replacement: {
			// 		this.router.navigateByUrl(
			// 			LicenceApplicationRoutes.pathBusinessLicence(
			// 				LicenceApplicationRoutes.BUSINESS_NEW // TODO change to BUSINESS_REPLACEMENT
			// 			)
			// 		);
			// 		break;
			// 	}
			case ApplicationTypeCode.Renewal: {
				this.router.navigateByUrl(
					LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_RENEW)
				);
				break;
			}
			// 	case ApplicationTypeCode.Update: {
			// 		this.router.navigateByUrl(
			// 			LicenceApplicationRoutes.pathBusinessLicence(
			// 				LicenceApplicationRoutes.BUSINESS_NEW // TODO change to BUSINESS_UPDATE
			// 			)
			// 		);
			// 		break;
			// 	}
			default: {
				this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_NEW));
				break;
			}
		}
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewBusinessLicenceWithProfile(applicationTypeCode?: ApplicationTypeCode): Observable<any> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizProfileService.apiBizIdGet({ id: bizId }).pipe(
			switchMap((profile: BizProfileResponse) => {
				// If the profile is a sole proprietor, then we need to get the associated licence info
				if (profile.soleProprietorSwlContactInfo?.licenceId) {
					return this.licenceService
						.apiLicencesLicenceIdGet({ licenceId: profile.soleProprietorSwlContactInfo?.licenceId })
						.pipe(
							switchMap((soleProprietorSwlLicence: LicenceResponse) => {
								return this.createEmptyLicence(profile, soleProprietorSwlLicence).pipe(
									tap((_resp: any) => {
										this.initialized = true;

										this.commonApplicationService.setApplicationTitle(
											WorkerLicenceTypeCode.SecurityBusinessLicence,
											applicationTypeCode // if undefined, we are just loading the profile.
										);
									})
								);
							})
						);
				}

				return this.createEmptyLicence(profile).pipe(
					tap((_resp: any) => {
						this.initialized = true;

						this.commonApplicationService.setApplicationTitle(
							WorkerLicenceTypeCode.SecurityBusinessLicence,
							applicationTypeCode // if undefined, we are just loading the profile.
						);
					})
				);
			})
		);
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getBusinessLicenceToResume(licenceAppId: string): Observable<BizLicAppResponse> {
		return this.loadExistingBusinessLicenceWithId(licenceAppId).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeData.workerLicenceTypeCode,
					_resp.applicationTypeData.applicationTypeCode
				);
			})
		);
	}

	/**
	 * Load an existing licence application with an id for the provided application type
	 * @param licenceAppId
	 * @returns
	 */
	getBusinessLicenceWithSelection(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode,
		originalLicence: MainLicenceResponse
	): Observable<BizLicAppResponse> {
		return this.getBusinessLicenceOfType(licenceAppId, applicationTypeCode, originalLicence).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeData.workerLicenceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					_resp.originalLicenceData.originalLicenceNumber
				);

				console.debug('[getBusinessLicenceWithSelection] businessModelFormGroup', this.businessModelFormGroup.value);
			})
		);
	}

	getMembersAndEmployees(licenceAppId: string): Observable<any> {
		this.reset();

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return forkJoin([
			this.bizProfileService.apiBizIdGet({ id: bizId }),
			this.bizLicensingService.apiBusinessLicenceApplicationBizIdApplicationIdMembersGet({
				bizId,
				applicationId: licenceAppId,
			}),
		]).pipe(
			switchMap((resps: any[]) => {
				const businessProfile = resps[0];
				const members = resps[1];

				const apis: Observable<any>[] = [];
				members.swlControllingMembers?.forEach((item: SwlContactInfo) => {
					apis.push(
						this.licenceService.apiLicencesLicenceIdGet({
							licenceId: item.licenceId!,
						})
					);
				});
				members.employees?.forEach((item: SwlContactInfo) => {
					apis.push(
						this.licenceService.apiLicencesLicenceIdGet({
							licenceId: item.licenceId!,
						})
					);
				});

				// licenceAppId is used during the save
				this.businessModelFormGroup.patchValue({ licenceAppId: licenceAppId }, { emitEvent: false });

				if (apis.length > 0) {
					return forkJoin(apis).pipe(
						switchMap((licenceResponses: Array<LicenceResponse>) => {
							this.applyControllingMembersWithSwl(members.swlControllingMembers ?? [], licenceResponses);
							this.applyControllingMembersWithoutSwl(members.nonSwlControllingMembers ?? []);
							this.applyEmployees(members.employees ?? [], licenceResponses);

							return this.applyLicenceProfileIntoModel({ businessProfile }).pipe(
								tap((_resp: any) => {
									this.initialized = true;

									this.commonApplicationService.setApplicationTitle(
										// TODO update header text?
										_resp.workerLicenceTypeData.workerLicenceTypeCode,
										_resp.applicationTypeData.applicationTypeCode
									);
								})
							);
						})
					);
				} else {
					return this.applyLicenceProfileIntoModel({ businessProfile }).pipe(
						tap((_resp: any) => {
							this.initialized = true;

							this.commonApplicationService.setApplicationTitle(
								// TODO update header text?
								_resp.workerLicenceTypeData.workerLicenceTypeCode,
								_resp.applicationTypeData.applicationTypeCode
							);
						})
					);
				}
			})
		);
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.initialized = false;
		console.debug('reset.initialized', this.initialized);
		this.hasValueChanged = false;

		this.profileConfirmationFormGroup.reset();
		this.consentAndDeclarationFormGroup.reset();
		this.businessModelFormGroup.reset();

		// clear the alias data - this does not seem to get reset during a formgroup reset
		const bcBranchesArray = this.businessModelFormGroup.get('branchesInBcData.branches') as FormArray;
		while (bcBranchesArray.length) {
			bcBranchesArray.removeAt(0);
		}
		const controllingMembersWithSwlArray = this.businessModelFormGroup.get(
			'controllingMembersData.membersWithSwl'
		) as FormArray;
		while (controllingMembersWithSwlArray.length) {
			controllingMembersWithSwlArray.removeAt(0);
		}
		const controllingMembersWithoutSwlArray = this.businessModelFormGroup.get(
			'controllingMembersData.membersWithoutSwl'
		) as FormArray;
		while (controllingMembersWithoutSwlArray.length) {
			controllingMembersWithoutSwlArray.removeAt(0);
		}
		const employeesArray = this.businessModelFormGroup.get('employeesData.employees') as FormArray;
		while (employeesArray.length) {
			employeesArray.removeAt(0);
		}
	}

	/*************************************************************/
	// COMMON
	/*************************************************************/

	/**
	 * Save the business profile
	 * @returns
	 */
	private saveBusinessProfile(): Observable<StrictHttpResponse<string>> {
		const modelFormValue = this.businessModelFormGroup.getRawValue();

		const branches: Array<BranchInfo> = [];
		if (modelFormValue.branchesInBcData.hasBranchesInBc === BooleanTypeCode.Yes) {
			modelFormValue.branchesInBcData.branches.forEach((item: any) => {
				const branchAddress: Address = {
					addressLine1: item.addressLine1,
					addressLine2: item.addressLine2,
					city: item.city,
					country: item.country,
					postalCode: item.postalCode,
					province: item.province,
				};
				const branch: BranchInfo = {
					branchId: item.branchId,
					branchEmailAddr: item.branchEmailAddr,
					branchManager: item.branchManager,
					branchPhoneNumber: item.branchPhoneNumber,
					branchAddress,
				};
				branches.push(branch);
			});
		}

		const bizBCAddress = modelFormValue.isBcBusinessAddress ? {} : { ...modelFormValue.bcBusinessAddressData };

		const bizMailingAddress = modelFormValue.businessAddressData.isMailingTheSame
			? { ...modelFormValue.businessAddressData }
			: { ...modelFormValue.businessMailingAddressData };

		const bizTypeCode = modelFormValue.businessInformationData.bizTypeCode;

		let soleProprietorLicenceId: null | string = null;
		let soleProprietorSwlEmailAddress: null | string = null;
		let soleProprietorSwlPhoneNumber: null | string = null;

		if (this.isSoleProprietor(bizTypeCode)) {
			soleProprietorLicenceId = modelFormValue.businessInformationData.soleProprietorLicenceId;
			soleProprietorSwlEmailAddress = modelFormValue.businessInformationData.soleProprietorSwlEmailAddress;
			soleProprietorSwlPhoneNumber = modelFormValue.businessInformationData.soleProprietorSwlPhoneNumber;
		} else {
			// Clear out any old data
			this.businessInformationFormGroup.patchValue({
				soleProprietorLicenceId: null,
				soleProprietorLicenceHolderName: null,
				soleProprietorLicenceNumber: null,
				soleProprietorLicenceExpiryDate: null,
				soleProprietorLicenceStatusCode: null,
				soleProprietorSwlEmailAddress: null,
				soleProprietorSwlPhoneNumber: null,
			});
		}

		const body: BizProfileUpdateRequest = {
			bizAddress: { ...modelFormValue.businessAddressData },
			bizBCAddress,
			bizMailingAddress,
			bizTradeName: modelFormValue.businessInformationData.bizTradeName,
			bizTypeCode,
			branches,
			soleProprietorLicenceId,
			soleProprietorSwlEmailAddress,
			soleProprietorSwlPhoneNumber,
		};

		return this.bizProfileService.apiBizBizIdPut$Response({
			bizId: modelFormValue.bizId,
			body,
		});
	}

	/**
	 * Create an empty licence for a profile
	 * @param businessProfile
	 * @param soleProprietorSwlLicence
	 * @returns
	 */
	private createEmptyLicence(
		businessProfile: BizProfileResponse,
		soleProprietorSwlLicence?: LicenceResponse
	): Observable<any> {
		this.reset();

		return this.applyLicenceProfileIntoModel({
			businessProfile,
			applicationTypeCode: ApplicationTypeCode.New,
			soleProprietorSwlLicence,
		});
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	private getBusinessLicenceOfType(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode,
		originalLicence: MainLicenceResponse
	): Observable<any> {
		return this.loadExistingBusinessLicenceWithId(licenceAppId, originalLicence).pipe(
			switchMap((resp: any) => {
				switch (applicationTypeCode) {
					case ApplicationTypeCode.Renewal:
						return this.applyRenewalDataUpdatesToModel(resp);
					case ApplicationTypeCode.Update:
						return this.applyUpdateDataUpdatesToModel(resp);
					default:
						// ApplicationTypeCode.Replacement
						return this.applyReplacementDataUpdatesToModel(resp);
				}
			})
		);
	}

	/**
	 * Loads the current profile and a licence
	 * @returns
	 */
	private loadExistingBusinessLicenceWithId(
		licenceAppId: string,
		originalLicence?: MainLicenceResponse
	): Observable<any> {
		this.reset();

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return forkJoin([
			this.bizLicensingService.apiBusinessLicenceApplicationLicenceAppIdGet({ licenceAppId }),
			this.bizProfileService.apiBizIdGet({ id: bizId }),
		]).pipe(
			switchMap((resps: any[]) => {
				const businessLicenceAppl = resps[0];
				const businessProfile = resps[1];

				const apis: Observable<any>[] = [];
				if (businessLicenceAppl.expiredLicenceId) {
					apis.push(
						this.licenceService.apiLicencesLicenceIdGet({
							licenceId: businessLicenceAppl.expiredLicenceId,
						})
					);
				}
				if (businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId) {
					apis.push(
						this.licenceService.apiLicencesLicenceIdGet({
							licenceId: businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId,
						})
					);
				}
				if (businessProfile.soleProprietorSwlContactInfo?.licenceId) {
					apis.push(
						this.licenceService.apiLicencesLicenceIdGet({
							licenceId: businessProfile.soleProprietorSwlContactInfo?.licenceId,
						})
					);
				}

				businessLicenceAppl.members.employees?.forEach((item: SwlContactInfo) => {
					apis.push(
						this.licenceService.apiLicencesLicenceIdGet({
							licenceId: item.licenceId!,
						})
					);
				});
				businessLicenceAppl.members.swlControllingMembers?.forEach((item: SwlContactInfo) => {
					apis.push(
						this.licenceService.apiLicencesLicenceIdGet({
							licenceId: item.licenceId!,
						})
					);
				});

				// TODO get the branding documents
				// businessLicenceAppl.documentInfos?.filter((item: Document) => item.licenceDocumentTypeCode === LicenceDocumentTypeCode.BizBranding).forEach((item: Document) => {
				// 	apis.push(
				// 		this.licenceService.apiLicencesLicenceIdGet({
				// 			licenceId: item.documentUrlId!,
				// 		})
				// 	);
				// });

				this.applyControllingMembersWithoutSwl(businessLicenceAppl.members.nonSwlControllingMembers ?? []);

				if (apis.length > 0) {
					return forkJoin(apis).pipe(
						switchMap((licenceResponses: Array<LicenceResponse>) => {
							if (businessLicenceAppl.members) {
								this.applyControllingMembersWithSwl(
									businessLicenceAppl.members.swlControllingMembers ?? [],
									licenceResponses
								);
								this.applyEmployees(businessLicenceAppl.members.employees ?? [], licenceResponses);
							}

							let associatedExpiredLicence: LicenceResponse | undefined = undefined;
							if (businessLicenceAppl.expiredLicenceId) {
								associatedExpiredLicence = licenceResponses.find(
									(item: LicenceResponse) => item.licenceId === businessLicenceAppl.expiredLicenceId
								);
							}

							let soleProprietorSwlLicence: LicenceResponse | undefined = undefined;
							if (businessProfile.soleProprietorSwlContactInfo?.licenceId) {
								soleProprietorSwlLicence = licenceResponses.find(
									(item: LicenceResponse) => item.licenceId === businessProfile.soleProprietorSwlContactInfo?.licenceId
								);
							}

							let privateInvestigatorSwlLicence: LicenceResponse | undefined = undefined;
							if (businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId) {
								privateInvestigatorSwlLicence = licenceResponses.find(
									(item: LicenceResponse) =>
										item.licenceId === businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId
								);
							}

							return this.applyLicenceAndProfileIntoModel({
								businessLicenceAppl,
								businessProfile,
								originalLicence,
								associatedExpiredLicence,
								soleProprietorSwlLicence,
								privateInvestigatorSwlLicence,
							});
						})
					);
				}

				return this.applyLicenceAndProfileIntoModel({ businessLicenceAppl, businessProfile, originalLicence });
			})
		);
	}

	/**
	 * Applies the data in the profile and licence into the business model
	 * @returns
	 */
	private applyLicenceAndProfileIntoModel({
		businessLicenceAppl,
		businessProfile,
		originalLicence,
		associatedExpiredLicence,
		soleProprietorSwlLicence,
		privateInvestigatorSwlLicence,
	}: {
		businessLicenceAppl: BizLicAppResponse;
		businessProfile: BizProfileResponse;
		originalLicence?: MainLicenceResponse;
		associatedExpiredLicence?: LicenceResponse;
		soleProprietorSwlLicence?: LicenceResponse;
		privateInvestigatorSwlLicence?: LicenceResponse;
	}): Observable<any> {
		return this.applyLicenceProfileIntoModel({
			businessProfile,
			applicationTypeCode: businessLicenceAppl.applicationTypeCode,
			soleProprietorSwlLicence,
		}).pipe(
			switchMap((_resp: any) => {
				return this.applyLicenceIntoModel({
					businessLicenceAppl,
					associatedExpiredLicence,
					privateInvestigatorSwlLicence,
					originalLicence,
				});
			})
		);
	}

	/**
	 * Applies the data in the licence into the business model
	 * @returns
	 */
	private applyLicenceIntoModel({
		businessLicenceAppl,
		associatedExpiredLicence,
		privateInvestigatorSwlLicence,
		originalLicence,
	}: {
		businessLicenceAppl: BizLicAppResponse;
		associatedExpiredLicence?: LicenceResponse;
		privateInvestigatorSwlLicence?: LicenceResponse;
		originalLicence?: MainLicenceResponse;
	}): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: businessLicenceAppl.workerLicenceTypeCode };
		const applicationTypeData = { applicationTypeCode: businessLicenceAppl.applicationTypeCode };

		const expiredLicenceData = {
			hasExpiredLicence: this.utilService.booleanToBooleanType(businessLicenceAppl.hasExpiredLicence),
			expiredLicenceId: associatedExpiredLicence?.licenceId,
			expiredLicenceHolderName: associatedExpiredLicence?.licenceHolderName,
			expiredLicenceNumber: associatedExpiredLicence?.licenceNumber,
			expiredLicenceExpiryDate: associatedExpiredLicence?.expiryDate,
			expiredLicenceStatusCode: associatedExpiredLicence?.licenceStatusCode,
		};

		const originalLicenceData = {
			originalApplicationId: originalLicence?.licenceAppId ?? null,
			originalLicenceId: originalLicence?.licenceId ?? null,
			originalLicenceNumber: originalLicence?.licenceNumber ?? null,
			originalExpiryDate: originalLicence?.licenceExpiryDate ?? null,
			originalLicenceTermCode: originalLicence?.licenceTermCode ?? null,
			originalBizTypeCode: originalLicence?.bizTypeCode ?? null,
		};

		const companyBrandingAttachments: Array<File> = [];
		const liabilityAttachments: Array<File> = [];
		const categoryArmouredCarGuardAttachments: Array<File> = [];
		const dogAuthorizationAttachments: Array<File> = [];

		let categoryPrivateInvestigatorFormGroup: any = { isInclude: false };
		const categoryArmouredCarGuardFormGroup: any = { isInclude: false };
		const categorySecurityGuardFormGroup: any = { isInclude: false };

		businessLicenceAppl.documentInfos?.forEach((doc: Document) => {
			switch (doc.licenceDocumentTypeCode) {
				case LicenceDocumentTypeCode.BizSecurityDogCertificate: {
					const aFile = this.fileUtilService.dummyFile(doc);
					dogAuthorizationAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.ArmourCarGuardRegistrar: {
					const aFile = this.fileUtilService.dummyFile(doc);
					categoryArmouredCarGuardAttachments.push(aFile);

					categoryArmouredCarGuardFormGroup.expiryDate = doc.expiryDate ?? null;
					break;
				}
				case LicenceDocumentTypeCode.BizInsurance: {
					const aFile = this.fileUtilService.dummyFile(doc);
					liabilityAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.BizBranding: {
					const aFile = this.fileUtilService.dummyFile(doc);
					companyBrandingAttachments.push(aFile);
					break;
				}
			}
		});

		const companyBrandingData = {
			noLogoOrBranding: businessLicenceAppl.noBranding,
			attachments: companyBrandingAttachments,
		};

		const liabilityData = {
			attachments: liabilityAttachments,
		};

		const licenceTermData = {
			licenceTermCode: businessLicenceAppl.licenceTermCode,
		};

		const businessManagerData = {
			givenName: businessLicenceAppl.bizManagerContactInfo?.givenName,
			middleName1: businessLicenceAppl.bizManagerContactInfo?.middleName1,
			middleName2: businessLicenceAppl.bizManagerContactInfo?.middleName2,
			surname: businessLicenceAppl.bizManagerContactInfo?.surname,
			emailAddress: businessLicenceAppl.bizManagerContactInfo?.emailAddress,
			phoneNumber: businessLicenceAppl.bizManagerContactInfo?.phoneNumber,
			isBusinessManager: businessLicenceAppl.applicantIsBizManager,
			applicantGivenName: businessLicenceAppl.applicantContactInfo?.givenName,
			applicantMiddleName1: businessLicenceAppl.applicantContactInfo?.middleName1,
			applicantMiddleName2: businessLicenceAppl.applicantContactInfo?.middleName2,
			applicantSurname: businessLicenceAppl.applicantContactInfo?.surname,
			applicantEmailAddress: businessLicenceAppl.applicantContactInfo?.emailAddress,
			applicantPhoneNumber: businessLicenceAppl.applicantContactInfo?.phoneNumber,
		};

		const categoryData: any = {};

		// default object with all category types
		const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
		workerCategoryTypeCodes.forEach((item: string) => {
			categoryData[item] = false;
		});

		// mark the appropriate category types as true
		businessLicenceAppl.categoryCodes?.forEach((item: WorkerCategoryTypeCode) => {
			categoryData[item as string] = true;
		});

		if (categoryData.PrivateInvestigator && privateInvestigatorSwlLicence) {
			categoryPrivateInvestigatorFormGroup = {
				isInclude: true,
				managerContactId: businessLicenceAppl.privateInvestigatorSwlInfo?.contactId,
				managerLicenceId: businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId,
				managerLicenceHolderName: privateInvestigatorSwlLicence.licenceHolderName,
				managerLicenceNumber: privateInvestigatorSwlLicence.licenceNumber,
				managerLicenceExpiryDate: privateInvestigatorSwlLicence.expiryDate,
				managerLicenceStatusCode: privateInvestigatorSwlLicence.licenceStatusCode,
			};
		}

		if (categoryData.ArmouredCarGuard) {
			categoryArmouredCarGuardFormGroup.isInclude = true;
			categoryArmouredCarGuardFormGroup.attachments = categoryArmouredCarGuardAttachments;
		}

		if (categoryData.SecurityGuard) {
			categorySecurityGuardFormGroup.isInclude = true;
			categorySecurityGuardFormGroup.isRequestDogAuthorization =
				dogAuthorizationAttachments.length > 0 ? BooleanTypeCode.Yes : BooleanTypeCode.No;
			categorySecurityGuardFormGroup.attachments = dogAuthorizationAttachments;
		}

		this.businessModelFormGroup.patchValue(
			{
				licenceAppId: businessLicenceAppl.licenceAppId,
				workerLicenceTypeData,
				applicationTypeData,
				originalLicenceData,

				expiredLicenceData,
				licenceTermData,
				companyBrandingData,
				liabilityData,
				businessManagerData,

				categoryData,
				categoryPrivateInvestigatorFormGroup,
				categoryArmouredCarGuardFormGroup,
				categorySecurityGuardFormGroup,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyLicenceIntoModel] businessModelFormGroup', this.businessModelFormGroup.value);
		return of(this.businessModelFormGroup.value);
	}

	/**
	 * Applies the data in the profile into the business model
	 * @returns
	 */
	private applyLicenceProfileIntoModel({
		businessProfile,
		applicationTypeCode,
		soleProprietorSwlLicence,
	}: {
		businessProfile: BizProfileResponse;
		applicationTypeCode?: ApplicationTypeCode | null;
		soleProprietorSwlLicence?: LicenceResponse;
	}): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };
		const businessInformationData = {
			bizTypeCode: businessProfile.bizTypeCode,
			legalBusinessName: businessProfile.bizLegalName,
			bizTradeName: businessProfile.bizTradeName,
			isBizTradeNameReadonly: !!businessProfile.bizTradeName, // user cannot overwrite value from bceid
			soleProprietorLicenceId: soleProprietorSwlLicence?.licenceId,
			soleProprietorLicenceHolderName: soleProprietorSwlLicence?.licenceHolderName,
			soleProprietorLicenceNumber: soleProprietorSwlLicence?.licenceNumber,
			soleProprietorLicenceExpiryDate: soleProprietorSwlLicence?.expiryDate,
			soleProprietorLicenceStatusCode: soleProprietorSwlLicence?.licenceStatusCode,
			soleProprietorSwlPhoneNumber: businessProfile.soleProprietorSwlPhoneNumber,
			soleProprietorSwlEmailAddress: businessProfile.soleProprietorSwlEmailAddress,
		};

		const bceidUserProfile = this.authUserBceidService.bceidUserProfile;
		const businessManagerData = {
			givenName: bceidUserProfile?.firstName,
			surname: bceidUserProfile?.lastName,
			isBusinessManager: true,
		};

		const bizAddress = businessProfile.bizAddress;
		const businessAddressData = {
			addressSelected: !!bizAddress?.addressLine1,
			addressLine1: bizAddress?.addressLine1,
			addressLine2: bizAddress?.addressLine2,
			city: bizAddress?.city,
			postalCode: bizAddress?.postalCode,
			province: bizAddress?.province,
			country: bizAddress?.country,
			isMailingTheSame: false,
		};

		const bizBCAddress = businessProfile.bizBCAddress;
		const bcBusinessAddressData = {
			addressSelected: !!bizBCAddress?.addressLine1,
			addressLine1: bizBCAddress?.addressLine1,
			addressLine2: bizBCAddress?.addressLine2,
			city: bizBCAddress?.city,
			postalCode: bizBCAddress?.postalCode,
			province: bizBCAddress?.province,
			country: bizBCAddress?.country,
		};

		const bizMailingAddress = businessProfile.bizMailingAddress;
		const businessMailingAddressData = {
			addressSelected: !!bizMailingAddress?.addressLine1,
			addressLine1: bizMailingAddress?.addressLine1,
			addressLine2: bizMailingAddress?.addressLine2,
			city: bizMailingAddress?.city,
			postalCode: bizMailingAddress?.postalCode,
			province: bizMailingAddress?.province,
			country: bizMailingAddress?.country,
		};

		const hasBranchesInBc = (businessProfile.branches ?? []).length > 0;
		const branchesInBcData = { hasBranchesInBc: this.utilService.booleanToBooleanType(hasBranchesInBc) };
		const isBcBusinessAddress = this.utilService.isBcAddress(businessAddressData.province, businessAddressData.country);
		const isBusinessLicenceSoleProprietor = this.isSoleProprietor(businessProfile.bizTypeCode);

		this.businessModelFormGroup.patchValue(
			{
				bizId: businessProfile.bizId,

				workerLicenceTypeData,
				applicationTypeData,
				businessInformationData,
				businessManagerData,

				isBcBusinessAddress,
				isBusinessLicenceSoleProprietor,
				businessAddressData: { ...businessAddressData },
				bcBusinessAddressData: { ...bcBusinessAddressData },
				businessMailingAddressData: { ...businessMailingAddressData },
				branchesInBcData,
			},
			{
				emitEvent: false,
			}
		);

		if (hasBranchesInBc) {
			const branchList = [...businessProfile.branches!].sort((a, b) =>
				this.utilService.sortByDirection(a.branchAddress?.city?.toUpperCase(), b.branchAddress?.city?.toUpperCase())
			);

			const bcBranchesArray = this.businessModelFormGroup.get('branchesInBcData.branches') as FormArray;
			branchList.forEach((branchInfo: BranchInfo) => {
				bcBranchesArray.push(
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

		console.debug('[applyLicenceProfileIntoModel] businessModelFormGroup', this.businessModelFormGroup.value);
		return of(this.businessModelFormGroup.value);
	}

	private applyControllingMembersWithSwl(members: Array<SwlContactInfo>, licences: Array<LicenceResponse>) {
		const controllingMembersWithSwlData: Array<ControllingMemberContactInfo> = [];

		members.forEach((item: SwlContactInfo) => {
			const matchingLicence = licences.find((licence) => licence.licenceId === item.licenceId);

			controllingMembersWithSwlData.push({
				bizContactId: item.bizContactId,
				contactId: matchingLicence?.licenceHolderId,
				licenceId: matchingLicence?.licenceId,
				licenceHolderName: matchingLicence?.licenceHolderName!,
				licenceNumber: matchingLicence?.licenceNumber!,
				licenceStatusCode: matchingLicence?.licenceStatusCode,
				expiryDate: matchingLicence?.expiryDate,
			});
		});

		const sortedControllingMembersWithSwlData = controllingMembersWithSwlData.sort((a, b) =>
			this.utilService.sortByDirection(a.licenceHolderName?.toUpperCase(), b.licenceHolderName?.toUpperCase())
		);

		const controllingMembersWithSwlArray = this.businessModelFormGroup.get(
			'controllingMembersData.membersWithSwl'
		) as FormArray;

		sortedControllingMembersWithSwlData.forEach((item: ControllingMemberContactInfo) => {
			controllingMembersWithSwlArray.push(
				new FormGroup({
					bizContactId: new FormControl(item.bizContactId),
					contactId: new FormControl(item.contactId),
					licenceId: new FormControl(item.licenceId),
					licenceHolderName: new FormControl(item.licenceHolderName),
					licenceNumber: new FormControl(item.licenceNumber),
					licenceStatusCode: new FormControl(item.licenceStatusCode),
					expiryDate: new FormControl(item.expiryDate),
				})
			);
		});
	}

	private applyControllingMembersWithoutSwl(members: Array<NonSwlContactInfo>) {
		const controllingMembersWithoutSwlData: Array<ControllingMemberContactInfo> = [];

		members.forEach((item: NonSwlContactInfo) => {
			controllingMembersWithoutSwlData.push({
				bizContactId: item.bizContactId,
				emailAddress: item.emailAddress,
				givenName: item.givenName,
				middleName1: item.middleName1,
				middleName2: item.middleName2,
				phoneNumber: item.phoneNumber,
				surname: item.surname,
				licenceHolderName: this.utilService.getFullNameWithMiddle(
					item.givenName,
					item.middleName1,
					item.middleName2,
					item.surname
				),
				clearanceStatus: 'todo', // TODO removed hardcoded clearanceStatus
			});
		});

		const sortedControllingMembersWithoutSwlData = controllingMembersWithoutSwlData.sort((a, b) =>
			this.utilService.sortByDirection(a.licenceHolderName?.toUpperCase(), b.licenceHolderName?.toUpperCase())
		);

		const controllingMembersWithoutSwlArray = this.businessModelFormGroup.get(
			'controllingMembersData.membersWithoutSwl'
		) as FormArray;
		sortedControllingMembersWithoutSwlData.forEach((item: ControllingMemberContactInfo) => {
			controllingMembersWithoutSwlArray.push(
				new FormGroup({
					bizContactId: new FormControl(item.bizContactId),
					contactId: new FormControl(item.contactId),
					licenceHolderName: new FormControl(item.licenceHolderName),
					givenName: new FormControl(item.givenName),
					middleName1: new FormControl(item.middleName1),
					middleName2: new FormControl(item.middleName2),
					surname: new FormControl(item.surname),
					phoneNumber: new FormControl(item.phoneNumber),
					emailAddress: new FormControl(item.emailAddress),
					clearanceStatus: new FormControl(item.clearanceStatus),
				})
			);
		});
	}

	private applyEmployees(employees: Array<SwlContactInfo>, licences: Array<LicenceResponse>) {
		const employeesData: Array<ControllingMemberContactInfo> = [];

		employees.forEach((item: SwlContactInfo) => {
			const matchingLicence = licences.find((licence) => licence.licenceId === item.licenceId);

			employeesData.push({
				bizContactId: item.bizContactId,
				contactId: item.contactId!,
				licenceId: item.licenceId!,
				licenceHolderName: matchingLicence?.licenceHolderName!,
				licenceNumber: matchingLicence?.licenceNumber!,
				licenceStatusCode: matchingLicence?.licenceStatusCode,
				expiryDate: matchingLicence?.expiryDate,
				clearanceStatus: 'todo', // TODO removed hardcoded clearanceStatus
			});
		});

		const sortedEmployeesData = employeesData.sort((a, b) =>
			this.utilService.sortByDirection(a.licenceHolderName?.toUpperCase(), b.licenceHolderName?.toUpperCase())
		);

		const employeesArray = this.businessModelFormGroup.get('employeesData.employees') as FormArray;
		sortedEmployeesData.forEach((item: ControllingMemberContactInfo) => {
			employeesArray.push(
				new FormGroup({
					bizContactId: new FormControl(item.bizContactId),
					contactId: new FormControl(item.contactId),
					licenceId: new FormControl(item.licenceId),
					licenceHolderName: new FormControl(item.licenceHolderName),
					licenceNumber: new FormControl(item.licenceNumber),
					licenceStatusCode: new FormControl(item.licenceStatusCode),
					expiryDate: new FormControl(item.expiryDate),
					clearanceStatus: new FormControl(item.clearanceStatus),
				})
			);
		});
	}

	private applyRenewalDataUpdatesToModel(_resp: any): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

		const liabilityData = {
			attachments: [],
		};

		const licenceTermData = {
			licenceTermCode: null,
		};

		this.businessModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
				liabilityData,
				licenceTermData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyRenewalDataUpdatesToModel] businessModel', this.businessModelFormGroup.value);
		return of(this.businessModelFormGroup.value);
	}

	private applyUpdateDataUpdatesToModel(_resp: any): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };

		this.businessModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyUpdateDataUpdatesToModel] businessModel', this.businessModelFormGroup.value);
		return of(this.businessModelFormGroup.value);
	}

	private applyReplacementDataUpdatesToModel(_resp: any): Observable<any> {
		const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

		this.businessModelFormGroup.patchValue(
			{
				licenceAppId: null,
				applicationTypeData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[applyReplacementDataUpdatesToModel] businessModel', this.businessModelFormGroup.value);
		return of(this.businessModelFormGroup.value);
	}
}
