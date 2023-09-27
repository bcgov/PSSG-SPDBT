import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject } from 'rxjs';
import { BooleanTypeCode, GenderCode } from 'src/app/api/models';
import { SelectOptions, SwlStatusTypeCode, SwlTermCode, SwlTypeCode } from 'src/app/core/code-types/model-desc.models';

export interface LicenceFormStepComponent {
	getDataToSave(): any;
	// clearCurrentData(): void;
	isFormValid(): boolean;
}

export class LicenceModel {
	licenseTypeCode: SwlTypeCode | null = null;
	statusTypeCode: SwlStatusTypeCode | null = null;
	isSoleProprietor: BooleanTypeCode | null = null;
	currentLicenceNumber: string | null = null;
	accessCode: string | null = null;
	givenName: string | null = null;
	middleName1: string | null = null;
	middleName2: string | null = null;
	surname: string | null = null;
	genderCode: GenderCode | null = null;
	dateOfBirth: string | null = null;
	hasExpiredLicence: BooleanTypeCode | null = null;
	expiredLicenceNumber: string | null = null;
	expiryDate: string | null = null;
	swlCategoryList: SelectOptions[] = [];
	licenceCategoryArmouredCarGuard?: {};
	licenceCategoryBodyArmourSales?: {};
	licenceCategoryyClosedCircuitTelevisionInstaller?: {};
	licenceCategoryElectronicLockingDeviceInstaller?: {};
	licenceCategoryFireInvestigator?: {};
	licenceCategoryLocksmithUnderSupervision?: {};
	licenceCategoryLocksmith?: {};
	licenceCategoryPrivateInvestigatorUnderSupervision?: {};
	licenceCategoryPrivateInvestigator?: {};
	licenceCategorySecurityAlarmInstallerUnderSupervision?: {};
	licenceCategorySecurityAlarmInstaller?: {};
	licenceCategorySecurityAlarmMonitor?: {};
	licenceCategorySecurityAlarmResponse?: {};
	licenceCategorySecurityAlarmSales?: {};
	licenceCategorySecurityConsultant?: {};
	licenceCategorySecurityGuardUnderSupervision?: {};
	licenceCategorySecurityGuard?: {};
	useDogsOrRestraints: string | null = null;
	isDogsPurposeProtection?: boolean | null = false;
	isDogsPurposeDetectionDrugs?: boolean | null = false;
	isDogsPurposeDetectionExplosives?: boolean | null = false;
	dogsPurposeDocument?: string | null = null;
	dogsPurposeAttachments?: Array<File>[] | null = null;
	carryAndUseRetraints?: boolean | null = false;
	carryAndUseRetraintsDocument?: string | null = null;
	carryAndUseRetraintsAttachments?: Array<File>[] | null = null;
	licenceTermCode: SwlTermCode | null = null;
}

@Injectable({
	providedIn: 'root',
})
export class LicenceApplicationService {
	licenceModelLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	licenceModel: LicenceModel = new LicenceModel();

	constructor(private hotToastService: HotToastService) {
		this.loadLicence();
	}

	loadLicence(): void {
		setTimeout(() => {
			// const defaults: LicenceModel = {
			// 	licenseTypeCode: SwlTypeCode.ArmouredVehicleLicense,
			// 	statusTypeCode: SwlStatusTypeCode.NewOrExpired,
			// 	isSoleProprietor: BooleanTypeCode.Yes,
			// 	currentLicenceNumber: '123456',
			// 	accessCode: '456',
			// 	givenName: 'Jane',
			// 	middleName1: 'Alice',
			// 	middleName2: 'Mary',
			// 	surname: 'Johnson',
			// 	// oneLegalName: false,
			// 	genderCode: GenderCode.F,
			// 	dateOfBirth: '2009-10-07T00:00:00+00:00',
			// 	hasExpiredLicence: BooleanTypeCode.Yes,
			// 	expiredLicenceNumber: '789',
			// 	expiryDate: '2002-02-07T00:00:00+00:00',
			// 	useDogsOrRestraints: BooleanTypeCode.Yes,
			// 	isDogsPurposeProtection: true,
			// 	isDogsPurposeDetectionDrugs: false,
			// 	isDogsPurposeDetectionExplosives: true,
			// 	carryAndUseRetraints: true,
			// 	dogsPurposeDocument: 'b',
			// 	// dogsPurposeAttachments?: string | null = null;
			// 	carryAndUseRetraintsDocument: 'a',
			// 	carryAndUseRetraintsAttachments: null,
			// 	licenceTermCode: SwlTermCode.ThreeYears,
			// 	swlCategoryList: [
			// 		{ desc: 'Armoured Car Guard', code: SwlCategoryTypeCode.ArmouredCarGuard },
			// 		{ desc: 'Body Armour Sales', code: SwlCategoryTypeCode.BodyArmourSales },
			// 		{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
			// 		{ desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
			// 		{ desc: 'Fire Investigator', code: SwlCategoryTypeCode.FireInvestigator },
			// 		{ desc: 'Locksmith', code: SwlCategoryTypeCode.Locksmith },
			// 		{ desc: 'Locksmith - Under Supervision', code: SwlCategoryTypeCode.LocksmithUnderSupervision },
			// 		{ desc: 'Private Investigator', code: SwlCategoryTypeCode.PrivateInvestigator },
			// 		{
			// 			desc: 'Private Investigator - Under Supervision',
			// 			code: SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision,
			// 		},
			// 		{ desc: 'Security Alarm Installer', code: SwlCategoryTypeCode.SecurityAlarmInstaller },
			// 		{
			// 			desc: 'Security Alarm Installer - Under Supervision',
			// 			code: SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
			// 		},
			// 		{ desc: 'Security Alarm Monitor', code: SwlCategoryTypeCode.SecurityAlarmMonitor },
			// 		{ desc: 'Security Alarm Response', code: SwlCategoryTypeCode.SecurityAlarmResponse },
			// 		{ desc: 'Security Alarm Sales', code: SwlCategoryTypeCode.SecurityAlarmSales },
			// 		{ desc: 'Security Consultant', code: SwlCategoryTypeCode.SecurityConsultant },
			// 		{ desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },
			// 		{ desc: 'Security Guard - Under Supervision', code: SwlCategoryTypeCode.SecurityGuardUnderSupervision },
			// 	],
			// };
			// this.licenceModel = { ...defaults };
			this.licenceModelLoaded$.next(true);
		}, 1000);
	}

	loadLicence2(): void {
		setTimeout(() => {
			const defaults: LicenceModel = {
				licenseTypeCode: SwlTypeCode.SecurityBusinessLicense,
				statusTypeCode: SwlStatusTypeCode.Renewal,
				isSoleProprietor: BooleanTypeCode.Yes,
				currentLicenceNumber: '123',
				accessCode: '456',
				givenName: 'Blake',
				middleName1: '',
				middleName2: '',
				surname: 'Smith',
				// oneLegalName: false,
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
				swlCategoryList: [
					{ code: 'ARMOURED_CAR_GUARD', desc: 'Armoured Car Guard' },
					{ code: 'LOCKSMITH', desc: 'Locksmith' },
				],
			};
			this.licenceModel = { ...defaults };
			this.licenceModelLoaded$.next(true);
		}, 1000);
	}

	saveLicence(): void {
		this.hotToastService.success('Licence information has been saved');
		console.log('licence data', this.licenceModel);
	}

	clearLicenceCategoryData(): void {
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
}
