import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PermitApplicationBaseAnonymousComponent } from './components/anonymous/permit-application-base-anonymous.component';
import { PermitWizardAnonymousNewComponent } from './components/anonymous/permit-wizard-anonymous-new.component';
import { PermitWizardAnonymousRenewalComponent } from './components/anonymous/permit-wizard-anonymous-renewal.component';
import { PermitWizardAnonymousUpdateComponent } from './components/anonymous/permit-wizard-anonymous-update.component';
import { StepPermitAccessCodeComponent } from './components/anonymous/permit-wizard-steps/step-permit-access-code.component';
import { StepPermitAliasesComponent } from './components/anonymous/permit-wizard-steps/step-permit-aliases.component';
import { StepPermitBcDriverLicenceComponent } from './components/anonymous/permit-wizard-steps/step-permit-bc-driver-licence.component';
import { StepPermitChecklistNewComponent } from './components/anonymous/permit-wizard-steps/step-permit-checklist-new.component';
import { StepPermitChecklistRenewalComponent } from './components/anonymous/permit-wizard-steps/step-permit-checklist-renewal.component';
import { StepPermitChecklistUpdateComponent } from './components/anonymous/permit-wizard-steps/step-permit-checklist-update.component';
import { StepPermitCitizenshipComponent } from './components/anonymous/permit-wizard-steps/step-permit-citizenship.component';
import { StepPermitConfirmationComponent } from './components/anonymous/permit-wizard-steps/step-permit-confirmation.component';
import { StepPermitConsentAndDeclarationComponent } from './components/anonymous/permit-wizard-steps/step-permit-consent-and-declaration.component';
import { StepPermitContactInformationComponent } from './components/anonymous/permit-wizard-steps/step-permit-contact-information.component';
import { StepPermitCriminalHistoryComponent } from './components/anonymous/permit-wizard-steps/step-permit-criminal-history.component';
import { StepPermitEmployerInformationComponent } from './components/anonymous/permit-wizard-steps/step-permit-employer-information.component';
import { StepPermitExpiredComponent } from './components/anonymous/permit-wizard-steps/step-permit-expired.component';
import { StepPermitMailingAddressComponent } from './components/anonymous/permit-wizard-steps/step-permit-mailing-address.component';
import { StepPermitPersonalInformationComponent } from './components/anonymous/permit-wizard-steps/step-permit-personal-information.component';
import { StepPermitPhotographOfYourselfAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-photograph-of-yourself-anonymous.component';
import { StepPermitPhotographOfYourselfComponent } from './components/anonymous/permit-wizard-steps/step-permit-photograph-of-yourself.component';
import { StepPermitPhysicalCharacteristicsComponent } from './components/anonymous/permit-wizard-steps/step-permit-physical-characteristics.component';
import { StepPermitPrintComponent } from './components/anonymous/permit-wizard-steps/step-permit-print.component';
import { StepPermitRationaleComponent } from './components/anonymous/permit-wizard-steps/step-permit-rationale.component';
import { StepPermitReasonComponent } from './components/anonymous/permit-wizard-steps/step-permit-reason.component';
import { StepPermitResidentialAddressComponent } from './components/anonymous/permit-wizard-steps/step-permit-residential-address.component';
import { StepPermitSummaryAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-summary-anonymous.component';
import { StepPermitSummaryAuthenticatedComponent } from './components/anonymous/permit-wizard-steps/step-permit-summary-authenticated.component';
import { StepPermitTermsOfUseComponent } from './components/anonymous/permit-wizard-steps/step-permit-terms-of-use.component';
import { StepPermitTypeAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-type-anonymous.component';
import { StepsPermitContactComponent } from './components/anonymous/permit-wizard-steps/steps-permit-contact.component';
import { StepsPermitDetailsNewComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details-new.component';
import { StepsPermitDetailsUpdateComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details-update.component';
import { StepsPermitDetailsRenewalComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details.component-renewal';
import { StepsPermitIdentificationAnonymousComponent } from './components/anonymous/permit-wizard-steps/steps-permit-identification-anonymous.component';
import { StepsPermitPurposeAnonymousComponent } from './components/anonymous/permit-wizard-steps/steps-permit-purpose.component-anonymous';
import { StepsPermitReviewAnonymousComponent } from './components/anonymous/permit-wizard-steps/steps-permit-review-anonymous.component';
import { WorkerLicenceApplicationBaseAnonymousComponent } from './components/anonymous/worker-licence-application-base-anonymous.component';
import { WorkerLicenceWizardAnonymousNewComponent } from './components/anonymous/worker-licence-wizard-anonymous-new.component';
import { WorkerLicenceWizardAnonymousRenewalComponent } from './components/anonymous/worker-licence-wizard-anonymous-renewal.component';
import { WorkerLicenceWizardAnonymousReplacementComponent } from './components/anonymous/worker-licence-wizard-anonymous-replacement.component';
import { WorkerLicenceWizardAnonymousUpdateComponent } from './components/anonymous/worker-licence-wizard-anonymous-update.component';
import { StepWorkerLicenceAccessCodeComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-access-code.component';
import { StepWorkerLicenceApplicationTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-application-type-anonymous.component';
import { StepWorkerLicenceConfirmationComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-confirmation.component';
import { StepWorkerLicencePersonalInformationAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-personal-information-anonymous.component';
import { StepWorkerLicenceSummaryReviewAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-summary-review-anonymous.component';
import { StepsWorkerLicenceIdentificationAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/steps-worker-licence-identification-anonymous.component';
import { StepsWorkerLicenceReviewAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/steps-worker-licence-review-anonymous.component';
import { LicenceAccessCodeAuthorizedComponent } from './components/authenticated/licence-access-code-authorized.component';
import { LicenceApplicationBaseAuthenticatedComponent } from './components/authenticated/licence-application-base-authenticated.component';
import { LicenceFirstTimeUserSelectionComponent } from './components/authenticated/licence-first-time-user-selection.component';
import { LicenceFirstTimeUserTermsOfUseComponent } from './components/authenticated/licence-first-time-user-terms-of-use.component';
import { LicenceUserApplicationsComponent } from './components/authenticated/licence-user-applications.component';
import { LoginUserProfileComponent } from './components/authenticated/login-user-profile.component';
import { PermitWizardAuthenticatedNewComponent } from './components/authenticated/permit-wizard-authenticated-new.component';
import { PermitWizardAuthenticatedRenewalComponent } from './components/authenticated/permit-wizard-authenticated-renewal.component';
import { PermitWizardAuthenticatedUpdateComponent } from './components/authenticated/permit-wizard-authenticated-update.component';
import { StepPermitUserProfileComponent } from './components/authenticated/permit-wizard-steps/step-permit-user-profile.component';
import { StepsPermitIdentificationAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/steps-permit-identification-authenticated.component';
import { StepsPermitPurposeAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/steps-permit-purpose-authenticated.component';
import { StepsPermitReviewAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/steps-permit-review-authenticated.component';
import { CommonUserProfileLicenceCriminalHistoryComponent } from './components/authenticated/user-profile/common-user-profile-licence-criminal-history.component';
import { CommonUserProfileLicenceMentalHealthConditionsComponent } from './components/authenticated/user-profile/common-user-profile-licence-mental-health-conditions.component';
import { CommonUserProfileLicencePoliceBackgroundComponent } from './components/authenticated/user-profile/common-user-profile-licence-police-background.component';
import { CommonUserProfilePersonalInformationComponent } from './components/authenticated/user-profile/common-user-profile-personal-information.component';
import { CommonUserProfileComponent } from './components/authenticated/user-profile/common-user-profile.component';
import { WorkerLicenceWizardAuthenticatedNewComponent } from './components/authenticated/worker-licence-wizard-authenticated-new.component';
import { WorkerLicenceWizardAuthenticatedRenewalComponent } from './components/authenticated/worker-licence-wizard-authenticated-renewal.component';
import { WorkerLicenceWizardAuthenticatedReplacementComponent } from './components/authenticated/worker-licence-wizard-authenticated-replacement.component';
import { WorkerLicenceWizardAuthenticatedUpdateComponent } from './components/authenticated/worker-licence-wizard-authenticated-update.component';
import { StepWorkerLicenceSummaryReviewAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-summary-review-authenticated.component';
import { StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-summary-review-update-authenticated.component';
import { StepsWorkerLicenceIdentificationAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-worker-licence-identification-authenticated.component';
import { StepsWorkerLicenceReviewAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-worker-licence-review-authenticated.component';
import { StepsWorkerLicenceUpdatesAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-worker-licence-updates-authenticated.component';
import { BcBranchEditModalComponent } from './components/business/bc-branch-edit-modal.component';
import { BusinessCategoryAmouredCarGuardComponent } from './components/business/business-category-amoured-car-guard.component';
import { BusinessCategoryPrivateInvestigatorComponent } from './components/business/business-category-private-investigator.component';
import { BusinessCategorySecurityGuardComponent } from './components/business/business-category-security-guard.component';
import { BusinessLicenceApplicationBaseComponent } from './components/business/business-licence-application-base.component';
import { BusinessLicenceWizardNewComponent } from './components/business/business-licence-wizard-new.component';
import { MemberWithoutSwlEditModalComponent } from './components/business/member-without-swl-edit-modal.component';
import { StepBusinessLicenceConsentAndDeclarationComponent } from './components/business/step-business-licence-consent-and-declaration.component';
import { StepBusinessLicenceApplicationOnHoldComponent } from './components/business/step-business-licence-application-on-hold.component';
import { StepBusinessLicenceBcBranchesComponent } from './components/business/step-business-licence-bc-branches.component';
import { StepBusinessLicenceCategoryComponent } from './components/business/step-business-licence-category.component';
import { StepBusinessLicenceChecklistNewComponent } from './components/business/step-business-licence-checklist-new.component';
import { StepBusinessLicenceChecklistRenewComponent } from './components/business/step-business-licence-checklist-renew.component';
import { StepBusinessLicenceCompanyBrandingComponent } from './components/business/step-business-licence-company-branding.component';
import { StepBusinessLicenceControllingMemberConfirmationComponent } from './components/business/step-business-licence-controlling-member-confirmation.component';
import { StepBusinessLicenceControllingMemberInvitesComponent } from './components/business/step-business-licence-controlling-member-invites-component';
import { StepBusinessLicenceControllingMemberWithSwlComponent } from './components/business/step-business-licence-controlling-member-with-swl.component';
import { StepBusinessLicenceControllingMemberWithoutSwlComponent } from './components/business/step-business-licence-controlling-member-without-swl.component';
import { StepBusinessLicenceEmployeesComponent } from './components/business/step-business-licence-employees.component';
import { StepBusinessLicenceExpiredComponent } from './components/business/step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './components/business/step-business-licence-liability.component';
import { StepBusinessLicenceMailingAddressComponent } from './components/business/step-business-licence-mailing-address.component';
import { StepBusinessLicenceManagerInformationComponent } from './components/business/step-business-licence-manager-information.component';
import { StepBusinessLicenceNameComponent } from './components/business/step-business-licence-name.component';
import { StepBusinessLicenceSummaryComponent } from './components/business/step-business-licence-summary.component';
import { StepBusinessLicenceTermComponent } from './components/business/step-business-licence-term.component';
import { StepBusinessLicenceTypeComponent } from './components/business/step-business-licence-type.component';
import { StepBusinessLicenceBcBusinessAddressComponent } from './components/business/step-business_licence-bc-business-address.component';
import { StepBusinessLicenceBusinessAddressComponent } from './components/business/step-business_licence-business-address.component';
import { StepsBusinessLicenceContactInformationNewComponent } from './components/business/steps-business-licence-contact-information-new.component';
import { StepsBusinessLicenceControllingMembersNewComponent } from './components/business/steps-business-licence-controlling-members-new.component';
import { StepsBusinessLicenceInformationNewComponent } from './components/business/steps-business-licence-information-new.component';
import { StepsBusinessLicenceReviewComponent } from './components/business/steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionNewComponent } from './components/business/steps-business-licence-selection-new.component';
import { UserBusinessApplicationsComponent } from './components/business/user-business-applications.component';
import { LicencePaymentCancelAnonymousComponent } from './components/shared/licence-payment-cancel-anonymous.component';
import { LicencePaymentCancelComponent } from './components/shared/licence-payment-cancel.component';
import { LicencePaymentErrorAnonymousComponent } from './components/shared/licence-payment-error-anonymous.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailAnonymousComponent } from './components/shared/licence-payment-fail-anonymous.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentSuccessAnonymousComponent } from './components/shared/licence-payment-success-anonymous.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { LicenceUpdateReceivedSuccessAnonymousComponent } from './components/shared/licence-update-received-success-anonymous.component';
import { LoginSelectionComponent } from './components/shared/login-selection.component';
import { CommonAccessCodeAnonymousComponent } from './components/shared/step-components/common-access-code-anonymous.component';
import { CommonAddressComponent } from './components/shared/step-components/common-address.component';
import { CommonAliasListComponent } from './components/shared/step-components/common-alias-list.component';
import { CommonAliasesComponent } from './components/shared/step-components/common-aliases.component';
import { CommonBcDriverLicenceComponent } from './components/shared/step-components/common-bc-driver-licence.component';
import { CommonBusinessTermsComponent } from './components/shared/step-components/common-business-terms.component';
import { CommonContactInformationComponent } from './components/shared/step-components/common-contact-information.component';
import { CommonCriminalHistoryComponent } from './components/shared/step-components/common-criminal-history.component';
import { CommonExpiredLicenceComponent } from './components/shared/step-components/common-expired-licence.component';
import { CommonFingerprintsComponent } from './components/shared/step-components/common-fingerprints.component';
import { CommonPersonalInformationNewAnonymousComponent } from './components/shared/step-components/common-personal-information-new-anonymous.component';
import { CommonPersonalInformationRenewAnonymousComponent } from './components/shared/step-components/common-personal-information-renew-anonymous.component';
import { CommonPhotographOfYourselfComponent } from './components/shared/step-components/common-photograph-of-yourself.component';
import { CommonPhysicalCharacteristicsComponent } from './components/shared/step-components/common-physical-characteristics.component';
import { CommonReprintComponent } from './components/shared/step-components/common-reprint.component';
import { CommonResidentialAddressComponent } from './components/shared/step-components/common-residential-address.component';
import { CommonSwlPermitTermsComponent } from './components/shared/step-components/common-swl-permit-terms.component';
import { CommonUpdateRenewalAlertComponent } from './components/shared/step-components/common-update-renewal-alert.component';
import { LicenceCategoryArmouredCarGuardComponent } from './components/shared/worker-licence-wizard-steps/licence-category-armoured-car-guard.component';
import { LicenceCategoryBodyArmourSalesComponent } from './components/shared/worker-licence-wizard-steps/licence-category-body-armour-sales.component';
import { LicenceCategoryClosedCircuitTelevisionInstallerComponent } from './components/shared/worker-licence-wizard-steps/licence-category-closed-circuit-television-installer.component';
import { LicenceCategoryElectronicLockingDeviceInstallerComponent } from './components/shared/worker-licence-wizard-steps/licence-category-electronic-locking-device-installer.component';
import { LicenceCategoryFireInvestigatorComponent } from './components/shared/worker-licence-wizard-steps/licence-category-fire-investigator.component';
import { LicenceCategoryLocksmithSupComponent } from './components/shared/worker-licence-wizard-steps/licence-category-locksmith-sup.component';
import { LicenceCategoryLocksmithComponent } from './components/shared/worker-licence-wizard-steps/licence-category-locksmith.component';
import { LicenceCategoryPrivateInvestigatorSupComponent } from './components/shared/worker-licence-wizard-steps/licence-category-private-investigator-sup.component';
import { LicenceCategoryPrivateInvestigatorComponent } from './components/shared/worker-licence-wizard-steps/licence-category-private-investigator.component';
import { LicenceCategorySecurityAlarmInstallerSupComponent } from './components/shared/worker-licence-wizard-steps/licence-category-security-alarm-installer-sup.component';
import { LicenceCategorySecurityAlarmInstallerComponent } from './components/shared/worker-licence-wizard-steps/licence-category-security-alarm-installer.component';
import { LicenceCategorySecurityAlarmMonitorComponent } from './components/shared/worker-licence-wizard-steps/licence-category-security-alarm-monitor.component';
import { LicenceCategorySecurityAlarmResponseComponent } from './components/shared/worker-licence-wizard-steps/licence-category-security-alarm-response.component';
import { LicenceCategorySecurityAlarmSalesComponent } from './components/shared/worker-licence-wizard-steps/licence-category-security-alarm-sales.component';
import { LicenceCategorySecurityConsultantComponent } from './components/shared/worker-licence-wizard-steps/licence-category-security-consultant.component';
import { LicenceCategorySecurityGuardSupComponent } from './components/shared/worker-licence-wizard-steps/licence-category-security-guard-sup.component';
import { LicenceCategorySecurityGuardComponent } from './components/shared/worker-licence-wizard-steps/licence-category-security-guard.component';
import { StepWorkerLicenceAliasesComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-aliases.component';
import { StepWorkerLicenceBcDriverLicenceComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-bc-driver-licence.component';
import { StepWorkerLicenceCategoryComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-category.component';
import { StepWorkerLicenceChecklistNewComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-checklist-new.component';
import { StepWorkerLicenceChecklistRenewalComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-checklist-renewal.component';
import { StepWorkerLicenceChecklistUpdateComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-checklist-update.component';
import { StepWorkerLicenceCitizenshipComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-citizenship.component';
import { StepWorkerLicenceConsentAndDeclarationComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-consent-and-declaration.component';
import { StepWorkerLicenceContactInformationComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-contact-information.component';
import { StepWorkerLicenceCriminalHistoryComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-criminal-history.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-dogs-authorization.component';
import { StepWorkerLicenceExpiredComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-expired.component';
import { StepWorkerLicenceFingerprintsComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-fingerprints.component';
import { StepWorkerLicenceMailingAddressComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-mailing-address.component';
import { StepWorkerLicenceMentalHealthConditionsComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-mental-health-conditions.component';
import { StepWorkerLicencePhotographOfYourselfAnonymousComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself-anonymous.component';
import { StepWorkerLicencePhotographOfYourselfNewComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself-new.component';
import { StepWorkerLicencePhotographOfYourselfRenewAndUpdateComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself-renew-and-update.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself.component';
import { StepWorkerLicencePhysicalCharacteristicsComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-physical-characteristics.component';
import { StepWorkerLicencePoliceBackgroundComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-police-background.component';
import { StepWorkerLicenceReprintComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-reprint.component';
import { StepWorkerLicenceResidentialAddressComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-residential-address.component';
import { StepWorkerLicenceRestraintsComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-restraints.component';
import { StepWorkerLicenceReviewNameChangeComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-review-name-change.component';
import { StepWorkerLicenceSoleProprietorComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-sole-proprietor.component';
import { StepWorkerLicenceTermComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-term.component';
import { StepWorkerLicenceTermsOfUseComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-terms-of-use.component';
import { StepWorkerLicenceUpdateFeeComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-update-fee.component';
import { StepWorkerLicenceUserProfileComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-user-profile.component';
import { StepsWorkerLicenceBackgroundRenewAndUpdateComponent } from './components/shared/worker-licence-wizard-steps/steps-worker-licence-background-renew-and-update.component';
import { StepsWorkerLicenceBackgroundComponent } from './components/shared/worker-licence-wizard-steps/steps-worker-licence-background.component';
import { StepsWorkerLicenceSelectionComponent } from './components/shared/worker-licence-wizard-steps/steps-worker-licence-selection.component';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { LicenceApplicationService } from './services/licence-application.service';

@NgModule({
	declarations: [
		StepPermitUserProfileComponent,
		BcBranchEditModalComponent,
		BusinessLicenceApplicationBaseComponent,
		BusinessLicenceWizardNewComponent,
		CommonAccessCodeAnonymousComponent,
		CommonAddressComponent,
		CommonAliasListComponent,
		CommonAliasesComponent,
		CommonBcDriverLicenceComponent,
		CommonBusinessTermsComponent,
		CommonContactInformationComponent,
		CommonCriminalHistoryComponent,
		CommonExpiredLicenceComponent,
		CommonFingerprintsComponent,
		CommonPersonalInformationNewAnonymousComponent,
		CommonPersonalInformationRenewAnonymousComponent,
		CommonPhotographOfYourselfComponent,
		CommonPhysicalCharacteristicsComponent,
		CommonReprintComponent,
		CommonResidentialAddressComponent,
		CommonSwlPermitTermsComponent,
		CommonUpdateRenewalAlertComponent,
		CommonUserProfileComponent,
		CommonUserProfileLicencePoliceBackgroundComponent,
		CommonUserProfilePersonalInformationComponent,
		LicenceApplicationComponent,
		LicenceCategoryArmouredCarGuardComponent,
		LicenceCategoryBodyArmourSalesComponent,
		LicenceCategoryClosedCircuitTelevisionInstallerComponent,
		LicenceCategoryElectronicLockingDeviceInstallerComponent,
		LicenceCategoryFireInvestigatorComponent,
		LicenceCategoryLocksmithComponent,
		LicenceCategoryLocksmithSupComponent,
		LicenceCategoryPrivateInvestigatorComponent,
		LicenceCategoryPrivateInvestigatorSupComponent,
		LicenceCategorySecurityAlarmInstallerComponent,
		LicenceCategorySecurityAlarmInstallerSupComponent,
		LicenceCategorySecurityAlarmMonitorComponent,
		LicenceCategorySecurityAlarmResponseComponent,
		LicenceCategorySecurityAlarmSalesComponent,
		LicenceCategorySecurityConsultantComponent,
		LicenceCategorySecurityGuardComponent,
		LicenceCategorySecurityGuardSupComponent,
		CommonUserProfileLicenceCriminalHistoryComponent,
		CommonUserProfileLicenceMentalHealthConditionsComponent,
		LicencePaymentCancelComponent,
		LicencePaymentErrorComponent,
		LicencePaymentFailComponent,
		LicencePaymentSuccessComponent,
		LicencePaymentCancelAnonymousComponent,
		LicencePaymentErrorAnonymousComponent,
		LicencePaymentFailAnonymousComponent,
		LicencePaymentSuccessAnonymousComponent,
		LicenceUpdateReceivedSuccessAnonymousComponent,
		LoginSelectionComponent,
		MemberWithoutSwlEditModalComponent,
		PermitApplicationBaseAnonymousComponent,
		PermitWizardAnonymousNewComponent,
		PermitWizardAnonymousRenewalComponent,
		PermitWizardAnonymousUpdateComponent,
		PermitWizardAuthenticatedNewComponent,
		PermitWizardAuthenticatedRenewalComponent,
		PermitWizardAuthenticatedUpdateComponent,
		StepBusinessLicenceApplicationOnHoldComponent,
		StepBusinessLicenceBcBusinessAddressComponent,
		StepBusinessLicenceBcBranchesComponent,
		StepBusinessLicenceBusinessAddressComponent,
		StepBusinessLicenceCategoryComponent,
		StepBusinessLicenceChecklistNewComponent,
		StepBusinessLicenceChecklistRenewComponent,
		StepBusinessLicenceCompanyBrandingComponent,
		StepBusinessLicenceConsentAndDeclarationComponent,
		StepBusinessLicenceControllingMemberConfirmationComponent,
		StepBusinessLicenceControllingMemberInvitesComponent,
		StepBusinessLicenceControllingMemberWithSwlComponent,
		StepBusinessLicenceControllingMemberWithoutSwlComponent,
		StepBusinessLicenceEmployeesComponent,
		StepBusinessLicenceLiabilityComponent,
		StepBusinessLicenceNameComponent,
		StepsBusinessLicenceReviewComponent,
		StepBusinessLicenceSummaryComponent,
		StepBusinessLicenceTermComponent,
		StepBusinessLicenceTypeComponent,
		StepBusinessLicenceExpiredComponent,
		StepBusinessLicenceMailingAddressComponent,
		StepBusinessLicenceManagerInformationComponent,
		StepPermitAccessCodeComponent,
		StepPermitAliasesComponent,
		StepPermitBcDriverLicenceComponent,
		StepPermitChecklistNewComponent,
		StepPermitChecklistRenewalComponent,
		StepPermitChecklistUpdateComponent,
		StepPermitCitizenshipComponent,
		StepPermitConfirmationComponent,
		StepPermitConsentAndDeclarationComponent,
		StepPermitContactInformationComponent,
		StepPermitCriminalHistoryComponent,
		StepPermitEmployerInformationComponent,
		StepPermitExpiredComponent,
		StepPermitMailingAddressComponent,
		StepPermitPersonalInformationComponent,
		StepPermitPhotographOfYourselfAnonymousComponent,
		StepPermitPhotographOfYourselfComponent,
		StepPermitPhysicalCharacteristicsComponent,
		StepPermitPrintComponent,
		StepPermitRationaleComponent,
		StepPermitReasonComponent,
		StepPermitResidentialAddressComponent,
		StepPermitSummaryAuthenticatedComponent,
		StepPermitSummaryAnonymousComponent,
		StepPermitTermsOfUseComponent,
		StepPermitTypeAnonymousComponent,
		LicenceAccessCodeAuthorizedComponent,
		StepWorkerLicenceAccessCodeComponent,
		StepWorkerLicenceAliasesComponent,
		StepWorkerLicenceApplicationTypeAnonymousComponent,
		StepWorkerLicenceBcDriverLicenceComponent,
		StepWorkerLicenceCategoryComponent,
		StepWorkerLicenceChecklistNewComponent,
		StepWorkerLicenceChecklistRenewalComponent,
		StepWorkerLicenceChecklistUpdateComponent,
		StepWorkerLicenceCitizenshipComponent,
		StepWorkerLicenceConfirmationComponent,
		StepWorkerLicenceConsentAndDeclarationComponent,
		StepWorkerLicenceContactInformationComponent,
		StepWorkerLicenceCriminalHistoryComponent,
		StepWorkerLicenceDogsAuthorizationComponent,
		StepWorkerLicenceExpiredComponent,
		StepWorkerLicenceFingerprintsComponent,
		StepWorkerLicenceMailingAddressComponent,
		StepWorkerLicenceMentalHealthConditionsComponent,
		StepWorkerLicencePersonalInformationAnonymousComponent,
		StepWorkerLicencePhotographOfYourselfAnonymousComponent,
		StepWorkerLicencePhotographOfYourselfComponent,
		StepWorkerLicencePhotographOfYourselfNewComponent,
		StepWorkerLicencePhotographOfYourselfRenewAndUpdateComponent,
		StepWorkerLicencePhysicalCharacteristicsComponent,
		StepWorkerLicencePoliceBackgroundComponent,
		StepWorkerLicenceReprintComponent,
		StepWorkerLicenceResidentialAddressComponent,
		StepWorkerLicenceRestraintsComponent,
		StepWorkerLicenceReviewNameChangeComponent,
		StepWorkerLicenceSoleProprietorComponent,
		StepWorkerLicenceSummaryReviewAnonymousComponent,
		StepWorkerLicenceSummaryReviewAuthenticatedComponent,
		StepWorkerLicenceSummaryReviewUpdateAuthenticatedComponent,
		StepWorkerLicenceTermComponent,
		StepWorkerLicenceTermsOfUseComponent,
		StepWorkerLicenceUpdateFeeComponent,
		StepWorkerLicenceUserProfileComponent,
		StepsBusinessLicenceInformationNewComponent,
		StepsBusinessLicenceSelectionNewComponent,
		StepsBusinessLicenceContactInformationNewComponent,
		StepsBusinessLicenceControllingMembersNewComponent,
		StepsPermitContactComponent,
		StepsPermitDetailsNewComponent,
		StepsPermitDetailsRenewalComponent,
		StepsPermitDetailsUpdateComponent,
		StepsPermitIdentificationAnonymousComponent,
		StepsPermitIdentificationAuthenticatedComponent,
		StepsPermitPurposeAuthenticatedComponent,
		StepsPermitPurposeAnonymousComponent,
		StepsPermitReviewAnonymousComponent,
		StepsPermitReviewAuthenticatedComponent,
		StepsWorkerLicenceBackgroundComponent,
		StepsWorkerLicenceBackgroundRenewAndUpdateComponent,
		StepsWorkerLicenceIdentificationAnonymousComponent,
		StepsWorkerLicenceIdentificationAuthenticatedComponent,
		StepsWorkerLicenceReviewAnonymousComponent,
		StepsWorkerLicenceReviewAuthenticatedComponent,
		StepsWorkerLicenceUpdatesAuthenticatedComponent,
		StepsWorkerLicenceSelectionComponent,
		LicenceUserApplicationsComponent,
		UserBusinessApplicationsComponent,
		LoginUserProfileComponent,
		WorkerLicenceApplicationBaseAnonymousComponent,
		LicenceApplicationBaseAuthenticatedComponent,
		LicenceFirstTimeUserSelectionComponent,
		LicenceFirstTimeUserTermsOfUseComponent,
		WorkerLicenceWizardAnonymousNewComponent,
		WorkerLicenceWizardAnonymousRenewalComponent,
		WorkerLicenceWizardAnonymousReplacementComponent,
		WorkerLicenceWizardAnonymousUpdateComponent,
		WorkerLicenceWizardAuthenticatedNewComponent,
		WorkerLicenceWizardAuthenticatedRenewalComponent,
		WorkerLicenceWizardAuthenticatedReplacementComponent,
		WorkerLicenceWizardAuthenticatedUpdateComponent,
		BusinessCategoryAmouredCarGuardComponent,
		BusinessCategoryPrivateInvestigatorComponent,
		BusinessCategorySecurityGuardComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
	providers: [LicenceApplicationService],
})
export class LicenceApplicationModule {}
