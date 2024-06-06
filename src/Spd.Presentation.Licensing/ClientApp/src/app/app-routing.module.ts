import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenceApplicationRoutes } from '@app/modules/licence-application/licence-application-routing.module';
import { LandingComponent } from './landing.component';
import { AccessDeniedComponent } from './shared/components/access-denied.component';

export class AppRoutes {
	public static readonly LICENCE_APPLICATION = LicenceApplicationRoutes.MODULE_PATH;
	public static readonly LANDING = '';
	public static readonly ACCESS_DENIED = 'access-denied';
	public static readonly INVITATION_DENIED = 'invitation-denied';

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
		path: AppRoutes.LICENCE_APPLICATION,
		loadChildren: () =>
			import('./modules/licence-application/licence-application.module').then((m) => m.LicenceApplicationModule),
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
