import { Component } from '@angular/core';

@Component({
	selector: 'app-step-metal-dealers-checklist',
	template: `
		<app-step-section title="Checklist">
			<div class="row">
				<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<p>
						<strong>Branch Manager:</strong> Is the person responsible for the day to day management of the business
					</p>
					<p><strong>Branch Licence:</strong> Is a Municipal or Regional District business licence</p>

					<div class="fw-semibold fs-6 mb-2">Terms and Conditions of Registration:</div>
					<ul>
						<li class="metal-dealers-checklist-label">No registration fee</li>
						<li class="metal-dealers-checklist-label">Term of registration is 3 years</li>
						<li class="metal-dealers-checklist-label">
							Must provide business name, address, telephone number, and email address (if any)
						</li>
						<li class="metal-dealers-checklist-label">Must provide address of additional business locations</li>
						<li class="metal-dealers-checklist-label">
							Must provide the identity of person(s) responsible for the daily management of the business
						</li>
						<li class="metal-dealers-checklist-label">
							Must provide copies of business licence registration documents
						</li>
						<li class="metal-dealers-checklist-label">
							Must display registration certificate in a conspicuous place at each of the business locations
						</li>
						<li class="metal-dealers-checklist-label">
							Registration must not be transferred unless the Registrar consents in writing to the transfer
						</li>
						<li class="metal-dealers-checklist-label">
							On the expiry, cancellation, suspension or refusal of a renewal of a registration, the registrant must
							immediately surrender the registration and all duplicates to the registrar
						</li>
						<li class="metal-dealers-checklist-label">
							The registrant must not carry on a business using a name other than the name specified in the registration
						</li>
					</ul>
				</div>
			</div>
		</app-step-section>
	`,
	styles: [
		`
			.metal-dealers-checklist-label {
				color: var(--color-primary);
				line-height: 2em;
			}
		`,
	],
	standalone: false,
})
export class StepMetalDealersChecklistComponent {}
