import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { GdsdLicenceMainApplicationsListComponent } from './components/authenticated/gdsd-licence-main-applications-list.component';
import { GdsdLicenceMainLicencesListComponent } from './components/authenticated/gdsd-licence-main-licences-list.component';
import { GdsdLicenceMainComponent } from './components/authenticated/gdsd-licence-main.component';
import { DogTrainerWizardNewRenewalComponent } from './components/dog-trainer/dog-trainer-wizard-new-renewal.component';
import { DogTrainerWizardReplacementComponent } from './components/dog-trainer/dog-trainer-wizard-replacement.component';
import { StepDtApplicationTypeComponent } from './components/dog-trainer/step-dt-application-type.component';
import { StepDtChecklistNewComponent } from './components/dog-trainer/step-dt-checklist-new.component';
import { StepDtChecklistRenewalComponent } from './components/dog-trainer/step-dt-checklist-renewal.component';
import { StepDtConsentComponent } from './components/dog-trainer/step-dt-consent.component';
import { StepDtDogTrainerInfoComponent } from './components/dog-trainer/step-dt-dog-trainer-info.component';
import { StepDtGovermentPhotoIdComponent } from './components/dog-trainer/step-dt-goverment-photo-id.component';
import { StepDtLicenceAccessCodeComponent } from './components/dog-trainer/step-dt-licence-access-code.component';
import { StepDtLicenceConfirmationComponent } from './components/dog-trainer/step-dt-licence-confirmation.component';
import { StepDtMailingAddressReplacementComponent } from './components/dog-trainer/step-dt-mailing-address-replacement.component';
import { StepDtMailingAddressComponent } from './components/dog-trainer/step-dt-mailing-address.component';
import { StepDtPhotographOfYourselfRenewComponent } from './components/dog-trainer/step-dt-photograph-of-yourself-renew.component';
import { StepDtPhotographOfYourselfComponent } from './components/dog-trainer/step-dt-photograph-of-yourself.component';
import { StepDtSummaryComponent } from './components/dog-trainer/step-dt-summary.component';
import { StepDtTermsOfUseComponent } from './components/dog-trainer/step-dt-terms-of-use.component';
import { StepDtTrainingSchoolInfoComponent } from './components/dog-trainer/step-dt-training-school-info.component';
import { StepsDtDetailsComponent } from './components/dog-trainer/steps-dt-details.component';
import { StepsDtPersonalInfoComponent } from './components/dog-trainer/steps-dt-personal-info.component';
import { StepsDtReviewAndConfirmComponent } from './components/dog-trainer/steps-dt-review-and-confirm.component';
import { StepsDtTrainingSchoolInfoComponent } from './components/dog-trainer/steps-dt-training-school-info.component';
import { GdsdBaseAnonymousComponent } from './components/gdsd-base-anonymous.component';
import { GdsdBaseAuthenticatedComponent } from './components/gdsd-base-authenticated.component';
import { GdsdLandingComponent } from './components/gdsd-landing.component';
import { GdsdApplicationReceivedSuccessComponent } from './components/gdsd-team/gdsd-application-received-success.component';
import { GdsdSummaryAccreditedTrainingComponent } from './components/gdsd-team/gdsd-summary-accredited-training.component';
import { GdsdSummaryOtherTrainingComponent } from './components/gdsd-team/gdsd-summary-other-training.component';
import { GdsdSummarySchoolTrainingComponent } from './components/gdsd-team/gdsd-summary-school-training.component';
import { GdsdTeamWizardNewRenewalComponent } from './components/gdsd-team/gdsd-team-wizard-new-renewal.component';
import { GdsdTeamWizardReplacementComponent } from './components/gdsd-team/gdsd-team-wizard-replacement.component';
import { StepTeamAccreditedGraduationComponent } from './components/gdsd-team/step-team-accredited-graduation.component';
import { StepTeamApplicationTypeComponent } from './components/gdsd-team/step-team-application-type.component';
import { StepTeamChecklistNewComponent } from './components/gdsd-team/step-team-checklist-new.component';
import { StepTeamChecklistRenewalComponent } from './components/gdsd-team/step-team-checklist-renewal.component';
import { StepTeamConsentComponent } from './components/gdsd-team/step-team-consent.component';
import { StepTeamDogCertificationSelectionComponent } from './components/gdsd-team/step-team-dog-certification-selection.component';
import { StepTeamDogInfoComponent } from './components/gdsd-team/step-team-dog-info.component';
import { StepTeamDogInoculationsComponent } from './components/gdsd-team/step-team-dog-inoculations.component';
import { StepTeamDogMedicalComponent } from './components/gdsd-team/step-team-dog-medical.component';
import { StepTeamDogServiceInfoComponent } from './components/gdsd-team/step-team-dog-service-info.component';
import { StepTeamDogTasksComponent } from './components/gdsd-team/step-team-dog-tasks.component';
import { StepTeamGovermentPhotoIdComponent } from './components/gdsd-team/step-team-goverment-photo-id.component';
import { StepTeamLicenceAccessCodeComponent } from './components/gdsd-team/step-team-licence-access-code.component';
import { StepTeamLicenceConfirmationComponent } from './components/gdsd-team/step-team-licence-confirmation.component';
import { StepTeamMailingAddressReplacementComponent } from './components/gdsd-team/step-team-mailing-address-replacement.component';
import { StepTeamMailingAddressComponent } from './components/gdsd-team/step-team-mailing-address.component';
import { StepTeamMedicalInfoComponent } from './components/gdsd-team/step-team-medical-info.component';
import { StepTeamOtherTrainingsComponent } from './components/gdsd-team/step-team-other-trainings.component';
import { StepTeamPersonalInfoAnonymousComponent } from './components/gdsd-team/step-team-personal-info-anonymous.component';
import { StepTeamPersonalInfoComponent } from './components/gdsd-team/step-team-personal-info.component';
import { StepTeamPhotographOfYourselfRenewComponent } from './components/gdsd-team/step-team-photograph-of-yourself-renew.component';
import { StepTeamPhotographOfYourselfComponent } from './components/gdsd-team/step-team-photograph-of-yourself.component';
import { StepTeamSchoolTrainingsComponent } from './components/gdsd-team/step-team-school-trainings.component';
import { StepTeamSummaryComponent } from './components/gdsd-team/step-team-summary.component';
import { StepTeamTermsOfUseComponent } from './components/gdsd-team/step-team-terms-of-use.component';
import { StepTeamTrainingHistoryComponent } from './components/gdsd-team/step-team-training-history.component';
import { StepsTeamDogInfoComponent } from './components/gdsd-team/steps-team-dog-info.component';
import { StepsTeamPersonalInfoComponent } from './components/gdsd-team/steps-team-personal-info.component';
import { StepsTeamReviewAndConfirmComponent } from './components/gdsd-team/steps-team-review-and-confirm.component';
import { StepsTeamSelectionComponent } from './components/gdsd-team/steps-team-selection.component';
import { StepsTeamTrainingInfoComponent } from './components/gdsd-team/steps-team-training-info.component';
import { RetiredDogWizardNewRenewalComponent } from './components/retired-dog/retired-dog-wizard-new-renewal.component';
import { RetiredDogWizardReplacementComponent } from './components/retired-dog/retired-dog-wizard-replacement.component';
import { StepRdApplicationTypeComponent } from './components/retired-dog/step-rd-application-type.component';
import { StepRdChecklistNewComponent } from './components/retired-dog/step-rd-checklist-new.component';
import { StepRdChecklistRenewalComponent } from './components/retired-dog/step-rd-checklist-renewal.component';
import { StepRdConsentComponent } from './components/retired-dog/step-rd-consent.component';
import { StepRdDogInfoComponent } from './components/retired-dog/step-rd-dog-info.component';
import { StepRdDogLivingInfoComponent } from './components/retired-dog/step-rd-dog-living-info.component';
import { StepRdDogRetiredInfoComponent } from './components/retired-dog/step-rd-dog-retired-info.component';
import { StepRdGdsdCertficateComponent } from './components/retired-dog/step-rd-gdsd-certificate.component';
import { StepRdGovermentPhotoIdComponent } from './components/retired-dog/step-rd-goverment-photo-id.component';
import { StepRdLicenceAccessCodeComponent } from './components/retired-dog/step-rd-licence-access-code.component';
import { StepRdLicenceConfirmationComponent } from './components/retired-dog/step-rd-licence-confirmation.component';
import { StepRdMailingAddressReplacementComponent } from './components/retired-dog/step-rd-mailing-address-replacement.component';
import { StepRdMailingAddressComponent } from './components/retired-dog/step-rd-mailing-address.component';
import { StepRdPersonalInfoAnonymousComponent } from './components/retired-dog/step-rd-personal-info-anonymous.component';
import { StepRdPersonalInfoComponent } from './components/retired-dog/step-rd-personal-info.component';
import { StepRdPhotographOfYourselfRenewComponent } from './components/retired-dog/step-rd-photograph-of-yourself-renew.component';
import { StepRdPhotographOfYourselfComponent } from './components/retired-dog/step-rd-photograph-of-yourself.component';
import { StepRdSummaryComponent } from './components/retired-dog/step-rd-summary.component';
import { StepRdTermsOfUseComponent } from './components/retired-dog/step-rd-terms-of-use.component';
import { StepsRdDetailsComponent } from './components/retired-dog/steps-rd-details.component';
import { StepsRdDogInfoComponent } from './components/retired-dog/steps-rd-dog-info.component';
import { StepsRdPersonalInfoComponent } from './components/retired-dog/steps-rd-personal-info.component';
import { StepsRdReviewAndConfirmComponent } from './components/retired-dog/steps-rd-review-and-confirm.component';
import { FormAccreditedSchoolComponent } from './components/shared/form-accredited-school.component';
import { FormGdsdApplicationTypeComponent } from './components/shared/form-gdsd-application-type.component';
import { FormGdsdDogInfoComponent } from './components/shared/form-gdsd-dog-info.component';
import { FormGdsdGovermentPhotoIdComponent } from './components/shared/form-gdsd-goverment-photo-id.component';
import { FormGdsdLicenceAccessCodeComponent } from './components/shared/form-gdsd-licence-access-code.component';
import { FormGdsdLicenceConfirmationComponent } from './components/shared/form-gdsd-licence-confirmation.component';
import { FormGdsdMailingAddressReplacementComponent } from './components/shared/form-gdsd-mailing-address-replacement.component';
import { FormGdsdPersonalInfoAnonymousComponent } from './components/shared/form-gdsd-personal-info-anonymous.component';
import { FormGdsdPersonalInfoComponent } from './components/shared/form-gdsd-personal-info.component';
import { StepGdsdTermsOfUseComponent } from './components/shared/step-gdsd-terms-of-use.component';
import { GuideDogServiceDogRoutingModule } from './guide-dog-service-dog-routing.module';

@NgModule({
	declarations: [
		GdsdBaseAnonymousComponent,
		GdsdBaseAuthenticatedComponent,
		GdsdLandingComponent,
		GdsdLicenceMainComponent,
		GdsdLicenceMainLicencesListComponent,
		StepTeamApplicationTypeComponent,
		GdsdApplicationReceivedSuccessComponent,
		GdsdSummaryAccreditedTrainingComponent,
		GdsdSummarySchoolTrainingComponent,
		GdsdSummaryOtherTrainingComponent,
		GdsdLicenceMainApplicationsListComponent,
		FormGdsdApplicationTypeComponent,
		FormGdsdLicenceAccessCodeComponent,
		FormGdsdGovermentPhotoIdComponent,
		FormGdsdLicenceConfirmationComponent,
		FormGdsdMailingAddressReplacementComponent,
		FormGdsdPersonalInfoComponent,
		FormGdsdPersonalInfoAnonymousComponent,
		FormGdsdDogInfoComponent,
		FormAccreditedSchoolComponent,
		StepGdsdTermsOfUseComponent,

		GdsdTeamWizardNewRenewalComponent,
		GdsdTeamWizardReplacementComponent,

		StepsTeamSelectionComponent,
		StepsTeamPersonalInfoComponent,
		StepsTeamDogInfoComponent,
		StepsTeamTrainingInfoComponent,
		StepsTeamReviewAndConfirmComponent,

		StepTeamChecklistNewComponent,
		StepTeamChecklistRenewalComponent,
		StepTeamPersonalInfoAnonymousComponent,
		StepTeamPersonalInfoComponent,
		StepTeamPhotographOfYourselfComponent,
		StepTeamPhotographOfYourselfRenewComponent,
		StepTeamGovermentPhotoIdComponent,
		StepTeamMailingAddressComponent,
		StepTeamDogCertificationSelectionComponent,
		StepTeamDogInfoComponent,
		StepTeamDogServiceInfoComponent,
		StepTeamAccreditedGraduationComponent,
		StepTeamConsentComponent,
		StepTeamSummaryComponent,
		StepTeamTrainingHistoryComponent,
		StepTeamSchoolTrainingsComponent,
		StepTeamOtherTrainingsComponent,
		StepTeamDogMedicalComponent,
		StepTeamDogInoculationsComponent,
		StepTeamMedicalInfoComponent,
		StepTeamDogTasksComponent,
		StepTeamLicenceAccessCodeComponent,
		StepTeamMailingAddressReplacementComponent,
		StepTeamLicenceConfirmationComponent,
		StepTeamTermsOfUseComponent,

		DogTrainerWizardNewRenewalComponent,
		DogTrainerWizardReplacementComponent,
		StepsDtDetailsComponent,
		StepsDtPersonalInfoComponent,
		StepsDtTrainingSchoolInfoComponent,
		StepsDtReviewAndConfirmComponent,
		StepDtChecklistNewComponent,
		StepDtChecklistRenewalComponent,
		StepDtTrainingSchoolInfoComponent,
		StepDtDogTrainerInfoComponent,
		StepDtMailingAddressComponent,
		StepDtSummaryComponent,
		StepDtConsentComponent,
		StepDtGovermentPhotoIdComponent,
		StepDtPhotographOfYourselfComponent,
		StepDtPhotographOfYourselfRenewComponent,
		StepDtApplicationTypeComponent,
		StepDtLicenceAccessCodeComponent,
		StepDtLicenceConfirmationComponent,
		StepDtMailingAddressReplacementComponent,
		StepDtTermsOfUseComponent,

		RetiredDogWizardNewRenewalComponent,
		RetiredDogWizardReplacementComponent,
		StepRdLicenceAccessCodeComponent,
		StepRdLicenceConfirmationComponent,
		StepRdMailingAddressReplacementComponent,
		StepRdGovermentPhotoIdComponent,
		StepsRdDetailsComponent,
		StepsRdPersonalInfoComponent,
		StepsRdDogInfoComponent,
		StepsRdReviewAndConfirmComponent,
		StepRdApplicationTypeComponent,
		StepRdMailingAddressComponent,
		StepRdPersonalInfoAnonymousComponent,
		StepRdPersonalInfoComponent,
		StepRdPhotographOfYourselfComponent,
		StepRdPhotographOfYourselfRenewComponent,
		StepRdGdsdCertficateComponent,
		StepRdDogInfoComponent,
		StepRdDogRetiredInfoComponent,
		StepRdDogLivingInfoComponent,
		StepRdConsentComponent,
		StepRdSummaryComponent,
		StepRdChecklistRenewalComponent,
		StepRdChecklistNewComponent,
		StepRdTermsOfUseComponent,
	],
	imports: [SharedModule, GuideDogServiceDogRoutingModule],
})
export class GuideDogServiceDogModule {}
