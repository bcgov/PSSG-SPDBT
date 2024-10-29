import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
	ActionResult,
	Address,
	ApplicationOriginTypeCode,
	ApplicationTypeCode,
	BizLicAppCommandResponse,
	BizLicAppResponse,
	BizLicAppSubmitRequest,
	BizPortalUserCreateRequest,
	BizPortalUserListResponse,
	BizPortalUserResponse,
	BizPortalUserUpdateRequest,
	BizProfileResponse,
	BizProfileUpdateRequest,
	BranchInfo,
	ControllingMemberAppInviteTypeCode,
	ControllingMemberInvitesCreateResponse,
	Document,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	Members,
	NonSwlContactInfo,
	ServiceTypeCode,
	SwlContactInfo,
	WorkerCategoryTypeCode,
	WorkerLicenceAppResponse,
} from '@app/api/models';
import {
	BizLicensingService,
	BizMembersService,
	BizPortalUserService,
	BizProfileService,
	LicenceAppDocumentService,
	LicenceService,
	SecurityWorkerLicensingService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ApplicationService, MainLicenceResponse } from '@app/core/services/application.service';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService, SpdFile } from '@app/core/services/file-util.service';
import { LicenceDocument, LicenceDocumentsToSave, UtilService } from '@app/core/services/util.service';
import { BusinessLicenceApplicationRoutes } from '@app/modules/business-licence-application/business-license-application-routes';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
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
import { BusinessApplicationHelper } from './business-application.helper';

export interface ControllingMemberContactInfo extends NonSwlContactInfo {
	licenceId?: string | null;
	contactId?: string | null;
	licenceHolderName: string;
	licenceNumber?: string | null;
	licenceStatusCode?: string;
	expiryDate?: string | null;
	noEmailAddress?: boolean | null;
}

@Injectable({
	providedIn: 'root',
})
export class BusinessApplicationService extends BusinessApplicationHelper {
	businessModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	businessModelFormGroup: FormGroup = this.formBuilder.group({
		bizId: new FormControl(),
		licenceAppId: new FormControl(),
		latestApplicationId: new FormControl(), // placeholder for id

		isControllingMembersWithoutSwlExist: new FormControl(), // placeholder

		soleProprietorSWLAppId: new FormControl(), // placeholder for sole proprietor flow
		soleProprietorSWLAppOriginTypeCode: new FormControl(), // placeholder for sole proprietor flow
		isSoleProprietorSimultaneousSWLAnonymous: new FormControl(), // placeholder for sole proprietor flow
		isSoleProprietorSimultaneousFlow: new FormControl(), // placeholder for sole proprietor flow - whether or not user can return to swl

		isBcBusinessAddress: new FormControl(), // placeholder for flag
		isBusinessLicenceSoleProprietor: new FormControl(), // placeholder for flag
		isRenewalShortForm: new FormControl(), // placeholder for flag
		caseNumber: new FormControl(), // placeholder to save info for display purposes

		originalLicenceData: this.originalLicenceFormGroup,

		serviceTypeData: this.serviceTypeFormGroup,
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
		applicantData: this.applicantFormGroup,
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
		private securityWorkerLicensingService: SecurityWorkerLicensingService,
		private bizProfileService: BizProfileService,
		private bizLicensingService: BizLicensingService,
		private licenceAppDocumentService: LicenceAppDocumentService,
		private bizMembersService: BizMembersService,
		private authUserBceidService: AuthUserBceidService,
		private bizPortalUserService: BizPortalUserService,
		private commonApplicationService: ApplicationService,
		private hotToastService: HotToastService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.businessModelChangedSubscription = this.businessModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					const bizTypeCode = this.businessModelFormGroup.get('businessInformationData.bizTypeCode')?.value;
					const isBusinessLicenceSoleProprietor = this.isSoleProprietor(bizTypeCode);

					const isAddressTheSame = this.businessModelFormGroup.get('businessAddressData.isAddressTheSame')?.value;
					const province = isAddressTheSame
						? this.businessModelFormGroup.get('businessMailingAddressData.province')?.value
						: this.businessModelFormGroup.get('businessAddressData.province')?.value;
					const country = isAddressTheSame
						? this.businessModelFormGroup.get('businessMailingAddressData.country')?.value
						: this.businessModelFormGroup.get('businessAddressData.country')?.value;

					const isBcBusinessAddress = this.utilService.isBcAddress(province, country);

					let isControllingMembersWithoutSwlExist = false;
					if (!isBusinessLicenceSoleProprietor) {
						const membersWithoutSwl =
							this.businessModelFormGroup.get('controllingMembersData.membersWithoutSwl')?.value ?? [];

						isControllingMembersWithoutSwlExist = membersWithoutSwl?.length > 0;
					}

					this.businessModelFormGroup.patchValue(
						{
							isBcBusinessAddress,
							isBusinessLicenceSoleProprietor,
							isControllingMembersWithoutSwlExist,
						},
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

					this.updateModelChangeFlags();

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
	 * Partial Save - Save the licence data and profile data as is.
	 * @returns StrictHttpResponse<BizLicAppCommandResponse>
	 */
	partialSaveBusinessLicenceWithSwlCombinedFlow(isSaveAndExit?: boolean): Observable<any> {
		const businessModelFormValue = this.businessModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(businessModelFormValue);

		return this.saveBusinessProfile().pipe(
			switchMap((_resp: any) => {
				return this.bizLicensingService.apiBusinessLicenceApplicationPost$Response({ body }).pipe(
					take(1),
					tap((resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
						this.resetModelChangeFlags();

						let msg = 'Your application has been saved';
						if (isSaveAndExit) {
							msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
						}
						this.hotToastService.success(msg);

						if (!businessModelFormValue.licenceAppId) {
							this.businessModelFormGroup.patchValue({ licenceAppId: resp.body.licenceAppId! }, { emitEvent: false });
						}
						return resp;
					})
				);
			})
		);
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
				this.resetModelChangeFlags();

				let msg = 'Your application has been saved';
				if (isSaveAndExit) {
					msg = 'Your application has been saved. Please note that inactive applications will expire in 30 days';
				}
				this.hotToastService.success(msg);

				if (!businessModelFormValue.licenceAppId) {
					this.businessModelFormGroup.patchValue({ licenceAppId: resp.body.licenceAppId! }, { emitEvent: false });
				}
				return resp;
			})
		);
	}

	payBusinessLicenceNew(params: { paymentSuccess: string; paymentReason: string }): void {
		const businessModelFormValue = this.businessModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(businessModelFormValue);

		body.agreeToCompleteAndAccurate = true;

		if (businessModelFormValue.isControllingMembersWithoutSwlExist) {
			const membersWithoutSwl = businessModelFormValue.controllingMembersData.membersWithoutSwl;

			// Send the controlling member invitations
			const apis: Observable<any>[] = [];
			membersWithoutSwl.forEach((item: NonSwlContactInfo) => {
				if (item.emailAddress) {
					apis.push(
						this.bizMembersService.apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet({
							bizContactId: item.bizContactId!,
							inviteType: ControllingMemberAppInviteTypeCode.New,
						})
					);
				}
			});

			if (apis.length > 0) {
				forkJoin(apis)
					.pipe(
						switchMap((_resps: any[]) => {
							return this.bizLicensingService.apiBusinessLicenceApplicationSubmitPost$Response({ body });
						})
					)
					.subscribe({
						next: (_resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
							this.hotToastService.success(params.paymentSuccess);
							this.commonApplicationService.onGoToHome();
						},
						error: (error: any) => {
							console.log('An error occurred during save', error);
						},
					});
				return;
			} else {
				this.bizLicensingService.apiBusinessLicenceApplicationSubmitPost$Response({ body }).subscribe({
					next: (_resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
						this.hotToastService.success(params.paymentSuccess);
						this.commonApplicationService.onGoToHome();
					},
					error: (error: any) => {
						console.log('An error occurred during save', error);
					},
				});
				return;
			}
		}

		this.bizLicensingService.apiBusinessLicenceApplicationSubmitPost$Response({ body }).subscribe({
			next: (_resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
				this.hotToastService.success(params.paymentSuccess);
				this.commonApplicationService.payNowBusinessLicence(_resp.body.licenceAppId!, params.paymentReason);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	payBusinessLicenceRenewal(params: { paymentSuccess: string; paymentReason: string }): void {
		const businessModelFormValue = this.businessModelFormGroup.getRawValue();

		if (businessModelFormValue.isControllingMembersWithoutSwlExist) {
			const membersWithoutSwl = businessModelFormValue.controllingMembersData.membersWithoutSwl;

			// Send the controlling member invitations

			const apis: Observable<any>[] = [];
			membersWithoutSwl.forEach((item: NonSwlContactInfo) => {
				apis.push(
					this.bizMembersService.apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet({
						bizContactId: item.bizContactId!,
						inviteType: ControllingMemberAppInviteTypeCode.New,
					})
				);
			});

			if (apis.length > 0) {
				forkJoin(apis)
					.pipe(
						switchMap((_resps: any[]) => {
							return this.submitBusinessLicenceRenewalOrUpdateOrReplace();
						})
					)
					.subscribe({
						next: (_resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
							this.hotToastService.success(params.paymentSuccess);
							this.commonApplicationService.onGoToHome();
						},
						error: (error: any) => {
							console.log('An error occurred during save', error);
						},
					});

				return;
			}
		}

		this.submitBusinessLicenceRenewalOrUpdateOrReplace().subscribe({
			next: (_resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
				this.hotToastService.success(params.paymentSuccess);
				this.commonApplicationService.payNowBusinessLicence(_resp.body.licenceAppId!, params.paymentReason);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	payBusinessLicenceUpdateOrReplace(params: { paymentSuccess: string; paymentReason: string }): void {
		this.submitBusinessLicenceRenewalOrUpdateOrReplace().subscribe({
			next: (_resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
				this.hotToastService.success(params.paymentSuccess);
				this.commonApplicationService.payNowBusinessLicence(_resp.body.licenceAppId!, params.paymentReason);
			},
			error: (error: any) => {
				console.log('An error occurred during save', error);
			},
		});
	}

	getBusinessProfile(): Observable<BizProfileResponse> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizProfileService.apiBizIdGet({ id: bizId });
	}

	submitBusinessLicenceWithSwlCombinedFlowNew(): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
		const businessModelFormValue = this.businessModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(businessModelFormValue);

		body.agreeToCompleteAndAccurate = true;

		// save the business profile then the licence application
		return this.saveBusinessProfile().pipe(
			switchMap((_resp: any) => {
				return this.bizLicensingService.apiBusinessLicenceApplicationSubmitPost$Response({ body });
			})
		);
	}

	submitBusinessLicenceRenewalOrUpdateOrReplace(): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
		const businessModelFormValue = this.businessModelFormGroup.getRawValue();
		const bodyUpsert = this.getSaveBodyBase(businessModelFormValue);
		delete bodyUpsert.documentInfos;

		const body = bodyUpsert as BizLicAppSubmitRequest;

		if (body.applicationTypeCode === ApplicationTypeCode.Update) {
			body.reprint = true;
		}

		const documentsToSave = this.getDocsToSaveBlobs(businessModelFormValue);

		body.agreeToCompleteAndAccurate = true;

		// Create list of APIs to call for the newly added documents
		const documentsToSaveApis: Observable<any>[] = [];

		// Get the keyCode for the existing documents to save.
		const existingDocumentIds: Array<string> = [];

		documentsToSave?.forEach((doc: LicenceDocumentsToSave) => {
			const newDocumentsOnly: Array<Blob> = [];

			doc.documents.forEach((item: Blob) => {
				const spdFile: SpdFile = item as SpdFile;
				if (spdFile.documentUrlId) {
					existingDocumentIds.push(spdFile.documentUrlId);
				} else {
					newDocumentsOnly.push(item);
				}
			});

			if (newDocumentsOnly.length > 0) {
				documentsToSaveApis.push(
					this.licenceAppDocumentService.apiLicenceApplicationDocumentsFilesPost({
						body: {
							Documents: newDocumentsOnly,
							LicenceDocumentTypeCode: doc.licenceDocumentTypeCode,
						},
					})
				);
			}
		});

		if (documentsToSaveApis.length > 0) {
			return forkJoin(documentsToSaveApis).pipe(
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = [...resps];
					// pass in the list of document ids that were in the original
					// application and are still being used
					body.previousDocumentIds = [...existingDocumentIds];

					return this.bizLicensingService.apiBusinessLicenceApplicationChangePost$Response({
						body,
					});
				})
			);
		} else {
			// pass in the list of document ids that were in the original
			// application and are still being used
			body.previousDocumentIds = [...existingDocumentIds];

			return this.bizLicensingService.apiBusinessLicenceApplicationChangePost$Response({
				body,
			});
		}
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

		return this.licenceAppDocumentService.apiLicenceApplicationDocumentsLicenceAppIdFilesPost$Response({
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
		const isBusinessLicenceSoleProprietor = this.businessModelFormGroup.get('isBusinessLicenceSoleProprietor')?.value;

		// console.debug('isStepContactInformationComplete', isBusinessLicenceSoleProprietor, this.applicantFormGroup.valid);

		if (isBusinessLicenceSoleProprietor) return true;

		return this.applicantFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepControllingMembersAndEmployeesComplete(): boolean {
		const isBusinessLicenceSoleProprietor = this.businessModelFormGroup.get('isBusinessLicenceSoleProprietor')?.value;

		// console.debug(
		// 	'isStepControllingMembersAndEmployeesComplete',
		// 	isBusinessLicenceSoleProprietor,
		// 	this.controllingMembersFormGroup.valid,
		// 	this.employeesFormGroup.valid
		// );

		if (isBusinessLicenceSoleProprietor) return true;

		return this.controllingMembersFormGroup.valid && this.employeesFormGroup.valid;
	}

	sendControllingMembersWithoutSwlInvitation(
		bizContactId: string,
		inviteTypeCode: ControllingMemberAppInviteTypeCode
	): Observable<ControllingMemberInvitesCreateResponse> {
		return this.bizMembersService.apiBusinessLicenceApplicationControllingMemberInvitationBizContactIdGet({
			bizContactId,
			inviteType: inviteTypeCode,
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
	 * Save a business manager
	 * @returns
	 */
	getBizPortalUsers(): Observable<BizPortalUserListResponse> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizPortalUserService.apiBusinessBizIdPortalUsersGet({
			bizId,
		});
	}

	/**
	 * Save a business manager
	 * @returns
	 */
	saveBizPortalUserCreate(body: BizPortalUserCreateRequest): Observable<BizPortalUserResponse> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		body.bizId = bizId;

		return this.bizPortalUserService.apiBusinessBizIdPortalUsersPost({
			bizId,
			body,
		});
	}

	/**
	 * Save a business manager
	 * @returns
	 */
	saveBizPortalUserUpdate(userId: string, body: BizPortalUserUpdateRequest): Observable<BizPortalUserResponse> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
		body.bizId = bizId;

		return this.bizPortalUserService.apiBusinessBizIdPortalUsersUserIdPut({
			bizId,
			userId,
			body,
		});
	}

	/**
	 * Delete a business manager
	 * @returns
	 */
	deleteBizPortalUser(userId: string): Observable<ActionResult> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizPortalUserService.apiBusinessBizIdPortalUsersUserIdDelete({
			bizId,
			userId,
		});
	}

	/**
	 * Save the user profile in a flow
	 * @returns
	 */
	private continueToNextStep(applicationTypeCode: ApplicationTypeCode): void {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Replacement: {
				this.router.navigateByUrl(
					BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_REPLACEMENT)
				);
				break;
			}
			case ApplicationTypeCode.Renewal: {
				this.router.navigateByUrl(
					BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_RENEWAL)
				);
				break;
			}
			case ApplicationTypeCode.Update: {
				this.router.navigateByUrl(
					BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_UPDATE)
				);
				break;
			}
			default: {
				this.router.navigateByUrl(
					BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_NEW)
				);
				break;
			}
		}
	}

	/**
	 * Either create an empty licence or continue with the existing business lic app
	 * @returns
	 */
	getNewBusinessLicenceWithSwlCombinedFlow(
		soleProprietorSWLAppId: string | null | undefined, // one of these two must have a value
		soleProprietorBizAppId: string | null | undefined // one of these two must have a value
	): Observable<any> {
		if (soleProprietorSWLAppId) {
			const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

			return this.bizProfileService.apiBizIdGet({ id: bizId }).pipe(
				switchMap((businessProfile: BizProfileResponse) => {
					return this.createEmptyBusinessLicenceWithSwlCombinedFlow({
						soleProprietorSWLAppId,
						businessProfile,
					}).pipe(
						tap((_resp: any) => {
							this.setAsInitialized();

							this.commonApplicationService.setApplicationTitle(
								ServiceTypeCode.SecurityBusinessLicence,
								ApplicationTypeCode.New
							);
						})
					);
				})
			);
		}

		return this.loadExistingBusinessLicenceWithSwlCombinedFlow({
			licenceAppId: soleProprietorBizAppId!,
			applicationTypeCode: ApplicationTypeCode.New,
		}).pipe(
			tap((_resp: any) => {
				this.setAsInitialized();

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode
				);
			})
		);
	}

	/**
	 * Either create an empty licence or continue with the existing business lic app
	 * @returns
	 */
	getRenewalBusinessLicenceWithSwlCombinedFlow(
		soleProprietorSWLAppId: string,
		soleProprietorBizLicId: string
	): Observable<any> {
		return this.createRenewalBusinessLicenceWithSwlCombinedFlow({
			soleProprietorSWLAppId,
			soleProprietorBizLicId,
		}).pipe(
			tap((_resp: any) => {
				this.setAsInitialized();

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					_resp.originalLicenceData.originalLicenceNumber
				);
			})
		);
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewBusinessLicenceWithProfile(applicationTypeCode: ApplicationTypeCode): Observable<any> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizProfileService.apiBizIdGet({ id: bizId }).pipe(
			switchMap((businessProfile: BizProfileResponse) => {
				if (this.isSoleProprietor(businessProfile.bizTypeCode)) {
					// If the profile is a sole proprietor, then we need to get the associated licence info
					if (businessProfile.soleProprietorSwlContactInfo?.licenceId) {
						return this.licenceService
							.apiLicencesLicenceIdGet({ licenceId: businessProfile.soleProprietorSwlContactInfo?.licenceId })
							.pipe(
								switchMap((soleProprietorSwlLicence: LicenceResponse) => {
									return this.createEmptyLicence({ businessProfile, soleProprietorSwlLicence }).pipe(
										tap((_resp: any) => {
											this.setAsInitialized();

											this.commonApplicationService.setApplicationTitle(
												ServiceTypeCode.SecurityBusinessLicence,
												applicationTypeCode
											);
										})
									);
								})
							);
					}

					return this.createEmptyLicence({ businessProfile }).pipe(
						tap((_resp: any) => {
							this.setAsInitialized();

							this.commonApplicationService.setApplicationTitle(
								ServiceTypeCode.SecurityBusinessLicence,
								applicationTypeCode
							);
						})
					);
				}

				return this.bizMembersService
					.apiBusinessBizIdMembersGet({
						bizId,
					})
					.pipe(
						switchMap((controllingMembersAndEmployees: Members) => {
							return this.createEmptyLicence({ businessProfile, controllingMembersAndEmployees }).pipe(
								tap((_resp: any) => {
									this.setAsInitialized();

									this.commonApplicationService.setApplicationTitle(
										ServiceTypeCode.SecurityBusinessLicence,
										applicationTypeCode
									);
								})
							);
						})
					);
			})
		);
	}

	/**
	 * Load the user's business profile
	 * @returns
	 */
	loadBusinessProfile(): Observable<any> {
		this.reset();

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizProfileService.apiBizIdGet({ id: bizId }).pipe(
			switchMap((businessProfile: BizProfileResponse) => {
				const isSoleProprietor = this.isSoleProprietor(businessProfile.bizTypeCode);

				// If the profile is a sole proprietor, then we need to get the associated licence info
				if (isSoleProprietor && businessProfile.soleProprietorSwlContactInfo?.licenceId) {
					return this.licenceService
						.apiLicencesLicenceIdGet({ licenceId: businessProfile.soleProprietorSwlContactInfo?.licenceId })
						.pipe(
							switchMap((soleProprietorSwlLicence: LicenceResponse) => {
								return this.applyLicenceProfileIntoModel({
									businessProfile,
									soleProprietorSwlLicence,
								}).pipe(
									tap((_resp: any) => {
										this.setAsInitialized();

										this.commonApplicationService.setApplicationTitle(ServiceTypeCode.SecurityBusinessLicence);
									})
								);
							})
						);
				}

				return this.applyLicenceProfileIntoModel({
					businessProfile,
				}).pipe(
					tap((_resp: any) => {
						this.setAsInitialized();

						this.commonApplicationService.setApplicationTitle(ServiceTypeCode.SecurityBusinessLicence);
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
	getBusinessLicenceApplToResume(licenceAppId: string, isSoleProprietor: boolean): Observable<BizLicAppResponse> {
		return this.loadPartialBusinessLicenceApplToResume({
			licenceAppId,
			applicationTypeCode: ApplicationTypeCode.New,
			isSoleProprietor,
		}).pipe(
			tap((_resp: any) => {
				this.setAsInitialized();

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
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
		applicationTypeCode: ApplicationTypeCode,
		originalLicence: LicenceResponse | MainLicenceResponse,
		isSoleProprietor: boolean
	): Observable<BizLicAppResponse> {
		return this.getBusinessLicenceOfType(applicationTypeCode, originalLicence, isSoleProprietor).pipe(
			tap((_resp: any) => {
				this.setAsInitialized();

				this.commonApplicationService.setApplicationTitle(
					_resp.serviceTypeData.serviceTypeCode,
					_resp.applicationTypeData.applicationTypeCode,
					_resp.originalLicenceData.originalLicenceNumber
				);

				console.debug('[getBusinessLicenceWithSelection] businessModelFormGroup', this.businessModelFormGroup.value);
			})
		);
	}

	getMembersAndEmployees(applicationIsInProgress: boolean): Observable<any> {
		this.reset();

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizMembersService.apiBusinessBizIdMembersGet({ bizId }).pipe(
			switchMap((members: Members) => {
				return this.applyLicenceProfileMembersIntoModel(members, applicationIsInProgress).pipe(
					tap((_resp: any) => {
						this.setAsInitialized();

						this.commonApplicationService.setApplicationTitle(ServiceTypeCode.SecurityBusinessLicence);
					})
				);
			})
		);
	}

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

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

		console.debug('RESET', this.initialized, this.businessModelFormGroup.value);
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

		const bizTypeCode = modelFormValue.businessInformationData.bizTypeCode;
		const isSoleProprietor = this.isSoleProprietor(bizTypeCode);

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

		const bizManagerContactInfo = isSoleProprietor ? {} : modelFormValue.businessManagerData;

		const bizAddress = modelFormValue.businessAddressData.isAddressTheSame
			? { ...modelFormValue.businessMailingAddressData }
			: { ...modelFormValue.businessAddressData };

		let soleProprietorLicenceId: null | string = null;
		let soleProprietorSwlEmailAddress: null | string = null;
		let soleProprietorSwlPhoneNumber: null | string = null;

		if (isSoleProprietor) {
			soleProprietorLicenceId = modelFormValue.businessInformationData.soleProprietorLicenceId;
			soleProprietorSwlEmailAddress = modelFormValue.businessInformationData.soleProprietorSwlEmailAddress;
			soleProprietorSwlPhoneNumber = modelFormValue.businessInformationData.soleProprietorSwlPhoneNumber;
		} else {
			// Clear out any old data
			this.businessInformationFormGroup.patchValue(
				{
					soleProprietorLicenceId: null,
					soleProprietorLicenceAppId: null,
					soleProprietorLicenceHolderName: null,
					soleProprietorLicenceNumber: null,
					soleProprietorLicenceExpiryDate: null,
					soleProprietorLicenceStatusCode: null,
					soleProprietorSwlEmailAddress: null,
					soleProprietorSwlPhoneNumber: null,
				},
				{
					emitEvent: false,
				}
			);
		}

		const body: BizProfileUpdateRequest = {
			bizAddress,
			bizBCAddress: modelFormValue.isBcBusinessAddress ? bizAddress : { ...modelFormValue.bcBusinessAddressData },
			bizManagerContactInfo,
			bizTradeName: modelFormValue.businessInformationData.bizTradeName,
			bizTypeCode,
			branches,
			soleProprietorLicenceId,
			soleProprietorSwlEmailAddress,
			soleProprietorSwlPhoneNumber,
		};

		return this.bizProfileService
			.apiBizBizIdPut$Response({
				bizId: modelFormValue.bizId,
				body,
			})
			.pipe(
				tap((_resp: any) => {
					this.resetModelChangeFlags();
				})
			);
	}

	private createEmptyBusinessLicenceWithSwlCombinedFlow({
		soleProprietorSWLAppId,
		businessProfile,
	}: {
		soleProprietorSWLAppId: string;
		businessProfile: BizProfileResponse;
	}): Observable<any> {
		this.reset();

		return this.applyLicenceProfileIntoModel({
			businessProfile,
			applicationTypeCode: ApplicationTypeCode.New,
			soleProprietorSWLAppId,
		});
	}

	private createRenewalBusinessLicenceWithSwlCombinedFlow({
		soleProprietorSWLAppId,
		soleProprietorBizLicId,
	}: {
		soleProprietorSWLAppId: string;
		soleProprietorBizLicId: string;
	}): Observable<any> {
		this.reset();

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		const apis = [
			this.bizProfileService.apiBizIdGet({ id: bizId }),
			this.licenceService.apiLicencesLicenceIdGet({ licenceId: soleProprietorBizLicId }),
			this.bizLicensingService.apiBusinessBizIdAppLatestGet({ bizId }),
		];

		return forkJoin(apis).pipe(
			switchMap((resps: Array<any>) => {
				const businessProfile = resps[0];
				const associatedLicence = resps[1];
				const businessLicenceAppl = resps[2];

				// console.debug('************* businessProfile', businessProfile);
				// console.debug('************* associatedLicence', associatedLicence);
				// console.debug('************* businessLicenceAppl', businessLicenceAppl);

				return this.applyLicenceProfileIntoModel({
					businessProfile,
					applicationTypeCode: ApplicationTypeCode.Renewal,
					soleProprietorSWLAppId,
				}).pipe(
					switchMap((_resp1: any) => {
						const brandingDocumentInfos = businessLicenceAppl.documentInfos?.filter(
							(item: Document) => item.licenceDocumentTypeCode === LicenceDocumentTypeCode.BizBranding
						);

						return this.applyLicenceIntoModel({
							businessLicenceAppl,
							associatedLicence,
							brandingDocumentInfos,
						});
					}),
					switchMap((_resp2: any) => {
						return this.applyRenewalDataUpdatesToModel(_resp2);
					})
				);
			})
		);
	}

	/**
	 * Create an empty licence for a profile
	 * @param businessProfile
	 * @param soleProprietorSwlLicence
	 * @returns
	 */
	private createEmptyLicence({
		businessProfile,
		soleProprietorSwlLicence,
		controllingMembersAndEmployees,
	}: {
		businessProfile: BizProfileResponse;
		soleProprietorSwlLicence?: LicenceResponse;
		controllingMembersAndEmployees?: Members;
	}): Observable<any> {
		this.reset();

		if (controllingMembersAndEmployees) {
			return this.applyLicenceProfileMembersIntoModel(controllingMembersAndEmployees, false).pipe(
				switchMap((_resp: any) => {
					return this.applyLicenceProfileIntoModel({
						businessProfile,
						applicationTypeCode: ApplicationTypeCode.New,
						soleProprietorSwlLicence,
					});
				})
			);
		}

		return this.applyLicenceProfileIntoModel({
			businessProfile,
			applicationTypeCode: ApplicationTypeCode.New,
			soleProprietorSwlLicence,
		});
	}

	private applyLicenceProfileMembersIntoModel(members: Members, applicationIsInProgress: boolean) {
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

		const modelFormValue = this.businessModelFormGroup.value;
		const controllingMembersData = modelFormValue.controllingMembersData;
		controllingMembersData.applicationIsInProgress = applicationIsInProgress;

		this.businessModelFormGroup.patchValue({ controllingMembersData }, { emitEvent: false });

		if (apis.length > 0) {
			return forkJoin(apis).pipe(
				switchMap((licenceResponses: Array<LicenceResponse>) => {
					this.applyControllingMembersWithSwl(members.swlControllingMembers ?? [], licenceResponses);
					this.applyControllingMembersWithoutSwl(members.nonSwlControllingMembers ?? []);
					this.applyEmployees(members.employees ?? [], licenceResponses);

					return of(this.businessModelFormGroup.value);
				})
			);
		} else {
			this.applyControllingMembersWithoutSwl(members.nonSwlControllingMembers ?? []);

			return of(this.businessModelFormGroup.value);
		}
	}

	/**
	 * Load an existing licence application with a certain type
	 * @param licenceAppId
	 * @returns
	 */
	private getBusinessLicenceOfType(
		applicationTypeCode: ApplicationTypeCode,
		associatedLicence: LicenceResponse | MainLicenceResponse,
		isSoleProprietor: boolean
	): Observable<any> {
		return this.loadExistingBusinessLicenceWithLatestApp({
			associatedLicence,
			applicationTypeCode,
			isSoleProprietor,
		}).pipe(
			switchMap((resp: any) => {
				switch (applicationTypeCode) {
					case ApplicationTypeCode.Renewal:
						return this.applyRenewalDataUpdatesToModel(resp);
					case ApplicationTypeCode.Update:
						return this.applyUpdateDataUpdatesToModel(resp);
					default:
						return this.applyReplacementDataUpdatesToModel(resp);
				}
			})
		);
	}

	/**
	 * Loads the current profile and a licence
	 * @returns
	 */
	private loadExistingBusinessLicenceWithSwlCombinedFlow({
		licenceAppId,
		applicationTypeCode,
	}: {
		licenceAppId: string;
		applicationTypeCode: ApplicationTypeCode;
	}): Observable<any> {
		return this.loadPartialBusinessLicenceApplToResume({
			licenceAppId,
			applicationTypeCode,
			isSoleProprietor: true,
		});
	}

	/**
	 * Loads the current profile and a licence
	 * @returns
	 */
	private loadPartialBusinessLicenceApplToResume({
		licenceAppId,
		applicationTypeCode,
		isSoleProprietor,
	}: {
		licenceAppId: string;
		applicationTypeCode: ApplicationTypeCode;
		isSoleProprietor: boolean;
	}): Observable<any> {
		this.reset();

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		const apis: Observable<any>[] = [
			this.bizLicensingService.apiBusinessLicenceApplicationLicenceAppIdGet({ licenceAppId }),
			this.bizProfileService.apiBizIdGet({ id: bizId }),
		];

		if (!isSoleProprietor) {
			apis.push(this.bizMembersService.apiBusinessBizIdMembersGet({ bizId }));
		}

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const businessLicenceAppl = resps[0];
				const businessProfile = resps[1];
				const businessMembers = isSoleProprietor ? undefined : resps[2];

				return this.loadBusinessApplAndProfile({
					applicationTypeCode,
					businessLicenceAppl,
					businessProfile,
					businessMembers,
				});
			})
		);
	}

	/**
	 * Loads the current profile and a licence with the latest application.
	 * @returns
	 */
	private loadExistingBusinessLicenceWithLatestApp({
		associatedLicence,
		applicationTypeCode,
		isSoleProprietor,
	}: {
		associatedLicence?: LicenceResponse | MainLicenceResponse;
		applicationTypeCode: ApplicationTypeCode;
		isSoleProprietor: boolean;
	}): Observable<any> {
		this.reset();

		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		const apis: Observable<any>[] = [
			this.bizLicensingService.apiBusinessBizIdAppLatestGet({ bizId }),
			this.bizProfileService.apiBizIdGet({ id: bizId }),
		];

		if (!isSoleProprietor) {
			apis.push(this.bizMembersService.apiBusinessBizIdMembersGet({ bizId }));
		}

		return forkJoin(apis).pipe(
			switchMap((resps: any[]) => {
				const businessLicenceAppl = resps[0];
				const businessProfile = resps[1];
				const businessMembers = isSoleProprietor ? undefined : resps[2];

				return this.loadBusinessApplAndProfile({
					applicationTypeCode,
					businessLicenceAppl,
					businessProfile,
					businessMembers,
					associatedLicence,
				});
			})
		);
	}

	/**
	 * Loads the a business application and profile into the business model
	 * @returns
	 */
	private loadBusinessApplAndProfile({
		applicationTypeCode,
		businessLicenceAppl,
		businessProfile,
		businessMembers,
		associatedLicence,
	}: {
		applicationTypeCode: ApplicationTypeCode;
		businessLicenceAppl: BizLicAppResponse;
		businessProfile: BizProfileResponse;
		businessMembers?: Members;
		associatedLicence?: LicenceResponse | MainLicenceResponse;
	}) {
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
		if (this.isSoleProprietor(businessProfile.bizTypeCode) && businessProfile.soleProprietorSwlContactInfo?.licenceId) {
			apis.push(
				this.licenceService.apiLicencesLicenceIdGet({
					licenceId: businessProfile.soleProprietorSwlContactInfo?.licenceId,
				})
			);
		}

		if (businessMembers) {
			businessMembers.employees?.forEach((item: SwlContactInfo) => {
				apis.push(
					this.licenceService.apiLicencesLicenceIdGet({
						licenceId: item.licenceId!,
					})
				);
			});
			businessMembers.swlControllingMembers?.forEach((item: SwlContactInfo) => {
				apis.push(
					this.licenceService.apiLicencesLicenceIdGet({
						licenceId: item.licenceId!,
					})
				);
			});
		}

		const brandingDocumentInfos =
			applicationTypeCode === ApplicationTypeCode.New || applicationTypeCode === ApplicationTypeCode.Renewal
				? businessLicenceAppl.documentInfos?.filter(
						(item: Document) => item.licenceDocumentTypeCode === LicenceDocumentTypeCode.BizBranding
					)
				: [];

		if (businessMembers) {
			this.applyControllingMembersWithoutSwl(businessMembers.nonSwlControllingMembers ?? []);
		}

		if (apis.length > 0) {
			return forkJoin(apis).pipe(
				switchMap((licenceResponses: Array<LicenceResponse>) => {
					if (businessMembers) {
						this.applyControllingMembersWithSwl(businessMembers.swlControllingMembers ?? [], licenceResponses);
						this.applyEmployees(businessMembers.employees ?? [], licenceResponses);
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
							(item: LicenceResponse) => item.licenceId === businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId
						);
					}

					return this.applyLicenceAndProfileIntoModel({
						businessLicenceAppl,
						businessProfile,
						associatedLicence,
						associatedExpiredLicence,
						soleProprietorSwlLicence,
						privateInvestigatorSwlLicence,
						brandingDocumentInfos,
					});
				})
			);
		}

		return this.applyLicenceAndProfileIntoModel({
			businessLicenceAppl,
			businessProfile,
			associatedLicence,
			brandingDocumentInfos,
		});
	}

	/**
	 * Loads the current branding files into the business model
	 * @returns
	 */
	private loadBrandingFiles(brandingDocumentInfos: Array<Document>): Observable<any> {
		if (brandingDocumentInfos.length === 0) {
			return of(this.businessModelFormGroup.value);
		}

		const apis: Observable<any>[] = [];

		// get the branding documents
		brandingDocumentInfos.forEach((item: Document) => {
			apis.push(
				this.bizLicensingService.apiBusinessLicenceApplicationBrandImageDocumentIdGet$Response({
					documentId: item.documentUrlId!,
				})
			);
		});

		const companyBrandingAttachments: Array<SpdFile> = [];
		return forkJoin(apis).pipe(
			switchMap((resps: Array<StrictHttpResponse<Blob>>) => {
				resps.forEach((item: StrictHttpResponse<Blob>, index) => {
					const fileName = this.fileUtilService.getFileNameFromHeader(item.headers);
					const doc: Document = brandingDocumentInfos[index];

					const imageFile = new File([item.body], fileName, { type: item.body.type });
					const imageSpdFile: SpdFile = imageFile as SpdFile;
					imageSpdFile.documentUrlId = doc.documentUrlId;

					companyBrandingAttachments.push(imageSpdFile);
				});

				const companyBrandingData = {
					noLogoOrBranding: companyBrandingAttachments.length === 0,
					attachments: companyBrandingAttachments,
				};

				this.businessModelFormGroup.patchValue(
					{
						companyBrandingData,
					},
					{
						emitEvent: false,
					}
				);

				return of(this.businessModelFormGroup.value);
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
		associatedLicence,
		associatedExpiredLicence,
		soleProprietorSwlLicence,
		privateInvestigatorSwlLicence,
		brandingDocumentInfos,
	}: {
		businessLicenceAppl: BizLicAppResponse;
		businessProfile: BizProfileResponse;
		associatedLicence?: LicenceResponse | MainLicenceResponse;
		associatedExpiredLicence?: LicenceResponse;
		soleProprietorSwlLicence?: LicenceResponse;
		privateInvestigatorSwlLicence?: LicenceResponse;
		brandingDocumentInfos?: Array<Document>;
	}): Observable<any> {
		console.debug('[applyLicenceAndProfileIntoModel] businessLicenceAppl', businessLicenceAppl);
		console.debug('[applyLicenceAndProfileIntoModel] soleProprietorSwlLicence', soleProprietorSwlLicence);

		return this.applyLicenceProfileIntoModel({
			businessProfile,
			applicationTypeCode: businessLicenceAppl.applicationTypeCode,
			soleProprietorSwlLicence,
			soleProprietorSWLAppId: businessLicenceAppl.soleProprietorSWLAppId ?? undefined,
		}).pipe(
			switchMap((_resp: any) => {
				return this.applyLicenceIntoModel({
					businessLicenceAppl,
					associatedExpiredLicence,
					privateInvestigatorSwlLicence,
					associatedLicence,
					brandingDocumentInfos,
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
		associatedLicence,
		brandingDocumentInfos,
	}: {
		businessLicenceAppl: BizLicAppResponse;
		associatedExpiredLicence?: LicenceResponse;
		privateInvestigatorSwlLicence?: LicenceResponse;
		associatedLicence?: LicenceResponse | MainLicenceResponse;
		brandingDocumentInfos?: Array<Document>;
	}): Observable<any> {
		const serviceTypeData = { serviceTypeCode: businessLicenceAppl.serviceTypeCode };
		const applicationTypeData = { applicationTypeCode: businessLicenceAppl.applicationTypeCode };

		const hasExpiredLicence = businessLicenceAppl.hasExpiredLicence ?? false;
		const expiredLicenceData = this.getExpiredLicenceData(
			this.utilService.booleanToBooleanType(hasExpiredLicence),
			associatedExpiredLicence
		);

		const originalLicenceData = {
			originalApplicationId: associatedLicence?.licenceAppId ?? null,
			originalLicenceId: associatedLicence?.licenceId ?? null,
			originalLicenceNumber: associatedLicence?.licenceNumber ?? null,
			originalExpiryDate: associatedLicence?.expiryDate ?? null,
			originalLicenceTermCode: associatedLicence?.licenceTermCode ?? null,
			originalBizTypeCode: associatedLicence?.bizTypeCode ?? null,
			originalCategoryCodes: associatedLicence?.categoryCodes ?? null,
			originalCarryAndUseRestraints: associatedLicence?.carryAndUseRestraints ?? null,
			originalUseDogs: associatedLicence?.useDogs ?? null,
			originalIsDogsPurposeDetectionDrugs: associatedLicence?.isDogsPurposeDetectionDrugs ?? null,
			originalIsDogsPurposeDetectionExplosives: associatedLicence?.isDogsPurposeDetectionExplosives ?? null,
			originalIsDogsPurposeProtection: associatedLicence?.isDogsPurposeProtection ?? null,
		};

		const companyBrandingAttachments: Array<File> = [];
		const liabilityAttachments: Array<File> = [];
		const categoryArmouredCarGuardAttachments: Array<File> = [];
		const dogAuthorizationAttachments: Array<File> = [];

		let categoryPrivateInvestigatorFormGroup: any = { isInclude: false };
		let categoryArmouredCarGuardFormGroup: any = { isInclude: false };
		let categorySecurityGuardFormGroup: any = { isInclude: false };

		businessLicenceAppl.documentInfos?.forEach((doc: Document) => {
			switch (doc.licenceDocumentTypeCode) {
				case LicenceDocumentTypeCode.BizSecurityDogCertificate: {
					if (associatedLicence) {
						// use the data from the licence when it exists. See below
						break;
					}

					const aFile = this.fileUtilService.dummyFile(doc);
					dogAuthorizationAttachments.push(aFile);
					break;
				}
				case LicenceDocumentTypeCode.ArmourCarGuardRegistrar: {
					const aFile = this.fileUtilService.dummyFile(doc);
					categoryArmouredCarGuardAttachments.push(aFile);
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

		const companyBrandingData =
			brandingDocumentInfos?.length === 0
				? {
						noLogoOrBranding: businessLicenceAppl.noBranding,
						attachments: companyBrandingAttachments,
					}
				: { noLogoOrBranding: true, attachments: [] };

		const liabilityData = {
			attachments: liabilityAttachments,
		};

		const licenceTermData = {
			licenceTermCode: businessLicenceAppl.licenceTermCode,
		};

		const applicantData = {
			applicantIsBizManager: businessLicenceAppl.applicantIsBizManager,
			givenName: businessLicenceAppl.applicantContactInfo?.givenName ?? null,
			middleName1: businessLicenceAppl.applicantContactInfo?.middleName1 ?? null,
			middleName2: businessLicenceAppl.applicantContactInfo?.middleName2 ?? null,
			surname: businessLicenceAppl.applicantContactInfo?.surname ?? null,
			emailAddress: businessLicenceAppl.applicantContactInfo?.emailAddress ?? null,
			phoneNumber: businessLicenceAppl.applicantContactInfo?.phoneNumber ?? null,
		};

		const categoryData: any = {};

		// default object with all category types
		const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
		workerCategoryTypeCodes.forEach((item: string) => {
			categoryData[item] = false;
		});

		console.debug('[applyLicenceIntoModel] isSoleProprietor', this.isSoleProprietor(businessLicenceAppl.bizTypeCode));
		console.debug('[applyLicenceIntoModel] associatedLicence', associatedLicence);

		const categoryCodes = businessLicenceAppl.categoryCodes ?? [];
		if (this.isSoleProprietor(businessLicenceAppl.bizTypeCode)) {
			// if sole proprietor business application, use the 'businessInformation.soleProprietorCategoryCodes'
			// as the list of available category options
			const businessInformation = this.businessInformationFormGroup.value;
			if (categoryCodes.length > 0) {
				// there are already code that are selected
				businessInformation.soleProprietorCategoryCodes?.forEach((item: string) => {
					categoryData[item] = categoryCodes.findIndex((cat: WorkerCategoryTypeCode) => (cat as string) === item) >= 0;
				});
			} else {
				businessInformation.soleProprietorCategoryCodes?.forEach((item: string) => {
					categoryData[item] = true;
				});
			}
		} else if (associatedLicence) {
			// if there is an associated licence, use the categories in there as selected
			// mark the appropriate category types as true
			associatedLicence?.categoryCodes?.forEach((item: WorkerCategoryTypeCode) => {
				categoryData[item as string] = true;
			});
		} else {
			// otherwise, resuming a new licence. Mark the appropriate categories as selected
			categoryCodes.forEach((item: string) => {
				categoryData[item] = categoryCodes.findIndex((cat: WorkerCategoryTypeCode) => (cat as string) === item) >= 0;
			});
		}

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
			categoryArmouredCarGuardFormGroup = {
				isInclude: true,
				attachments: categoryArmouredCarGuardAttachments,
			};
		}

		if (categoryData.SecurityGuard) {
			// If an associatedLicence exists, use the dog data from here
			if (associatedLicence) {
				const useDogs = associatedLicence.useDogs;
				const useDogsYesNo = this.utilService.booleanToBooleanType(associatedLicence.useDogs);

				if (useDogs) {
					associatedLicence.dogDocumentInfos?.forEach((doc: Document) => {
						const aFile = this.fileUtilService.dummyFile(doc);
						dogAuthorizationAttachments.push(aFile);
					});
				}

				categorySecurityGuardFormGroup = {
					isInclude: true,
					useDogs: useDogsYesNo,
					dogsPurposeFormGroup: {
						isDogsPurposeDetectionDrugs: useDogs ? associatedLicence?.isDogsPurposeDetectionDrugs : null,
						isDogsPurposeDetectionExplosives: useDogs ? associatedLicence?.isDogsPurposeDetectionExplosives : null,
						isDogsPurposeProtection: useDogs ? associatedLicence?.isDogsPurposeProtection : null,
					},
					attachments: useDogs ? dogAuthorizationAttachments : null,
				};
			} else {
				// otherwise, use the dog data from the application
				const useDogs = businessLicenceAppl.useDogs;
				const useDogsYesNo = this.utilService.booleanToBooleanType(businessLicenceAppl.useDogs);

				categorySecurityGuardFormGroup = {
					isInclude: true,
					useDogs: useDogsYesNo,
					dogsPurposeFormGroup: {
						isDogsPurposeDetectionDrugs: useDogs ? businessLicenceAppl?.isDogsPurposeDetectionDrugs : null,
						isDogsPurposeDetectionExplosives: useDogs ? businessLicenceAppl?.isDogsPurposeDetectionExplosives : null,
						isDogsPurposeProtection: useDogs ? businessLicenceAppl?.isDogsPurposeProtection : null,
					},
					attachments: useDogs ? dogAuthorizationAttachments : null,
				};
			}
		}

		const soleProprietorSWLAppId = businessLicenceAppl.soleProprietorSWLAppId ?? null;

		let isSoleProprietorSimultaneousFlow: boolean | null = null;
		if (associatedLicence) {
			if ('isSimultaneousFlow' in associatedLicence) {
				isSoleProprietorSimultaneousFlow = associatedLicence.isSimultaneousFlow;
			} else {
				isSoleProprietorSimultaneousFlow = !!associatedLicence.linkedSoleProprietorLicenceId;
			}
		} else {
			isSoleProprietorSimultaneousFlow = !!soleProprietorSWLAppId;
		}

		const isSoleProprietorSimultaneousSWLAnonymous = isSoleProprietorSimultaneousFlow
			? businessLicenceAppl.soleProprietorSWLAppOriginTypeCode != ApplicationOriginTypeCode.Portal
			: null;

		this.businessModelFormGroup.patchValue(
			{
				licenceAppId: businessLicenceAppl.licenceAppId,
				latestApplicationId: businessLicenceAppl.licenceAppId,

				soleProprietorSWLAppId,
				isSoleProprietorSimultaneousFlow,
				isSoleProprietorSimultaneousSWLAnonymous,

				serviceTypeData,
				applicationTypeData,
				originalLicenceData,
				caseNumber: businessLicenceAppl.caseNumber,

				expiredLicenceData,
				licenceTermData,
				companyBrandingData,
				liabilityData,
				applicantData,

				categoryData,
				categoryPrivateInvestigatorFormGroup,
				categoryArmouredCarGuardFormGroup,
				categorySecurityGuardFormGroup,
			},
			{
				emitEvent: false,
			}
		);

		if (brandingDocumentInfos?.length) {
			return this.loadBrandingFiles(brandingDocumentInfos);
		}

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
		soleProprietorSWLAppId,
	}: {
		businessProfile: BizProfileResponse;
		applicationTypeCode?: ApplicationTypeCode | null;
		soleProprietorSwlLicence?: LicenceResponse;
		soleProprietorSWLAppId?: string;
	}): Observable<any> {
		console.debug('[applyLicenceProfileIntoModel] soleProprietor', soleProprietorSwlLicence, soleProprietorSWLAppId);

		const serviceTypeData = { serviceTypeCode: ServiceTypeCode.SecurityBusinessLicence };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };

		const bceidBizTradeName = this.authUserBceidService.bceidUserProfile?.bceidBizTradeName;

		const businessInformationData: any = {
			bizTypeCode: businessProfile.bizTypeCode,
			legalBusinessName: businessProfile.bizLegalName,
			bizTradeName: businessProfile.bizTradeName,
			isBizTradeNameReadonly: !!bceidBizTradeName, // user cannot overwrite value from bceid
			soleProprietorLicenceId: null,
			soleProprietorLicenceAppId: null,
			soleProprietorCategoryCodes: null,
			soleProprietorLicenceHolderName: null,
			soleProprietorLicenceNumber: null,
			soleProprietorLicenceExpiryDate: null,
			soleProprietorLicenceStatusCode: null,
			soleProprietorSwlPhoneNumber: businessProfile.soleProprietorSwlPhoneNumber,
			soleProprietorSwlEmailAddress: businessProfile.soleProprietorSwlEmailAddress,
		};

		if (soleProprietorSwlLicence) {
			// if in the business profile, the user chose a swl licence (for sole proprietor)
			businessInformationData.soleProprietorLicenceId = soleProprietorSwlLicence.licenceId;
			businessInformationData.soleProprietorLicenceAppId = soleProprietorSwlLicence.licenceAppId;
			businessInformationData.soleProprietorCategoryCodes = soleProprietorSwlLicence.categoryCodes;
			businessInformationData.soleProprietorLicenceHolderName = soleProprietorSwlLicence.licenceHolderName;
			businessInformationData.soleProprietorLicenceNumber = soleProprietorSwlLicence.licenceNumber;
			businessInformationData.soleProprietorLicenceExpiryDate = soleProprietorSwlLicence.expiryDate;
			businessInformationData.soleProprietorLicenceStatusCode = soleProprietorSwlLicence.licenceStatusCode;
		}

		const businessManagerData = {
			givenName: businessProfile.bizManagerContactInfo?.givenName,
			middleName1: businessProfile.bizManagerContactInfo?.middleName1,
			middleName2: businessProfile.bizManagerContactInfo?.middleName2,
			surname: businessProfile.bizManagerContactInfo?.surname,
			emailAddress: businessProfile.bizManagerContactInfo?.emailAddress,
			phoneNumber: businessProfile.bizManagerContactInfo?.phoneNumber,
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
			isAddressTheSame: false,
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

				serviceTypeData,
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

		// if there is no applicationTypeCode, then we are supporting just loading the profile
		if (applicationTypeCode) {
			if (soleProprietorSwlLicence?.licenceAppId) {
				// business licence is sole proprietor
				return this.applyBusinessLicenceSoleProprietorSelection(soleProprietorSwlLicence);
			} else if (soleProprietorSWLAppId) {
				// using sole proprietor combined flow
				return this.applyBusinessLicenceSoleProprietorSwl(soleProprietorSWLAppId);
			}
		}

		console.debug('[applyLicenceProfileIntoModel] businessModelFormGroup', this.businessModelFormGroup.value);
		return of(this.businessModelFormGroup.value);
	}

	private applyBusinessLicenceSoleProprietorSwl(licenceAppId: string): Observable<any> {
		return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
			tap((resp: WorkerLicenceAppResponse) => {
				console.debug('[applyBusinessLicenceSoleProprietorSwl] resp', resp);

				const businessInformationData = this.businessModelFormGroup.get('businessInformationData')?.value;

				businessInformationData.bizTypeCode = resp.bizTypeCode;
				businessInformationData.soleProprietorCategoryCodes = resp.categoryCodes;

				const categoryData: any = {};
				const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
				workerCategoryTypeCodes.forEach((item: string) => {
					categoryData[item] = false;
				});

				businessInformationData.soleProprietorCategoryCodes?.forEach((item: string) => {
					categoryData[item] = true;
				});

				const isBusinessLicenceSoleProprietor = this.isSoleProprietor(resp.bizTypeCode);

				let categoryArmouredCarGuardFormGroup: any = { isInclude: false };
				let categorySecurityGuardFormGroup: any = { isInclude: false };

				if (categoryData.ArmouredCarGuard) {
					categoryArmouredCarGuardFormGroup = {
						isInclude: true,
						attachments: [],
					};
				}

				if (categoryData.SecurityGuard) {
					const useDogs = resp.useDogs;
					const useDogsYesNo = this.utilService.booleanToBooleanType(resp.useDogs);

					categorySecurityGuardFormGroup = {
						isInclude: true,
						useDogs: useDogsYesNo,
						dogsPurposeFormGroup: {
							isDogsPurposeDetectionDrugs: useDogs ? resp.isDogsPurposeDetectionDrugs : null,
							isDogsPurposeDetectionExplosives: useDogs ? resp.isDogsPurposeDetectionExplosives : null,
							isDogsPurposeProtection: useDogs ? resp.isDogsPurposeProtection : null,
						},
						attachments: [],
					};
				}

				this.businessModelFormGroup.patchValue(
					{
						soleProprietorSWLAppId: licenceAppId,
						soleProprietorSWLAppOriginTypeCode: resp.applicationOriginTypeCode,
						isSoleProprietorSimultaneousFlow: true,
						isSoleProprietorSimultaneousSWLAnonymous:
							resp.applicationOriginTypeCode != ApplicationOriginTypeCode.Portal,
						isBusinessLicenceSoleProprietor,
						businessInformationData,
						categoryData,
						categoryArmouredCarGuardFormGroup,
						categorySecurityGuardFormGroup,
					},
					{
						emitEvent: false,
					}
				);
			}),
			switchMap((_resp: any) => {
				return of(this.businessModelFormGroup.value);
			})
		);
	}

	applyBusinessLicenceSoleProprietorSelection(soleProprietorSwlLicence: LicenceResponse): Observable<any> {
		console.debug('[applyBusinessLicenceSoleProprietorSelection] soleProprietorSwlLicence', soleProprietorSwlLicence);

		const businessInformationData = this.businessModelFormGroup.get('businessInformationData')?.value;
		businessInformationData.soleProprietorCategoryCodes = soleProprietorSwlLicence.categoryCodes;

		const categoryData: any = {};

		// default object with all category types
		const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
		workerCategoryTypeCodes.forEach((item: string) => {
			categoryData[item] = false;
		});

		soleProprietorSwlLicence.categoryCodes?.forEach((item: string) => {
			categoryData[item] = true;
		});

		let categoryArmouredCarGuardFormGroup: any = { isInclude: false };
		let categorySecurityGuardFormGroup: any = { isInclude: false };
		const categoryPrivateInvestigatorFormGroup: any = { isInclude: false };

		if (categoryData.ArmouredCarGuard) {
			categoryArmouredCarGuardFormGroup = {
				isInclude: true,
				attachments: [],
			};
		}

		if (categoryData.SecurityGuard) {
			const useDogs = soleProprietorSwlLicence.useDogs;
			const useDogsYesNo = this.utilService.booleanToBooleanType(soleProprietorSwlLicence.useDogs);

			categorySecurityGuardFormGroup = {
				isInclude: true,
				useDogs: useDogsYesNo,
				dogsPurposeFormGroup: {
					isDogsPurposeDetectionDrugs: useDogs ? soleProprietorSwlLicence.isDogsPurposeDetectionDrugs : null,
					isDogsPurposeDetectionExplosives: useDogs ? soleProprietorSwlLicence.isDogsPurposeDetectionExplosives : null,
					isDogsPurposeProtection: useDogs ? soleProprietorSwlLicence.isDogsPurposeProtection : null,
				},
				attachments: [],
			};
		}

		this.businessModelFormGroup.patchValue(
			{
				soleProprietorSWLAppId: null,
				isSoleProprietorSimultaneousSWLAnonymous: null,
				isSoleProprietorSimultaneousFlow: null,

				businessInformationData,
				categoryData,
				categoryArmouredCarGuardFormGroup,
				categoryPrivateInvestigatorFormGroup,
				categorySecurityGuardFormGroup,
			},
			{
				emitEvent: false,
			}
		);

		return of(this.businessModelFormGroup.value);
	}

	private applyControllingMembersWithSwl(members: Array<SwlContactInfo>, licences: Array<LicenceResponse>): void {
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

	private applyControllingMembersWithoutSwl(members: Array<NonSwlContactInfo>): void {
		const controllingMembersWithoutSwlData: Array<ControllingMemberContactInfo> = [];

		members.forEach((item: NonSwlContactInfo) => {
			controllingMembersWithoutSwlData.push({
				bizContactId: item.bizContactId,
				emailAddress: item.emailAddress,
				noEmailAddress: !item.emailAddress,
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
				controllingMemberAppStatusCode: item.controllingMemberAppStatusCode,
				inviteStatusCode: item.inviteStatusCode,
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
					noEmailAddress: new FormControl(item.noEmailAddress),
					controllingMemberAppStatusCode: new FormControl(item.controllingMemberAppStatusCode),
					inviteStatusCode: new FormControl(item.inviteStatusCode),
				})
			);
		});
	}

	private applyEmployees(employees: Array<SwlContactInfo>, licences: Array<LicenceResponse>): void {
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
