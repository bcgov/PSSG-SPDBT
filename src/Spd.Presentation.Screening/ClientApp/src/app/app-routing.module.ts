import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { CrcApplicationRoutes } from './modules/crc-application/crc-application-routing.module';
import { CrrpRoutes } from './modules/crrp-application/crrp-routing.module';
import { OrgRegistrationRoutes } from './modules/org-registration/org-registration-routing.module';
import { PssoRoutes } from './modules/psso-application/psso-routing.module';
import { AccessDeniedComponent } from './shared/components/access-denied.component';

export class AppRoutes {
	public static ORG_REGISTRATION = OrgRegistrationRoutes.MODULE_PATH;
	public static CRC_APPLICATION = CrcApplicationRoutes.MODULE_PATH;
	public static CRRP_APPLICATION = CrrpRoutes.MODULE_PATH;
	public static PSSO_APPLICATION = PssoRoutes.MODULE_PATH;
	public static ACCESS_DENIED = 'access-denied';
	public static INVITATION_DENIED = 'invitation-denied';
}

const routes: Routes = [
	{
		path: '',
		component: LandingComponent,
	},
	{
		path: AppRoutes.ORG_REGISTRATION,
		loadChildren: () =>
			import('./modules/org-registration/org-registration.module').then((m) => m.OrgRegistrationModule),
		data: { title: 'Organization Registration' },
	},
	{
		path: AppRoutes.CRC_APPLICATION,
		loadChildren: () => import('./modules/crc-application/crc-application.module').then((m) => m.CrcApplicationModule),
		data: { title: 'Criminal Record Check Application' },
	},
	{
		path: AppRoutes.CRRP_APPLICATION,
		loadChildren: () =>
			import('./modules/crrp-application/crrp-application.module').then((m) => m.CrrpApplicationModule),
		data: { title: 'Criminal Records Review Program' },
	},
	{
		path: AppRoutes.PSSO_APPLICATION,
		loadChildren: () =>
			import('./modules/psso-application/psso-application.module').then((m) => m.PssoApplicationModule),
		data: { title: 'Personnel Security Screening Office' },
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
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
