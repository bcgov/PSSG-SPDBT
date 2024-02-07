import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { StepBusinessChecklistNewComponent } from './components/anonymous/business-wizard-steps/step-business-checklist-new.component';
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
import { StepPermitFingerprintsComponent } from './components/anonymous/permit-wizard-steps/step-permit-fingerprints.component';
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
import { StepPermitTypeAnonymousComponent } from './components/anonymous/permit-wizard-steps/step-permit-type-anonymous.component';
import { StepsPermitContactComponent } from './components/anonymous/permit-wizard-steps/steps-permit-contact.component';
import { StepsPermitDetailsNewComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details-new.component';
import { StepsPermitDetailsUpdateComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details-update.component';
import { StepsPermitDetailsRenewalComponent } from './components/anonymous/permit-wizard-steps/steps-permit-details.component-renewal';
import { StepsPermitIdentificationComponent } from './components/anonymous/permit-wizard-steps/steps-permit-identification.component';
import { StepsPermitPurposeComponent } from './components/anonymous/permit-wizard-steps/steps-permit-purpose.component';
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
import { StepWorkerLicenceTypeAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/step-worker-licence-type-anonymous.component';
import { StepsWorkerLicenceIdentificationAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/steps-worker-licence-identification-anonymous.component';
import { StepsWorkerLicenceReviewAnonymousComponent } from './components/anonymous/worker-licence-wizard-steps/steps-worker-licence-review-anonymous.component';
import { UserApplicationsAuthenticatedComponent } from './components/authenticated/user-applications-authenticated.component';
import { UserFirstTimeLoginModalComponent } from './components/authenticated/user-first-time-login-modal.component';
import { UserLoginProfileComponent } from './components/authenticated/user-login-profile.component';
import { WorkerLicenceApplicationBaseAuthenticatedComponent } from './components/authenticated/worker-licence-application-base-authenticated.component';
import { StepWorkerLicenceAllUpdatesAuthenticatedComponent } from './components/authenticated/worker-licence-step-update-components/step-worker-licence-all-updates-authenticated.component';
import { StepWorkerLicenceConfirmUpdatesAuthenticatedComponent } from './components/authenticated/worker-licence-step-update-components/step-worker-licence-confirm-updates-authenticated.component';
import { StepWorkerLicenceMailingAddressUpdateAuthenticatedComponent } from './components/authenticated/worker-licence-step-update-components/step-worker-licence-mailing-address-update-authenticated.component';
import { WorkerLicenceCategoryUpdateAuthenticatedModalComponent } from './components/authenticated/worker-licence-step-update-components/worker-licence-category-update-authenticated-modal.component';
import { WorkerLicenceDogsUpdateAuthenticatedModalComponent } from './components/authenticated/worker-licence-step-update-components/worker-licence-dogs-update-authenticated-modal.component';
import { WorkerLicenceNameChangeUpdateAuthenticatedModalComponent } from './components/authenticated/worker-licence-step-update-components/worker-licence-name-change-update-authenticated-modal.component';
import { WorkerLicencePhotoUpdateAuthenticatedModalComponent } from './components/authenticated/worker-licence-step-update-components/worker-licence-photo-update-authenticated-modal.component';
import { WorkerLicenceRestraintsUpdateAuthenticatedModalComponent } from './components/authenticated/worker-licence-step-update-components/worker-licence-restraints-update-authenticated-modal.component';
import { WorkerLicenceWizardAuthenticatedNewComponent } from './components/authenticated/worker-licence-wizard-authenticated-new.component';
import { WorkerLicenceWizardAuthenticatedRenewComponent } from './components/authenticated/worker-licence-wizard-authenticated-renew.component';
import { WorkerLicenceWizardAuthenticatedUpdateComponent } from './components/authenticated/worker-licence-wizard-authenticated-update.component';
import { StepWorkerLicenceAccessCodeAuthorizedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-access-code-authorized.component';
import { StepWorkerLicenceApplicationTypeAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-application-type-authenticated.component';
import { StepWorkerLicenceSummaryReviewAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-summary-review-authenticated.component';
import { StepWorkerLicenceTypeAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/step-worker-licence-type-authenticated.component';
import { StepsWorkerLicenceIdentificationAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-worker-licence-identification-authenticated.component';
import { StepsWorkerLicenceReviewAuthenticatedComponent } from './components/authenticated/worker-licence-wizard-steps/steps-worker-licence-review-authenticated.component';
import { BusinessApplicationBaseComponent } from './components/business/business-application-base.component';
import { BusinessWizardNewComponent } from './components/business/business-wizard-new.component';
import { StepBusinessLicenceChecklistNewComponent } from './components/business/step-business-licence-checklist-new.component';
import { StepBusinessLicenceExpiredComponent } from './components/business/step-business-licence-expired.component';
import { StepsBusinessInformationNewComponent } from './components/business/steps-business-information-new.component';
import { UserBusinessApplicationsComponent } from './components/business/user-business-applications.component';
import { LicencePaymentCancelComponent } from './components/shared/licence-payment-cancel.component';
import { LicencePaymentErrorComponent } from './components/shared/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/shared/licence-payment-fail.component';
import { LicencePaymentSuccessComponent } from './components/shared/licence-payment-success.component';
import { LicenceUpdateReceivedSuccessComponent } from './components/shared/licence-update-received-success.component';
import { LoginSelectionComponent } from './components/shared/login-selection.component';
import { CommonAccessCodeAnonymousComponent } from './components/shared/step-components/common-access-code-anonymous.component';
import { CommonAliasListComponent } from './components/shared/step-components/common-alias-list.component';
import { CommonAliasesComponent } from './components/shared/step-components/common-aliases.component';
import { CommonBcDriverLicenceComponent } from './components/shared/step-components/common-bc-driver-licence.component';
import { CommonContactInformationComponent } from './components/shared/step-components/common-contact-information.component';
import { CommonCriminalHistoryComponent } from './components/shared/step-components/common-criminal-history.component';
import { CommonExpiredLicenceComponent } from './components/shared/step-components/common-expired-licence.component';
import { CommonFingerprintsComponent } from './components/shared/step-components/common-fingerprints.component';
import { CommonMailingAddressComponent } from './components/shared/step-components/common-mailing-address.component';
import { CommonPersonalInformationNewAnonymousComponent } from './components/shared/step-components/common-personal-information-new-anonymous.component';
import { CommonPersonalInformationRenewAnonymousComponent } from './components/shared/step-components/common-personal-information-renew-anonymous.component';
import { CommonPhotographOfYourselfComponent } from './components/shared/step-components/common-photograph-of-yourself.component';
import { CommonPhysicalCharacteristicsComponent } from './components/shared/step-components/common-physical-characteristics.component';
import { CommonReprintComponent } from './components/shared/step-components/common-reprint.component';
import { CommonResidentialAddressComponent } from './components/shared/step-components/common-residential-address.component';
import { CommonUpdateRenewalAlertComponent } from './components/shared/step-components/common-update-renewal-alert.component';
import { CommonUserProfilePersonalInformationComponent } from './components/shared/step-components/common-user-profile-personal-information.component';
import { CommonUserProfileComponent } from './components/shared/step-components/common-user-profile.component';
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
import { StepWorkerLicenceAdditionalGovIdComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-additional-gov-id.component';
import { StepWorkerLicenceAliasesComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-aliases.component';
import { StepWorkerLicenceBcDriverLicenceComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-bc-driver-licence.component';
import { StepWorkerLicenceCategoryComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-category.component';
import { StepWorkerLicenceChecklistNewComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-checklist-new.component';
import { StepWorkerLicenceChecklistRenewalComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-checklist-renewal.component';
import { StepWorkerLicenceChecklistUpdateComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-checklist-update.component';
import { StepWorkerLicenceCitizenshipComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-citizenship.component';
import { StepWorkerLicenceConsentComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-consent.component';
import { StepWorkerLicenceContactInformationComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-contact-information.component';
import { StepWorkerLicenceCriminalHistoryComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-criminal-history.component';
import { StepWorkerLicenceDogsAuthorizationComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-dogs-authorization.component';
import { StepWorkerLicenceExpiredComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-expired.component';
import { StepWorkerLicenceFingerprintsComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-fingerprints.component';
import { StepWorkerLicenceMailingAddressComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-mailing-address.component';
import { StepWorkerLicenceMentalHealthConditionsComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-mental-health-conditions.component';
import { StepWorkerLicencePhotographOfYourselfAnonymousComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself-anonymous.component';
import { StepWorkerLicencePhotographOfYourselfComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-photograph-of-yourself.component';
import { StepWorkerLicencePhysicalCharacteristicsComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-physical-characteristics.component';
import { StepWorkerLicencePoliceBackgroundComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-police-background.component';
import { StepWorkerLicenceReprintComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-reprint.component';
import { StepWorkerLicenceResidentialAddressComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-residential-address.component';
import { StepWorkerLicenceRestraintsComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-restraints.component';
import { StepWorkerLicenceSoleProprietorComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-sole-proprietor.component';
import { StepWorkerLicenceTermComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-term.component';
import { StepWorkerLicenceUserProfileComponent } from './components/shared/worker-licence-wizard-steps/step-worker-licence-user-profile.component';
import { StepsWorkerLicenceBackgroundRenewAndUpdateComponent } from './components/shared/worker-licence-wizard-steps/steps-worker-licence-background-renew-and-update.component';
import { StepsWorkerLicenceBackgroundComponent } from './components/shared/worker-licence-wizard-steps/steps-worker-licence-background.component';
import { StepsWorkerLicenceSelectionComponent } from './components/shared/worker-licence-wizard-steps/steps-worker-licence-selection.component';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { LicenceApplicationService } from './services/licence-application.service';

@NgModule({
	declarations: [
		CommonAliasListComponent,
		CommonAliasesComponent,
		CommonBcDriverLicenceComponent,
		CommonCriminalHistoryComponent,
		CommonExpiredLicenceComponent,
		CommonFingerprintsComponent,
		CommonPersonalInformationNewAnonymousComponent,
		CommonPersonalInformationRenewAnonymousComponent,
		CommonPhysicalCharacteristicsComponent,
		CommonPhotographOfYourselfComponent,
		CommonContactInformationComponent,
		UserFirstTimeLoginModalComponent,
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
		LicencePaymentCancelComponent,
		LicencePaymentErrorComponent,
		LicencePaymentFailComponent,
		LicencePaymentSuccessComponent,
		LoginSelectionComponent,
		UserLoginProfileComponent,
		CommonMailingAddressComponent,
		CommonUserProfilePersonalInformationComponent,
		CommonUpdateRenewalAlertComponent,
		CommonResidentialAddressComponent,
		StepWorkerLicenceAccessCodeAuthorizedComponent,
		StepWorkerLicenceAdditionalGovIdComponent,
		StepWorkerLicenceAliasesComponent,
		StepWorkerLicenceApplicationTypeAnonymousComponent,
		StepWorkerLicenceApplicationTypeAuthenticatedComponent,
		StepWorkerLicenceBcDriverLicenceComponent,
		StepWorkerLicenceChecklistNewComponent,
		StepWorkerLicenceChecklistRenewalComponent,
		StepWorkerLicenceChecklistUpdateComponent,
		StepWorkerLicenceCitizenshipComponent,
		StepWorkerLicenceMailingAddressUpdateAuthenticatedComponent,
		StepWorkerLicenceConfirmUpdatesAuthenticatedComponent,
		StepWorkerLicenceConsentComponent,
		StepWorkerLicenceContactInformationComponent,
		StepWorkerLicenceCriminalHistoryComponent,
		StepWorkerLicenceDogsAuthorizationComponent,
		StepWorkerLicenceFingerprintsComponent,
		CommonAccessCodeAnonymousComponent,
		StepWorkerLicenceAccessCodeComponent,
		StepWorkerLicenceCategoryComponent,
		StepWorkerLicenceConfirmationComponent,
		StepWorkerLicenceExpiredComponent,
		StepWorkerLicenceTermComponent,
		StepWorkerLicenceTypeAnonymousComponent,
		StepWorkerLicenceTypeAuthenticatedComponent,
		StepWorkerLicenceAllUpdatesAuthenticatedComponent,
		StepWorkerLicenceUserProfileComponent,
		StepWorkerLicenceMailingAddressComponent,
		StepWorkerLicenceMentalHealthConditionsComponent,
		StepWorkerLicencePersonalInformationAnonymousComponent,
		StepWorkerLicencePhotographOfYourselfComponent,
		StepWorkerLicencePhysicalCharacteristicsComponent,
		StepWorkerLicencePoliceBackgroundComponent,
		StepWorkerLicenceResidentialAddressComponent,
		StepWorkerLicenceRestraintsComponent,
		StepWorkerLicenceSoleProprietorComponent,
		StepWorkerLicenceSummaryReviewAnonymousComponent,
		StepWorkerLicenceSummaryReviewAuthenticatedComponent,
		StepsWorkerLicenceBackgroundComponent,
		StepsWorkerLicenceBackgroundRenewAndUpdateComponent,
		StepsWorkerLicenceIdentificationAnonymousComponent,
		StepsWorkerLicenceIdentificationAuthenticatedComponent,
		StepsWorkerLicenceSelectionComponent,
		StepsWorkerLicenceReviewAnonymousComponent,
		StepsWorkerLicenceReviewAuthenticatedComponent,
		WorkerLicenceDogsUpdateAuthenticatedModalComponent,
		WorkerLicenceRestraintsUpdateAuthenticatedModalComponent,
		WorkerLicenceNameChangeUpdateAuthenticatedModalComponent,
		WorkerLicenceCategoryUpdateAuthenticatedModalComponent,
		WorkerLicencePhotoUpdateAuthenticatedModalComponent,
		UserApplicationsAuthenticatedComponent,
		CommonUserProfileComponent,
		WorkerLicenceApplicationBaseAnonymousComponent,
		WorkerLicenceApplicationBaseAuthenticatedComponent,
		WorkerLicenceWizardAnonymousNewComponent,
		WorkerLicenceWizardAnonymousRenewalComponent,
		WorkerLicenceWizardAnonymousReplacementComponent,
		WorkerLicenceWizardAnonymousUpdateComponent,
		WorkerLicenceWizardAuthenticatedNewComponent,
		WorkerLicenceWizardAuthenticatedRenewComponent,
		WorkerLicenceWizardAuthenticatedUpdateComponent,
		PermitApplicationBaseAnonymousComponent,
		StepPermitChecklistNewComponent,
		StepPermitChecklistRenewalComponent,
		StepPermitChecklistUpdateComponent,
		StepPermitAliasesComponent,
		StepPermitCitizenshipComponent,
		StepPermitContactInformationComponent,
		StepPermitTypeAnonymousComponent,
		StepPermitExpiredComponent,
		StepPermitMailingAddressComponent,
		StepPermitPrintComponent,
		StepPermitResidentialAddressComponent,
		StepPermitReasonComponent,
		StepPermitRationaleComponent,
		StepPermitPersonalInformationComponent,
		StepPermitEmployerInformationComponent,
		StepPermitCriminalHistoryComponent,
		StepPermitFingerprintsComponent,
		StepsPermitDetailsUpdateComponent,
		StepsPermitDetailsNewComponent,
		StepsPermitDetailsRenewalComponent,
		StepsPermitPurposeComponent,
		StepsPermitContactComponent,
		StepPermitAccessCodeComponent,
		StepPermitConfirmationComponent,
		StepsPermitIdentificationComponent,
		StepPermitBcDriverLicenceComponent,
		StepPermitPhysicalCharacteristicsComponent,
		StepPermitPhotographOfYourselfComponent,
		PermitWizardAnonymousNewComponent,
		PermitWizardAnonymousRenewalComponent,
		PermitWizardAnonymousUpdateComponent,
		StepsPermitReviewAnonymousComponent,
		StepPermitPhotographOfYourselfAnonymousComponent,
		StepWorkerLicencePhotographOfYourselfAnonymousComponent,
		StepPermitSummaryAnonymousComponent,
		StepPermitConsentAndDeclarationComponent,
		StepBusinessChecklistNewComponent,
		BusinessApplicationBaseComponent,
		UserBusinessApplicationsComponent,
		BusinessWizardNewComponent,
		StepsBusinessInformationNewComponent,
		StepBusinessLicenceChecklistNewComponent,
		StepBusinessLicenceExpiredComponent,
		CommonReprintComponent,
		StepWorkerLicenceReprintComponent,
		LicenceUpdateReceivedSuccessComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
	providers: [LicenceApplicationService],
})
export class LicenceApplicationModule {}
