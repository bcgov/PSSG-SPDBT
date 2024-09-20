import {
	ApplicantAppCreateRequest,
	BooleanTypeCode,
	EmployeeInteractionTypeCode,
	ShareableClearanceItem,
} from 'src/app/api/models';

export interface CrcFormStepComponent {
	getDataToSave(): any;
	isFormValid(): boolean;
}

export interface AppInviteOrgData extends ApplicantAppCreateRequest {
	orgAddress?: string | null; // for display
	readonlyTombstone?: boolean | null; // logic for screens - SPDBT-1272
	isCrrpa: boolean;
	notPssoOrPecrc: boolean;
	bcGovEmployeeIdShow: boolean;
	performPaymentProcess?: boolean | null;
	previousNameFlag?: boolean | null;
	shareableCrcExists?: boolean | null;
	shareableClearanceItem?: ShareableClearanceItem | null;
	recaptcha?: string | null;
	orgEmail?: null | string; // from AppOrgResponse
	orgId?: string; // from AppOrgResponse
	orgName?: null | string; // from AppOrgResponse
	orgPhoneNumber?: null | string; // from AppOrgResponse
	orgAddressLine1?: null | string; // from AppOrgResponse
	orgAddressLine2?: null | string; // from AppOrgResponse
	orgCity?: null | string; // from AppOrgResponse
	orgCountry?: null | string; // from AppOrgResponse
	orgPostalCode?: null | string; // from AppOrgResponse
	orgProvince?: null | string; // from AppOrgResponse
	worksWith?: EmployeeInteractionTypeCode; // from AppOrgResponse
	contractorsNeedVulnerableSectorScreening?: BooleanTypeCode; // from AppOrgResponse
	licenseesNeedVulnerableSectorScreening?: BooleanTypeCode; // from AppOrgResponse
}
