import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { ExpiringScreeningsComponent } from './components/expiring-screenings.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { IdentifyVerificationComponent } from './components/identify-verification.component';
import { ManualSubmissionsComponent } from './components/manual-submissions.component';
import { NewScreeningComponent } from './components/new-screening.component';
import { PaymentsComponent } from './components/payments.component';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { SettingsComponent } from './components/settings.component';
import { UsersComponent } from './components/users.component';
import { DashboardComponent } from './dashboard.component';

export class DashboardRoutes {
	public static DASHBOARD = 'dashboard';
	public static HOME = 'home';
	public static NEW_SCREENING = 'new-screening';
	public static SCREENING_STATUSES = 'screening-statuses';
	public static EXPIRING_SCREENING = 'expiring-screening';
	public static GENERIC_UPLOADS = 'generic-uploads';
	public static IDENTITY_VERIFICATION = 'identity-verification';
	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	public static PAYMENTS = 'payments';
	public static SETTINGS = 'settings';
	public static USERS = 'users';

	public static MODULE_PATH = DashboardRoutes.DASHBOARD;

	public static dashboardPath(route: string): string {
		return `/${DashboardRoutes.MODULE_PATH}/${route}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{ path: 'home', component: DashboardHomeComponent },
			{ path: 'new-screening', component: NewScreeningComponent },
			{ path: 'screening-statuses', component: ScreeningStatusesComponent },
			{ path: 'expiring-screening', component: ExpiringScreeningsComponent },
			{ path: 'generic-uploads', component: GenericUploadsComponent },
			{ path: 'identity-verification', component: IdentifyVerificationComponent },
			{ path: 'payments', component: PaymentsComponent },
			{ path: 'manual-submissions', component: ManualSubmissionsComponent },
			{ path: 'settings', component: SettingsComponent },
			{ path: 'users', component: UsersComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
