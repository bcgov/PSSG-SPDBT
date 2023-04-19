import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardHeaderComponent } from './components/dashboard-header.component';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { ExpiringScreeningsComponent } from './components/expiring-screenings.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { IdentifyVerificationComponent } from './components/identify-verification.component';
import { MaintainUserModalComponent } from './components/maintain-user-modal.component';
import { ManualSubmissionsComponent } from './components/manual-submissions.component';
import { NewScreeningModalComponent } from './components/new-screening-modal.component';
import { NewScreeningComponent } from './components/new-screening.component';
import { PaymentFilterComponent } from './components/payment-filter.component';
import { PaymentsComponent } from './components/payments.component';
import { ReportsComponent } from './components/reports.component';
import { ScreeningStatusesComponent } from './components/screening-statuses.component';
import { SettingsComponent } from './components/settings.component';
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
		MaintainUserModalComponent,
		PaymentFilterComponent,
		SettingsComponent,
		NewScreeningComponent,
		NewScreeningModalComponent,
		IdentifyVerificationComponent,
		ScreeningStatusesComponent,
		ExpiringScreeningsComponent,
		ManualSubmissionsComponent,
		ReportsComponent,
	],
	imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
