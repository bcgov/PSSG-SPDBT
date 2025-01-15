import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetalDealersBaseComponent } from './components/metal-dealers-base.component';
import { MetalDealersMainComponent } from './components/metal-dealers-main.component';
import { MetalDealersRegistrationReceivedComponent } from './components/metal-dealers-registration-received.component';
import { MetalDealersWizardComponent } from './components/metal-dealers-wizard.component';
import { MetalDealersAndRecyclersRoutes } from './metal-dealers-and-recyclers-routes';

const routes: Routes = [
	{
		path: '',
		component: MetalDealersBaseComponent,
		children: [
			{
				path: '',
				component: MetalDealersMainComponent,
			},
			{
				path: MetalDealersAndRecyclersRoutes.METAL_DEALERS_AND_RECYCLERS_REGISTER,
				component: MetalDealersWizardComponent,
			},
			{
				path: MetalDealersAndRecyclersRoutes.METAL_DEALERS_AND_RECYCLERS_REGISTRATION_RECEIVED,
				component: MetalDealersRegistrationReceivedComponent,
			},
		],
	},
	{
		path: '',
		redirectTo: MetalDealersAndRecyclersRoutes.pathMetalDealersAndRecyclers(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MetalDealersAndRecyclersRoutingModule {}
