import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenericUploadComponent } from './components/generic-upload.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './components/dashboard-home.component';

@NgModule({
	declarations: [DashboardComponent, GenericUploadComponent, DashboardHomeComponent],
	imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
