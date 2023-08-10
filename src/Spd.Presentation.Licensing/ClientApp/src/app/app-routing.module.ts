import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { LicenceApplicationRoutes } from './modules/licence-application/licence-application-routing.module';
import { LicenceRoutes } from './modules/licence-portal/licence-routing.module';
import { AccessDeniedComponent } from './shared/components/access-denied.component';

export class AppRoutes {
	public static LICENCE_PORTAL = LicenceRoutes.MODULE_PATH;
	public static LICENCE_APPLICATION = LicenceApplicationRoutes.MODULE_PATH;
	public static LANDING = '';
	public static ACCESS_DENIED = 'access-denied';
	public static INVITATION_DENIED = 'invitation-denied';

	public static path(route: string): string {
		return `/${route}`;
	}
}

const routes: Routes = [
	{
		path: AppRoutes.LANDING,
		component: LandingComponent,
	},
	{
		path: AppRoutes.LICENCE_PORTAL,
		loadChildren: () => import('./modules/licence-portal/licence-portal.module').then((m) => m.LicencePortalModule),
		data: { title: 'Licence Portal' },
	},
	{
		path: AppRoutes.LICENCE_APPLICATION,
		loadChildren: () =>
			import('./modules/licence-application/licence-application.module').then((m) => m.LicenceApplicationModule),
		data: { title: 'Licence Application' },
	},
	{
		path: AppRoutes.ACCESS_DENIED,
		component: AccessDeniedComponent,
	},
	{
		path: '**',
		component: LandingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
