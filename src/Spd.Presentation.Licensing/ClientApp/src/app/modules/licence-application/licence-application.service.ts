import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import {
	AdditionalGovIdDocument,
	CitizenshipDocument,
	Document,
	FingerprintProofDocument,
	HeightUnitCode,
	IdPhotoDocument,
	LicenceAppDocumentResponse,
	LicenceDocumentTypeCode,
	MentalHealthDocument,
	PoliceOfficerDocument,
	WorkerCategoryTypeCode,
	WorkerLicenceAppCategoryData,
	WorkerLicenceAppUpsertRequest,
	WorkerLicenceAppUpsertResponse,
	WorkerLicenceResponse,
} from 'src/app/api/models';
import { WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import { BooleanTypeCode, SelectOptions, WorkerCategoryTypes } from 'src/app/core/code-types/model-desc.models';
import { ConfigService } from 'src/app/core/services/config.service';
import { UtilService } from 'src/app/core/services/util.service';
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
		licenceAppId: new FormControl(null),
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
		fingerprintProofData: this.fingerprintProofFormGroup,

		aliasesData: this.aliasesFormGroup,
		citizenshipData: this.citizenshipFormGroup,
		additionalGovIdData: this.additionalGovIdFormGroup,
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
			}, 200);
		});
	}

	addUploadDocument(
		documentCode: LicenceDocumentTypeCode,
		document: File
	): Observable<StrictHttpResponse<Array<LicenceAppDocumentResponse>>> {
		const doc: LicenceDocument = {
			Documents: [document],
			LicenceDocumentTypeCode: documentCode,
		};

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdFilesPost$Response({
			licenceAppId: this.licenceModelFormGroup.value.licenceAppId,
			body: doc,
		});
	}

	/*
	loadLicenceNew(): Observable<any> {
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myFile = this.utilService.dummyFile('test1.doc', 'doc', '8f3fd6f3-afa4-4d5c-a4b8-ee9e29d1ed2b');

				const defaults: any = {
					licenceAppId: 'fc0c10a3-b6e6-4460-ac80-9b516f3e02a5',
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
						policeOfficerRoleCode: PoliceOfficerRoleCode.Other,
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
					fingerprintProofData: {
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
						isCanadianCitizen: BooleanTypeCode.Yes,
						proofTypeCode: LicenceDocumentTypeCode.BirthCertificate,
						expiryDate: null,
						attachments: [myFile],
					},
					additionalGovIdData: {
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
						addressLine1: '123-720 Commonwealth Rd',
						addressLine2: '',
						city: 'Kelowna',
						country: 'Canada',
						postalCode: 'V4V 1R8',
						province: 'British Columbia',
					},
					mailingAddressData: {
						addressSelected: true,
						addressLine1: '777-798 Richmond St W',
						addressLine2: '',
						city: 'Toronto',
						country: 'Canada',
						postalCode: 'M6J 3P3',
						province: 'Ontario',
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
	}*/

	loadLicenceNew2(): Observable<WorkerLicenceResponse> {
		return this.workerLicensingService
			.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId: 'fc0c10a3-b6e6-4460-ac80-9b516f3e02a5' })
			.pipe(
				tap((resp: WorkerLicenceResponse) => {
					const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
					const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };
					const soleProprietorData = {
						isSoleProprietor: resp.isSoleProprietor ? BooleanTypeCode.Yes : BooleanTypeCode.No,
					};
					const expiredLicenceData = {
						hasExpiredLicence: resp.hasExpiredLicence ? BooleanTypeCode.Yes : BooleanTypeCode.No,
						//TODO expired licence fix
						// expiredLicenceNumber: resp.expiredLicenceNumber,
						// expiryDate: resp.expiryDate,
					};
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
						isPoliceOrPeaceOfficer: resp.isPoliceOrPeaceOfficer ? BooleanTypeCode.Yes : BooleanTypeCode.No,
						policeOfficerRoleCode: resp.policeOfficerRoleCode,
						otherOfficerRole: resp.otherOfficerRole,
						attachments: policeBackgroundDataAttachments,
					};

					const bcDriversLicenceData = {
						hasBcDriversLicence: resp.hasBcDriversLicence ? BooleanTypeCode.Yes : BooleanTypeCode.No,
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
						isTreatedForMHC: resp.isTreatedForMHC ? BooleanTypeCode.Yes : BooleanTypeCode.No,
						attachments: mentalHealthConditionsDataAttachments,
					};

					const criminalHistoryData = {
						hasCriminalHistory: resp.hasCriminalHistory ? BooleanTypeCode.Yes : BooleanTypeCode.No,
					};

					const aliasesData = {
						previousNameFlag: resp.hasPreviousName ? BooleanTypeCode.Yes : BooleanTypeCode.No,
					};

					const personalInformationData = {
						oneLegalName: resp.oneLegalName,
						givenName: resp.givenName,
						middleName1: resp.middleName1,
						middleName2: resp.middleName2,
						surname: resp.surname,
						genderCode: resp.genderCode,
						dateOfBirth: resp.dateOfBirth,
					};

					const citizenshipDataAttachments: Array<File> = [];
					if (resp.citizenshipDocument?.documentResponses) {
						resp.citizenshipDocument.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
							const aFile = this.utilService.dummyFile(item);
							citizenshipDataAttachments.push(aFile);
						});
					}
					const citizenshipData = {
						isCanadianCitizen: resp.isCanadianCitizen ? BooleanTypeCode.Yes : BooleanTypeCode.No,
						proofTypeCode: resp.citizenshipDocument?.licenceDocumentTypeCode,
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
						useBcServicesCardPhoto: resp.useBcServicesCardPhoto ? BooleanTypeCode.Yes : BooleanTypeCode.No,
						attachments: photographOfYourselfAttachments,
					};

					const contactInformationData = {
						contactEmailAddress: resp.contactEmailAddress,
						contactPhoneNumber: resp.contactPhoneNumber,
					};

					const residentialAddressData = {
						...resp.residentialAddressData,
						addressSelected: !!resp.residentialAddressData?.addressLine1,
					};

					const mailingAddressData = {
						...resp.mailingAddressData,
						addressSelected: !!resp.mailingAddressData?.addressLine1,
					};

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
							case WorkerCategoryTypeCode.ArmouredCarGuard:
								const attachments1: Array<File> = [];
								category.documents?.forEach((doc: Document) => {
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachments1.push(aFile);
									});
								});

								categoryArmouredCarGuardFormGroup = {
									isInclude: true,
									documentExpiryDate: '2009-10-07T00:00:00+00:00', // TODO where is date
									attachments: attachments1,
								};
								break;
							case WorkerCategoryTypeCode.BodyArmourSales:
								categoryBodyArmourSalesFormGroup = { isInclude: true, checkbox: true };
								break;
							case WorkerCategoryTypeCode.ClosedCircuitTelevisionInstaller:
								categoryClosedCircuitTelevisionInstallerFormGroup = { isInclude: true, checkbox: true };
								break;
							case WorkerCategoryTypeCode.ElectronicLockingDeviceInstaller:
								categoryElectronicLockingDeviceInstallerFormGroup = { isInclude: true, checkbox: true };
								break;
							case WorkerCategoryTypeCode.FireInvestigator:
								categoryFireInvestigatorFormGroup = {
									isInclude: true,
									// fireCourseCertificateAttachments: [myFile],
									// fireVerificationLetterAttachments: [myFile],
								};
								break;
							case WorkerCategoryTypeCode.Locksmith:
								const attachments2: Array<File> = [];
								category.documents?.forEach((doc: Document) => {
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachments2.push(aFile);
									});
								});
								categoryLocksmithFormGroup = {
									isInclude: true,
									// requirementCode: LocksmithRequirementCode.CategoryLocksmith_ExperienceAndApprenticeship,
									attachments: attachments2,
								};
								break;
							case WorkerCategoryTypeCode.LocksmithUnderSupervision:
								categoryLocksmithSupFormGroup = { isInclude: true, checkbox: true };
								break;
							case WorkerCategoryTypeCode.PrivateInvestigator:
								categoryPrivateInvestigatorFormGroup = {
									isInclude: true,
									// requirementCode: PrivateInvestigatorRequirementCode.CategoryPrivateInvestigator_ExperienceAndCourses,
									// trainingCode: PrivateInvestigatorTrainingCode.CompleteOtherCoursesOrKnowledge,
									// attachments: [myFile],
									// trainingAttachments: [myFile],
								};
								break;
							case WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision:
								categoryPrivateInvestigatorSupFormGroup = {
									isInclude: true,
									// 	requirementCode:
									// 		PrivateInvestigatorSupRequirementCode.CategoryPrivateInvestigatorUnderSupervision_PrivateSecurityTrainingNetworkCompletion,
									// 	attachments: [myFile],
									// 	trainingAttachments: [myFile],
								};
								break;
							case WorkerCategoryTypeCode.SecurityGuard:
								const attachments3: Array<File> = [];
								category.documents?.forEach((doc: Document) => {
									doc.documentResponses?.forEach((item: LicenceAppDocumentResponse) => {
										const aFile = this.utilService.dummyFile(item);
										attachments3.push(aFile);
									});
								});
								categorySecurityGuardFormGroup = {
									isInclude: true,
									attachments: attachments3,
									// 	requirementCode: SecurityGuardRequirementCode.CategorySecurityGuard_BasicSecurityTrainingCertificate,
								};
								break;
							case WorkerCategoryTypeCode.SecurityGuardUnderSupervision:
								categorySecurityGuardSupFormGroup = { isInclude: true, checkbox: true };
								break;
							case WorkerCategoryTypeCode.SecurityAlarmInstaller:
								categorySecurityAlarmInstallerFormGroup = {
									isInclude: true,
									// 	requirementCode:
									// 		SecurityAlarmInstallerRequirementCode.CategorySecurityAlarmInstaller_ExperienceOrTrainingEquivalent,
									// 	attachments: [myFile],
								};
								break;
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
							case WorkerCategoryTypeCode.SecurityConsultant:
								categorySecurityConsultantFormGroup = {
									isInclude: true,
									// 	requirementCode: SecurityConsultantRequirementCode.CategorySecurityConsultant_RecommendationLetters,
									// 	attachments: [myFile],
									// 	resumeAttachments: [myFile],
								};
								break;
						}
					});

					this.licenceModelFormGroup.patchValue({
						licenceAppId: resp.licenceAppId,
						workerLicenceTypeData,
						applicationTypeData,
						soleProprietorData,
						expiredLicenceData,
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
					});
					console.log('loadLicenceNew2 resp', resp);
					console.log('loadLicenceNew2 this.licenceModelFormGroup', this.licenceModelFormGroup.value);

					this.initialized = true;
				}),
				take(1)
			);
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
		// 	this.fingerprintProofFormGroup.valid
		// );

		return (
			this.policeBackgroundFormGroup.valid &&
			this.mentalHealthConditionsFormGroup.valid &&
			this.criminalHistoryFormGroup.valid &&
			this.fingerprintProofFormGroup.valid
		);
	}

	isStep3Complete(): boolean {
		// console.debug(
		// 	'isStep3Complete',
		// 	this.personalInformationFormGroup.valid,
		// 	this.aliasesFormGroup.valid,
		// 	this.citizenshipFormGroup.valid,
		// 	this.additionalGovIdFormGroup.valid,
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
			this.additionalGovIdFormGroup.valid &&
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

	saveLicenceStep(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		return this.saveLicence();
	}

	saveLicence(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const formValue = this.licenceModelFormGroup.value;
		console.debug('SAVE saveLicenceBasicInformation licenceModelFormGroup', formValue);

		const licenceAppId = formValue.licenceAppId;
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
		const citizenshipData = { ...formValue.citizenshipData };
		const additionalGovIdData = { ...formValue.additionalGovIdData };
		const policeBackgroundData = { ...formValue.policeBackgroundData };
		const fingerprintProofData = { ...formValue.fingerprintProofData };
		const mentalHealthConditionsData = { ...formValue.mentalHealthConditionsData };
		const photographOfYourselfData = { ...formValue.photographOfYourselfData };

		const categoryData: Array<WorkerLicenceAppCategoryData> = [];

		if (formValue.categoryArmouredCarGuardFormGroup.isInclude) {
			let documents: Array<Document> = [];
			if (formValue.categoryArmouredCarGuardFormGroup.attachments) {
				const categoryArmouredCarGuardDocuments: Array<LicenceAppDocumentResponse> = [];

				formValue.categoryArmouredCarGuardFormGroup.attachments.forEach((doc: any) => {
					const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
						documentUrlId: doc.documentUrlId,
					};
					categoryArmouredCarGuardDocuments.push(licenceAppDocumentResponse);
				});

				const categoryArmouredCarGuardDocument = {
					documentResponses: categoryArmouredCarGuardDocuments,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				};
				documents.push(categoryArmouredCarGuardDocument);
			}

			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.ArmouredCarGuard,
				documents: documents,
				//xxxxxxxxxxxx
			});
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
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.FireInvestigator,
				//xxxxxxxxxxxx
			});
		}

		if (formValue.categoryLocksmithFormGroup.isInclude) {
			let documents: Array<Document> = [];
			if (formValue.categoryLocksmithFormGroup.attachments) {
				const categoryLocksmithDocuments: Array<LicenceAppDocumentResponse> = [];

				formValue.categoryLocksmithFormGroup.attachments.forEach((doc: any) => {
					const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
						documentUrlId: doc.documentUrlId,
					};
					categoryLocksmithDocuments.push(licenceAppDocumentResponse);
				});

				const categoryLocksmithDocument = {
					documentResponses: categoryLocksmithDocuments,
					licenceDocumentTypeCode: LicenceDocumentTypeCode.PoliceBackgroundLetterOfNoConflict,
				};
				documents.push(categoryLocksmithDocument);
			}

			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.Locksmith,
				documents,
				//xxxxxxxxxxxx
			});
		}

		if (formValue.categoryLocksmithSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.LocksmithUnderSupervision,
			});
		}

		if (formValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigator,
				//xxxxxxxxxxxx
			});
		}

		if (formValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.PrivateInvestigatorUnderSupervision,
				//xxxxxxxxxxxx
			});
		}

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuard,
				//xxxxxxxxxxxx
			});
		}

		if (formValue.categorySecurityGuardSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityGuardUnderSupervision,
			});
		}

		if (formValue.categorySecurityAlarmInstallerFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityAlarmInstaller,
				//xxxxxxxxxxxx
			});
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
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.SecurityConsultant,
				//xxxxxxxxxxxx
			});
		}

		let policeOfficerDocument: PoliceOfficerDocument | null = null;
		if (policeBackgroundData.attachments) {
			const policeOfficerDocuments: Array<LicenceAppDocumentResponse> = [];
			policeBackgroundData.attachments.forEach((doc: any) => {
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				policeOfficerDocuments.push(licenceAppDocumentResponse);
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
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				mentalHealthDocuments.push(licenceAppDocumentResponse);
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
				const licenceAppDocumentResponse: LicenceAppDocumentResponse = {
					documentUrlId: doc.documentUrlId,
				};
				fingerprintProofDocuments.push(licenceAppDocumentResponse);
			});
			fingerprintProofDocument = {
				documentResponses: fingerprintProofDocuments,
				licenceDocumentTypeCode: LicenceDocumentTypeCode.ProofOfFingerprint,
			};
		}

		let citizenshipDocument: CitizenshipDocument | null = null;
		let additionalGovIdDocument: AdditionalGovIdDocument | null = null;

		if (citizenshipData.attachments) {
			const citizenshipDocuments: Array<LicenceAppDocumentResponse> = [];
			citizenshipData.attachments.forEach((doc: any) => {
				citizenshipDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			citizenshipDocument = {
				documentResponses: citizenshipDocuments,
				expiryDate: citizenshipData.expiryDate,
				licenceDocumentTypeCode: citizenshipData.proofTypeCode,
			};
		}

		const includeAdditionalGovermentIdStepData =
			(formValue.citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes &&
				formValue.citizenshipData.proofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			(formValue.citizenshipData.isCanadianCitizen == BooleanTypeCode.No &&
				formValue.citizenshipData.proofOfAbility != LicenceDocumentTypeCode.PermanentResidentCard);

		if (includeAdditionalGovermentIdStepData && additionalGovIdData.attachments) {
			const additionalGovIdDocuments: Array<LicenceAppDocumentResponse> = [];
			additionalGovIdData.attachments.forEach((doc: any) => {
				additionalGovIdDocuments.push({
					documentUrlId: doc.documentUrlId,
				});
			});
			additionalGovIdDocument = {
				documentResponses: additionalGovIdDocuments,
				expiryDate: additionalGovIdData.expiryDate,
				licenceDocumentTypeCode: additionalGovIdData.governmentIssuedPhotoTypeCode,
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

		const body: WorkerLicenceAppUpsertRequest = {
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
			hasExpiredLicence: this.booleanTypeToBoolean(expiredLicenceData.hasExpiredLicence),
			expiredLicenceNumber:
				expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceNumber : null,
			expiryDate: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiryDate : null,
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
		};
		return this.workerLicensingService.apiWorkerLicenceApplicationsPost$Response({ body }).pipe(
			take(1),
			tap((res: StrictHttpResponse<WorkerLicenceAppUpsertResponse>) => {
				if (!formValue.licenceAppId) {
					this.licenceModelFormGroup.patchValue({ licenceAppId: res.body.licenceAppId }, { emitEvent: false });
				}
			})
		);
	}

	private booleanTypeToBoolean(value: BooleanTypeCode | null): boolean | null {
		if (!value) return null;

		if (value == BooleanTypeCode.Yes) return true;
		return false;
	}
}
