export class SecurityLicenceStatusVerificationRoutes {
	public static readonly SECURITY_LICENCE_STATUS_VERIFICATION = 'security-licence-status-verification';
	public static readonly SECURITY_LICENCE_STATUS_VERIFICATION_SWL = 'swl';
	public static readonly SECURITY_LICENCE_STATUS_VERIFICATION_SBL = 'sbl';

	public static readonly MODULE_PATH = SecurityLicenceStatusVerificationRoutes.SECURITY_LICENCE_STATUS_VERIFICATION;

	public static path(route: string | null = null): string {
		return route
			? `/${SecurityLicenceStatusVerificationRoutes.MODULE_PATH}/${route}`
			: `/${SecurityLicenceStatusVerificationRoutes.MODULE_PATH}`;
	}
}
