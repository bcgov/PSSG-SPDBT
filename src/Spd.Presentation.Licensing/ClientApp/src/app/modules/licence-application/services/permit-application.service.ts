import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
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
	LicenceLookupResponse,
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
		licenceExpiryDate: new FormControl(null), // TODO if application is a licence, return this value
		licenceNumber: new FormControl(null), // TODO if application is a licence, return this value
		originalApplicationId: new FormControl(null),
		// expiryDate: new FormControl(null), // TODO needed?
		caseNumber: new FormControl(null), // TODO needed?
		applicationPortalStatus: new FormControl(null),

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,

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
	// licenceModelAnonymousChangedSubscription!: Subscription;

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
	): Observable<LicenceLookupResponse> {
		return this.licenceLookupService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, accessCode, body: { recaptchaCode } })
			.pipe(take(1));
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	loadPermit(
		licenceAppId: string,
		workerLicenceTypeCode: WorkerLicenceTypeCode,
		applicationTypeCode: ApplicationTypeCode
	): Observable<WorkerLicenceResponse> {
		// TODO add:  switch workerLicenceTypeCode

		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return this.loadPermitRenewal(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('LOAD loadPermitRenewal', resp);
						this.initialized = true;
					})
				);
			}
			case ApplicationTypeCode.Update: {
				return this.loadPermitUpdate(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('LOAD loadPermitUpdate', resp);
						this.initialized = true;
					})
				);
			}
			// case ApplicationTypeCode.Replacement: {
			// 	return this.loadPermitReplacement(licenceAppId).pipe(
			// 		tap((resp: any) => {
			// 			console.debug('LOAD loadPermitReplacement', resp);
			// 			this.initialized = true;
			// 		})
			// 	);
			// }
			default: {
				return this.loadPermitNew(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('LOAD loadPermitNew', resp);
						this.initialized = true;
					})
				);
			}
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
				console.debug('LOAD loadPermitNew', resp);
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
				const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };
				const permitRequirementData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };

				// TODO renewal - remove data that should be re-prompted for
				// const licenceTermData = {
				// 	licenceTermCode: null,
				// };
				// const bcDriversLicenceData = {
				// 	hasBcDriversLicence: null,
				// 	bcDriversLicenceNumber: null,
				// };
				// const fingerprintProofData = {
				// 	attachments: [],
				// };
				// const aliasesData = { previousNameFlag: null, aliases: [] };
				// const citizenshipData = {
				// 	isCanadianCitizen: null,
				// 	canadianCitizenProofTypeCode: null,
				// 	notCanadianCitizenProofTypeCode: null,
				// 	expiryDate: null,
				// 	attachments: [],
				// };
				// const additionalGovIdData = {
				// 	governmentIssuedPhotoTypeCode: null,
				// 	expiryDate: null,
				// 	attachments: [],
				// };

				this.permitModelFormGroup.patchValue(
					{
						licenceAppId: null,
						originalApplicationId: licenceAppId,
						workerLicenceTypeData,
						applicationTypeData,
						permitRequirementData,
						// licenceTermData,
						// bcDriversLicenceData,
						// fingerprintProofData,
						// aliasesData,
						// citizenshipData,
						// additionalGovIdData,
						// restraintsAuthorizationData,
						// dogsAuthorizationData,
					},
					{
						emitEvent: false,
					}
				);

				console.debug('LOAD LicenceApplicationService loadPermitRenewal', resp);
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
				const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };
				const permitRequirementData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				// TODO renewal - remove data that should be re-prompted for
				// const licenceTermData = {
				// 	licenceTermCode: null,
				// };
				// const bcDriversLicenceData = {
				// 	hasBcDriversLicence: null,
				// 	bcDriversLicenceNumber: null,
				// };
				// const fingerprintProofData = {
				// 	attachments: [],
				// };
				// const aliasesData = { previousNameFlag: null, aliases: [] };
				// const citizenshipData = {
				// 	isCanadianCitizen: null,
				// 	canadianCitizenProofTypeCode: null,
				// 	notCanadianCitizenProofTypeCode: null,
				// 	expiryDate: null,
				// 	attachments: [],
				// };
				// const additionalGovIdData = {
				// 	governmentIssuedPhotoTypeCode: null,
				// 	expiryDate: null,
				// 	attachments: [],
				// };

				this.permitModelFormGroup.patchValue(
					{
						licenceAppId: null,
						originalApplicationId: licenceAppId,
						workerLicenceTypeData,
						applicationTypeData,
						permitRequirementData,
						// licenceTermData,
						// bcDriversLicenceData,
						// fingerprintProofData,
						// aliasesData,
						// citizenshipData,
						// additionalGovIdData,
						// restraintsAuthorizationData,
						// dogsAuthorizationData,
					},
					{
						emitEvent: false,
					}
				);

				console.debug('LOAD LicenceApplicationService loadPermitRenewal', resp);
			})
		);
	}

	// /**
	//  * Load an existing licence application for replacement
	//  * @param licenceAppId
	//  * @returns
	//  */
	// private loadPermitReplacement(licenceAppId: string): Observable<WorkerLicenceResponse> {
	// 	return this.loadSpecificPermit(licenceAppId).pipe(
	// 		tap((resp: any) => {
	// 			const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

	// 			const residentialAddressData = {
	// 				isMailingTheSameAsResidential: false, // Mailing address validation will only show when this is false.
	// 			};

	// 			this.permitModelFormGroup.patchValue(
	// 				{
	// 					licenceAppId: null,
	// 					originalApplicationId: licenceAppId,
	// 					applicationTypeData,
	// 					residentialAddressData: { ...residentialAddressData },
	// 				},
	// 				{
	// 					emitEvent: false,
	// 				}
	// 			);

	// 			console.debug('LOAD LicenceApplicationService loadPermitRenewal', resp);
	// 		})
	// 	);
	// }

	/**
	 * Load an existing licence application for update
	 * @param licenceAppId
	 * @returns
	 */
	// loadUpdateLicence(): Observable<WorkerLicenceResponse> { // TODO remove?

	// 	return this.loadPermit(licenceAppId!, workerLicenceTypeCode, applicationTypeCode).pipe(
	// 	// return this.createLicenceAuthenticated().pipe(
	// 		// TODO update
	// 		tap((_resp: any) => {
	// 			console.debug('loadUserProfile');

	// 			this.initialized = true;
	// 			console.debug('this.initialized', this.initialized);
	// 		})
	// 	);
	// }

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewPermitAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.createPermitAnonymous(workerLicenceTypeCode).pipe(
			tap((resp: any) => {
				console.debug('NEW createNewPermitAnonymous', resp);

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
				console.debug('NEW createNewPermitAuthenticated', resp);

				this.initialized = true;
			})
		);
	}

	private createPermitAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		this.reset();

		return this.loadPermit(
			'ef0b27ee-db15-409a-8f8f-6a7922a2332b',
			WorkerLicenceTypeCode.ArmouredVehiclePermit,
			ApplicationTypeCode.New
		).pipe(
			tap((_resp: any) => {
				const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceTypeCode };
				// const permitRequirementData = { workerLicenceTypeCode: workerLicenceTypeCode };
				const photographOfYourselfData = {
					useBcServicesCardPhoto: BooleanTypeCode.No,
				};

				// temp
				const permitRequirementData = {
					workerLicenceTypeCode: workerLicenceTypeCode,
					armouredVehicleRequirementFormGroup: {
						isPersonalProtection: true,
					},
				};
				// temp
				const employerInformationData = {
					businessName: 'aaa',
					supervisorName: 'bbb',
					supervisorEmailAddress: 'test@test.com',
					supervisorPhoneNumber: '3334445555',
					addressSelected: true,
					addressLine1: 'aaa',
					addressLine2: 'bbb',
					city: 'ccc',
					postalCode: 'ddd',
					province: 'eee',
					country: 'fff',
				};
				// temp
				const permitRationaleData = {
					rationale:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
				};

				this.permitModelFormGroup.patchValue(
					{
						workerLicenceTypeData,
						permitRequirementData,
						photographOfYourselfData,
						profileConfirmationData: { isProfileUpToDate: true },
						employerInformationData, //temp
						permitRationaleData, //temp
					},
					{
						emitEvent: false,
					}
				);

				return of(this.permitModelFormGroup.value);
			})
		);
	}

	private createPermitAuthenticated(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		this.reset();

		const workerLicenceTypeData = { workerLicenceTypeCode: workerLicenceTypeCode };
		const permitRequirementData = { workerLicenceTypeCode: workerLicenceTypeCode };
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
				},
				{
					emitEvent: false,
				}
			);
		}

		return of(this.permitModelFormGroup.value);
	}

	private loadSpecificPermit(licenceAppId: string): Observable<WorkerLicenceResponse> {
		this.reset();

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
			tap((resp: WorkerLicenceResponse) => {
				resp.workerLicenceTypeCode = WorkerLicenceTypeCode.BodyArmourPermit; // TODO Remove
				const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
				const workerLicenceTypeData = { workerLicenceTypeCode: WorkerLicenceTypeCode.BodyArmourPermit }; // TODO  resp.workerLicenceTypeCode };
				const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };
				const permitRequirementData = { workerLicenceTypeCode: WorkerLicenceTypeCode.BodyArmourPermit }; // TODO resp.workerLicenceTypeCode };

				const expiredLicenceData = {
					hasExpiredPermit: this.booleanToBooleanType(resp.hasExpiredLicence),
					expiredLicenceNumber: resp.expiredLicenceNumber,
					expiryDate: resp.expiryDate,
					expiredLicenceId: resp.expiredLicenceId,
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

				const additionalGovIdAttachments: Array<File> = [];
				if (resp.additionalGovIdDocument?.documentResponses) {
					resp.additionalGovIdDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						additionalGovIdAttachments.push(aFile);
					});
				}

				const additionalGovIdData = {
					governmentIssuedPhotoTypeCode: resp.additionalGovIdDocument?.licenceDocumentTypeCode,
					expiryDate: resp.additionalGovIdDocument?.expiryDate,
					attachments: additionalGovIdAttachments,
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
						// expiryDate: resp.expiryDate, // TODO fix??
						caseNumber: resp.caseNumber,
						applicationPortalStatus: resp.applicationPortalStatus,
						workerLicenceTypeData,
						permitRequirementData,
						applicationTypeData,
						expiredLicenceData,
						bcDriversLicenceData,
						fingerprintProofData,
						criminalHistoryData,
						aliasesData,
						personalInformationData,
						characteristicsData,
						citizenshipData,
						additionalGovIdData,
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

				// console.debug('loadExistingLicence resp', resp);
				console.debug('LOAD EXISTING licenceModelFormGroup', this.permitModelFormGroup.value);
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
		const businessTypeCode = BusinessTypeCode.None;
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
					item.licenceTermCode == LicenceTermCode.FiveYears
			);
		}
	}

	isShowAdditionalGovermentIdStep(): boolean {
		const form = this.citizenshipFormGroup;
		return (
			(form.value.isCanadianCitizen == BooleanTypeCode.Yes &&
				form.value.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			(form.value.isCanadianCitizen == BooleanTypeCode.No &&
				form.value.notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard)
		);
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
		// const showAdditionalGovermentIdStep = this.citizenshipFormGroup
		// 	? (this.citizenshipFormGroup.value.isCanadianCitizen == BooleanTypeCode.Yes &&
		// 			this.citizenshipFormGroup.value.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
		// 	  (this.citizenshipFormGroup.value.isCanadianCitizen == BooleanTypeCode.No &&
		// 			this.citizenshipFormGroup.value.notCanadianCitizenProofTypeCode !=
		// 				LicenceDocumentTypeCode.PermanentResidentCard)
		// 	: true;

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
		// console.debug('showAdditionalGovermentIdStep', showAdditionalGovermentIdStep, this.additionalGovIdFormGroup.valid);

		// if (this.authenticationService.isLoggedIn()) {
		// 	return (
		// 		this.citizenshipFormGroup.valid &&
		// 		(showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true) &&
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

		// let additionalGovIdDocument: AdditionalGovIdDocument | null = null;
		// const isIncludeAdditionalGovermentIdStepData = this.includeAdditionalGovermentIdStepData(
		// 	citizenshipData.isCanadianCitizen,
		// 	citizenshipData.canadianCitizenProofTypeCode,
		// 	citizenshipData.notCanadianCitizenProofTypeCode
		// );

		// if (isIncludeAdditionalGovermentIdStepData && additionalGovIdData.attachments) {
		// 	const additionalGovIdDocuments: Array<LicenceAppDocumentResponse> = [];
		// 	additionalGovIdData.attachments.forEach((doc: any) => {
		// 		additionalGovIdDocuments.push({
		// 			documentUrlId: doc.documentUrlId,
		// 		});
		// 	});
		// 	additionalGovIdDocument = {
		// 		documentResponses: additionalGovIdDocuments,
		// 		expiryDate: additionalGovIdData.expiryDate
		// 			? this.formatDatePipe.transform(additionalGovIdData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
		// 			: null,
		// 		licenceDocumentTypeCode: additionalGovIdData.governmentIssuedPhotoTypeCode,
		// 	};
		// } else {
		// 	this.additionalGovIdFormGroup.reset();
		// }

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
			// additionalGovIdDocument,
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
					body.fileKeyCodes = resps;

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

		if (savebody.additionalGovIdDocument?.expiryDate) {
			documents.push({
				licenceDocumentTypeCode: savebody.additionalGovIdDocument.licenceDocumentTypeCode,
				expiryDate: savebody.additionalGovIdDocument.expiryDate,
			});
		}

		console.debug('submitPermitAnonymous documentInfos', documents);
		return documents;
	}

	getSaveDocsAnonymous(): Array<PermitDocumentsToSave> {
		const documents: Array<PermitDocumentsToSave> = [];
		const formValue = this.permitModelFormGroup.getRawValue();

		const citizenshipData = { ...formValue.citizenshipData };
		// const additionalGovIdData = { ...formValue.additionalGovIdData };
		// const policeBackgroundData = { ...formValue.policeBackgroundData };
		const fingerprintProofData = { ...formValue.fingerprintProofData };
		// const mentalHealthConditionsData = { ...formValue.mentalHealthConditionsData };
		const photographOfYourselfData = { ...formValue.photographOfYourselfData };

		if (fingerprintProofData.attachments) {
			const docs: Array<Blob> = [];
			fingerprintProofData.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint, documents: docs });
		}

		if (citizenshipData.attachments) {
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

		// const isIncludeAdditionalGovermentIdStepData = this.includeAdditionalGovermentIdStepData(
		// 	citizenshipData.isCanadianCitizen,
		// 	citizenshipData.canadianCitizenProofTypeCode,
		// 	citizenshipData.notCanadianCitizenProofTypeCode
		// );

		// if (isIncludeAdditionalGovermentIdStepData && additionalGovIdData.attachments) {
		// 	const docs: Array<Blob> = [];
		// 	additionalGovIdData.attachments.forEach((doc: Blob) => {
		// 		docs.push(doc);
		// 	});
		// 	documents.push({ licenceDocumentTypeCode: additionalGovIdData.governmentIssuedPhotoTypeCode, documents: docs });
		// }

		if (photographOfYourselfData.attachments) {
			const docs: Array<Blob> = [];
			photographOfYourselfData.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself, documents: docs });
		}

		return documents;
	}

	// private includeAdditionalGovermentIdStepData(
	// 	isCanadianCitizen: BooleanTypeCode,
	// 	canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null,
	// 	notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null
	// ): boolean {
	// 	return (
	// 		(isCanadianCitizen == BooleanTypeCode.Yes &&
	// 			canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
	// 		(isCanadianCitizen == BooleanTypeCode.No &&
	// 			notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard)
	// 	);
	// }
}
