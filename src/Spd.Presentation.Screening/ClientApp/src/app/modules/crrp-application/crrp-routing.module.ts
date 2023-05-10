import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationStatusesComponent } from './components/application-statuses.component';
import { CriminalRecordChecksComponent } from './components/criminal-record-checks.component';
import { CrrpHomeComponent } from './components/crrp-home.component';
import { ExpiringChecksComponent } from './components/expiring-checks.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { IdentifyVerificationComponent } from './components/identify-verification.component';
import { ManualSubmissionsComponent } from './components/manual-submissions.component';
import { OrganizationProfileComponent } from './components/organization-profile.component';
import { PaymentsComponent } from './components/payments.component';
import { ReportsComponent } from './components/reports.component';
import { UsersComponent } from './components/users.component';
import { CrrpComponent } from './crrp.component';

export class CrrpRoutes {
	public static DASHBOARD = 'crrp-application';
	public static HOME = 'home';
	public static CRIMINAL_RECORD_CHECKS = 'criminal-record-checks';
	public static APPLICATION_STATUSES = 'application-statuses';
	public static EXPIRING_CHECKS = 'expiring-checks';
	public static GENERIC_UPLOADS = 'generic-uploads';
	public static IDENTITY_VERIFICATION = 'identity-verification';
	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	public static ORGANIZATION_PROFILE = 'organization-profile';
	public static PAYMENTS = 'payments';
	public static REPORTS = 'reports';
	public static USERS = 'users';

	public static MODULE_PATH = CrrpRoutes.DASHBOARD;

	public static crrpPath(route: string): string {
		return `/${CrrpRoutes.MODULE_PATH}/${route}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: CrrpComponent,
		children: [
			{ path: 'home', component: CrrpHomeComponent },
			{ path: 'criminal-record-checks', component: CriminalRecordChecksComponent },
			{ path: 'application-statuses', component: ApplicationStatusesComponent },
			{ path: 'expiring-checks', component: ExpiringChecksComponent },
			{ path: 'generic-uploads', component: GenericUploadsComponent },
			{ path: 'identity-verification', component: IdentifyVerificationComponent },
			{ path: 'payments', component: PaymentsComponent },
			{ path: 'manual-submissions', component: ManualSubmissionsComponent },
			{ path: 'organization-profile', component: OrganizationProfileComponent },
			{ path: 'reports', component: ReportsComponent },
			{ path: 'users', component: UsersComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CrrpRoutingModule {}
