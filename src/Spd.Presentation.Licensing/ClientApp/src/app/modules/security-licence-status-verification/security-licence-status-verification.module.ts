import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
import { SecurityLicenceStatusSwlSearchResultsComponent } from './components/security-licence-status-swl-search-results.component';
import { SecurityLicenceStatusVerificationBaseComponent } from './components/security-licence-status-verification-base.component';
import { SecurityLicenceStatusVerificationMainComponent } from './components/security-licence-status-verification-main.component';
import { SecurityLicenceStatusVerificationSblComponent } from './components/security-licence-status-verification-sbl.component';
import { SecurityLicenceStatusVerificationSwlComponent } from './components/security-licence-status-verification-swl.component';
import { SecurityLicenceStatusVerificationRoutingModule } from './security-licence-status-verification-routing.module';

@NgModule({
	declarations: [
		SecurityLicenceStatusVerificationBaseComponent,
		SecurityLicenceStatusVerificationMainComponent,
		SecurityLicenceStatusVerificationSwlComponent,
		SecurityLicenceStatusVerificationSblComponent,
		SecurityLicenceStatusSwlSearchResultsComponent,
	],
	imports: [SharedModule, SecurityLicenceStatusVerificationRoutingModule],
})
export class SecurityLicenceStatusVerificationModule {}
