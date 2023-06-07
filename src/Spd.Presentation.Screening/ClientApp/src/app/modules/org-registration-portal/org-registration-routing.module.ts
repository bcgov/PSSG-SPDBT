import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgRegistrationComponent } from './org-registration.component';
import { RegistrationStatusComponent } from './registration-status.component';

export class OrgRegistrationRoutes {
	public static ORG_REGISTRATION = 'org-registration';
	public static MODULE_PATH = OrgRegistrationRoutes.ORG_REGISTRATION;

	public static path(route: string | null = null): string {
		return route ? `/${OrgRegistrationRoutes.MODULE_PATH}/${route}` : `/${OrgRegistrationRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: OrgRegistrationComponent,
	},
	{
		path: 'registration/:id',
		component: RegistrationStatusComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OrgRegistrationRoutingModule {}
