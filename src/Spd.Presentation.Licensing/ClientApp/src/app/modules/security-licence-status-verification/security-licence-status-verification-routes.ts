import { AppRoutes } from '@app/app-routes';

export class SecurityLicenceStatusVerificationRoutes {
	public static readonly MODULE_PATH = AppRoutes.SECURITY_LICENCE_STATUS_VERIFICATION;

	public static readonly SECURITY_LICENCE_STATUS_VERIFICATION_SWL = 'swl';
	public static readonly SECURITY_LICENCE_STATUS_VERIFICATION_SWLS = 'swls';
	public static readonly SECURITY_LICENCE_STATUS_VERIFICATION_SBL = 'sbl';

	public static path(route: string | null = null): string {
		return route
			? `/${SecurityLicenceStatusVerificationRoutes.MODULE_PATH}/${route}`
			: `/${SecurityLicenceStatusVerificationRoutes.MODULE_PATH}`;
	}
}
