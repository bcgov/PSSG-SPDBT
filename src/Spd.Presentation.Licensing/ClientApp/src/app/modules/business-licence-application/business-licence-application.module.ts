import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BusinessUserApplicationsComponent } from '../business-licence-application/components/business-user-applications.component';
import { BusinessBcBranchesComponent } from './components/business-bc-branches.component';
import { CommonBusinessLicenceSummaryComponent } from '../business-licence-application/components/common-business-licence-summary.component';
import { CommonBusinessManagerComponent } from '../business-licence-application/components/common-business-manager.component';
import { CommonBusinessProfileComponent } from '../business-licence-application/components/common-business-profile.component';
import { CommonControllingMembersComponent } from '../business-licence-application/components/common-controlling-members.component';
import { CommonEmployeesComponent } from '../business-licence-application/components/common-employees.component';
import { StepBusinessLicenceReprintComponent } from '../business-licence-application/components/step-business-licence-reprint.component';
import { StepBusinessLicenceSwlSoleProprietorComponent } from '../business-licence-application/components/step-business-licence-swl-sole-proprietor.component';
import { StepBusinessLicenceUpdateFeeComponent } from '../business-licence-application/components/step-business-licence-update-fee.component';
import { StepsBusinessLicenceContactInformationComponent } from '../business-licence-application/components/steps-business-licence-contact-information.component';
import { StepsBusinessLicenceControllingMembersComponent } from '../business-licence-application/components/steps-business-licence-controlling-members.component';
import { StepsBusinessLicenceInformationComponent } from '../business-licence-application/components/steps-business-licence-information.component';
import { StepsBusinessLicenceSelectionComponent } from '../business-licence-application/components/steps-business-licence-selection.component';
import { StepsBusinessLicenceUpdatesComponent } from '../business-licence-application/components/steps-business-licence-updates.component';
import { BusinessLicenceApplicationRoutingModule } from './business-licence-application-routing.module';
import { BusinessCategoryAmouredCarGuardComponent } from './components/business-category-amoured-car-guard.component';
import { BusinessCategoryPrivateInvestigatorComponent } from './components/business-category-private-investigator.component';
import { BusinessCategorySecurityGuardComponent } from './components/business-category-security-guard.component';
import { BusinessControllingMembersAndEmployeesComponent } from './components/business-controlling-members-and-employees.component';
import { BusinessFirstTimeUserTermsOfUseComponent } from './components/business-first-time-user-terms-of-use.component';
import { BusinessLicenceApplicationBaseComponent } from './components/business-licence-application-base.component';
import { BusinessLicenceListCurrentComponent } from './components/business-licence-list-current.component';
import { BusinessLicencePaymentCancelComponent } from './components/business-licence-payment-cancel.component';
import { BusinessLicencePaymentErrorComponent } from './components/business-licence-payment-error.component';
import { BusinessLicencePaymentFailComponent } from './components/business-licence-payment-fail.component';
import { BusinessLicencePaymentSuccessComponent } from './components/business-licence-payment-success.component';
import { BusinessLicenceUpdateReceivedSuccessComponent } from './components/business-licence-update-received-success.component';
import { BusinessLicenceWizardNewSwlSpComponent } from './components/business-licence-wizard-new-swl-sp.component';
import { BusinessLicenceWizardNewComponent } from './components/business-licence-wizard-new.component';
import { BusinessLicenceWizardRenewalComponent } from './components/business-licence-wizard-renewal.component';
import { BusinessLicenceWizardReplacementComponent } from './components/business-licence-wizard-replacement.component';
import { BusinessLicenceWizardUpdateComponent } from './components/business-licence-wizard-update.component';
import { BusinessManagersComponent } from './components/business-managers.component';
import { BusinessProfileComponent } from './components/business-profile.component';
import { CommonBusinessTermsComponent } from './components/common-business-terms.component';
import { ModalBcBranchEditComponent } from './components/modal-bc-branch-edit.component';
import { ModalBusinessManagerEditComponent } from './components/modal-business-manager-edit.component';
import { ModalMemberWithoutSwlEditComponent } from './components/modal-member-without-swl-edit.component';
import { StepBusinessLicenceApplicationOnHoldComponent } from './components/step-business-licence-application-on-hold.component';
import { StepBusinessLicenceCategoryComponent } from './components/step-business-licence-category.component';
import { StepBusinessLicenceChecklistNewComponent } from './components/step-business-licence-checklist-new.component';
import { StepBusinessLicenceChecklistRenewComponent } from './components/step-business-licence-checklist-renew.component';
import { StepBusinessLicenceCompanyBrandingComponent } from './components/step-business-licence-company-branding.component';
import { StepBusinessLicenceConfirmationComponent } from './components/step-business-licence-confirmation.component';
import { StepBusinessLicenceConsentAndDeclarationComponent } from './components/step-business-licence-consent-and-declaration.component';
import { StepBusinessLicenceControllingMemberConfirmationComponent } from './components/step-business-licence-controlling-member-confirmation.component';
import { StepBusinessLicenceControllingMemberInvitesComponent } from './components/step-business-licence-controlling-member-invites-component';
import { StepBusinessLicenceControllingMembersComponent } from './components/step-business-licence-controlling-members.component';
import { StepBusinessLicenceEmployeesComponent } from './components/step-business-licence-employees.component';
import { StepBusinessLicenceExpiredComponent } from './components/step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './components/step-business-licence-liability.component';
import { StepBusinessLicenceManagerInformationComponent } from './components/step-business-licence-manager-information.component';
import { StepBusinessLicenceProfileComponent } from './components/step-business-licence-profile.component';
import { StepBusinessLicenceStaticSummaryComponent } from './components/step-business-licence-static-summary.component';
import { StepBusinessLicenceSummaryComponent } from './components/step-business-licence-summary.component';
import { StepBusinessLicenceTermComponent } from './components/step-business-licence-term.component';
import { StepBusinessLicenceUpdateTermsComponent } from './components/step-business-licence-update-terms.component';
import { StepsBusinessLicenceReviewComponent } from './components/steps-business-licence-review.component';
import { StepsBusinessLicenceSwlSpContactComponent } from './components/steps-business-licence-swl-sp-contact.component';
import { StepsBusinessLicenceSwlSpInformationComponent } from './components/steps-business-licence-swl-sp-information.component';

@NgModule({
	declarations: [
		ModalBcBranchEditComponent,
		ModalBusinessManagerEditComponent,
		BusinessFirstTimeUserTermsOfUseComponent,
		BusinessLicenceApplicationBaseComponent,
		BusinessLicenceWizardNewComponent,
		BusinessLicenceWizardNewSwlSpComponent,
		BusinessLicenceWizardRenewalComponent,
		BusinessLicenceWizardUpdateComponent,
		BusinessLicenceWizardReplacementComponent,
		BusinessLicenceUpdateReceivedSuccessComponent,
		StepBusinessLicenceReprintComponent,
		StepBusinessLicenceUpdateFeeComponent,
		StepsBusinessLicenceUpdatesComponent,
		BusinessBcBranchesComponent,
		CommonBusinessManagerComponent,
		CommonBusinessLicenceSummaryComponent,
		CommonBusinessProfileComponent,
		CommonBusinessTermsComponent,
		CommonControllingMembersComponent,
		CommonEmployeesComponent,
		BusinessLicencePaymentCancelComponent,
		BusinessLicencePaymentErrorComponent,
		BusinessLicencePaymentFailComponent,
		BusinessLicencePaymentSuccessComponent,
		BusinessLicenceListCurrentComponent,
		ModalMemberWithoutSwlEditComponent,
		StepBusinessLicenceConfirmationComponent,
		StepBusinessLicenceControllingMembersComponent,
		StepBusinessLicenceEmployeesComponent,
		StepBusinessLicenceApplicationOnHoldComponent,
		StepBusinessLicenceCategoryComponent,
		StepBusinessLicenceChecklistNewComponent,
		StepBusinessLicenceChecklistRenewComponent,
		StepBusinessLicenceCompanyBrandingComponent,
		StepBusinessLicenceConsentAndDeclarationComponent,
		StepBusinessLicenceControllingMemberConfirmationComponent,
		StepBusinessLicenceControllingMemberInvitesComponent,
		StepBusinessLicenceLiabilityComponent,
		StepBusinessLicenceProfileComponent,
		StepBusinessLicenceUpdateTermsComponent,
		StepsBusinessLicenceReviewComponent,
		StepBusinessLicenceSummaryComponent,
		StepsBusinessLicenceSwlSpInformationComponent,
		StepsBusinessLicenceSwlSpContactComponent,
		StepBusinessLicenceStaticSummaryComponent,
		StepBusinessLicenceTermComponent,
		StepBusinessLicenceExpiredComponent,
		StepBusinessLicenceManagerInformationComponent,
		StepBusinessLicenceSwlSoleProprietorComponent,
		StepsBusinessLicenceInformationComponent,
		StepsBusinessLicenceSelectionComponent,
		StepsBusinessLicenceContactInformationComponent,
		StepsBusinessLicenceControllingMembersComponent,
		BusinessUserApplicationsComponent,
		BusinessCategoryAmouredCarGuardComponent,
		BusinessCategoryPrivateInvestigatorComponent,
		BusinessCategorySecurityGuardComponent,
		BusinessManagersComponent,
		BusinessProfileComponent,
		BusinessControllingMembersAndEmployeesComponent,
	],
	imports: [SharedModule, BusinessLicenceApplicationRoutingModule],
	providers: [],
})
export class BusinessLicenceApplicationModule {}
