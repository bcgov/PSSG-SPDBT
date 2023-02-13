import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScrApplicationComponent } from './scr-application.component';

const routes: Routes = [
	{
		path: '',
		component: ScrApplicationComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)], //, { scrollPositionRestoration: 'top' })],
	exports: [RouterModule],
})
export class ScrApplicationRoutingModule {}
