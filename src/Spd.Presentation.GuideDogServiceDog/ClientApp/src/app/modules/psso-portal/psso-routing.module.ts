import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdentityVerificationComponent } from './components/identity-verification.component';
import { ManualSubmissionComponent } from './components/manual-submission.component';
import { ScreeningChecksComponent } from './components/screening-checks.component';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { PssoRoutes } from './psso-routes';
import { PssoTermsAndCondsComponent } from './psso-terms-and-conds.component';
import { PssoComponent } from './psso.component';

const routes: Routes = [
	{
		path: '',
		component: PssoComponent,
		children: [
			{ path: PssoRoutes.SCREENING_CHECKS, component: ScreeningChecksComponent },
			{ path: PssoRoutes.SCREENING_STATUSES, component: ScreeningStatusesComponent },
			{ path: PssoRoutes.IDENTITY_VERIFICATION, component: IdentityVerificationComponent },
			{ path: PssoRoutes.MANUAL_SUBMISSIONS, component: ManualSubmissionComponent },
			{ path: '', redirectTo: PssoRoutes.path(PssoRoutes.SCREENING_STATUSES), pathMatch: 'full' },
		],
	},
	{
		path: PssoRoutes.ORG_TERMS_AND_CONDITIONS,
		component: PssoTermsAndCondsComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PssoRoutingModule {}
