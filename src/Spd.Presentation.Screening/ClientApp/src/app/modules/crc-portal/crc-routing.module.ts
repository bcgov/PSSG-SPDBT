import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcComponent } from './crc.component';
import { InvitationComponent } from './invitation.component';

export class CrcRoutes {
	public static CRCA = 'crca';
	public static INVITATION = 'invitation';

	public static MODULE_PATH = CrcRoutes.CRCA;

	public static path(route: string | null = null): string {
		return route ? `/${CrcRoutes.MODULE_PATH}/${route}` : `/${CrcRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: CrcComponent,
	},
	{
		path: 'invitation/:id',
		component: InvitationComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)], //, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class CrcApplicationRoutingModule {}
