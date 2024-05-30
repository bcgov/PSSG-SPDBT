import { Component, Input } from '@angular/core';
import { PayerPreferenceTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-sa-checklist',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title title="To submit this criminal record check form, you will need:"></app-step-title>
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 mx-auto">
						<ul>
							<li>
								Your BC Services Card Login (recommended) or other
								<a
									href="https://www2.gov.bc.ca/gov/content/safety/crime-prevention/criminal-record-check/law-policy"
									target="_blank"
									>government issued photo identification</a
								>.
							</li>
							<li>
								If you do not have the BC Services Card Login, you can
								<a href="https://id.gov.bc.ca/account/setup-instruction" target="_blank">set it up now</a> and return to
								this application when you have completed that process.
							</li>
							<ng-container *ngIf="isCrrpa && payeeType === payerPreferenceTypeCodes.Applicant">
								<li>
									A method of payment (Visa, Mastercard, American Express, Visa Debit, Mastercard Debit). The criminal
									record fee is non-refundable.
								</li>
							</ng-container>
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
export class SaChecklistComponent {
	payerPreferenceTypeCodes = PayerPreferenceTypeCode;

	@Input() payeeType: PayerPreferenceTypeCode | undefined = undefined;
	@Input() isCrrpa = false;
}
