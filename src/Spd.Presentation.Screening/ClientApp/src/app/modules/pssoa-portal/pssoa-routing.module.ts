import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvitationPssoaComponent } from './invitation-pssoa.component';
import { PssoaRoutes } from './pssoa-routes';
import { PssoaComponent } from './pssoa.component';

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
