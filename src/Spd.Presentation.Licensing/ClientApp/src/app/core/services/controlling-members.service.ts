import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
	ApplicationTypeCode,
	BizLicAppCommandResponse,
	BizLicAppSubmitRequest,
	BizProfileResponse,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
} from '@app/api/models';
import {
	BizLicensingService,
	BizPortalUserService,
	BizProfileService,
	LicenceService,
	SecurityWorkerLicensingService,
} from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { ApplicationService } from '@app/core/services/application.service';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { ConfigService } from '@app/core/services/config.service';
import { FileUtilService } from '@app/core/services/file-util.service';
import { LicenceDocument, UtilService } from '@app/core/services/util.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject, Observable, Subscription, debounceTime, distinctUntilChanged, take, tap } from 'rxjs';
import { ControllingMembersHelper } from './controlling-members.helper';

// export interface ControllingMemberContactInfo extends NonSwlContactInfo {
// 	licenceId?: string | null;
// 	contactId?: string | null;
// 	licenceHolderName: string;
// 	licenceNumber?: string | null;
// 	licenceStatusCode?: string;
// 	expiryDate?: string | null;
// 	clearanceStatus?: string | null;
// }

@Injectable({
	providedIn: 'root',
})
export class ControllingMembersService extends ControllingMembersHelper {
	controllingMembersModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	controllingMembersModelFormGroup: FormGroup = this.formBuilder.group({
		// bizId: new FormControl(),
		licenceAppId: new FormControl(),

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,

		personalInformationData: this.personalInformationFormGroup,
		aliasesData: this.aliasesFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,

		citizenshipData: this.citizenshipFormGroup,
		fingerprintProofData: this.fingerprintProofFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		// bcSecurityLicenceHistoryData: this.bcSecurityLicenceHistoryFormGroup,
		policeBackgroundData: this.policeBackgroundFormGroup,
		mentalHealthConditionsData: this.mentalHealthConditionsFormGroup,
	});

	controllingMembersModelChangedSubscription!: Subscription;

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
		private authUserBceidService: AuthUserBceidService,
		private bizPortalUserService: BizPortalUserService,
		private commonApplicationService: ApplicationService,
		private hotToastService: HotToastService
	) {
		super(formBuilder, configService, formatDatePipe, utilService, fileUtilService);

		this.controllingMembersModelChangedSubscription = this.controllingMembersModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					// const bizTypeCode = this.controllingMembersModelFormGroup.get('businessInformationData.bizTypeCode')?.value;
					// const isAddressTheSame = this.controllingMembersModelFormGroup.get(
					// 	'businessAddressData.isAddressTheSame'
					// )?.value;
					// const province = isAddressTheSame
					// 	? this.controllingMembersModelFormGroup.get('businessMailingAddressData.province')?.value
					// 	: this.controllingMembersModelFormGroup.get('businessAddressData.province')?.value;
					// const country = isAddressTheSame
					// 	? this.controllingMembersModelFormGroup.get('businessMailingAddressData.country')?.value
					// 	: this.controllingMembersModelFormGroup.get('businessAddressData.country')?.value;
					// const isBcBusinessAddress = this.utilService.isBcAddress(province, country);
					// const isBusinessLicenceSoleProprietor = this.isSoleProprietor(bizTypeCode);
					// this.controllingMembersModelFormGroup.patchValue(
					// 	{ isBcBusinessAddress, isBusinessLicenceSoleProprietor },
					// 	{ emitEvent: false }
					// );
					// const step1Complete = this.isStepBackgroundInformationComplete();
					// const step2Complete = this.isStepLicenceSelectionComplete();
					// const step3Complete = isBusinessLicenceSoleProprietor ? true : this.isStepContactInformationComplete();
					// const step4Complete = isBusinessLicenceSoleProprietor
					// 	? true
					// 	: this.isStepControllingMembersAndEmployeesComplete();
					// const isValid = step1Complete && step2Complete && step3Complete && step4Complete;
					// console.debug(
					// 	'controllingMembersModelFormGroup CHANGED',
					// 	step1Complete,
					// 	step2Complete,
					// 	step3Complete,
					// 	step4Complete,
					// 	this.controllingMembersModelFormGroup.getRawValue()
					// );
					// this.updateModelChangeFlags();
					// this.controllingMembersModelValueChanges$.next(isValid);
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
	 * Partial Save - Save the licence data as is.
	 * @returns StrictHttpResponse<BizLicAppCommandResponse>
	 */
	partialSaveBusinessLicenceStep(isSaveAndExit?: boolean): Observable<any> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(controllingMembersModelFormValue);

		return this.bizLicensingService.apiBusinessLicenceApplicationPost$Response({ body }).pipe(
			take(1),
			tap((resp: StrictHttpResponse<BizLicAppCommandResponse>) => {
				this.resetModelChangeFlags();

				// let msg = 'Business Licence information has been saved';
				// if (isSaveAndExit) {
				// 	msg =
				// 		'Your application has been successfully saved. Please note that inactive applications will expire in 30 days';
				// }
				// this.hotToastService.success(msg);

				// if (!controllingMembersModelFormValue.licenceAppId) {
				// 	this.controllingMembersModelFormGroup.patchValue(
				// 		{ licenceAppId: resp.body.licenceAppId! },
				// 		{ emitEvent: false }
				// 	);
				// }
				return resp;
			})
		);
	}

	getBusinessProfile(): Observable<BizProfileResponse> {
		const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

		return this.bizProfileService.apiBizIdGet({ id: bizId });
	}

	submitBusinessLicenceNew(): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();
		const body = this.getSaveBodyBase(controllingMembersModelFormValue);

		body.agreeToCompleteAndAccurate = true;

		return this.bizLicensingService.apiBusinessLicenceApplicationSubmitPost$Response({ body });
	}

	submitBusinessLicenceRenewalOrUpdateOrReplace(
		isUpdateFlowWithHideReprintStep?: boolean
	): Observable<StrictHttpResponse<BizLicAppCommandResponse>> {
		const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();
		const bodyUpsert = this.getSaveBodyBase(controllingMembersModelFormValue);
		delete bodyUpsert.documentInfos;

		const body = bodyUpsert as BizLicAppSubmitRequest;

		// if (body.applicationTypeCode === ApplicationTypeCode.Update) {
		// 	// if not showing the reprint step, then set to True, otherwise
		// 	// use the value selected
		// 	body.reprint = isUpdateFlowWithHideReprintStep
		// 		? true
		// 		: this.utilService.booleanTypeToBoolean(controllingMembersModelFormValue.reprintLicenceData.reprintLicence);
		// }

		// const documentsToSave = this.getDocsToSaveBlobs(controllingMembersModelFormValue);

		// body.agreeToCompleteAndAccurate = true;

		// // Create list of APIs to call for the newly added documents
		// const documentsToSaveApis: Observable<any>[] = [];

		// // Get the keyCode for the existing documents to save.
		// const existingDocumentIds: Array<string> = [];

		// documentsToSave?.forEach((doc: LicenceDocumentsToSave) => {
		// 	const newDocumentsOnly: Array<Blob> = [];

		// 	doc.documents.forEach((item: Blob) => {
		// 		const spdFile: SpdFile = item as SpdFile;
		// 		if (spdFile.documentUrlId) {
		// 			existingDocumentIds.push(spdFile.documentUrlId);
		// 		} else {
		// 			newDocumentsOnly.push(item);
		// 		}
		// 	});

		// 	if (newDocumentsOnly.length > 0) {
		// 		documentsToSaveApis.push(
		// 			this.bizLicensingService.apiBusinessLicenceApplicationFilesPost({
		// 				body: {
		// 					Documents: newDocumentsOnly,
		// 					LicenceDocumentTypeCode: doc.licenceDocumentTypeCode,
		// 				},
		// 			})
		// 		);
		// 	}
		// });

		// if (documentsToSaveApis.length > 0) {
		// 	return forkJoin(documentsToSaveApis).pipe(
		// 		switchMap((resps: string[]) => {
		// 			// pass in the list of document key codes
		// 			body.documentKeyCodes = [...resps];
		// 			// pass in the list of document ids that were in the original
		// 			// application and are still being used
		// 			body.previousDocumentIds = [...existingDocumentIds];

		// 			return this.bizLicensingService.apiBusinessLicenceApplicationChangePost$Response({
		// 				body,
		// 			});
		// 		})
		// 	);
		// } else {
		// 	// pass in the list of document ids that were in the original
		// 	// application and are still being used
		// 	body.previousDocumentIds = [...existingDocumentIds];

		return this.bizLicensingService.apiBusinessLicenceApplicationChangePost$Response({
			body,
		});
		// }
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
			licenceAppId: this.controllingMembersModelFormGroup.get('licenceAppId')?.value,
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
	// isStepBackgroundInformationComplete(): boolean {
	// 	// console.debug(
	// 	// 	'isStepBackgroundInformationComplete',
	// 	// 	this.expiredLicenceFormGroup.valid,
	// 	// 	this.companyBrandingFormGroup.valid,
	// 	// 	this.liabilityFormGroup.valid
	// 	// );

	// 	return this.expiredLicenceFormGroup.valid;
	// }

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	// isStepLicenceSelectionComplete(): boolean {
	// 	// console.debug(
	// 	// 	'isStepLicenceSelectionComplete',
	// 	// 	this.categoryFormGroup.valid,
	// 	// 	this.categoryPrivateInvestigatorFormGroup.valid,
	// 	// 	this.categoryArmouredCarGuardFormGroup.valid,
	// 	// 	this.categorySecurityGuardFormGroup.valid,
	// 	// 	this.licenceTermFormGroup.valid
	// 	// );

	// 	return this.categoryFormGroup.valid && this.licenceTermFormGroup.valid;
	// }

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	// isStepContactInformationComplete(): boolean {
	// 	const isBusinessLicenceSoleProprietor = this.controllingMembersModelFormGroup.get(
	// 		'isBusinessLicenceSoleProprietor'
	// 	)?.value;

	// 	// console.debug('isStepContactInformationComplete', isBusinessLicenceSoleProprietor, this.applicantFormGroup.valid);

	// 	if (isBusinessLicenceSoleProprietor) return true;

	// 	return this.applicantFormGroup.valid;
	// }

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	// isStepControllingMembersAndEmployeesComplete(): boolean {
	// 	const isBusinessLicenceSoleProprietor = this.controllingMembersModelFormGroup.get(
	// 		'isBusinessLicenceSoleProprietor'
	// 	)?.value;

	// 	// console.debug(
	// 	// 	'isStepControllingMembersAndEmployeesComplete',
	// 	// 	isBusinessLicenceSoleProprietor,
	// 	// 	this.controllingMembersFormGroup.valid,
	// 	// 	this.employeesFormGroup.valid
	// 	// );

	// 	if (isBusinessLicenceSoleProprietor) return true;

	// 	return this.controllingMembersFormGroup.valid && this.employeesFormGroup.valid;
	// }

	/**
	 * Save the controlling members and employees
	 * @returns
	 */
	// submitControllingMembersAndEmployees(): Observable<any> {
	// 	const controllingMembersModelFormValue = this.controllingMembersModelFormGroup.getRawValue();
	// 	const bizId = controllingMembersModelFormValue.bizId;
	// 	const applicationId = controllingMembersModelFormValue.licenceAppId;

	// 	const body: MembersRequest = {
	// 		employees: this.saveEmployeesBody(controllingMembersModelFormValue.employeesData),
	// 		nonSwlControllingMembers: this.saveControllingMembersWithoutSwlBody(
	// 			controllingMembersModelFormValue.controllingMembersData
	// 		),
	// 		swlControllingMembers: this.saveControllingMembersWithSwlBody(
	// 			controllingMembersModelFormValue.controllingMembersData
	// 		),
	// 	};

	// 	if (controllingMembersModelFormValue.controllingMembersData.attachments) {
	// 		return this.saveControllingMembersAndEmployeesWithDocument(bizId, applicationId, body);
	// 	}

	// 	return this.saveControllingMembersAndEmployees(bizId, body);
	// }

	/**
	 * Save the login user profile
	 * @returns
	 */
	// saveLoginBusinessProfile(): Observable<StrictHttpResponse<string>> {
	// 	return this.saveBusinessProfile();
	// }

	// /**
	//  * Save the user profile in a flow
	//  * @returns
	//  */
	// saveBusinessProfileAndContinue(applicationTypeCode: ApplicationTypeCode): Observable<StrictHttpResponse<string>> {
	// 	return this.saveBusinessProfile().pipe(
	// 		tap((_resp: StrictHttpResponse<string>) => {
	// 			this.continueToNextStep(applicationTypeCode);
	// 		})
	// 	);
	// }

	/**
	 * Save a business manager
	 * @returns
	 */
	// getBizPortalUsers(): Observable<BizPortalUserListResponse> {
	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

	// 	return this.bizPortalUserService.apiBusinessBizIdPortalUsersGet({
	// 		bizId,
	// 	});
	// }

	/**
	 * Save a business manager
	 * @returns
	 */
	// saveBizPortalUserCreate(body: BizPortalUserCreateRequest): Observable<BizPortalUserResponse> {
	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
	// 	body.bizId = bizId;

	// 	return this.bizPortalUserService.apiBusinessBizIdPortalUsersPost({
	// 		bizId,
	// 		body,
	// 	});
	// }

	/**
	 * Save a business manager
	 * @returns
	 */
	// saveBizPortalUserUpdate(userId: string, body: BizPortalUserUpdateRequest): Observable<BizPortalUserResponse> {
	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;
	// 	body.bizId = bizId;

	// 	return this.bizPortalUserService.apiBusinessBizIdPortalUsersUserIdPut({
	// 		bizId,
	// 		userId,
	// 		body,
	// 	});
	// }

	/**
	 * Delete a business manager
	 * @returns
	 */
	// deleteBizPortalUser(userId: string): Observable<ActionResult> {
	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

	// 	return this.bizPortalUserService.apiBusinessBizIdPortalUsersUserIdDelete({
	// 		bizId,
	// 		userId,
	// 	});
	// }

	/**
	 * Save the user profile in a flow
	 * @returns
	 */
	// private continueToNextStep(applicationTypeCode: ApplicationTypeCode): void {
	// 	switch (applicationTypeCode) {
	// 		case ApplicationTypeCode.Replacement: {
	// 			this.router.navigateByUrl(
	// 				BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_REPLACEMENT)
	// 			);
	// 			break;
	// 		}
	// 		case ApplicationTypeCode.Renewal: {
	// 			this.router.navigateByUrl(
	// 				BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_RENEWAL)
	// 			);
	// 			break;
	// 		}
	// 		case ApplicationTypeCode.Update: {
	// 			this.router.navigateByUrl(
	// 				BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_UPDATE)
	// 			);
	// 			break;
	// 		}
	// 		default: {
	// 			this.router.navigateByUrl(
	// 				BusinessLicenceApplicationRoutes.pathBusinessLicence(BusinessLicenceApplicationRoutes.BUSINESS_NEW)
	// 			);
	// 			break;
	// 		}
	// 	}
	// }

	/**
	 * Create an empty licence
	 * @returns
	 */
	// createNewBusinessLicenceWithSwl(soleProprietorSwlLicenceAppId: string, isSwlAnonymous: boolean): Observable<any> {
	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

	// 	return this.bizProfileService.apiBizIdGet({ id: bizId }).pipe(
	// 		switchMap((businessProfile: BizProfileResponse) => {
	// 			return this.createEmptyLicenceForSoleProprietor({
	// 				soleProprietorSwlLicenceAppId,
	// 				businessProfile,
	// 				isSwlAnonymous,
	// 			}).pipe(
	// 				tap((_resp: any) => {
	// 					this.initialized = true;

	// 					this.commonApplicationService.setApplicationTitle(
	// 						WorkerLicenceTypeCode.SecurityBusinessLicence,
	// 						ApplicationTypeCode.New
	// 					);
	// 				})
	// 			);
	// 		})
	// 	);
	// }

	/**
	 * Create an empty licence
	 * @returns
	 */
	// createNewBusinessLicenceWithProfile(applicationTypeCode?: ApplicationTypeCode): Observable<any> {
	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

	// 	return this.bizProfileService.apiBizIdGet({ id: bizId }).pipe(
	// 		switchMap((businessProfile: BizProfileResponse) => {
	// 			const isSoleProprietor = this.isSoleProprietor(businessProfile.bizTypeCode);

	// 			if (isSoleProprietor) {
	// 				// If the profile is a sole proprietor, then we need to get the associated licence info
	// 				if (businessProfile.soleProprietorSwlContactInfo?.licenceId) {
	// 					return this.licenceService
	// 						.apiLicencesLicenceIdGet({ licenceId: businessProfile.soleProprietorSwlContactInfo?.licenceId })
	// 						.pipe(
	// 							switchMap((soleProprietorSwlLicence: LicenceResponse) => {
	// 								return this.createEmptyLicence({ businessProfile, soleProprietorSwlLicence }).pipe(
	// 									tap((_resp: any) => {
	// 										this.initialized = true;

	// 										this.commonApplicationService.setApplicationTitle(
	// 											WorkerLicenceTypeCode.SecurityBusinessLicence,
	// 											applicationTypeCode // if undefined, we are just loading the profile.
	// 										);
	// 									})
	// 								);
	// 							})
	// 						);
	// 				}

	// 				return this.createEmptyLicence({ businessProfile }).pipe(
	// 					tap((_resp: any) => {
	// 						this.initialized = true;

	// 						this.commonApplicationService.setApplicationTitle(
	// 							WorkerLicenceTypeCode.SecurityBusinessLicence,
	// 							applicationTypeCode // if undefined, we are just loading the profile.
	// 						);
	// 					})
	// 				);
	// 			}

	// 			return this.bizLicensingService
	// 				.apiBusinessLicenceApplicationBizIdMembersGet({
	// 					bizId,
	// 				})
	// 				.pipe(
	// 					switchMap((controllingMembersAndEmployees: Members) => {
	// 						return this.createEmptyLicence({ businessProfile, controllingMembersAndEmployees }).pipe(
	// 							tap((_resp: any) => {
	// 								this.initialized = true;

	// 								this.commonApplicationService.setApplicationTitle(
	// 									WorkerLicenceTypeCode.SecurityBusinessLicence,
	// 									applicationTypeCode // if undefined, we are just loading the profile.
	// 								);
	// 							})
	// 						);
	// 					})
	// 				);
	// 		})
	// 	);
	// }

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	// getBusinessLicenceToResume(licenceAppId: string): Observable<BizLicAppResponse> {
	// 	return this.loadExistingBusinessLicenceWithId({ licenceAppId, applicationTypeCode: ApplicationTypeCode.New }).pipe(
	// 		tap((_resp: any) => {
	// 			this.initialized = true;

	// 			this.commonApplicationService.setApplicationTitle(
	// 				_resp.workerLicenceTypeData.workerLicenceTypeCode,
	// 				_resp.applicationTypeData.applicationTypeCode
	// 			);
	// 		})
	// 	);
	// }

	/**
	 * Load an existing licence application with an id for the provided application type
	 * @param licenceAppId
	 * @returns
	 */
	// getBusinessLicenceWithSelection(
	// 	applicationTypeCode: ApplicationTypeCode,
	// 	originalLicence: MainLicenceResponse
	// ): Observable<BizLicAppResponse> {
	// 	return this.getBusinessLicenceOfType(applicationTypeCode, originalLicence).pipe(
	// 		tap((_resp: any) => {
	// 			this.initialized = true;

	// 			this.commonApplicationService.setApplicationTitle(
	// 				_resp.workerLicenceTypeData.workerLicenceTypeCode,
	// 				_resp.applicationTypeData.applicationTypeCode,
	// 				_resp.originalLicenceData.originalLicenceNumber
	// 			);

	// 			console.debug(
	// 				'[getBusinessLicenceWithSelection] controllingMembersModelFormGroup',
	// 				this.controllingMembersModelFormGroup.value
	// 			);
	// 		})
	// 	);
	// }

	// getMembersAndEmployees(): Observable<any> {
	// 	this.reset();

	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

	// 	return forkJoin([
	// 		this.bizProfileService.apiBizIdGet({ id: bizId }),
	// 		this.bizLicensingService.apiBusinessLicenceApplicationBizIdMembersGet({
	// 			bizId,
	// 		}),
	// 	]).pipe(
	// 		switchMap((resps: any[]) => {
	// 			const businessProfile = resps[0];
	// 			const members = resps[1];

	// 			return this.applyLicenceProfileMembersIntoModel(businessProfile, members);
	// 		})
	// 	);
	// }

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.resetModelFlags();
		this.resetCommon();

		// this.profileConfirmationFormGroup.reset();
		// this.consentAndDeclarationFormGroup.reset();
		// this.controllingMembersModelFormGroup.reset();

		// // clear the alias data - this does not seem to get reset during a formgroup reset
		// const bcBranchesArray = this.controllingMembersModelFormGroup.get('branchesInBcData.branches') as FormArray;
		// while (bcBranchesArray.length) {
		// 	bcBranchesArray.removeAt(0);
		// }
		// const controllingMembersWithSwlArray = this.controllingMembersModelFormGroup.get(
		// 	'controllingMembersData.membersWithSwl'
		// ) as FormArray;
		// while (controllingMembersWithSwlArray.length) {
		// 	controllingMembersWithSwlArray.removeAt(0);
		// }
		// const controllingMembersWithoutSwlArray = this.controllingMembersModelFormGroup.get(
		// 	'controllingMembersData.membersWithoutSwl'
		// ) as FormArray;
		// while (controllingMembersWithoutSwlArray.length) {
		// 	controllingMembersWithoutSwlArray.removeAt(0);
		// }
		// const employeesArray = this.controllingMembersModelFormGroup.get('employeesData.employees') as FormArray;
		// while (employeesArray.length) {
		// 	employeesArray.removeAt(0);
		// }

		console.debug('RESET', this.initialized, this.controllingMembersModelFormGroup.value);
	}

	/*************************************************************/
	// COMMON
	/*************************************************************/

	/**
	 * Save the business profile
	 * @returns
	 */
	// private saveBusinessProfile(): Observable<StrictHttpResponse<string>> {
	// 	const modelFormValue = this.controllingMembersModelFormGroup.getRawValue();

	// 	const bizTypeCode = modelFormValue.businessInformationData.bizTypeCode;
	// 	const isSoleProprietor = this.isSoleProprietor(bizTypeCode);

	// 	const branches: Array<BranchInfo> = [];
	// 	if (modelFormValue.branchesInBcData.hasBranchesInBc === BooleanTypeCode.Yes) {
	// 		modelFormValue.branchesInBcData.branches.forEach((item: any) => {
	// 			const branchAddress: Address = {
	// 				addressLine1: item.addressLine1,
	// 				addressLine2: item.addressLine2,
	// 				city: item.city,
	// 				country: item.country,
	// 				postalCode: item.postalCode,
	// 				province: item.province,
	// 			};
	// 			const branch: BranchInfo = {
	// 				branchId: item.branchId,
	// 				branchEmailAddr: item.branchEmailAddr,
	// 				branchManager: item.branchManager,
	// 				branchPhoneNumber: item.branchPhoneNumber,
	// 				branchAddress,
	// 			};
	// 			branches.push(branch);
	// 		});
	// 	}

	// 	const bizManagerContactInfo = isSoleProprietor ? {} : modelFormValue.businessManagerData;

	// 	const bizAddress = modelFormValue.businessAddressData.isAddressTheSame
	// 		? { ...modelFormValue.businessMailingAddressData }
	// 		: { ...modelFormValue.businessAddressData };

	// 	let soleProprietorLicenceId: null | string = null;
	// 	let soleProprietorSwlEmailAddress: null | string = null;
	// 	let soleProprietorSwlPhoneNumber: null | string = null;

	// 	if (isSoleProprietor) {
	// 		soleProprietorLicenceId = modelFormValue.businessInformationData.soleProprietorLicenceId;
	// 		soleProprietorSwlEmailAddress = modelFormValue.businessInformationData.soleProprietorSwlEmailAddress;
	// 		soleProprietorSwlPhoneNumber = modelFormValue.businessInformationData.soleProprietorSwlPhoneNumber;
	// 	} else {
	// 		// Clear out any old data
	// 		this.businessInformationFormGroup.patchValue({
	// 			soleProprietorLicenceId: null,
	// 			soleProprietorLicenceAppId: null,
	// 			soleProprietorLicenceHolderName: null,
	// 			soleProprietorLicenceNumber: null,
	// 			soleProprietorLicenceExpiryDate: null,
	// 			soleProprietorLicenceStatusCode: null,
	// 			soleProprietorSwlEmailAddress: null,
	// 			soleProprietorSwlPhoneNumber: null,
	// 		});
	// 	}

	// 	const body: BizProfileUpdateRequest = {
	// 		bizAddress,
	// 		bizBCAddress: modelFormValue.isBcBusinessAddress ? bizAddress : { ...modelFormValue.bcBusinessAddressData },
	// 		bizManagerContactInfo,
	// 		bizTradeName: modelFormValue.businessInformationData.bizTradeName,
	// 		bizTypeCode,
	// 		branches,
	// 		soleProprietorLicenceId,
	// 		soleProprietorSwlEmailAddress,
	// 		soleProprietorSwlPhoneNumber,
	// 	};

	// 	return this.bizProfileService
	// 		.apiBizBizIdPut$Response({
	// 			bizId: modelFormValue.bizId,
	// 			body,
	// 		})
	// 		.pipe(
	// 			tap((_resp: any) => {
	// 				this.resetModelChangeFlags();
	// 			})
	// 		);
	// }

	// private createEmptyLicenceForSoleProprietor({
	// 	soleProprietorSwlLicenceAppId,
	// 	businessProfile,
	// 	isSwlAnonymous,
	// }: {
	// 	soleProprietorSwlLicenceAppId: string;
	// 	businessProfile: BizProfileResponse;
	// 	isSwlAnonymous: boolean;
	// }): Observable<any> {
	// 	this.reset();

	// 	return this.applyLicenceProfileIntoModel({
	// 		businessProfile,
	// 		applicationTypeCode: ApplicationTypeCode.New,
	// 		soleProprietorSwlLicenceAppId,
	// 	}).pipe(
	// 		tap((_resp: any) => {
	// 			this.controllingMembersModelFormGroup.patchValue({ isSwlAnonymous }, { emitEvent: false });

	// 			this.commonApplicationService.setApplicationTitle(_resp.workerLicenceTypeData.workerLicenceTypeCode);
	// 		})
	// 	);
	// }

	// /**
	//  * Create an empty licence for a profile
	//  * @param businessProfile
	//  * @param soleProprietorSwlLicence
	//  * @returns
	//  */
	// private createEmptyLicence({
	// 	businessProfile,
	// 	soleProprietorSwlLicence,
	// 	controllingMembersAndEmployees,
	// }: {
	// 	businessProfile: BizProfileResponse;
	// 	soleProprietorSwlLicence?: LicenceResponse;
	// 	controllingMembersAndEmployees?: Members;
	// }): Observable<any> {
	// 	this.reset();

	// 	if (controllingMembersAndEmployees) {
	// 		return this.applyLicenceProfileMembersIntoModel(
	// 			businessProfile,
	// 			controllingMembersAndEmployees,
	// 			ApplicationTypeCode.New
	// 		);
	// 	}

	// 	return this.applyLicenceProfileIntoModel({
	// 		businessProfile,
	// 		applicationTypeCode: ApplicationTypeCode.New,
	// 		soleProprietorSwlLicence,
	// 	});
	// }

	// private applyLicenceProfileMembersIntoModel(
	// 	businessProfile: BizProfileResponse,
	// 	members: Members,
	// 	applicationTypeCode?: ApplicationTypeCode | null | undefined
	// ) {
	// 	const apis: Observable<any>[] = [];
	// 	members.swlControllingMembers?.forEach((item: SwlContactInfo) => {
	// 		apis.push(
	// 			this.licenceService.apiLicencesLicenceIdGet({
	// 				licenceId: item.licenceId!,
	// 			})
	// 		);
	// 	});
	// 	members.employees?.forEach((item: SwlContactInfo) => {
	// 		apis.push(
	// 			this.licenceService.apiLicencesLicenceIdGet({
	// 				licenceId: item.licenceId!,
	// 			})
	// 		);
	// 	});

	// 	if (apis.length > 0) {
	// 		return forkJoin(apis).pipe(
	// 			switchMap((licenceResponses: Array<LicenceResponse>) => {
	// 				this.applyControllingMembersWithSwl(members.swlControllingMembers ?? [], licenceResponses);
	// 				this.applyControllingMembersWithoutSwl(members.nonSwlControllingMembers ?? []);
	// 				this.applyEmployees(members.employees ?? [], licenceResponses);

	// 				return this.applyLicenceProfileIntoModel({ businessProfile, applicationTypeCode }).pipe(
	// 					tap((_resp: any) => {
	// 						this.initialized = true;

	// 						this.commonApplicationService.setApplicationTitle(_resp.workerLicenceTypeData.workerLicenceTypeCode);
	// 					})
	// 				);
	// 			})
	// 		);
	// 	} else {
	// 		return this.applyLicenceProfileIntoModel({ businessProfile, applicationTypeCode }).pipe(
	// 			tap((_resp: any) => {
	// 				this.initialized = true;

	// 				this.commonApplicationService.setApplicationTitle(_resp.workerLicenceTypeData.workerLicenceTypeCode);
	// 			})
	// 		);
	// 	}
	// }

	// /**
	//  * Load an existing licence application with a certain type
	//  * @param licenceAppId
	//  * @returns
	//  */
	// private getBusinessLicenceOfType(
	// 	applicationTypeCode: ApplicationTypeCode,
	// 	originalLicence: MainLicenceResponse
	// ): Observable<any> {
	// 	return this.loadExistingBusinessLicenceWithLatestApp({
	// 		originalLicence,
	// 		applicationTypeCode,
	// 	}).pipe(
	// 		switchMap((resp: any) => {
	// 			switch (applicationTypeCode) {
	// 				case ApplicationTypeCode.Renewal:
	// 					return this.applyRenewalDataUpdatesToModel(resp);
	// 				case ApplicationTypeCode.Update:
	// 					return this.applyUpdateDataUpdatesToModel(resp);
	// 				default:
	// 					return this.applyReplacementDataUpdatesToModel(resp);
	// 			}
	// 		})
	// 	);
	// }

	// /**
	//  * Loads the current profile and a licence
	//  * @returns
	//  */
	// private loadExistingBusinessLicenceWithId({
	// 	licenceAppId,
	// 	originalLicence,
	// 	applicationTypeCode,
	// }: {
	// 	licenceAppId: string;
	// 	originalLicence?: MainLicenceResponse;
	// 	applicationTypeCode: ApplicationTypeCode;
	// }): Observable<any> {
	// 	this.reset();

	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

	// 	return forkJoin([
	// 		this.bizLicensingService.apiBusinessLicenceApplicationLicenceAppIdGet({ licenceAppId }),
	// 		this.bizProfileService.apiBizIdGet({ id: bizId }),
	// 	]).pipe(
	// 		switchMap((resps: any[]) => {
	// 			const businessLicenceAppl = resps[0];
	// 			const businessProfile = resps[1];

	// 			return this.loadBusinessAppAndProfile(
	// 				applicationTypeCode,
	// 				businessLicenceAppl,
	// 				businessProfile,
	// 				originalLicence
	// 			);
	// 		})
	// 	);
	// }

	// /**
	//  * Loads the current profile and a licence with the latest application.
	//  * @returns
	//  */
	// private loadExistingBusinessLicenceWithLatestApp({
	// 	originalLicence,
	// 	applicationTypeCode,
	// }: {
	// 	originalLicence?: MainLicenceResponse;
	// 	applicationTypeCode: ApplicationTypeCode;
	// }): Observable<any> {
	// 	this.reset();

	// 	const bizId = this.authUserBceidService.bceidUserProfile?.bizId!;

	// 	return forkJoin([
	// 		this.bizLicensingService.apiBusinessBizIdAppLatestGet({ bizId }),
	// 		this.bizProfileService.apiBizIdGet({ id: bizId }),
	// 	]).pipe(
	// 		switchMap((resps: any[]) => {
	// 			const businessLicenceAppl = resps[0];
	// 			const businessProfile = resps[1];

	// 			return this.loadBusinessAppAndProfile(
	// 				applicationTypeCode,
	// 				businessLicenceAppl,
	// 				businessProfile,
	// 				originalLicence
	// 			);
	// 		})
	// 	);
	// }

	// /**
	//  * Loads the a business application and profile into the business model
	//  * @returns
	//  */
	// private loadBusinessAppAndProfile(
	// 	applicationTypeCode: ApplicationTypeCode,
	// 	businessLicenceAppl: BizLicAppResponse,
	// 	businessProfile: BizProfileResponse,
	// 	originalLicence?: MainLicenceResponse
	// ) {
	// 	const apis: Observable<any>[] = [];
	// 	if (businessLicenceAppl.expiredLicenceId) {
	// 		apis.push(
	// 			this.licenceService.apiLicencesLicenceIdGet({
	// 				licenceId: businessLicenceAppl.expiredLicenceId,
	// 			})
	// 		);
	// 	}
	// 	if (businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId) {
	// 		apis.push(
	// 			this.licenceService.apiLicencesLicenceIdGet({
	// 				licenceId: businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId,
	// 			})
	// 		);
	// 	}
	// 	if (businessProfile.soleProprietorSwlContactInfo?.licenceId) {
	// 		apis.push(
	// 			this.licenceService.apiLicencesLicenceIdGet({
	// 				licenceId: businessProfile.soleProprietorSwlContactInfo?.licenceId,
	// 			})
	// 		);
	// 	}

	// 	businessLicenceAppl.members?.employees?.forEach((item: SwlContactInfo) => {
	// 		apis.push(
	// 			this.licenceService.apiLicencesLicenceIdGet({
	// 				licenceId: item.licenceId!,
	// 			})
	// 		);
	// 	});
	// 	businessLicenceAppl.members?.swlControllingMembers?.forEach((item: SwlContactInfo) => {
	// 		apis.push(
	// 			this.licenceService.apiLicencesLicenceIdGet({
	// 				licenceId: item.licenceId!,
	// 			})
	// 		);
	// 	});

	// 	const brandingDocumentInfos =
	// 		applicationTypeCode === ApplicationTypeCode.New || applicationTypeCode === ApplicationTypeCode.Renewal
	// 			? businessLicenceAppl.documentInfos?.filter(
	// 					(item: Document) => item.licenceDocumentTypeCode === LicenceDocumentTypeCode.BizBranding
	// 			  )
	// 			: [];

	// 	if (apis.length > 0) {
	// 		return forkJoin(apis).pipe(
	// 			switchMap((licenceResponses: Array<LicenceResponse>) => {
	// 				if (businessLicenceAppl.members) {
	// 					this.applyControllingMembersWithSwl(
	// 						businessLicenceAppl.members.swlControllingMembers ?? [],
	// 						licenceResponses
	// 					);
	// 					this.applyEmployees(businessLicenceAppl.members.employees ?? [], licenceResponses);
	// 				}

	// 				let associatedExpiredLicence: LicenceResponse | undefined = undefined;
	// 				if (businessLicenceAppl.expiredLicenceId) {
	// 					associatedExpiredLicence = licenceResponses.find(
	// 						(item: LicenceResponse) => item.licenceId === businessLicenceAppl.expiredLicenceId
	// 					);
	// 				}

	// 				let soleProprietorSwlLicence: LicenceResponse | undefined = undefined;
	// 				if (businessProfile.soleProprietorSwlContactInfo?.licenceId) {
	// 					soleProprietorSwlLicence = licenceResponses.find(
	// 						(item: LicenceResponse) => item.licenceId === businessProfile.soleProprietorSwlContactInfo?.licenceId
	// 					);
	// 				}

	// 				let privateInvestigatorSwlLicence: LicenceResponse | undefined = undefined;
	// 				if (businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId) {
	// 					privateInvestigatorSwlLicence = licenceResponses.find(
	// 						(item: LicenceResponse) => item.licenceId === businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId
	// 					);
	// 				}

	// 				return this.applyLicenceAndProfileIntoModel({
	// 					businessLicenceAppl,
	// 					businessProfile,
	// 					originalLicence,
	// 					associatedExpiredLicence,
	// 					soleProprietorSwlLicence,
	// 					privateInvestigatorSwlLicence,
	// 					brandingDocumentInfos,
	// 				});
	// 			})
	// 		);
	// 	}

	// 	return this.applyLicenceAndProfileIntoModel({
	// 		businessLicenceAppl,
	// 		businessProfile,
	// 		originalLicence,
	// 		brandingDocumentInfos,
	// 	});
	// }

	// /**
	//  * Loads the current branding files into the business model
	//  * @returns
	//  */
	// private loadBrandingFiles(brandingDocumentInfos: Array<Document>): Observable<any> {
	// 	if (brandingDocumentInfos.length === 0) {
	// 		return of(this.controllingMembersModelFormGroup.value);
	// 	}

	// 	const apis: Observable<any>[] = [];

	// 	// get the branding documents
	// 	brandingDocumentInfos.forEach((item: Document) => {
	// 		apis.push(
	// 			this.bizLicensingService.apiBusinessLicenceApplicationBrandImageDocumentIdGet$Response({
	// 				documentId: item.documentUrlId!,
	// 			})
	// 		);
	// 	});

	// 	const companyBrandingAttachments: Array<SpdFile> = [];
	// 	return forkJoin(apis).pipe(
	// 		switchMap((resps: Array<StrictHttpResponse<Blob>>) => {
	// 			resps.forEach((item: StrictHttpResponse<Blob>, index) => {
	// 				const fileName = this.fileUtilService.getFileNameFromHeader(item.headers);
	// 				const doc: Document = brandingDocumentInfos[index];

	// 				const imageFile = new File([item.body], fileName, { type: item.body.type });
	// 				const imageSpdFile: SpdFile = imageFile as SpdFile;
	// 				imageSpdFile.documentUrlId = doc.documentUrlId;

	// 				companyBrandingAttachments.push(imageSpdFile);
	// 			});

	// 			const companyBrandingData = {
	// 				noLogoOrBranding: companyBrandingAttachments.length === 0,
	// 				attachments: companyBrandingAttachments,
	// 			};

	// 			this.controllingMembersModelFormGroup.patchValue(
	// 				{
	// 					companyBrandingData,
	// 				},
	// 				{
	// 					emitEvent: false,
	// 				}
	// 			);

	// 			return of(this.controllingMembersModelFormGroup.value);
	// 		})
	// 	);
	// }

	// /**
	//  * Applies the data in the profile and licence into the business model
	//  * @returns
	//  */
	// private applyLicenceAndProfileIntoModel({
	// 	businessLicenceAppl,
	// 	businessProfile,
	// 	originalLicence,
	// 	associatedExpiredLicence,
	// 	soleProprietorSwlLicence,
	// 	privateInvestigatorSwlLicence,
	// 	brandingDocumentInfos,
	// }: {
	// 	businessLicenceAppl: BizLicAppResponse;
	// 	businessProfile: BizProfileResponse;
	// 	originalLicence?: MainLicenceResponse;
	// 	associatedExpiredLicence?: LicenceResponse;
	// 	soleProprietorSwlLicence?: LicenceResponse;
	// 	privateInvestigatorSwlLicence?: LicenceResponse;
	// 	brandingDocumentInfos?: Array<Document>;
	// }): Observable<any> {
	// 	return this.applyLicenceProfileIntoModel({
	// 		businessProfile,
	// 		applicationTypeCode: businessLicenceAppl.applicationTypeCode,
	// 		soleProprietorSwlLicence,
	// 	}).pipe(
	// 		switchMap((_resp: any) => {
	// 			return this.applyLicenceIntoModel({
	// 				businessLicenceAppl,
	// 				associatedExpiredLicence,
	// 				privateInvestigatorSwlLicence,
	// 				originalLicence,
	// 				brandingDocumentInfos,
	// 			});
	// 		})
	// 	);
	// }

	/**
	 * Applies the data in the licence into the business model
	 * @returns
	 */
	// private applyLicenceIntoModel({
	// 	businessLicenceAppl,
	// 	associatedExpiredLicence,
	// 	privateInvestigatorSwlLicence,
	// 	originalLicence,
	// 	brandingDocumentInfos,
	// }: {
	// 	businessLicenceAppl: BizLicAppResponse;
	// 	associatedExpiredLicence?: LicenceResponse;
	// 	privateInvestigatorSwlLicence?: LicenceResponse;
	// 	originalLicence?: MainLicenceResponse;
	// 	brandingDocumentInfos?: Array<Document>;
	// }): Observable<any> {
	// 	const workerLicenceTypeData = { workerLicenceTypeCode: businessLicenceAppl.workerLicenceTypeCode };
	// 	const applicationTypeData = { applicationTypeCode: businessLicenceAppl.applicationTypeCode };

	// 	const expiredLicenceData = {
	// 		hasExpiredLicence: this.utilService.booleanToBooleanType(businessLicenceAppl.hasExpiredLicence),
	// 		expiredLicenceId: associatedExpiredLicence?.licenceId,
	// 		expiredLicenceHolderName: associatedExpiredLicence?.licenceHolderName,
	// 		expiredLicenceNumber: associatedExpiredLicence?.licenceNumber,
	// 		expiredLicenceExpiryDate: associatedExpiredLicence?.expiryDate,
	// 		expiredLicenceStatusCode: associatedExpiredLicence?.licenceStatusCode,
	// 	};

	// 	const originalLicenceData = {
	// 		originalApplicationId: originalLicence?.licenceAppId ?? null,
	// 		originalLicenceId: originalLicence?.licenceId ?? null,
	// 		originalLicenceNumber: originalLicence?.licenceNumber ?? null,
	// 		originalExpiryDate: originalLicence?.licenceExpiryDate ?? null,
	// 		originalLicenceTermCode: originalLicence?.licenceTermCode ?? null,
	// 		originalBizTypeCode: originalLicence?.bizTypeCode ?? null,
	// 		originalCategoryCodes: businessLicenceAppl.categoryCodes ?? null,
	// 	};

	// 	const companyBrandingAttachments: Array<File> = [];
	// 	const liabilityAttachments: Array<File> = [];
	// 	const categoryArmouredCarGuardAttachments: Array<File> = [];
	// 	const dogAuthorizationAttachments: Array<File> = [];

	// 	let categoryPrivateInvestigatorFormGroup: any = { isInclude: false };
	// 	const categoryArmouredCarGuardFormGroup: any = { isInclude: false };
	// 	const categorySecurityGuardFormGroup: any = { isInclude: false };

	// 	businessLicenceAppl.documentInfos?.forEach((doc: Document) => {
	// 		switch (doc.licenceDocumentTypeCode) {
	// 			case LicenceDocumentTypeCode.BizSecurityDogCertificate: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				dogAuthorizationAttachments.push(aFile);
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.ArmourCarGuardRegistrar: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				categoryArmouredCarGuardAttachments.push(aFile);
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.BizInsurance: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				liabilityAttachments.push(aFile);
	// 				break;
	// 			}
	// 			case LicenceDocumentTypeCode.BizBranding: {
	// 				const aFile = this.fileUtilService.dummyFile(doc);
	// 				companyBrandingAttachments.push(aFile);
	// 				break;
	// 			}
	// 		}
	// 	});

	// 	const companyBrandingData =
	// 		brandingDocumentInfos?.length === 0
	// 			? {
	// 					noLogoOrBranding: businessLicenceAppl.noBranding,
	// 					attachments: companyBrandingAttachments,
	// 			  }
	// 			: {};

	// 	const liabilityData = {
	// 		attachments: liabilityAttachments,
	// 	};

	// 	const licenceTermData = {
	// 		licenceTermCode: businessLicenceAppl.licenceTermCode,
	// 	};

	// 	const applicantData = {
	// 		applicantIsBizManager: businessLicenceAppl.applicantIsBizManager,
	// 		givenName: businessLicenceAppl.applicantContactInfo?.givenName ?? null,
	// 		middleName1: businessLicenceAppl.applicantContactInfo?.middleName1 ?? null,
	// 		middleName2: businessLicenceAppl.applicantContactInfo?.middleName2 ?? null,
	// 		surname: businessLicenceAppl.applicantContactInfo?.surname ?? null,
	// 		emailAddress: businessLicenceAppl.applicantContactInfo?.emailAddress ?? null,
	// 		phoneNumber: businessLicenceAppl.applicantContactInfo?.phoneNumber ?? null,
	// 	};

	// 	const categoryData: any = {};

	// 	// default object with all category types
	// 	const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
	// 	workerCategoryTypeCodes.forEach((item: string) => {
	// 		categoryData[item] = false;
	// 	});

	// 	if (this.isSoleProprietor(businessLicenceAppl.bizTypeCode)) {
	// 		const businessInformation = this.businessInformationFormGroup.value;
	// 		businessInformation.soleProprietorCategoryCodes?.forEach((item: string) => {
	// 			categoryData[item] = true;
	// 		});
	// 	} else {
	// 		// mark the appropriate category types as true
	// 		businessLicenceAppl.categoryCodes?.forEach((item: WorkerCategoryTypeCode) => {
	// 			categoryData[item as string] = true;
	// 		});
	// 	}

	// 	if (categoryData.PrivateInvestigator && privateInvestigatorSwlLicence) {
	// 		categoryPrivateInvestigatorFormGroup = {
	// 			isInclude: true,
	// 			managerContactId: businessLicenceAppl.privateInvestigatorSwlInfo?.contactId,
	// 			managerLicenceId: businessLicenceAppl.privateInvestigatorSwlInfo?.licenceId,
	// 			managerLicenceHolderName: privateInvestigatorSwlLicence.licenceHolderName,
	// 			managerLicenceNumber: privateInvestigatorSwlLicence.licenceNumber,
	// 			managerLicenceExpiryDate: privateInvestigatorSwlLicence.expiryDate,
	// 			managerLicenceStatusCode: privateInvestigatorSwlLicence.licenceStatusCode,
	// 		};
	// 	}

	// 	if (categoryData.ArmouredCarGuard) {
	// 		categoryArmouredCarGuardFormGroup.isInclude = true;
	// 		categoryArmouredCarGuardFormGroup.attachments = categoryArmouredCarGuardAttachments;
	// 	}

	// 	if (categoryData.SecurityGuard) {
	// 		categorySecurityGuardFormGroup.isInclude = true;
	// 		categorySecurityGuardFormGroup.isRequestDogAuthorization =
	// 			dogAuthorizationAttachments.length > 0 ? BooleanTypeCode.Yes : BooleanTypeCode.No;
	// 		categorySecurityGuardFormGroup.attachments = dogAuthorizationAttachments;
	// 	}

	// 	this.controllingMembersModelFormGroup.patchValue(
	// 		{
	// 			licenceAppId: businessLicenceAppl.licenceAppId,
	// 			latestApplicationId: businessLicenceAppl.licenceAppId,
	// 			workerLicenceTypeData,
	// 			applicationTypeData,
	// 			originalLicenceData,
	// 			caseNumber: businessLicenceAppl.caseNumber,

	// 			expiredLicenceData,
	// 			licenceTermData,
	// 			companyBrandingData,
	// 			liabilityData,
	// 			applicantData,

	// 			categoryData,
	// 			categoryPrivateInvestigatorFormGroup,
	// 			categoryArmouredCarGuardFormGroup,
	// 			categorySecurityGuardFormGroup,
	// 		},
	// 		{
	// 			emitEvent: false,
	// 		}
	// 	);

	// 	if (brandingDocumentInfos?.length) {
	// 		return this.loadBrandingFiles(brandingDocumentInfos);
	// 	}

	// 	console.debug(
	// 		'[applyLicenceIntoModel] controllingMembersModelFormGroup',
	// 		this.controllingMembersModelFormGroup.value
	// 	);
	// 	return of(this.controllingMembersModelFormGroup.value);
	// }

	// /**
	//  * Applies the data in the profile into the business model
	//  * @returns
	//  */
	// private applyLicenceProfileIntoModel({
	// 	businessProfile,
	// 	applicationTypeCode,
	// 	soleProprietorSwlLicence,
	// 	soleProprietorSwlLicenceAppId,
	// }: {
	// 	businessProfile: BizProfileResponse;
	// 	applicationTypeCode?: ApplicationTypeCode | null;
	// 	soleProprietorSwlLicence?: LicenceResponse;
	// 	soleProprietorSwlLicenceAppId?: string;
	// }): Observable<any> {
	// 	const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence };
	// 	const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };
	// 	const businessInformationData: any = {
	// 		bizTypeCode: businessProfile.bizTypeCode,
	// 		legalBusinessName: businessProfile.bizLegalName,
	// 		bizTradeName: businessProfile.bizTradeName,
	// 		isBizTradeNameReadonly: !!businessProfile.bizTradeName, // user cannot overwrite value from bceid
	// 		soleProprietorLicenceId: soleProprietorSwlLicence?.licenceId,
	// 		soleProprietorLicenceAppId: soleProprietorSwlLicence?.licenceAppId,
	// 		soleProprietorCategoryCodes: null,
	// 		soleProprietorLicenceHolderName: soleProprietorSwlLicence?.licenceHolderName,
	// 		soleProprietorLicenceNumber: soleProprietorSwlLicence?.licenceNumber,
	// 		soleProprietorLicenceExpiryDate: soleProprietorSwlLicence?.expiryDate,
	// 		soleProprietorLicenceStatusCode: soleProprietorSwlLicence?.licenceStatusCode,
	// 		soleProprietorSwlPhoneNumber: businessProfile.soleProprietorSwlPhoneNumber,
	// 		soleProprietorSwlEmailAddress: businessProfile.soleProprietorSwlEmailAddress,
	// 	};

	// 	const businessManagerData = {
	// 		givenName: businessProfile.bizManagerContactInfo?.givenName,
	// 		middleName1: businessProfile.bizManagerContactInfo?.middleName1,
	// 		middleName2: businessProfile.bizManagerContactInfo?.middleName2,
	// 		surname: businessProfile.bizManagerContactInfo?.surname,
	// 		emailAddress: businessProfile.bizManagerContactInfo?.emailAddress,
	// 		phoneNumber: businessProfile.bizManagerContactInfo?.phoneNumber,
	// 	};

	// 	const bizAddress = businessProfile.bizAddress;
	// 	const businessAddressData = {
	// 		addressSelected: !!bizAddress?.addressLine1,
	// 		addressLine1: bizAddress?.addressLine1,
	// 		addressLine2: bizAddress?.addressLine2,
	// 		city: bizAddress?.city,
	// 		postalCode: bizAddress?.postalCode,
	// 		province: bizAddress?.province,
	// 		country: bizAddress?.country,
	// 		isAddressTheSame: false,
	// 	};

	// 	const bizBCAddress = businessProfile.bizBCAddress;
	// 	const bcBusinessAddressData = {
	// 		addressSelected: !!bizBCAddress?.addressLine1,
	// 		addressLine1: bizBCAddress?.addressLine1,
	// 		addressLine2: bizBCAddress?.addressLine2,
	// 		city: bizBCAddress?.city,
	// 		postalCode: bizBCAddress?.postalCode,
	// 		province: bizBCAddress?.province,
	// 		country: bizBCAddress?.country,
	// 	};

	// 	const bizMailingAddress = businessProfile.bizMailingAddress;
	// 	const businessMailingAddressData = {
	// 		addressSelected: !!bizMailingAddress?.addressLine1,
	// 		addressLine1: bizMailingAddress?.addressLine1,
	// 		addressLine2: bizMailingAddress?.addressLine2,
	// 		city: bizMailingAddress?.city,
	// 		postalCode: bizMailingAddress?.postalCode,
	// 		province: bizMailingAddress?.province,
	// 		country: bizMailingAddress?.country,
	// 	};

	// 	const hasBranchesInBc = (businessProfile.branches ?? []).length > 0;
	// 	const branchesInBcData = { hasBranchesInBc: this.utilService.booleanToBooleanType(hasBranchesInBc) };
	// 	const isBcBusinessAddress = this.utilService.isBcAddress(businessAddressData.province, businessAddressData.country);
	// 	const isBusinessLicenceSoleProprietor = this.isSoleProprietor(businessProfile.bizTypeCode);

	// 	this.controllingMembersModelFormGroup.patchValue(
	// 		{
	// 			bizId: businessProfile.bizId,

	// 			workerLicenceTypeData,
	// 			applicationTypeData,
	// 			businessInformationData,
	// 			businessManagerData,

	// 			isBcBusinessAddress,
	// 			isBusinessLicenceSoleProprietor,
	// 			businessAddressData: { ...businessAddressData },
	// 			bcBusinessAddressData: { ...bcBusinessAddressData },
	// 			businessMailingAddressData: { ...businessMailingAddressData },
	// 			branchesInBcData,
	// 		},
	// 		{
	// 			emitEvent: false,
	// 		}
	// 	);

	// 	if (hasBranchesInBc) {
	// 		const branchList = [...businessProfile.branches!].sort((a, b) =>
	// 			this.utilService.sortByDirection(a.branchAddress?.city?.toUpperCase(), b.branchAddress?.city?.toUpperCase())
	// 		);

	// 		const bcBranchesArray = this.controllingMembersModelFormGroup.get('branchesInBcData.branches') as FormArray;
	// 		branchList.forEach((branchInfo: BranchInfo) => {
	// 			bcBranchesArray.push(
	// 				new FormGroup({
	// 					branchId: new FormControl(branchInfo.branchId),
	// 					addressSelected: new FormControl(true),
	// 					addressLine1: new FormControl(branchInfo.branchAddress?.addressLine1),
	// 					addressLine2: new FormControl(branchInfo.branchAddress?.addressLine2),
	// 					city: new FormControl(branchInfo.branchAddress?.city),
	// 					country: new FormControl(branchInfo.branchAddress?.country),
	// 					postalCode: new FormControl(branchInfo.branchAddress?.postalCode),
	// 					province: new FormControl(branchInfo.branchAddress?.province),
	// 					branchManager: new FormControl(branchInfo.branchManager),
	// 					branchPhoneNumber: new FormControl(branchInfo.branchPhoneNumber),
	// 					branchEmailAddr: new FormControl(branchInfo.branchEmailAddr),
	// 				})
	// 			);
	// 		});
	// 	}

	// 	if (soleProprietorSwlLicenceAppId) {
	// 		return this.applyBusinessLicenceSoleProprietorSwl(soleProprietorSwlLicenceAppId);
	// 	}

	// 	console.debug(
	// 		'[applyLicenceProfileIntoModel] controllingMembersModelFormGroup',
	// 		this.controllingMembersModelFormGroup.value
	// 	);
	// 	return of(this.controllingMembersModelFormGroup.value);
	// }

	// applyBusinessLicenceSoleProprietorSwl(licenceAppId: string): Observable<any> {
	// 	return this.securityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
	// 		tap((resp: WorkerLicenceAppResponse) => {
	// 			const businessInformationData = this.controllingMembersModelFormGroup.get('businessInformationData')?.value;
	// 			businessInformationData.soleProprietorCategoryCodes = resp.categoryCodes;

	// 			const categoryData: any = {};
	// 			const workerCategoryTypeCodes = Object.values(WorkerCategoryTypeCode);
	// 			workerCategoryTypeCodes.forEach((item: string) => {
	// 				categoryData[item] = false;
	// 			});

	// 			businessInformationData.soleProprietorCategoryCodes?.forEach((item: string) => {
	// 				categoryData[item] = true;
	// 			});

	// 			this.controllingMembersModelFormGroup.patchValue({
	// 				swlLicenceAppId: licenceAppId,
	// 				businessInformationData,
	// 				categoryData,
	// 			});
	// 		}),
	// 		switchMap((_resp: any) => {
	// 			return of(this.controllingMembersModelFormGroup.value);
	// 		})
	// 	);
	// }

	// private applyRenewalDataUpdatesToModel(_resp: any): Observable<any> {
	// 	const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };

	// 	const liabilityData = {
	// 		attachments: [],
	// 	};

	// 	const licenceTermData = {
	// 		licenceTermCode: null,
	// 	};

	// 	this.controllingMembersModelFormGroup.patchValue(
	// 		{
	// 			licenceAppId: null,
	// 			applicationTypeData,
	// 			liabilityData,
	// 			licenceTermData,
	// 		},
	// 		{
	// 			emitEvent: false,
	// 		}
	// 	);

	// 	console.debug(
	// 		'[applyRenewalDataUpdatesToModel] controllingMembersModel',
	// 		this.controllingMembersModelFormGroup.value
	// 	);
	// 	return of(this.controllingMembersModelFormGroup.value);
	// }

	// private applyUpdateDataUpdatesToModel(_resp: any): Observable<any> {
	// 	const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };

	// 	this.controllingMembersModelFormGroup.patchValue(
	// 		{
	// 			licenceAppId: null,
	// 			applicationTypeData,
	// 		},
	// 		{
	// 			emitEvent: false,
	// 		}
	// 	);

	// 	console.debug(
	// 		'[applyUpdateDataUpdatesToModel] controllingMembersModel',
	// 		this.controllingMembersModelFormGroup.value
	// 	);
	// 	return of(this.controllingMembersModelFormGroup.value);
	// }

	// private applyReplacementDataUpdatesToModel(_resp: any): Observable<any> {
	// 	const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

	// 	this.controllingMembersModelFormGroup.patchValue(
	// 		{
	// 			licenceAppId: null,
	// 			applicationTypeData,
	// 		},
	// 		{
	// 			emitEvent: false,
	// 		}
	// 	);

	// 	console.debug(
	// 		'[applyReplacementDataUpdatesToModel] controllingMembersModel',
	// 		this.controllingMembersModelFormGroup.value
	// 	);
	// 	return of(this.controllingMembersModelFormGroup.value);
	// }
}
