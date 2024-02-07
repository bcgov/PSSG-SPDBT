import { Component } from '@angular/core';
import { PaymentResponse } from '@app/api/models';

@Component({
	selector: 'app-licence-update-received-success',
	template: `
		<div class="container my-3">
			<section class="step-section">
				<app-common-update-received-success [application]="payment"></app-common-update-received-success>
			</section>
		</div>
	`,
	styles: [],
})
export class LicenceUpdateReceivedSuccessComponent {
	payment: PaymentResponse | null = null; // TODO pass data to update received
}
