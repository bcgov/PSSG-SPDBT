import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './app-routes';
import { LandingComponent } from './landing.component';
import { AccessDeniedComponent } from './shared/components/access-denied.component';

const routes: Routes = [
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
		path: AppRoutes.CONTROLLING_MEMBERS_CRC,
		loadChildren: () =>
			import('./modules/controlling-member-crc/controlling-member-crc.module').then(
				(m) => m.ControllingMemberCrcModule
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
