import { BusinessLicenceApplicationRoutes } from './modules/business-licence-application/business-license-application-routes';
import { ControllingMemberCrcRoutes } from './modules/controlling-member-crc/controlling-member-crc-routes';
import { PersonalLicenceApplicationRoutes } from './modules/personal-licence-application/personal-licence-application-routes';

export class AppRoutes {
	public static readonly PERSONAL_LICENCE_APPLICATION = PersonalLicenceApplicationRoutes.MODULE_PATH;
	public static readonly BUSINESS_LICENCE_APPLICATION = BusinessLicenceApplicationRoutes.MODULE_PATH;
	public static readonly CONTROLLING_MEMBERS_CRC = ControllingMemberCrcRoutes.MODULE_PATH;
	public static readonly LANDING = '';
	public static readonly ACCESS_DENIED = 'access-denied';
	public static readonly INVITATION_DENIED = 'invitation-denied';

	public static path(route: string): string {
		return `/${route}`;
	}
}
