import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardHeaderComponent } from './components/dashboard-header.component';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { EditUserModalComponent } from './components/edit-user-modal.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { PaymentFilterComponent } from './components/payment-filter.component';
import { PaymentsComponent } from './components/payments.component';
import { UsersComponent } from './components/users.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
	declarations: [
		DashboardComponent,
		GenericUploadsComponent,
		DashboardHomeComponent,
		PaymentsComponent,
		UsersComponent,
		DashboardHeaderComponent,
		EditUserModalComponent,
		PaymentFilterComponent,
	],
	imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
