import { Injectable } from '@angular/core';
import { Observable, take, tap } from 'rxjs';
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
	WorkerLicenceAppSubmitRequest,
	WorkerLicenceAppUpsertRequest,
	WorkerLicenceAppUpsertResponse,
	WorkerLicenceResponse,
} from 'src/app/api/models';
import { WorkerLicensingService } from 'src/app/api/services';
import { StrictHttpResponse } from 'src/app/api/strict-http-response';
import {
	BooleanTypeCode,
	PrivateInvestigatorTrainingCode,
	RestraintDocumentTypeCode,
} from 'src/app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from 'src/app/core/constants/constants';
import { AuthUserBcscService } from 'src/app/core/services/auth-user-bcsc.service';
import { UtilService } from 'src/app/core/services/util.service';
import { FormatDatePipe } from 'src/app/shared/pipes/format-date.pipe';
import { LicenceApplicationService } from './licence-application.service';

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationAnonymousService {
	constructor(
		private workerLicensingService: WorkerLicensingService,
		private formatDatePipe: FormatDatePipe,
		private authUserBcscService: AuthUserBcscService,
		private utilService: UtilService,
		private licenceApplicationService: LicenceApplicationService
	) {}

	/**
	 * Reset the licence formgroup
	 */
	reset(): void {
		this.licenceApplicationService.reset();
	}

	/**
	 * Create an empty licence
	 * @returns
	 */
	createNewLicence(): Observable<any> {
		return this.licenceApplicationService.createNewLicenceAnonymous().pipe(
			tap((resp: any) => {
				console.debug('NEW licenceModelFormGroup', resp);

				this.licenceApplicationService.initialized = true;
			})
		);
	}

	/**
	 * Load an existing licence application
	 * @param licenceAppId
	 * @returns
	 */
	loadDraftLicence(licenceAppId: string): Observable<WorkerLicenceResponse> {
		this.licenceApplicationService.reset();

		return this.workerLicensingService.apiWorkerLicenceApplicationsLicenceAppIdGet({ licenceAppId }).pipe(
			tap((resp: WorkerLicenceResponse) => {
				const bcscUserWhoamiProfile = this.authUserBcscService.bcscUserWhoamiProfile;
				const workerLicenceTypeData = { workerLicenceTypeCode: resp.workerLicenceTypeCode };
				const applicationTypeData = { applicationTypeCode: resp.applicationTypeCode };
				const soleProprietorData = {
					isSoleProprietor: this.licenceApplicationService.booleanToBooleanType(resp.isSoleProprietor),
				};
				const expiredLicenceData = {
					hasExpiredLicence: this.licenceApplicationService.booleanToBooleanType(resp.hasExpiredLicence),
					expiredLicenceNumber: resp.expiredLicenceNumber,
					expiryDate: resp.expiryDate,
					expiredLicenceId: resp.expiredLicenceId,
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
					isPoliceOrPeaceOfficer: this.licenceApplicationService.booleanToBooleanType(resp.isPoliceOrPeaceOfficer),
					policeOfficerRoleCode: resp.policeOfficerRoleCode,
					otherOfficerRole: resp.otherOfficerRole,
					attachments: policeBackgroundDataAttachments,
				};

				const bcDriversLicenceData = {
					hasBcDriversLicence: this.licenceApplicationService.booleanToBooleanType(resp.hasBcDriversLicence),
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
					isTreatedForMHC: this.licenceApplicationService.booleanToBooleanType(resp.isTreatedForMHC),
					attachments: mentalHealthConditionsDataAttachments,
				};

				const criminalHistoryData = {
					hasCriminalHistory: this.licenceApplicationService.booleanToBooleanType(resp.hasCriminalHistory),
				};

				const aliasesData = {
					previousNameFlag: this.licenceApplicationService.booleanToBooleanType(resp.hasPreviousName),
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
					isCanadianCitizen: this.licenceApplicationService.booleanToBooleanType(resp.isCanadianCitizen),
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
					useBcServicesCardPhoto: this.licenceApplicationService.booleanToBooleanType(resp.useBcServicesCardPhoto),
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
				if (!isMailingTheSameAsResidential) {
					mailingAddressData = {
						...resp.mailingAddressData,
						addressSelected: !!resp.mailingAddressData?.addressLine1,
					};
				}

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
								carryAndUseRestraints: this.licenceApplicationService.booleanToBooleanType(resp.carryAndUseRestraints),
								carryAndUseRestraintsDocument,
								attachments: attachmentsRestraints,
							};

							dogsAuthorizationData = {
								useDogs: this.licenceApplicationService.booleanToBooleanType(resp.useDogs),
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

				this.licenceApplicationService.licenceModelFormGroup.patchValue({
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
					restraintsAuthorizationData,
					dogsAuthorizationData,
				});

				// console.debug('loadExistingLicence resp', resp);
				console.debug(
					'LOAD EXISTING licenceModelFormGroup',
					this.licenceApplicationService.licenceModelFormGroup.value
				);

				this.licenceApplicationService.initialized = true;
			}),
			take(1)
		);
	}

	/**
	 * Submit the licence data
	 * @returns
	 */
	submitLicence(): Observable<StrictHttpResponse<WorkerLicenceAppUpsertResponse>> {
		const body = this.getSaveBody();

		return this.workerLicensingService.apiWorkerLicenceApplicationsSubmitAnonymousPost$Response({ body });
	}

	/**
	 * Get the form group data into the correct structure
	 * @returns
	 */
	private getSaveBody(): WorkerLicenceAppUpsertRequest | WorkerLicenceAppSubmitRequest {
		const formValue = this.licenceApplicationService.licenceModelFormGroup.getRawValue();
		console.debug('getSaveBody licenceModelFormGroup', formValue);

		const licenceAppId = formValue.licenceAppId;
		const workerLicenceTypeData = { ...formValue.workerLicenceTypeData };
		const applicationTypeData = { ...formValue.applicationTypeData };
		const soleProprietorData = { ...formValue.soleProprietorData };
		const bcDriversLicenceData = { ...formValue.bcDriversLicenceData };
		const contactInformationData = { ...formValue.contactInformationData };
		const expiredLicenceData = { ...formValue.expiredLicenceData };
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
		personalInformationData.dateOfBirth = personalInformationData.dateOfBirth
			? this.formatDatePipe.transform(personalInformationData.dateOfBirth, SPD_CONSTANTS.date.backendDateFormat)
			: '';

		const categoryData: Array<WorkerLicenceAppCategoryData> = [];

		if (formValue.categoryArmouredCarGuardFormGroup.isInclude) {
			categoryData.push(
				this.licenceApplicationService.getCategoryArmouredCarGuard(formValue.categoryArmouredCarGuardFormGroup)
			);
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
			categoryData.push(
				this.licenceApplicationService.getCategoryFireInvestigator(formValue.categoryFireInvestigatorFormGroup)
			);
		}

		if (formValue.categoryLocksmithFormGroup.isInclude) {
			categoryData.push(this.licenceApplicationService.getCategoryLocksmith(formValue.categoryLocksmithFormGroup));
		}

		if (formValue.categoryLocksmithSupFormGroup.isInclude) {
			categoryData.push({
				workerCategoryTypeCode: WorkerCategoryTypeCode.LocksmithUnderSupervision,
			});
		}

		if (formValue.categoryPrivateInvestigatorFormGroup.isInclude) {
			categoryData.push(
				this.licenceApplicationService.getCategoryPrivateInvestigator(formValue.categoryPrivateInvestigatorFormGroup)
			);
		}

		if (formValue.categoryPrivateInvestigatorSupFormGroup.isInclude) {
			categoryData.push(
				this.licenceApplicationService.getCategoryPrivateInvestigatorSup(
					formValue.categoryPrivateInvestigatorSupFormGroup
				)
			);
		}

		if (formValue.categorySecurityGuardFormGroup.isInclude) {
			const dogsPurposeFormGroup = formValue.dogsAuthorizationData.dogsPurposeFormGroup;

			const isDetectionDrugs = dogsPurposeFormGroup.isDogsPurposeDetectionDrugs ?? false;
			const isDetectionExplosives = dogsPurposeFormGroup.isDogsPurposeDetectionExplosives ?? false;
			const isProtection = dogsPurposeFormGroup.isDogsPurposeProtection ?? false;

			dogsAuthorizationData = {
				useDogs: this.licenceApplicationService.booleanTypeToBoolean(formValue.dogsAuthorizationData.useDogs),
				isDogsPurposeDetectionDrugs: formValue.dogsAuthorizationData.useDogs ? isDetectionDrugs : null,
				isDogsPurposeDetectionExplosives: formValue.dogsAuthorizationData.useDogs ? isDetectionExplosives : null,
				isDogsPurposeProtection: formValue.dogsAuthorizationData.useDogs ? isProtection : null,
			};

			restraintsAuthorizationData = {
				carryAndUseRestraints: this.licenceApplicationService.booleanTypeToBoolean(
					formValue.restraintsAuthorizationData.carryAndUseRestraints
				),
			};

			categoryData.push(
				this.licenceApplicationService.getCategorySecurityGuard(
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
			categoryData.push(
				this.licenceApplicationService.getCategorySecurityAlarmInstaller(
					formValue.categorySecurityAlarmInstallerFormGroup
				)
			);
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
			categoryData.push(
				this.licenceApplicationService.getCategorySecurityConsultantInstaller(
					formValue.categorySecurityConsultantFormGroup
				)
			);
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
		const includeAdditionalGovermentIdStepData =
			(citizenshipData.isCanadianCitizen == BooleanTypeCode.Yes &&
				citizenshipData.canadianCitizenProofTypeCode != LicenceDocumentTypeCode.CanadianPassport) ||
			(citizenshipData.isCanadianCitizen == BooleanTypeCode.No &&
				citizenshipData.notCanadianCitizenProofTypeCode != LicenceDocumentTypeCode.PermanentResidentCard);

		if (includeAdditionalGovermentIdStepData && additionalGovIdData.attachments) {
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
			this.licenceApplicationService.additionalGovIdFormGroup.reset();
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
			isSoleProprietor: this.licenceApplicationService.booleanTypeToBoolean(soleProprietorData.isSoleProprietor),
			//-----------------------------------
			hasPreviousName: this.licenceApplicationService.booleanTypeToBoolean(formValue.aliasesData.previousNameFlag),
			aliases: formValue.aliasesData.previousNameFlag == BooleanTypeCode.Yes ? formValue.aliasesData.aliases : [],
			//-----------------------------------
			hasBcDriversLicence: this.licenceApplicationService.booleanTypeToBoolean(
				bcDriversLicenceData.hasBcDriversLicence
			),
			bcDriversLicenceNumber:
				bcDriversLicenceData.hasBcDriversLicence == BooleanTypeCode.Yes
					? bcDriversLicenceData.bcDriversLicenceNumber
					: null,
			//-----------------------------------
			...contactInformationData,
			//-----------------------------------
			hasExpiredLicence: this.licenceApplicationService.booleanTypeToBoolean(expiredLicenceData.hasExpiredLicence),
			expiredLicenceNumber:
				expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceNumber : null,
			expiredLicenceId:
				expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceData.expiredLicenceId : null,
			expiryDate: expiredLicenceData.hasExpiredLicence == BooleanTypeCode.Yes ? expiredLicenceExpiryDate : null,
			//-----------------------------------
			...characteristicsData,
			//-----------------------------------
			...personalInformationData,
			//-----------------------------------
			hasCriminalHistory: this.licenceApplicationService.booleanTypeToBoolean(
				formValue.criminalHistoryData.hasCriminalHistory
			),
			//-----------------------------------
			licenceTermCode: formValue.licenceTermData.licenceTermCode,
			//-----------------------------------
			isMailingTheSameAsResidential: residentialAddressData.isMailingTheSameAsResidential,
			mailingAddressData: residentialAddressData.isMailingTheSameAsResidential
				? residentialAddressData
				: mailingAddressData,
			residentialAddressData,
			//-----------------------------------
			isCanadianCitizen: this.licenceApplicationService.booleanTypeToBoolean(citizenshipData.isCanadianCitizen),
			citizenshipDocument,
			additionalGovIdDocument,
			//-----------------------------------
			fingerprintProofDocument,
			//-----------------------------------
			useBcServicesCardPhoto: this.licenceApplicationService.booleanTypeToBoolean(
				photographOfYourselfData.useBcServicesCardPhoto
			),
			idPhotoDocument,
			//-----------------------------------
			isTreatedForMHC: this.licenceApplicationService.booleanTypeToBoolean(mentalHealthConditionsData.isTreatedForMHC),
			mentalHealthDocument,
			//-----------------------------------
			isPoliceOrPeaceOfficer: this.licenceApplicationService.booleanTypeToBoolean(
				policeBackgroundData.isPoliceOrPeaceOfficer
			),
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
}
