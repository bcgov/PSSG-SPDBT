import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegateAddModalComponent } from './components/delegate-add-modal.component';
import { DelegateManageModalComponent } from './components/delegate-manage-modal.component';
import { IdentityVerificationComponent } from './components/identity-verification.component';
import { ManualSubmissionComponent } from './components/manual-submission.component';
import { PssoHeaderComponent } from './components/psso-header.component';
import { ScreeningChecksComponent } from './components/screening-checks.component';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { TermsTextComponent } from './components/terms-text.component';
import { PssoRoutingModule } from './psso-routing.module';
import { PssoTermsAndCondsComponent } from './psso-terms-and-conds.component';
import { PssoComponent } from './psso.component';

@NgModule({
	declarations: [
		PssoComponent,
		PssoHeaderComponent,
		PssoTermsAndCondsComponent,
		ScreeningStatusesComponent,
		ScreeningChecksComponent,
		IdentityVerificationComponent,
		ManualSubmissionComponent,
		TermsTextComponent,
		DelegateAddModalComponent,
		DelegateManageModalComponent,
	],
	imports: [SharedModule, PssoRoutingModule],
})
export class PssoPortalModule {}
