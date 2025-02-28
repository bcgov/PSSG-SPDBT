import { AppRoutes } from '@app/app-routes';

export class GuideDogServiceDogRoutes {
	public static readonly MODULE_PATH = AppRoutes.GUIDE_DOG_SERVICE_DOG;

	// AUTHENTICATED
	public static readonly GDSD_AUTHENTICATED_BASE = 'application';

	public static readonly GDSD_TEAM_NEW_AUTHENTICATED = 'gdsd-team-new';
	public static readonly GDSD_TEAM_RENEWAL_AUTHENTICATED = 'gdsd-team-renewal';
	public static readonly GDSD_TEAM_REPLACEMENT_AUTHENTICATED = 'gdsd-team-replacement';

	public static readonly RETIRED_DOG_NEW_AUTHENTICATED = 'retired-dog-new';
	public static readonly RETIRED_DOG_RENEWAL_AUTHENTICATED = 'retired-dog-renewal';
	public static readonly RETIRED_DOG_REPLACEMENT_AUTHENTICATED = 'retired-dog-replacement';

	// ANONYMOUS
	public static readonly GDSD_ANONYMOUS_BASE = 'gdsd-application-anonymous';
	public static readonly GDSD_APPLICATION_RECEIVED = 'gdsd-application-received';

	public static readonly GDSD_TEAM_APPLICATION_TYPE_ANONYMOUS = 'gdsd-team-application-type';
	public static readonly GDSD_TEAM_ACCESS_CODE_ANONYMOUS = 'gdsd-team-access-code';
	public static readonly GDSD_TEAM_NEW_ANONYMOUS = 'gdsd-team-new';
	public static readonly GDSD_TEAM_RENEWAL_ANONYMOUS = 'gdsd-team-renewal';
	public static readonly GDSD_TEAM_REPLACEMENT_ANONYMOUS = 'gdsd-team-replacement';

	public static readonly DOG_TRAINER_APPLICATION_TYPE_ANONYMOUS = 'dog-trainer-application-type';
	public static readonly DOG_TRAINER_ACCESS_CODE_ANONYMOUS = 'dog-trainer-access-code';
	public static readonly DOG_TRAINER_NEW_ANONYMOUS = 'dog-trainer-new';
	public static readonly DOG_TRAINER_RENEWAL_ANONYMOUS = 'dog-trainer-renewal';
	public static readonly DOG_TRAINER_REPLACEMENT_ANONYMOUS = 'dog-trainer-replacement';

	public static readonly RETIRED_DOG_APPLICATION_TYPE_ANONYMOUS = 'retired-dog-application-type';
	public static readonly RETIRED_DOG_ACCESS_CODE_ANONYMOUS = 'retired-dog-access-code';
	public static readonly RETIRED_DOG_NEW_ANONYMOUS = 'retired-dog-new';
	public static readonly RETIRED_DOG_RENEWAL_ANONYMOUS = 'retired-dog-renewal';
	public static readonly RETIRED_DOG_REPLACEMENT_ANONYMOUS = 'retired-dog-replacement';

	public static path(route: string | null = null): string {
		return route ? `/${GuideDogServiceDogRoutes.MODULE_PATH}/${route}` : `/${GuideDogServiceDogRoutes.MODULE_PATH}`;
	}

	public static pathGdsdMainApplications(): string {
		return `/${GuideDogServiceDogRoutes.MODULE_PATH}/${GuideDogServiceDogRoutes.GDSD_AUTHENTICATED_BASE}`;
	}

	public static pathGdsdAuthenticated(route: string | null = null): string {
		return route
			? `/${GuideDogServiceDogRoutes.MODULE_PATH}/${GuideDogServiceDogRoutes.GDSD_AUTHENTICATED_BASE}/${route}`
			: `/${GuideDogServiceDogRoutes.MODULE_PATH}/${GuideDogServiceDogRoutes.GDSD_AUTHENTICATED_BASE}`;
	}

	public static pathGdsdAnonymous(route: string | null = null): string {
		return route
			? `/${GuideDogServiceDogRoutes.MODULE_PATH}/${GuideDogServiceDogRoutes.GDSD_ANONYMOUS_BASE}/${route}`
			: `/${GuideDogServiceDogRoutes.MODULE_PATH}`;
	}
}
