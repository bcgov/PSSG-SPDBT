import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { PssoComponent } from './psso.component';

export class PssoRoutes {
	public static PSSO = 'psso-application';
	// 	public static HOME = 'home';
	// 	public static CRIMINAL_RECORD_CHECKS = 'criminal-record-checks';
	public static SCREENING_STATUSES = 'screening-statuses';
	// 	public static EXPIRING_CHECKS = 'expiring-checks';
	// 	public static GENERIC_UPLOADS = 'generic-uploads';
	// 	public static IDENTITY_VERIFICATION = 'identity-verification';
	// 	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	// 	public static ORGANIZATION_PROFILE = 'organization-profile';
	// 	public static PAYMENTS = 'payments';
	// 	public static REPORTS = 'reports';
	// 	public static USERS = 'users';
	public static MODULE_PATH = PssoRoutes.PSSO;
	public static pssoPath(route: string): string {
		return `/${PssoRoutes.MODULE_PATH}/${route}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: PssoComponent,
		children: [{ path: 'screening-statuses', component: ScreeningStatusesComponent }],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PssoRoutingModule {}
