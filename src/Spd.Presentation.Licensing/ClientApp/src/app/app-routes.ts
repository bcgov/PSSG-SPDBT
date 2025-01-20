import { BusinessLicenceApplicationRoutes } from './modules/business-licence-application/business-license-application-routes';
import { ControllingMemberCrcRoutes } from './modules/controlling-member-crc/controlling-member-crc-routes';
import { GuideDogServiceDogRoutes } from './modules/guide-dog-service-dog/guide-dog-service-dog-routes';
import { MetalDealersAndRecyclersRoutes } from './modules/metal-dealers-and-recyclers/metal-dealers-and-recyclers-routes';
import { PersonalLicenceApplicationRoutes } from './modules/personal-licence-application/personal-licence-application-routes';
import { SecurityLicenceStatusVerificationRoutes } from './modules/security-licence-status-verification/security-licence-status-verification-routes';

export class AppRoutes {
	public static readonly PERSONAL_LICENCE_APPLICATION = PersonalLicenceApplicationRoutes.MODULE_PATH;
	public static readonly BUSINESS_LICENCE_APPLICATION = BusinessLicenceApplicationRoutes.MODULE_PATH;
	public static readonly CONTROLLING_MEMBERS_CRC = ControllingMemberCrcRoutes.MODULE_PATH;
	public static readonly SECURITY_LICENCE_STATUS_VERIFICATION = SecurityLicenceStatusVerificationRoutes.MODULE_PATH;
	public static readonly METAL_DEALERS_AND_RECYCLERS = MetalDealersAndRecyclersRoutes.MODULE_PATH;
	public static readonly GUIDE_DOG_SERVICE_DOG = GuideDogServiceDogRoutes.MODULE_PATH;
	public static readonly LANDING = '';
	public static readonly ACCESS_DENIED = 'access-denied';
	public static readonly INVITATION_DENIED = 'invitation-denied';

	public static path(route: string): string {
		return `/${route}`;
	}
}
