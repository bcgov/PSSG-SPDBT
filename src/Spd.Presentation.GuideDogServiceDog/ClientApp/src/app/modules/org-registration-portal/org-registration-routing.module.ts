import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgRegistrationRoutes } from './org-registration-routes';
import { OrgRegistrationComponent } from './org-registration.component';
import { RegistrationStatusComponent } from './registration-status.component';

const routes: Routes = [
	{
		path: '',
		component: OrgRegistrationComponent,
	},
	{
		path: `${OrgRegistrationRoutes.INVITATION}/:id`,
		component: RegistrationStatusComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class OrgRegistrationRoutingModule {}
