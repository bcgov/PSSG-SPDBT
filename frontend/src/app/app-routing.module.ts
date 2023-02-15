import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';

const routes: Routes = [
	{
		path: '',
		component: LandingComponent,
	},
	{
		path: 'org-registration',
		loadChildren: () =>
			import('./modules/org-registration/org-registration.module').then((m) => m.OrgRegistrationModule),
		data: { title: 'Organization Registration' },
	},
	{
		path: 'scr-application',
		loadChildren: () => import('./modules/scr-application/scr-application.module').then((m) => m.ScrApplicationModule),
		data: { title: 'Screening Application' },
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
		data: { title: 'Dashboard' },
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
