import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import {
	ApplicationTypeCode,
	EyeColourCode,
	GenderCode,
	HairColourCode,
	HeightUnitCode,
	LicenceAppFileCreateResponse,
	LicenceDocumentTypeCode,
	LicenceTermCode,
	PoliceOfficerRoleCode,
	WeightUnitCode,
	WorkerCategoryTypeCode,
	WorkerLicenceTypeCode,
	WorkerLicenceUpsertRequest,
	WorkerLicenceUpsertResponse,
} from 'src/app/api/models';
import { WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import {
	BooleanTypeCode,
	LocksmithRequirementCode,
	PrivateInvestigatorRequirementCode,
	PrivateInvestigatorSupRequirementCode,
	PrivateInvestigatorTrainingCode,
	SecurityAlarmInstallerRequirementCode,
	SecurityConsultantRequirementCode,
	SecurityGuardRequirementCode,
	SelectOptions,
	WorkerCategoryTypes,
} from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { LicenceApplicationHelper, LicenceDocument } from './licence-application.helper';

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService extends LicenceApplicationHelper {
	initialized = false;

	licenceModelLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	hasValueChanged = false;
	// hasDocumentsChanged: LicenceDocumentChanged | null = null;

	licenceModelFormGroup: FormGroup = this.formBuilder.group({
		licenceApplicationId: new FormControl(null),
		workerLicenceTypeData: this.workerLicenceTypeFormGroup,
		applicationTypeData: this.applicationTypeFormGroup,
		soleProprietorData: this.soleProprietorFormGroup,
		personalInformationData: this.personalInformationFormGroup,
		expiredLicenceData: this.expiredLicenceFormGroup,
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
		proofOfFingerprintData: this.proofOfFingerprintFormGroup,

		aliasesData: this.aliasesFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		govIssuedIdData: this.govIssuedIdFormGroup,
		bcDriversLicenceData: this.bcDriversLicenceFormGroup,
		characteristicsData: this.characteristicsFormGroup,
		photographOfYourselfData: this.photographOfYourselfFormGroup,
		residentialAddressData: this.residentialAddressFormGroup,
		mailingAddressData: this.mailingAddressFormGroup,
		contactInformationData: this.contactInformationFormGroup,
	});

	constructor(
		formBuilder: FormBuilder,
		private utilService: UtilService,
		private configService: ConfigService,
		private spinnerService: NgxSpinnerService,
		private workerLicensingService: WorkerLicensingService
	) {
		super(formBuilder);
	}

	reset(): void {
		this.initialized = false;
		this.licenceModelFormGroup.reset();

		const aliases = this.licenceModelFormGroup.controls['aliasesData'].get('aliases') as FormArray;
		aliases.clear();

		console.debug('RESET licenceModelFormGroup', this.licenceModelFormGroup.value);
	}

	createNewLicence(): Observable<any> {
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				this.licenceModelFormGroup.reset();
				console.debug('NEW licenceModelFormGroup', this.licenceModelFormGroup.value);

				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(this.licenceModelFormGroup.value);
			}, 1000);
		});
	}

	addUploadDocument(
		documentCode: LicenceDocumentTypeCode,
		document: File
	): Observable<StrictHttpResponse<Array<LicenceAppFileCreateResponse>>> {
		const doc: LicenceDocument = {
			Files: [document],
			LicenceDocumentTypeCode: documentCode,
		};

		return this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({
			id: this.licenceModelFormGroup.value.licenceApplicationId,
			body: doc,
		});
	}

	removeUploadDocument(document: File): Observable<StrictHttpResponse<Array<LicenceAppFileCreateResponse>>> {
		const doc: LicenceDocument = {
			Files: [document],
			LicenceDocumentTypeCode: LicenceDocumentTypeCode.BcServicesCard,
		};

		return this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({
			id: this.licenceModelFormGroup.value.licenceApplicationId,
			body: doc,
		});
	}

	loadLicenceNew(): Observable<any> {
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myBlob = new Blob();
				const myFile = this.utilService.blobToFile(myBlob, 'test1.doc', '8f3fd6f3-afa4-4d5c-a4b8-ee9e29d1ed2b');

				const defaults: any = {
					licenceApplicationId: 'fc0c10a3-b6e6-4460-ac80-9b516f3e02a5',
					workerLicenceTypeData: {
						workerLicenceTypeCode: WorkerLicenceTypeCode.ArmouredVehiclePermit,
					},
					applicationTypeData: {
						applicationTypeCode: ApplicationTypeCode.New,
					},
					soleProprietorData: {
						isSoleProprietor: BooleanTypeCode.Yes,
					},
					personalInformationData: {
						oneLegalName: false,
						givenName: 'John',
						middleName1: 'Michael',
						middleName2: 'Adam',
						surname: 'Johnson',
						genderCode: GenderCode.M,
						dateOfBirth: '2009-10-07T00:00:00+00:00',
					},
					expiredLicenceData: {
						hasExpiredLicence: BooleanTypeCode.Yes,
						expiredLicenceNumber: '789',
						expiryDate: '2002-02-07T00:00:00+00:00',
					},
					restraintsAuthorizationData: {
						carryAndUseRetraints: BooleanTypeCode.Yes,
						carryAndUseRetraintsDocument: LicenceDocumentTypeCode.RestraintsAdvancedSecurityTrainingCertificate,
						attachments: [myFile],
					},
					dogsAuthorizationData: {
						useDogs: BooleanTypeCode.Yes,
						dogsPurposeFormGroup: {
							isDogsPurposeProtection: true,
							isDogsPurposeDetectionDrugs: false,
							isDogsPurposeDetectionExplosives: true,
						},
						dogsPurposeDocumentType: LicenceDocumentTypeCode.DogsCertificateOfAdvancedSecurityTraining,
						attachments: [myFile],
					},
					licenceTermData: {
						licenceTermCode: LicenceTermCode.ThreeYears,
					},
					policeBackgroundData: {
						isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
						officerRole: PoliceOfficerRoleCode.Other,
						otherOfficerRole: 'testRole',
						attachments: [myFile],
					},
					mentalHealthConditionsData: {
						isTreatedForMHC: BooleanTypeCode.Yes,
						attachments: [myFile],
					},
					criminalHistoryData: {
						hasCriminalHistory: BooleanTypeCode.No,
					},
					proofOfFingerprintData: {
						attachments: [myFile],
					},
					aliasesData: {
						previousNameFlag: BooleanTypeCode.Yes,
						aliases: [
							{ givenName: 'Abby', middleName1: 'Betty', middleName2: 'Meg', surname: 'Brown' },
							{ givenName: 'Abby', middleName1: '', middleName2: '', surname: 'Anderson' },
						],
					},
					citizenshipData: {
						isBornInCanada: BooleanTypeCode.Yes,
						proofTypeCode: LicenceDocumentTypeCode.BirthCertificate,
						expiryDate: null,
						attachments: [myFile],
					},
					govIssuedIdData: {
						governmentIssuedPhotoTypeCode: LicenceDocumentTypeCode.BcServicesCard,
						attachments: [myFile],
					},
					bcDriversLicenceData: {
						hasBcDriversLicence: BooleanTypeCode.Yes,
						bcDriversLicenceNumber: '5458877',
					},
					characteristicsData: {
						hairColourCode: HairColourCode.Black,
						eyeColourCode: EyeColourCode.Blue,
						height: '100',
						heightUnitCode: HeightUnitCode.Inches,
						weight: '75',
						weightUnitCode: WeightUnitCode.Kilograms,
					},
					photographOfYourselfData: {
						useBcServicesCardPhoto: BooleanTypeCode.No,
						attachments: [myFile],
					},
					contactInformationData: {
						contactEmailAddress: 'contact-test@test.gov.bc.ca',
						contactPhoneNumber: '2508896363',
					},
					residentialAddressData: {
						addressSelected: true,
						isMailingTheSameAsResidential: false,
						residentialAddressLine1: '123-720 Commonwealth Rd',
						residentialAddressLine2: '',
						residentialCity: 'Kelowna',
						residentialCountry: 'Canada',
						residentialPostalCode: 'V4V 1R8',
						residentialProvince: 'British Columbia',
					},
					mailingAddressData: {
						addressSelected: true,
						mailingAddressLine1: '777-798 Richmond St W',
						mailingAddressLine2: '',
						mailingCity: 'Toronto',
						mailingCountry: 'Canada',
						mailingPostalCode: 'M6J 3P3',
						mailingProvince: 'Ontario',
					},
					categoryArmouredCarGuardFormGroup: {
						isInclude: true,
						documentExpiryDate: '2009-10-07T00:00:00+00:00',
						attachments: [myFile],
					},
					categoryBodyArmourSalesFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryClosedCircuitTelevisionInstallerFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryElectronicLockingDeviceInstallerFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryFireInvestigatorFormGroup: {
						isInclude: true,
						fireCourseCertificateAttachments: [myFile],
						fireVerificationLetterAttachments: [myFile],
					},
					categoryLocksmithFormGroup: {
						isInclude: true,
						requirementCode: LocksmithRequirementCode.CategoryLocksmith_ExperienceAndApprenticeship,
						attachments: [myFile],
					},
					categoryLocksmithSupFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryPrivateInvestigatorSupFormGroup: {
						isInclude: true,
						requirementCode:
							PrivateInvestigatorSupRequirementCode.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion,
						attachments: [myFile],
						trainingAttachments: [myFile],
					},
					categoryPrivateInvestigatorFormGroup: {
						isInclude: true,
						requirementCode: PrivateInvestigatorRequirementCode.CategoryPrivateInvestigator_ExperienceAndCourses,
						trainingCode: PrivateInvestigatorTrainingCode.CompleteOtherCoursesOrKnowledge,
						attachments: [myFile],
						trainingAttachments: [myFile],
						// fireCourseCertificateAttachments: [myFile],
						// fireVerificationLetterAttachments: [myFile],
						// addFireInvestigator: BooleanTypeCode.Yes,
					},
					categorySecurityAlarmInstallerFormGroup: {
						isInclude: true,
						requirementCode:
							SecurityAlarmInstallerRequirementCode.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent,
						attachments: [myFile],
					},
					categorySecurityAlarmInstallerSupFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categorySecurityAlarmMonitorFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categorySecurityAlarmResponseFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categorySecurityAlarmSalesFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categorySecurityConsultantFormGroup: {
						isInclude: true,
						requirementCode: SecurityConsultantRequirementCode.CategorySecurityConsultant_RecommendationLetters,
						attachments: [myFile],
						resumeAttachments: [myFile],
					},
					categorySecurityGuardFormGroup: {
						isInclude: true,
						attachments: [myFile],
						requirementCode: SecurityGuardRequirementCode.CategorySecurityGuard_BasicSecurityTrainingCertificate,
					},
					categorySecurityGuardSupFormGroup: {
						isInclude: false,
						checkbox: true,
					},
				};

				console.debug('loadLicenceNew defaults', defaults);

				this.licenceModelFormGroup.patchValue({ ...defaults });

				if (defaults.aliasesData.aliases?.length > 0) {
					let transformedAliasItems = defaults.aliasesData.aliases.map((item: any) =>
						this.formBuilder.group({
							givenName: new FormControl(item.givenName),
							middleName1: new FormControl(item.middleName1),
							middleName2: new FormControl(item.middleName2),
							surname: new FormControl(item.surname, [FormControlValidators.required]),
						})
					);

					const aliasesData = this.licenceModelFormGroup.controls['aliasesData'] as FormGroup;
					aliasesData.setControl('aliases', this.formBuilder.array(transformedAliasItems));
				}

				console.debug('this.licenceModelFormGroup', this.licenceModelFormGroup.value);

				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');

				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceNew2(): Observable<any> {
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myBlob = new Blob();
				const myFile = this.utilService.blobToFile(myBlob, 'test.doc');

				const defaults: any = {
					licenceApplicationId: '1d186edf-6573-4c34-be26-bac62f87af19',
					workerLicenceTypeData: {
						workerLicenceTypeCode: WorkerLicenceTypeCode.BodyArmourPermit,
					},
					applicationTypeData: {
						applicationTypeCode: ApplicationTypeCode.New,
					},
					soleProprietorData: {
						isSoleProprietor: BooleanTypeCode.No,
					},
					personalInformationData: {
						oneLegalName: false,
						givenName: 'Alice',
						middleName1: 'Michael',
						middleName2: 'Adam',
						surname: 'Johnson',
						genderCode: GenderCode.F,
						dateOfBirth: '2005-10-07T00:00:00+00:00',
					},
					expiredLicenceData: {
						hasExpiredLicence: BooleanTypeCode.No,
					},
					restraintsAuthorizationData: {
						// carryAndUseRetraints: BooleanTypeCode.No,
					},
					dogsAuthorizationData: {
						// useDogsOrRestraints: BooleanTypeCode.No,
					},
					licenceTermData: {
						licenceTermCode: LicenceTermCode.NintyDays,
					},
					policeBackgroundData: {
						isPoliceOrPeaceOfficer: BooleanTypeCode.No,
					},
					mentalHealthConditionsData: {
						isTreatedForMHC: BooleanTypeCode.No,
					},
					criminalHistoryData: {
						hasCriminalHistory: BooleanTypeCode.No,
					},
					proofOfFingerprintData: {
						attachments: [myFile],
					},
					aliasesData: {
						previousNameFlag: BooleanTypeCode.No,
					},
					citizenshipData: {
						isBornInCanada: BooleanTypeCode.Yes,
						proofTypeCode: LicenceDocumentTypeCode.BirthCertificate,
						expiryDate: null,
						attachments: [myFile],
					},
					govIssuedIdData: {
						governmentIssuedPhotoTypeCode: LicenceDocumentTypeCode.BcServicesCard,
						attachments: [myFile],
					},
					bcDriversLicenceData: {
						hasBcDriversLicence: BooleanTypeCode.No,
					},
					characteristicsData: {
						hairColourCode: HairColourCode.Black,
						eyeColourCode: EyeColourCode.Blue,
						height: '100',
						heightUnitCode: HeightUnitCode.Inches,
						weight: '75',
						weightUnitCode: WeightUnitCode.Kilograms,
					},
					photographOfYourselfData: {
						useBcServicesCardPhoto: BooleanTypeCode.Yes,
					},
					contactInformationData: {
						contactEmailAddress: 'contact-test22@test.gov.bc.ca',
						contactPhoneNumber: '2508896363',
					},
					residentialAddressData: {
						addressSelected: true,
						isMailingTheSameAsResidential: true,
						residentialAddressLine1: '123-720 Commonwealth Rd',
						residentialAddressLine2: '',
						residentialCity: 'Kelowna',
						residentialCountry: 'Canada',
						residentialPostalCode: 'V4V 1R8',
						residentialProvince: 'British Columbia',
					},
					// categorySecurityAlarmInstallerFormGroup: {
					// 	isInclude: true,
					// 	requirementCode: 'a',
					// 	attachments: [myFile],
					// },
					categorySecurityAlarmResponseFormGroup: {
						isInclude: false,
						checkbox: true,
					},
					categoryClosedCircuitTelevisionInstallerFormGroup: {
						isInclude: true,
						checkbox: true,
					},
				};

				console.debug('loadLicenceNew2 defaults', defaults);

				this.licenceModelFormGroup.patchValue({ ...defaults });

				if (defaults.aliasesData.aliases?.length > 0) {
					let transformedAliasItems = defaults.aliasesData.aliases.map((item: any) =>
						this.formBuilder.group({
							givenName: new FormControl(item.givenName),
							middleName1: new FormControl(item.middleName1),
							middleName2: new FormControl(item.middleName2),
							surname: new FormControl(item.surname, [FormControlValidators.required]),
						})
					);

					const aliasesData = this.licenceModelFormGroup.controls['aliasesData'] as FormGroup;
					aliasesData.setControl('aliases', this.formBuilder.array(transformedAliasItems));
				}

				console.debug('this.licenceModelFormGroup', this.licenceModelFormGroup.value);

				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');

				observer.next(defaults);
			}, 1000);
		});
	}

	isStep1Complete(): boolean {
		// console.debug(
		// 	'isStep1Complete',
		// 	this.workerLicenceTypeFormGroup.valid,
		// 	this.applicationTypeFormGroup.valid,
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
			this.workerLicenceTypeFormGroup.valid &&
			this.applicationTypeFormGroup.valid &&
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

	isStep2Complete(): boolean {
		// console.debug(
		// 	'isStep2Complete',
		// 	this.policeBackgroundFormGroup.valid,
		// 	this.mentalHealthConditionsFormGroup.valid,
		// 	this.criminalHistoryFormGroup.valid,
		// 	this.proofOfFingerprintFormGroup.valid
		// );

		return (
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid &&
			this.criminalHistoryFormGroup.valid &&
			this.proofOfFingerprintFormGroup.valid
		);
	}

	isStep3Complete(): boolean {
		// console.debug(
		// 	'isStep3Complete',
		// 	this.personalInformationFormGroup.valid,
		// 	this.aliasesFormGroup.valid,
		// 	this.citizenshipFormGroup.valid,
		// 	this.govIssuedIdFormGroup.valid,
		// 	this.bcDriversLicenceFormGroup.valid,
		// 	this.characteristicsFormGroup.valid,
		// 	this.photographOfYourselfFormGroup.valid,
		// 	this.residentialAddressFormGroup.valid,
		// 	this.mailingAddressFormGroup.valid,
		// 	this.contactInformationFormGroup.valid
		// );

		return (
			this.personalInformationFormGroup.valid &&
			this.aliasesFormGroup.valid &&
			this.citizenshipFormGroup.valid &&
			this.govIssuedIdFormGroup.valid &&
			this.bcDriversLicenceFormGroup.valid &&
			this.characteristicsFormGroup.valid &&
			this.photographOfYourselfFormGroup.valid &&
			this.residentialAddressFormGroup.valid &&
			this.mailingAddressFormGroup.valid &&
			this.contactInformationFormGroup.valid
		);
	}

	getValidCategoryList(categoryList: string[]): SelectOptions<string>[] {
		const invalidCategories = this.configService.configs?.invalidWorkerLicenceCategoryMatrixConfiguration!;
		let updatedList = [...WorkerCategoryTypes];

		categoryList.forEach((item) => {
			updatedList = updatedList.filter((cat) => !invalidCategories[item].includes(cat.code as WorkerCategoryTypeCode));
		});

		return [...updatedList];
	}

	saveLicenceStep(): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {
		return this.saveLicence();
	}

	saveLicence(): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {
		// 	console.log(
		// 		'saveLicence',
		// 		'hasValueChanged',
		// 		this.hasValueChanged
		// 		// 'hasDocumentsChanged',
		// 		// this.hasDocumentsChanged
		// 	);

		// 	// if (this.hasValueChanged && this.hasDocumentsChanged) {
		// 	// 	return forkJoin([this.saveLicenceBasicInformation(), this.saveLicenceDocuments()]);
		// 	// } else if (this.hasValueChanged) {
		// 	return forkJoin([this.saveLicenceBasicInformation()]);
		// 	// } else
		// 	// if (this.hasDocumentsChanged) {
		// 	// 	return forkJoin([this.saveLicenceDocuments()]);
		// 	// }

		// 	// if (this.hasValueChanged) {
		// 	// 	return forkJoin([this.saveLicenceBasicInformation()]);
		// 	// }

		// 	// this.saveLicenceBasicInformation()
		// 	// .pipe(
		// 	// 		map(todo => {
		// 	// 				return todo
		// 	// 		}),
		// 	// 		mergeMap(todo => this.http.get(`https://jsonplaceholder.typicode.com/posts/${todo}/comments`))
		// 	// ).subscribe(response => {
		// 	// 		this.mergeMapResult = response;
		// 	// })
		// }

		// private saveLicenceBasicInformation(): Observable<StrictHttpResponse<WorkerLicenceUpsertResponse>> {
		const formValue = this.licenceModelFormGroup.value;
		console.debug('saveLicenceBasicInformation licenceModelFormGroup', formValue);

		const workerLicenceTypeData = { ...formValue.workerLicenceTypeData };
		const applicationTypeData = { ...formValue.applicationTypeData };
		const soleProprietorData = { ...formValue.soleProprietorData };
		const bcDriversLicenceData = { ...formValue.bcDriversLicenceData };
		const contactInformationData = { ...formValue.contactInformationData };
		const expiredLicenceData = { ...formValue.expiredLicenceData };
		const characteristicsData = { ...formValue.characteristicsData };
		const personalInformationData = { ...formValue.personalInformationData };
		const residentialAddressData = { ...formValue.residentialAddressData };
		const mailingAddressData = { ...formValue.mailingAddressData };

		const body: WorkerLicenceUpsertRequest = {
			licenceApplicationId: formValue.licenceApplicationId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			isSoleProprietor: soleProprietorData.isSoleProprietor == BooleanTypeCode.Yes,
			// hasPreviousName: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes,
			// aliases: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes ? formValue.aliasesData.aliases : [],
			hasBcDriversLicence: bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes,
			bcDriversLicenceNumber:
				bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
					? bcDriversLicenceData.bcDriversLicenceNumber
					: null,
			...contactInformationData,
			hasExpiredLicence: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes,
			expiredLicenceNumber:
				expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceNumber : null,
			expiryDate: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiryDate : null,
			...characteristicsData,
			// ...personalInformationData,
			genderCode: personalInformationData.genderCode, //TODO update when dateofBirth saves
			givenName: personalInformationData.givenName,
			oneLegalName: personalInformationData.oneLegalName,
			middleName1: personalInformationData.middleName1,
			middleName2: personalInformationData.middleName2,
			surname: personalInformationData.surname,
			// dateOfBirth: personalInformationData.dateOfBirth,
			hasCriminalHistory: formValue.criminalHistoryData.hasCriminalHistory == BooleanTypeCode.Yes,
			licenceTermCode: formValue.licenceTermData.licenceTermCode,
			isMailingTheSameAsResidential: residentialAddressData.isMailingTheSameAsResidential,
			mailingAddressData: residentialAddressData.isMailingTheSameAsResidential
				? residentialAddressData
				: mailingAddressData,
			residentialAddressData,
		};
		return this.workerLicensingService.apiAnonymousWorkerLicencesPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<WorkerLicenceUpsertResponse>) => {
				if (!formValue.licenceApplicationId) {
					this.licenceModelFormGroup.patchValue(
						{ licenceApplicationId: res.body.licenceApplicationId },
						{ emitEvent: false }
					);
				}
			})
		);
	}

	// private saveLicenceDocuments(): Array<Observable<StrictHttpResponse<Array<LicenceAppFileCreateResponse>>>> {
	// 	if (!this.hasDocumentsChanged) return [];

	// 	const formValue = this.licenceModelFormGroup.value;
	// 	console.debug('saveLicenceDocuments licenceModelFormGroup', formValue);

	// 	const apis: Array<any> = [];
	// 	const id = formValue.licenceApplicationId;

	// 	switch (this.hasDocumentsChanged) {
	// 		case LicenceDocumentChanged.categoryArmouredCarGuard:
	// 			apis.push(...this.getCategoryArmouredCarGuard(id, formValue.categoryArmouredCarGuardFormGroup));
	// 			console.log('apis', apis);
	// 			// let Files1: Array<File> = [];
	// 			// if (formValue.categoryArmouredCarGuardFormGroup.isInclude) {
	// 			// 	Files1 = [...formValue.categoryArmouredCarGuardFormGroup.attachments];
	// 			// }
	// 			// const doc: LicenceDocument = {
	// 			// 	Files: Files1,
	// 			// 	LicenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
	// 			// 	ExpiryDate: formValue.categoryArmouredCarGuardFormGroup.documentExpiryDate,
	// 			// };
	// 			// apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			break;
	// 		case LicenceDocumentChanged.categoryFireInvestigator:
	// 			apis.push(...this.getCategoryFireInvestigator(id, formValue.categoryFireInvestigatorFormGroup));
	// 			console.log('apis', apis);
	// 			// let Files2: Array<File> = [];
	// 			// if (formValue.categoryFireInvestigatorFormGroup.isInclude) {
	// 			// 	Files2 = [...formValue.categoryFireInvestigatorFormGroup.attachments];
	// 			// }
	// 			// if (formValue.categoryFireInvestigatorFormGroup.isInclude) {
	// 			// 	const doc1: LicenceDocument = {
	// 			// 		Files: [...formValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments],
	// 			// 		LicenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
	// 			// 	};
	// 			// 	const doc2: LicenceDocument = {
	// 			// 		Files: [...formValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments],
	// 			// 		LicenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
	// 			// 	};
	// 			// 	apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc1 }));
	// 			// 	apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc2 }));
	// 			// }
	// 			break;
	// 		case LicenceDocumentChanged.categoryLocksmith:
	// 			if (formValue.categoryLocksmithFormGroup.isInclude) {
	// 				const doc: LicenceDocument = {
	// 					Files: [...formValue.categoryLocksmithFormGroup.attachments],
	// 					LicenceDocumentTypeCode: formValue.categoryLocksmithFormGroup.requirementCode,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.categoryPrivateInvestigator:
	// 			if (formValue.categoryPrivateInvestigatorFormGroup.isInclude) {
	// 				const doc1: LicenceDocument = {
	// 					Files: [...formValue.categoryPrivateInvestigatorFormGroup.attachments],
	// 					LicenceDocumentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.requirementCode,
	// 				};
	// 				const doc2: LicenceDocument = {
	// 					Files: [...formValue.categoryPrivateInvestigatorFormGroup.trainingAttachments],
	// 					LicenceDocumentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.trainingCode,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc1 }));
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc2 }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.categoryPrivateInvestigatorSup:
	// 			if (formValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
	// 				const doc1: LicenceDocument = {
	// 					Files: [...formValue.categoryPrivateInvestigatorSupFormGroup.attachments],
	// 					LicenceDocumentTypeCode: formValue.categoryPrivateInvestigatorSupFormGroup.requirementCode,
	// 				};
	// 				const doc2: LicenceDocument = {
	// 					Files: [...formValue.categoryPrivateInvestigatorSupFormGroup.trainingAttachments],
	// 					LicenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionTraining,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc1 }));
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc2 }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.categorySecurityGuard:
	// 			if (formValue.categorySecurityGuardFormGroup.isInclude) {
	// 				const doc: LicenceDocument = {
	// 					Files: [...formValue.categorySecurityGuardFormGroup.attachments],
	// 					LicenceDocumentTypeCode: formValue.categorySecurityGuardFormGroup.requirementCode,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.categorySecurityAlarmInstaller:
	// 			if (formValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
	// 				const doc: LicenceDocument = {
	// 					Files: [...formValue.categorySecurityAlarmInstallerFormGroup.attachments],
	// 					LicenceDocumentTypeCode: formValue.categorySecurityAlarmInstallerFormGroup.requirementCode,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.categorySecurityConsultant:
	// 			if (formValue.categorySecurityConsultantFormGroup.isInclude) {
	// 				const doc1: LicenceDocument = {
	// 					Files: [...formValue.categorySecurityConsultantFormGroup.attachments],
	// 					LicenceDocumentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
	// 				};
	// 				const doc2: LicenceDocument = {
	// 					Files: [...formValue.categorySecurityConsultantFormGroup.resumeAttachments],
	// 					LicenceDocumentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc1 }));
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc2 }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.citizenship:
	// 		case LicenceDocumentChanged.additionalGovermentId:
	// 			if (formValue.citizenshipData.attachments) {
	// 				const doc1: LicenceDocument = {
	// 					Files: [...formValue.citizenshipData.attachments],
	// 					LicenceDocumentTypeCode: formValue.citizenshipData.proofTypeCode,
	// 					ExpiryDate: formValue.citizenshipData.expiryDate,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc1 }));

	// 				const includeAdditionalGovermentIdStepData =
	// 					(formValue.citizenshipData.isBornInCanada == BooleanTypeCode.Yes &&
	// 						formValue.citizenshipData.proofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
	// 					(formValue.citizenshipData.isBornInCanada == BooleanTypeCode.No &&
	// 						formValue.citizenshipData.proofOfAbility != LicenceDocumentTypeCode.PermanentResidentCard);

	// 				if (includeAdditionalGovermentIdStepData) {
	// 					const doc2: LicenceDocument = {
	// 						Files: [...formValue.govIssuedIdData.attachments],
	// 						LicenceDocumentTypeCode: formValue.govIssuedIdData.governmentIssuedPhotoTypeCode,
	// 					};
	// 					apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc2 }));
	// 				} else {
	// 				}
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.dogsAuthorization:
	// 			apis.push(
	// 				...this.getDogsAuthorization(id, formValue.categorySecurityGuardFormGroup, formValue.dogsAuthorizationData)
	// 			);
	// 			console.log('apis', apis);
	// 			// if (formValue.categorySecurityGuardFormGroup.isInclude) {
	// 			// 	const doc: LicenceDocument = {
	// 			// 		Files: [...formValue.dogsAuthorizationData.attachments],
	// 			// 		LicenceDocumentTypeCode: formValue.dogsAuthorizationData.dogsPurposeDocumentType,
	// 			// 	};
	// 			// 	apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			// }
	// 			break;
	// 		case LicenceDocumentChanged.restraintsAuthorization:
	// 			if (formValue.categorySecurityGuardFormGroup.isInclude) {
	// 				const doc: LicenceDocument = {
	// 					Files: [...formValue.restraintsAuthorizationData.attachments],
	// 					LicenceDocumentTypeCode: formValue.restraintsAuthorizationData.carryAndUseRetraintsDocument,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.mentalHealthConditions:
	// 			if (formValue.mentalHealthConditionsData.attachments) {
	// 				const doc: LicenceDocument = {
	// 					Files: [...formValue.mentalHealthConditionsData.attachments],
	// 					LicenceDocumentTypeCode: LicenceDocumentTypeCode.MentalHealthCondition,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.photographOfYourself:
	// 			if (formValue.photographOfYourselfData.attachments) {
	// 				const doc: LicenceDocument = {
	// 					Files: [...formValue.photographOfYourselfData.attachments],
	// 					LicenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.policeBackground:
	// 			const isPoliceOrPeaceOfficer = formValue.policeBackgroundData.isPoliceOrPeaceOfficer == BooleanTypeCode.Yes;
	// 			if (isPoliceOrPeaceOfficer && formValue.policeBackgroundData.attachments) {
	// 				const doc: LicenceDocument = {
	// 					Files: [...formValue.policeBackgroundData.attachments],
	// 					LicenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			}
	// 			break;
	// 		case LicenceDocumentChanged.proofOfFingerprint:
	// 			if (formValue.proofOfFingerprintData.attachments) {
	// 				const doc: LicenceDocument = {
	// 					Files: [...formValue.proofOfFingerprintData.attachments],
	// 					LicenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
	// 				};
	// 				apis.push(this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc }));
	// 			}
	// 			break;
	// 	}

	// 	console.debug('*************** documents to save:', apis);

	// 	return apis;
	// }

	// private getCategoryArmouredCarGuard(id: string, categoryArmouredCarGuardFormGroup: any): Array<any> {
	// 	let Files: Array<File> = [];

	// 	if (categoryArmouredCarGuardFormGroup.isInclude) {
	// 		Files = [...categoryArmouredCarGuardFormGroup.attachments];
	// 	}

	// 	const doc: LicenceDocument = {
	// 		Files: Files,
	// 		LicenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
	// 		ExpiryDate: categoryArmouredCarGuardFormGroup.documentExpiryDate,
	// 	};
	// 	return [this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc })];
	// }

	// private getCategoryFireInvestigator(id: string, categoryFireInvestigatorFormGroup: any): Array<any> {
	// 	let Files1: Array<File> = [];
	// 	let Files2: Array<File> = [];

	// 	if (categoryFireInvestigatorFormGroup.isInclude) {
	// 		Files1 = [...categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments];
	// 		Files2 = [...categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments];
	// 	}

	// 	const doc1: LicenceDocument = {
	// 		Files: Files1,
	// 		LicenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
	// 	};
	// 	const doc2: LicenceDocument = {
	// 		Files: Files2,
	// 		LicenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
	// 	};

	// 	return [
	// 		this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc1 }),
	// 		this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc2 }),
	// 	];
	// }

	// private getDogsAuthorization(
	// 	id: string,
	// 	categorySecurityGuardFormGroup: any,
	// 	dogsAuthorizationData: any
	// ): Array<any> {
	// 	let Files: Array<File> = [];

	// 	if (categorySecurityGuardFormGroup.isInclude) {
	// 		Files = [...dogsAuthorizationData.attachments];
	// 	}

	// 	const doc: LicenceDocument = {
	// 		Files: Files,
	// 		LicenceDocumentTypeCode: dogsAuthorizationData.dogsPurposeDocumentType,
	// 	};
	// 	console.log('getDogsAuthorization doc', doc);
	// 	return [this.workerLicensingService.apiWorkerLicenceApplicationsIdFilesPost$Response({ id, body: doc })];
	// }

	/*
	xxxxxxxxxxxxxxx(): any {
		const formValue = this.licenceModelFormGroup.value;
		console.debug('saveLicence licenceModelFormGroup', formValue);
		const aliasesData: AliasesData = {
			hasPreviousName: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes,
			aliases: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes ? formValue.aliasesData.aliases : [],
		};

		const applicationTypeData: ApplicationTypeData = {
			applicationTypeCode: formValue.applicationTypeData.applicationTypeCode,
		};

		const bcDriversLicenceData: BcDriversLicenceData = {
			bcDriversLicenceNumber:
				formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
					? formValue.bcDriversLicenceData.bcDriversLicenceNumber
					: '',
			hasBcDriversLicence: formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes,
		};

		const categoriesData: null | Array<WorkerLicenceCategoryData> = [];

		if (formValue.categoryArmouredCarGuardFormGroup.isInclude) {
			const workerLicenceCategoryDocs: LicenceDocument = {
				files: [...formValue.categoryArmouredCarGuardFormGroup.attachments],
				licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryArmouredCarGuardAuthorizationToCarryCertificate,
				expiryDate: formValue.categoryArmouredCarGuardFormGroup.documentExpiryDate,
			};
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: [workerLicenceCategoryDocs],
				workerCategoryTypeCode: WorkerCategoryTypeCode.ArmouredCarGuard,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categoryBodyArmourSalesFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.BodyArmourSales,
			});
		}

		if (formValue.categoryClosedCircuitTelevisionInstallerFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller,
			});
		}

		if (formValue.categoryElectronicLockingDeviceInstallerFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller,
			});
		}

		if (formValue.categoryFireInvestigatorFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<LicenceDocument> = [
				{
					files: [...formValue.categoryFireInvestigatorFormGroup.fireCourseCertificateAttachments],
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorCourseCertificate,
				},
				{
					files: [...formValue.categoryFireInvestigatorFormGroup.fireVerificationLetterAttachments],
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryFireInvestigatorVerificationLetter,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.FireInvestigator,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categoryLocksmithFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<LicenceDocument> = [
				{
					files: [...formValue.categoryLocksmithFormGroup.attachments],
					licenceDocumentTypeCode: formValue.categoryLocksmithFormGroup.requirementCode,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.Locksmith,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categoryLocksmithSupFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.LocksmithUnderSupervision,
			});
		}

		if (formValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<LicenceDocument> = [
				{
					files: [...formValue.categoryPrivateInvestigatorFormGroup.attachments],
					licenceDocumentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.requirementCode,
				},
				{
					files: [...formValue.categoryPrivateInvestigatorFormGroup.trainingAttachments],
					licenceDocumentTypeCode: formValue.categoryPrivateInvestigatorFormGroup.trainingCode,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigator,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<LicenceDocument> = [
				{
					files: [...formValue.categoryPrivateInvestigatorSupFormGroup.attachments],
					licenceDocumentTypeCode: formValue.categoryPrivateInvestigatorSupFormGroup.requirementCode,
				},
				{
					files: [...formValue.categoryPrivateInvestigatorSupFormGroup.trainingAttachments],
					licenceDocumentTypeCode: LicenceDocumentTypeCode.CategoryPrivateInvestigatorUnderSupervisionTraining,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<LicenceDocument> = [
				{
					files: [...formValue.categorySecurityGuardFormGroup.attachments],
					licenceDocumentTypeCode: formValue.categorySecurityGuardFormGroup.requirementCode,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuard,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categorySecurityGuardSupFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
			});
		}

		if (formValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<LicenceDocument> = [
				{
					files: [...formValue.categorySecurityAlarmInstallerFormGroup.attachments],
					licenceDocumentTypeCode: formValue.categorySecurityAlarmInstallerFormGroup.requirementCode,
				},
			];
			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstaller,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		if (formValue.categorySecurityAlarmInstallerSupFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
			});
		}

		if (formValue.categorySecurityAlarmMonitorFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmMonitor,
			});
		}

		if (formValue.categorySecurityAlarmResponseFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmResponse,
			});
		}

		if (formValue.categorySecurityAlarmSalesFormGroup.isInclude) {
			categoriesData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmSales,
			});
		}

		if (formValue.categorySecurityConsultantFormGroup.isInclude) {
			const workerLicenceCategoryDocs: Array<LicenceDocument> = [
				{
					files: [...formValue.categorySecurityConsultantFormGroup.attachments],
					licenceDocumentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
				},
				{
					files: [...formValue.categorySecurityConsultantFormGroup.resumeAttachments],
					licenceDocumentTypeCode: formValue.categorySecurityConsultantFormGroup.requirementCode,
				},
			];

			const workerLicenceCategoryData: WorkerLicenceCategoryData = {
				documents: workerLicenceCategoryDocs,
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityConsultant,
			};
			categoriesData.push(workerLicenceCategoryData);
		}

		const characteristicsData: CharacteristicsData = { ...formValue.characteristicsData };

		let citizenshipData: CitizenshipData = {};
		let govIssuedIdData: GovIssuedIdData = {};

		if (formValue.citizenshipData.attachments) {
			const citizenshipDocs: LicenceDocument = {
				files: [...formValue.citizenshipData.attachments],
				licenceDocumentTypeCode: formValue.citizenshipData.proofTypeCode,
				expiryDate: formValue.citizenshipData.expiryDate,
			};
			citizenshipData = {
				documents: citizenshipDocs,
				isBornInCanada: formValue.citizenshipData.isBornInCanada == BooleanTypeCode.Yes,
			};

			const includeAdditionalGovermentIdStepData =
				(citizenshipData && formValue.citizenshipData.proofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
				(!citizenshipData.isBornInCanada &&
					formValue.citizenshipData.proofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard);

			if (includeAdditionalGovermentIdStepData) {
				const govIssuedIdDocs: LicenceDocument = {
					files: [...formValue.govIssuedIdData.attachments],
					licenceDocumentTypeCode: formValue.govIssuedIdData.governmentIssuedPhotoTypeCode,
				};
				govIssuedIdData = {
					documents: govIssuedIdDocs,
				};
			}
		}

		const contactInformationData: ContactInformationData = { ...formValue.contactInformationData };

		const criminalHistoryData: CriminalHistoryData = { ...formValue.criminalHistoryData };

		let dogsAuthorizationData: DogsAuthorizationData = {};
		let restraintsAuthorizationData: RestraintsAuthorizationData = {};

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			const dogsAuthorizationDocs: LicenceDocument = {
				files: [...formValue.dogsAuthorizationData.attachments],
				licenceDocumentTypeCode: formValue.dogsAuthorizationData.dogsPurposeDocumentType,
			};
			const useDogs = formValue.dogsAuthorizationData.useDogs == BooleanTypeCode.Yes;
			dogsAuthorizationData = {
				documents: useDogs ? dogsAuthorizationDocs : undefined,
				isDogsPurposeDetectionDrugs: useDogs ? formValue.dogsAuthorizationData.isDogsPurposeDetectionDrugs : null,
				isDogsPurposeDetectionExplosives: useDogs
					? formValue.dogsAuthorizationData.isDogsPurposeDetectionExplosives
					: null,
				isDogsPurposeProtection: useDogs ? formValue.dogsAuthorizationData.isDogsPurposeProtection : null,
				useDogs,
			};

			const carryAndUseRetraints = formValue.restraintsAuthorizationData.carryAndUseRetraints == BooleanTypeCode.Yes;
			const restraintsAuthorizationDocs: LicenceDocument = {
				files: [...formValue.restraintsAuthorizationData.attachments],
				licenceDocumentTypeCode: formValue.restraintsAuthorizationData.carryAndUseRetraintsDocument,
			};
			restraintsAuthorizationData = {
				carryAndUseRetraints,
				documents: carryAndUseRetraints ? restraintsAuthorizationDocs : undefined,
			};
		}

		const expiredLicenceData: ExpiredLicenceData = { ...formValue.expiredLicenceData };

		const licenceApplicationId = formValue.licenceApplicationId;

		const licenceTermData: LicenceTermData = { ...formValue.licenceTermData };

		const workerLicenceTypeData: LicenceTypeData = { ...formValue.workerLicenceTypeData };

		let mentalHealthConditionsData: MentalHealthConditionsData = {};
		if (formValue.mentalHealthConditionsData.attachments) {
			const mentalHealthConditionsDocs: LicenceDocument = {
				files: [...formValue.mentalHealthConditionsData.attachments],
				licenceDocumentTypeCode: formValue.mentalHealthConditionsData.governmentIssuedPhotoTypeCode,
			};
			const isTreatedForMHC = formValue.mentalHealthConditionsData.isTreatedForMHC == BooleanTypeCode.Yes;
			mentalHealthConditionsData = {
				documents: isTreatedForMHC ? mentalHealthConditionsDocs : undefined,
				isTreatedForMHC,
			};
		}

		const personalInformationData: PersonalInformationData = { ...formValue.personalInformationData };

		const useBcServicesCardPhoto = formValue.photographOfYourselfData.useBcServicesCardPhoto == BooleanTypeCode.Yes;
		let photographOfYourselfData: PhotographOfYourselfData = { useBcServicesCardPhoto };
		if (formValue.photographOfYourselfData.attachments) {
			const photographOfYourselfDocs: LicenceDocument = {
				files: [...formValue.photographOfYourselfData.attachments],
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PhotoOfYourself,
			};
			photographOfYourselfData = {
				documents: useBcServicesCardPhoto ? photographOfYourselfDocs : undefined,
				useBcServicesCardPhoto,
			};
		}

		const isPoliceOrPeaceOfficer = formValue.policeBackgroundData.isPoliceOrPeaceOfficer == BooleanTypeCode.Yes;
		let policeBackgroundData: PoliceBackgroundData = { isPoliceOrPeaceOfficer };
		if (formValue.policeBackgroundData.attachments) {
			const policeBackgroundDocs: LicenceDocument = {
				files: [...formValue.policeBackgroundData.attachments],
				licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
			};
			policeBackgroundData = {
				documents: isPoliceOrPeaceOfficer ? policeBackgroundDocs : undefined,
				isPoliceOrPeaceOfficer,
				otherOfficerRole:
					formValue.policeBackgroundData.policeOfficerRoleCode == PoliceOfficerRoleCode.Other
						? formValue.policeBackgroundData.otherOfficerRole
						: null,
				policeOfficerRoleCode: isPoliceOrPeaceOfficer ? formValue.policeBackgroundData.policeOfficerRoleCode : null,
			};
		}

		let proofOfFingerprintData: ProofOfFingerprintData = {};
		if (formValue.proofOfFingerprintData.attachments) {
			const proofOfFingerprintDocs: LicenceDocument = {
				files: [...formValue.proofOfFingerprintData.attachments],
				licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
			};
			proofOfFingerprintData = {
				documents: proofOfFingerprintDocs,
			};
		}

		const residentialAddressData: ResidentialAddressData = { ...formValue.residentialAddressData };
		let mailingAddressData: MailingAddressData = {};
		if (!residentialAddressData.isMailingTheSameAsResidential) {
			mailingAddressData = { ...formValue.mailingAddressData };
		}

		const soleProprietorData: SoleProprietorData = {
			isSoleProprietor: formValue.soleProprietorData.isSoleProprietor == BooleanTypeCode.Yes,
		};

		const body: WorkerLicenceCreateRequest = {
			aliasesData,
			applicationTypeData,
			bcDriversLicenceData,
			categoriesData,
			characteristicsData,
			citizenshipData,
			contactInformationData,
			criminalHistoryData,
			dogsAuthorizationData,
			expiredLicenceData,
			govIssuedIdData,
			licenceApplicationId,
			licenceTermData,
			workerLicenceTypeData,
			mailingAddressData,
			mentalHealthConditionsData,
			personalInformationData,
			photographOfYourselfData,
			policeBackgroundData,
			proofOfFingerprintData,
			residentialAddressData,
			restraintsAuthorizationData,
			soleProprietorData,
		};

		console.debug('*************** body to save:', body);

		return this.workerLicensingService.apiWorkerLicencesPost$Response({ body });

		const workerLicenceTypeData = { ...formValue.workerLicenceTypeData };
		const applicationTypeData = { ...formValue.applicationTypeData };
		const soleProprietorData = { ...formValue.soleProprietorData };
		const contactInformationData = { ...formValue.contactInformationData };
		const expiredLicenceData = { ...formValue.expiredLicenceData };
		const characteristicsData = { ...formValue.characteristicsData };
		const personalInformationData = { ...formValue.personalInformationData };
		const residentialAddressData = { ...formValue.residentialAddressData };
		const mailingAddressData = { ...formValue.mailingAddressData };

		const body: WorkerLicenceUpsertRequest = {
			// licenceApplicationId: formValue.applicationTypeData.licenceApplicationId,
			applicationTypeCode: applicationTypeData.applicationTypeCode,
			workerLicenceTypeCode: workerLicenceTypeData.workerLicenceTypeCode,
			isSoleProprietor: soleProprietorData.isSoleProprietor == BooleanTypeCode.Yes,
			// hasPreviousName: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes,
			// aliases: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes ? formValue.aliasesData.aliases : [],
			// hasBcDriversLicence: formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes,
			// bcDriversLicenceNumber:
			// 	formValue.bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
			// 		? formValue.bcDriversLicenceData.bcDriversLicenceNumber
			// 		: null,
			// contactEmailAddress: contactInformationData.contactEmailAddress,
			// contactPhoneNumber: contactInformationData.contactPhoneNumber,
			// dateOfBirth: formValue.applicationTypeData.dateOfBirth,
			// hasExpiredLicence: formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes,
			// expiredLicenceNumber:
			// 	formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes
			// 		? expiredLicenceData.expiredLicenceNumber
			// 		: null,
			// expiryDate:
			// 	formValue.expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiryDate : null,
			// eyeColourCode: characteristicsData.eyeColourCode,
			// hairColourCode: characteristicsData.hairColourCode,
			// height: characteristicsData.height,
			// heightUnitCode: characteristicsData.heightUnitCode,
			// weight: characteristicsData.weight,
			// weightUnitCode: characteristicsData.weightUnitCode,
			// genderCode: personalInformationData.genderCode,
			// givenName: personalInformationData.givenName,
			// oneLegalName: personalInformationData.oneLegalName,
			// middleName1: personalInformationData.middleName1,
			// middleName2: personalInformationData.middleName2,
			// surname: personalInformationData.surname,
			// hasCriminalHistory: formValue.applicationTypeData.hasCriminalHistory == BooleanTypeCode.Yes,
			// licenceTermCode: formValue.applicationTypeData.licenceTermCode,
			// isMailingTheSameAsResidential: residentialAddressData.isMailingTheSameAsResidential,
			// mailingAddressData: residentialAddressData.isMailingTheSameAsResidential
			// 	? residentialAddressData
			// 	: mailingAddressData,
			// residentialAddressData,
		};
		// return this.workerLicensingService.apiAnonymousWorkerLicencesPost$Response({ body });

		// const body2: ProofOfFingerprintUpsertRequest = {
		// 	licenceApplicationId: '',
		// };
		// const proofOfFingerprintDocs: LicenceDocument = {
		// 	files: [...formValue.proofOfFingerprintData.attachments],
		// 	licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
		// };
		// const body3: PhotographOfYourselfUpsertRequest = { documents: proofOfFingerprintDocs };

		return forkJoin([
			this.workerLicensingService.apiAnonymousWorkerLicencesPost$Response({ body }),
			// this.workerLicensingService.apiWorkerLicencesFingerprintPost$Response(),
			// this.workerLicensingService.apiWorkerLicencesPhotographOfYourselfPost$Response(),
		]);

		// forkJoin([
		// 	this.workerLicensingService.apiWorkerLicencesFingerprintPost$Response({ body: body2 }),
		// 	this.workerLicensingService.apiAnonymousWorkerLicencesPost$Response({ body }),
		// ]).subscribe({
		// 	next: (resp) => {
		// 		console.log('resp', resp);
		// 	},
		// 	error: (error) => {
		// 		// only 404 will be here as an error
		// 		console.log('An error occurred during save', error);
		// 	},
		// });
	}
		*/
}
