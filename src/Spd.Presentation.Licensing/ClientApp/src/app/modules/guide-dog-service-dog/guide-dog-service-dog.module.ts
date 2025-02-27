import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { GdsdBaseAnonymousComponent } from './components/anonymous/gdsd-base-anonymous.component';
import { StepDtApplicationTypeComponent } from './components/anonymous/step-dt-application-type.component';
import { StepDtChecklistNewComponent } from './components/anonymous/step-dt-checklist-new.component';
import { StepDtChecklistRenewalComponent } from './components/anonymous/step-dt-checklist-renewal.component';
import { StepDtConsentComponent } from './components/anonymous/step-dt-consent.component';
import { StepDtDogTrainerInfoComponent } from './components/anonymous/step-dt-dog-trainer-info.component';
import { StepDtGovermentPhotoIdComponent } from './components/anonymous/step-dt-goverment-photo-id.component';
import { StepDtLicenceAccessCodeComponent } from './components/anonymous/step-dt-licence-access-code.component';
import { StepDtLicenceConfirmationComponent } from './components/anonymous/step-dt-licence-confirmation.component';
import { StepDtMailingAddressReplacementComponent } from './components/anonymous/step-dt-mailing-address-replacement.component';
import { StepDtMailingAddressComponent } from './components/anonymous/step-dt-mailing-address.component';
import { StepDtPhotographOfYourselfRenewComponent } from './components/anonymous/step-dt-photograph-of-yourself-renew.component';
import { StepDtPhotographOfYourselfComponent } from './components/anonymous/step-dt-photograph-of-yourself.component';
import { StepDtSummaryComponent } from './components/anonymous/step-dt-summary.component';
import { StepDtTrainingSchoolInfoComponent } from './components/anonymous/step-dt-training-school-info.component';
import { StepDtTrainingSchoolMailingAddressComponent } from './components/anonymous/step-dt-training-school-mailing-address.component';
import { StepGdsdApplicationTypeComponent } from './components/anonymous/step-gdsd-application-type.component';
import { StepGdsdLicenceAccessCodeComponent } from './components/anonymous/step-gdsd-licence-access-code.component';
import { StepGdsdPersonalInfoAnonymousComponent } from './components/anonymous/step-gdsd-personal-info-anonymous.component';
import { StepsDtDetailsComponent } from './components/anonymous/steps-dt-details.component';
import { StepsDtPersonalInfoComponent } from './components/anonymous/steps-dt-personal-info.component';
import { StepsDtReviewConfirmComponent } from './components/anonymous/steps-dt-review-confirm.component';
import { StepsDtTrainingSchoolInfoComponent } from './components/anonymous/steps-dt-training-school-info.component';
import { GdsdBaseAuthenticatedComponent } from './components/authenticated/gdsd-base-authenticated.component';
import { GdsdLicenceMainApplicationsListComponent } from './components/authenticated/gdsd-licence-main-applications-list.component';
import { GdsdLicenceMainLicencesListComponent } from './components/authenticated/gdsd-licence-main-licences-list.component';
import { GdsdLicenceMainComponent } from './components/authenticated/gdsd-licence-main.component';
import { StepGdsdPersonalInfoComponent } from './components/authenticated/step-gdsd-personal-info.component';
import { DogTrainerWizardNewRenewalComponent } from './components/dog-trainer-wizard-new-renewal.component';
import { DogTrainerWizardReplacementComponent } from './components/dog-trainer-wizard-replacement.component';
import { GdsdLandingComponent } from './components/gdsd-landing.component';
import { GdsdTeamWizardNewComponent } from './components/gdsd-team-wizard-new.component';
import { GdsdTeamWizardRenewalComponent } from './components/gdsd-team-wizard-renewal.component';
import { GdsdTeamWizardReplacementComponent } from './components/gdsd-team-wizard-replacement.component';
import { FormGdsdApplicationTypeComponent } from './components/shared/common-form-components/form-gdsd-application-type.component';
import { FormGdsdGovermentPhotoIdComponent } from './components/shared/common-form-components/form-gdsd-goverment-photo-id.component';
import { FormGdsdLicenceAccessCodeComponent } from './components/shared/common-form-components/form-gdsd-licence-access-code.component';
import { FormGdsdLicenceConfirmationComponent } from './components/shared/common-form-components/form-gdsd-licence-confirmation.component';
import { FormGdsdMailingAddressReplacementComponent } from './components/shared/common-form-components/form-gdsd-mailing-address-replacement.component';
import { GdsdApplicationReceivedSuccessComponent } from './components/shared/common-form-components/gdsd-application-received-success.component';
import { GdsdSummaryAccreditedTrainingComponent } from './components/shared/common-form-components/gdsd-summary-accredited-training.component';
import { GdsdSummaryOtherTrainingComponent } from './components/shared/common-form-components/gdsd-summary-other-training.component';
import { GdsdSummarySchoolTrainingComponent } from './components/shared/common-form-components/gdsd-summary-school-training.component';
import { StepGdsdAccreditedGraduationComponent } from './components/shared/common-step-components/step-gdsd-accredited-graduation.component';
import { StepGdsdChecklistNewComponent } from './components/shared/common-step-components/step-gdsd-checklist-new.component';
import { StepGdsdChecklistRenewalComponent } from './components/shared/common-step-components/step-gdsd-checklist-renewal.component';
import { StepGdsdConsentComponent } from './components/shared/common-step-components/step-gdsd-consent.component';
import { StepGdsdDogCertificationSelectionComponent } from './components/shared/common-step-components/step-gdsd-dog-certification-selection.component';
import { StepGdsdDogInfoComponent } from './components/shared/common-step-components/step-gdsd-dog-info.component';
import { StepGdsdDogMedicalComponent } from './components/shared/common-step-components/step-gdsd-dog-medical.component';
import { StepGdsdDogTasksComponent } from './components/shared/common-step-components/step-gdsd-dog-tasks.component';
import { StepGdsdGovermentPhotoIdComponent } from './components/shared/common-step-components/step-gdsd-goverment-photo-id.component';
import { StepGdsdLicenceConfirmationComponent } from './components/shared/common-step-components/step-gdsd-licence-confirmation.component';
import { StepGdsdMailingAddressReplacementComponent } from './components/shared/common-step-components/step-gdsd-mailing-address-replacement.component';
import { StepGdsdMailingAddressComponent } from './components/shared/common-step-components/step-gdsd-mailing-address.component';
import { StepGdsdMedicalInfoComponent } from './components/shared/common-step-components/step-gdsd-medical-info.component';
import { StepGdsdOtherTrainingsComponent } from './components/shared/common-step-components/step-gdsd-other-trainings.component';
import { StepGdsdPhotographOfYourselfRenewComponent } from './components/shared/common-step-components/step-gdsd-photograph-of-yourself-renew.component';
import { StepGdsdPhotographOfYourselfComponent } from './components/shared/common-step-components/step-gdsd-photograph-of-yourself.component';
import { StepGdsdSchoolTrainingsComponent } from './components/shared/common-step-components/step-gdsd-school-trainings.component';
import { StepGdsdSummaryComponent } from './components/shared/common-step-components/step-gdsd-summary.component';
import { StepGdsdTermsOfUseComponent } from './components/shared/common-step-components/step-gdsd-terms-of-use.component';
import { StepGdsdTrainingHistoryComponent } from './components/shared/common-step-components/step-gdsd-training-history.component';
import { StepsGdsdDogInfoComponent } from './components/shared/common-steps-components/steps-gdsd-dog-info.component';
import { StepsGdsdPersonalInfoComponent } from './components/shared/common-steps-components/steps-gdsd-personal-info.component';
import { StepsGdsdReviewConfirmComponent } from './components/shared/common-steps-components/steps-gdsd-review-confirm.component';
import { StepsGdsdSelectionComponent } from './components/shared/common-steps-components/steps-gdsd-selection.component';
import { StepsGdsdTrainingInfoComponent } from './components/shared/common-steps-components/steps-gdsd-training-info.component';
import { GuideDogServiceDogRoutingModule } from './guide-dog-service-dog-routing.module';

@NgModule({
	declarations: [
		GdsdBaseAnonymousComponent,
		GdsdBaseAuthenticatedComponent,
		GdsdLandingComponent,
		GdsdLicenceMainComponent,
		GdsdLicenceMainLicencesListComponent,
		StepGdsdApplicationTypeComponent,
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

		GdsdTeamWizardNewComponent,
		GdsdTeamWizardRenewalComponent,
		GdsdTeamWizardReplacementComponent,

		StepsGdsdSelectionComponent,
		StepsGdsdPersonalInfoComponent,
		StepsGdsdDogInfoComponent,
		StepsGdsdTrainingInfoComponent,
		StepsGdsdReviewConfirmComponent,

		StepGdsdTermsOfUseComponent,
		StepGdsdChecklistNewComponent,
		StepGdsdChecklistRenewalComponent,
		StepGdsdPersonalInfoAnonymousComponent,
		StepGdsdPersonalInfoComponent,
		StepGdsdPhotographOfYourselfComponent,
		StepGdsdPhotographOfYourselfRenewComponent,
		StepGdsdGovermentPhotoIdComponent,
		StepGdsdMailingAddressComponent,
		StepGdsdDogCertificationSelectionComponent,
		StepGdsdDogInfoComponent,
		StepGdsdAccreditedGraduationComponent,
		StepGdsdConsentComponent,
		StepGdsdSummaryComponent,
		StepGdsdTrainingHistoryComponent,
		StepGdsdSchoolTrainingsComponent,
		StepGdsdOtherTrainingsComponent,
		StepGdsdDogMedicalComponent,
		StepGdsdMedicalInfoComponent,
		StepGdsdDogTasksComponent,
		StepGdsdLicenceAccessCodeComponent,
		StepGdsdMailingAddressReplacementComponent,
		StepGdsdLicenceConfirmationComponent,

		DogTrainerWizardNewRenewalComponent,
		DogTrainerWizardReplacementComponent,
		StepsDtDetailsComponent,
		StepsDtPersonalInfoComponent,
		StepsDtTrainingSchoolInfoComponent,
		StepsDtReviewConfirmComponent,
		StepDtChecklistNewComponent,
		StepDtChecklistRenewalComponent,
		StepDtTrainingSchoolInfoComponent,
		StepDtTrainingSchoolMailingAddressComponent,
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
	],
	imports: [SharedModule, GuideDogServiceDogRoutingModule],
})
export class GuideDogServiceDogModule {}
