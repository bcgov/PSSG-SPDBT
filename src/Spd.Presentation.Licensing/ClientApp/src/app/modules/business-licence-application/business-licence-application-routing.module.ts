import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusinessControllingMembersAndEmployeesComponent } from './components/business-controlling-members-and-employees.component';
import { BusinessFirstTimeUserTermsOfUseComponent } from './components/business-first-time-user-terms-of-use.component';
import { BusinessLicenceApplicationBaseComponent } from './components/business-licence-application-base.component';
import { BusinessLicencePaymentCancelComponent } from './components/business-licence-payment-cancel.component';
import { BusinessLicencePaymentErrorComponent } from './components/business-licence-payment-error.component';
import { BusinessLicencePaymentFailComponent } from './components/business-licence-payment-fail.component';
import { BusinessLicencePaymentSuccessComponent } from './components/business-licence-payment-success.component';
import { BusinessLicenceSwlSoleProprietorComponent } from './components/business-licence-swl-sole-proprietor.component';
import { BusinessLicenceUpdateReceivedSuccessComponent } from './components/business-licence-update-received-success.component';
import { BusinessLicenceWizardNewSwlSoleProprietorComponent } from './components/business-licence-wizard-new-swl-sole-proprietor.component';
import { BusinessLicenceWizardNewComponent } from './components/business-licence-wizard-new.component';
import { BusinessLicenceWizardRenewalComponent } from './components/business-licence-wizard-renewal.component';
import { BusinessLicenceWizardReplacementComponent } from './components/business-licence-wizard-replacement.component';
import { BusinessLicenceWizardUpdateComponent } from './components/business-licence-wizard-update.component';
import { BusinessManagerInvitationComponent } from './components/business-manager-invitation.component';
import { BusinessManagersComponent } from './components/business-managers.component';
import { BusinessProfileComponent } from './components/business-profile.component';
import { BusinessUserApplicationsComponent } from './components/business-user-applications.component';
import { StepBusinessLicenceProfileComponent } from './components/step-business-licence-profile.component';
import { StepBusinessLicenceUpdateTermsComponent } from './components/step-business-licence-update-terms.component';

export class BusinessLicenceApplicationRoutes {
	public static readonly BUSINESS_LICENCE_APPLICATION = 'business-licence';

	public static readonly BUSINESS_FIRST_TIME_USER_TERMS = 'terms-and-conditions';

	public static readonly BUSINESS_NEW_SOLE_PROPRIETOR = 'business-licence-new-sp';
	public static readonly BUSINESS_NEW_SWL_SP = 'business-licence-new-swl-sp';

	public static readonly BUSINESS_LICENCE_UPDATE_TERMS = 'business-licence-update-terms';
	public static readonly BUSINESS_LICENCE_USER_PROFILE = 'user-profile';
	public static readonly BUSINESS_NEW = 'new';
	public static readonly BUSINESS_RENEWAL = 'renewal';
	public static readonly BUSINESS_UPDATE = 'update';
	public static readonly BUSINESS_REPLACEMENT = 'replacement';
	public static readonly BUSINESS_PROFILE = 'business-profile';
	public static readonly BUSINESS_MANAGERS = 'business-managers';
	public static readonly BUSINESS_CONTROLLING_MEMBERS_AND_EMPLOYEES = 'controlling-members-and-employees';
	public static readonly BUSINESS_UPDATE_SUCCESS = 'business-update-success';

	public static readonly BUSINESS_MANAGER_INVITATION = 'invitation';

	// PAYMENT
	public static readonly PAYMENT_SUCCESS = 'payment-success';
	public static readonly PAYMENT_FAIL = 'payment-fail';
	public static readonly PAYMENT_CANCEL = 'payment-cancel';
	public static readonly PAYMENT_ERROR = 'payment-error';

	public static readonly MODULE_PATH = BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_APPLICATION;

	public static path(route: string | null = null): string {
		return route
			? `/${BusinessLicenceApplicationRoutes.MODULE_PATH}/${route}`
			: `/${BusinessLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathBusinessLicence(route: string | null = null): string {
		return route
			? `/${BusinessLicenceApplicationRoutes.MODULE_PATH}/${route}`
			: `/${BusinessLicenceApplicationRoutes.MODULE_PATH}`;
	}

	public static pathBusinessApplications(): string {
		return `/${BusinessLicenceApplicationRoutes.MODULE_PATH}`;
	}
}

const routes: Routes = [
	{
		path: '',
		component: BusinessLicenceApplicationBaseComponent,
		children: [
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_UPDATE_TERMS,
				component: StepBusinessLicenceUpdateTermsComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_LICENCE_USER_PROFILE,
				component: StepBusinessLicenceProfileComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_NEW,
				component: BusinessLicenceWizardNewComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_NEW_SOLE_PROPRIETOR,
				component: BusinessLicenceSwlSoleProprietorComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_NEW_SWL_SP,
				component: BusinessLicenceWizardNewSwlSoleProprietorComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_RENEWAL,
				component: BusinessLicenceWizardRenewalComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_UPDATE,
				component: BusinessLicenceWizardUpdateComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_REPLACEMENT,
				component: BusinessLicenceWizardReplacementComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_PROFILE,
				component: BusinessProfileComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_MANAGERS,
				component: BusinessManagersComponent,
			},
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_CONTROLLING_MEMBERS_AND_EMPLOYEES,
				component: BusinessControllingMembersAndEmployeesComponent,
			},
			{
				path: '',
				component: BusinessUserApplicationsComponent,
			},
			{
				path: `${BusinessLicenceApplicationRoutes.PAYMENT_SUCCESS}/:id`,
				component: BusinessLicencePaymentSuccessComponent,
			},
			{
				path: `${BusinessLicenceApplicationRoutes.PAYMENT_FAIL}/:id`,
				component: BusinessLicencePaymentFailComponent,
			},
			{
				path: `${BusinessLicenceApplicationRoutes.PAYMENT_CANCEL}/:id`,
				component: BusinessLicencePaymentCancelComponent,
			},
			{ path: BusinessLicenceApplicationRoutes.PAYMENT_ERROR, component: BusinessLicencePaymentErrorComponent },
			{
				path: BusinessLicenceApplicationRoutes.BUSINESS_UPDATE_SUCCESS,
				component: BusinessLicenceUpdateReceivedSuccessComponent,
			},
		],
	},
	{
		path: `${BusinessLicenceApplicationRoutes.BUSINESS_MANAGER_INVITATION}/:id`,
		component: BusinessManagerInvitationComponent,
	},
	{
		path: BusinessLicenceApplicationRoutes.BUSINESS_FIRST_TIME_USER_TERMS,
		component: BusinessFirstTimeUserTermsOfUseComponent,
	},
	{
		path: '',
		redirectTo: BusinessLicenceApplicationRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class BusinessLicenceApplicationRoutingModule {}
