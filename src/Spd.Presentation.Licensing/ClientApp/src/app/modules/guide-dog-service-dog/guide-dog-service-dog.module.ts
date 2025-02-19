import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { StepGdsdLicenceAccessCodeComponent } from './components/anonymous/step-gdsd-licence-access-code.component';
import { StepGdsdPersonalInfoAnonymousComponent } from './components/anonymous/step-gdsd-personal-info-anonymous.component';
import { GdsdLicenceMainApplicationsListComponent } from './components/authenticated/gdsd-licence-main-applications-list.component';
import { GdsdLicenceMainLicencesListComponent } from './components/authenticated/gdsd-licence-main-licences-list.component';
import { GdsdLicenceMainComponent } from './components/authenticated/gdsd-licence-main.component';
import { StepGdsdPersonalInfoComponent } from './components/authenticated/step-gdsd-personal-info.component';
import { GdsdWizardNewComponent } from './components/gdsd-wizard-new.component';
import { GdsdWizardRenewalComponent } from './components/gdsd-wizard-renewal.component';
import { GdsdWizardReplacementComponent } from './components/gdsd-wizard-replacement.component';
import { GuideDogServiceDogBaseAnonymousComponent } from './components/guide-dog-service-dog-base-anonymous.component';
import { GuideDogServiceDogBaseAuthenticatedComponent } from './components/guide-dog-service-dog-base-authenticated.component';
import { GuideDogServiceDogLandingComponent } from './components/guide-dog-service-dog-landing.component';
import { GdsdApplicationReceivedSuccessComponent } from './components/shared/common-form-components/gdsd-application-received-success.component';
import { GdsdApplicationTypeAnonymousComponent } from './components/shared/common-form-components/gdsd-application-type-anonymous.component';
import { GdsdSummaryAccreditedTrainingComponent } from './components/shared/common-form-components/gdsd-summary-accredited-training.component';
import { GdsdSummaryOtherTrainingComponent } from './components/shared/common-form-components/gdsd-summary-other-training.component';
import { GdsdSummarySchoolTrainingComponent } from './components/shared/common-form-components/gdsd-summary-school-training.component';
import { StepGdsdAccreditedGraduationComponent } from './components/shared/common-step-components/step-gdsd-accredited-graduation.component';
import { StepGdsdChecklistNewComponent } from './components/shared/common-step-components/step-gdsd-checklist-new.component';
import { StepGdsdConsentComponent } from './components/shared/common-step-components/step-gdsd-consent.component';
import { StepGdsdDogCertificationSelectionComponent } from './components/shared/common-step-components/step-gdsd-dog-certification-selection.component';
import { StepGdsdDogInformationComponent } from './components/shared/common-step-components/step-gdsd-dog-information.component';
import { StepGdsdDogMedicalComponent } from './components/shared/common-step-components/step-gdsd-dog-medical.component';
import { StepGdsdDogTasksComponent } from './components/shared/common-step-components/step-gdsd-dog-tasks.component';
import { StepGdsdGovermentPhotoIdComponent } from './components/shared/common-step-components/step-gdsd-goverment-photo-id.component';
import { StepGdsdMailingAddressComponent } from './components/shared/common-step-components/step-gdsd-mailing-address.component';
import { StepGdsdMedicalInformationComponent } from './components/shared/common-step-components/step-gdsd-medical-information.component';
import { StepGdsdOtherTrainingsComponent } from './components/shared/common-step-components/step-gdsd-other-trainings.component';
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
		GuideDogServiceDogBaseAnonymousComponent,
		GuideDogServiceDogBaseAuthenticatedComponent,
		GuideDogServiceDogLandingComponent,
		GdsdLicenceMainComponent,
		GdsdLicenceMainLicencesListComponent,
		GdsdApplicationTypeAnonymousComponent,
		GdsdApplicationReceivedSuccessComponent,
		GdsdWizardNewComponent,
		GdsdWizardRenewalComponent,
		GdsdWizardReplacementComponent,
		StepsGdsdSelectionComponent,
		StepsGdsdPersonalInfoComponent,
		StepsGdsdDogInfoComponent,
		StepsGdsdTrainingInfoComponent,
		StepsGdsdReviewConfirmComponent,
		StepGdsdTermsOfUseComponent,
		StepGdsdChecklistNewComponent,
		StepGdsdPersonalInfoAnonymousComponent,
		StepGdsdPersonalInfoComponent,
		StepGdsdPhotographOfYourselfComponent,
		StepGdsdGovermentPhotoIdComponent,
		StepGdsdMailingAddressComponent,
		StepGdsdDogCertificationSelectionComponent,
		StepGdsdDogInformationComponent,
		StepGdsdAccreditedGraduationComponent,
		StepGdsdConsentComponent,
		StepGdsdSummaryComponent,
		StepGdsdTrainingHistoryComponent,
		StepGdsdSchoolTrainingsComponent,
		StepGdsdOtherTrainingsComponent,
		StepGdsdDogMedicalComponent,
		StepGdsdMedicalInformationComponent,
		StepGdsdDogTasksComponent,
		GdsdSummaryAccreditedTrainingComponent,
		GdsdSummarySchoolTrainingComponent,
		GdsdSummaryOtherTrainingComponent,
		GdsdLicenceMainApplicationsListComponent,
		StepGdsdLicenceAccessCodeComponent,
	],
	imports: [SharedModule, GuideDogServiceDogRoutingModule],
})
export class GuideDogServiceDogModule {}
