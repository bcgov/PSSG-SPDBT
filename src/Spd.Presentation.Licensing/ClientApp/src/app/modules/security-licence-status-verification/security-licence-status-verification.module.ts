import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { SecurityLicenceStatusVerificationBaseComponent } from './components/security-licence-status-verification-base.component';
import { SecurityLicenceStatusVerificationMainComponent } from './components/security-licence-status-verification-main.component';
import { SecurityLicenceStatusVerificationSwlComponent } from './components/security-licence-status-verification-swl.component';
import { SecurityLicenceStatusVerificationRoutingModule } from './security-licence-status-verification-routing.module';

@NgModule({
	declarations: [
		SecurityLicenceStatusVerificationBaseComponent,
		SecurityLicenceStatusVerificationMainComponent,
		SecurityLicenceStatusVerificationSwlComponent,
	],
	imports: [SharedModule, SecurityLicenceStatusVerificationRoutingModule],
})
export class SecurityLicenceStatusVerificationModule {}
