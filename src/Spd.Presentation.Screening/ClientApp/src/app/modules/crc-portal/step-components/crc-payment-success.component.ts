import { Component } from '@angular/core';

@Component({
	selector: 'app-crc-payment-success',
	template: `
		<div class="container mt-4">
			<section class="step-section pt-4 pb-4 px-3">
				<app-payment-success [isApplicationReceived]="true"></app-payment-success>
			</section>
		</div>
	`,
	styles: [],
})
export class CrcPaymentSuccessComponent {}
