import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetalDealersBaseComponent } from './components/metal-dealers-base.component';
import { MetalDealersMainComponent } from './components/metal-dealers-main.component';
import { MetalDealersRegisterComponent } from './components/metal-dealers-register.component';
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
				component: MetalDealersRegisterComponent,
			},
		],
	},
	{
		path: '',
		redirectTo: MetalDealersAndRecyclersRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class MetalDealersAndRecyclersRoutingModule {}
