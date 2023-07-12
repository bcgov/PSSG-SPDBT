import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActiveLicencesComponent } from './components/active-licences.component';
import { ExpiredLicencesComponent } from './components/expired-licences.component';
import { InProgressApplicationsComponent } from './components/in-progress-applications.component';
import { NewLicenceComponent } from './components/new-licence.component';
import { SubmittedApplicationsComponent } from './components/submitted-applications.component';
import { LicenceComponent } from './licence.component';

export class LicenceRoutes {
	public static LICENCE_APPLICATION = 'licence';
	public static IN_PROGRESS_APPLICATIONS = 'in-progress-applications';
	public static SUBMITTED_APPLICATIONS = 'submitted-applications';
	public static NEW_LICENCE = 'new-licence';
	public static ACTIVE_LICENCES = 'active-licences';
	public static EXPIRED_LICENCES = 'expired-licences';

	public static MODULE_PATH = LicenceRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceRoutes.MODULE_PATH}/${route}` : `/${LicenceRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: LicenceComponent,
		children: [
			{ path: LicenceRoutes.IN_PROGRESS_APPLICATIONS, component: InProgressApplicationsComponent },
			{ path: LicenceRoutes.SUBMITTED_APPLICATIONS, component: SubmittedApplicationsComponent },
			{ path: LicenceRoutes.NEW_LICENCE, component: NewLicenceComponent },
			{ path: LicenceRoutes.ACTIVE_LICENCES, component: ActiveLicencesComponent },
			{ path: LicenceRoutes.EXPIRED_LICENCES, component: ExpiredLicencesComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LicenceRoutingModule {}
