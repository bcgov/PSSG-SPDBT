export class SecurityScreeningRoutes {
	public static SECURITY_SCREENING_APPLICATION = 'security-screening';
	public static CRC_LIST = 'crc-list';
	public static CRC_DETAIL = 'crc-detail';
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_MANUAL = 'payment-manual';
	public static PAYMENT_ERROR = 'payment-error';

	public static MODULE_PATH = SecurityScreeningRoutes.SECURITY_SCREENING_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${SecurityScreeningRoutes.MODULE_PATH}/${route}` : `/${SecurityScreeningRoutes.MODULE_PATH}`;
	}
}
