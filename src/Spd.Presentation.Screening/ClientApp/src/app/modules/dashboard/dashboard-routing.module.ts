import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { GenericUploadComponent } from './components/generic-upload.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent,
		children: [
			{ path: 'home', component: DashboardHomeComponent },
			{ path: 'generic-upload', component: GenericUploadComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
