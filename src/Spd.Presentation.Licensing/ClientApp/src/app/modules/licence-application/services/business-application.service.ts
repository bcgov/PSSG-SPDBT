import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode, WorkerLicenceTypeCode } from '@app/api/models';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { ConfigService } from '@app/core/services/config.service';
import { FormatDatePipe } from '@app/shared/pipes/format-date.pipe';
import { BehaviorSubject, Observable, Subscription, debounceTime, distinctUntilChanged, of, tap } from 'rxjs';
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

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
		businessTypeData: this.businessTypeFormGroup,
		businessNameData: this.businessNameFormGroup,
		companyBrandingData: this.companyBrandingFormGroup,
		liabilityData: this.liabilityFormGroup,

		categoryData: this.categoryFormGroup,
		categoryArmouredCarGuardData: this.categoryArmouredCarGuardFormGroup,
		categoryPrivateInvestigatorData: this.categoryPrivateInvestigatorFormGroup,
		categorySecurityGuardData: this.categorySecurityGuardFormGroup,

		licenceTermData: this.licenceTermFormGroup,
		businessManagerData: this.businessManagerFormGroup,
		businessAddressData: this.businessAddressFormGroup,
		mailingAddress: this.mailingAddressFormGroup,
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
		private commonApplicationService: CommonApplicationService
	) {
		super(formBuilder, configService, formatDatePipe);

		this.businessModelChangedSubscription = this.businessModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

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

	loadBusinessProfile(): Observable<any> {
		// return this.applicantProfileService
		// 	.apiApplicantIdGet({ id: this.authUserBcscService.applicantLoginProfile?.applicantId! })
		// 	.pipe(
		// 		switchMap((resp: ApplicantProfileResponse) => {
		return this.createEmptyLicenceAuthenticated({}, undefined).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle();
			})
		);
		// 	})
		// );
	}

	/**
	 * Create an empty anonymous licence
	 * @returns
	 */
	createNewBusinessLicence(): Observable<any> {
		return this.createEmptyLicenceAuthenticated({}, ApplicationTypeCode.New).pipe(
			tap((_resp: any) => {
				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(
					WorkerLicenceTypeCode.SecurityBusinessLicence,
					ApplicationTypeCode.New
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
		profile: any, //ApplicantProfileResponse,
		applicationTypeCode: ApplicationTypeCode | undefined
	): Observable<any> {
		this.reset();

		return this.applyLicenceProfileIntoModel(profile, applicationTypeCode);
	}

	private applyLicenceProfileIntoModel(
		_profile: any, //ApplicantProfileResponse | WorkerLicenceAppResponse,
		applicationTypeCode: ApplicationTypeCode | undefined,
		_userLicenceInformation?: any //UserLicenceResponse
	): Observable<any> {
		const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence };
		const applicationTypeData = { applicationTypeCode: applicationTypeCode ?? null };

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

		// const contactInformationData = {
		// 	emailAddress: profile.emailAddress,
		// 	phoneNumber: profile.phoneNumber,
		// };

		// const residentialAddress = {
		// 	addressSelected: true,
		// 	isMailingTheSameAsResidential: false,
		// 	addressLine1: profile.residentialAddress?.addressLine1,
		// 	addressLine2: profile.residentialAddress?.addressLine2,
		// 	city: profile.residentialAddress?.city,
		// 	country: profile.residentialAddress?.country,
		// 	postalCode: profile.residentialAddress?.postalCode,
		// 	province: profile.residentialAddress?.province,
		// };

		// const mailingAddress = {
		// 	addressSelected: profile.mailingAddress ? true : false,
		// 	isMailingTheSameAsResidential: false,
		// 	addressLine1: profile.mailingAddress?.addressLine1,
		// 	addressLine2: profile.mailingAddress?.addressLine2,
		// 	city: profile.mailingAddress?.city,
		// 	country: profile.mailingAddress?.country,
		// 	postalCode: profile.mailingAddress?.postalCode,
		// 	province: profile.mailingAddress?.province,
		// };

		const branchesInBcData = { hasBranchesInBc: BooleanTypeCode.Yes };

		this.businessModelFormGroup.patchValue(
			{
				// 		applicantId: 'applicantId' in profile ? profile.applicantId : null,
				workerLicenceTypeData,
				applicationTypeData,
				// 		...originalLicenceData,
				// 		profileConfirmationData: { isProfileUpToDate: true },
				// 		personalInformationData: { ...personalInformationData },
				// 		residentialAddress: { ...residentialAddress },
				// 		mailingAddress: { ...mailingAddress },
				branchesInBcData,
			},
			{
				emitEvent: false,
			}
		);

		const bcBranchesArray = this.businessModelFormGroup.get('branchesInBcData.branches') as FormArray;
		bcBranchesArray.push(
			new FormGroup({
				id: new FormControl('1'),
				addressSelected: new FormControl(true),
				addressLine1: new FormControl('2344 Douglas Street'),
				addressLine2: new FormControl(''),
				city: new FormControl('Timmons'),
				country: new FormControl('Canada'),
				postalCode: new FormControl('V8R2E4'),
				province: new FormControl('British Columbia'),
				managerName: new FormControl('Barbara Streisand'),
				managerSwlNumber: new FormControl('123123'),
				managerPhoneNumber: new FormControl('5551228787'),
				managerEmail: new FormControl('xxx@xxx.com'),
			})
		);
		bcBranchesArray.push(
			new FormGroup({
				id: new FormControl('2'),
				addressSelected: new FormControl(true),
				addressLine1: new FormControl('2344 Douglas Street'),
				addressLine2: new FormControl(''),
				city: new FormControl('Kamloops'),
				country: new FormControl('Canada'),
				postalCode: new FormControl('V8R2E4'),
				province: new FormControl('British Columbia'),
				managerName: new FormControl('Jason Alexander'),
				managerSwlNumber: new FormControl('123123'),
				managerPhoneNumber: new FormControl('5551228787'),
				managerEmail: new FormControl('yyy@yyy.com'),
			})
		);
		bcBranchesArray.push(
			new FormGroup({
				id: new FormControl('3'),
				addressSelected: new FormControl(true),
				addressLine1: new FormControl('2344 Blenkinsop Street'),
				addressLine2: new FormControl(''),
				city: new FormControl('Victoria'),
				country: new FormControl('Canada'),
				postalCode: new FormControl('V8R2E4'),
				province: new FormControl('British Columbia'),
				managerName: new FormControl('Anderson Cooper'),
				managerSwlNumber: new FormControl('4456789'),
				managerPhoneNumber: new FormControl('5551228787'),
				managerEmail: new FormControl('zzz@zzz.com'),
			})
		);

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
