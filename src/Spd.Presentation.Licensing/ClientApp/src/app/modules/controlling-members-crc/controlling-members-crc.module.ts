import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControllingMembersWizardAnonymousNewComponent } from './anonymous/controlling-members-wizard-anonymous-new.component';
import { ControllingMembersWizardAnonymousRenewComponent } from './anonymous/controlling-members-wizard-anonymous-renew.component';
import { ControllingMembersWizardAnonymousUpdateComponent } from './anonymous/controlling-members-wizard-anonymous-update.component';
import { ControllingMembersWizardAuthenticatedNewComponent } from './authenticated/controlling-members-wizard-authenticated-new.component';
import { ControllingMembersWizardAuthenticatedRenewComponent } from './authenticated/controlling-members-wizard-authenticated-renew.component';
import { ControllingMembersWizardAuthenticatedUpdateComponent } from './authenticated/controlling-members-wizard-authenticated-update.component';
import { ControllingMembersAnonymousBaseComponent } from './controlling-members-anonymous-base.component';
import { ControllingMembersBaseComponent } from './controlling-members-base.component';
import { ControllingMembersCrcRoutingModule } from './controlling-members-crc-routing.module';
import { ControllingMembersLoginComponent } from './controlling-members-login.component';
import { StepControllingMembersAliasesComponent } from './shared/step-controlling-members-aliases.component';
import { StepControllingMembersBcDriverLicenceComponent } from './shared/step-controlling-members-bc-driver-licence.component';
import { StepControllingMembersChecklistNewComponent } from './shared/step-controlling-members-checklist-new.component';
import { StepControllingMembersChecklistRenewalComponent } from './shared/step-controlling-members-checklist-renewal.component';
import { StepControllingMembersChecklistUpdateComponent } from './shared/step-controlling-members-checklist-update.component';
import { StepControllingMembersFingerprintsComponent } from './shared/step-controlling-members-fingerprints.component';
import { StepControllingMembersMentalHealthConditionsComponent } from './shared/step-controlling-members-mental-health-conditions.component';
import { StepControllingMembersPoliceBackgroundComponent } from './shared/step-controlling-members-police-background.component';
import { StepControllingMembersResidentialAddressComponent } from './shared/step-controlling-members-residential-address.component';
import { StepsControllingMembersBackgroundComponent } from './shared/steps-controlling-members-background.component';
import { StepsControllingMembersCitizenshipResidencyComponent } from './shared/steps-controlling-members-citizenship-residency.component';
import { StepsControllingMembersPersonalInformationComponent } from './shared/steps-controlling-members-personal-information.component';
import { StepsControllingMembersReviewComponent } from './shared/steps-controlling-members-review.component';

@NgModule({
	declarations: [
		ControllingMembersLoginComponent,
		ControllingMembersBaseComponent,
		ControllingMembersAnonymousBaseComponent,
		StepControllingMembersChecklistNewComponent,
		StepControllingMembersChecklistRenewalComponent,
		StepControllingMembersChecklistUpdateComponent,
		StepControllingMembersResidentialAddressComponent,
		StepControllingMembersAliasesComponent,
		StepControllingMembersFingerprintsComponent,
		StepsControllingMembersPersonalInformationComponent,
		StepsControllingMembersCitizenshipResidencyComponent,
		StepControllingMembersBcDriverLicenceComponent,
		StepControllingMembersPoliceBackgroundComponent,
		StepControllingMembersMentalHealthConditionsComponent,
		StepsControllingMembersReviewComponent,
		StepsControllingMembersBackgroundComponent,
		ControllingMembersWizardAnonymousNewComponent,
		ControllingMembersWizardAnonymousRenewComponent,
		ControllingMembersWizardAnonymousUpdateComponent,
		ControllingMembersWizardAuthenticatedNewComponent,
		ControllingMembersWizardAuthenticatedRenewComponent,
		ControllingMembersWizardAuthenticatedUpdateComponent,
	],
	imports: [SharedModule, ControllingMembersCrcRoutingModule],
	providers: [],
})
export class ControllingMembersCrcModule {}
