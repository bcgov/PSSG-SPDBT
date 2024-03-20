import { Component } from '@angular/core';
import { ServiceTypeCode } from '@app/api/models';

@Component({
	selector: 'app-licence-update-received-success-anonymous',
	template: `
		<section class="step-section">
			<app-common-update-received-success [serviceTypeCode]="serviceTypeCode"></app-common-update-received-success>
		</section>
	`,
	styles: [],
})
export class LicenceUpdateReceivedSuccessAnonymousComponent {
	serviceTypeCode = ServiceTypeCode.SecurityWorkerLicence;
}
