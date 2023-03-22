import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardHeaderComponent } from './components/dashboard-header.component';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { MaintainUserModalComponent } from './components/maintain-user-modal.component';
import { PaymentFilterComponent } from './components/payment-filter.component';
import { PaymentsComponent } from './components/payments.component';
import { SettingsComponent } from './components/settings.component';
import { UsersComponent } from './components/users.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NewScreeningComponent } from './components/new-screening.component';
import { IdentifyVerificationComponent } from './components/identify-verification.component';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { ExpiringScreeningsComponent } from './components/expiring-screenings.component';

@NgModule({
	declarations: [
		DashboardComponent,
		GenericUploadsComponent,
		DashboardHomeComponent,
		PaymentsComponent,
		UsersComponent,
		DashboardHeaderComponent,
		MaintainUserModalComponent,
		PaymentFilterComponent,
		SettingsComponent,
  NewScreeningComponent,
  IdentifyVerificationComponent,
  ScreeningStatusesComponent,
  ExpiringScreeningsComponent,
	],
	imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
