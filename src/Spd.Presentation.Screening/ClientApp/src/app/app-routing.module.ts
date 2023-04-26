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
		path: 'crc-application',
		loadChildren: () => import('./modules/crc-application/crc-application.module').then((m) => m.CrcApplicationModule),
		data: { title: 'Criminal Record Check Application' },
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
