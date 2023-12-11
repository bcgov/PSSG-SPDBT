import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LicencePaymentErrorComponent } from './components/licence-payment-error.component';
import { LicencePaymentFailComponent } from './components/licence-payment-fail.component';
import { LicencePaymentManualComponent } from './components/licence-payment-manual.component';
import { LicencePaymentSuccessComponent } from './components/licence-payment-success.component';
import { LoginSelectionComponent } from './components/login-selection.component';
import { LoginUserProfileComponent } from './components/login-user-profile.component';
import { SecurityWorkerLicenceApplicationComponent } from './components/security-worker-licence-application.component';
import { SecurityWorkerLicenceWizardAnonymousComponent } from './components/security-worker-licence-wizard-anonymous.component';
import { SecurityWorkerLicenceWizardAuthenticatedComponent } from './components/security-worker-licence-wizard-authenticated.component';
import { SecurityWorkerLicenceWizardUpdateComponent } from './components/security-worker-licence-wizard-update.component';
import { UserApplicationsAnonymousComponent } from './components/user-applications-anonymous.component';
import { UserApplicationsAuthenticatedComponent } from './components/user-applications-authenticated.component';
import { LicenceApplicationRoutingModule } from './licence-application-routing.module';
import { LicenceApplicationComponent } from './licence-application.component';
import { LicenceApplicationAnonymousService } from './services/licence-application-anonymous.service';
import { LicenceApplicationAuthenticatedService } from './services/licence-application-authenticated.service';
import { LicenceApplicationService } from './services/licence-application.service';
import { LicenceUserService } from './services/licence-user.service';
import { AliasListComponent } from './step-components/alias-list.component';
import { AliasesComponent } from './step-components/aliases.component';
import { FingerprintTearOffModalComponent } from './step-components/fingerprint-tear-off-modal.component';
import { LicenceCategoryArmouredCarGuardComponent } from './step-components/licence-category-armoured-car-guard.component';
import { LicenceCategoryBodyArmourSalesComponent } from './step-components/licence-category-body-armour-sales.component';
import { LicenceCategoryClosedCircuitTelevisionInstallerComponent } from './step-components/licence-category-closed-circuit-television-installer.component';
import { LicenceCategoryElectronicLockingDeviceInstallerComponent } from './step-components/licence-category-electronic-locking-device-installer.component';
import { LicenceCategoryFireInvestigatorComponent } from './step-components/licence-category-fire-investigator.component';
import { LicenceCategoryLocksmithSupComponent } from './step-components/licence-category-locksmith-sup.component';
import { LicenceCategoryLocksmithComponent } from './step-components/licence-category-locksmith.component';
import { LicenceCategoryPrivateInvestigatorSupComponent } from './step-components/licence-category-private-investigator-sup.component';
import { LicenceCategoryPrivateInvestigatorComponent } from './step-components/licence-category-private-investigator.component';
import { LicenceCategorySecurityAlarmInstallerSupComponent } from './step-components/licence-category-security-alarm-installer-sup.component';
import { LicenceCategorySecurityAlarmInstallerComponent } from './step-components/licence-category-security-alarm-installer.component';
import { LicenceCategorySecurityAlarmMonitorComponent } from './step-components/licence-category-security-alarm-monitor.component';
import { LicenceCategorySecurityAlarmResponseComponent } from './step-components/licence-category-security-alarm-response.component';
import { LicenceCategorySecurityAlarmSalesComponent } from './step-components/licence-category-security-alarm-sales.component';
import { LicenceCategorySecurityConsultantComponent } from './step-components/licence-category-security-consultant.component';
import { LicenceCategorySecurityGuardSupComponent } from './step-components/licence-category-security-guard-sup.component';
import { LicenceCategorySecurityGuardComponent } from './step-components/licence-category-security-guard.component';
import { MailingAddressComponent } from './step-components/mailing-address.component';
import { PersonalInformationComponent } from './step-components/personal-information.component';
import { ResidentialAddressComponent } from './step-components/residential-address.component';
import { UserProfileComponent } from './step-components/user-profile.component';
import { ContactInformationComponent } from './step-components/wizard-child-steps/contact-information.component';
import { StepAdditionalGovIdComponent } from './step-components/wizard-child-steps/step-additional-gov-id.component';
import { StepAliasesComponent } from './step-components/wizard-child-steps/step-aliases.component';
import { StepBackgroundInfoComponent } from './step-components/wizard-child-steps/step-background-info.component';
import { StepBcDriverLicenceComponent } from './step-components/wizard-child-steps/step-bc-driver-licence.component';
import { StepChecklistComponent } from './step-components/wizard-child-steps/step-checklist.component';
import { StepCitizenshipComponent } from './step-components/wizard-child-steps/step-citizenship.component';
import { StepConsentAndDeclarationComponent } from './step-components/wizard-child-steps/step-consent-and-declaration.component';
import { StepContactInformationComponent } from './step-components/wizard-child-steps/step-contact-information.component';
import { StepCriminalHistoryComponent } from './step-components/wizard-child-steps/step-criminal-history.component';
import { StepDogsAuthorizationComponent } from './step-components/wizard-child-steps/step-dogs-authorization.component';
import { StepFingerprintsComponent } from './step-components/wizard-child-steps/step-fingerprints.component';
import { StepHeightAndWeightComponent } from './step-components/wizard-child-steps/step-height-and-weight.component';
import { StepLicenceAccessCodeComponent } from './step-components/wizard-child-steps/step-licence-access-code.component';
import { StepLicenceApplicationTypeComponent } from './step-components/wizard-child-steps/step-licence-application-type.component';
import { StepLicenceCategoryComponent } from './step-components/wizard-child-steps/step-licence-category.component';
import { StepLicenceExpiredComponent } from './step-components/wizard-child-steps/step-licence-expired.component';
import { StepLicenceTermComponent } from './step-components/wizard-child-steps/step-licence-term.component';
import { StepLicenceTypeSelectionComponent } from './step-components/wizard-child-steps/step-licence-type-selection.component';
import { StepLicenceUserProfileComponent } from './step-components/wizard-child-steps/step-licence-user-profile.component';
import { StepMailingAddressComponent } from './step-components/wizard-child-steps/step-mailing-address.component';
import { StepMentalHealthConditionsComponent } from './step-components/wizard-child-steps/step-mental-health-conditions.component';
import { StepPersonalInformationComponent } from './step-components/wizard-child-steps/step-personal-information.component';
import { StepPhotographOfYourselfComponent } from './step-components/wizard-child-steps/step-photograph-of-yourself.component';
import { StepPoliceBackgroundComponent } from './step-components/wizard-child-steps/step-police-background.component';
import { StepResidentialAddressComponent } from './step-components/wizard-child-steps/step-residential-address.component';
import { StepRestraintsAuthorizationComponent } from './step-components/wizard-child-steps/step-restraints-authorization.component';
import { StepSoleProprietorComponent } from './step-components/wizard-child-steps/step-sole-proprietor.component';
import { StepSummaryReviewAnonymousComponent } from './step-components/wizard-child-steps/step-summary-review-anonymous.component';
import { StepSummaryReviewAuthenticatedComponent } from './step-components/wizard-child-steps/step-summary-review-authenticated.component';
import { StepBackgroundComponent } from './step-components/wizard-steps/step-background.component';
import { StepIdentificationAnonymousComponent } from './step-components/wizard-steps/step-identification-anonymous.component';
import { StepIdentificationAuthenticatedComponent } from './step-components/wizard-steps/step-identification-authenticated.component';
import { StepLicenceSelectionComponent } from './step-components/wizard-steps/step-licence-selection.component';
import { StepLicenceSetupAnonymousComponent } from './step-components/wizard-steps/step-licence-setup-anonymous.component';
import { StepLicenceSetupAuthenticatedComponent } from './step-components/wizard-steps/step-licence-setup-authenticated.component';
import { StepReviewAnonymousComponent } from './step-components/wizard-steps/step-review-anonymous.component';
import { StepReviewAuthenticatedComponent } from './step-components/wizard-steps/step-review-authenticated.component';
import { UpdateAddDogsModalComponent } from './step-update-components/update-add-dogs-modal.component';
import { UpdateAddRestraintsModalComponent } from './step-update-components/update-add-restraints-modal.component';
import { UpdateApplyNameChangeModalComponent } from './step-update-components/update-apply-name-change-modal.component';
import { UpdateLicenceCategoryModalComponent } from './step-update-components/update-licence-category-modal.component';
import { UpdatePhotoModalComponent } from './step-update-components/update-photo-modal.component';
import { StepConfirmMailingAddressComponent } from './step-update-components/wizard-update-steps/step-confirm-mailing-address.component';
import { StepConfirmUpdatesComponent } from './step-update-components/wizard-update-steps/step-confirm-updates.component';
import { StepLicenceUpdatesComponent } from './step-update-components/wizard-update-steps/step-licence-updates.component';

@NgModule({
	declarations: [
		LicenceApplicationComponent,
		StepLicenceTypeSelectionComponent,
		StepLicenceApplicationTypeComponent,
		LoginUserProfileComponent,
		StepSoleProprietorComponent,
		StepChecklistComponent,
		PersonalInformationComponent,
		StepLicenceExpiredComponent,
		StepPoliceBackgroundComponent,
		StepRestraintsAuthorizationComponent,
		StepDogsAuthorizationComponent,
		StepMentalHealthConditionsComponent,
		StepCriminalHistoryComponent,
		StepFingerprintsComponent,
		AliasesComponent,
		AliasListComponent,
		StepCitizenshipComponent,
		StepBcDriverLicenceComponent,
		StepHeightAndWeightComponent,
		StepPhotographOfYourselfComponent,
		ContactInformationComponent,
		ResidentialAddressComponent,
		MailingAddressComponent,
		StepLicenceTermComponent,
		StepSummaryReviewAnonymousComponent,
		StepSummaryReviewAuthenticatedComponent,
		StepConsentAndDeclarationComponent,
		LicencePaymentSuccessComponent,
		LicencePaymentFailComponent,
		LicencePaymentManualComponent,
		LicencePaymentErrorComponent,
		StepAliasesComponent,
		StepContactInformationComponent,
		StepResidentialAddressComponent,
		StepMailingAddressComponent,
		StepLicenceSetupAnonymousComponent,
		StepLicenceSetupAuthenticatedComponent,
		StepLicenceSelectionComponent,
		StepBackgroundComponent,
		StepIdentificationAuthenticatedComponent,
		StepIdentificationAnonymousComponent,
		StepPersonalInformationComponent,
		StepReviewAnonymousComponent,
		StepReviewAuthenticatedComponent,
		StepLicenceCategoryComponent,
		StepAdditionalGovIdComponent,
		StepLicenceAccessCodeComponent,
		LicenceCategoryLocksmithComponent,
		LicenceCategoryArmouredCarGuardComponent,
		LicenceCategoryBodyArmourSalesComponent,
		LicenceCategoryClosedCircuitTelevisionInstallerComponent,
		LicenceCategoryElectronicLockingDeviceInstallerComponent,
		LicenceCategoryFireInvestigatorComponent,
		LicenceCategoryLocksmithSupComponent,
		LicenceCategoryPrivateInvestigatorComponent,
		LicenceCategoryPrivateInvestigatorSupComponent,
		LicenceCategorySecurityGuardComponent,
		LicenceCategorySecurityGuardSupComponent,
		LicenceCategorySecurityAlarmInstallerSupComponent,
		LicenceCategorySecurityAlarmInstallerComponent,
		LicenceCategorySecurityAlarmMonitorComponent,
		LicenceCategorySecurityAlarmResponseComponent,
		LicenceCategorySecurityAlarmSalesComponent,
		LicenceCategorySecurityConsultantComponent,
		LoginSelectionComponent,
		SecurityWorkerLicenceWizardAnonymousComponent,
		SecurityWorkerLicenceWizardAuthenticatedComponent,
		StepBackgroundInfoComponent,
		SecurityWorkerLicenceWizardUpdateComponent,
		StepLicenceUpdatesComponent,
		StepConfirmMailingAddressComponent,
		StepConfirmUpdatesComponent,
		UpdateApplyNameChangeModalComponent,
		UpdateLicenceCategoryModalComponent,
		UserProfileComponent,
		UpdateAddRestraintsModalComponent,
		UpdateAddDogsModalComponent,
		UpdatePhotoModalComponent,
		SecurityWorkerLicenceApplicationComponent,
		UserApplicationsAuthenticatedComponent,
		UserApplicationsAnonymousComponent,
		FingerprintTearOffModalComponent,
		StepLicenceUserProfileComponent,
	],
	imports: [SharedModule, LicenceApplicationRoutingModule],
	providers: [
		LicenceApplicationService,
		LicenceApplicationAnonymousService,
		LicenceApplicationAuthenticatedService,
		LicenceUserService,
	],
})
export class LicenceApplicationModule {}
