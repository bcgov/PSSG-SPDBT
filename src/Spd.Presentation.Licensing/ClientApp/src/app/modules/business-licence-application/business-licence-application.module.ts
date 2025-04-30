import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonBusinessLicenceSummaryComponent } from '../business-licence-application/components/common-business-licence-summary.component';
import { CommonBusinessManagerComponent } from '../business-licence-application/components/common-business-manager.component';
import { CommonBusinessProfileComponent } from '../business-licence-application/components/common-business-profile.component';
import { CommonControllingMembersComponent } from '../business-licence-application/components/common-controlling-members.component';
import { CommonEmployeesComponent } from '../business-licence-application/components/common-employees.component';
import { StepBusinessLicenceSwlSoleProprietorComponent } from '../business-licence-application/components/step-business-licence-swl-sole-proprietor.component';
import { StepsBusinessLicenceContactInformationComponent } from '../business-licence-application/components/steps-business-licence-contact-information.component';
import { StepsBusinessLicenceControllingMembersComponent } from '../business-licence-application/components/steps-business-licence-controlling-members.component';
import { StepsBusinessLicenceInformationComponent } from '../business-licence-application/components/steps-business-licence-information.component';
import { StepsBusinessLicenceSelectionComponent } from '../business-licence-application/components/steps-business-licence-selection.component';
import { StepsBusinessLicenceUpdatesComponent } from '../business-licence-application/components/steps-business-licence-updates.component';
import { BusinessLicenceApplicationRoutingModule } from './business-licence-application-routing.module';
import { BusinessBcBranchesComponent } from './components/business-bc-branches.component';
import { BusinessCategoryArmouredCarGuardComponent } from './components/business-category-armoured-car-guard.component';
import { BusinessCategoryPrivateInvestigatorComponent } from './components/business-category-private-investigator.component';
import { BusinessCategorySecurityGuardComponent } from './components/business-category-security-guard.component';
import { BusinessFirstTimeUserTermsOfUseComponent } from './components/business-first-time-user-terms-of-use.component';
import { BusinessLicenceApplicationBaseComponent } from './components/business-licence-application-base.component';
import { BusinessLicenceMainApplicationsListComponent } from './components/business-licence-main-applications-list.component';
import { BusinessLicenceMainLicenceListComponent } from './components/business-licence-main-licence-list.component';
import { BusinessLicenceMainComponent } from './components/business-licence-main.component';
import { BusinessLicencePaymentCancelComponent } from './components/business-licence-payment-cancel.component';
import { BusinessLicencePaymentErrorComponent } from './components/business-licence-payment-error.component';
import { BusinessLicencePaymentFailComponent } from './components/business-licence-payment-fail.component';
import { BusinessLicencePaymentSuccessComponent } from './components/business-licence-payment-success.component';
import { BusinessLicenceStakeholdersComponent } from './components/business-licence-stakeholders.component';
import { BusinessLicenceWizardNewSwlSoleProprietorComponent } from './components/business-licence-wizard-new-swl-sole-proprietor.component';
import { BusinessLicenceWizardNewComponent } from './components/business-licence-wizard-new.component';
import { BusinessLicenceWizardRenewalSwlSoleProprietorComponent } from './components/business-licence-wizard-renewal-swl-sole-proprietor.component';
import { BusinessLicenceWizardRenewalComponent } from './components/business-licence-wizard-renewal.component';
import { BusinessLicenceWizardReplacementComponent } from './components/business-licence-wizard-replacement.component';
import { BusinessLicenceWizardUpdateComponent } from './components/business-licence-wizard-update.component';
import { BusinessProfileComponent } from './components/business-profile.component';
import { CommonBusinessInformationComponent } from './components/common-business-information.component';
import { CommonBusinessEmployeesSummaryComponent } from './components/common-business-employees-summary.component';
import { CommonBusinessMembersComponent } from './components/common-business-members.component';
import { CommonControllingOrBusinessMembersComponent } from './components/common-controlling-or-business-members.component';
import { ModalBcBranchEditComponent } from './components/modal-bc-branch-edit.component';
import { ModalMemberWithoutSwlEditComponent } from './components/modal-member-without-swl-edit.component';
import { ModalPortalAdministratorEditComponent } from './components/modal-portal-administrator-edit.component';
import { PortalAdministratorInvitationComponent } from './components/portal-administrator-invitation.component';
import { PortalAdministratorsComponent } from './components/portal-administrators.component';
import { StepBusinessLicenceApplicationOnHoldComponent } from './components/step-business-licence-application-on-hold.component';
import { StepBusinessLicenceBusinessAddressComponent } from './components/step-business-licence-business-address.component';
import { StepBusinessLicenceBusinessInformationComponent } from './components/step-business-licence-business-information.component';
import { StepBusinessLicenceBusinessMembersComponent } from './components/step-business-licence-business-members.component';
import { StepBusinessLicenceCategoryComponent } from './components/step-business-licence-category.component';
import { StepBusinessLicenceChecklistNewComponent } from './components/step-business-licence-checklist-new.component';
import { StepBusinessLicenceChecklistRenewComponent } from './components/step-business-licence-checklist-renew.component';
import { StepBusinessLicenceCompanyBrandingComponent } from './components/step-business-licence-company-branding.component';
import { StepBusinessLicenceConfirmationComponent } from './components/step-business-licence-confirmation.component';
import { StepBusinessLicenceConsentAndDeclarationComponent } from './components/step-business-licence-consent-and-declaration.component';
import { StepBusinessLicenceControllingMemberInvitesComponent } from './components/step-business-licence-controlling-member-invites-component';
import { StepBusinessLicenceControllingMembersComponent } from './components/step-business-licence-controlling-members.component';
import { StepBusinessLicenceCorporateRegistryDocumentComponent } from './components/step-business-licence-corporate-registry-document.component';
import { StepBusinessLicenceEmployeesComponent } from './components/step-business-licence-employees.component';
import { StepBusinessLicenceExpiredComponent } from './components/step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './components/step-business-licence-liability.component';
import { StepBusinessLicenceManagerInformationComponent } from './components/step-business-licence-manager-information.component';
import { StepBusinessLicenceProfileComponent } from './components/step-business-licence-profile.component';
import { StepBusinessLicenceSummaryComponent } from './components/step-business-licence-summary.component';
import { StepBusinessLicenceTermComponent } from './components/step-business-licence-term.component';
import { StepBusinessLicenceUpdateTermsComponent } from './components/step-business-licence-update-terms.component';
import { StepsBusinessLicenceReviewComponent } from './components/steps-business-licence-review.component';
import { StepsBusinessLicenceSpEmployeesComponent } from './components/steps-business-licence-sp-employees.component';
import { StepsBusinessLicenceSwlSpInformationComponent } from './components/steps-business-licence-swl-sp-information.component';

@NgModule({
	declarations: [
		PortalAdministratorInvitationComponent,
		ModalBcBranchEditComponent,
		ModalPortalAdministratorEditComponent,
		BusinessFirstTimeUserTermsOfUseComponent,
		BusinessLicenceApplicationBaseComponent,
		BusinessLicenceWizardNewComponent,
		BusinessLicenceWizardNewSwlSoleProprietorComponent,
		BusinessLicenceWizardRenewalSwlSoleProprietorComponent,
		BusinessLicenceWizardRenewalComponent,
		BusinessLicenceWizardUpdateComponent,
		BusinessLicenceWizardReplacementComponent,
		StepsBusinessLicenceUpdatesComponent,
		BusinessBcBranchesComponent,
		CommonBusinessManagerComponent,
		CommonBusinessLicenceSummaryComponent,
		CommonBusinessProfileComponent,
		CommonBusinessInformationComponent,
		CommonBusinessMembersComponent,
		CommonBusinessEmployeesSummaryComponent,
		CommonControllingOrBusinessMembersComponent,
		CommonControllingMembersComponent,
		CommonEmployeesComponent,
		BusinessLicencePaymentCancelComponent,
		BusinessLicencePaymentErrorComponent,
		BusinessLicencePaymentFailComponent,
		BusinessLicencePaymentSuccessComponent,
		BusinessLicenceMainLicenceListComponent,
		ModalMemberWithoutSwlEditComponent,
		StepBusinessLicenceBusinessAddressComponent,
		StepBusinessLicenceBusinessInformationComponent,
		StepBusinessLicenceConfirmationComponent,
		StepBusinessLicenceCorporateRegistryDocumentComponent,
		StepBusinessLicenceBusinessMembersComponent,
		StepBusinessLicenceControllingMembersComponent,
		StepBusinessLicenceEmployeesComponent,
		StepBusinessLicenceApplicationOnHoldComponent,
		StepBusinessLicenceCategoryComponent,
		StepBusinessLicenceChecklistNewComponent,
		StepBusinessLicenceChecklistRenewComponent,
		StepBusinessLicenceCompanyBrandingComponent,
		StepBusinessLicenceConsentAndDeclarationComponent,
		StepBusinessLicenceControllingMemberInvitesComponent,
		StepBusinessLicenceLiabilityComponent,
		StepBusinessLicenceProfileComponent,
		StepBusinessLicenceUpdateTermsComponent,
		StepsBusinessLicenceReviewComponent,
		StepBusinessLicenceSummaryComponent,
		StepsBusinessLicenceSwlSpInformationComponent,
		StepBusinessLicenceTermComponent,
		StepBusinessLicenceExpiredComponent,
		StepBusinessLicenceManagerInformationComponent,
		StepBusinessLicenceSwlSoleProprietorComponent,
		StepsBusinessLicenceInformationComponent,
		StepsBusinessLicenceSelectionComponent,
		StepsBusinessLicenceSpEmployeesComponent,
		StepsBusinessLicenceContactInformationComponent,
		StepsBusinessLicenceControllingMembersComponent,
		BusinessLicenceMainComponent,
		BusinessCategoryArmouredCarGuardComponent,
		BusinessCategoryPrivateInvestigatorComponent,
		BusinessCategorySecurityGuardComponent,
		PortalAdministratorsComponent,
		BusinessProfileComponent,
		BusinessLicenceStakeholdersComponent,
		BusinessLicenceMainApplicationsListComponent,
	],
	imports: [SharedModule, BusinessLicenceApplicationRoutingModule],
	providers: [],
})
export class BusinessLicenceApplicationModule {}
