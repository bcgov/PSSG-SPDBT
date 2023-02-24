import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { OutstandingPaymentsComponent } from './components/outstanding-payments.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { AuthorizedUsersComponent } from './components/authorized-users.component';

@NgModule({
	declarations: [DashboardComponent, GenericUploadsComponent, DashboardHomeComponent, OutstandingPaymentsComponent, AuthorizedUsersComponent],
	imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
