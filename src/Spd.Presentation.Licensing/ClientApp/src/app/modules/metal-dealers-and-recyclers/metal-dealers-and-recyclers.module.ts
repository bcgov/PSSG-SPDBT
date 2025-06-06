import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { FormMdraBranchesComponent } from './components/form-mdra-branches.component';
import { FormMdraLicenceAccessCodeComponent } from './components/form-mdra-licence-access-code.component';
import { MdraBaseComponent } from './components/mdra-base.component';
import { MdraWizardNewRenewalComponent } from './components/mdra-wizard-new-renewal.component';
import { MetalDealersMainComponent } from './components/metal-dealers-main.component';
import { MetalDealersRegistrationReceivedComponent } from './components/metal-dealers-registration-received.component';
import { ModalMdraBranchComponent } from './components/modal-mdra-branch.component';
import { StepMdraLicenceAccessCodeComponent } from './components/step-mdra-access-code.component';
import { StepMdraApplicationTypeComponent } from './components/step-mdra-application-type.component';
import { StepMdraBranchesComponent } from './components/step-mdra-branches.component';
import { StepMdraBusinessAddressComponent } from './components/step-mdra-business-address.component';
import { StepMdraBusinessManagerComponent } from './components/step-mdra-business-manager.component';
import { StepMdraBusinessOwnerComponent } from './components/step-mdra-business-owner.component';
import { StepMdraChecklistNewComponent } from './components/step-mdra-checklist-new.component';
import { StepMdraConsentComponent } from './components/step-mdra-consent.component';
import { StepMdraSummaryComponent } from './components/step-mdra-summary.component';
import { StepMdraTermsOfUseComponent } from './components/step-mdra-terms-of-use.component';
import { StepsMdraBranchesComponent } from './components/steps-mdra-branches.component';
import { StepsMdraBusinessInfoComponent } from './components/steps-mdra-business-info.component';
import { StepsMdraDetailsComponent } from './components/steps-mdra-details.component';
import { StepsMdraReviewAndConfirmComponent } from './components/steps-mdra-review-and-confirm.component';
import { MetalDealersAndRecyclersRoutingModule } from './metal-dealers-and-recyclers-routing.module';

@NgModule({
	declarations: [
		MdraBaseComponent,
		MetalDealersMainComponent,
		MdraWizardNewRenewalComponent,
		StepMdraTermsOfUseComponent,
		StepMdraLicenceAccessCodeComponent,
		StepMdraChecklistNewComponent,
		StepMdraApplicationTypeComponent,
		StepMdraBusinessOwnerComponent,
		StepMdraBusinessManagerComponent,
		StepMdraBusinessAddressComponent,
		StepMdraBranchesComponent,
		StepMdraSummaryComponent,
		StepMdraConsentComponent,
		StepsMdraBusinessInfoComponent,
		StepsMdraDetailsComponent,
		StepsMdraBranchesComponent,
		StepsMdraReviewAndConfirmComponent,
		ModalMdraBranchComponent,
		MetalDealersRegistrationReceivedComponent,
		FormMdraBranchesComponent,
		FormMdraLicenceAccessCodeComponent,
	],
	imports: [SharedModule, MetalDealersAndRecyclersRoutingModule],
})
export class MetalDealersAndRecyclersModule {}
