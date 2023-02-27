import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { PaymentsComponent } from './components/payments.component';
import { UsersComponent } from './components/users.component';
import { DashboardComponent } from './dashboard.component';

export class DashboardRoutes {
	public static DASHBOARD = 'dashboard';
	public static HOME = 'home';
	public static GENERIC_UPLOADS = 'generic-uploads';
	public static PAYMENTS = 'payments';
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
			{ path: 'generic-uploads', component: GenericUploadsComponent },
			{ path: 'payments', component: PaymentsComponent },
			{ path: 'users', component: UsersComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
