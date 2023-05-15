import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgRegistrationComponent } from './org-registration.component';

export class OrgRegistrationRoutes {
	public static ORG_REGISTRATION = 'org-registration';
	public static MODULE_PATH = OrgRegistrationRoutes.ORG_REGISTRATION;

	public static orgRegPath(route: string): string {
		return `/${route}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: OrgRegistrationComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OrgRegistrationRoutingModule {}
