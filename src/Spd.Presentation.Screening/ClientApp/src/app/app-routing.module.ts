import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { AccessDeniedComponent } from './shared/components/access-denied.component';

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
		path: 'crrp-application',
		loadChildren: () =>
			import('./modules/crrp-application/crrp-application.module').then((m) => m.CrrpApplicationModule),
		data: { title: 'Criminal Records Review Program' },
		// canActivate: [AuthGuard],
	},
	{
		path: 'psso-application',
		loadChildren: () =>
			import('./modules/psso-application/psso-application.module').then((m) => m.PssoApplicationModule),
		data: { title: 'Personnel Security Screening Office' },
	},
	{
		path: 'access-denied',
		component: AccessDeniedComponent,
	},
	{
		path: '**',
		component: LandingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
