export class AppRoutes {
	public static readonly PERSONAL_LICENCE_APPLICATION = 'personal-licence';
	public static readonly BUSINESS_LICENCE_APPLICATION = 'business-licence';
	public static readonly CONTROLLING_MEMBERS_CRC = 'controlling-member-crc';
	public static readonly SECURITY_LICENCE_STATUS_VERIFICATION = 'security-licence-status-verification';
	public static readonly METAL_DEALERS_AND_RECYCLERS = 'metal-dealers-and-recyclers';
	public static readonly LANDING = '';
	public static readonly ACCESS_DENIED = 'access-denied';
	public static readonly INVITATION_DENIED = 'invitation-denied';

	public static path(route: string): string {
		return `/${route}`;
	}
}
