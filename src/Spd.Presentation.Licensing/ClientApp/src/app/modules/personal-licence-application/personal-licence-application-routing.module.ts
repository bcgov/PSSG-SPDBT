import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermitApplicationBaseAnonymousComponent } from './components/anonymous/permit-application-base-anonymous.component';
import { PermitWizardAnonymousNewComponent } from './components/anonymous/permit-wizard-anonymous-new.component';
import { PermitWizardAnonymousRenewalComponent } from './components/anonymous/permit-wizard-anonymous-renewal.component';
import { PermitWizardAnonymousUpdateComponent } from './components/anonymous/permit-wizard-anonymous-update.component';
import { StepPermitAccessCodeComponent } from './components/anonymous/permit-wizard-step-components/step-permit-access-code.component';
import { StepPermitTypeAnonymousComponent } from './components/anonymous/permit-wizard-step-components/step-permit-type-anonymous.component';
import { WorkerLicenceApplicationBaseAnonymousComponent } from './components/anonymous/worker-licence-application-base-anonymous.component';
import { WorkerLicenceWizardAnonymousNewComponent } from './components/anonymous/worker-licence-wizard-anonymous-new.component';
import { WorkerLicenceWizardAnonymousRenewalComponent } from './components/anonymous/worker-licence-wizard-anonymous-renewal.component';
import { WorkerLicenceWizardAnonymousReplacementComponent } from './components/anonymous/worker-licence-wizard-anonymous-replacement.component';
import { WorkerLicenceWizardAnonymousUpdateComponent } from './components/anonymous/worker-licence-wizard-anonymous-update.component';
import { StepWorkerLicenceAccessCodeComponent } from './components/anonymous/worker-licence-wizard-step-components/step-worker-licence-access-code.component';
import { StepWorkerLicenceApplicationTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-step-components/step-worker-licence-application-type-anonymous.component';
import { LicenceAccessCodeAuthorizedComponent } from './components/authenticated/licence-access-code-authorized.component';
import { LicenceApplicationBaseAuthenticatedComponent } from './components/authenticated/licence-application-base-authenticated.component';
import { LicenceFirstTimeUserSelectionComponent } from './components/authenticated/licence-first-time-user-selection.component';
import { LicenceFirstTimeUserTermsOfUseComponent } from './components/authenticated/licence-first-time-user-terms-of-use.component';
import { LicenceUserApplicationsComponent } from './components/authenticated/licence-user-applications.component';
import { LicenceReturnFromBlSoleProprietorComponent } from './components/authenticated/licence-return-from-bl-sole-proprietor.component';
import { PermitWizardAuthenticatedNewComponent } from './components/authenticated/permit-wizard-authenticated-new.component';
import { PermitWizardAuthenticatedRenewalComponent } from './components/authenticated/permit-wizard-authenticated-renewal.component';
import { PermitWizardAuthenticatedUpdateComponent } from './components/authenticated/permit-wizard-authenticated-update.component';
import { StepPermitUpdateTermsAuthenticatedComponent } from './components/authenticated/permit-wizard-step-components/step-permit-update-terms-authenticated.component';
import { StepPermitUserProfileComponent } from './components/authenticated/permit-wizard-step-components/step-permit-user-profile.component';
import { UserProfileComponent } from './components/authenticated/user-profile.component';
import { WorkerLicenceWizardAuthenticatedNewComponent } from './components/authenticated/worker-licence-wizard-authenticated-new.component';
import { WorkerLicenceWizardAuthenticatedRenewalComponent } from './components/authenticated/worker-licence-wizard-authenticated-renewal.component';
import { WorkerLicenceWizardAuthenticatedReplacementComponent } from './components/authenticated/worker-licence-wizard-authenticated-replacement.component';
import { WorkerLicenceWizardAuthenticatedUpdateComponent } from './components/authenticated/worker-licence-wizard-authenticated-update.component';
import { StepWorkerLicenceUpdateTermsAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-step-components/step-worker-licence-update-terms-authenticated.component';
import { LicencePaymentCancelAnonymousComponent } from './components/shared/licence-payment-cancel-anonymous.component';
import { LicencePaymentCancelComponent } from './components/shared/licence-payment-cancel.component';
import { LicencePaymentErrorAnonymousComponent } from './components/shared/licence-payment-error-anonymous.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailAnonymousComponent } from './components/shared/licence-payment-fail-anonymous.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentSuccessAnonymousComponent } from './components/shared/licence-payment-success-anonymous.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { LicenceUpdateReceivedSuccessComponent } from './components/shared/licence-update-received-success.component';
import { PermitUpdateReceivedSuccessComponent } from './components/shared/permit-update-received-success.component';
import { StepWorkerLicenceUserProfileComponent } from './components/shared/worker-licence-wizard-step-components/step-worker-licence-user-profile.component';

export class PersonalLicenceApplicationRoutes {
	public static readonly LICENCE_APPLICATION = 'personal-licence';

	// AUTHENTICATED
	public static readonly LICENCE_BASE = 'application';
	public static readonly LICENCE_USER_APPLICATIONS_AUTHENTICATED = 'user-applications';

	public static readonly LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR = 'return-user-applications';

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

	// ANONYMOUS
	public static readonly LICENCE_APPLICATION_ANONYMOUS = 'personal-application-anonymous';
	public static readonly LICENCE_APPLICATION_TYPE_ANONYMOUS = 'licence-application-type';
	public static readonly LICENCE_ACCESS_CODE_ANONYMOUS = 'licence-access-code';

	public static readonly WORKER_LICENCE_NEW_ANONYMOUS = 'worker-licence-new';
	public static readonly WORKER_LICENCE_RENEWAL_ANONYMOUS = 'worker-licence-renewal';
	public static readonly WORKER_LICENCE_REPLACEMENT_ANONYMOUS = 'worker-licence-replacement';
	public static readonly WORKER_LICENCE_UPDATE_ANONYMOUS = 'worker-licence-update';

	public static readonly PERMIT_APPLICATION_ANONYMOUS = 'permit-application-anonymous';
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

	public static readonly MODULE_PATH = PersonalLicenceApplicationRoutes.LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathUserApplications(): string {
		return `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}/${PersonalLicenceApplicationRoutes.LICENCE_USER_APPLICATIONS_AUTHENTICATED}`;
	}

	public static pathReturnFromBusinessLicenceSoleProprietor(): string {
		return `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}/${PersonalLicenceApplicationRoutes.LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR}`;
	}

	public static pathSecurityWorkerLicenceAuthenticated(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}`;
	}

	public static pathSecurityWorkerLicenceAnonymous(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_APPLICATION_ANONYMOUS}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathPermitAnonymous(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.PERMIT_APPLICATION_ANONYMOUS}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathPermitAuthenticated(route: string | null = null): string {
		return route
			? `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}/${route}`
			: `/${PersonalLicenceApplicationRoutes.MODULE_PATH}/${PersonalLicenceApplicationRoutes.LICENCE_BASE}`;
	}
}

const routes: Routes = [
	{
		/**************************************************** */
		// SECURITY WORKER LICENCE - ANONYMOUS
		/**************************************************** */
		path: PersonalLicenceApplicationRoutes.LICENCE_APPLICATION_ANONYMOUS,
		component: WorkerLicenceApplicationBaseAnonymousComponent,
		children: [
			{
				path: PersonalLicenceApplicationRoutes.LICENCE_APPLICATION_TYPE_ANONYMOUS,
				component: StepWorkerLicenceApplicationTypeAnonymousComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.LICENCE_ACCESS_CODE_ANONYMOUS,
				component: StepWorkerLicenceAccessCodeComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_NEW_ANONYMOUS,
				component: WorkerLicenceWizardAnonymousNewComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_ANONYMOUS,
				component: WorkerLicenceWizardAnonymousRenewalComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_ANONYMOUS,
				component: WorkerLicenceWizardAnonymousReplacementComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_UPDATE_ANONYMOUS,
				component: WorkerLicenceWizardAnonymousUpdateComponent,
			},
		],
	},
	{
		/**************************************************** */
		// PERMIT - ANONYMOUS
		/**************************************************** */
		path: PersonalLicenceApplicationRoutes.PERMIT_APPLICATION_ANONYMOUS,
		component: PermitApplicationBaseAnonymousComponent,
		children: [
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_TYPE_ANONYMOUS,
				component: StepPermitTypeAnonymousComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_ACCESS_CODE_ANONYMOUS,
				component: StepPermitAccessCodeComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_NEW_ANONYMOUS,
				component: PermitWizardAnonymousNewComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_RENEWAL_ANONYMOUS,
				component: PermitWizardAnonymousRenewalComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_UPDATE_ANONYMOUS,
				component: PermitWizardAnonymousUpdateComponent,
			},
		],
	},
	{
		/**************************************************** */
		// LICENCE AUTHENTICATED
		/**************************************************** */
		path: PersonalLicenceApplicationRoutes.LICENCE_BASE,
		component: LicenceApplicationBaseAuthenticatedComponent,
		children: [
			{
				path: PersonalLicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_TERMS,
				component: LicenceFirstTimeUserTermsOfUseComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.LICENCE_FIRST_TIME_USER_SELECTION,
				component: LicenceFirstTimeUserSelectionComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.LICENCE_LINK,
				component: LicenceAccessCodeAuthorizedComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.LICENCE_USER_APPLICATIONS_AUTHENTICATED,
				component: LicenceUserApplicationsComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.LICENCE_RETURN_FROM_BL_SOLE_PROPRIETOR,
				component: LicenceReturnFromBlSoleProprietorComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.LICENCE_LOGIN_USER_PROFILE,
				component: UserProfileComponent,
			},
			/**************************************************** */
			// SECURITY WORKER LICENCE AUTHENTICATED
			/**************************************************** */
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_UPDATE_TERMS_AUTHENTICATED,
				component: StepWorkerLicenceUpdateTermsAuthenticatedComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_USER_PROFILE_AUTHENTICATED,
				component: StepWorkerLicenceUserProfileComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_NEW_AUTHENTICATED,
				component: WorkerLicenceWizardAuthenticatedNewComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_UPDATE_AUTHENTICATED,
				component: WorkerLicenceWizardAuthenticatedUpdateComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_RENEWAL_AUTHENTICATED,
				component: WorkerLicenceWizardAuthenticatedRenewalComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.WORKER_LICENCE_REPLACEMENT_AUTHENTICATED,
				component: WorkerLicenceWizardAuthenticatedReplacementComponent,
			},
			/**************************************************** */
			// PERMIT AUTHENTICATED
			/**************************************************** */
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_UPDATE_TERMS_AUTHENTICATED,
				component: StepPermitUpdateTermsAuthenticatedComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_USER_PROFILE_AUTHENTICATED,
				component: StepPermitUserProfileComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_NEW_AUTHENTICATED,
				component: PermitWizardAuthenticatedNewComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_UPDATE_AUTHENTICATED,
				component: PermitWizardAuthenticatedUpdateComponent,
			},
			{
				path: PersonalLicenceApplicationRoutes.PERMIT_RENEWAL_AUTHENTICATED,
				component: PermitWizardAuthenticatedRenewalComponent,
			},
			{
				path: `${PersonalLicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`,
				component: LicencePaymentSuccessComponent,
			},
			{ path: `${PersonalLicenceApplicationRoutes.PAYMENT_FAIL}/:id`, component: LicencePaymentFailComponent },
			{ path: `${PersonalLicenceApplicationRoutes.PAYMENT_CANCEL}/:id`, component: LicencePaymentCancelComponent },
			{ path: PersonalLicenceApplicationRoutes.PAYMENT_ERROR, component: LicencePaymentErrorComponent },
			{
				path: '',
				redirectTo: PersonalLicenceApplicationRoutes.pathUserApplications(),
				pathMatch: 'full',
			},
		],
	},
	/**************************************************** */
	// PAYMENT - ANONYMOUS
	/**************************************************** */
	{
		path: `${PersonalLicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`,
		component: LicencePaymentSuccessAnonymousComponent,
	},
	{ path: `${PersonalLicenceApplicationRoutes.PAYMENT_FAIL}/:id`, component: LicencePaymentFailAnonymousComponent },
	{
		path: `${PersonalLicenceApplicationRoutes.PAYMENT_CANCEL}/:id`,
		component: LicencePaymentCancelAnonymousComponent,
	},
	{ path: PersonalLicenceApplicationRoutes.PAYMENT_ERROR, component: LicencePaymentErrorAnonymousComponent },
	{
		path: PersonalLicenceApplicationRoutes.LICENCE_UPDATE_SUCCESS,
		component: LicenceUpdateReceivedSuccessComponent,
	},
	{ path: PersonalLicenceApplicationRoutes.PERMIT_UPDATE_SUCCESS, component: PermitUpdateReceivedSuccessComponent },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LicenceApplicationRoutingModule {}