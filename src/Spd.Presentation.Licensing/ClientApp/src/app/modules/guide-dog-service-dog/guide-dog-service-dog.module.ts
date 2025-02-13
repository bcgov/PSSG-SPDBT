import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { StepGdsdPersonalInfoAnonymousComponent } from './components/anonymous/step-gdsd-personal-info-anonymous.component';
import { StepGdsdPersonalInfoComponent } from './components/authenticated/step-gdsd-personal-info.component';
import { GdsdActiveCertificationsComponent } from './components/gdsd-active-certifications.component';
import { GdsdApplicationTypeAnonymousComponent } from './components/gdsd-application-type-anonymous.component';
import { GdsdApplicationsListCurrentComponent } from './components/gdsd-applications-list-current.component';
import { GdsdWizardNewComponent } from './components/gdsd-wizard-new.component';
import { GuideDogServiceDogBaseAnonymousComponent } from './components/guide-dog-service-dog-base-anonymous.component';
import { GuideDogServiceDogBaseAuthenticatedComponent } from './components/guide-dog-service-dog-base-authenticated.component';
import { GuideDogServiceDogLandingComponent } from './components/guide-dog-service-dog-landing.component';
import { GuideDogServiceDogMainComponent } from './components/guide-dog-service-dog-main.component';
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
import { GdsdApplicationReceivedSuccessComponent } from './components/shared/gdsd-application-received-success.component';
import { GdsdSummaryAccreditedTrainingComponent } from './components/shared/gdsd-summary-accredited-training.component';
import { GdsdSummaryOtherTrainingComponent } from './components/shared/gdsd-summary-other-training.component';
import { GdsdSummarySchoolTrainingComponent } from './components/shared/gdsd-summary-school-training.component';
import { StepsGdsdDogInfoComponent } from './components/shared/steps-gdsd-dog-info.component';
import { StepsGdsdPersonalInfoComponent } from './components/shared/steps-gdsd-personal-info.component';
import { StepsGdsdReviewConfirmComponent } from './components/shared/steps-gdsd-review-confirm.component';
import { StepsGdsdSelectionComponent } from './components/shared/steps-gdsd-selection.component';
import { StepsGdsdTrainingInfoComponent } from './components/shared/steps-gdsd-training-info.component';
import { GuideDogServiceDogRoutingModule } from './guide-dog-service-dog-routing.module';

@NgModule({
	declarations: [
		GuideDogServiceDogBaseAnonymousComponent,
		GuideDogServiceDogBaseAuthenticatedComponent,
		GuideDogServiceDogLandingComponent,
		GuideDogServiceDogMainComponent,
		GdsdActiveCertificationsComponent,
		GdsdApplicationTypeAnonymousComponent,
		GdsdApplicationReceivedSuccessComponent,
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
		GdsdWizardNewComponent,
		GdsdApplicationsListCurrentComponent,
	],
	imports: [SharedModule, GuideDogServiceDogRoutingModule],
})
export class GuideDogServiceDogModule {}
