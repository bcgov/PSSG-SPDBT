import { Component, Input } from '@angular/core';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-checklist',
	template: `
		<section class="step-section pt-4 pb-5 px-3">
			<div class="step">
				<div class="row">
					<div class="col-md-8 col-sm-12 mx-auto">
						<div class="title mb-5">To submit a request for a criminal record check, you will need the following</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6 col-sm-12 mx-auto">
						<ul *ngIf="paymentBy == 'APP'">
							<li>Your BC Services Card (recommended), or other government issued identification.</li>
							<li>A method of payment (Visa, Mastercard, American Express, Visa Debit, Mastercard Debit)</li>
							<li>
								Before you submit a request for a criminal record check, if possible, verify your identity by using your
								BC Services Card.
							</li>
						</ul>
						<ul *ngIf="paymentBy == 'ORG'">
							<li>Your BC Services Card (recommended), or other government issued identification.</li>
							<li>
								Before you submit a request for a criminal record check, if possible, verify your identity by using your
								BC Services Card.
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	`,
	styles: [
		`
			li:not(:last-child) {
				margin-bottom: 1em;
			}
		`,
	],
})
export class ChecklistComponent {
	matcher = new FormErrorStateMatcher();

	@Input() paymentBy!: 'APP' | 'ORG';

	constructor() {}
}
