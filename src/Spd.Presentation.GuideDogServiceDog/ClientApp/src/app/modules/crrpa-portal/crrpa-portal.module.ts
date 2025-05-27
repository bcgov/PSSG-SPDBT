import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CrrpaPaymentErrorComponent } from './components/crrpa-payment-error.component';
import { CrrpaPaymentFailComponent } from './components/crrpa-payment-fail.component';
import { CrrpaPaymentSuccessComponent } from './components/crrpa-payment-success.component';
import { CrrpaRoutingModule } from './crrpa-routing.module';
import { CrrpaComponent } from './crrpa.component';
import { InvitationCrrpaComponent } from './invitation-crrpa.component';
import { OrgAccessComponent } from './org-access.component';

@NgModule({
	declarations: [
		CrrpaComponent,
		InvitationCrrpaComponent,
		CrrpaPaymentSuccessComponent,
		CrrpaPaymentFailComponent,
		CrrpaPaymentErrorComponent,
		OrgAccessComponent,
	],
	imports: [SharedModule, CrrpaRoutingModule],
	providers: [],
})
export class CrrpaPortalModule {}
