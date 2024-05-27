import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
	Address,
	ApplicationTypeCode,
	BizProfileResponse,
	BizProfileUpdateRequest,
	BizTypeCode,
	BranchInfo,
	ContactInfo,
	LicenceResponse,
	Members,
	SwlContactInfo,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { BizLicensingService, BizProfileService, LicenceService } from '@app/api/services';
import { StrictHttpResponse } from '@app/api/strict-http-response';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { AuthUserBceidService } from '@app/core/services/auth-user-bceid.service';
import { ConfigService } from '@app/core/services/config.service';
import { UtilService } from '@app/core/services/util.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import {
	BehaviorSubject,
	Observable,
	Subscription,
	debounceTime,
	distinctUntilChanged,
	forkJoin,
	map,
	of,
	switchMap,
	tap,
} from 'rxjs';
import { LicenceApplicationRoutes } from '../licence-application-routing.module';
import { BusinessApplicationHelper } from './business-application.helper';
import { CommonApplicationService } from './common-application.service';

export interface ControllingMemberContactInfo extends ContactInfo {
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
		licenceAppId: new FormControl(null),
		bizId: new FormControl(null), // when authenticated, the biz id

		isBcBusinessAddress: new FormControl(), // placeholder for flag

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
		businessInformationData: this.businessInformationFormGroup,
		companyBrandingData: this.companyBrandingFormGroup,
		liabilityData: this.liabilityFormGroup,

		categoryData: this.categoryFormGroup,
		categoryArmouredCarGuardData: this.categoryArmouredCarGuardFormGroup,
		categoryPrivateInvestigatorData: this.categoryPrivateInvestigatorFormGroup,
		categorySecurityGuardData: this.categorySecurityGuardFormGroup,

		licenceTermData: this.licenceTermFormGroup,
		businessManagerData: this.businessManagerFormGroup,
		businessAddressData: this.businessAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
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
		private router: Router,
		private utilService: UtilService,
		private licenceService: LicenceService,
		private bizProfileService: BizProfileService,
		private bizLicensingService: BizLicensingService,
		private authUserBceidService: AuthUserBceidService,
		private commonApplicationService: CommonApplicationService
	) {
		super(formBuilder, configService, formatDatePipe);

		this.businessModelChangedSubscription = this.businessModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

					const bizTypeCode = this.businessModelFormGroup.get('businessInformationData.bizTypeCode')?.value;
					const province = this.businessModelFormGroup.get('businessAddressData.province')?.value;
					const country = this.businessModelFormGroup.get('businessAddressData.country')?.value;
					const isBcBusinessAddress = this.utilService.isBcAddress(province, country);

					this.businessModelFormGroup.patchValue({ isBcBusinessAddress }, { emitEvent: false });

					const isSoleProprietor =
						bizTypeCode === BizTypeCode.NonRegisteredSoleProprietor ||
						bizTypeCode === BizTypeCode.RegisteredSoleProprietor;

					const step1Complete = this.isStepBackgroundInformationComplete();
					const step2Complete = this.isStepLicenceSelectionComplete();
					const step3Complete = this.isStepContactInformationComplete();
					const step4Complete = isSoleProprietor ? true : this.isStepControllingMembersAndEmployeesComplete();
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

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBackgroundInformationComplete(): boolean {
		console.debug(
			'isStepBackgroundInformationComplete',
			this.expiredLicenceFormGroup.valid,
			this.companyBrandingFormGroup.valid,
			this.liabilityFormGroup.valid
		);

		return this.expiredLicenceFormGroup.valid && this.companyBrandingFormGroup.valid && this.liabilityFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepLicenceSelectionComplete(): boolean {
		console.debug(
			'isStepLicenceSelectionComplete',
			this.categoryFormGroup.valid,
			this.categoryPrivateInvestigatorFormGroup.valid,
			this.categoryArmouredCarGuardFormGroup.valid,
			this.categorySecurityGuardFormGroup.valid,
			this.licenceTermFormGroup.valid
		);

		return this.categoryFormGroup.valid && this.licenceTermFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepContactInformationComplete(): boolean {
		console.debug('isStepContactInformationComplete', this.businessManagerFormGroup.valid);

		return this.businessManagerFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepControllingMembersAndEmployeesComplete(): boolean {
		console.debug(
			'isStepControllingMembersAndEmployeesComplete',
			this.controllingMembersFormGroup.valid,
			this.employeesFormGroup.valid
		);

		return this.controllingMembersFormGroup.valid && this.employeesFormGroup.valid;
	}

	/**
	 * Save the controlling members and employees
	 * @returns
	 */
	saveControllingMembersAndEmployees(): Observable<any> {
		const modelFormValue = this.businessModelFormGroup.getRawValue();
		const bizId = modelFormValue.bizId;
		const licenceAppId = modelFormValue.licenceAppId;

		const body: Members = {
			employees: this.saveEmployeesBody(),
			nonSwlControllingMembers: this.saveControllingMembersWithoutSwlBody(),
			swlControllingMembers: this.saveControllingMembersWithSwlBody(),
		};

		return this.bizLicensingService.apiBusinessLicenceBizIdApplicationIdMembersPost({
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
	private continueToNextStep(_applicationTypeCode: ApplicationTypeCode): void {
		// switch (applicationTypeCode) {
		// 	case ApplicationTypeCode.Replacement: {
		// 		this.router.navigateByUrl(
		// 			LicenceApplicationRoutes.pathBusinessLicence(
		// 				LicenceApplicationRoutes.BUSINESS_NEW // TODO change to BUSINESS_REPLACEMENT
		// 			)
		// 		);
		// 		break;
		// 	}
		// 	case ApplicationTypeCode.Renewal: {
		// 		this.router.navigateByUrl(
		// 			LicenceApplicationRoutes.pathBusinessLicence(
		// 				LicenceApplicationRoutes.BUSINESS_NEW // TODO change to BUSINESS_RENEW
		// 			)
		// 		);
		// 		break;
		// 	}
		// 	case ApplicationTypeCode.Update: {
		// 		this.router.navigateByUrl(
		// 			LicenceApplicationRoutes.pathBusinessLicence(
		// 				LicenceApplicationRoutes.BUSINESS_NEW // TODO change to BUSINESS_UPDATE
		// 			)
		// 		);
		// 		break;
		// 	}
		// 	default: {
		this.router.navigateByUrl(LicenceApplicationRoutes.pathBusinessLicence(LicenceApplicationRoutes.BUSINESS_NEW));
		// 		break;
		// 	}
		// }
	}

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewBusinessLicenceWithProfile(applicationTypeCode?: ApplicationTypeCode | undefined): Observable<any> {
		return this.bizProfileService.apiBizIdGet({ id: this.authUserBceidService.bceidUserProfile?.bizId! }).pipe(
			switchMap((profile: BizProfileResponse) => {
				// If the profile is a sole proprietor, then we need to get the associated licence info
				if (profile.soleProprietorSwlContactInfo?.licenceId) {
					return this.licenceService
						.apiLicencesLicenceIdGet({ licenceId: profile.soleProprietorSwlContactInfo?.licenceId })
						.pipe(
							switchMap((licence: LicenceResponse) => {
								return this.createEmptyLicenceAuthenticated(profile, applicationTypeCode, licence).pipe(
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

				return this.createEmptyLicenceAuthenticated(profile, applicationTypeCode).pipe(
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

	getMembersAndEmployees(): Observable<any> {
		this.reset();

		const bizId = '34289094-0c0f-4564-b555-83186a5be74a';
		const licenceAppId = '10007484-6a96-4650-8dc6-d6b7548e2dbb';

		this.businessModelFormGroup.patchValue(
			{
				bizId,
				licenceAppId,
			},
			{
				emitEvent: false,
			}
		);

		return this.bizLicensingService
			.apiBusinessLicenceBizIdApplicationIdMembersGet({
				bizId,
				applicationId: licenceAppId,
			})
			.pipe(
				switchMap((resp: Members) => {
					const apis: Observable<any>[] = [];

					resp.swlControllingMembers?.forEach((item: SwlContactInfo) => {
						apis.push(
							this.licenceService.apiLicencesLicenceIdGet({
								licenceId: item.licenceId!,
							})
						);
					});

					resp.employees?.forEach((item: SwlContactInfo) => {
						apis.push(
							this.licenceService.apiLicencesLicenceIdGet({
								licenceId: item.licenceId!,
							})
						);
					});

					return forkJoin(apis).pipe(
						map((licenceResponses: Array<LicenceResponse>) => {
							this.applyControllingMembersWithSwl(resp.swlControllingMembers ?? [], licenceResponses);
							this.applyControllingMembersWithoutSwl(resp.nonSwlControllingMembers ?? [], licenceResponses);
							this.applyEmployees(resp.employees ?? [], licenceResponses);

							return licenceResponses;
						})
					);
				})
			);
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

		const sortedControllingMembersWithSwlData = controllingMembersWithSwlData.sort((a, b) => {
			return this.utilService.sortByDirection(a.licenceHolderName?.toUpperCase(), b.licenceHolderName?.toUpperCase());
		});

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

	private applyControllingMembersWithoutSwl(members: Array<ContactInfo>, licences: Array<LicenceResponse>) {
		const controllingMembersWithoutSwlData: Array<ControllingMemberContactInfo> = [];

		members.forEach((item: ContactInfo) => {
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
				clearanceStatus: 'Submitted', // TODO removed hardcoded
			});
		});

		const sortedControllingMembersWithoutSwlData = controllingMembersWithoutSwlData.sort((a, b) => {
			return this.utilService.sortByDirection(a.licenceHolderName?.toUpperCase(), b.licenceHolderName?.toUpperCase());
		});

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
				clearanceStatus: 'Submitted', // TODO removed hardcoded
			});
		});

		const sortedEmployeesData = employeesData.sort((a, b) => {
			return this.utilService.sortByDirection(a.licenceHolderName?.toUpperCase(), b.licenceHolderName?.toUpperCase());
		});

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

	/**
	 * Reset the licence data
	 * @returns
	 */
	reset(): void {
		this.initialized = false;
		console.debug('reset.initialized', this.initialized);
		this.hasValueChanged = false;

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
			: { ...modelFormValue.mailingAddressData };

		const bizTypeCode = modelFormValue.businessInformationData.bizTypeCode;

		let soleProprietorLicenceId: null | string = null;
		let soleProprietorSwlEmailAddress: null | string = null;
		let soleProprietorSwlPhoneNumber: null | string = null;

		if (this.isSoleProprietor(bizTypeCode)) {
			soleProprietorLicenceId = modelFormValue.businessInformationData.soleProprietorLicenceId;
			soleProprietorSwlEmailAddress = modelFormValue.businessInformationData.soleProprietorSwlEmailAddress;
			soleProprietorSwlPhoneNumber = modelFormValue.businessInformationData.soleProprietorSwlPhoneNumber;
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

	private createEmptyLicenceAuthenticated(
		profile: BizProfileResponse,
		applicationTypeCode: ApplicationTypeCode | undefined,
		relatedLicenceInformation?: LicenceResponse
	): Observable<any> {
		this.reset();

		return this.applyLicenceProfileIntoModel(profile, applicationTypeCode, relatedLicenceInformation);
	}

	private applyLicenceProfileIntoModel(
		profile: BizProfileResponse, // | WorkerLicenceAppResponse,
		applicationTypeCode: ApplicationTypeCode | undefined,
		relatedLicenceInformation?: LicenceResponse
	): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };
		const businessInformationData = {
			bizTypeCode: profile.bizTypeCode,
			legalBusinessName: profile.bizLegalName,
			bizTradeName: profile.bizTradeName,
			isBizTradeNameReadonly: !!profile.bizTradeName, // user cannot overwrite value from bceid
			soleProprietorLicenceId: profile.soleProprietorSwlContactInfo?.licenceId,
			soleProprietorLicenceHolderName: relatedLicenceInformation?.licenceHolderName,
			soleProprietorLicenceNumber: relatedLicenceInformation?.licenceNumber,
			soleProprietorLicenceExpiryDate: relatedLicenceInformation?.expiryDate,
			soleProprietorLicenceStatusCode: relatedLicenceInformation?.licenceStatusCode,
			soleProprietorSwlPhoneNumber: profile.soleProprietorSwlPhoneNumber,
			soleProprietorSwlEmailAddress: profile.soleProprietorSwlEmailAddress,
		};
		const businessManagerData = { isBusinessManager: true }; // default

		const bizAddress = profile.bizAddress;
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

		const bizBCAddress = profile.bizBCAddress;
		const bcBusinessAddressData = {
			addressSelected: !!bizBCAddress?.addressLine1,
			addressLine1: bizBCAddress?.addressLine1,
			addressLine2: bizBCAddress?.addressLine2,
			city: bizBCAddress?.city,
			postalCode: bizBCAddress?.postalCode,
			province: bizBCAddress?.province,
			country: bizBCAddress?.country,
		};

		const bizMailingAddress = profile.bizMailingAddress;
		const mailingAddressData = {
			addressSelected: !!bizMailingAddress?.addressLine1,
			addressLine1: bizMailingAddress?.addressLine1,
			addressLine2: bizMailingAddress?.addressLine2,
			city: bizMailingAddress?.city,
			postalCode: bizMailingAddress?.postalCode,
			province: bizMailingAddress?.province,
			country: bizMailingAddress?.country,
		};

		const categoryData = {
			PrivateInvestigator: true,
			// SecurityAlarmInstaller: true,
			// SecurityGuard: true,
			// ElectronicLockingDeviceInstaller: true,
			// SecurityAlarmMonitor: true,
		}; // TODO remove hardcoded

		const categoryPrivateInvestigatorData = {
			isInclude: true,
			givenName: '',
			middleName1: '',
			middleName2: '',
			surname: 'invest',
			managerLicenceNumber: '234234',
		};

		console.debug('[applyLicenceProfileIntoModel] profile', profile);
		console.debug('[applyLicenceProfileIntoModel] businessAddressData', businessAddressData);
		console.debug('[applyLicenceProfileIntoModel] bcBusinessAddressData', bcBusinessAddressData);
		console.debug('[applyLicenceProfileIntoModel] mailingAddressData', mailingAddressData);

		const hasBranchesInBc = (profile.branches ?? []).length > 0;
		const branchesInBcData = { hasBranchesInBc: this.utilService.booleanToBooleanType(hasBranchesInBc) };
		const isBcBusinessAddress = this.utilService.isBcAddress(businessAddressData.province, businessAddressData.country);

		this.businessModelFormGroup.patchValue(
			{
				bizId: 'bizId' in profile ? profile.bizId : null,
				licenceAppId: relatedLicenceInformation?.licenceAppId,
				workerLicenceTypeData,
				applicationTypeData,
				businessInformationData,
				businessManagerData,

				categoryData,
				categoryPrivateInvestigatorData,
				isBcBusinessAddress,
				businessAddressData: { ...businessAddressData },
				bcBusinessAddressData: { ...bcBusinessAddressData },
				mailingAddressData: { ...mailingAddressData },
				branchesInBcData,
			},
			{
				emitEvent: false,
			}
		);

		if (hasBranchesInBc) {
			const branchList = [...profile.branches!].sort((a, b) => {
				return this.utilService.sortByDirection(
					a.branchAddress?.city?.toUpperCase(),
					b.branchAddress?.city?.toUpperCase()
				);
			});

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

	private saveControllingMembersWithSwlBody(): null | Array<SwlContactInfo> {
		const modelFormValue = this.businessModelFormGroup.getRawValue();
		const controllingMembersWithSwlArray = modelFormValue.controllingMembersData.membersWithSwl;

		if (!controllingMembersWithSwlArray) {
			return null;
		}

		const swlControllingMembers: null | Array<SwlContactInfo> = controllingMembersWithSwlArray.map(
			(item: ControllingMemberContactInfo) => {
				const contactInfo: SwlContactInfo = {
					bizContactId: item.bizContactId,
					contactId: item.contactId,
					licenceId: item.licenceId,
				};
				return contactInfo;
			}
		);

		console.debug('saveControllingMembersWithSwlBody', swlControllingMembers);

		return swlControllingMembers;
	}

	private saveControllingMembersWithoutSwlBody(): null | Array<ContactInfo> {
		const modelFormValue = this.businessModelFormGroup.getRawValue();
		const controllingMembersWithoutSwlArray = modelFormValue.controllingMembersData.membersWithoutSwl;

		if (!controllingMembersWithoutSwlArray) {
			return null;
		}

		const nonSwlControllingMembers: null | Array<ContactInfo> = controllingMembersWithoutSwlArray.map(
			(item: ControllingMemberContactInfo) => {
				const contactInfo: ContactInfo = {
					bizContactId: item.bizContactId,
					emailAddress: item.emailAddress,
					givenName: item.givenName,
					middleName1: item.middleName1,
					middleName2: item.middleName2,
					phoneNumber: item.phoneNumber,
					surname: item.surname,
				};
				return contactInfo;
			}
		);

		console.debug('saveControllingMembersWithoutSwlBody', nonSwlControllingMembers);

		return nonSwlControllingMembers;
	}

	private saveEmployeesBody(): null | Array<SwlContactInfo> {
		const modelFormValue = this.businessModelFormGroup.getRawValue();
		const employeesArray = modelFormValue.employeesData.employees;

		if (!employeesArray) {
			return null;
		}

		const employees: null | Array<SwlContactInfo> = employeesArray.map((item: ControllingMemberContactInfo) => {
			const contactInfo: SwlContactInfo = {
				bizContactId: item.bizContactId,
				contactId: item.contactId,
				licenceId: item.licenceId,
			};
			return contactInfo;
		});

		console.debug('saveEmployeesBody', employees);

		return employees;
	}

	private isSoleProprietor(bizTypeCode: BizTypeCode): boolean {
		return (
			bizTypeCode === BizTypeCode.NonRegisteredSoleProprietor || bizTypeCode === BizTypeCode.RegisteredSoleProprietor
		);
	}
}
