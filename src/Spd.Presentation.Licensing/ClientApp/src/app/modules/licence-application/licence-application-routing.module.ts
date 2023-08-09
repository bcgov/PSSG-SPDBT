import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LicenceApplicationComponent } from './licence-application.component';

export class LicenceApplicationRoutes {
	public static LICENCE_APPLICATION = 'licence-application';

	public static MODULE_PATH = LicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceApplicationRoutes.MODULE_PATH}/${route}` : `/${LicenceApplicationRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	// {
	// 	path: '',
	// 	component: LicenceComponent,
	// 	children: [
	// 		{ path: LicenceRoutes.IN_PROGRESS_APPLICATIONS, component: InProgressApplicationsComponent },
	// 		{ path: LicenceRoutes.SUBMITTED_APPLICATIONS, component: SubmittedApplicationsComponent },
	// 		{ path: LicenceRoutes.NEW_LICENCE, component: NewLicenceComponent },
	// 		{ path: LicenceRoutes.ACTIVE_LICENCES, component: ActiveLicencesComponent },
	// 		{ path: LicenceRoutes.EXPIRED_LICENCES, component: ExpiredLicencesComponent },
	// 	],
	// },
	{
		path: '',
		component: LicenceApplicationComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LicenceApplicationRoutingModule {}
