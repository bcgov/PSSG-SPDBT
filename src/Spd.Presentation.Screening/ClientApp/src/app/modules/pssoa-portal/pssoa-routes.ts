export class PssoaRoutes {
	public static PSSOA = 'pssoa';
	public static INVITATION = 'invitation';

	public static MODULE_PATH = PssoaRoutes.PSSOA;

	public static path(route: string | null = null): string {
		return route ? `/${PssoaRoutes.MODULE_PATH}/${route}` : `/${PssoaRoutes.MODULE_PATH}`;
	}
}
