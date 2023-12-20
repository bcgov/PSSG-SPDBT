import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	AdditionalGovIdDocument,
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
	MentalHealthDocument,
	PoliceOfficerDocument,
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
import { LicenceFeeService, WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { PrivateInvestigatorTrainingCode, RestraintDocumentTypeCode } from 'src/app/core/code-types/model-desc.models';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationHelper, LicenceDocument } from './licence-application.helper';

export class DocumentsToSave {
	'licenceDocumentTypeCode': LicenceDocumentTypeCode;
	'documents': Array<Blob>;
}

export class WorkerLicenceAppAnonymousSubmitRequest {
	'workerLicenceTypeCode'?: string | null;
	'applicationTypeCode'?: string | null;
	'isSoleProprietor'?: boolean | null;
	'givenName'?: string | null;
	'middleName1'?: string | null;
	'middleName2'?: string | null;
	'surname'?: string | null;
	'dateOfBirth'?: string | null;
	'genderCode'?: string | null;
	'oneLegalName'?: boolean | null;
	'expiredLicenceNumber'?: string | null;
	'expiredLicenceId'?: string | null;
	'hasExpiredLicence'?: boolean | null;
	'licenceTermCode'?: string | null;
	'hasCriminalHistory'?: boolean | null;
	'hasPreviousName'?: boolean | null;
	'hasBcDriversLicence'?: boolean | null;
	'bcDriversLicenceNumber'?: string | null;
	'hairColourCode'?: string | null;
	'eyeColourCode'?: string | null;
	'height'?: number | null;
	'heightUnitCode'?: string | null;
	'weight'?: number | null;
	'weightUnitCode'?: string | null;
	'contactEmailAddress'?: string | null;
	'contactPhoneNumber'?: string | null;
	'isMailingTheSameAsResidential'?: boolean | null;
	'isPoliceOrPeaceOfficer'?: boolean | null;
	'policeOfficerRoleCode'?: string | null;
	'otherOfficerRole'?: string | null;
	'isTreatedForMHC'?: boolean | null;
	'useBcServicesCardPhoto'?: boolean | null;
	'carryAndUseRestraints'?: boolean | null;
	'useDogs'?: boolean | null;
	'isDogsPurposeProtection'?: boolean | null;
	'isDogsPurposeDetectionDrugs'?: boolean | null;
	'isDogsPurposeDetectionExplosives'?: boolean | null;
	'isCanadianCitizen'?: boolean | null;
	'aliases'?: Array<{
		givenName?: string | null;
		middleName1?: string | null;
		middleName2?: string | null;
		surname?: string | null;
	}>;
	'residentialAddressData'?: {
		addressLine1?: string | null;
		addressLine2?: string | null;
		city?: string | null;
		country?: string | null;
		postalCode?: string | null;
		province?: string | null;
	};
	'mailingAddressData'?: {
		addressLine1?: string | null;
		addressLine2?: string | null;
		city?: string | null;
		country?: string | null;
		postalCode?: string | null;
		province?: string | null;
	};
	'categoryCodes'?: Array<string>;
	'documentInfos'?: Array<{
		licenceDocumentTypeCode?: string;
		expiryDate?: string | null;
	}>;
}

export class WorkerLicenceApplicationsSubmitAnonymousPost {
	'docs': Array<Blob>;
	'WorkerLicenceAppAnonymousSubmitRequest': WorkerLicenceAppAnonymousSubmitRequest;
}

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService extends LicenceApplicationHelper {
	initialized = false;
	hasValueChanged = false;

	licenceModelValueChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	licenceFees: Array<LicenceFeeResponse> = [];
	licenceFeeTermCodes: Array<LicenceFeeResponse> = [];

	licenceModelFormGroup: FormGroup = this.formBuilder.group({
		licenceAppId: new FormControl(null),
		expiryDate: new FormControl(null),
		caseNumber: new FormControl(null),
		applicationPortalStatus: new FormControl(null),
		personalInformationData: this.personalInformationFormGroup,
		aliasesData: this.aliasesFormGroup,
		// expiredLicenceData: this.expiredLicenceFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
		profileConfirmationData: this.profileConfirmationFormGroup,

		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		soleProprietorData: this.soleProprietorFormGroup,
		licenceTermData: this.licenceTermFormGroup,
		restraintsAuthorizationData: this.restraintsAuthorizationFormGroup,
		dogsAuthorizationData: this.dogsAuthorizationFormGroup,
		categoryArmouredCarGuardFormGroup: this.categoryArmouredCarGuardFormGroup,
		categoryBodyArmourSalesFormGroup: this.categoryBodyArmourSalesFormGroup,
		categoryClosedCircuitTelevisionInstallerFormGroup: this.categoryClosedCircuitTelevisionInstallerFormGroup,
		categoryElectronicLockingDeviceInstallerFormGroup: this.categoryElectronicLockingDeviceInstallerFormGroup,
		categoryFireInvestigatorFormGroup: this.categoryFireInvestigatorFormGroup,
		categoryLocksmithFormGroup: this.categoryLocksmithFormGroup,
		categoryLocksmithSupFormGroup: this.categoryLocksmithSupFormGroup,
		categoryPrivateInvestigatorFormGroup: this.categoryPrivateInvestigatorFormGroup,
		categoryPrivateInvestigatorSupFormGroup: this.categoryPrivateInvestigatorSupFormGroup,
		categorySecurityAlarmInstallerFormGroup: this.categorySecurityAlarmInstallerFormGroup,
		categorySecurityAlarmInstallerSupFormGroup: this.categorySecurityAlarmInstallerSupFormGroup,
		categorySecurityConsultantFormGroup: this.categorySecurityConsultantFormGroup,
		categorySecurityAlarmMonitorFormGroup: this.categorySecurityAlarmMonitorFormGroup,
		categorySecurityAlarmResponseFormGroup: this.categorySecurityAlarmResponseFormGroup,
		categorySecurityAlarmSalesFormGroup: this.categorySecurityAlarmSalesFormGroup,
		categorySecurityGuardFormGroup: this.categorySecurityGuardFormGroup,
		categorySecurityGuardSupFormGroup: this.categorySecurityGuardSupFormGroup,
		policeBackgroundData: this.policeBackgroundFormGroup,
		mentalHealthConditionsData: this.mentalHealthConditionsFormGroup,
		criminalHistoryData: this.criminalHistoryFormGroup,
		fingerprintProofData: this.fingerprintProofFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		additionalGovIdData: this.additionalGovIdFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
	});

	// licenceUserModelFormGroup: FormGroup = this.formBuilder.group({
	// 	personalInformationData: this.personalInformationFormGroup,
	// 	aliasesData: this.aliasesFormGroup,
	// 	residentialAddressData: this.residentialAddressFormGroup,
	// 	mailingAddressData: this.mailingAddressFormGroup,
	// 	contactInformationData: this.contactInformationFormGroup,
	// });

	licenceModelChangedSubscription!: Subscription;
	// licenceModelAnonymousChangedSubscription!: Subscription;

	constructor(
		formBuilder: FormBuilder,
		configService: ConfigService,
		formatDatePipe: FormatDatePipe,
		private licenceFeeService: LicenceFeeService,
		private workerLicensingService: WorkerLicensingService,
		private authUserBcscService: AuthUserBcscService,
		private authenticationService: AuthenticationService,
		private utilService: UtilService
	) {
		super(formBuilder, configService, formatDatePipe);

		this.licenceFeeService
			.apiLicenceFeeWorkerLicenceTypeCodeGet({ workerLicenceTypeCode: WorkerLicenceTypeCode.SecurityWorkerLicence })
			.pipe()
			.subscribe((resp: LicenceFeeListResponse) => {
				this.licenceFees = resp.licenceFees ?? [];
			});

		this.licenceModelChangedSubscription = this.licenceModelFormGroup.valueChanges
			.pipe(debounceTime(200), distinctUntilChanged())
			.subscribe((_resp: any) => {
				if (this.initialized) {
					this.hasValueChanged = true;

					// const step1Complete = this.isStep1Complete();
					const step1Complete = this.isStepLicenceSelectionComplete();
					const step2Complete = this.isStepBackgroundComplete();
					const step3Complete = this.isStepIdentificationComplete();
					const isValid = step1Complete && step2Complete && step3Complete;

					console.log(
						'licenceModelFormGroup CHANGED',
						step1Complete,
						step2Complete,
						step3Complete,
						this.licenceModelFormGroup.getRawValue()
					);

					this.licenceModelValueChanges$.next(isValid);
				}
			});
	}
	async delay(ms: number) {
		await new Promise<void>((resolve) => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
	}
	/**
	 * Load a user profile
	 * @returns
	 */
	loadUserProfile(): Observable<WorkerLicenceResponse> {
		return this.createLicenceAuthenticated().pipe(
			// TODO update
			tap((_resp: any) => {
				console.debug('loadUserProfile');

				this.initialized = true;
				console.log('this.initialized', this.initialized);
			})
		);
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	loadLicence(
		licenceAppId: string,
		workerLicenceTypeCode: WorkerLicenceTypeCode,
		applicationTypeCode: ApplicationTypeCode
	): Observable<WorkerLicenceResponse> {
		// TODO add:  switch workerLicenceTypeCode

		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return this.loadLicenceRenewal(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('LOAD LicenceApplicationService loadLicenceRenewal', resp);
						this.initialized = true;
					})
				);
			}
			case ApplicationTypeCode.Update: {
				return this.loadLicenceUpdate(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('LOAD LicenceApplicationService loadLicenceUpdate', resp);
						this.initialized = true;
					})
				);
			}
			case ApplicationTypeCode.Replacement: {
				return this.loadLicenceReplacement(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('LOAD LicenceApplicationService loadLicenceReplacement', resp);
						this.initialized = true;
					})
				);
			}
			default: {
				return this.loadLicenceNew(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('LOAD LicenceApplicationService loadLicenceNew', resp);
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
	private loadLicenceNew(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificLicence(licenceAppId).pipe(
			tap((resp: any) => {
				console.debug('LOAD LicenceApplicationService loadLicenceNew', resp);
			})
		);
	}

	/**
	 * Load an existing licence application for renewal
	 * @param licenceAppId
	 * @returns
	 */
	private loadLicenceRenewal(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificLicence(licenceAppId).pipe(
			tap((resp: any) => {
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Renewal };
				// TODO renewal - remove data that should be re-prompted for
				// const soleProprietorData = {
				// 	isSoleProprietor: null,
				// };
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

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: null,
						applicationTypeData,
						// soleProprietorData,
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

				console.debug('LOAD LicenceApplicationService loadLicenceRenewal', resp);
				// this.initialized = true;
			})
		);
	}

	/**
	 * Load an existing licence application for update
	 * @param licenceAppId
	 * @returns
	 */
	private loadLicenceUpdate(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificLicence(licenceAppId).pipe(
			tap((resp: any) => {
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Update };
				// TODO renewal - remove data that should be re-prompted for
				// const soleProprietorData = {
				// 	isSoleProprietor: null,
				// };
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

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: null,
						applicationTypeData,
						// soleProprietorData,
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

				console.debug('LOAD LicenceApplicationService loadLicenceRenewal', resp);
				// this.initialized = true;
			})
		);
	}

	/**
	 * Load an existing licence application for replacement
	 * @param licenceAppId
	 * @returns
	 */
	private loadLicenceReplacement(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificLicence(licenceAppId).pipe(
			tap((resp: any) => {
				const applicationTypeData = { applicationTypeCode: ApplicationTypeCode.Replacement };

				const residentialAddressData = {
					isMailingTheSameAsResidential: false, // Mailing address validation will only show when this is false.
				};

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: null,
						applicationTypeData,
						residentialAddressData: { ...residentialAddressData },
					},
					{
						emitEvent: false,
					}
				);

				console.debug('LOAD LicenceApplicationService loadLicenceRenewal', resp);
				// this.initialized = true;
			})
		);
	}

	/**
	 * Load an existing licence application for update
	 * @param licenceAppId
	 * @returns
	 */
	loadUpdateLicence(): Observable<WorkerLicenceResponse> {
		return this.createLicenceAuthenticated().pipe(
			// TODO update
			tap((_resp: any) => {
				console.debug('loadUserProfile');

				this.initialized = true;
				console.log('this.initialized', this.initialized);
			})
		);
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewLicenceAnonymous(): Observable<any> {
		return this.createLicenceAnonymous().pipe(
			tap((resp: any) => {
				console.debug('NEW LicenceApplicationService createNewLicenceAnonymous', resp);

				this.initialized = true;
			})
		);
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewLicenceAuthenticated(): Observable<any> {
		return this.createLicenceAuthenticated().pipe(
			tap((resp: any) => {
				console.debug('NEW LicenceApplicationService createNewLicenceAuthenticated', resp);

				this.initialized = true;
			})
		);
	}

	private createLicenceAnonymous(): Observable<any> {
		this.reset();

		this.licenceModelFormGroup.patchValue(
			{
				profileConfirmationData: { isProfileUpToDate: true },
			},
			{
				emitEvent: false,
			}
		);

		return of(this.licenceModelFormGroup.value);
	}

	private createLicenceAuthenticated(): Observable<any> {
		this.reset();

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

			this.licenceModelFormGroup.patchValue(
				{
					personalInformationData: { ...personalInformationData },
					residentialAddressData: { ...residentialAddressData },
					aliasesData: { previousNameFlag: BooleanTypeCode.No },
				},
				{
					emitEvent: false,
				}
			);
		} else {
			const residentialAddressData = {
				isMailingTheSameAsResidential: false,
			};

			this.licenceModelFormGroup.patchValue(
				{
					residentialAddressData: { ...residentialAddressData },
					aliasesData: { previousNameFlag: BooleanTypeCode.No },
				},
				{
					emitEvent: false,
				}
			);
		}

		return of(this.licenceModelFormGroup.value);
	}

	private loadSpecificLicence(licenceAppId: string): Observable<WorkerLicenceResponse> {
		this.reset();

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
			tap((resp: WorkerLicenceResponse) => {
				const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
				const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };
				const soleProprietorData = {
					isSoleProprietor: this.booleanToBooleanType(resp.isSoleProprietor),
				};

				// const expiredLicenceData = {
				// 	hasExpiredLicence: this.booleanToBooleanType(resp.hasExpiredLicence),
				// 	expiredLicenceNumber: resp.expiredLicenceNumber,
				// 	expiryDate: resp.expiryDate,
				// 	expiredLicenceId: resp.expiredLicenceId,
				// };

				const licenceTermData = {
					licenceTermCode: resp.licenceTermCode,
				};

				const policeBackgroundDataAttachments: Array<File> = [];
				if (resp.policeOfficerDocument?.documentResponses) {
					resp.policeOfficerDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						policeBackgroundDataAttachments.push(aFile);
					});
				}

				const policeBackgroundData = {
					isPoliceOrPeaceOfficer: this.booleanToBooleanType(resp.isPoliceOrPeaceOfficer),
					policeOfficerRoleCode: resp.policeOfficerRoleCode,
					otherOfficerRole: resp.otherOfficerRole,
					attachments: policeBackgroundDataAttachments,
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

				const mentalHealthConditionsDataAttachments: Array<File> = [];
				if (resp.mentalHealthDocument?.documentResponses) {
					resp.mentalHealthDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
						const aFile = this.utilService.dummyFile(item);
						mentalHealthConditionsDataAttachments.push(aFile);
					});
				}

				const mentalHealthConditionsData = {
					isTreatedForMHC: this.booleanToBooleanType(resp.isTreatedForMHC),
					attachments: mentalHealthConditionsDataAttachments,
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
					};
				} else {
					personalInformationData = {
						givenName: resp.givenName,
						middleName1: resp.middleName1,
						middleName2: resp.middleName2,
						surname: resp.surname,
						genderCode: resp.genderCode,
						dateOfBirth: resp.dateOfBirth,
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

				let restraintsAuthorizationData: any = {};
				let dogsAuthorizationData: any = {};
				let categoryArmouredCarGuardFormGroup: any = { isInclude: false };
				let categoryBodyArmourSalesFormGroup: any = { isInclude: false };
				let categoryClosedCircuitTelevisionInstallerFormGroup: any = { isInclude: false };
				let categoryElectronicLockingDeviceInstallerFormGroup: any = { isInclude: false };
				let categoryFireInvestigatorFormGroup: any = { isInclude: false };
				let categoryLocksmithFormGroup: any = { isInclude: false };
				let categoryLocksmithSupFormGroup: any = { isInclude: false };
				let categoryPrivateInvestigatorFormGroup: any = { isInclude: false };
				let categoryPrivateInvestigatorSupFormGroup: any = { isInclude: false };
				let categorySecurityGuardFormGroup: any = { isInclude: false };
				let categorySecurityGuardSupFormGroup: any = { isInclude: false };
				let categorySecurityAlarmInstallerFormGroup: any = { isInclude: false };
				let categorySecurityAlarmInstallerSupFormGroup: any = { isInclude: false };
				let categorySecurityAlarmMonitorFormGroup: any = { isInclude: false };
				let categorySecurityAlarmResponseFormGroup: any = { isInclude: false };
				let categorySecurityAlarmSalesFormGroup: any = { isInclude: false };
				let categorySecurityConsultantFormGroup: any = { isInclude: false };
				resp.categoryData?.forEach((category: WorkerLicenceAppCategoryData) => {
					switch (category.workerCategoryTypeCode) {
						case WorkerCategoryTypeCode.ArmouredCarGuard: {
							const attachmentsArmouredCarGuard: Array<File> = [];
							let armouredCarGuardExpiryDate = '';
							category.documents?.forEach((doc: Document) => {
								armouredCarGuardExpiryDate = this.formatDatePipe.transform(
									doc.expiryDate,
									SPD_CONSTANTS.date.backendDateFormat
								);
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									attachmentsArmouredCarGuard.push(aFile);
								});
							});
							categoryArmouredCarGuardFormGroup = {
								isInclude: true,
								expiryDate: armouredCarGuardExpiryDate,
								attachments: attachmentsArmouredCarGuard,
							};
							break;
						}
						case WorkerCategoryTypeCode.BodyArmourSales:
							categoryBodyArmourSalesFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
							categoryClosedCircuitTelevisionInstallerFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
							categoryElectronicLockingDeviceInstallerFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.FireInvestigator: {
							const attachments1FireInvestigator: Array<File> = [];
							const attachments2FireInvestigator: Array<File> = [];
							category.documents?.forEach((doc: Document) => {
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									if (
										doc.licenceDocumentTypeCode == LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate
									) {
										attachments1FireInvestigator.push(aFile);
									} else if (
										doc.licenceDocumentTypeCode == LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter
									) {
										attachments2FireInvestigator.push(aFile);
									}
								});
							});
							categoryFireInvestigatorFormGroup = {
								isInclude: true,
								fireCourseCertificateAttachments: attachments1FireInvestigator,
								fireVerificationLetterAttachments: attachments2FireInvestigator,
							};
							break;
						}
						case WorkerCategoryTypeCode.Locksmith: {
							const attachmentsLocksmith: Array<File> = [];
							let requirementCodeLocksmith = '';
							category.documents?.forEach((doc: Document) => {
								requirementCodeLocksmith = doc.licenceDocumentTypeCode ?? '';
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									attachmentsLocksmith.push(aFile);
								});
							});
							categoryLocksmithFormGroup = {
								isInclude: true,
								requirementCode: requirementCodeLocksmith,
								attachments: attachmentsLocksmith,
							};
							break;
						}
						case WorkerCategoryTypeCode.LocksmithUnderSupervision:
							categoryLocksmithSupFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.PrivateInvestigator: {
							const attachments1PrivateInvestigator: Array<File> = [];
							const attachments2PrivateInvestigator: Array<File> = [];
							let requirementCodePrivateInvestigator = '';
							let trainingCodePrivateInvestigator = '';
							category.documents?.forEach((doc: Document) => {
								const licenceDocumentTypeCodePrivateInvestigator = doc.licenceDocumentTypeCode ?? '';
								if (
									licenceDocumentTypeCodePrivateInvestigator ==
										PrivateInvestigatorTrainingCode.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge ||
									licenceDocumentTypeCodePrivateInvestigator ==
										PrivateInvestigatorTrainingCode.CategoryPrivateInvestigator_TrainingRecognizedCourse
								) {
									trainingCodePrivateInvestigator = doc.licenceDocumentTypeCode ?? '';
								} else {
									requirementCodePrivateInvestigator = doc.licenceDocumentTypeCode ?? '';
								}
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									if (
										licenceDocumentTypeCodePrivateInvestigator ==
											PrivateInvestigatorTrainingCode.CategoryPrivateInvestigator_TrainingOtherCoursesOrKnowledge ||
										licenceDocumentTypeCodePrivateInvestigator ==
											PrivateInvestigatorTrainingCode.CategoryPrivateInvestigator_TrainingRecognizedCourse
									) {
										attachments2PrivateInvestigator.push(aFile);
									} else {
										attachments1PrivateInvestigator.push(aFile);
									}
								});
							});
							categoryPrivateInvestigatorFormGroup = {
								isInclude: true,
								requirementCode: requirementCodePrivateInvestigator,
								attachments: attachments1PrivateInvestigator,
								trainingCode: trainingCodePrivateInvestigator,
								trainingAttachments: attachments2PrivateInvestigator,
							};
							break;
						}
						case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision: {
							const attachments1PrivateInvestigatorUnderSupervision: Array<File> = [];
							let requirementCodePrivateInvestigatorUnderSupervision = '';
							category.documents?.forEach((doc: Document) => {
								requirementCodePrivateInvestigatorUnderSupervision = doc.licenceDocumentTypeCode ?? '';
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									attachments1PrivateInvestigatorUnderSupervision.push(aFile);
								});
							});
							categoryPrivateInvestigatorSupFormGroup = {
								isInclude: true,
								requirementCode: requirementCodePrivateInvestigatorUnderSupervision,
								attachments: attachments1PrivateInvestigatorUnderSupervision,
							};
							break;
						}
						case WorkerCategoryTypeCode.SecurityGuard: {
							const attachmentsSecurityGuard: Array<File> = [];
							const attachmentsDogs: Array<File> = [];
							const attachmentsRestraints: Array<File> = [];
							let requirementCodeSecurityGuard = '';
							let carryAndUseRestraintsDocument = '';
							category.documents?.forEach((doc: Document) => {
								const isDogRelated =
									doc.licenceDocumentTypeCode === LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate;
								const isRestraintRelated = (Object.keys(RestraintDocumentTypeCode) as Array<any>).includes(
									doc.licenceDocumentTypeCode
								);
								if (isDogRelated) {
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachmentsDogs.push(aFile);
									});
								} else if (isRestraintRelated) {
									carryAndUseRestraintsDocument = doc.licenceDocumentTypeCode ?? '';
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachmentsRestraints.push(aFile);
									});
								} else {
									requirementCodeSecurityGuard = doc.licenceDocumentTypeCode ?? '';
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachmentsSecurityGuard.push(aFile);
									});
								}
							});
							restraintsAuthorizationData = {
								carryAndUseRestraints: this.booleanToBooleanType(resp.carryAndUseRestraints),
								carryAndUseRestraintsDocument,
								attachments: attachmentsRestraints,
							};
							dogsAuthorizationData = {
								useDogs: this.booleanToBooleanType(resp.useDogs),
								dogsPurposeFormGroup: {
									isDogsPurposeDetectionDrugs: resp.isDogsPurposeDetectionDrugs,
									isDogsPurposeDetectionExplosives: resp.isDogsPurposeDetectionExplosives,
									isDogsPurposeProtection: resp.isDogsPurposeProtection,
								},
								attachments: attachmentsDogs,
							};
							categorySecurityGuardFormGroup = {
								isInclude: true,
								requirementCode: requirementCodeSecurityGuard,
								attachments: attachmentsSecurityGuard,
							};
							break;
						}
						case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
							categorySecurityGuardSupFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityAlarmInstaller: {
							const attachmentsSecurityAlarmInstaller: Array<File> = [];
							let requirementCodeSecurityAlarmInstaller = '';
							category.documents?.forEach((doc: Document) => {
								requirementCodeSecurityAlarmInstaller = doc.licenceDocumentTypeCode ?? '';
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									attachmentsSecurityAlarmInstaller.push(aFile);
								});
							});
							categorySecurityAlarmInstallerFormGroup = {
								isInclude: true,
								requirementCode: requirementCodeSecurityAlarmInstaller,
								attachments: attachmentsSecurityAlarmInstaller,
							};
							break;
						}
						case WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
							categorySecurityAlarmInstallerSupFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityAlarmMonitor:
							categorySecurityAlarmMonitorFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityAlarmResponse:
							categorySecurityAlarmResponseFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityAlarmSales:
							categorySecurityAlarmSalesFormGroup = { isInclude: true, checkbox: true };
							break;
						case WorkerCategoryTypeCode.SecurityConsultant: {
							const attachments1SecurityConsultant: Array<File> = [];
							const attachments2SecurityConsultant: Array<File> = [];
							let requirementCodeSecurityConsultant = '';
							category.documents?.forEach((doc: Document) => {
								const licenceDocumentTypeCodeSecurityConsultant = doc.licenceDocumentTypeCode ?? '';
								if (
									licenceDocumentTypeCodeSecurityConsultant !=
									LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters
								) {
									requirementCodeSecurityConsultant = doc.licenceDocumentTypeCode ?? '';
								}
								doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
									const aFile = this.utilService.dummyFile(item);
									if (
										licenceDocumentTypeCodeSecurityConsultant !=
										LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters
									) {
										attachments1SecurityConsultant.push(aFile);
									} else {
										attachments2SecurityConsultant.push(aFile);
									}
								});
							});
							categorySecurityConsultantFormGroup = {
								isInclude: true,
								requirementCode: requirementCodeSecurityConsultant,
								attachments: attachments2SecurityConsultant,
								resumeAttachments: attachments1SecurityConsultant,
							};
							break;
						}
					}
				});

				this.licenceModelFormGroup.patchValue(
					{
						licenceAppId: resp.licenceAppId,
						expiryDate: resp.expiryDate,
						caseNumber: resp.caseNumber,
						applicationPortalStatus: resp.applicationPortalStatus,
						workerLicenceTypeData,
						applicationTypeData,
						soleProprietorData,
						// expiredLicenceData,
						licenceTermData,
						policeBackgroundData,
						bcDriversLicenceData,
						mentalHealthConditionsData,
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
						categoryArmouredCarGuardFormGroup,
						categoryBodyArmourSalesFormGroup,
						categoryClosedCircuitTelevisionInstallerFormGroup,
						categoryElectronicLockingDeviceInstallerFormGroup,
						categoryFireInvestigatorFormGroup,
						categoryLocksmithFormGroup,
						categoryLocksmithSupFormGroup,
						categoryPrivateInvestigatorFormGroup,
						categoryPrivateInvestigatorSupFormGroup,
						categorySecurityGuardFormGroup,
						categorySecurityGuardSupFormGroup,
						categorySecurityAlarmInstallerFormGroup,
						categorySecurityAlarmInstallerSupFormGroup,
						categorySecurityAlarmMonitorFormGroup,
						categorySecurityAlarmResponseFormGroup,
						categorySecurityAlarmSalesFormGroup,
						categorySecurityConsultantFormGroup,
						restraintsAuthorizationData,
						dogsAuthorizationData,
					},
					{
						emitEvent: false,
					}
				);

				// console.debug('loadExistingLicence resp', resp);
				console.debug('LOAD EXISTING licenceModelFormGroup', this.licenceModelFormGroup.value);
			}),
			take(1)
		);
	}

	/**
	 * Reset the licence data
	 */
	reset(): void {
		this.initialized = false;
		console.log('reset.initialized', this.initialized);
		this.hasValueChanged = false;
		this.licenceFeeTermCodes = [];

		// this.licenceUserModelFormGroup.reset();
		// const aliases3 = this.licenceUserModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		// aliases3.clear();
		// this.licenceModelFormGroupAnonymous.reset();
		// const aliases2 = this.licenceModelFormGroupAnonymous.controls['aliasesData'].get('aliases') as FormArray;
		// aliases2.clear();

		this.licenceModelFormGroup.reset();
		const aliases1 = this.licenceModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
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
			licenceAppId: this.licenceModelFormGroup.get('licenceAppId')?.value,
			body: doc,
		});
	}

	/**
	 * Set the licence fees for the licence and application type
	 * @returns list of fees
	 */
	public setLicenceTermsAndFees(): void {
		const workerLicenceTypeCode = this.licenceModelFormGroup.get('workerLicenceTypeData.workerLicenceTypeCode')?.value;
		const applicationTypeCode = this.licenceModelFormGroup.get('applicationTypeData.applicationTypeCode')?.value;

		// const businessTypeCode = //TODO what to do about business type code??

		if (!workerLicenceTypeCode || !applicationTypeCode) {
			return;
		}

		const fees = this.licenceFees?.filter(
			(item) =>
				item.workerLicenceTypeCode == workerLicenceTypeCode &&
				item.businessTypeCode == BusinessTypeCode.NonRegisteredPartnership &&
				item.applicationTypeCode == applicationTypeCode
		);

		this.licenceFeeTermCodes.push(...fees);
		console.debug('this.licenceFeeTermCodes', this.licenceFeeTermCodes);
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
	isStep1Complete(): boolean {
		// console.debug(
		// 	'isStep1Complete',
		// 	this.profileFormGroup.valid,
		// 	this.workerLicenceTypeFormGroup.valid,
		// 	this.applicationTypeFormGroup.valid,
		// );

		let isValid!: boolean;
		if (this.authenticationService.isLoggedIn()) {
			isValid =
				this.profileConfirmationFormGroup.valid &&
				this.personalInformationFormGroup.valid &&
				this.aliasesFormGroup.valid &&
				this.residentialAddressFormGroup.valid &&
				this.mailingAddressFormGroup.valid &&
				this.contactInformationFormGroup.valid;
			this.workerLicenceTypeFormGroup.valid && this.applicationTypeFormGroup.valid;
		} else {
			isValid = this.workerLicenceTypeFormGroup.valid && this.applicationTypeFormGroup.valid;
		}

		return isValid;
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepLicenceSelectionComplete(): boolean {
		// console.debug(
		// 	'isStepLicenceSelectionComplete',
		// 	this.soleProprietorFormGroup.valid,
		// 	this.expiredLicenceFormGroup.valid,
		// 	this.licenceTermFormGroup.valid,
		// 	this.restraintsAuthorizationFormGroup.valid,
		// 	this.dogsAuthorizationFormGroup.valid,
		// 	this.categoryArmouredCarGuardFormGroup.valid,
		// 	this.categoryBodyArmourSalesFormGroup.valid,
		// 	this.categoryClosedCircuitTelevisionInstallerFormGroup.valid,
		// 	this.categoryElectronicLockingDeviceInstallerFormGroup.valid,
		// 	this.categoryFireInvestigatorFormGroup.valid,
		// 	this.categoryLocksmithFormGroup.valid,
		// 	this.categoryLocksmithSupFormGroup.valid,
		// 	this.categoryPrivateInvestigatorFormGroup.valid,
		// 	this.categoryPrivateInvestigatorSupFormGroup.valid,
		// 	this.categorySecurityAlarmInstallerFormGroup.valid,
		// 	this.categorySecurityAlarmInstallerSupFormGroup.valid,
		// 	this.categorySecurityConsultantFormGroup.valid,
		// 	this.categorySecurityAlarmMonitorFormGroup.valid,
		// 	this.categorySecurityAlarmResponseFormGroup.valid,
		// 	this.categorySecurityAlarmSalesFormGroup.valid,
		// 	this.categorySecurityGuardFormGroup.valid,
		// 	this.categorySecurityGuardSupFormGroup.valid
		// );

		return (
			this.soleProprietorFormGroup.valid &&
			this.expiredLicenceFormGroup.valid &&
			this.licenceTermFormGroup.valid &&
			this.restraintsAuthorizationFormGroup.valid &&
			this.dogsAuthorizationFormGroup.valid &&
			this.categoryArmouredCarGuardFormGroup.valid &&
			this.categoryBodyArmourSalesFormGroup.valid &&
			this.categoryClosedCircuitTelevisionInstallerFormGroup.valid &&
			this.categoryElectronicLockingDeviceInstallerFormGroup.valid &&
			this.categoryFireInvestigatorFormGroup.valid &&
			this.categoryLocksmithFormGroup.valid &&
			this.categoryLocksmithSupFormGroup.valid &&
			this.categoryPrivateInvestigatorFormGroup.valid &&
			this.categoryPrivateInvestigatorSupFormGroup.valid &&
			this.categorySecurityAlarmInstallerFormGroup.valid &&
			this.categorySecurityAlarmInstallerSupFormGroup.valid &&
			this.categorySecurityConsultantFormGroup.valid &&
			this.categorySecurityAlarmMonitorFormGroup.valid &&
			this.categorySecurityAlarmResponseFormGroup.valid &&
			this.categorySecurityAlarmSalesFormGroup.valid &&
			this.categorySecurityGuardFormGroup.valid &&
			this.categorySecurityGuardSupFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepBackgroundComplete(): boolean {
		// console.debug(
		// 	'isStepBackgroundComplete',
		// 	this.policeBackgroundFormGroup.valid,
		// 	this.mentalHealthConditionsFormGroup.valid,
		// 	this.criminalHistoryFormGroup.valid,
		// 	this.fingerprintProofFormGroup.valid
		// );

		return (
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid &&
			this.criminalHistoryFormGroup.valid &&
			this.fingerprintProofFormGroup.valid
		);
	}

	/**
	 * If this step is complete, mark the step as complete in the wizard
	 * @returns
	 */
	isStepIdentificationComplete(): boolean {
		const showAdditionalGovermentIdStep = this.citizenshipFormGroup
			? (this.citizenshipFormGroup.value.isCanadianCitizen == BooleanTypeCode.Yes &&
					this.citizenshipFormGroup.value.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			  (this.citizenshipFormGroup.value.isCanadianCitizen == BooleanTypeCode.No &&
					this.citizenshipFormGroup.value.notCanadianCitizenProofTypeCode !=
						LicenceDocumentTypeCode.PermanentResidentCard)
			: true;

		// console.debug(
		// 	'isStep4Complete',
		// 	this.personalInformationFormGroup.valid,
		// 	this.aliasesFormGroup.valid,
		// 	this.citizenshipFormGroup.valid,
		// 	showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true,
		// 	this.bcDriversLicenceFormGroup.valid,
		// 	this.characteristicsFormGroup.valid,
		// 	this.photographOfYourselfFormGroup.valid,
		// 	this.residentialAddressFormGroup.valid,
		// 	this.mailingAddressFormGroup.valid,
		// 	this.contactInformationFormGroup.valid
		// );
		// console.debug('showAdditionalGovermentIdStep', showAdditionalGovermentIdStep, this.additionalGovIdFormGroup.valid);

		if (this.authenticationService.isLoggedIn()) {
			return (
				this.citizenshipFormGroup.valid &&
				(showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true) &&
				this.bcDriversLicenceFormGroup.valid &&
				this.characteristicsFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid
			);
		} else {
			return (
				this.personalInformationFormGroup.valid &&
				this.aliasesFormGroup.valid &&
				this.citizenshipFormGroup.valid &&
				(showAdditionalGovermentIdStep ? this.additionalGovIdFormGroup.valid : true) &&
				this.bcDriversLicenceFormGroup.valid &&
				this.characteristicsFormGroup.valid &&
				this.photographOfYourselfFormGroup.valid &&
				this.residentialAddressFormGroup.valid &&
				this.mailingAddressFormGroup.valid &&
				this.contactInformationFormGroup.valid
			);
		}
	}

	/**
	 * Determine if the step data should be saved. If the data has changed and category data exists;
	 * @returns
	 */
	isSaveStep(): boolean {
		const shouldSaveStep =
			this.hasValueChanged &&
			((this.categoryArmouredCarGuardFormGroup.get('isInclude')?.value ?? false) ||
				(this.categoryBodyArmourSalesFormGroup.get('isInclude')?.value ?? false) ||
				(this.categoryClosedCircuitTelevisionInstallerFormGroup.get('isInclude')?.value ?? false) ||
				(this.categoryElectronicLockingDeviceInstallerFormGroup.get('isInclude')?.value ?? false) ||
				(this.categoryFireInvestigatorFormGroup.get('isInclude')?.value ?? false) ||
				(this.categoryLocksmithFormGroup.get('isInclude')?.value ?? false) ||
				(this.categoryLocksmithSupFormGroup.get('isInclude')?.value ?? false) ||
				(this.categoryPrivateInvestigatorFormGroup.get('isInclude')?.value ?? false) ||
				(this.categoryPrivateInvestigatorSupFormGroup.get('isInclude')?.value ?? false) ||
				(this.categorySecurityAlarmInstallerFormGroup.get('isInclude')?.value ?? false) ||
				(this.categorySecurityAlarmInstallerSupFormGroup.get('isInclude')?.value ?? false) ||
				(this.categorySecurityConsultantFormGroup.get('isInclude')?.value ?? false) ||
				(this.categorySecurityAlarmMonitorFormGroup.get('isInclude')?.value ?? false) ||
				(this.categorySecurityAlarmResponseFormGroup.get('isInclude')?.value ?? false) ||
				(this.categorySecurityAlarmSalesFormGroup.get('isInclude')?.value ?? false) ||
				(this.categorySecurityGuardFormGroup.get('isInclude')?.value ?? false) ||
				(this.categorySecurityGuardSupFormGroup.get('isInclude')?.value ?? false));

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
				const formValue = this.licenceModelFormGroup.getRawValue();
				if (!formValue.licenceAppId) {
					this.licenceModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
	}

	submitLicence(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		if (this.authenticationService.isLoggedIn()) {
			return this.submitLicenceAuthenticated();
		} else {
			return this.submitLicenceAnonymous();
		}
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	private submitLicenceAuthenticated(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const body = this.getSaveBody();
		console.debug('submitLicenceAuthenticated body', body);
		return this.workerLicensingService.apiWorkerLicenceApplicationsSubmitPost$Response({ body });
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	private getSaveBody(): WorkerLicenceAppUpsertRequest | WorkerLicenceAppSubmitRequest {
		const formValue = this.licenceModelFormGroup.getRawValue();
		console.debug('getSaveBody licenceModelFormGroup', formValue);

		const licenceAppId = formValue.licenceAppId;
		const workerLicenceTypeData = { ...formValue.workerLicenceTypeData };
		const applicationTypeData = { ...formValue.applicationTypeData };
		const soleProprietorData = { ...formValue.soleProprietorData };
		const bcDriversLicenceData = { ...formValue.bcDriversLicenceData };
		const contactInformationData = { ...formValue.contactInformationData };
		// const expiredLicenceData = { ...formValue.expiredLicenceData };
		const characteristicsData = { ...formValue.characteristicsData };
		const residentialAddressData = { ...formValue.residentialAddressData };
		const mailingAddressData = { ...formValue.mailingAddressData };
		const citizenshipData = { ...formValue.citizenshipData };
		const additionalGovIdData = { ...formValue.additionalGovIdData };
		const policeBackgroundData = { ...formValue.policeBackgroundData };
		const fingerprintProofData = { ...formValue.fingerprintProofData };
		const mentalHealthConditionsData = { ...formValue.mentalHealthConditionsData };
		const photographOfYourselfData = { ...formValue.photographOfYourselfData };

		let dogsAuthorizationData = {};
		let restraintsAuthorizationData = {};

		const personalInformationData = { ...formValue.personalInformationData };
		personalInformationData.dateOfBirth = this.formatDatePipe.transform(
			personalInformationData.dateOfBirth,
			SPD_CONSTANTS.date.backendDateFormat
		);

		const categoryData: Array<WorkerLicenceAppCategoryData> = [];
		if (formValue.categoryArmouredCarGuardFormGroup.isInclude) {
			categoryData.push(this.getCategoryArmouredCarGuard(formValue.categoryArmouredCarGuardFormGroup));
		}

		if (formValue.categoryBodyArmourSalesFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.BodyArmourSales,
			});
		}

		if (formValue.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
			});
		}

		if (formValue.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
			});
		}

		if (formValue.categoryFireInvestigatorFormGroup.isInclude) {
			categoryData.push(this.getCategoryFireInvestigator(formValue.categoryFireInvestigatorFormGroup));
		}

		if (formValue.categoryLocksmithFormGroup.isInclude) {
			categoryData.push(this.getCategoryLocksmith(formValue.categoryLocksmithFormGroup));
		}

		if (formValue.categoryLocksmithSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.LocksmithUnderSupervision,
			});
		}

		if (formValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			categoryData.push(this.getCategoryPrivateInvestigator(formValue.categoryPrivateInvestigatorFormGroup));
		}

		if (formValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			categoryData.push(this.getCategoryPrivateInvestigatorSup(formValue.categoryPrivateInvestigatorSupFormGroup));
		}

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			const dogsPurposeFormGroup = formValue.dogsAuthorizationData.dogsPurposeFormGroup;
			const isDetectionDrugs = dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false;
			const isDetectionExplosives = dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ?? false;
			const isProtection = dogsPurposeFormGroup.isDogsPurposeProtection ?? false;
			dogsAuthorizationData = {
				useDogs: this.booleanTypeToBoolean(formValue.dogsAuthorizationData.useDogs),
				isDogsPurposeDetectionDrugs: formValue.dogsAuthorizationData.useDogs ? isDetectionDrugs : null,
				isDogsPurposeDetectionExplosives: formValue.dogsAuthorizationData.useDogs ? isDetectionExplosives : null,
				isDogsPurposeProtection: formValue.dogsAuthorizationData.useDogs ? isProtection : null,
			};
			restraintsAuthorizationData = {
				carryAndUseRestraints: this.booleanTypeToBoolean(formValue.restraintsAuthorizationData.carryAndUseRestraints),
			};
			categoryData.push(
				this.getCategorySecurityGuard(
					formValue.categorySecurityGuardFormGroup,
					formValue.dogsAuthorizationData,
					formValue.restraintsAuthorizationData
				)
			);
		}
		if (formValue.categorySecurityGuardSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
			});
		}

		if (formValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			categoryData.push(this.getCategorySecurityAlarmInstaller(formValue.categorySecurityAlarmInstallerFormGroup));
		}

		if (formValue.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
			});
		}

		if (formValue.categorySecurityAlarmMonitorFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmMonitor,
			});
		}

		if (formValue.categorySecurityAlarmResponseFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmResponse,
			});
		}

		if (formValue.categorySecurityAlarmSalesFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmSales,
			});
		}

		if (formValue.categorySecurityConsultantFormGroup.isInclude) {
			categoryData.push(this.getCategorySecurityConsultantInstaller(formValue.categorySecurityConsultantFormGroup));
		}
		let policeOfficerDocument: PoliceOfficerDocument | null = null;
		if (policeBackgroundData.attachments) {
			const policeOfficerDocuments: Array<LicenceAppDocumentResponse> = [];
			policeBackgroundData.attachments.forEach((doc: any) => {
				policeOfficerDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			policeOfficerDocument = {
				documentResponses: policeOfficerDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			};
		}

		let mentalHealthDocument: MentalHealthDocument | null = null;
		if (mentalHealthConditionsData.attachments) {
			const mentalHealthDocuments: Array<LicenceAppDocumentResponse> = [];
			mentalHealthConditionsData.attachments.forEach((doc: any) => {
				mentalHealthDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			mentalHealthDocument = {
				documentResponses: mentalHealthDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition,
			};
		}

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

		let additionalGovIdDocument: AdditionalGovIdDocument | null = null;
		const isIncludeAdditionalGovermentIdStepData = this.includeAdditionalGovermentIdStepData(
			citizenshipData.isCanadianCitizen,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.notCanadianCitizenProofTypeCode
		);

		if (isIncludeAdditionalGovermentIdStepData && additionalGovIdData.attachments) {
			const additionalGovIdDocuments: Array<LicenceAppDocumentResponse> = [];
			additionalGovIdData.attachments.forEach((doc: any) => {
				additionalGovIdDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			additionalGovIdDocument = {
				documentResponses: additionalGovIdDocuments,
				expiryDate: additionalGovIdData.expiryDate
					? this.formatDatePipe.transform(additionalGovIdData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
					: null,
				licenceDocumentTypeCode: additionalGovIdData.governmentIssuedPhotoTypeCode,
			};
		} else {
			this.additionalGovIdFormGroup.reset();
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

		// const expiredLicenceExpiryDate = expiredLicenceData.expiryDate
		// 	? this.formatDatePipe.transform(expiredLicenceData.expiryDate, SPD_CONSTANTS.date.backendDateFormat)
		// 	: null;

		const body: WorkerLicenceAppUpsertRequest | WorkerLicenceAppSubmitRequest = {
			licenceAppId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			//-----------------------------------
			isSoleProprietor: this.booleanTypeToBoolean(soleProprietorData.isSoleProprietor),
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
			// hasExpiredLicence: this.booleanTypeToBoolean(expiredLicenceData.hasExpiredLicence),
			// expiredLicenceNumber:
			// 	expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceNumber : null,
			// expiredLicenceId:
			// 	expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceId : null,
			// expiryDate: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceExpiryDate : null,
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
			additionalGovIdDocument,
			//-----------------------------------
			fingerprintProofDocument,
			//-----------------------------------
			useBcServicesCardPhoto: this.booleanTypeToBoolean(photographOfYourselfData.useBcServicesCardPhoto),
			idPhotoDocument,
			//-----------------------------------
			isTreatedForMHC: this.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC),
			mentalHealthDocument,
			//-----------------------------------
			isPoliceOrPeaceOfficer: this.booleanTypeToBoolean(policeBackgroundData.isPoliceOrPeaceOfficer),
			policeOfficerRoleCode: policeBackgroundData.policeOfficerRoleCode,
			otherOfficerRole: policeBackgroundData.otherOfficerRole,
			policeOfficerDocument,
			//-----------------------------------
			categoryData,
			...dogsAuthorizationData,
			...restraintsAuthorizationData,
		};
		return body;
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	private submitLicenceAnonymous(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const body = this.getSaveBodyAnonymous();
		console.debug('submitLicenceAnonymous body', body);

		// const formValue = this.licenceModelFormGroup.getRawValue();

		const documentInfos = this.getSaveDocsAnonymous();
		console.log('documentInfos', documentInfos);

		const formValue = this.consentAndDeclarationFormGroup.getRawValue();
		console.debug('submitLicenceAnonymous', formValue);

		const googleRecaptcha = { recaptchaCode: formValue.recaptcha };
		return this.workerLicensingService
			.apiWorkerLicenceApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((resp: string) => {
					console.log('resp', resp);
					const keyCode = resp;

					const documentsToSave: Observable<string>[] = [];
					documentInfos.forEach((docBody: DocumentsToSave) => {
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

					console.log('documentsToSave', documentsToSave);

					return forkJoin(documentsToSave);
				}),
				switchMap((resps: string[]) => {
					console.log('resps', resps);
					const keyCode = resps[0];

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
		console.log('documentInfos', documentInfos);

		const categoryData = savebody.categoryData ?? [];

		const categoryCodes: Array<WorkerCategoryTypeCode> = categoryData.map(
			(item: WorkerLicenceAppCategoryData) => item.workerCategoryTypeCode!
		);

		const requestBody: WorkerLicenceAppAnonymousSubmitRequestJson = {
			workerLicenceTypeCode: savebody.workerLicenceTypeCode,
			applicationTypeCode: savebody.applicationTypeCode,
			isSoleProprietor: savebody.isSoleProprietor,
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
		console.log('requestBody', requestBody);

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

		console.debug('submitLicenceAnonymous documentInfos', documents);
		return documents;
	}

	getSaveDocsAnonymous(): Array<DocumentsToSave> {
		const documents: Array<DocumentsToSave> = [];
		const formValue = this.licenceModelFormGroup.getRawValue();

		const citizenshipData = { ...formValue.citizenshipData };
		const additionalGovIdData = { ...formValue.additionalGovIdData };
		const policeBackgroundData = { ...formValue.policeBackgroundData };
		const fingerprintProofData = { ...formValue.fingerprintProofData };
		const mentalHealthConditionsData = { ...formValue.mentalHealthConditionsData };
		const photographOfYourselfData = { ...formValue.photographOfYourselfData };

		if (formValue.categoryArmouredCarGuardFormGroup.isInclude) {
			const docs: Array<Blob> = [];
			formValue.categoryArmouredCarGuardFormGroup.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
				documents: docs,
			});
		}

		if (formValue.categoryFireInvestigatorFormGroup.isInclude) {
			if (formValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments) {
				const docs: Array<Blob> = [];
				formValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
					documents: docs,
				});
			}

			if (formValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments) {
				const docs: Array<Blob> = [];
				formValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
					documents: docs,
				});
			}
		}

		if (formValue.categoryLocksmithFormGroup.isInclude) {
			if (formValue.categoryLocksmithFormGroup.attachments) {
				const docs: Array<Blob> = [];
				formValue.categoryLocksmithFormGroup.attachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: formValue.categoryLocksmithFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (formValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			if (formValue.categoryPrivateInvestigatorFormGroup.attachments) {
				const docs: Array<Blob> = [];
				formValue.categoryPrivateInvestigatorFormGroup.attachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.requirementCode,
					documents: docs,
				});
			}
			if (formValue.categoryPrivateInvestigatorFormGroup.trainingAttachments) {
				const docs: Array<Blob> = [];
				formValue.categoryPrivateInvestigatorFormGroup.trainingAttachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.trainingCode,
					documents: docs,
				});
			}
		}

		if (formValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			if (formValue.categoryPrivateInvestigatorSupFormGroup.attachments) {
				const docs: Array<Blob> = [];
				formValue.categoryPrivateInvestigatorSupFormGroup.attachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: formValue.categoryPrivateInvestigatorSupFormGroup.requirementCode,
					documents: docs,
				});
			}
		}

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			if (formValue.categorySecurityGuardFormGroup.attachments) {
				const docs: Array<Blob> = [];
				formValue.categorySecurityGuardFormGroup.attachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: formValue.categorySecurityGuardFormGroup.requirementCode,
					documents: docs,
				});
			}

			if (this.booleanTypeToBoolean(formValue.dogsAuthorizationData.useDogs)) {
				if (formValue.dogsAuthorizationData.attachments) {
					const docs: Array<Blob> = [];
					formValue.dogsAuthorizationData.attachments.forEach((doc: Blob) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityGuardDogCertificate,
						documents: docs,
					});
				}
			}

			if (this.booleanTypeToBoolean(formValue.restraintsAuthorizationData.carryAndUseRestraints)) {
				if (formValue.restraintsAuthorizationData.attachments) {
					const docs: Array<Blob> = [];
					formValue.restraintsAuthorizationData.attachments.forEach((doc: Blob) => {
						docs.push(doc);
					});
					documents.push({
						licenceDocumentTypeCode: formValue.restraintsAuthorizationData.carryAndUseRestraintsDocument,
						documents: docs,
					});
				}
			}
		}

		if (formValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			if (formValue.categorySecurityAlarmInstallerData.attachments) {
				const docs: Array<Blob> = [];
				formValue.categorySecurityAlarmInstallerData.attachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: formValue.categorySecurityAlarmInstallerData.requirementCode,
					documents: docs,
				});
			}
		}

		if (formValue.categorySecurityConsultantFormGroup.isInclude) {
			if (formValue.categorySecurityConsultantFormGroup.attachments) {
				const docs: Array<Blob> = [];
				formValue.categorySecurityConsultantFormGroup.attachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
					documents: docs,
				});
			}
			if (formValue.categorySecurityConsultantFormGroup.resumeAttachments) {
				const docs: Array<Blob> = [];
				formValue.categorySecurityConsultantFormGroup.resumeAttachments.forEach((doc: Blob) => {
					docs.push(doc);
				});
				documents.push({
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategorySecurityConsultantExperienceLetters,
					documents: docs,
				});
			}
		}

		if (policeBackgroundData.attachments) {
			const docs: Array<Blob> = [];
			policeBackgroundData.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			documents.push({
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				documents: docs,
			});
		}

		if (mentalHealthConditionsData.attachments) {
			const docs: Array<Blob> = [];
			mentalHealthConditionsData.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition, documents: docs });
		}

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

		const isIncludeAdditionalGovermentIdStepData = this.includeAdditionalGovermentIdStepData(
			citizenshipData.isCanadianCitizen,
			citizenshipData.canadianCitizenProofTypeCode,
			citizenshipData.notCanadianCitizenProofTypeCode
		);

		if (isIncludeAdditionalGovermentIdStepData && additionalGovIdData.attachments) {
			const docs: Array<Blob> = [];
			additionalGovIdData.attachments.forEach((doc: Blob) => {
				docs.push(doc);
			});
			documents.push({ licenceDocumentTypeCode: additionalGovIdData.governmentIssuedPhotoTypeCode, documents: docs });
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

	private includeAdditionalGovermentIdStepData(
		isCanadianCitizen: BooleanTypeCode,
		canadianCitizenProofTypeCode: LicenceDocumentTypeCode | null,
		notCanadianCitizenProofTypeCode: LicenceDocumentTypeCode | null
	): boolean {
		return (
			(isCanadianCitizen == BooleanTypeCode.Yes &&
				canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			(isCanadianCitizen == BooleanTypeCode.No &&
				notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard)
		);
	}
}
