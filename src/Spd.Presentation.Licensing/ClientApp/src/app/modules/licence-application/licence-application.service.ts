import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject } from 'rxjs';
import { BooleanTypeCode, GenderCode } from 'src/app/api/models';
import {
	SelectOptions,
	SwlCategoryTypeCode,
	SwlStatusTypeCode,
	SwlTermCode,
	SwlTypeCode,
} from 'src/app/core/code-types/model-desc.models';

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
	oneLegalName: boolean = false;
	genderCode: GenderCode | null = null;
	dateOfBirth: string | null = null;
	hasExpiredLicence: BooleanTypeCode | null = null;
	expiredLicenceNumber: string | null = null;
	expiryDate: string | null = null;
	licenceTermCode: SwlTermCode | null = null;
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
			const defaults: LicenceModel = {
				licenseTypeCode: SwlTypeCode.ArmouredVehicleLicense,
				statusTypeCode: SwlStatusTypeCode.NewOrExpired,
				isSoleProprietor: BooleanTypeCode.Yes,
				currentLicenceNumber: '123',
				accessCode: '456',
				givenName: 'aa',
				middleName1: 'bb',
				middleName2: 'cc',
				surname: 'ee',
				oneLegalName: false,
				genderCode: GenderCode.M,
				dateOfBirth: '2009-10-07T00:00:00+00:00',
				hasExpiredLicence: BooleanTypeCode.Yes,
				expiredLicenceNumber: '789',
				expiryDate: '2002-02-07T00:00:00+00:00',
				licenceTermCode: SwlTermCode.ThreeYears,
				swlCategoryList: [
					// { desc: 'Armoured Car Guard', code: SwlCategoryTypeCode.ArmouredCarGuard },
					// { desc: 'Body Armour Sales', code: SwlCategoryTypeCode.BodyArmourSales },
					{ desc: 'Closed Circuit Television Installer', code: SwlCategoryTypeCode.ClosedCircuitTelevisionInstaller },
					// { desc: 'Electronic Locking Device Installer', code: SwlCategoryTypeCode.ElectronicLockingDeviceInstaller },
					// { desc: 'Fire Investigator', code: SwlCategoryTypeCode.FireInvestigator },
					// { desc: 'Locksmith', code: SwlCategoryTypeCode.Locksmith },
					// { desc: 'Locksmith - Under Supervision', code: SwlCategoryTypeCode.LocksmithUnderSupervision },
					// { desc: 'Private Investigator', code: SwlCategoryTypeCode.PrivateInvestigator },
					// {
					// 	desc: 'Private Investigator - Under Supervision',
					// 	code: SwlCategoryTypeCode.PrivateInvestigatorUnderSupervision,
					// },
					// { desc: 'Security Alarm Installer', code: SwlCategoryTypeCode.SecurityAlarmInstaller },
					// {
					// 	desc: 'Security Alarm Installer - Under Supervision',
					// 	code: SwlCategoryTypeCode.SecurityAlarmInstallerUnderSupervision,
					// },
					// { desc: 'Security Alarm Monitor', code: SwlCategoryTypeCode.SecurityAlarmMonitor },
					// { desc: 'Security Alarm Response', code: SwlCategoryTypeCode.SecurityAlarmResponse },
					// { desc: 'Security Alarm Sales', code: SwlCategoryTypeCode.SecurityAlarmSales },
					// { desc: 'Security Consultant', code: SwlCategoryTypeCode.SecurityConsultant },
					// { desc: 'Security Guard', code: SwlCategoryTypeCode.SecurityGuard },
					// { desc: 'Security Guard - Under Supervision', code: SwlCategoryTypeCode.SecurityGuardUnderSupervision },
				],
			};
			this.licenceModel = { ...defaults };
			this.licenceModelLoaded$.next(true);
		}, 1000);
	}

	loadLicence2(): void {
		setTimeout(() => {
			const defaults: LicenceModel = {
				licenseTypeCode: SwlTypeCode.ArmouredVehicleLicense,
				statusTypeCode: SwlStatusTypeCode.Renewal,
				isSoleProprietor: BooleanTypeCode.Yes,
				currentLicenceNumber: '123',
				accessCode: '456',
				givenName: 'aa',
				middleName1: 'bb',
				middleName2: 'cc',
				surname: 'ee',
				oneLegalName: false,
				genderCode: GenderCode.M,
				dateOfBirth: '2009-10-07T00:00:00+00:00',
				hasExpiredLicence: BooleanTypeCode.Yes,
				expiredLicenceNumber: '789',
				expiryDate: '2002-02-07T00:00:00+00:00',
				licenceTermCode: SwlTermCode.ThreeYears,
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
