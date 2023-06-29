import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicationStatusesComponent } from './components/application-statuses.component';
import { CriminalRecordChecksComponent } from './components/criminal-record-checks.component';
import { CrrpHeaderComponent } from './components/crrp-header.component';
import { CrrpHomeComponent } from './components/crrp-home.component';
import { ExpiringChecksComponent } from './components/expiring-checks.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { IdentifyVerificationComponent } from './components/identify-verification.component';
import { ManualSubmissionComponent } from './components/manual-submission.component';
import { OrganizationProfileComponent } from './components/organization-profile.component';
import { PaymentFilterComponent } from './components/payment-filter.component';
import { PaymentsComponent } from './components/payments.component';
import { ReportsComponent } from './components/reports.component';
import { UserEditModalComponent } from './components/user-edit-modal.component';
import { UsersComponent } from './components/users.component';
import { CrrpRoutingModule } from './crrp-routing.module';
import { CrrpComponent } from './crrp.component';
import { InvitationUserComponent } from './invitation-user.component';

@NgModule({
	declarations: [
		CrrpComponent,
		GenericUploadsComponent,
		CrrpHeaderComponent,
		CrrpHomeComponent,
		ApplicationStatusesComponent,
		PaymentsComponent,
		PaymentFilterComponent,
		UsersComponent,
		UserEditModalComponent,
		OrganizationProfileComponent,
		CriminalRecordChecksComponent,
		IdentifyVerificationComponent,
		ExpiringChecksComponent,
		ManualSubmissionComponent,
		ReportsComponent,
		InvitationUserComponent,
	],
	imports: [SharedModule, CrrpRoutingModule],
})
export class CrrpPortalModule {}
