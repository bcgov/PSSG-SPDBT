import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvitationPssoaComponent } from './invitation-pssoa.component';
import { PssoaComponent } from './pssoa.component';

export class PssoaRoutes {
	public static PSSOA = 'pssoa';
	public static INVITATION = 'invitation';

	public static MODULE_PATH = PssoaRoutes.PSSOA;

	public static path(route: string | null = null): string {
		return route ? `/${PssoaRoutes.MODULE_PATH}/${route}` : `/${PssoaRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: PssoaComponent,
	},
	{
		path: `${PssoaRoutes.INVITATION}/:id`,
		component: InvitationPssoaComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PssoaRoutingModule {}
