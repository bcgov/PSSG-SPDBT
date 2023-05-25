import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { PssoComponent } from './psso.component';

export class PssoRoutes {
	public static SCREENING_CHECKS = 'screening-checks';
	public static SCREENING_STATUSES = 'screening-statuses';
	public static IDENTITY_VERIFICATION = 'identity-verification';
	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	public static MODULE_PATH = 'psso';

	public static pssoPath(route: string): string {
		return `/${PssoRoutes.MODULE_PATH}/${route}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: PssoComponent,
		children: [
			{ path: PssoRoutes.SCREENING_CHECKS, component: ScreeningStatusesComponent },
			{ path: PssoRoutes.SCREENING_STATUSES, component: ScreeningStatusesComponent },
			{ path: PssoRoutes.IDENTITY_VERIFICATION, component: ScreeningStatusesComponent },
			{ path: PssoRoutes.MANUAL_SUBMISSIONS, component: ScreeningStatusesComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PssoRoutingModule {}
