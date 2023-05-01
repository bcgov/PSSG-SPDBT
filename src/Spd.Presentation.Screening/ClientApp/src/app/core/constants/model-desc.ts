import {
	ApplicationStatusCode,
	ContactAuthorizationTypeCode,
	EmployeeInteractionTypeCode,
	ScreeningTypeCode,
} from 'src/app/api/models';

export interface SelectOptions<k = string | number | boolean> {
	code: k;
	desc: string | number | boolean;
}

export const ApplicationStatusFiltersTypes: SelectOptions[] = [
	{ desc: 'Verify Identity', code: 'verifyIdentity' },
	{ desc: 'In Progress', code: 'inProgress' },
	{ desc: 'Pay Now', code: 'payNow' },
	{ desc: 'Awaiting Third Party', code: 'awaitingThirdParty' },
	{ desc: 'Awaiting Applicant', code: 'awaitingApplicant' },
	{ desc: 'Under Assessment', code: 'underAssessment' },
	{ desc: 'Incomplete', code: 'incomplete' },
	{ desc: 'Completed - Cleared', code: 'cleared' },
	{ desc: 'Completed - Risk Found', code: 'riskFound' },
	{ desc: 'Closed - Judicial Review', code: 'judicialReview' },
	{ desc: 'Closed - No Response', code: 'noResponse' },
	{ desc: 'Closed - No Applicant Consent', code: 'noApplicantConsent' },
	{ desc: 'Cancelled by Organization', code: 'cancelledByOrg' },
	{ desc: 'Cancelled by Applicant', code: 'cancelledByAppl' },
];

export const EmployeeInteractionTypes: SelectOptions[] = [
	{ desc: 'Children', code: EmployeeInteractionTypeCode.Children },
	{ desc: 'Vulnerable Adults', code: EmployeeInteractionTypeCode.Adults },
	{ desc: 'Children and Vulnerable Adults', code: EmployeeInteractionTypeCode.ChildrenAndAdults },
];

export const ScreeningTypeCodes: SelectOptions[] = [
	{ desc: 'Staff', code: ScreeningTypeCode.Staff },
	{ desc: 'Contractor/Licensee', code: ScreeningTypeCode.Contractor },
];

export const ContactAuthorizationTypes: SelectOptions[] = [
	{ desc: 'Primary Authorized Contact', code: ContactAuthorizationTypeCode.Primary },
	{ desc: 'Authorized Contact', code: ContactAuthorizationTypeCode.Contact },
];

export const ApplicationStatusCodes: SelectOptions[] = [
	{ desc: 'Draft', code: ApplicationStatusCode.Draft },
	{ desc: 'Payment Pending', code: ApplicationStatusCode.PaymentPending },
	{ desc: 'Incomplete', code: ApplicationStatusCode.Incomplete },
	{ desc: 'Applicant Verification', code: ApplicationStatusCode.ApplicantVerification },
];
