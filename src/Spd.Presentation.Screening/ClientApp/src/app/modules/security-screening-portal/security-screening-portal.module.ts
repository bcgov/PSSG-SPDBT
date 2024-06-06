import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { SecurityScreeningDetailComponent } from './components/security-screening-detail.component';
import { SecurityScreeningListComponent } from './components/security-screening-list.component';
import { SecurityScreeningPaymentErrorComponent } from './components/security-screening-payment-error.component';
import { SecurityScreeningPaymentFailComponent } from './components/security-screening-payment-fail.component';
import { SecurityScreeningPaymentManualComponent } from './components/security-screening-payment-manual.component';
import { SecurityScreeningPaymentSuccessComponent } from './components/security-screening-payment-success.component';
import { SecurityScreeningUploadModalComponent } from './components/security-screening-upload-modal.component';
import { SecurityScreeningRoutingModule } from './security-screening-routing.module';
import { SecurityScreeningComponent } from './security-screening.component';

@NgModule({
	declarations: [
		SecurityScreeningComponent,
		SecurityScreeningListComponent,
		SecurityScreeningDetailComponent,
		SecurityScreeningUploadModalComponent,
		SecurityScreeningPaymentSuccessComponent,
		SecurityScreeningPaymentFailComponent,
		SecurityScreeningPaymentManualComponent,
		SecurityScreeningPaymentErrorComponent,
	],
	imports: [SharedModule, SecurityScreeningRoutingModule],
})
export class SecurityScreeningPortalModule {}
