export class GuideDogServiceDogRoutes {
	public static readonly GUIDE_DOG_SERVICE_DOG = 'guide-dog-service-dog';

	public static readonly MODULE_PATH = GuideDogServiceDogRoutes.GUIDE_DOG_SERVICE_DOG;

	// AUTHENTICATED
	public static readonly GDSD_AUTHENTICATED_BASE = 'application';
	public static readonly GDSD_NEW_AUTHENTICATED = 'gdsd-application-new';

	// ANONYMOUS
	public static readonly GDSD_APPLICATION_ANONYMOUS = 'gdsd-application-anonymous';
	public static readonly GDSD_APPLICATION_TYPE_ANONYMOUS = 'gdsd-application-type';
	public static readonly GDSD_APPLICATION_NEW_ANONYMOUS = 'gdsd-application-new';
	public static readonly GDSD_APPLICATION_RECEIVED = 'gdsd-application-received';

	public static path(route: string | null = null): string {
		return route ? `/${GuideDogServiceDogRoutes.MODULE_PATH}/${route}` : `/${GuideDogServiceDogRoutes.MODULE_PATH}`;
	}

	public static pathGdsdUserApplications(): string {
		return `/${GuideDogServiceDogRoutes.MODULE_PATH}/${GuideDogServiceDogRoutes.GDSD_AUTHENTICATED_BASE}`;
	}

	public static pathGdsdAuthenticated(route: string | null = null): string {
		return route
			? `/${GuideDogServiceDogRoutes.MODULE_PATH}/${GuideDogServiceDogRoutes.GDSD_AUTHENTICATED_BASE}/${route}`
			: `/${GuideDogServiceDogRoutes.MODULE_PATH}/${GuideDogServiceDogRoutes.GDSD_AUTHENTICATED_BASE}`;
	}

	public static pathGdsdAnonymous(route: string | null = null): string {
		return route
			? `/${GuideDogServiceDogRoutes.MODULE_PATH}/${GuideDogServiceDogRoutes.GDSD_APPLICATION_ANONYMOUS}/${route}`
			: `/${GuideDogServiceDogRoutes.MODULE_PATH}`;
	}
}
