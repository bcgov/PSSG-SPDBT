import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuideDogServiceDogBaseComponent } from './components/guide-dog-service-dog-base.component';
import { GuideDogServiceDogMainComponent } from './components/guide-dog-service-dog-main.component';
import { GuideDogServiceDogRoutes } from './guide-dog-service-dog-routes';

const routes: Routes = [
	{
		path: '',
		component: GuideDogServiceDogBaseComponent,
		children: [
			{
				path: '',
				component: GuideDogServiceDogMainComponent,
			},
		],
	},
	{
		path: '',
		redirectTo: GuideDogServiceDogRoutes.path(),
		pathMatch: 'full',
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class GuideDogServiceDogRoutingModule {}
