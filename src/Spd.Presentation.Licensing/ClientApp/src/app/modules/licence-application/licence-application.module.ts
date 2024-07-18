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
import { StepPermitRationaleComponent } from './components/anonymous/permit-wizard-steps/step-permit-rationale.component';
import { StepPermitReasonComponent } from './components/anonymous/permit-wizard-steps/step-permit-reason.component';
import { StepPermitResidentialAddressComponent } from './components/anonymous/permit-wizard-steps/step-permit-residential-address.component';
import { StepPermitSummaryAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-summary-anonymous.component';
import { StepPermitSummaryAuthenticatedComponent } from './components/anonymous/permit-wizard-steps/step-permit-summary-authenticated.component';
import { StepPermitSummaryReviewUpdateAuthenticatedComponent } from './components/anonymous/permit-wizard-steps/step-permit-summary-review-update-authenticated.component';
import { StepPermitTermsOfUseComponent } from './components/anonymous/permit-wizard-steps/step-permit-terms-of-use.component';
import { StepPermitTypeAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-type-anonymous.component';
import { StepsPermitContactComponent } from './components/anonymous/permit-wizard-steps/steps-permit-contact.component';
import { StepsPermitDetailsNewComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details-new.component';
import { StepsPermitDetailsRenewalComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details-renewal.component';
import { StepsPermitDetailsUpdateComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details-update.component';
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
import { StepPermitPhotographOfYourselfNewComponent } from './components/authenticated/permit-wizard-steps/step-permit-photograph-of-yourself-new.component';
import { StepPermitPhotographOfYourselfRenewAndUpdateComponent } from './components/authenticated/permit-wizard-steps/step-permit-photograph-of-yourself-renew-and-update.component';
import { StepPermitPhotographOfYourselfComponent } from './components/authenticated/permit-wizard-steps/step-permit-photograph-of-yourself.component';
import { StepPermitReviewNameChangeComponent } from './components/authenticated/permit-wizard-steps/step-permit-review-name-change.component';
import { StepPermitUpdateTermsAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/step-permit-update-terms-authenticated.component';
import { StepPermitUserProfileComponent } from './components/authenticated/permit-wizard-steps/step-permit-user-profile.component';
import { StepsPermitIdentificationAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/steps-permit-identification-authenticated.component';
import { StepsPermitPurposeAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/steps-permit-purpose-authenticated.component';
import { StepsPermitReviewAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/steps-permit-review-authenticated.component';
import { StepsPermitUpdatesAuthenticatedComponent } from './components/authenticated/permit-wizard-steps/steps-permit-updates-authenticated.component';
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
import { StepWorkerLicenceUpdateTermsAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-update-terms-authenticated.component';
import { StepsWorkerLicenceIdentificationAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-worker-licence-identification-authenticated.component';
import { StepsWorkerLicenceReviewAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-worker-licence-review-authenticated.component';
import { StepsWorkerLicenceUpdatesAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-worker-licence-updates-authenticated.component';
import { BusinessCategoryAmouredCarGuardComponent } from './components/business/business-category-amoured-car-guard.component';
import { BusinessCategoryPrivateInvestigatorComponent } from './components/business/business-category-private-investigator.component';
import { BusinessCategorySecurityGuardComponent } from './components/business/business-category-security-guard.component';
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
import { CommonBusinessBcBranchesComponent } from './components/business/common-business-bc-branches.component';
import { CommonBusinessLicenceSummaryComponent } from './components/business/common-business-licence-summary.component';
import { CommonBusinessManagerComponent } from './components/business/common-business-manager.component';
import { CommonBusinessProfileComponent } from './components/business/common-business-profile.component';
import { CommonControllingMembersComponent } from './components/business/common-controlling-members.component';
import { CommonEmployeesComponent } from './components/business/common-employees.component';
import { ModalBcBranchEditComponent } from './components/business/modal-bc-branch-edit.component';
import { ModalBusinessManagerEditComponent } from './components/business/modal-business-manager-edit.component';
import { ModalLookupByLicenceNumberComponent } from './components/business/modal-lookup-by-licence-number.component';
import { ModalMemberWithoutSwlEditComponent } from './components/business/modal-member-without-swl-edit.component';
import { StepBusinessLicenceApplicationOnHoldComponent } from './components/business/step-business-licence-application-on-hold.component';
import { StepBusinessLicenceCategoryComponent } from './components/business/step-business-licence-category.component';
import { StepBusinessLicenceChecklistNewComponent } from './components/business/step-business-licence-checklist-new.component';
import { StepBusinessLicenceChecklistRenewComponent } from './components/business/step-business-licence-checklist-renew.component';
import { StepBusinessLicenceCompanyBrandingComponent } from './components/business/step-business-licence-company-branding.component';
import { StepBusinessLicenceConfirmationComponent } from './components/business/step-business-licence-confirmation.component';
import { StepBusinessLicenceConsentAndDeclarationComponent } from './components/business/step-business-licence-consent-and-declaration.component';
import { StepBusinessLicenceControllingMemberConfirmationComponent } from './components/business/step-business-licence-controlling-member-confirmation.component';
import { StepBusinessLicenceControllingMemberInvitesComponent } from './components/business/step-business-licence-controlling-member-invites-component';
import { StepBusinessLicenceControllingMembersComponent } from './components/business/step-business-licence-controlling-members.component';
import { StepBusinessLicenceEmployeesComponent } from './components/business/step-business-licence-employees.component';
import { StepBusinessLicenceExpiredComponent } from './components/business/step-business-licence-expired.component';
import { StepBusinessLicenceLiabilityComponent } from './components/business/step-business-licence-liability.component';
import { StepBusinessLicenceManagerInformationComponent } from './components/business/step-business-licence-manager-information.component';
import { StepBusinessLicenceProfileComponent } from './components/business/step-business-licence-profile.component';
import { StepBusinessLicenceReprintComponent } from './components/business/step-business-licence-reprint.component';
import { StepBusinessLicenceStaticSummaryComponent } from './components/business/step-business-licence-static-summary.component';
import { StepBusinessLicenceSummaryComponent } from './components/business/step-business-licence-summary.component';
import { StepBusinessLicenceTermComponent } from './components/business/step-business-licence-term.component';
import { StepBusinessLicenceUpdateFeeComponent } from './components/business/step-business-licence-update-fee.component';
import { StepsBusinessLicenceContactInformationComponent } from './components/business/steps-business-licence-contact-information.component';
import { StepsBusinessLicenceControllingMembersComponent } from './components/business/steps-business-licence-controlling-members.component';
import { StepsBusinessLicenceInformationComponent } from './components/business/steps-business-licence-information.component';
import { StepsBusinessLicenceReviewComponent } from './components/business/steps-business-licence-review.component';
import { StepsBusinessLicenceSelectionComponent } from './components/business/steps-business-licence-selection.component';
import { StepsBusinessLicenceUpdatesComponent } from './components/business/steps-business-licence-updates.component';
import { BusinessLicencePaymentCancelComponent } from './components/shared/business-licence-payment-cancel.component';
import { BusinessLicencePaymentErrorComponent } from './components/shared/business-licence-payment-error.component';
import { BusinessLicencePaymentFailComponent } from './components/shared/business-licence-payment-fail.component';
import { BusinessLicencePaymentSuccessComponent } from './components/shared/business-licence-payment-success.component';
import { CollectionNoticeComponent } from './components/shared/collection-notice.component';
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
import { MainActiveBusinessLicencesComponent } from './components/shared/main-active-business-licences.component';
import { MainActiveSwlPermitLicencesComponent } from './components/shared/main-active-swl-permit-licences.component';
import { MainApplicationsComponent } from './components/shared/main-applications.component';
import { MainExpiredLicencesComponent } from './components/shared/main-expired-licences.component';
import { PermitUpdateReceivedSuccessComponent } from './components/shared/permit-update-received-success.component';
import { StepPermitPhysicalCharacteristicsComponent } from './components/shared/permit-wizard-steps/step-permit-physical-characteristics.component';
import { StepPermitReprintComponent } from './components/shared/permit-wizard-steps/step-permit-reprint.component';
import { CommonAccessCodeAnonymousComponent } from './components/shared/step-components/common-access-code-anonymous.component';
import { CommonAddressAndIsSameFlagComponent } from './components/shared/step-components/common-address-and-is-same-flag.component';
import { CommonAddressComponent } from './components/shared/step-components/common-address.component';
import { CommonAliasListComponent } from './components/shared/step-components/common-alias-list.component';
import { CommonAliasesComponent } from './components/shared/step-components/common-aliases.component';
import { CommonBcDriverLicenceComponent } from './components/shared/step-components/common-bc-driver-licence.component';
import { CommonBusinessTermsComponent } from './components/shared/step-components/common-business-terms.component';
import { CommonContactInformationComponent } from './components/shared/step-components/common-contact-information.component';
import { CommonCriminalHistoryComponent } from './components/shared/step-components/common-criminal-history.component';
import { CommonExpiredLicenceComponent } from './components/shared/step-components/common-expired-licence.component';
import { CommonFingerprintsComponent } from './components/shared/step-components/common-fingerprints.component';
import { CommonMentalHealthConditionsComponent } from './components/shared/step-components/common-mental-health-conditions.component';
import { CommonPersonalInformationNewAnonymousComponent } from './components/shared/step-components/common-personal-information-new-anonymous.component';
import { CommonPersonalInformationRenewAnonymousComponent } from './components/shared/step-components/common-personal-information-renew-anonymous.component';
import { CommonPhotographOfYourselfComponent } from './components/shared/step-components/common-photograph-of-yourself.component';
import { CommonPhysicalCharacteristicsComponent } from './components/shared/step-components/common-physical-characteristics.component';
import { CommonPoliceBackgroundComponent } from './components/shared/step-components/common-police-background.component';
import { CommonReprintComponent } from './components/shared/step-components/common-reprint.component';
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
import { StepWorkerLicenceMailingAddressAnonymousComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-mailing-address-anonymous.component';
import { StepWorkerLicenceMailingAddressReplacementAnonymousComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-mailing-address-replacement-anonymous.component';
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
		ModalBcBranchEditComponent,
		ModalBusinessManagerEditComponent,
		BusinessFirstTimeUserTermsOfUseComponent,
		BusinessLicenceApplicationBaseComponent,
		BusinessLicenceWizardNewComponent,
		BusinessLicenceWizardRenewalComponent,
		BusinessLicenceWizardUpdateComponent,
		BusinessLicenceWizardReplacementComponent,
		BusinessLicenceUpdateReceivedSuccessComponent,
		StepBusinessLicenceReprintComponent,
		StepBusinessLicenceUpdateFeeComponent,
		StepsBusinessLicenceUpdatesComponent,
		CollectionNoticeComponent,
		CommonAccessCodeAnonymousComponent,
		CommonAddressComponent,
		CommonAliasListComponent,
		CommonAliasesComponent,
		CommonBcDriverLicenceComponent,
		CommonAddressAndIsSameFlagComponent,
		CommonBusinessBcBranchesComponent,
		CommonBusinessManagerComponent,
		CommonBusinessLicenceSummaryComponent,
		CommonBusinessProfileComponent,
		CommonBusinessTermsComponent,
		CommonContactInformationComponent,
		CommonControllingMembersComponent,
		CommonEmployeesComponent,
		CommonCriminalHistoryComponent,
		CommonPoliceBackgroundComponent,
		CommonMentalHealthConditionsComponent,
		CommonExpiredLicenceComponent,
		CommonFingerprintsComponent,
		CommonPersonalInformationNewAnonymousComponent,
		CommonPersonalInformationRenewAnonymousComponent,
		CommonPhotographOfYourselfComponent,
		CommonPhysicalCharacteristicsComponent,
		CommonReprintComponent,
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
		BusinessLicencePaymentCancelComponent,
		BusinessLicencePaymentErrorComponent,
		BusinessLicencePaymentFailComponent,
		BusinessLicencePaymentSuccessComponent,
		LicencePaymentCancelAnonymousComponent,
		LicencePaymentErrorAnonymousComponent,
		LicencePaymentFailAnonymousComponent,
		LicencePaymentSuccessAnonymousComponent,
		LicenceUpdateReceivedSuccessComponent,
		LoginSelectionComponent,
		MainActiveBusinessLicencesComponent,
		MainActiveSwlPermitLicencesComponent,
		MainApplicationsComponent,
		MainExpiredLicencesComponent,
		ModalLookupByLicenceNumberComponent,
		ModalMemberWithoutSwlEditComponent,
		PermitApplicationBaseAnonymousComponent,
		PermitUpdateReceivedSuccessComponent,
		PermitWizardAnonymousNewComponent,
		PermitWizardAnonymousRenewalComponent,
		PermitWizardAnonymousUpdateComponent,
		PermitWizardAuthenticatedNewComponent,
		PermitWizardAuthenticatedRenewalComponent,
		PermitWizardAuthenticatedUpdateComponent,
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
		StepsBusinessLicenceReviewComponent,
		StepBusinessLicenceSummaryComponent,
		StepBusinessLicenceStaticSummaryComponent,
		StepBusinessLicenceTermComponent,
		StepBusinessLicenceExpiredComponent,
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
		StepPermitPhotographOfYourselfNewComponent,
		StepPermitPhotographOfYourselfRenewAndUpdateComponent,
		StepPermitPhysicalCharacteristicsComponent,
		StepPermitRationaleComponent,
		StepPermitReasonComponent,
		StepPermitReprintComponent,
		StepPermitResidentialAddressComponent,
		StepPermitReviewNameChangeComponent,
		StepPermitSummaryAuthenticatedComponent,
		StepPermitSummaryAnonymousComponent,
		StepPermitSummaryReviewUpdateAuthenticatedComponent,
		StepPermitTermsOfUseComponent,
		StepPermitUpdateTermsAuthenticatedComponent,
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
		StepWorkerLicenceMailingAddressAnonymousComponent,
		StepWorkerLicenceMailingAddressReplacementAnonymousComponent,
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
		StepWorkerLicenceUpdateTermsAuthenticatedComponent,
		StepWorkerLicenceUserProfileComponent,
		StepsBusinessLicenceInformationComponent,
		StepsBusinessLicenceSelectionComponent,
		StepsBusinessLicenceContactInformationComponent,
		StepsBusinessLicenceControllingMembersComponent,
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
		StepsPermitUpdatesAuthenticatedComponent,
		StepsWorkerLicenceBackgroundComponent,
		StepsWorkerLicenceBackgroundRenewAndUpdateComponent,
		StepsWorkerLicenceIdentificationAnonymousComponent,
		StepsWorkerLicenceIdentificationAuthenticatedComponent,
		StepsWorkerLicenceReviewAnonymousComponent,
		StepsWorkerLicenceReviewAuthenticatedComponent,
		StepsWorkerLicenceUpdatesAuthenticatedComponent,
		StepsWorkerLicenceSelectionComponent,
		LicenceUserApplicationsComponent,
		BusinessUserApplicationsComponent,
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
		BusinessManagersComponent,
		BusinessProfileComponent,
		BusinessControllingMembersAndEmployeesComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
	providers: [LicenceApplicationService],
})
export class LicenceApplicationModule {}
