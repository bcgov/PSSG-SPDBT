import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { IdentityVerificationComponent } from './components/identity-verification.component';
import { ManualSubmissionComponent } from './components/manual-submission.component';
import { ScreeningChecksComponent } from './components/screening-checks.component';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { PssoRoutingModule } from './psso-routing.module';
import { PssoComponent } from './psso.component';
import { DelegateAddModalComponent } from './components/delegate-add-modal.component';

@NgModule({
	declarations: [
		PssoComponent,
		ScreeningStatusesComponent,
		ScreeningChecksComponent,
		IdentityVerificationComponent,
		ManualSubmissionComponent,
  DelegateAddModalComponent,
	],
	imports: [SharedModule, PssoRoutingModule],
})
export class PssoPortalModule {}
