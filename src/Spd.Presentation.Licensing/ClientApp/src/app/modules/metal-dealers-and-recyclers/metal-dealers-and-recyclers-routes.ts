import { AppRoutes } from '@app/app-routes';

export class MetalDealersAndRecyclersRoutes {
	public static readonly MODULE_PATH = AppRoutes.METAL_DEALERS_AND_RECYCLERS;

	public static readonly MDRA_APPLICATION_TYPE = 'mdra-application-type';
	public static readonly MDRA_NEW = 'mdra-new';
	public static readonly MDRA_ACCESS_CODE = 'mdra-access-acode';
	public static readonly MDRA_RENEWAL = 'mdra-renewal';
	public static readonly MDRA_UPDATE = 'mdra-update';
	public static readonly MDRA_REPLACEMENT = 'mdra-replacement';
	public static readonly MDRA_REGISTRATION_RECEIVED = 'mdra-received';

	public static pathMdra(route: string | null = null): string {
		return route
			? `/${MetalDealersAndRecyclersRoutes.MODULE_PATH}/${route}`
			: `/${MetalDealersAndRecyclersRoutes.MODULE_PATH}`;
	}
}
