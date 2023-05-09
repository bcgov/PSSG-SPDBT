import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PssoComponent } from './psso.component';

export class PssoRoutes {
	// 	public static DASHBOARD = 'dashboard';
	// 	public static HOME = 'home';
	// 	public static CRIMINAL_RECORD_CHECKS = 'criminal-record-checks';
	// 	public static APPLICATION_STATUSES = 'application-statuses';
	// 	public static EXPIRING_CHECKS = 'expiring-checks';
	// 	public static GENERIC_UPLOADS = 'generic-uploads';
	// 	public static IDENTITY_VERIFICATION = 'identity-verification';
	// 	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	// 	public static ORGANIZATION_PROFILE = 'organization-profile';
	// 	public static PAYMENTS = 'payments';
	// 	public static REPORTS = 'reports';
	// 	public static USERS = 'users';
	// 	public static MODULE_PATH = PssoRoutes.DASHBOARD;
	// 	public static crrpPath(route: string): string {
	// 		return `/${PssoRoutes.MODULE_PATH}/${route}`;
	// 	}
}

const routes: Routes = [
	{
		path: '',
		component: PssoComponent,
		// children: [
		// 	{ path: 'home', component: PssoHomeComponent },
		// ],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PssoRoutingModule {}
