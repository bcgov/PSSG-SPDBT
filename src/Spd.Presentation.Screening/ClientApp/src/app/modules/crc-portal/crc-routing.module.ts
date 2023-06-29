import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrcComponent } from './crc.component';
import { InvitationCrcComponent } from './invitation-crc.component';
import { OrgAccessComponent } from './org-access.component';

export class CrcRoutes {
	public static CRCA = 'crca';
	public static INVITATION = 'invitation';
	public static ORG_ACCESS = 'org-access';

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
		component: InvitationCrcComponent,
	},
	{
		path: CrcRoutes.ORG_ACCESS,
		component: OrgAccessComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)], //, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class CrcApplicationRoutingModule {}
