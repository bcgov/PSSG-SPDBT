import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { MetalDealersBaseComponent } from './components/metal-dealers-base.component';
import { MetalDealersMainComponent } from './components/metal-dealers-main.component';
import { MetalDealersRegistrationReceivedComponent } from './components/metal-dealers-registration-received.component';
import { MetalDealersWizardComponent } from './components/metal-dealers-wizard.component';
import { ModalMetalDealersBranchComponent } from './components/modal-metal-dealers-branch.component';
import { StepMetalDealersBranchesComponent } from './components/step-metal-dealers-branches.component';
import { StepMetalDealersBusinessAddressComponent } from './components/step-metal-dealers-business-address.component';
import { StepMetalDealersBusinessInformationComponent } from './components/step-metal-dealers-business-information.component';
import { StepMetalDealersConsentComponent } from './components/step-metal-dealers-consent.component';
import { MetalDealersRegistrationInformationComponent } from './components/step-metal-dealers-registration-information.component';
import { StepMetalDealersSummaryComponent } from './components/step-metal-dealers-summary.component';
import { MetalDealersAndRecyclersRoutingModule } from './metal-dealers-and-recyclers-routing.module';

@NgModule({
	declarations: [
		MetalDealersBaseComponent,
		MetalDealersMainComponent,
		MetalDealersWizardComponent,
		MetalDealersRegistrationInformationComponent,
		StepMetalDealersBusinessInformationComponent,
		StepMetalDealersBusinessAddressComponent,
		StepMetalDealersBranchesComponent,
		StepMetalDealersSummaryComponent,
		StepMetalDealersConsentComponent,
		ModalMetalDealersBranchComponent,
		MetalDealersRegistrationReceivedComponent,
	],
	imports: [SharedModule, MetalDealersAndRecyclersRoutingModule],
})
export class MetalDealersAndRecyclersModule {}
