import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AppRoutes } from '@app/app-routes';
import { ConfigService } from '@app/core/services/config.service';
import { MdraBaseComponent } from './components/mdra-base.component';
import { MdraWizardNewRenewalComponent } from './components/mdra-wizard-new-renewal.component';
import { MdraWizardUpdateComponent } from './components/mdra-wizard-update.component';
import { MetalDealersLandingComponent } from './components/metal-dealers-landing.component';
import { MetalDealersRegistrationReceivedComponent } from './components/metal-dealers-registration-received.component';
import { StepMdraLicenceAccessCodeComponent } from './components/step-mdra-access-code.component';
import { StepMdraApplicationTypeComponent } from './components/step-mdra-application-type.component';
import { MetalDealersAndRecyclersRoutes } from './metal-dealers-and-recyclers-routes';

const routes: Routes = [
	{
		path: MetalDealersAndRecyclersRoutes.MDRA_APPLICATION,
		component: MdraBaseComponent,
		children: [
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
				path: MetalDealersAndRecyclersRoutes.MDRA_UPDATE,
				component: MdraWizardUpdateComponent,
			},
		],
	},
	{
		path: MetalDealersAndRecyclersRoutes.MDRA_REGISTRATION_RECEIVED,
		component: MetalDealersRegistrationReceivedComponent,
	},
	{
		path: '',
		component: MetalDealersLandingComponent,
	},
	{
		path: '**',
		redirectTo: MetalDealersAndRecyclersRoutes.defaultLanding(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MetalDealersAndRecyclersRoutingModule {
	constructor(
		private router: Router,
		private configService: ConfigService
	) {
		if (!this.configService.isEnableMdraFeatures()) {
			this.router.navigateByUrl(AppRoutes.path(AppRoutes.LANDING));
		}
	}
}
