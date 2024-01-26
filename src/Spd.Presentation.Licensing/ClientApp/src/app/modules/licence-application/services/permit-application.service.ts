import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	Alias,
	ApplicationTypeCode,
	BooleanTypeCode,
	BusinessTypeCode,
	CitizenshipDocument,
	Document,
	DocumentBase,
	FingerprintProofDocument,
	HeightUnitCode,
	IdPhotoDocument,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceFeeListResponse,
	LicenceFeeResponse,
	LicenceResponse,
	LicenceTermCode,
	WorkerCategoryTypeCode,
	WorkerLicenceAppAnonymousSubmitRequestJson,
	WorkerLicenceAppCategoryData,
	WorkerLicenceAppSubmitRequest,
	WorkerLicenceAppUpsertRequest,
	WorkerLicenceAppUpsertResponse,
	WorkerLicenceResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FormControlValidators } from '@app/core/validators/form-control.validators';
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
import { LicenceFeeService, LicenceLookupService, WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceDocument } from './licence-application.helper';
import { PermitApplicationHelper } from './permit-application.helper';

export class PermitDocumentsToSave {
	'licenceDocumentTypeCode': LicenceDocumentTypeCode;
	'documents': Array<Blob>;
}

@Injectable({
	providedIn: 'root',
})
export class PermitApplicationService extends PermitApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	permitModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	licenceFeesArmouredVehiclePermit: Array<LicenceFeeResponse> = [];
	licenceFeesBodyArmourPermit: Array<LicenceFeeResponse> = [];

	permitModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null),

		originalApplicationId: new FormControl(null),
		originalLicenceId: new FormControl(null),
		originalLicenceNumber: new FormControl(null),
		originalExpiryDate: new FormControl(null),

		applicationPortalStatus: new FormControl(null),

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		licenceTermData: this.licenceTermFormGroup,

		expiredLicenceData: this.expiredLicenceFormGroup,
		permitRequirementData: this.permitRequirementFormGroup,
		employerInformationData: this.employerInformationFormGroup,
		permitRationaleData: this.permitRationaleFormGroup,

		personalInformationData: this.personalInformationFormGroup,
		criminalHistoryData: this.criminalHistoryFormGroup,
		fingerprintProofData: this.fingerprintProofFormGroup,
		aliasesData: this.aliasesFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,

		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
		printPermitData: this.printPermitFormGroup,
		// profileConfirmationData: this.profileConfirmationFormGroup,
	});

	// licenceUserModelFormGroup: FormGroup = this.formBuilder.group({
	// 	personalInformationData: this.personalInformationFormGroup,
	// 	aliasesData: this.aliasesFormGroup,
	// 	residentialAddressData: this.residentialAddressFormGroup,
	// 	mailingAddressData: this.mailingAddressFormGroup,
	// 	contactInformationData: this.contactInformationFormGroup,
	// });

	permitModelChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		private licenceFeeService: LicenceFeeService,
		private workerLicensingService: WorkerLicensingService,
		private licenceLookupService: LicenceLookupService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private utilService: UtilService
	) {
		super(formBuilder, configService, formatDatePipe);

		this.licenceFeeService
			.apiLicenceFeeWorkerLicenceTypeCodeGet({ workerLicenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit })
			.pipe()
			.subscribe((resp: LicenceFeeListResponse) => {
				this.licenceFeesArmouredVehiclePermit = resp.licenceFees ?? [];
			});

		this.licenceFeeService
			.apiLicenceFeeWorkerLicenceTypeCodeGet({ workerLicenceTypeCode: WorkerLicenceTypeCode.BodyArmourPermit })
			.pipe()
			.subscribe((resp: LicenceFeeListResponse) => {
				this.licenceFeesBodyArmourPermit = resp.licenceFees ?? [];
			});

		this.permitModelChangedSubscription = this.permitModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

					const step1Complete = this.isStepPermitDetailsComplete();
					const step2Complete = this.isStepPurposeAndRationaleComplete();
					const step3Complete = this.isStepIdentificationComplete();
					const step4Complete = this.isStepContactComplete();

					const isValid = step1Complete && step2Complete && step3Complete && step4Complete;

					console.debug(
						'permitModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						step4Complete,
						this.permitModelFormGroup.getRawValue()
					);

					this.permitModelValueChanges$.next(isValid);
				}
			});
	}

	/**
	 * Search for an existing permit using access code
	 * @param licenceNumber
	 * @param accessCode
	 * @param recaptchaCode
	 * @returns
	 */
	getPermitWithAccessCode(
		licenceNumber: string,
		accessCode: string,
		recaptchaCode: string
	): Observable<LicenceResponse> {
		return this.licenceLookupService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, accessCode, body: { recaptchaCode } })
			.pipe(take(1));
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getPermitNew(licenceAppId: string): Observable<WorkerLicenceResponse> {
		console.debug('getPermitNew', licenceAppId);

		return this.loadPermitNew(licenceAppId).pipe(
			tap((resp: any) => {
				console.debug('LOAD loadPermitNew', resp);
				this.initialized = true;
			})
		);
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getPermitWithAccessCodeData(
		accessCodeData: any,
		applicationTypeCode: ApplicationTypeCode
	): Observable<WorkerLicenceResponse> {
		return this.getPermitOfType(accessCodeData.linkedLicenceAppId, applicationTypeCode!).pipe(
			tap((_resp: any) => {
				this.permitModelFormGroup.patchValue(
					{
						originalApplicationId: accessCodeData.linkedLicenceAppId,
						originalLicenceId: accessCodeData.linkedLicenceId,
						originalLicenceNumber: accessCodeData.licenceNumber,
						originalExpiryDate: accessCodeData.linkedExpiryDate,
					},
					{ emitEvent: false }
				);
				console.debug('[getPermitWithAccessCodeData] permitModelFormGroup', this.permitModelFormGroup.value);
			})
		);
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	getPermitOfType(licenceAppId: string, applicationTypeCode: ApplicationTypeCode): Observable<WorkerLicenceResponse> {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return this.loadPermitRenewal(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('[getLicenceOfType] Renewal', licenceAppId, applicationTypeCode, resp);
						this.initialized = true;
					})
				);
			}
			default: {
				// case ApplicationTypeCode.Update: {
				return this.loadPermitUpdate(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('[getLicenceOfType] Update', licenceAppId, applicationTypeCode, resp);
						this.initialized = true;
					})
				);
			}
			// Replacement does not exist for Permits
		}
	}

	/**
	 * Load an existing draft licence application
	 * @param licenceAppId
	 * @returns
	 */
	private loadPermitNew(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificPermit(licenceAppId).pipe(
			tap((resp: any) => {
				console.debug('[loadPermitNew] resp', resp);
			})
		);
	}

	/**
	 * Load an existing licence application for renewal
	 * @param licenceAppId
	 * @returns
	 */
	private loadPermitRenewal(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificPermit(licenceAppId).pipe(
			tap((resp: any) => {
				// const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit }; // TODO remove hardcoded

				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };
				// const permitRequirementData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const permitRequirementData = { workerLicenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit }; // TODO remove hardcoded

				const licenceTermData = {
					licenceTermCode: LicenceTermCode.FiveYears,
				};

				// TODO remove hardcoded
				const employerInformationData = {
					businessName: 'aaa',
					supervisorName: 'ccc',
					supervisorEmailAddress: 'bbb@bbb.com',
					supervisorPhoneNumber: '5554448787',
					addressSelected: true,
					addressLine1: 'bbb1',
					addressLine2: 'bbb2',
					city: 'bbb3',
					postalCode: 'V9A6D4',
					province: 'bbb4',
					country: 'bbb5',
				};

				this.permitModelFormGroup.patchValue(
					{
						licenceAppId: null,
						originalApplicationId: licenceAppId,
						workerLicenceTypeData,
						applicationTypeData,
						permitRequirementData,
						licenceTermData,
						employerInformationData,
					},
					{
						emitEvent: false,
					}
				);

				console.debug('[loadPermitRenewal] resp', resp);
			})
		);
	}

	/**
	 * Load an existing licence application for update
	 * @param licenceAppId
	 * @returns
	 */
	private loadPermitUpdate(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificPermit(licenceAppId).pipe(
			tap((resp: any) => {
				// const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit }; // TODO remove hardcoded

				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };
				// const permitRequirementData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const permitRequirementData = { workerLicenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit }; // TODO remove hardcoded

				const licenceTermData = {
					licenceTermCode: LicenceTermCode.FiveYears,
				};

				// TODO remove hardcoded
				const employerInformationData = {
					businessName: 'aaa',
					supervisorName: 'ccc',
					supervisorEmailAddress: 'bbb@bbb.com',
					supervisorPhoneNumber: '5554448787',
					addressSelected: true,
					addressLine1: 'bbb1',
					addressLine2: 'bbb2',
					city: 'bbb3',
					postalCode: 'V9A6D4',
					province: 'bbb4',
					country: 'bbb5',
				};

				this.permitModelFormGroup.patchValue(
					{
						licenceAppId: null,
						originalApplicationId: licenceAppId,
						workerLicenceTypeData,
						applicationTypeData,
						permitRequirementData,
						licenceTermData,
						employerInformationData,
					},
					{
						emitEvent: false,
					}
				);

				console.debug('[loadPermitUpdate] resp', resp);
			})
		);
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewPermitAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.createEmptyPermitAnonymous(workerLicenceTypeCode).pipe(
			tap((resp: any) => {
				console.debug('[createNewPermitAnonymous] resp', resp);

				this.initialized = true;
			})
		);
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewPermitAuthenticated(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.createPermitAuthenticated(workerLicenceTypeCode).pipe(
			tap((resp: any) => {
				console.debug('[createNewPermitAuthenticated] resp', resp);

				this.initialized = true;
			})
		);
	}

	private createEmptyPermitAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		this.reset();

		const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceTypeCode };
		const photographOfYourselfData = {
			useBcServicesCardPhoto: BooleanTypeCode.No,
		};
		const permitRequirementData = {
			workerLicenceTypeCode: workerLicenceTypeCode,
		};
		const licenceTermData = {
			licenceTermCode: LicenceTermCode.FiveYears,
		};

		this.permitModelFormGroup.patchValue(
			{
				workerLicenceTypeData,
				permitRequirementData,
				photographOfYourselfData,
				licenceTermData,
			},
			{
				emitEvent: false,
			}
		);

		console.log('[createEmptyPermitAnonymous] permitModelFormGroup', this.permitModelFormGroup.value);

		return of(this.permitModelFormGroup.value);
	}

	private createPermitAuthenticated(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		this.reset();

		const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceTypeCode };
		const permitRequirementData = { workerLicenceTypeCode: workerLicenceTypeCode };

		const licenceTermData = {
			licenceTermCode: LicenceTermCode.FiveYears,
		};

		const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
		if (bcscUserWhoamiProfile) {
			const personalInformationData = {
				givenName: bcscUserWhoamiProfile.firstName,
				middleName1: bcscUserWhoamiProfile.middleName1,
				middleName2: bcscUserWhoamiProfile.middleName2,
				surname: bcscUserWhoamiProfile.lastName,
				dateOfBirth: bcscUserWhoamiProfile.birthDate,
				genderCode: bcscUserWhoamiProfile.gender,
			};

			const residentialAddressData = {
				addressSelected: true,
				isMailingTheSameAsResidential: false,
				addressLine1: bcscUserWhoamiProfile.residentialAddress?.addressLine1,
				addressLine2: bcscUserWhoamiProfile.residentialAddress?.addressLine2,
				city: bcscUserWhoamiProfile.residentialAddress?.city,
				country: bcscUserWhoamiProfile.residentialAddress?.country,
				postalCode: bcscUserWhoamiProfile.residentialAddress?.postalCode,
				province: bcscUserWhoamiProfile.residentialAddress?.province,
			};

			this.permitModelFormGroup.patchValue(
				{
					personalInformationData: { ...personalInformationData },
					residentialAddressData: { ...residentialAddressData },
					aliasesData: { previousNameFlag: BooleanTypeCode.No },
					workerLicenceTypeData,
					permitRequirementData,
					licenceTermData,
				},
				{
					emitEvent: false,
				}
			);
		} else {
			const residentialAddressData = {
				isMailingTheSameAsResidential: false,
			};

			this.permitModelFormGroup.patchValue(
				{
					residentialAddressData: { ...residentialAddressData },
					aliasesData: { previousNameFlag: BooleanTypeCode.No },
					workerLicenceTypeData,
					permitRequirementData,
					licenceTermData,
				},
				{
					emitEvent: false,
				}
			);
		}

		console.log('[createPermitAuthenticated] permitModelFormGroup', this.permitModelFormGroup.value);

		return of(this.permitModelFormGroup.value);
	}

	private loadSpecificPermit(licenceAppId: string): Observable<WorkerLicenceResponse> {
		this.reset();

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
			tap((resp: WorkerLicenceResponse) => {
				const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
				const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };
				const permitRequirementData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };

				const expiredLicenceData = {
					hasExpiredPermit: this.booleanToBooleanType(resp.hasExpiredLicence),
					expiredLicenceNumber: resp.expiredLicenceNumber,
					expiryDate: resp.expiryDate,
					expiredLicenceId: resp.expiredLicenceId,
				};

				const licenceTermData = {
					licenceTermCode: resp.licenceTermCode,
				};

				const bcDriversLicenceData = {
					hasBcDriversLicence: this.booleanToBooleanType(resp.hasBcDriversLicence),
					bcDriversLicenceNumber: resp.bcDriversLicenceNumber,
				};

				const fingerprintProofDataAttachments: Array<File> = [];
				if (resp.fingerprintProofDocument?.documentResponses) {
					resp.fingerprintProofDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						fingerprintProofDataAttachments.push(aFile);
					});
				}

				const fingerprintProofData = {
					attachments: fingerprintProofDataAttachments,
				};

				const criminalHistoryData = {
					hasCriminalHistory: this.booleanToBooleanType(resp.hasCriminalHistory),
				};

				const aliasesData = {
					previousNameFlag: resp.hasPreviousName ? this.booleanToBooleanType(resp.hasPreviousName) : BooleanTypeCode.No,
				};

				let personalInformationData = {};
				if (bcscUserWhoamiProfile) {
					personalInformationData = {
						givenName: bcscUserWhoamiProfile.firstName,
						middleName1: bcscUserWhoamiProfile.middleName1,
						middleName2: bcscUserWhoamiProfile.middleName2,
						surname: bcscUserWhoamiProfile.lastName,
						genderCode: bcscUserWhoamiProfile.gender,
						dateOfBirth: bcscUserWhoamiProfile.birthDate,
						origGivenName: bcscUserWhoamiProfile.firstName,
						origMiddleName1: bcscUserWhoamiProfile.middleName1,
						origMiddleName2: bcscUserWhoamiProfile.middleName2,
						origSurname: bcscUserWhoamiProfile.lastName,
						origGenderCode: bcscUserWhoamiProfile.gender,
						origDateOfBirth: bcscUserWhoamiProfile.birthDate,
					};
				} else {
					personalInformationData = {
						givenName: resp.givenName,
						middleName1: resp.middleName1,
						middleName2: resp.middleName2,
						surname: resp.surname,
						genderCode: resp.genderCode,
						dateOfBirth: resp.dateOfBirth,
						origGivenName: resp.givenName,
						origMiddleName1: resp.middleName1,
						origMiddleName2: resp.middleName2,
						origSurname: resp.surname,
						origGenderCode: resp.genderCode,
						origDateOfBirth: resp.dateOfBirth,
					};
				}

				const citizenshipDataAttachments: Array<File> = [];
				if (resp.citizenshipDocument?.documentResponses) {
					resp.citizenshipDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						citizenshipDataAttachments.push(aFile);
					});
				}

				const citizenshipData = {
					// TODO fix permit citizenship data
					isCanadianCitizen: this.booleanToBooleanType(resp.isCanadianCitizen),
					canadianCitizenProofTypeCode: resp.isCanadianCitizen
						? resp.citizenshipDocument?.licenceDocumentTypeCode
						: null,
					notCanadianCitizenProofTypeCode: resp.isCanadianCitizen
						? null
						: resp.citizenshipDocument?.licenceDocumentTypeCode,
					expiryDate: resp.citizenshipDocument?.expiryDate,
					attachments: citizenshipDataAttachments,
				};

				let height = resp.height ? resp.height + '' : null;
				let heightInches = '';
				if (resp.heightUnitCode == HeightUnitCode.Inches && resp.height && resp.height > 0) {
					height = Math.trunc(resp.height / 12) + '';
					heightInches = (resp.height % 12) + '';
				}

				const characteristicsData = {
					hairColourCode: resp.hairColourCode,
					eyeColourCode: resp.eyeColourCode,
					height,
					heightUnitCode: resp.heightUnitCode,
					heightInches,
					weight: resp.weight ? resp.weight + '' : null,
					weightUnitCode: resp.weightUnitCode,
				};

				const photographOfYourselfAttachments: Array<File> = [];
				if (resp.idPhotoDocument?.documentResponses) {
					resp.idPhotoDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						photographOfYourselfAttachments.push(aFile);
					});
				}

				const photographOfYourselfData = {
					useBcServicesCardPhoto: this.booleanToBooleanType(resp.useBcServicesCardPhoto),
					attachments: photographOfYourselfAttachments,
				};

				const contactInformationData = {
					contactEmailAddress: resp.contactEmailAddress,
					contactPhoneNumber: resp.contactPhoneNumber,
				};

				let residentialAddressData = {};
				const isMailingTheSameAsResidential = resp.isMailingTheSameAsResidential ?? false;
				if (bcscUserWhoamiProfile) {
					residentialAddressData = {
						addressSelected: true,
						isMailingTheSameAsResidential: isMailingTheSameAsResidential,
						addressLine1: bcscUserWhoamiProfile.residentialAddress?.addressLine1,
						addressLine2: bcscUserWhoamiProfile.residentialAddress?.addressLine2,
						city: bcscUserWhoamiProfile.residentialAddress?.city,
						country: bcscUserWhoamiProfile.residentialAddress?.country,
						postalCode: bcscUserWhoamiProfile.residentialAddress?.postalCode,
						province: bcscUserWhoamiProfile.residentialAddress?.province,
					};
				} else {
					residentialAddressData = {
						...resp.residentialAddressData,
						isMailingTheSameAsResidential: isMailingTheSameAsResidential,
						addressSelected: !!resp.residentialAddressData?.addressLine1,
					};
				}

				let mailingAddressData = {};
				// if (!isMailingTheSameAsResidential) {
				mailingAddressData = {
					...resp.mailingAddressData,
					addressSelected: !!resp.mailingAddressData?.addressLine1,
				};
				// }

				this.permitModelFormGroup.patchValue(
					{
						licenceAppId: resp.licenceAppId,
						// caseNumber: resp.caseNumber,
						applicationPortalStatus: resp.applicationPortalStatus,
						workerLicenceTypeData,
						permitRequirementData,
						applicationTypeData,
						expiredLicenceData,
						licenceTermData,
						bcDriversLicenceData,
						fingerprintProofData,
						criminalHistoryData,
						aliasesData,
						personalInformationData,
						characteristicsData,
						citizenshipData,
						photographOfYourselfData,
						contactInformationData,
						profileConfirmationData: { isProfileUpToDate: true },
						residentialAddressData: { ...residentialAddressData },
						mailingAddressData: { ...mailingAddressData },
					},
					{
						emitEvent: false,
					}
				);

				const aliasesArray = this.permitModelFormGroup.get('aliasesData.aliases') as FormArray;
				resp.aliases?.forEach((alias: Alias) => {
					aliasesArray.push(
						new FormGroup({
							givenName: new FormControl(alias.givenName),
							middleName1: new FormControl(alias.middleName1),
							middleName2: new FormControl(alias.middleName2),
							surname: new FormControl(alias.surname, [FormControlValidators.required]),
						})
					);
				});

				this.permitModelFormGroup.setControl('aliasesData.aliases', aliasesArray);

				console.debug('[loadSpecificPermit] licenceModelFormGroup', this.permitModelFormGroup.value);
			}),
			take(1)
		);
	}

	/**
	 * Reset the licence data
	 */
	reset(): void {
		this.initialized = false;
		console.debug('reset.initialized', this.initialized);

		this.hasValueChanged = false;

		this.permitModelFormGroup.reset();

		const aliases1 = this.permitModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		aliases1.clear();
	}

	/**
	 * Upload a file of a certain type. Return a reference to the file that will used when the licence is saved
	 * @param documentCode
	 * @param document
	 * @returns
	 */
	addUploadDocument(
		documentCode: LicenceDocumentTypeCode,
		document: File
	): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
		const doc: LicenceDocument = {
			Documents: [document],
			LicenceDocumentTypeCode: documentCode,
		};

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response({
			licenceAppId: this.permitModelFormGroup.get('licenceAppId')?.value,
			body: doc,
		});
	}

	/**
	 * Get the licence fees for the licence and application type and business type
	 * @returns list of fees
	 */
	public getLicenceTermsAndFees(): Array<LicenceFeeResponse> {
		const workerLicenceTypeCode = this.permitModelFormGroup.get('workerLicenceTypeData.workerLicenceTypeCode')?.value;
		const businessTypeCode = BusinessTypeCode.RegisteredPartnership; // TODO permit, what business type to use?
		// ** Permits are always 5 years

		// console.debug('getLicenceTermsAndFees', workerLicenceTypeCode, businessTypeCode);

		if (!workerLicenceTypeCode || !businessTypeCode) {
			return [];
		}

		// console.debug('getLicenceTermsAndFees', workerLicenceTypeCode, businessTypeCode);

		if (workerLicenceTypeCode === WorkerLicenceTypeCode.ArmouredVehiclePermit) {
			return this.licenceFeesArmouredVehiclePermit?.filter(
				(item) =>
					item.workerLicenceTypeCode == workerLicenceTypeCode &&
					item.businessTypeCode == businessTypeCode &&
					item.licenceTermCode == LicenceTermCode.FiveYears
			);
		} else {
			return this.licenceFeesBodyArmourPermit?.filter(
				(item) =>
					item.workerLicenceTypeCode == workerLicenceTypeCode &&
					item.businessTypeCode == businessTypeCode &&
					item.licenceTermCode == LicenceTermCode.FiveYears &&
					item.hasValidSwl90DayLicence === false
			);
		}
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepPermitDetailsComplete(): boolean {
		console.debug('isStepPermitDetailsComplete', this.expiredLicenceFormGroup.valid);

		return this.expiredLicenceFormGroup.valid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepPurposeAndRationaleComplete(): boolean {
		console.debug(
			'isStepPurposeAndRationaleComplete',
			this.permitRequirementFormGroup.valid,
			this.employerInformationFormGroup.valid,
			this.permitRationaleFormGroup.valid
		);

		return (
			this.permitRequirementFormGroup.valid &&
			this.employerInformationFormGroup.valid &&
			this.permitRationaleFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepIdentificationComplete(): boolean {
		console.debug(
			'isStepIdentificationComplete',
			this.personalInformationFormGroup.valid,
			this.criminalHistoryFormGroup.valid,
			this.fingerprintProofFormGroup.valid,
			this.aliasesFormGroup.valid,
			this.citizenshipFormGroup.valid,
			this.bcDriversLicenceFormGroup.valid,
			this.characteristicsFormGroup.valid,
			this.photographOfYourselfFormGroup.valid
		);

		// if (this.authenticationService.isLoggedIn()) {
		// 	return (
		// 		this.citizenshipFormGroup.valid &&
		// 		this.bcDriversLicenceFormGroup.valid &&
		// 		this.characteristicsFormGroup.valid &&
		// 		this.photographOfYourselfFormGroup.valid
		// 	);
		// } else {
		return (
			this.personalInformationFormGroup.valid &&
			this.criminalHistoryFormGroup.valid &&
			this.fingerprintProofFormGroup.valid &&
			this.aliasesFormGroup.valid &&
			this.citizenshipFormGroup.valid &&
			this.bcDriversLicenceFormGroup.valid &&
			this.characteristicsFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid
		);
		// }
	}

	isStepContactComplete(): boolean {
		console.debug(
			'isStepContactComplete',
			this.residentialAddressFormGroup.valid &&
				this.mailingAddressFormGroup.valid &&
				this.contactInformationFormGroup.valid
		);

		return (
			this.residentialAddressFormGroup.valid &&
			this.mailingAddressFormGroup.valid &&
			this.contactInformationFormGroup.valid
		);
	}

	/**
	 * Determine if the step data should be saved. If the data has changed and category data exists;
	 * @returns
	 */
	isSaveStep(): boolean {
		// console.log('isSaveStep', this.soleProprietorFormGroup.valid, this.soleProprietorFormGroup.value);
		const shouldSaveStep = this.hasValueChanged;
		// const shouldSaveStep =
		// 	this.hasValueChanged &&
		// 	((this.categoryArmouredCarGuardFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryBodyArmourSalesFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryClosedCircuitTelevisionInstallerFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryElectronicLockingDeviceInstallerFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryFireInvestigatorFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryLocksmithFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryLocksmithSupFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categoryPrivateInvestigatorSupFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmInstallerFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmInstallerSupFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityConsultantFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmMonitorFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmResponseFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityAlarmSalesFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityGuardFormGroup.get('isInclude')?.value ?? false) ||
		// 		(this.categorySecurityGuardSupFormGroup.get('isInclude')?.value ?? false));

		console.debug('shouldSaveStep', shouldSaveStep);
		return shouldSaveStep;
	}

	/**
	 * Save the licence data
	 * @returns
	 */
	saveLicenceStep(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const body = this.getSaveBody();
		return this.workerLicensingService.apiWorkerLicenceApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => {
				const formValue = this.permitModelFormGroup.getRawValue();
				if (!formValue.licenceAppId) {
					this.permitModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
	}

	submitPermit(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		if (this.authenticationService.isLoggedIn()) {
			return this.submitPermitAuthenticated();
		} else {
			return this.submitPermitAnonymous();
		}
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	private submitPermitAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const body = this.getSaveBody();
		console.debug('submitLicenceAuthenticated body', body);

		return this.workerLicensingService.apiWorkerLicenceApplicationsSubmitPost$Response({ body });
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	private getSaveBody(): WorkerLicenceAppUpsertRequest | WorkerLicenceAppSubmitRequest {
		const formValue = this.permitModelFormGroup.getRawValue();
		console.debug('getSaveBody licenceModelFormGroup', formValue);

		const licenceAppId = formValue.licenceAppId;
		const workerLicenceTypeData = { ...formValue.workerLicenceTypeData };
		const applicationTypeData = { ...formValue.applicationTypeData };
		const bcDriversLicenceData = { ...formValue.bcDriversLicenceData };
		const contactInformationData = { ...formValue.contactInformationData };
		const expiredLicenceData = { ...formValue.expiredLicenceData };
		const characteristicsData = { ...formValue.characteristicsData };
		const residentialAddressData = { ...formValue.residentialAddressData };
		const mailingAddressData = { ...formValue.mailingAddressData };
		const citizenshipData = { ...formValue.citizenshipData };
		const fingerprintProofData = { ...formValue.fingerprintProofData };
		const photographOfYourselfData = { ...formValue.photographOfYourselfData };

		const personalInformationData = { ...formValue.personalInformationData };
		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		let fingerprintProofDocument: FingerprintProofDocument | null = null;
		if (fingerprintProofData.attachments) {
			const fingerprintProofDocuments: Array<LicenceAppDocumentResponse> = [];
			fingerprintProofData.attachments.forEach((doc: any) => {
				fingerprintProofDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			fingerprintProofDocument = {
				documentResponses: fingerprintProofDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
			};
		}

		let citizenshipDocument: CitizenshipDocument | null = null;
		if (citizenshipData.attachments) {
			// TODO fix permit citizenship data
			const citizenshipDocuments: Array<LicenceAppDocumentResponse> = [];
			citizenshipData.attachments.forEach((doc: any) => {
				citizenshipDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			citizenshipDocument = {
				documentResponses: citizenshipDocuments,
				expiryDate: citizenshipData.expiryDate
					? this.formatDatePipe.transform(citizenshipData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
					: null,
				licenceDocumentTypeCode:
					citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
						? citizenshipData.canadianCitizenProofTypeCode
						: citizenshipData.notCanadianCitizenProofTypeCode,
			};
		}

		let idPhotoDocument: IdPhotoDocument | null = null;
		if (photographOfYourselfData.attachments) {
			const photographOfYourselfDocuments: Array<LicenceAppDocumentResponse> = [];
			photographOfYourselfData.attachments.forEach((doc: any) => {
				photographOfYourselfDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			idPhotoDocument = {
				documentResponses: photographOfYourselfDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
			};
		}

		if (characteristicsData.heightUnitCode == HeightUnitCode.Inches) {
			const ft: number = +characteristicsData.height;
			const inch: number = +characteristicsData.heightInches;
			characteristicsData.height = String(ft * 12 + inch);
		}

		const expiredLicenceExpiryDate = expiredLicenceData.expiryDate
			? this.formatDatePipe.transform(expiredLicenceData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
			: null;

		const body: WorkerLicenceAppUpsertRequest | WorkerLicenceAppSubmitRequest = {
			licenceAppId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			//-----------------------------------
			hasPreviousName: this.booleanTypeToBoolean(formValue.aliasesData.previousNameFlag),
			aliases: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes ? formValue.aliasesData.aliases : [],
			//-----------------------------------
			hasBcDriversLicence: this.booleanTypeToBoolean(bcDriversLicenceData.hasBcDriversLicence),
			bcDriversLicenceNumber:
				bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
					? bcDriversLicenceData.bcDriversLicenceNumber
					: null,
			//-----------------------------------
			...contactInformationData,
			//-----------------------------------
			hasExpiredPermit: false, // TODO remove?
			expiredLicenceNumber:
				expiredLicenceData.hasExpiredPermit == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceNumber : null,
			expiredLicenceId:
				expiredLicenceData.hasExpiredPermit == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceId : null,
			expiryDate: expiredLicenceData.hasExpiredPermit == BooleanTypeCode.Yes ? expiredLicenceExpiryDate : null,
			//-----------------------------------
			...characteristicsData,
			//-----------------------------------
			...personalInformationData,
			//-----------------------------------
			hasCriminalHistory: this.booleanTypeToBoolean(formValue.criminalHistoryData.hasCriminalHistory),
			//-----------------------------------
			licenceTermCode: formValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			isMailingTheSameAsResidential: residentialAddressData.isMailingTheSameAsResidential,
			mailingAddressData: residentialAddressData.isMailingTheSameAsResidential
				? residentialAddressData
				: mailingAddressData,
			residentialAddressData,
			//-----------------------------------
			isCanadianCitizen: this.booleanTypeToBoolean(citizenshipData.isCanadianCitizen),
			citizenshipDocument,
			//-----------------------------------
			fingerprintProofDocument,
			//-----------------------------------
			// useBcServicesCardPhoto: this.booleanTypeToBoolean(photographOfYourselfData.useBcServicesCardPhoto),
			idPhotoDocument,
			//-----------------------------------
		};
		return body;
	}

	/**
	 * Submit the permit data
	 * @returns
	 */
	private submitPermitAnonymous(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		let keyCode = '';
		const body = this.getSaveBodyAnonymous();
		console.debug('submitPermitAnonymous body', body);

		const documentInfos = this.getSaveDocsAnonymous();
		// console.log('documentInfos', documentInfos);

		const formValue = this.consentAndDeclarationFormGroup.getRawValue();
		// console.debug('submitPermitAnonymous', formValue);

		const googleRecaptcha = { recaptchaCode: formValue.captchaFormGroup.token };
		return this.workerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((resp: string) => {
					keyCode = resp;

					const documentsToSave: Observable<string>[] = [];
					documentInfos.forEach((docBody: PermitDocumentsToSave) => {
						documentsToSave.push(
							this.workerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeFilesPost({
								keyCode,
								body: {
									Documents: docBody.documents,
									LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
								},
							})
						);
					});

					return forkJoin(documentsToSave);
				}),
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = resps;

					return this.workerLicensingService.apiWorkerLicenceApplicationsAnonymousKeyCodeSubmitPost$Response({
						keyCode,
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	private getSaveBodyAnonymous(): WorkerLicenceAppAnonymousSubmitRequestJson {
		const savebody = this.getSaveBody();

		const documentInfos = this.getSaveDocumentInfosAnonymous();
		// console.log('documentInfos', documentInfos);

		const categoryData = savebody.categoryData ?? [];

		const categoryCodes: Array<WorkerCategoryTypeCode> = categoryData.map(
			(item: WorkerLicenceAppCategoryData) => item.workerCategoryTypeCode!
		);

		const requestBody: WorkerLicenceAppAnonymousSubmitRequestJson = {
			workerLicenceTypeCode: savebody.workerLicenceTypeCode,
			applicationTypeCode: savebody.applicationTypeCode,
			givenName: savebody.givenName,
			middleName1: savebody.middleName1,
			middleName2: savebody.middleName2,
			surname: savebody.surname,
			dateOfBirth: savebody.dateOfBirth,
			genderCode: savebody.genderCode,
			expiredLicenceNumber: savebody.expiredLicenceNumber,
			expiredLicenceId: savebody.expiredLicenceId,
			hasExpiredLicence: savebody.hasExpiredLicence,
			licenceTermCode: savebody.licenceTermCode,
			hasCriminalHistory: savebody.hasCriminalHistory,
			hasPreviousName: savebody.hasPreviousName,
			hasBcDriversLicence: savebody.hasBcDriversLicence,
			bcDriversLicenceNumber: savebody.bcDriversLicenceNumber,
			hairColourCode: savebody.hairColourCode,
			eyeColourCode: savebody.eyeColourCode,
			height: savebody.height,
			heightUnitCode: savebody.heightUnitCode,
			weight: savebody.weight,
			weightUnitCode: savebody.weightUnitCode,
			contactEmailAddress: savebody.contactEmailAddress,
			contactPhoneNumber: savebody.contactPhoneNumber,
			isMailingTheSameAsResidential: savebody.isMailingTheSameAsResidential ?? false,
			isPoliceOrPeaceOfficer: savebody.isPoliceOrPeaceOfficer,
			policeOfficerRoleCode: savebody.policeOfficerRoleCode,
			otherOfficerRole: savebody.otherOfficerRole,
			isTreatedForMHC: savebody.isTreatedForMHC,
			useBcServicesCardPhoto: savebody.useBcServicesCardPhoto,
			carryAndUseRestraints: savebody.carryAndUseRestraints ?? null,
			useDogs: savebody.useDogs ?? null,
			isDogsPurposeProtection: savebody.isDogsPurposeProtection ?? null,
			isDogsPurposeDetectionDrugs: savebody.isDogsPurposeDetectionDrugs ?? null,
			isDogsPurposeDetectionExplosives: savebody.isDogsPurposeDetectionExplosives ?? null,
			isCanadianCitizen: savebody.isCanadianCitizen,
			aliases: savebody.aliases ? [...savebody.aliases] : [],
			residentialAddressData: { ...savebody.residentialAddressData },
			mailingAddressData: { ...savebody.mailingAddressData },
			categoryCodes: categoryCodes,
			documentInfos,
		};
		// console.log('requestBody', requestBody);

		return requestBody;
	}

	getSaveDocumentInfosAnonymous(): Array<DocumentBase> {
		const documents: Array<DocumentBase> = [];
		const savebody = this.getSaveBody();

		savebody.categoryData?.forEach((item: WorkerLicenceAppCategoryData) => {
			item.documents?.forEach((doc: Document) => {
				if (doc.expiryDate) {
					documents.push({ licenceDocumentTypeCode: doc.licenceDocumentTypeCode!, expiryDate: doc.expiryDate });
				}
			});
		});

		if (savebody.citizenshipDocument?.expiryDate) {
			documents.push({
				licenceDocumentTypeCode: savebody.citizenshipDocument.licenceDocumentTypeCode,
				expiryDate: savebody.citizenshipDocument.expiryDate,
			});
		}

		console.debug('submitPermitAnonymous documentInfos', documents);
		return documents;
	}

	getSaveDocsAnonymous(): Array<PermitDocumentsToSave> {
		const documents: Array<PermitDocumentsToSave> = [];
		const formValue = this.permitModelFormGroup.getRawValue();

		const citizenshipData = { ...formValue.citizenshipData };
		const fingerprintProofData = { ...formValue.fingerprintProofData };
		const photographOfYourselfData = { ...formValue.photographOfYourselfData };

		if (fingerprintProofData.attachments) {
			const docs: Array<Blob> = [];
			fingerprintProofData.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint, documents: docs });
		}

		if (citizenshipData.attachments) {
			// TODO fix permit citizenship data
			const docs: Array<Blob> = [];
			citizenshipData.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			const citizenshipLicenceDocumentTypeCode =
				citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes
					? citizenshipData.canadianCitizenProofTypeCode
					: citizenshipData.notCanadianCitizenProofTypeCode;
			documents.push({ licenceDocumentTypeCode: citizenshipLicenceDocumentTypeCode, documents: docs });
		}

		if (photographOfYourselfData.attachments) {
			const docs: Array<Blob> = [];
			photographOfYourselfData.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
		}

		return documents;
	}
}
