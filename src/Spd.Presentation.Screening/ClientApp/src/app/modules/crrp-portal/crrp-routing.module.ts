import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationStatusesComponent } from './components/application-statuses.component';
import { CriminalRecordChecksComponent } from './components/criminal-record-checks.component';
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
import { PaymentsComponent } from './components/payments.component';
import { ReportsComponent } from './components/reports.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions.component';
import { UsersComponent } from './components/users.component';
import { CrrpFirstTimeTermsAndCondsComponent } from './crrp-first-time-terms-and-conds.component';
import { CrrpComponent } from './crrp.component';
import { InvitationLinkOrganizationComponent } from './invitation-link-organization.component';
import { InvitationUserComponent } from './invitation-user.component';

export class CrrpRoutes {
	public static HOME = 'home';
	public static CRIMINAL_RECORD_CHECKS = 'criminal-record-checks';
	public static APPLICATION_STATUSES = 'application-statuses';
	public static EXPIRING_CHECKS = 'expiring-checks';
	public static GENERIC_UPLOADS = 'generic-uploads';
	public static IDENTITY_VERIFICATION = 'identity-verification';
	public static MANUAL_SUBMISSIONS = 'manual-submissions';
	public static ORGANIZATION_PROFILE = 'organization-profile';
	public static TERMS_AND_CONDITIONS = 'terms-and-conditions';
	public static PAYMENTS = 'payments';
	public static PAYMENT_SUCCESS = 'payment-success';
	public static PAYMENT_FAIL = 'payment-fail';
	public static PAYMENT_MANUAL = 'payment-manual';
	public static PAYMENT_ERROR = 'payment-error';
	public static INVITATION = 'invitation';
	public static INVITATION_LINK_ORG = 'invitation-link-bceid';
	public static INVITATION_ACCEPT = 'invitation-accept';
	public static REPORTS = 'reports';
	public static USERS = 'users';
	public static ORG_TERMS_AND_CONDITIONS = 'org-terms-and-conditions';

	public static MODULE_PATH = 'crrp';

	public static path(route: string | null = null): string {
		return route ? `/${CrrpRoutes.MODULE_PATH}/${route}` : `/${CrrpRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: CrrpComponent,
		children: [
			{ path: CrrpRoutes.HOME, component: CrrpHomeComponent },
			{ path: CrrpRoutes.CRIMINAL_RECORD_CHECKS, component: CriminalRecordChecksComponent },
			{ path: CrrpRoutes.APPLICATION_STATUSES, component: ApplicationStatusesComponent },
			{ path: CrrpRoutes.EXPIRING_CHECKS, component: ExpiringChecksComponent },
			{ path: CrrpRoutes.GENERIC_UPLOADS, component: GenericUploadsComponent },
			{ path: CrrpRoutes.IDENTITY_VERIFICATION, component: IdentifyVerificationComponent },
			{ path: CrrpRoutes.PAYMENTS, component: PaymentsComponent },
			{ path: `${CrrpRoutes.PAYMENT_SUCCESS}/:id`, component: CrrpPaymentSuccessComponent },
			{ path: `${CrrpRoutes.PAYMENT_FAIL}/:id`, component: CrrpPaymentFailComponent },
			{ path: CrrpRoutes.PAYMENT_MANUAL, component: CrrpPaymentManualComponent },
			{ path: CrrpRoutes.PAYMENT_ERROR, component: CrrpPaymentErrorComponent },
			{ path: CrrpRoutes.MANUAL_SUBMISSIONS, component: ManualSubmissionComponent },
			{ path: CrrpRoutes.ORGANIZATION_PROFILE, component: OrganizationProfileComponent },
			{ path: CrrpRoutes.TERMS_AND_CONDITIONS, component: TermsAndConditionsComponent },
			{ path: CrrpRoutes.REPORTS, component: ReportsComponent },
			{ path: CrrpRoutes.USERS, component: UsersComponent },
			{ path: CrrpRoutes.ORG_TERMS_AND_CONDITIONS, component: CrrpFirstTimeTermsAndCondsComponent },
			{ path: '', redirectTo: CrrpRoutes.path(CrrpRoutes.HOME), pathMatch: 'full' },
		],
	},
	{
		path: `${CrrpRoutes.INVITATION}/:id`,
		component: InvitationUserComponent,
	},
	{
		path: `${CrrpRoutes.INVITATION_LINK_ORG}/:id`,
		component: InvitationLinkOrganizationComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CrrpRoutingModule {}
