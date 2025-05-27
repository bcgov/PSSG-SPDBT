export class CrrpRoutes {
	public static HOME = 'home';
	public static CRIMINAL_RECORD_CHECKS = 'criminal-record-checks';
	public static APPLICATION_STATUSES = 'application-statuses';
	public static EXPIRING_CHECKS = 'expiring-checks';
	public static GENERIC_UPLOADS = 'generic-uploads';
	public static IDENTITY_VERIFICATION = 'identity-verification';
	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	public static ORGANIZATION_PROFILE = 'organization-profile';
	public static TERMS_AND_CONDITIONS = 'terms-and-conditions';
	public static PAYMENTS = 'payments';
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_MANUAL = 'payment-manual';
	public static PAYMENT_ERROR = 'payment-error';
	public static INVITATION = 'invitation';
	public static INVITATION_LINK_ORG = 'invitation-link-bceid';
	public static INVITATION_ACCEPT = 'invitation-accept';
	public static REPORTS = 'reports';
	public static USERS = 'users';
	public static ORG_TERMS_AND_CONDITIONS = 'org-terms-and-conditions';

	public static MODULE_PATH = 'crrp';

	public static path(route: string | null = null): string {
		return route ? `/${CrrpRoutes.MODULE_PATH}/${route}` : `/${CrrpRoutes.MODULE_PATH}`;
	}
}
