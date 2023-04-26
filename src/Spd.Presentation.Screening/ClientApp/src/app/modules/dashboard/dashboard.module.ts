import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplicationStatusesComponent } from './components/application-statuses.component';
import { CrcAddModalComponent } from './components/crc-add-modal.component';
import { CriminalRecordChecksComponent } from './components/criminal-record-checks.component';
import { DashboardHeaderComponent } from './components/dashboard-header.component';
import { DashboardHomeComponent } from './components/dashboard-home.component';
import { ExpiringChecksComponent } from './components/expiring-checks.component';
import { GenericUploadsComponent } from './components/generic-uploads.component';
import { IdentifyVerificationComponent } from './components/identify-verification.component';
import { ManualSubmissionsComponent } from './components/manual-submissions.component';
import { OrganizationProfileComponent } from './components/organization-profile.component';
import { PaymentFilterComponent } from './components/payment-filter.component';
import { PaymentsComponent } from './components/payments.component';
import { ReportsComponent } from './components/reports.component';
import { UserEditModalComponent } from './components/user-edit-modal.component';
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
		UserEditModalComponent,
		PaymentFilterComponent,
		OrganizationProfileComponent,
		CriminalRecordChecksComponent,
		CrcAddModalComponent,
		IdentifyVerificationComponent,
		ApplicationStatusesComponent,
		ExpiringChecksComponent,
		ManualSubmissionsComponent,
		ReportsComponent,
	],
	imports: [SharedModule, DashboardRoutingModule],
})
export class DashboardModule {}
