import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { BusinessLicenceApplicationRoutes } from './modules/business-licence-application/business-licence-application-routing.module';
import { PersonalLicenceApplicationRoutes } from './modules/personal-licence-application/personal-licence-application-routing.module';
import { AccessDeniedComponent } from './shared/components/access-denied.component';

export class AppRoutes {
	public static readonly PERSONAL_LICENCE_APPLICATION = PersonalLicenceApplicationRoutes.MODULE_PATH;
	public static readonly BUSINESS_LICENCE_APPLICATION = BusinessLicenceApplicationRoutes.MODULE_PATH;
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
		path: AppRoutes.PERSONAL_LICENCE_APPLICATION,
		loadChildren: () =>
			import('./modules/personal-licence-application/personal-licence-application.module').then(
				(m) => m.PersonalLicenceApplicationModule
			),
	},
	{
		path: AppRoutes.BUSINESS_LICENCE_APPLICATION,
		loadChildren: () =>
			import('./modules/business-licence-application/business-licence-application.module').then(
				(m) => m.BusinessLicenceApplicationModule
			),
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
