import { Component } from '@angular/core';
import { AuthProcessService } from 'src/app/core/services/auth-process.service';

@Component({
	selector: 'app-crrpa-payment-error',
	template: `
		<div class="container mt-4">
			<section class="step-section p-3">
				<app-payment-error></app-payment-error>
			</section>
		</div>
	`,
	styles: [],
})
export class CrrpaPaymentErrorComponent {
	constructor(private authProcessService: AuthProcessService) {}

	async ngOnInit(): Promise<void> {
		await this.authProcessService.tryInitializeCrrpa();
	}
}
