import {
	ApplicationPortalStatusCode,
	ContactAuthorizationTypeCode,
	EmployeeInteractionTypeCode,
	ScreeningTypeCode,
} from 'src/app/api/models';

export interface SelectOptions<k = string | number | boolean> {
	code: k;
	desc: string | number | boolean;
}

export const ApplicationStatusFiltersTypes: SelectOptions[] = [
	{ desc: 'Verify Identity', code: ApplicationPortalStatusCode.VerifyIdentity },
	{ desc: 'In Progress', code: ApplicationPortalStatusCode.InProgress },
	{ desc: 'Pay Now', code: ApplicationPortalStatusCode.AwaitingPayment },
	{ desc: 'Awaiting Third Party', code: ApplicationPortalStatusCode.AwaitingThirdParty },
	{ desc: 'Awaiting Applicant', code: ApplicationPortalStatusCode.AwaitingApplicant },
	{ desc: 'Under Assessment', code: ApplicationPortalStatusCode.UnderAssessment },
	{ desc: 'Incomplete', code: ApplicationPortalStatusCode.Incomplete },
	{ desc: 'Completed - Cleared', code: ApplicationPortalStatusCode.CompletedCleared },
	{ desc: 'Completed - Risk Found', code: ApplicationPortalStatusCode.RiskFound },
	{ desc: 'Closed - Judicial Review', code: ApplicationPortalStatusCode.ClosedJudicialReview },
	{ desc: 'Closed - No Response', code: ApplicationPortalStatusCode.ClosedNoResponse },
	{ desc: 'Closed - No Applicant Consent', code: ApplicationPortalStatusCode.ClosedNoConsent },
	{ desc: 'Cancelled by Organization', code: ApplicationPortalStatusCode.CancelledByOrganization },
	{ desc: 'Cancelled by Applicant', code: ApplicationPortalStatusCode.CancelledByApplicant },
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

export const ApplicationPortalStatusCodes: SelectOptions[] = [
	{ desc: 'In Progress', code: ApplicationPortalStatusCode.InProgress },
	{ desc: 'Payment Pending', code: ApplicationPortalStatusCode.AwaitingPayment },
	{ desc: 'Incomplete', code: ApplicationPortalStatusCode.Incomplete },
	{ desc: 'Verify Identity', code: ApplicationPortalStatusCode.VerifyIdentity },
	{ desc: 'Awaiting Third Party', code: ApplicationPortalStatusCode.AwaitingThirdParty },
	{ desc: 'Awaiting Applicant', code: ApplicationPortalStatusCode.AwaitingApplicant },
	{ desc: 'Under Assessment', code: ApplicationPortalStatusCode.UnderAssessment },
	{ desc: 'Completed Cleared', code: ApplicationPortalStatusCode.CompletedCleared },
	{ desc: 'Risk Found', code: ApplicationPortalStatusCode.RiskFound },
	{ desc: 'Closed Judicial Review', code: ApplicationPortalStatusCode.ClosedJudicialReview },
	{ desc: 'Closed No Response', code: ApplicationPortalStatusCode.ClosedNoResponse },
	{ desc: 'Closed No Consent', code: ApplicationPortalStatusCode.ClosedNoConsent },
	{ desc: 'Cancelled By Applicant', code: ApplicationPortalStatusCode.CancelledByApplicant },
	{ desc: 'Cancelled By Organization', code: ApplicationPortalStatusCode.CancelledByOrganization },
];
