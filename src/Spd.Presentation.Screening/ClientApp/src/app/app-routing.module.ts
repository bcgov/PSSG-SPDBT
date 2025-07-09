import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './app-routes';
import { LandingComponent } from './landing.component';
import { AccessDeniedComponent } from './shared/components/access-denied.component';
import { LoginFailureComponent } from './shared/components/login-failure.component';

const routes: Routes = [
	{
		path: AppRoutes.LANDING,
		component: LandingComponent,
	},
	{
		path: AppRoutes.ORG_REGISTRATION,
		loadChildren: () =>
			import('./modules/org-registration-portal/org-registration-portal.module').then(
				(m) => m.OrgRegistrationPortalModule,
			),
		data: { title: 'Organization Registration' },
	},
	{
		path: AppRoutes.CRRP_APPLICATION,
		loadChildren: () => import('./modules/crrp-portal/crrp-portal.module').then((m) => m.CrrpPortalModule),
		data: { title: 'Criminal Records Review Program' },
	},
	{
		path: AppRoutes.CRRPA_APPLICATION,
		loadChildren: () => import('./modules/crrpa-portal/crrpa-portal.module').then((m) => m.CrrpaPortalModule),
		data: { title: 'Criminal Record Check Application' },
	},
	{
		path: AppRoutes.PSSO_APPLICATION,
		loadChildren: () => import('./modules/psso-portal/psso-portal.module').then((m) => m.PssoPortalModule),
		data: { title: 'Personnel Security Screening Office' },
	},
	{
		path: AppRoutes.PSSOA_APPLICATION,
		loadChildren: () => import('./modules/pssoa-portal/pssoa-portal.module').then((m) => m.PssoaPortalModule),
		data: { title: 'Personnel Security Screening Office Application' },
	},
	{
		path: AppRoutes.SECURITY_SCREENING_APPLICATION,
		loadChildren: () =>
			import('./modules/security-screening-portal/security-screening-portal.module').then(
				(m) => m.SecurityScreeningPortalModule,
			),
		data: { title: 'Security Screening' },
	},
	{
		path: AppRoutes.ACCESS_DENIED,
		component: AccessDeniedComponent,
	},
	{
		path: AppRoutes.LOGIN_FAILURE,
		component: LoginFailureComponent,
	},
	{
		path: '**',
		redirectTo: AppRoutes.path(AppRoutes.LANDING),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
