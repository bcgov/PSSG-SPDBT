import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdentityVerificationComponent } from './components/identity-verification.component';
import { ManualSubmissionComponent } from './components/manual-submission.component';
import { ScreeningChecksComponent } from './components/screening-checks.component';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { PssoComponent } from './psso.component';

export class PssoRoutes {
	public static SCREENING_CHECKS = 'screening-checks';
	public static SCREENING_STATUSES = 'screening-statuses';
	public static IDENTITY_VERIFICATION = 'identity-verification';
	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	public static MODULE_PATH = 'psso';

	public static pssoPath(route: string | null = null): string {
		return route ? `/${PssoRoutes.MODULE_PATH}/${route}` : `/${PssoRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: PssoComponent,
		children: [
			{ path: PssoRoutes.SCREENING_CHECKS, component: ScreeningChecksComponent },
			{ path: PssoRoutes.SCREENING_STATUSES, component: ScreeningStatusesComponent },
			{ path: PssoRoutes.IDENTITY_VERIFICATION, component: IdentityVerificationComponent },
			{ path: PssoRoutes.MANUAL_SUBMISSIONS, component: ManualSubmissionComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PssoRoutingModule {}
