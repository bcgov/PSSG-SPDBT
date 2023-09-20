import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { BehaviorSubject } from 'rxjs';
import { BooleanTypeCode, GenderCode } from 'src/app/api/models';
import { SelectOptions } from 'src/app/core/code-types/model-desc.models';

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
}

export enum SwlTypeCode {
	SecurityBusinessLicense = 'SecurityBusinessLicense',
	SecurityWorkerLicense = 'SecurityWorkerLicense',
	ArmouredVehicleLicense = 'ArmouredVehicleLicense',
	BodyArmourLicense = 'BodyArmourLicense',
}

export enum SwlStatusTypeCode {
	NewOrExpired = 'NewOrExpired',
	Renewal = 'Renewal',
	Replacement = 'Replacement',
	Update = 'Update',
}

export enum SwlTermCode {
	NintyDays = '90Days',
	OneYear = '1Year',
	TwoYears = '2Years',
	ThreeYears = '3Years',
}

export enum SwlCategoryTypeCode {
	ArmouredCarGuard = 'ARMOURED_CAR_GUARD',
	BodyArmourSales = 'BODY_ARMOUR_SALES',
	ClosedCircuitTelevisionInstaller = 'CLOSED_CIRCUIT',
	ElectronicLockingDeviceInstaller = 'ELECTRONIC_LOCKING',
	FireInvestigator = 'FIRE_INVESTIGATOR',
	Locksmith = 'LOCKSMITH',
	LocksmithUnderSupervision = 'LOCKSMITH_UNDER_SUP',
	PrivateInvestigator = 'PI',
	PrivateInvestigatorUnderSupervision = 'PI_UNDER_SUP',
	SecurityGuard = 'SECURITY_GUARD',
	SecurityGuardUnderSupervision = 'SECURITY_GUARD_UNDER_SUP',
	SecurityAlarmInstallerUnderSupervision = 'SA_INSTALLER_UNDER_SUP',
	SecurityAlarmInstaller = 'SA_INSTALLER',
	SecurityAlarmMonitor = 'SA_MONITOR',
	SecurityAlarmResponse = 'SA_RESPONSE',
	SecurityAlarmSales = 'SA_SALES',
	SecurityConsultant = 'SECURITY_CONSULTANT',
}

export const SwlCategoryTypes: SelectOptions[] = [
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
];

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
					{ code: 'ARMOURED_CAR_GUARD', desc: 'Armoured Car Guard' },
					{ code: 'SECURITY_GUARD', desc: 'Security Guard' },
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
	}
}
