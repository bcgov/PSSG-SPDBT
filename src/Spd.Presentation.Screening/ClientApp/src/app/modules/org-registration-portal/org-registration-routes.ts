export class OrgRegistrationRoutes {
	public static ORG_REGISTRATION = 'org-registration';
	public static INVITATION = 'registration';
	public static MODULE_PATH = OrgRegistrationRoutes.ORG_REGISTRATION;

	public static path(route: string | null = null): string {
		return route ? `/${OrgRegistrationRoutes.MODULE_PATH}/${route}` : `/${OrgRegistrationRoutes.MODULE_PATH}`;
	}
}
