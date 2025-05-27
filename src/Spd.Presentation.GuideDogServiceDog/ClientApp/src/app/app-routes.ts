import { CrrpRoutes } from './modules/crrp-portal/crrp-routes';
import { CrrpaRoutes } from './modules/crrpa-portal/crrpa-routes';
import { OrgRegistrationRoutes } from './modules/org-registration-portal/org-registration-routes';
import { PssoRoutes } from './modules/psso-portal/psso-routes';
import { PssoaRoutes } from './modules/pssoa-portal/pssoa-routes';
import { SecurityScreeningRoutes } from './modules/security-screening-portal/security-screening-routes';

export class AppRoutes {
	public static readonly ORG_REGISTRATION = OrgRegistrationRoutes.MODULE_PATH;
	public static readonly CRRP_APPLICATION = CrrpRoutes.MODULE_PATH;
	public static readonly CRRPA_APPLICATION = CrrpaRoutes.MODULE_PATH;
	public static readonly PSSO_APPLICATION = PssoRoutes.MODULE_PATH;
	public static readonly PSSOA_APPLICATION = PssoaRoutes.MODULE_PATH;
	public static readonly SECURITY_SCREENING_APPLICATION = SecurityScreeningRoutes.MODULE_PATH;
	public static readonly LANDING = '';
	public static readonly ACCESS_DENIED = 'access-denied';
	public static readonly LOGIN_FAILURE = 'login-failure';
	public static readonly INVITATION_DENIED = 'invitation-denied';

	public static path(route: string): string {
		return `/${route}`;
	}
}
