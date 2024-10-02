export class ControllingMemberCrcRoutes {
	public static readonly CONTROLLING_MEMBER_CRC = 'controlling-member-crc';
	public static readonly CONTROLLING_MEMBER_INVITATION = 'invitation';
	public static readonly CONTROLLING_MEMBER_LOGIN = 'login';
	public static readonly CONTROLLING_MEMBER_NEW = 'new';
	public static readonly CONTROLLING_MEMBER_UPDATE = 'update';
	public static readonly CONTROLLING_MEMBER_SUBMISSION_RECEIVED = 'submission';

	public static readonly MODULE_PATH = ControllingMemberCrcRoutes.CONTROLLING_MEMBER_CRC;

	public static path(route: string | null = null): string {
		return route ? `/${ControllingMemberCrcRoutes.MODULE_PATH}/${route}` : `/${ControllingMemberCrcRoutes.MODULE_PATH}`;
	}
}
