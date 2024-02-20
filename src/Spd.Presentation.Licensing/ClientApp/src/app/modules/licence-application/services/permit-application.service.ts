import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
	Alias,
	ApplicationTypeCode,
	BooleanTypeCode,
	GoogleRecaptcha,
	HeightUnitCode,
	IActionResult,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	LicenceResponse,
	LicenceTermCode,
	PermitAppAnonymousSubmitRequest,
	PermitAppCommandResponse,
	WorkerLicenceResponse,
	WorkerLicenceTypeCode,
} from '@app/api/models';
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
import { LicenceService, PermitService, SecurityWorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { CommonApplicationService } from './common-application.service';
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
		employerData: this.employerInformationFormGroup,
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
		utilService: UtilService,
		private tempSecurityWorkerLicensingService: SecurityWorkerLicensingService, // TODO remove later
		private permitService: PermitService,
		private licenceService: LicenceService,
		private authUserBcscService: AuthUserBcscService,
		private commonApplicationService: CommonApplicationService
	) {
		super(formBuilder, configService, formatDatePipe, utilService);

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
		return this.licenceService
			.apiLicenceLookupAnonymousLicenceNumberPost({ licenceNumber, accessCode, body: { recaptchaCode } })
			.pipe(take(1));
	}

	/**
	 * Load an existing permit application
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
	 * Load an existing permit application
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

				this.commonApplicationService.setApplicationTitle(
					_resp.workerLicenceTypeCode,
					applicationTypeCode,
					accessCodeData.licenceNumber
				);
			})
		);
	}

	/**
	 * Load an existing permit application
	 * @param licenceAppId
	 * @returns
	 */
	private getPermitOfType(
		licenceAppId: string,
		applicationTypeCode: ApplicationTypeCode
	): Observable<WorkerLicenceResponse> {
		switch (applicationTypeCode) {
			case ApplicationTypeCode.Renewal: {
				return this.loadPermitRenewal(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('[getPermitOfType] Renewal', licenceAppId, applicationTypeCode, resp);
						this.initialized = true;
					})
				);
			}
			default: {
				// case ApplicationTypeCode.Update: {
				return this.loadPermitUpdate(licenceAppId).pipe(
					tap((resp: any) => {
						console.debug('[getPermitOfType] Update', licenceAppId, applicationTypeCode, resp);
						this.initialized = true;
					})
				);
			}
			// Replacement does not exist for Permits
		}
	}

	/**
	 * Load an existing draft permit application
	 * @param licenceAppId
	 * @returns
	 */
	private loadPermitNew(licenceAppId: string): Observable<WorkerLicenceResponse> {
		return this.loadSpecificPermit(licenceAppId).pipe(
			tap((resp: any) => {
				console.debug('[loadPermitNew] resp', resp);

				this.commonApplicationService.setApplicationTitle(resp.workerLicenceTypeCode);
			})
		);
	}

	/**
	 * Load an existing permit application for renewal
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
				// const employerData = {
				// 	employerName: 'aaa',
				// 	supervisorName: 'ccc',
				// 	supervisorEmailAddress: 'bbb@bbb.com',
				// 	supervisorPhoneNumber: '5554448787',
				// 	addressSelected: true,
				// 	addressLine1: 'bbb1',
				// 	addressLine2: 'bbb2',
				// 	city: 'bbb3',
				// 	postalCode: 'V9A6D4',
				// 	province: 'bbb4',
				// 	country: 'bbb5',
				// };

				this.permitModelFormGroup.patchValue(
					{
						licenceAppId: null,
						originalApplicationId: licenceAppId,
						workerLicenceTypeData,
						applicationTypeData,
						permitRequirementData,
						licenceTermData,
						// employerData,
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
	 * Load an existing permit application for update
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
				// const employerData = {
				// 	employerName: 'aaa',
				// 	supervisorName: 'ccc',
				// 	supervisorEmailAddress: 'bbb@bbb.com',
				// 	supervisorPhoneNumber: '5554448787',
				// 	addressSelected: true,
				// 	addressLine1: 'bbb1',
				// 	addressLine2: 'bbb2',
				// 	city: 'bbb3',
				// 	postalCode: 'V9A6D4',
				// 	province: 'bbb4',
				// 	country: 'bbb5',
				// };

				this.permitModelFormGroup.patchValue(
					{
						licenceAppId: null,
						originalApplicationId: licenceAppId,
						workerLicenceTypeData,
						applicationTypeData,
						permitRequirementData,
						licenceTermData,
						// employerData,
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
	 * Create an empty permit
	 * @returns
	 */
	createNewPermitAnonymous(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.createEmptyPermitAnonymous(workerLicenceTypeCode).pipe(
			tap((resp: any) => {
				console.debug('[createNewPermitAnonymous] resp', resp);

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(resp.workerLicenceTypeCode);
			})
		);
	}

	/**
	 * Create an empty permit
	 * @returns
	 */
	createNewPermitAuthenticated(workerLicenceTypeCode: WorkerLicenceTypeCode): Observable<any> {
		return this.createPermitAuthenticated(workerLicenceTypeCode).pipe(
			tap((resp: any) => {
				console.debug('[createNewPermitAuthenticated] resp', resp);

				this.initialized = true;

				this.commonApplicationService.setApplicationTitle(resp.workerLicenceTypeCode);
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

		// TODO remove hardcoded
		// const employerData = {
		// 	employerName: 'aaa',
		// 	supervisorName: 'ccc',
		// 	supervisorEmailAddress: 'bbb@bbb.com',
		// 	supervisorPhoneNumber: '5554448787',
		// 	addressSelected: true,
		// 	addressLine1: 'bbb1',
		// 	addressLine2: 'bbb2',
		// 	city: 'bbb3',
		// 	postalCode: 'V9A6D4',
		// 	province: 'bbb4',
		// 	country: 'bbb5',
		// };

		// const characteristicsData = {
		// 	eyeColourCode: 'Blue',
		// 	hairColourCode: 'Brown',
		// 	height: '33',
		// 	heightInches: null,
		// 	heightUnitCode: 'Centimeters',
		// 	weight: '44',
		// 	weightUnitCode: 'Kilograms',
		// };

		this.permitModelFormGroup.patchValue(
			{
				workerLicenceTypeData,
				permitRequirementData,
				photographOfYourselfData,
				licenceTermData,
				// employerData,
				// characteristicsData,
			},
			{
				emitEvent: false,
			}
		);

		console.debug('[createEmptyPermitAnonymous] permitModelFormGroup', this.permitModelFormGroup.value);

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

		console.debug('[createPermitAuthenticated] permitModelFormGroup', this.permitModelFormGroup.value);

		return of(this.permitModelFormGroup.value);
	}

	private loadSpecificPermit(licenceAppId: string): Observable<WorkerLicenceResponse> {
		this.reset();

		// TODO Permit service is reference swl service - fix
		return this.tempSecurityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
			tap((resp: WorkerLicenceResponse) => {
				const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
				const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };
				const permitRequirementData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };

				const expiredLicenceData = {
					hasExpiredLicence: this.utilService.booleanToBooleanType(resp.hasExpiredLicence),
					expiredLicenceNumber: resp.expiredLicenceNumber,
					expiryDate: resp.expiryDate,
					expiredLicenceId: resp.expiredLicenceId,
				};

				const licenceTermData = {
					licenceTermCode: resp.licenceTermCode,
				};

				const bcDriversLicenceData = {
					hasBcDriversLicence: this.utilService.booleanToBooleanType(resp.hasBcDriversLicence),
					bcDriversLicenceNumber: resp.bcDriversLicenceNumber,
				};

				const criminalHistoryData = {
					hasCriminalHistory: this.utilService.booleanToBooleanType(resp.hasCriminalHistory),
				};

				const aliasesData = {
					previousNameFlag: resp.hasPreviousName
						? this.utilService.booleanToBooleanType(resp.hasPreviousName)
						: BooleanTypeCode.No,
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

				// const citizenshipDataAttachments: Array<File> = [];
				// if (resp.citizenshipDocument?.documentResponses) {
				// 	resp.citizenshipDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
				// 		const aFile = this.utilService.dummyFile(item);
				// 		citizenshipDataAttachments.push(aFile);
				// 	});
				// }

				const citizenshipData = {};
				// 	const citizenshipData = {
				// 	// TODO fix permit citizenship data
				// 	isCanadianCitizen: this.booleanToBooleanType(resp.isCanadianCitizen),
				// 	canadianCitizenProofTypeCode: resp.isCanadianCitizen
				// 		? resp.citizenshipDocument?.licenceDocumentTypeCode
				// 		: null,
				// 	notCanadianCitizenProofTypeCode: resp.isCanadianCitizen
				// 		? null
				// 		: resp.citizenshipDocument?.licenceDocumentTypeCode,
				// 	expiryDate: resp.citizenshipDocument?.expiryDate,
				// 	attachments: citizenshipDataAttachments,
				// };

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
				// if (resp.idPhotoDocument?.documentResponses) {
				// 	resp.idPhotoDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
				// 		const aFile = this.utilService.dummyFile(item);
				// 		photographOfYourselfAttachments.push(aFile);
				// 	});
				// }

				const photographOfYourselfData = {
					useBcServicesCardPhoto: this.utilService.booleanToBooleanType(resp.useBcServicesCardPhoto),
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
	 * Reset the permit data
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
	 * Upload a file of a certain type. Return a reference to the file that will used when the permit is saved
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

		// TODO Permit service is reference swl service - fix
		return this.tempSecurityWorkerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response({
			licenceAppId: this.permitModelFormGroup.get('licenceAppId')?.value,
			body: doc,
		});
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

		const workerLicenceTypeCode = this.permitModelFormGroup.get('workerLicenceTypeData.workerLicenceTypeCode')?.value;

		let showEmployerInformation = false;
		if (workerLicenceTypeCode === WorkerLicenceTypeCode.BodyArmourPermit) {
			const bodyArmourRequirement = this.permitModelFormGroup.get(
				'permitRequirementData.bodyArmourRequirementFormGroup'
			)?.value;

			showEmployerInformation = !!bodyArmourRequirement.isMyEmployment;
		} else {
			const armouredVehicleRequirement = this.permitModelFormGroup.get(
				'permitRequirementData.armouredVehicleRequirementFormGroup'
			)?.value;

			showEmployerInformation = !!armouredVehicleRequirement.isMyEmployment;
		}

		return (
			this.permitRequirementFormGroup.valid &&
			(!showEmployerInformation || (showEmployerInformation && this.employerInformationFormGroup.valid)) &&
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
		const shouldSaveStep = this.hasValueChanged;
		console.debug('shouldSaveStep', shouldSaveStep);
		return shouldSaveStep;
	}

	/**
	 * Save the permit data
	 * @returns
	 */
	saveLicenceStep(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const body = this.getSaveBodyAnonymous(this.permitModelFormGroup.getRawValue()); // TODO fix for authenticated
		// TODO Permit service is reference swl service - fix
		return this.tempSecurityWorkerLicensingService.apiWorkerLicenceApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<PermitAppCommandResponse>) => {
				const formValue = this.permitModelFormGroup.getRawValue();
				if (!formValue.licenceAppId) {
					this.permitModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId! }, { emitEvent: false });
				}
			})
		);
	}

	/**
	 * Submit the permit data
	 * @returns
	 */
	submitPermitAuthenticated(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const body = this.getSaveBodyAnonymous(this.permitModelFormGroup.getRawValue()); // TODO fix for authenticated
		console.debug('submitLicenceAuthenticated body', body);

		return this.permitService.apiPermitApplicationsAnonymousSubmitPost$Response({ body });
	}

	/**
	 * Submit the permit data
	 * @returns
	 */
	submitPermitAnonymous(): Observable<StrictHttpResponse<PermitAppCommandResponse>> {
		const permitModelFormValue = this.permitModelFormGroup.getRawValue();

		const body = this.getSaveBodyAnonymous(permitModelFormValue);
		const documentsToSave = this.getDocsToSaveAnonymousBlobs(permitModelFormValue);

		console.debug('[submitPermitAnonymous] permitModelFormValue', permitModelFormValue);
		console.debug('[submitPermitAnonymous] saveBodyAnonymous', body);
		console.debug('[submitPermitAnonymous] documentsToSave', documentsToSave);

		const consentData = this.consentAndDeclarationFormGroup.getRawValue();
		body.agreeToCompleteAndAccurate = consentData.agreeToCompleteAndAccurate;

		const googleRecaptcha = { recaptchaCode: consentData.captchaFormGroup.token };
		if (documentsToSave?.length > 0) {
			return this.postPermitAnonymousNewDocuments(googleRecaptcha, documentsToSave, body);
		} else {
			return this.postPermitAnonymousNoNewDocuments(googleRecaptcha, body);
		}
	}

	/**
	 * Post permit anonymous. This permit must not have any new documents (for example: with an update or replacement)
	 * @returns
	 */
	private postPermitAnonymousNoNewDocuments(googleRecaptcha: GoogleRecaptcha, body: PermitAppAnonymousSubmitRequest) {
		return this.permitService
			.apiPermitApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					return this.permitService.apiPermitApplicationsAnonymousSubmitPost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}

	/**
	 * Post permit anonymous. This permit has new documents (for example: with new or renew)
	 * @returns
	 */
	private postPermitAnonymousNewDocuments(
		googleRecaptcha: GoogleRecaptcha,
		documentsToSave: Array<PermitDocumentsToSave>,
		body: PermitAppAnonymousSubmitRequest
	) {
		return this.permitService
			.apiPermitApplicationsAnonymousKeyCodePost({ body: googleRecaptcha })
			.pipe(
				switchMap((_resp: IActionResult) => {
					const documentsToSaveApis: Observable<string>[] = [];
					documentsToSave.forEach((docBody: PermitDocumentsToSave) => {
						// Only pass new documents and get a keyCode for each of those.
						const newDocumentsOnly: Array<Blob> = [];
						docBody.documents.forEach((doc: any) => {
							if (!doc.documentUrlId) {
								newDocumentsOnly.push(doc);
							}
						});

						// should always be at least one new document
						if (newDocumentsOnly.length > 0) {
							documentsToSaveApis.push(
								this.permitService.apiPermitApplicationsAnonymousFilesPost({
									body: {
										Documents: newDocumentsOnly,
										LicenceDocumentTypeCode: docBody.licenceDocumentTypeCode,
									},
								})
							);
						}
					});

					return forkJoin(documentsToSaveApis);
				}),
				switchMap((resps: string[]) => {
					// pass in the list of document key codes
					body.documentKeyCodes = [...resps];
					return this.permitService.apiPermitApplicationsAnonymousSubmitPost$Response({
						body,
					});
				})
			)
			.pipe(take(1));
	}
}
