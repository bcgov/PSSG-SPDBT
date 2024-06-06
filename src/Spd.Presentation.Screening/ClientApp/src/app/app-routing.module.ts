import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing.component';
import { CrrpRoutes } from './modules/crrp-portal/crrp-routing.module';
import { CrrpaRoutes } from './modules/crrpa-portal/crrpa-routing.module';
import { OrgRegistrationRoutes } from './modules/org-registration-portal/org-registration-routing.module';
import { PssoRoutes } from './modules/psso-portal/psso-routing.module';
import { PssoaRoutes } from './modules/pssoa-portal/pssoa-routing.module';
import { SecurityScreeningRoutes } from './modules/security-screening-portal/security-screening-routing.module';
import { AccessDeniedComponent } from './shared/components/access-denied.component';
import { LoginFailureComponent } from './shared/components/login-failure.component';

export class AppRoutes {
	public static ORG_REGISTRATION = OrgRegistrationRoutes.MODULE_PATH;
	public static CRRP_APPLICATION = CrrpRoutes.MODULE_PATH;
	public static CRRPA_APPLICATION = CrrpaRoutes.MODULE_PATH;
	public static PSSO_APPLICATION = PssoRoutes.MODULE_PATH;
	public static PSSOA_APPLICATION = PssoaRoutes.MODULE_PATH;
	public static SECURITY_SCREENING_APPLICATION = SecurityScreeningRoutes.MODULE_PATH;
	public static LANDING = '';
	public static ACCESS_DENIED = 'access-denied';
	public static LOGIN_FAILURE = 'login-failure';
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
		path: AppRoutes.ORG_REGISTRATION,
		loadChildren: () =>
			import('./modules/org-registration-portal/org-registration-portal.module').then(
				(m) => m.OrgRegistrationPortalModule
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
				(m) => m.SecurityScreeningPortalModule
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
		component: LandingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
