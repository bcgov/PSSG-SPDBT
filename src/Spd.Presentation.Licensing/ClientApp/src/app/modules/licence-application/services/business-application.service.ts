import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, BizProfileResponse, BranchInfo, WorkerLicenceTypeCode } from '@app/api/models';
import { BizProfileService, LicenceService } from '@app/api/services';
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
	of,
	switchMap,
	tap,
} from 'rxjs';
import { BusinessApplicationHelper } from './business-application.helper';
import { CommonApplicationService } from './common-application.service';

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
		private utilService: UtilService,
		private licenceService: LicenceService,
		private bizProfileService: BizProfileService,
		private authUserBceidService: AuthUserBceidService,
		private commonApplicationService: CommonApplicationService
	) {
		super(formBuilder, configService, formatDatePipe);

		this.businessModelChangedSubscription = this.businessModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

					const province = this.businessModelFormGroup.get('businessAddressData.province')?.value;
					const country = this.businessModelFormGroup.get('businessAddressData.country')?.value;
					const isBcBusinessAddress = this.utilService.isBcAddress(province, country);

					this.businessModelFormGroup.patchValue({ isBcBusinessAddress }, { emitEvent: false });

					// const step1Complete = this.isStepLicenceSelectionComplete();
					// const step2Complete = this.isStepBackgroundComplete();
					// const step3Complete = this.isStepIdentificationComplete();
					const isValid = false; //TODO is businessModelFormGroup valid? // step1Complete && step2Complete && step3Complete;

					console.debug(
						'businessModelFormGroup CHANGED',
						// 	step1Complete,
						// 	step2Complete,
						// 	step3Complete,
						this.businessModelFormGroup.getRawValue()
					);

					this.businessModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewBusinessLicenceWithProfile(applicationTypeCode?: ApplicationTypeCode | undefined): Observable<any> {
		return this.bizProfileService.apiBizIdGet({ id: this.authUserBceidService.bceidUserProfile?.bizId! }).pipe(
			switchMap((profile: BizProfileResponse) => {
				return this.createEmptyLicenceAuthenticated(profile, applicationTypeCode).pipe(
					tap((_resp: any) => {
						this.initialized = true;

						this.commonApplicationService.setApplicationTitle(
							WorkerLicenceTypeCode.SecurityWorkerLicence,
							applicationTypeCode // if undefined, we are just loading the profile.
						);
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
		this.initialized = false;
		console.debug('reset.initialized', this.initialized);
		this.hasValueChanged = false;

		this.businessModelFormGroup.reset();

		// clear the alias data - this does not seem to get reset during a formgroup reset
		const bcBranchesArray = this.businessModelFormGroup.get('branchesInBcData.branches') as FormArray;
		while (bcBranchesArray.length) {
			bcBranchesArray.removeAt(0);
		}
		const controllingMembersArray = this.businessModelFormGroup.get('controllingMembersData.members') as FormArray;
		while (controllingMembersArray.length) {
			controllingMembersArray.removeAt(0);
		}
		const employeesArray = this.businessModelFormGroup.get('employeesData.employees') as FormArray;
		while (employeesArray.length) {
			employeesArray.removeAt(0);
		}
	}

	/*************************************************************/
	// COMMON
	/*************************************************************/

	private createEmptyLicenceAuthenticated(
		profile: BizProfileResponse,
		applicationTypeCode: ApplicationTypeCode | undefined
	): Observable<any> {
		this.reset();

		return this.applyLicenceProfileIntoModel(profile, applicationTypeCode);
	}

	private applyLicenceProfileIntoModel(
		profile: BizProfileResponse, // | WorkerLicenceAppResponse,
		applicationTypeCode: ApplicationTypeCode | undefined,
		_userLicenceInformation?: any //UserLicenceResponse
	): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityBusinessLicence };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };
		const businessInformationData = {
			businessTypeCode: profile.bizTypeCode,
			legalBusinessName: profile.bizLegalName,
			doingBusinessAsName: profile.bizTradeName,
			soleProprietorSwlEmailAddress: profile.soleProprietorSwlEmailAddress,
			soleProprietorSwlPhoneNumber: profile.soleProprietorSwlPhoneNumber,
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

		console.debug('[applyLicenceProfileIntoModel] profile', profile);
		console.debug('[applyLicenceProfileIntoModel] businessAddressData', businessAddressData);
		console.debug('[applyLicenceProfileIntoModel] bcBusinessAddressData', bcBusinessAddressData);
		console.debug('[applyLicenceProfileIntoModel] mailingAddressData', mailingAddressData);

		// const personalInformationData = {
		// 	givenName: profile.givenName,
		// 	middleName1: profile.middleName1,
		// 	middleName2: profile.middleName2,
		// 	surname: profile.surname,
		// 	dateOfBirth: profile.dateOfBirth,
		// 	genderCode: profile.genderCode,
		// 	hasGenderChanged: false,
		// 	hasBcscNameChanged: userLicenceInformation?.hasBcscNameChanged === true ? true : false,
		// 	origGivenName: profile.givenName,
		// 	origMiddleName1: profile.middleName1,
		// 	origMiddleName2: profile.middleName2,
		// 	origSurname: profile.surname,
		// 	origDateOfBirth: profile.dateOfBirth,
		// 	origGenderCode: profile.genderCode,
		// 	cardHolderName: userLicenceInformation?.cardHolderName ?? null,
		// 	licenceHolderName: userLicenceInformation?.licenceHolderName ?? null,
		// };

		// const originalLicenceData = {
		// 	originalApplicationId: userLicenceInformation?.licenceAppId ?? null,
		// 	originalLicenceId: userLicenceInformation?.licenceId ?? null,
		// 	originalLicenceNumber: userLicenceInformation?.licenceNumber ?? null,
		// 	originalExpiryDate: userLicenceInformation?.licenceExpiryDate ?? null,
		// 	originalLicenceTermCode: userLicenceInformation?.licenceTermCode ?? null,
		// 	originalBusinessTypeCode: userLicenceInformation?.businessTypeCode ?? null,
		// };

		const hasBranchesInBc = (profile.branches ?? []).length > 0;
		const branchesInBcData = { hasBranchesInBc: this.utilService.booleanToBooleanType(hasBranchesInBc) };
		const isBcBusinessAddress = this.utilService.isBcAddress(businessAddressData.province, businessAddressData.country);

		this.businessModelFormGroup.patchValue(
			{
				bizId: 'bizId' in profile ? profile.bizId : null,
				workerLicenceTypeData,
				applicationTypeData,
				businessInformationData,
				businessManagerData,

				isBcBusinessAddress,
				businessAddressData: { ...businessAddressData },
				bcBusinessAddressData: { ...bcBusinessAddressData },
				mailingAddressData: { ...mailingAddressData },
				// 		...originalLicenceData,
				// 		profileConfirmationData: { isProfileUpToDate: true },
				branchesInBcData,
			},
			{
				emitEvent: false,
			}
		);

		if (hasBranchesInBc) {
			const bcBranchesArray = this.businessModelFormGroup.get('branchesInBcData.branches') as FormArray;
			profile.branches?.forEach((branchInfo: BranchInfo) => {
				bcBranchesArray.push(
					new FormGroup({
						id: new FormControl(branchInfo.branchId),
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

		const controllingMembersArray = this.businessModelFormGroup.get('controllingMembersData.members') as FormArray;
		controllingMembersArray.push(
			new FormGroup({
				id: new FormControl('1'),
				givenName: new FormControl('Kimberly'),
				surname: new FormControl('Streisand'),
				emailAddress: new FormControl(),
				licenceNumber: new FormControl('7465766'),
				status: new FormControl('Valid'),
				expiryDate: new FormControl('2024-05-15'),
				clearanceStatus: new FormControl('Completed'),
			})
		);
		controllingMembersArray.push(
			new FormGroup({
				id: new FormControl('2'),
				givenName: new FormControl('Yank'),
				surname: new FormControl('Alexander'),
				emailAddress: new FormControl(),
				licenceNumber: new FormControl('2345433'),
				status: new FormControl('Expired'),
				expiryDate: new FormControl('2023-05-15'),
				clearanceStatus: new FormControl('Completed'),
			})
		);
		controllingMembersArray.push(
			new FormGroup({
				id: new FormControl('3'),
				givenName: new FormControl('Anderson'),
				surname: new FormControl('Cooper'),
				emailAddress: new FormControl('test@test.com'),
				licenceNumber: new FormControl(),
				status: new FormControl(),
				expiryDate: new FormControl(),
				clearanceStatus: new FormControl('Completed'),
			})
		);
		controllingMembersArray.push(
			new FormGroup({
				id: new FormControl('3'),
				givenName: new FormControl('James'),
				surname: new FormControl('Clark'),
				emailAddress: new FormControl(),
				licenceNumber: new FormControl(),
				status: new FormControl(),
				expiryDate: new FormControl(),
				clearanceStatus: new FormControl('Completed'),
			})
		);

		const employeesArray = this.businessModelFormGroup.get('employeesData.employees') as FormArray;
		employeesArray.push(
			new FormGroup({
				id: new FormControl('1'),
				givenName: new FormControl('Barbara'),
				surname: new FormControl('Streisand'),
				licenceNumber: new FormControl('7465766'),
				status: new FormControl('Valid'),
				expiryDate: new FormControl('2024-05-15'),
			})
		);
		employeesArray.push(
			new FormGroup({
				id: new FormControl('2'),
				givenName: new FormControl('Yank'),
				surname: new FormControl('Alexander'),
				licenceNumber: new FormControl('2345433'),
				status: new FormControl('Expired'),
				expiryDate: new FormControl('2023-05-15'),
			})
		);

		console.debug('[applyLicenceProfileIntoModel] businessModelFormGroup', this.businessModelFormGroup.value);
		return of(this.businessModelFormGroup.value);
	}
}
