export class PssoRoutes {
	public static SCREENING_CHECKS = 'screening-checks';
	public static SCREENING_STATUSES = 'screening-statuses';
	public static IDENTITY_VERIFICATION = 'identity-verification';
	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	public static ORG_TERMS_AND_CONDITIONS = 'org-terms-and-conditions';
	public static MODULE_PATH = 'psso';

	public static path(route: string | null = null): string {
		return route ? `/${PssoRoutes.MODULE_PATH}/${route}` : `/${PssoRoutes.MODULE_PATH}`;
	}
}
