import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Observable } from 'rxjs';
import { BooleanTypeCode, GenderCode } from 'src/app/api/models';
import {
	DogDocumentCode,
	EyeColourCode,
	GovernmentIssuedPhotoIdCode,
	HairColourCode,
	HeightUnitCode,
	PoliceOfficerRoleCode,
	ProofOfAbilityToWorkInCanadaCode,
	ProofOfCanadianCitizenshipCode,
	RestraintDocumentCode,
	SelectOptions,
	SwlApplicationTypeCode,
	SwlCategoryTypeCode,
	SwlTermCode,
	SwlTypeCode,
	WeightUnitCode,
} from 'src/app/core/code-types/model-desc.models';
import { UtilService } from 'src/app/core/services/util.service';

export interface LicenceFormStepComponent {
	getDataToSave(): any;
	// clearCurrentData(): void;
	isFormValid(): boolean;
}

export class LicenceModel {
	isNewOrExpired?: boolean = false;
	isReplacement?: boolean = false;
	isNotReplacement?: boolean = false;
	showStepAccessCode?: boolean = false;
	showStepSoleProprietor?: boolean = false;
	showStepLicenceExpired?: boolean = false;
	showStepDogsAndRestraints?: boolean = false;
	showStepPoliceBackground?: boolean = false;
	showStepMentalHealth?: boolean = false;
	showStepCriminalHistory?: boolean = false;
	showStepFingerprints?: boolean = false;
	showStepBackgroundInfo?: boolean = false;

	licenceTypeCode: SwlTypeCode | null = null;
	applicationTypeCode: SwlApplicationTypeCode | null = null;
	isSoleProprietor: BooleanTypeCode | null = null;
	currentLicenceNumber: string | null = null;
	accessCode: string | null = null;
	oneLegalName: boolean | null = null;
	givenName: string | null = null;
	middleName1: string | null = null;
	middleName2: string | null = null;
	surname: string | null = null;
	genderCode: GenderCode | null = null;
	dateOfBirth: string | null = null;
	hasExpiredLicence: BooleanTypeCode | null = null;
	expiredLicenceNumber?: string | null = null;
	expiryDate?: string | null = null;
	swlCategoryList: SelectOptions[] = [];
	licenceCategoryArmouredCarGuard?: {
		documentExpiryDate?: string | null;
		attachments?: Array<File>;
	};
	licenceCategoryBodyArmourSales?: {};
	licenceCategoryyClosedCircuitTelevisionInstaller?: {};
	licenceCategoryElectronicLockingDeviceInstaller?: {};
	licenceCategoryFireInvestigator?: {
		fireinvestigatorcertificateattachments?: Array<File>;
		fireinvestigatorletterattachments?: Array<File>;
	};
	licenceCategoryLocksmithUnderSupervision?: {};
	licenceCategoryLocksmith?: {
		requirement?: string | null;
		attachments?: Array<File>;
	};
	licenceCategoryPrivateInvestigatorUnderSupervision?: {
		requirement?: string | null;
		// documentExpiryDate?: string | null;
		attachments?: Array<File>;
		trainingattachments?: Array<File>;
	};
	licenceCategoryPrivateInvestigator?: {
		requirement?: string | null;
		training?: string | null;
		// documentExpiryDate?: string | null;
		attachments?: Array<File>;
		trainingattachments?: Array<File>;
		fireinvestigatorcertificateattachments?: Array<File>;
		fireinvestigatorletterattachments?: Array<File>;
		addFireInvestigator?: BooleanTypeCode | null;
	};
	licenceCategorySecurityAlarmInstallerUnderSupervision?: {};
	licenceCategorySecurityAlarmInstaller?: {
		requirement?: string | null;
		attachments?: Array<File>;
	};
	licenceCategorySecurityAlarmMonitor?: {};
	licenceCategorySecurityAlarmResponse?: {};
	licenceCategorySecurityAlarmSales?: {};
	licenceCategorySecurityConsultant?: {
		requirement?: string | null;
		attachments?: Array<File>;
		resumeattachments?: Array<File>;
	};
	licenceCategorySecurityGuardUnderSupervision?: {};
	licenceCategorySecurityGuard?: {
		requirement?: string | null;
		attachments?: Array<File>;
	};
	useDogsOrRestraints: string | null = null;
	isDogsPurposeProtection?: boolean | null = false;
	isDogsPurposeDetectionDrugs?: boolean | null = false;
	isDogsPurposeDetectionExplosives?: boolean | null = false;
	dogsPurposeDocumentType?: DogDocumentCode | null = null;
	dogsPurposeAttachments?: Array<File> = [];
	carryAndUseRetraints?: boolean | null = false;
	carryAndUseRetraintsDocument?: RestraintDocumentCode | null = null;
	carryAndUseRetraintsAttachments?: Array<File> = [];
	licenceTermCode: SwlTermCode | null = null;
	isViewOnlyPoliceOrPeaceOfficer?: boolean = false;
	isPoliceOrPeaceOfficer: BooleanTypeCode | null = null;
	officerRole?: string | null = null;
	otherOfficerRole?: string | null = null;
	letterOfNoConflictAttachments?: Array<File> = [];
	isTreatedForMHC: BooleanTypeCode | null = null;
	mentalHealthConditionAttachments?: Array<File> = [];
	hasCriminalHistory: BooleanTypeCode | null = null;
	proofOfFingerprintAttachments?: Array<File> = [];
	previousNameFlag: BooleanTypeCode | null = null;
	aliases?: Array<AliasModel> | null = null;
	isBornInCanada: BooleanTypeCode | null = null;
	proofOfCitizenship: ProofOfCanadianCitizenshipCode | null = null;
	proofOfAbility: ProofOfAbilityToWorkInCanadaCode | null = null;
	citizenshipDocumentExpiryDate?: string | null = null;
	citizenshipDocumentPhotoAttachments?: Array<File> = [];
	governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode | null = null;
	governmentIssuedPhotoExpiryDate?: string | null = null;
	governmentIssuedPhotoAttachments?: Array<File> = [];
	hasBcDriversLicence: BooleanTypeCode | null = null;
	bcDriversLicenceNumber?: string | null = null;
	hairColourCode: HairColourCode | null = null;
	eyeColourCode: EyeColourCode | null = null;
	height: string | null = null;
	heightUnitCode: HeightUnitCode | null = null;
	weight: string | null = null;
	weightUnitCode: WeightUnitCode | null = null;
	useBcServicesCardPhoto: BooleanTypeCode | null = null;
	photoOfYourselfAttachments?: Array<File> = [];
	contactEmailAddress?: string | null = null;
	contactPhoneNumber?: string | null = null;
}

export class AliasModel {
	constructor(
		givenName: string | null,
		middleName1: string | null,
		middleName2: string | null,
		surname: string | null
	) {
		this.givenName = givenName;
		this.middleName1 = middleName1;
		this.middleName2 = middleName2;
		this.surname = surname;
	}
	givenName: string | null = null;
	middleName1: string | null = null;
	middleName2: string | null = null;
	surname: string | null = null;
}

export class LicenceModelSubject {
	isLoaded?: boolean = false;
	isSetFlags?: boolean = false;
	isCategoryLoaded?: boolean = false;
}

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService {
	initialized = false;
	licenceModelLoaded$: BehaviorSubject<LicenceModelSubject> = new BehaviorSubject<LicenceModelSubject>(
		new LicenceModelSubject()
	);

	licenceModel: LicenceModel = new LicenceModel();

	constructor(
		private hotToastService: HotToastService,
		private utilService: UtilService,
		private spinnerService: NgxSpinnerService
	) {}

	/*
		swlCategoryList: [
					{ desc: 'Armoured Car Guard', code: SwlCategoryTypeCode.ArmouredCarGuard },
					{ desc: 'Body Armour Sales', code: SwlCategoryTypeCode.BodyArmourSales },
					{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
					{ desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
					{ desc: 'Fire Investigator', code: SwlCategoryTypeCode.FireInvestigator },
					{ desc: 'Locksmith', code: SwlCategoryTypeCode.Locksmith },
					{ desc: 'Locksmith - Under Supervision', code: SwlCategoryTypeCode.LocksmithUnderSupervision },
					{ desc: 'Private Investigator', code: SwlCategoryTypeCode.PrivateInvestigator },
					{
						desc: 'Private Investigator - Under Supervision',
						code: SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision,
					},
					{ desc: 'Security Alarm Installer', code: SwlCategoryTypeCode.SecurityAlarmInstaller },
					{
						desc: 'Security Alarm Installer - Under Supervision',
						code: SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
					},
					{ desc: 'Security Alarm Monitor', code: SwlCategoryTypeCode.SecurityAlarmMonitor },
					{ desc: 'Security Alarm Response', code: SwlCategoryTypeCode.SecurityAlarmResponse },
					{ desc: 'Security Alarm Sales', code: SwlCategoryTypeCode.SecurityAlarmSales },
					{ desc: 'Security Consultant', code: SwlCategoryTypeCode.SecurityConsultant },
					{ desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },
					{ desc: 'Security Guard - Under Supervision', code: SwlCategoryTypeCode.SecurityGuardUnderSupervision },
				],
				*/

	reset(): void {
		this.initialized = false;
		this.licenceModel = new LicenceModel();
	}

	createNewLicence(): Observable<any> {
		console.log('createNewLicence ');
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				this.licenceModel = new LicenceModel();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(this.licenceModel);
			}, 1000);
		});
	}

	loadLicenceNew(): Observable<any> {
		console.log('loadLicenceNew ');
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myBlob = new Blob();
				const myFile = this.utilService.blobToFile(myBlob, 'test.doc');

				const defaults: LicenceModel = {
					licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
					applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123456',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'John',
					middleName1: 'Michael',
					middleName2: 'Adam',
					surname: 'Johnson',
					genderCode: GenderCode.M,
					dateOfBirth: '2009-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.Yes,
					expiredLicenceNumber: '789',
					expiryDate: '2002-02-07T00:00:00+00:00',
					useDogsOrRestraints: BooleanTypeCode.Yes,
					isDogsPurposeProtection: true,
					isDogsPurposeDetectionDrugs: false,
					isDogsPurposeDetectionExplosives: true,
					dogsPurposeDocumentType: DogDocumentCode.CertificateOfAdvancedSecurityTraining,
					dogsPurposeAttachments: [myFile],
					carryAndUseRetraints: true,
					carryAndUseRetraintsDocument: RestraintDocumentCode.AdvancedSecurityTrainingCertificate,
					carryAndUseRetraintsAttachments: [myFile],
					licenceTermCode: SwlTermCode.ThreeYears,
					isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
					officerRole: PoliceOfficerRoleCode.Other,
					otherOfficerRole: 'testRole',
					letterOfNoConflictAttachments: [myFile],
					isTreatedForMHC: BooleanTypeCode.Yes,
					mentalHealthConditionAttachments: [myFile],
					hasCriminalHistory: BooleanTypeCode.No,
					proofOfFingerprintAttachments: [myFile],
					previousNameFlag: BooleanTypeCode.Yes,
					aliases: [
						{ givenName: 'Abby', middleName1: 'Betty', middleName2: 'Meg', surname: 'Brown' },
						{ givenName: 'Abby', middleName1: '', middleName2: '', surname: 'Anderson' },
					],
					isBornInCanada: BooleanTypeCode.Yes,
					proofOfCitizenship: ProofOfCanadianCitizenshipCode.BirthCertificate,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [myFile],
					governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode.BcServicesCard,
					governmentIssuedPhotoAttachments: [myFile],
					hasBcDriversLicence: BooleanTypeCode.Yes,
					bcDriversLicenceNumber: '5458877',
					hairColourCode: HairColourCode.Black,
					eyeColourCode: EyeColourCode.Blue,
					height: '100',
					heightUnitCode: HeightUnitCode.Inches,
					weight: '75',
					weightUnitCode: WeightUnitCode.Kilograms,
					useBcServicesCardPhoto: BooleanTypeCode.No,
					photoOfYourselfAttachments: [myFile],
					contactEmailAddress: 'contact-test@test.gov.bc.ca',
					contactPhoneNumber: '2508896363',
					swlCategoryList: [
						// { desc: 'Body Armour Sales', code: SwlCategoryTypeCode.BodyArmourSales },
						// { desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },

						{ desc: 'Armoured Car Guard', code: SwlCategoryTypeCode.ArmouredCarGuard },
						{ desc: 'Body Armour Sales', code: SwlCategoryTypeCode.BodyArmourSales },
						{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
						{ desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
						{ desc: 'Fire Investigator', code: SwlCategoryTypeCode.FireInvestigator },
						{ desc: 'Locksmith', code: SwlCategoryTypeCode.Locksmith },
						{ desc: 'Locksmith - Under Supervision', code: SwlCategoryTypeCode.LocksmithUnderSupervision },
						{ desc: 'Private Investigator', code: SwlCategoryTypeCode.PrivateInvestigator },
						{
							desc: 'Private Investigator - Under Supervision',
							code: SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision,
						},
						{ desc: 'Security Alarm Installer', code: SwlCategoryTypeCode.SecurityAlarmInstaller },
						{
							desc: 'Security Alarm Installer - Under Supervision',
							code: SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
						},
						{ desc: 'Security Alarm Monitor', code: SwlCategoryTypeCode.SecurityAlarmMonitor },
						{ desc: 'Security Alarm Response', code: SwlCategoryTypeCode.SecurityAlarmResponse },
						{ desc: 'Security Alarm Sales', code: SwlCategoryTypeCode.SecurityAlarmSales },
						{ desc: 'Security Consultant', code: SwlCategoryTypeCode.SecurityConsultant },
						{ desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },
						{ desc: 'Security Guard - Under Supervision', code: SwlCategoryTypeCode.SecurityGuardUnderSupervision },
					],
					licenceCategorySecurityGuard: {
						attachments: [myFile],
						requirement: 'a',
					},
					licenceCategoryArmouredCarGuard: {
						documentExpiryDate: '2009-10-07T00:00:00+00:00',
						attachments: [myFile],
					},

					licenceCategoryFireInvestigator: {
						fireinvestigatorcertificateattachments: [myFile],
						fireinvestigatorletterattachments: [myFile],
					},
					licenceCategoryLocksmith: {
						requirement: 'a',
						attachments: [myFile],
					},
					licenceCategoryPrivateInvestigatorUnderSupervision: {
						requirement: 'a',
						// documentExpiryDate: '2009-10-07T00:00:00+00:00',
						attachments: [myFile],
						trainingattachments: [myFile],
					},
					licenceCategoryPrivateInvestigator: {
						requirement: 'a',
						training: 'a',
						// documentExpiryDate: '2009-10-07T00:00:00+00:00',
						attachments: [myFile],
						trainingattachments: [myFile],
						fireinvestigatorcertificateattachments: [myFile],
						fireinvestigatorletterattachments: [myFile],
					},
					licenceCategorySecurityAlarmInstaller: {
						requirement: 'a',
						attachments: [myFile],
					},
					licenceCategorySecurityConsultant: {
						requirement: 'a',
						attachments: [myFile],
						resumeattachments: [myFile],
					},
				};

				console.log('loadLicenceNew defaults', defaults);

				this.licenceModel = { ...defaults };
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');

				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceNew2(): Observable<any> {
		console.log('loadLicenceNew2 ');
		this.spinnerService.show('loaderSpinner');

		return new Observable((observer) => {
			setTimeout(() => {
				const myBlob = new Blob();
				const myFile = this.utilService.blobToFile(myBlob, 'test.doc');

				const defaults: LicenceModel = {
					licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
					applicationTypeCode: SwlApplicationTypeCode.NewOrExpired,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123456',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'Jane',
					middleName1: 'Alice',
					middleName2: 'Mary',
					surname: 'Johnson',
					genderCode: GenderCode.F,
					dateOfBirth: '2009-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.No,
					useDogsOrRestraints: BooleanTypeCode.No,
					licenceTermCode: SwlTermCode.NintyDays,
					isPoliceOrPeaceOfficer: BooleanTypeCode.No,
					isTreatedForMHC: BooleanTypeCode.No,
					hasCriminalHistory: BooleanTypeCode.No,
					proofOfFingerprintAttachments: [myFile],
					previousNameFlag: BooleanTypeCode.No,
					isBornInCanada: BooleanTypeCode.Yes,
					proofOfCitizenship: ProofOfCanadianCitizenshipCode.SecureCertificateOfIndianStatus,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [myFile],
					governmentIssuedPhotoTypeCode: GovernmentIssuedPhotoIdCode.BcServicesCard,
					governmentIssuedPhotoAttachments: [myFile],
					hasBcDriversLicence: BooleanTypeCode.No,
					hairColourCode: HairColourCode.Black,
					eyeColourCode: EyeColourCode.Blue,
					height: '200',
					heightUnitCode: HeightUnitCode.Inches,
					weight: '175',
					weightUnitCode: WeightUnitCode.Kilograms,
					useBcServicesCardPhoto: BooleanTypeCode.Yes,
					contactEmailAddress: 'contact-test2@test.gov.bc.ca',
					contactPhoneNumber: '2508896366',
					swlCategoryList: [{ desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard }],
					licenceCategorySecurityGuard: {
						attachments: [myFile],
						requirement: 'b',
					},
				};

				console.log('loadLicenceNew2 defaults', defaults);

				this.licenceModel = { ...defaults };
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceRenewal(): Observable<any> {
		console.log('loadLicenceRenewal ');
		this.spinnerService.show('loaderSpinner');
		this.initialized = true;

		return new Observable((observer) => {
			setTimeout(() => {
				const defaults: LicenceModel = {
					licenceTypeCode: SwlTypeCode.SecurityBusinessLicence,
					applicationTypeCode: SwlApplicationTypeCode.Renewal,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'Blake',
					middleName1: '',
					middleName2: '',
					surname: 'Smith',
					genderCode: GenderCode.M,
					dateOfBirth: '2000-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.No,
					expiredLicenceNumber: '',
					expiryDate: '',
					useDogsOrRestraints: null,
					isDogsPurposeProtection: null,
					isDogsPurposeDetectionDrugs: null,
					isDogsPurposeDetectionExplosives: null,
					carryAndUseRetraints: null,
					licenceTermCode: SwlTermCode.NintyDays,
					isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
					officerRole: PoliceOfficerRoleCode.Other,
					otherOfficerRole: 'Janitor',
					isTreatedForMHC: null,
					hasCriminalHistory: null,
					previousNameFlag: BooleanTypeCode.No,
					isBornInCanada: null,
					proofOfCitizenship: null,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [],
					governmentIssuedPhotoTypeCode: null,
					hasBcDriversLicence: null,
					hairColourCode: null,
					eyeColourCode: null,
					height: null,
					heightUnitCode: null,
					weight: null,
					weightUnitCode: null,
					useBcServicesCardPhoto: null,
					swlCategoryList: [
						{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
					],
				};
				console.log('loadLicenceRenewal defaults', defaults);
				this.licenceModel = { ...defaults };
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceReplacement(): Observable<any> {
		console.log('loadLicenceReplacement ');
		this.spinnerService.show('loaderSpinner');
		this.initialized = true;

		return new Observable((observer) => {
			setTimeout(() => {
				const defaults: LicenceModel = {
					licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
					applicationTypeCode: SwlApplicationTypeCode.Replacement,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123456',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'Jane',
					middleName1: 'Alice',
					middleName2: 'Mary',
					surname: 'Johnson',
					genderCode: GenderCode.F,
					dateOfBirth: '2009-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.Yes,
					expiredLicenceNumber: '789',
					expiryDate: '2002-02-07T00:00:00+00:00',
					useDogsOrRestraints: BooleanTypeCode.Yes,
					isDogsPurposeProtection: true,
					isDogsPurposeDetectionDrugs: false,
					isDogsPurposeDetectionExplosives: true,
					carryAndUseRetraints: true,
					dogsPurposeDocumentType: DogDocumentCode.SecurityDogValidationCertificate,
					carryAndUseRetraintsDocument: RestraintDocumentCode.TrainingEquivalent,
					carryAndUseRetraintsAttachments: [],
					licenceTermCode: SwlTermCode.ThreeYears,
					isPoliceOrPeaceOfficer: null,
					isTreatedForMHC: null,
					hasCriminalHistory: null,
					previousNameFlag: null,
					isBornInCanada: null,
					proofOfCitizenship: null,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [],
					governmentIssuedPhotoTypeCode: null,
					hasBcDriversLicence: null,
					hairColourCode: null,
					eyeColourCode: null,
					height: null,
					heightUnitCode: null,
					weight: null,
					weightUnitCode: null,
					useBcServicesCardPhoto: null,
					swlCategoryList: [
						{ desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
					],
				};
				console.log('loadLicenceReplacement defaults', defaults);
				this.licenceModel = { ...defaults };
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(defaults);
			}, 1000);
		});
	}

	loadLicenceUpdate(): Observable<any> {
		console.log('loadLicenceUpdate ');
		this.spinnerService.show('loaderSpinner');
		this.initialized = true;

		return new Observable((observer) => {
			setTimeout(() => {
				const defaults: LicenceModel = {
					licenceTypeCode: SwlTypeCode.ArmouredVehiclePermit,
					applicationTypeCode: SwlApplicationTypeCode.Update,
					isSoleProprietor: BooleanTypeCode.Yes,
					currentLicenceNumber: '123456',
					accessCode: '456',
					oneLegalName: false,
					givenName: 'Jane',
					middleName1: 'Alice',
					middleName2: 'Mary',
					surname: 'Johnson',
					genderCode: GenderCode.F,
					dateOfBirth: '2009-10-07T00:00:00+00:00',
					hasExpiredLicence: BooleanTypeCode.Yes,
					expiredLicenceNumber: '789',
					expiryDate: '2002-02-07T00:00:00+00:00',
					useDogsOrRestraints: BooleanTypeCode.Yes,
					isDogsPurposeProtection: true,
					isDogsPurposeDetectionDrugs: false,
					isDogsPurposeDetectionExplosives: true,
					carryAndUseRetraints: true,
					dogsPurposeDocumentType: DogDocumentCode.SecurityDogValidationCertificate,
					carryAndUseRetraintsDocument: RestraintDocumentCode.AdvancedSecurityTrainingCertificate,
					carryAndUseRetraintsAttachments: [],
					licenceTermCode: SwlTermCode.ThreeYears,
					isPoliceOrPeaceOfficer: BooleanTypeCode.Yes,
					officerRole: PoliceOfficerRoleCode.AuxiliaryorReserveConstable,
					isTreatedForMHC: null,
					hasCriminalHistory: null,
					previousNameFlag: null,
					isBornInCanada: null,
					proofOfCitizenship: null,
					proofOfAbility: null,
					citizenshipDocumentExpiryDate: null,
					citizenshipDocumentPhotoAttachments: [],
					governmentIssuedPhotoTypeCode: null,
					hasBcDriversLicence: null,
					hairColourCode: null,
					eyeColourCode: null,
					height: null,
					heightUnitCode: null,
					weight: null,
					weightUnitCode: null,
					useBcServicesCardPhoto: null,
					swlCategoryList: [
						{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
						{ desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
					],
				};
				console.log('loadLicenceUpdate defaults', defaults);
				this.licenceModel = { ...defaults };
				// this.notifyLoaded();
				this.initialized = true;
				this.spinnerService.hide('loaderSpinner');
				observer.next(defaults);
			}, 1000);
		});
	}

	saveLicence(): void {
		this.hotToastService.success('Licence information has been saved');
		console.log('SAVE LICENCE DATA', this.licenceModel);
	}

	clearLicenceCategoryData(code: SwlCategoryTypeCode): void {
		switch (code) {
			case SwlCategoryTypeCode.ArmouredCarGuard:
				delete this.licenceModel.licenceCategoryArmouredCarGuard;
				break;
			case SwlCategoryTypeCode.BodyArmourSales:
				delete this.licenceModel.licenceCategoryBodyArmourSales;
				break;
			case SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller:
				delete this.licenceModel.licenceCategoryyClosedCircuitTelevisionInstaller;
				break;
			case SwlCategoryTypeCode.ElectronicLockingDeviceInstaller:
				delete this.licenceModel.licenceCategoryElectronicLockingDeviceInstaller;
				break;
			case SwlCategoryTypeCode.FireInvestigator:
				delete this.licenceModel.licenceCategoryFireInvestigator;
				break;
			case SwlCategoryTypeCode.Locksmith:
				delete this.licenceModel.licenceCategoryLocksmith;
				break;
			case SwlCategoryTypeCode.LocksmithUnderSupervision:
				delete this.licenceModel.licenceCategoryLocksmithUnderSupervision;
				break;
			case SwlCategoryTypeCode.PrivateInvestigator:
				delete this.licenceModel.licenceCategoryPrivateInvestigator;
				break;
			case SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision:
				delete this.licenceModel.licenceCategoryPrivateInvestigatorUnderSupervision;
				break;
			case SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision:
				delete this.licenceModel.licenceCategorySecurityAlarmInstallerUnderSupervision;
				break;
			case SwlCategoryTypeCode.SecurityAlarmInstaller:
				delete this.licenceModel.licenceCategorySecurityAlarmInstaller;
				break;
			case SwlCategoryTypeCode.SecurityAlarmMonitor:
				delete this.licenceModel.licenceCategorySecurityAlarmMonitor;
				break;
			case SwlCategoryTypeCode.SecurityAlarmResponse:
				delete this.licenceModel.licenceCategorySecurityAlarmResponse;
				break;
			case SwlCategoryTypeCode.SecurityAlarmSales:
				delete this.licenceModel.licenceCategorySecurityAlarmSales;
				break;
			case SwlCategoryTypeCode.SecurityConsultant:
				delete this.licenceModel.licenceCategorySecurityConsultant;
				break;
			case SwlCategoryTypeCode.SecurityGuard:
				delete this.licenceModel.licenceCategorySecurityGuard;
				break;
			case SwlCategoryTypeCode.SecurityGuardUnderSupervision:
				delete this.licenceModel.licenceCategorySecurityGuardUnderSupervision;
				break;
		}
	}

	clearAllLicenceCategoryData(): void {
		// call function to delete all licence category data
		delete this.licenceModel.licenceCategoryArmouredCarGuard;
		delete this.licenceModel.licenceCategoryBodyArmourSales;
		delete this.licenceModel.licenceCategoryyClosedCircuitTelevisionInstaller;
		delete this.licenceModel.licenceCategoryElectronicLockingDeviceInstaller;
		delete this.licenceModel.licenceCategoryFireInvestigator;
		delete this.licenceModel.licenceCategoryLocksmithUnderSupervision;
		delete this.licenceModel.licenceCategoryLocksmith;
		delete this.licenceModel.licenceCategoryPrivateInvestigatorUnderSupervision;
		delete this.licenceModel.licenceCategoryPrivateInvestigator;
		delete this.licenceModel.licenceCategorySecurityAlarmInstallerUnderSupervision;
		delete this.licenceModel.licenceCategorySecurityAlarmInstaller;
		delete this.licenceModel.licenceCategorySecurityAlarmMonitor;
		delete this.licenceModel.licenceCategorySecurityAlarmResponse;
		delete this.licenceModel.licenceCategorySecurityAlarmSales;
		delete this.licenceModel.licenceCategorySecurityConsultant;
		delete this.licenceModel.licenceCategorySecurityGuardUnderSupervision;
		delete this.licenceModel.licenceCategorySecurityGuard;
	}

	notifyLoaded(): void {
		this.setFlags();
		console.log('notifyLoaded', this.licenceModel);
		this.licenceModelLoaded$.next({ isLoaded: true, isSetFlags: false });
	}

	notifyUpdateFlags(): void {
		this.setFlags();
		console.log('notifyUpdateFlags', this.licenceModel);
		this.licenceModelLoaded$.next({ isLoaded: false, isSetFlags: true });
	}

	notifyCategoryData(): void {
		console.log('notifyCategoryData', this.licenceModel);
		this.licenceModelLoaded$.next({ isLoaded: false, isSetFlags: false, isCategoryLoaded: true });
	}

	private setFlags(): void {
		this.licenceModel.isNewOrExpired = this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired;

		this.licenceModel.isReplacement = this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Replacement;
		this.licenceModel.isNotReplacement = !this.licenceModel.isReplacement;

		this.licenceModel.showStepAccessCode =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update;

		// Review question would only apply to those who have a SWL w/ Sole Prop already,
		// otherwise they would see the same question shown to New applicants
		this.licenceModel.showStepSoleProprietor =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;

		this.licenceModel.showStepLicenceExpired =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired;

		this.licenceModel.showStepDogsAndRestraints = !!this.licenceModel.swlCategoryList.find(
			(item) => item.code == SwlCategoryTypeCode.SecurityGuard
		);

		this.licenceModel.isViewOnlyPoliceOrPeaceOfficer = this.licenceModel.applicationTypeCode
			? this.licenceModel.applicationTypeCode != SwlApplicationTypeCode.NewOrExpired
			: false;

		this.licenceModel.showStepPoliceBackground =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;

		this.licenceModel.showStepMentalHealth =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;

		this.licenceModel.showStepCriminalHistory =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;

		this.licenceModel.showStepFingerprints =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;

		this.licenceModel.showStepBackgroundInfo = false;

		/*
			

		this.licenceModel.showStepPoliceBackground =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired;

		this.licenceModel.showStepMentalHealth =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired;

		this.licenceModel.showStepCriminalHistory =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired;

		this.licenceModel.showStepFingerprints =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.NewOrExpired ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;

		this.licenceModel.showStepBackgroundInfo =
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Update ||
			this.licenceModel.applicationTypeCode == SwlApplicationTypeCode.Renewal;
			*/
	}
}
