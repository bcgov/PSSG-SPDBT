export class MetalDealersAndRecyclersRoutes {
	public static readonly METAL_DEALERS_AND_RECYCLERS = 'metal-dealers-and-recyclers';

	public static readonly MODULE_PATH = MetalDealersAndRecyclersRoutes.METAL_DEALERS_AND_RECYCLERS;
	public static readonly METAL_DEALERS_AND_RECYCLERS_REGISTER = 'register';
	public static readonly METAL_DEALERS_AND_RECYCLERS_REGISTRATION_RECEIVED = 'received';

	public static path(route: string | null = null): string {
		return route
			? `/${MetalDealersAndRecyclersRoutes.MODULE_PATH}/${route}`
			: `/${MetalDealersAndRecyclersRoutes.MODULE_PATH}`;
	}
}
