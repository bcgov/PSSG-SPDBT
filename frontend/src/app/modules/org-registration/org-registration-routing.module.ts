import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgRegistrationComponent } from './org-registration.component';

const routes: Routes = [
	{
		path: '',
		component: OrgRegistrationComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)], //, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class OrgRegistrationRoutingModule {}
