import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitApplicationBaseAnonymousComponent } from './components/anonymous/permit-application-base-anonymous.component';
import { PermitWizardAnonymousNewComponent } from './components/anonymous/permit-wizard-anonymous-new.component';
import { PermitWizardAnonymousRenewalComponent } from './components/anonymous/permit-wizard-anonymous-renewal.component';
import { PermitWizardAnonymousUpdateComponent } from './components/anonymous/permit-wizard-anonymous-update.component';
import { StepPermitAccessCodeComponent } from './components/anonymous/permit-wizard-steps/step-permit-access-code.component';
import { StepPermitTypeAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-type-anonymous.component';
import { WorkerLicenceApplicationBaseAnonymousComponent } from './components/anonymous/worker-licence-application-base-anonymous.component';
import { WorkerLicenceWizardAnonymousNewComponent } from './components/anonymous/worker-licence-wizard-anonymous-new.component';
import { WorkerLicenceWizardAnonymousRenewalComponent } from './components/anonymous/worker-licence-wizard-anonymous-renewal.component';
import { WorkerLicenceWizardAnonymousReplacementComponent } from './components/anonymous/worker-licence-wizard-anonymous-replacement.component';
import { WorkerLicenceWizardAnonymousUpdateComponent } from './components/anonymous/worker-licence-wizard-anonymous-update.component';
import { StepWorkerLicenceAccessCodeComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-access-code.component';
import { StepWorkerLicenceApplicationTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-application-type-anonymous.component';
import { LicenceAccessCodeAuthorizedComponent } from './components/authenticated/licence-access-code-authorized.component';
import { LicenceApplicationBaseAuthenticatedComponent } from './components/authenticated/licence-application-base-authenticated.component';
import { LicenceFirstTimeUserSelectionComponent } from './components/authenticated/licence-first-time-user-selection.component';
import { LicenceFirstTimeUserTermsOfUseComponent } from './components/authenticated/licence-first-time-user-terms-of-use.component';
import { LicenceUserApplicationsComponent } from './components/authenticated/licence-user-applications.component';
import { LoginUserProfileComponent } from './components/authenticated/login-user-profile.component';
import { PermitWizardAuthenticatedNewComponent } from './components/authenticated/permit-wizard-authenticated-new.component';
import { PermitWizardAuthenticatedRenewalComponent } from './components/authenticated/permit-wizard-authenticated-renewal.component';
import { PermitWizardAuthenticatedUpdateComponent } from './components/authenticated/permit-wizard-authenticated-update.component';
import { StepPermitUpdateTermsAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/step-permit-update-terms-authenticated.component';
import { StepPermitUserProfileComponent } from './components/authenticated/permit-wizard-steps/step-permit-user-profile.component';
import { WorkerLicenceWizardAuthenticatedNewComponent } from './components/authenticated/worker-licence-wizard-authenticated-new.component';
import { WorkerLicenceWizardAuthenticatedRenewalComponent } from './components/authenticated/worker-licence-wizard-authenticated-renewal.component';
import { WorkerLicenceWizardAuthenticatedReplacementComponent } from './components/authenticated/worker-licence-wizard-authenticated-replacement.component';
import { WorkerLicenceWizardAuthenticatedUpdateComponent } from './components/authenticated/worker-licence-wizard-authenticated-update.component';
import { StepWorkerLicenceUpdateTermsAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-update-terms-authenticated.component';
import { BusinessControllingMembersAndEmployeesComponent } from './components/business/business-controlling-members-and-employees.component';
import { BusinessFirstTimeUserTermsOfUseComponent } from './components/business/business-first-time-user-terms-of-use.component';
import { BusinessLicenceApplicationBaseComponent } from './components/business/business-licence-application-base.component';
import { BusinessLicenceUpdateReceivedSuccessComponent } from './components/business/business-licence-update-received-success.component';
import { BusinessLicenceWizardNewComponent } from './components/business/business-licence-wizard-new.component';
import { BusinessLicenceWizardRenewalComponent } from './components/business/business-licence-wizard-renewal.component';
import { BusinessLicenceWizardReplacementComponent } from './components/business/business-licence-wizard-replacement.component';
import { BusinessLicenceWizardUpdateComponent } from './components/business/business-licence-wizard-update.component';
import { BusinessManagersComponent } from './components/business/business-managers.component';
import { BusinessProfileComponent } from './components/business/business-profile.component';
import { BusinessUserApplicationsComponent } from './components/business/business-user-applications.component';
import { StepBusinessLicenceProfileComponent } from './components/business/step-business-licence-profile.component';
import { BusinessLicencePaymentCancelComponent } from './components/shared/business-licence-payment-cancel.component';
import { BusinessLicencePaymentErrorComponent } from './components/shared/business-licence-payment-error.component';
import { BusinessLicencePaymentFailComponent } from './components/shared/business-licence-payment-fail.component';
import { BusinessLicencePaymentSuccessComponent } from './components/shared/business-licence-payment-success.component';
import { LicencePaymentCancelAnonymousComponent } from './components/shared/licence-payment-cancel-anonymous.component';
import { LicencePaymentCancelComponent } from './components/shared/licence-payment-cancel.component';
import { LicencePaymentErrorAnonymousComponent } from './components/shared/licence-payment-error-anonymous.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailAnonymousComponent } from './components/shared/licence-payment-fail-anonymous.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentSuccessAnonymousComponent } from './components/shared/licence-payment-success-anonymous.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { LicenceUpdateReceivedSuccessComponent } from './components/shared/licence-update-received-success.component';
import { LoginSelectionComponent } from './components/shared/login-selection.component';
import { PermitUpdateReceivedSuccessComponent } from './components/shared/permit-update-received-success.component';
import { StepWorkerLicenceUserProfileComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-user-profile.component';
import { LicenceApplicationComponent } from './licence-application.component';

export class LicenceApplicationRoutes {
	public static readonly LICENCE_APPLICATION = 'licensing';

	public static readonly LOGIN_SELECTION = 'login-selection';

	// AUTHENTICATED
	public static readonly LICENCE_BASE = 'user';
	public static readonly LICENCE_USER_APPLICATIONS_AUTHENTICATED = 'applications';

	public static readonly LICENCE_FIRST_TIME_USER_TERMS = 'terms-and-conditions';
	public static readonly LICENCE_FIRST_TIME_USER_SELECTION = 'user-selection';
	public static readonly LICENCE_LINK = 'licence-link';
	public static readonly LICENCE_LOGIN_USER_PROFILE = 'user-profile';

	public static readonly WORKER_LICENCE_UPDATE_TERMS_AUTHENTICATED = 'licence-update-terms';
	public static readonly WORKER_LICENCE_USER_PROFILE_AUTHENTICATED = 'licence-user-profile';

	public static readonly PERMIT_UPDATE_TERMS_AUTHENTICATED = 'permit-update-terms';
	public static readonly PERMIT_USER_PROFILE_AUTHENTICATED = 'permit-user-profile';

	public static readonly PERMIT_NEW_AUTHENTICATED = 'permit-new';
	public static readonly PERMIT_RENEWAL_AUTHENTICATED = 'permit-renew';
	public static readonly PERMIT_UPDATE_AUTHENTICATED = 'permit-update';

	public static readonly WORKER_LICENCE_NEW_AUTHENTICATED = 'worker-licence-new';
	public static readonly WORKER_LICENCE_RENEWAL_AUTHENTICATED = 'worker-licence-renew';
	public static readonly WORKER_LICENCE_UPDATE_AUTHENTICATED = 'worker-licence-update';
	public static readonly WORKER_LICENCE_REPLACEMENT_AUTHENTICATED = 'worker-licence-replacement';

	public static readonly BUSINESS_FIRST_TIME_USER_TERMS = 'terms-and-conditions';
	public static readonly BUSINESS_BASE = 'business-licence';
	public static readonly BUSINESS_LICENCE_USER_PROFILE = 'business-licence-user-profile';
	public static readonly BUSINESS_USER_APPLICATIONS = 'applications';
	public static readonly BUSINESS_NEW = 'business-licence-new';
	public static readonly BUSINESS_RENEWAL = 'business-licence-renewal';
	public static readonly BUSINESS_UPDATE = 'business-licence-update';
	public static readonly BUSINESS_REPLACEMENT = 'business-licence-replacement';
	public static readonly BUSINESS_PROFILE = 'business-profile';
	public static readonly BUSINESS_MANAGERS = 'business-managers';
	public static readonly BUSINESS_CONTROLLING_MEMBERS_AND_EMPLOYEES = 'business-controlling-members-and-employees';

	// ANONYMOUS
	public static readonly LICENCE_APPLICATION_ANONYMOUS = 'applications-anonymous';
	public static readonly LICENCE_APPLICATION_TYPE_ANONYMOUS = 'licence-application-type';
	public static readonly LICENCE_ACCESS_CODE_ANONYMOUS = 'licence-access-code';

	public static readonly WORKER_LICENCE_NEW_ANONYMOUS = 'worker-licence-new';
	public static readonly WORKER_LICENCE_RENEWAL_ANONYMOUS = 'worker-licence-renewal';
	public static readonly WORKER_LICENCE_REPLACEMENT_ANONYMOUS = 'worker-licence-replacement';
	public static readonly WORKER_LICENCE_UPDATE_ANONYMOUS = 'worker-licence-update';

	public static readonly PERMIT_ANONYMOUS = 'permit-anonymous';
	public static readonly PERMIT_ACCESS_CODE_ANONYMOUS = 'permit-access-code';
	public static readonly PERMIT_TYPE_ANONYMOUS = 'permit-type';
	public static readonly PERMIT_NEW_ANONYMOUS = 'permit-new';
	public static readonly PERMIT_RENEWAL_ANONYMOUS = 'permit-renewal';
	public static readonly PERMIT_UPDATE_ANONYMOUS = 'permit-update';

	// PAYMENT
	public static readonly PAYMENT_SUCCESS = 'payment-success';
	public static readonly PAYMENT_FAIL = 'payment-fail';
	public static readonly PAYMENT_CANCEL = 'payment-cancel';
	public static readonly PAYMENT_ERROR = 'payment-error';
	public static readonly LICENCE_UPDATE_SUCCESS = 'licence-update-success';
	public static readonly PERMIT_UPDATE_SUCCESS = 'permit-update-success';
	public static readonly BUSINESS_UPDATE_SUCCESS = 'business-update-success';

	public static readonly MODULE_PATH = LicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route ? `/${LicenceApplicationRoutes.MODULE_PATH}/${route}` : `/${LicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathUserApplications(): string {
		return `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_BASE}/${LicenceApplicationRoutes.LICENCE_USER_APPLICATIONS_AUTHENTICATED}`;
	}

	public static pathSecurityWorkerLicenceAuthenticated(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_BASE}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_BASE}`;
	}

	public static pathSecurityWorkerLicenceAnonymous(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_APPLICATION_ANONYMOUS}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LOGIN_SELECTION}`;
	}

	public static pathPermitAnonymous(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.PERMIT_ANONYMOUS}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LOGIN_SELECTION}`;
	}

	public static pathPermitAuthenticated(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_BASE}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.LICENCE_BASE}`;
	}

	public static pathBusinessLicence(route: string | null = null): string {
		return route
			? `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.BUSINESS_BASE}/${route}`
			: `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.BUSINESS_BASE}`;
	}

	public static pathBusinessApplications(): string {
		return `/${LicenceApplicationRoutes.MODULE_PATH}/${LicenceApplicationRoutes.BUSINESS_BASE}/${LicenceApplicationRoutes.BUSINESS_USER_APPLICATIONS}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: LicenceApplicationComponent,
		children: [
			{
				path: LicenceApplicationRoutes.LOGIN_SELECTION,
				component: LoginSelectionComponent,
			},
			{
				/**************************************************** */
				// SECURITY WORKER LICENCE - ANONYMOUS
				/**************************************************** */
				path: LicenceApplicationRoutes.LICENCE_APPLICATION_ANONYMOUS,
				component: WorkerLicenceApplicationBaseAnonymousComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS,
						component: StepWorkerLicenceApplicationTypeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_ACCESS_CODE_ANONYMOUS,
						component: StepWorkerLicenceAccessCodeComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS,
						component: WorkerLicenceWizardAnonymousNewComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_ANONYMOUS,
						component: WorkerLicenceWizardAnonymousRenewalComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_ANONYMOUS,
						component: WorkerLicenceWizardAnonymousReplacementComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_ANONYMOUS,
						component: WorkerLicenceWizardAnonymousUpdateComponent,
					},
				],
			},
			{
				/**************************************************** */
				// PERMIT - ANONYMOUS
				/**************************************************** */
				path: LicenceApplicationRoutes.PERMIT_ANONYMOUS,
				component: PermitApplicationBaseAnonymousComponent,
				children: [
					{
						path: LicenceApplicationRoutes.PERMIT_TYPE_ANONYMOUS,
						component: StepPermitTypeAnonymousComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_ACCESS_CODE_ANONYMOUS,
						component: StepPermitAccessCodeComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_NEW_ANONYMOUS,
						component: PermitWizardAnonymousNewComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_RENEWAL_ANONYMOUS,
						component: PermitWizardAnonymousRenewalComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_UPDATE_ANONYMOUS,
						component: PermitWizardAnonymousUpdateComponent,
					},
				],
			},
			{
				/**************************************************** */
				// BUSINESS AUTHENTICATED
				/**************************************************** */
				path: LicenceApplicationRoutes.BUSINESS_BASE,
				component: BusinessLicenceApplicationBaseComponent,
				children: [
					{
						path: LicenceApplicationRoutes.BUSINESS_FIRST_TIME_USER_TERMS,
						component: BusinessFirstTimeUserTermsOfUseComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_USER_APPLICATIONS,
						component: BusinessUserApplicationsComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE,
						component: StepBusinessLicenceProfileComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_NEW,
						component: BusinessLicenceWizardNewComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_RENEWAL,
						component: BusinessLicenceWizardRenewalComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_UPDATE,
						component: BusinessLicenceWizardUpdateComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_REPLACEMENT,
						component: BusinessLicenceWizardReplacementComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_PROFILE,
						component: BusinessProfileComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_MANAGERS,
						component: BusinessManagersComponent,
					},
					{
						path: LicenceApplicationRoutes.BUSINESS_CONTROLLING_MEMBERS_AND_EMPLOYEES,
						component: BusinessControllingMembersAndEmployeesComponent,
					},
					{
						path: '',
						component: BusinessUserApplicationsComponent,
					},
					{
						path: `${LicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`,
						component: BusinessLicencePaymentSuccessComponent,
					},
					{ path: `${LicenceApplicationRoutes.PAYMENT_FAIL}/:id`, component: BusinessLicencePaymentFailComponent },
					{ path: `${LicenceApplicationRoutes.PAYMENT_CANCEL}/:id`, component: BusinessLicencePaymentCancelComponent },
					{ path: LicenceApplicationRoutes.PAYMENT_ERROR, component: BusinessLicencePaymentErrorComponent },
				],
			},
			{
				/**************************************************** */
				// LICENCE AUTHENTICATED
				/**************************************************** */
				path: LicenceApplicationRoutes.LICENCE_BASE,
				component: LicenceApplicationBaseAuthenticatedComponent,
				children: [
					{
						path: LicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_TERMS,
						component: LicenceFirstTimeUserTermsOfUseComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_SELECTION,
						component: LicenceFirstTimeUserSelectionComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_LINK,
						component: LicenceAccessCodeAuthorizedComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_USER_APPLICATIONS_AUTHENTICATED,
						component: LicenceUserApplicationsComponent,
					},
					{
						path: LicenceApplicationRoutes.LICENCE_LOGIN_USER_PROFILE,
						component: LoginUserProfileComponent,
					},
					/**************************************************** */
					// SECURITY WORKER LICENCE AUTHENTICATED
					/**************************************************** */
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_TERMS_AUTHENTICATED,
						component: StepWorkerLicenceUpdateTermsAuthenticatedComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED,
						component: StepWorkerLicenceUserProfileComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedNewComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedUpdateComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedRenewalComponent,
					},
					{
						path: LicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_AUTHENTICATED,
						component: WorkerLicenceWizardAuthenticatedReplacementComponent,
					},
					/**************************************************** */
					// PERMIT AUTHENTICATED
					/**************************************************** */
					{
						path: LicenceApplicationRoutes.PERMIT_UPDATE_TERMS_AUTHENTICATED,
						component: StepPermitUpdateTermsAuthenticatedComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED,
						component: StepPermitUserProfileComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_NEW_AUTHENTICATED,
						component: PermitWizardAuthenticatedNewComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_UPDATE_AUTHENTICATED,
						component: PermitWizardAuthenticatedUpdateComponent,
					},
					{
						path: LicenceApplicationRoutes.PERMIT_RENEWAL_AUTHENTICATED,
						component: PermitWizardAuthenticatedRenewalComponent,
					},
					{
						path: '',
						component: LicenceUserApplicationsComponent,
					},
					{ path: `${LicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`, component: LicencePaymentSuccessComponent },
					{ path: `${LicenceApplicationRoutes.PAYMENT_FAIL}/:id`, component: LicencePaymentFailComponent },
					{ path: `${LicenceApplicationRoutes.PAYMENT_CANCEL}/:id`, component: LicencePaymentCancelComponent },
					{ path: LicenceApplicationRoutes.PAYMENT_ERROR, component: LicencePaymentErrorComponent },
				],
			},
			/**************************************************** */
			// PAYMENT - ANONYMOUS
			/**************************************************** */
			{ path: `${LicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`, component: LicencePaymentSuccessAnonymousComponent },
			{ path: `${LicenceApplicationRoutes.PAYMENT_FAIL}/:id`, component: LicencePaymentFailAnonymousComponent },
			{ path: `${LicenceApplicationRoutes.PAYMENT_CANCEL}/:id`, component: LicencePaymentCancelAnonymousComponent },
			{ path: LicenceApplicationRoutes.PAYMENT_ERROR, component: LicencePaymentErrorAnonymousComponent },
			{ path: LicenceApplicationRoutes.LICENCE_UPDATE_SUCCESS, component: LicenceUpdateReceivedSuccessComponent },
			{ path: LicenceApplicationRoutes.PERMIT_UPDATE_SUCCESS, component: PermitUpdateReceivedSuccessComponent },
			{
				path: LicenceApplicationRoutes.BUSINESS_UPDATE_SUCCESS,
				component: BusinessLicenceUpdateReceivedSuccessComponent,
			},
			{
				path: '',
				redirectTo: LicenceApplicationRoutes.path(LicenceApplicationRoutes.LOGIN_SELECTION),
				pathMatch: 'full',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LicenceApplicationRoutingModule {}
