import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrrpTermsAndCondsComponent } from './crrp-terms-and-conds.component';
import { ApplicationStatusesComponent } from './components/application-statuses.component';
import { CriminalRecordChecksComponent } from './components/criminal-record-checks.component';
import { CrrpHeaderComponent } from './components/crrp-header.component';
import { CrrpHomeComponent } from './components/crrp-home.component';
import { CrrpPaymentErrorComponent } from './components/crrp-payment-error.component';
import { CrrpPaymentFailComponent } from './components/crrp-payment-fail.component';
import { CrrpPaymentManualComponent } from './components/crrp-payment-manual.component';
import { CrrpPaymentSuccessComponent } from './components/crrp-payment-success.component';
import { ExpiringChecksComponent } from './components/expiring-checks.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { IdentifyVerificationComponent } from './components/identify-verification.component';
import { ManualSubmissionComponent } from './components/manual-submission.component';
import { OrganizationProfileComponent } from './components/organization-profile.component';
import { PaymentFilterComponent } from './components/payment-filter.component';
import { PaymentsComponent } from './components/payments.component';
import { ReportsComponent } from './components/reports.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions.component';
import { TermsTextComponent } from './components/terms-text.component';
import { UserEditModalComponent } from './components/user-edit-modal.component';
import { UsersComponent } from './components/users.component';
import { CrrpFirstTimeTermsAndCondsComponent } from './crrp-first-time-terms-and-conds.component';
import { CrrpRoutingModule } from './crrp-routing.module';
import { CrrpComponent } from './crrp.component';
import { InvitationLinkOrganizationComponent } from './invitation-link-organization.component';
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
		InvitationLinkOrganizationComponent,
		CrrpPaymentFailComponent,
		CrrpPaymentSuccessComponent,
		CrrpPaymentManualComponent,
		CrrpPaymentErrorComponent,
		CrrpFirstTimeTermsAndCondsComponent,
		CrrpTermsAndCondsComponent,
		TermsAndConditionsComponent,
		TermsTextComponent,
	],
	imports: [SharedModule, CrrpRoutingModule],
})
export class CrrpPortalModule {}
