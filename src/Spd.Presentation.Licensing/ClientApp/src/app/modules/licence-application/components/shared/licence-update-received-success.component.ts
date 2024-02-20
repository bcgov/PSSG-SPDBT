import { Component } from '@angular/core';
import { ServiceTypeCode } from '@app/api/models';

@Component({
	selector: 'app-licence-update-received-success',
	template: `
		<div class="container my-3">
			<section class="step-section">
				<app-common-update-received-success [serviceTypeCode]="serviceTypeCode"></app-common-update-received-success>
			</section>
		</div>
	`,
	styles: [],
})
export class LicenceUpdateReceivedSuccessComponent {
	serviceTypeCode = ServiceTypeCode.SecurityWorkerLicence;
}
