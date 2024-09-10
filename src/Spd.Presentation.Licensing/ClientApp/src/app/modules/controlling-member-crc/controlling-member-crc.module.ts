import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ControllingMemberSubmissionReceivedComponent } from './components/controlling-member-submission-received.component';
import { ControllingMemberWizardUpdateComponent } from './components/controlling-member-wizard-update.component';
import { ControllingMemberWizardNewComponent } from './components/controlling-member-wizard-new.component';
import { StepControllingMemberAliasesComponent } from './components/step-controlling-member-aliases.component';
import { StepControllingMemberBcDriverLicenceComponent } from './components/step-controlling-member-bc-driver-licence.component';
import { StepControllingMemberBcSecurityLicenceHistoryComponent } from './components/step-controlling-member-bc-security-licence-history.component';
import { StepControllingMemberChecklistNewComponent } from './components/step-controlling-member-checklist-new.component';
import { StepControllingMemberChecklistUpdateComponent } from './components/step-controlling-member-checklist-update.component';
import { StepControllingMemberCitizenshipComponent } from './components/step-controlling-member-citizenship.component';
import { StepControllingMemberConsentAndDeclarationComponent } from './components/step-controlling-member-consent-and-declaration.component';
import { StepControllingMemberFingerprintsComponent } from './components/step-controlling-member-fingerprints.component';
import { StepControllingMemberMentalHealthConditionsComponent } from './components/step-controlling-member-mental-health-conditions.component';
import { StepControllingMemberPersonalInfoComponent } from './components/step-controlling-member-personal-info.component';
import { StepControllingMemberPoliceBackgroundComponent } from './components/step-controlling-member-police-background.component';
import { StepControllingMemberResidentialAddressComponent } from './components/step-controlling-member-residential-address.component';
import { StepControllingMemberSummaryReviewComponent } from './components/step-controlling-member-summary-review.component';
import { StepsControllingMemberBackgroundComponent } from './components/steps-controlling-member-background.component';
import { StepsControllingMemberCitizenshipResidencyComponent } from './components/steps-controlling-member-citizenship-residency.component';
import { StepsControllingMemberPersonalInformationComponent } from './components/steps-controlling-member-personal-information.component';
import { StepsControllingMemberReviewComponent } from './components/steps-controlling-member-review.component';
import { ControllingMemberCrcRoutingModule } from './controlling-member-crc-routing.module';
import { ControllingMemberInvitationComponent } from './controlling-member-invitation.component';
import { ControllingMemberLoginComponent } from './controlling-member-login.component';

@NgModule({
	declarations: [
		ControllingMemberLoginComponent,
		ControllingMemberInvitationComponent,
		StepControllingMemberChecklistNewComponent,
		StepControllingMemberChecklistUpdateComponent,
		StepControllingMemberResidentialAddressComponent,
		StepControllingMemberAliasesComponent,
		StepControllingMemberFingerprintsComponent,
		StepControllingMemberBcDriverLicenceComponent,
		StepControllingMemberPersonalInfoComponent,
		StepControllingMemberPoliceBackgroundComponent,
		StepControllingMemberMentalHealthConditionsComponent,
		StepControllingMemberCitizenshipComponent,
		StepControllingMemberBcSecurityLicenceHistoryComponent,
		StepControllingMemberSummaryReviewComponent,
		StepControllingMemberConsentAndDeclarationComponent,
		ControllingMemberSubmissionReceivedComponent,
		ControllingMemberWizardNewComponent,
		ControllingMemberWizardUpdateComponent,
		StepsControllingMemberPersonalInformationComponent,
		StepsControllingMemberCitizenshipResidencyComponent,
		StepsControllingMemberReviewComponent,
		StepsControllingMemberBackgroundComponent,
	],
	imports: [SharedModule, ControllingMemberCrcRoutingModule],
	providers: [],
})
export class ControllingMemberCrcModule {}
