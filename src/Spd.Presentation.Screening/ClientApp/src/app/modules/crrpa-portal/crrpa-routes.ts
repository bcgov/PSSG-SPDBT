export class CrrpaRoutes {
	public static CRRPA = 'crrpa';
	public static INVITATION = 'invitation';
	public static ORG_ACCESS = 'org-access';
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_ERROR = 'payment-error';

	public static MODULE_PATH = CrrpaRoutes.CRRPA;

	public static path(route: string | null = null): string {
		return route ? `/${CrrpaRoutes.MODULE_PATH}/${route}` : `/${CrrpaRoutes.MODULE_PATH}`;
	}
}
