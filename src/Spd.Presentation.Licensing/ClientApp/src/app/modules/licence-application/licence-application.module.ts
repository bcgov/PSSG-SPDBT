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
import { AdditionalGovIdComponent } from './step-components/additional-gov-id.component';
import { AliasListComponent } from './step-components/alias-list.component';
import { AliasesComponent } from './step-components/aliases.component';
import { BackgroundInfoComponent } from './step-components/background-info.component';
import { BcDriverLicenceComponent } from './step-components/bc-driver-licence.component';
import { ChecklistComponent } from './step-components/checklist.component';
import { CitizenshipComponent } from './step-components/citizenship.component';
import { ConsentAndDeclarationComponent } from './step-components/consent-and-declaration.component';
import { ContactInformationComponent } from './step-components/contact-information.component';
import { CriminalHistoryComponent } from './step-components/criminal-history.component';
import { DogsAuthorizationComponent } from './step-components/dogs-authorization.component';
import { FingerprintTearOffModalComponent } from './step-components/fingerprint-tear-off-modal.component';
import { FingerprintsComponent } from './step-components/fingerprints.component';
import { HeightAndWeightComponent } from './step-components/height-and-weight.component';
import { LicenceAccessCodeComponent } from './step-components/licence-access-code.component';
import { LicenceApplicationTypeComponent } from './step-components/licence-application-type.component';
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
import { LicenceCategoryComponent } from './step-components/licence-category.component';
import { LicenceExpiredComponent } from './step-components/licence-expired.component';
import { LicenceTermComponent } from './step-components/licence-term.component';
import { LicenceTypeSelectionComponent } from './step-components/licence-type-selection.component';
import { LicenceUserProfileComponent } from './step-components/licence-user-profile.component';
import { MailingAddressComponent } from './step-components/mailing-address.component';
import { MentalHealthConditionsComponent } from './step-components/mental-health-conditions.component';
import { PersonalInformationComponent } from './step-components/personal-information.component';
import { PhotographOfYourselfComponent } from './step-components/photograph-of-yourself.component';
import { PoliceBackgroundComponent } from './step-components/police-background.component';
import { ResidentialAddressComponent } from './step-components/residential-address.component';
import { RestraintsAuthorizationComponent } from './step-components/restraints-authorization.component';
import { SoleProprietorComponent } from './step-components/sole-proprietor.component';
import { StepAliasesComponent } from './step-components/step-aliases.component';
import { StepContactInformationComponent } from './step-components/step-contact-information.component';
import { StepMailingAddressComponent } from './step-components/step-mailing-address.component';
import { StepPersonalInformationComponent } from './step-components/step-personal-information.component';
import { StepResidentialAddressComponent } from './step-components/step-residential-address.component';
import { SummaryReviewAnonymousComponent } from './step-components/summary-review-anonymous.component';
import { SummaryReviewAuthenticatedComponent } from './step-components/summary-review-authenticated.component';
import { UserProfileComponent } from './step-components/user-profile.component';
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
		LicenceTypeSelectionComponent,
		LicenceApplicationTypeComponent,
		LoginUserProfileComponent,
		SoleProprietorComponent,
		ChecklistComponent,
		PersonalInformationComponent,
		LicenceExpiredComponent,
		PoliceBackgroundComponent,
		RestraintsAuthorizationComponent,
		DogsAuthorizationComponent,
		MentalHealthConditionsComponent,
		CriminalHistoryComponent,
		FingerprintsComponent,
		AliasesComponent,
		AliasListComponent,
		CitizenshipComponent,
		BcDriverLicenceComponent,
		HeightAndWeightComponent,
		PhotographOfYourselfComponent,
		ContactInformationComponent,
		ResidentialAddressComponent,
		MailingAddressComponent,
		LicenceTermComponent,
		SummaryReviewAnonymousComponent,
		SummaryReviewAuthenticatedComponent,
		ConsentAndDeclarationComponent,
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
		LicenceCategoryComponent,
		AdditionalGovIdComponent,
		LicenceAccessCodeComponent,
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
		BackgroundInfoComponent,
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
		LicenceUserProfileComponent,
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
