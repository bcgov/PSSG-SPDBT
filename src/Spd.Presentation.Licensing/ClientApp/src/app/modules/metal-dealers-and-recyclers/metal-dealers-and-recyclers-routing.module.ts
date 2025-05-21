import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdraBaseComponent } from './components/mdra-base.component';
import { MdraWizardNewRenewalComponent } from './components/mdra-wizard-new-renewal.component';
import { MetalDealersMainComponent } from './components/metal-dealers-main.component';
import { MetalDealersRegistrationReceivedComponent } from './components/metal-dealers-registration-received.component';
import { StepMdraLicenceAccessCodeComponent } from './components/step-mdra-access-code.component';
import { StepMdraApplicationTypeComponent } from './components/step-mdra-application-type.component';
import { MetalDealersAndRecyclersRoutes } from './metal-dealers-and-recyclers-routes';

const routes: Routes = [
	{
		path: '',
		component: MdraBaseComponent,
		children: [
			{
				path: '',
				component: MetalDealersMainComponent,
			},
			{
				path: MetalDealersAndRecyclersRoutes.MDRA_APPLICATION_TYPE,
				component: StepMdraApplicationTypeComponent,
			},
			{
				path: MetalDealersAndRecyclersRoutes.MDRA_NEW,
				component: MdraWizardNewRenewalComponent,
			},
			{
				path: MetalDealersAndRecyclersRoutes.MDRA_ACCESS_CODE,
				component: StepMdraLicenceAccessCodeComponent,
			},
			{
				path: MetalDealersAndRecyclersRoutes.MDRA_RENEWAL,
				component: MdraWizardNewRenewalComponent,
			},
			{
				path: MetalDealersAndRecyclersRoutes.MDRA_REGISTRATION_RECEIVED,
				component: MetalDealersRegistrationReceivedComponent,
			},
		],
	},
	{
		path: '**',
		redirectTo: MetalDealersAndRecyclersRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MetalDealersAndRecyclersRoutingModule {}
