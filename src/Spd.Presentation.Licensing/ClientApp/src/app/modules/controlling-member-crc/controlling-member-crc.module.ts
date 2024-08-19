import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ControllingMemberWizardAnonymousNewComponent } from './anonymous/controlling-member-wizard-anonymous-new.component';
import { ControllingMemberWizardAnonymousRenewComponent } from './anonymous/controlling-member-wizard-anonymous-renew.component';
import { ControllingMemberWizardAnonymousUpdateComponent } from './anonymous/controlling-member-wizard-anonymous-update.component';
import { ControllingMemberWizardAuthenticatedNewComponent } from './authenticated/controlling-member-wizard-authenticated-new.component';
import { ControllingMemberWizardAuthenticatedRenewComponent } from './authenticated/controlling-member-wizard-authenticated-renew.component';
import { ControllingMemberWizardAuthenticatedUpdateComponent } from './authenticated/controlling-member-wizard-authenticated-update.component';
import { ControllingMemberCrcAnonymousBaseComponent } from './controlling-member-crc-anonymous-base.component';
import { ControllingMemberCrcBaseComponent } from './controlling-member-crc-base.component';
import { ControllingMemberCrcRoutingModule } from './controlling-member-crc-routing.module';
import { ControllingMemberLoginComponent } from './controlling-member-login.component';
import { ControllingMemberSubmissionReceivedComponent } from './shared/step-controlling-member-submission-received.component';
import { StepControllingMemberAliasesComponent } from './shared/step-controlling-member-aliases.component';
import { StepControllingMemberBcDriverLicenceComponent } from './shared/step-controlling-member-bc-driver-licence.component';
import { StepControllingMemberBcSecurityLicenceHistoryComponent } from './shared/step-controlling-member-bc-security-licence-history.component';
import { StepControllingMemberChecklistNewComponent } from './shared/step-controlling-member-checklist-new.component';
import { StepControllingMemberChecklistRenewalComponent } from './shared/step-controlling-member-checklist-renewal.component';
import { StepControllingMemberChecklistUpdateComponent } from './shared/step-controlling-member-checklist-update.component';
import { StepControllingMemberCitizenshipComponent } from './shared/step-controlling-member-citizenship.component';
import { StepControllingMemberConsentAndDeclarationComponent } from './shared/step-controlling-member-consent-and-declaration.component';
import { StepControllingMemberFingerprintsComponent } from './shared/step-controlling-member-fingerprints.component';
import { StepControllingMemberMentalHealthConditionsComponent } from './shared/step-controlling-member-mental-health-conditions.component';
import { StepControllingMemberPoliceBackgroundComponent } from './shared/step-controlling-member-police-background.component';
import { StepControllingMemberResidentialAddressComponent } from './shared/step-controlling-member-residential-address.component';
import { StepControllingMemberSummaryReviewAnonymousComponent } from './shared/step-controlling-member-summary-review-anonymous.component';
import { StepsControllingMemberBackgroundComponent } from './shared/steps-controlling-member-background.component';
import { StepsControllingMemberCitizenshipResidencyComponent } from './shared/steps-controlling-member-citizenship-residency.component';
import { StepsControllingMemberPersonalInformationComponent } from './shared/steps-controlling-member-personal-information.component';
import { StepsControllingMemberReviewComponent } from './shared/steps-controlling-member-review.component';

@NgModule({
	declarations: [
		ControllingMemberLoginComponent,
		ControllingMemberCrcBaseComponent,
		ControllingMemberCrcAnonymousBaseComponent,
		StepControllingMemberChecklistNewComponent,
		StepControllingMemberChecklistRenewalComponent,
		StepControllingMemberChecklistUpdateComponent,
		StepControllingMemberResidentialAddressComponent,
		StepControllingMemberAliasesComponent,
		StepControllingMemberFingerprintsComponent,
		StepControllingMemberBcDriverLicenceComponent,
		StepControllingMemberPoliceBackgroundComponent,
		StepControllingMemberMentalHealthConditionsComponent,
		StepControllingMemberCitizenshipComponent,
		StepControllingMemberBcSecurityLicenceHistoryComponent,
		StepControllingMemberSummaryReviewAnonymousComponent,
		StepControllingMemberConsentAndDeclarationComponent,
		ControllingMemberSubmissionReceivedComponent,
		ControllingMemberWizardAnonymousNewComponent,
		ControllingMemberWizardAnonymousRenewComponent,
		ControllingMemberWizardAnonymousUpdateComponent,
		ControllingMemberWizardAuthenticatedNewComponent,
		ControllingMemberWizardAuthenticatedRenewComponent,
		ControllingMemberWizardAuthenticatedUpdateComponent,
		StepsControllingMemberPersonalInformationComponent,
		StepsControllingMemberCitizenshipResidencyComponent,
		StepsControllingMemberReviewComponent,
		StepsControllingMemberBackgroundComponent,
	],
	imports: [SharedModule, ControllingMemberCrcRoutingModule],
	providers: [],
})
export class ControllingMemberCrcModule {}
