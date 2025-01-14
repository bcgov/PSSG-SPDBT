export class GuideDogServiceDogRoutes {
	public static readonly GUIDE_DOG_SERVICE_DOG = 'guide-dog-service-dog';

	public static readonly MODULE_PATH = GuideDogServiceDogRoutes.GUIDE_DOG_SERVICE_DOG;

	public static path(route: string | null = null): string {
		return route ? `/${GuideDogServiceDogRoutes.MODULE_PATH}/${route}` : `/${GuideDogServiceDogRoutes.MODULE_PATH}`;
	}
}
