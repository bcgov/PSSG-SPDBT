import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizedUsersComponent } from './components/authorized-users.component';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { OutstandingPaymentsComponent } from './components/outstanding-payments.component';
import { DashboardComponent } from './dashboard.component';

export class DashboardRoutes {
	public static DASHBOARD = 'dashboard';
	public static HOME = 'home';
	public static GENERIC_UPLOADS = 'generic-uploads';
	public static OUTSTANDING_PAYMENTS = 'outstanding-payments';
	public static AUTHORIZED_USERS = 'authorized-users';

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
			{ path: 'generic-uploads', component: GenericUploadsComponent },
			{ path: 'outstanding-payments', component: OutstandingPaymentsComponent },
			{ path: 'authorized-users', component: AuthorizedUsersComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
