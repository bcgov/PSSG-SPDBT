import { Component, Input } from '@angular/core';
import { PayerPreferenceTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-sa-checklist',
	template: `
		<section class="step-section p-4">
			<div class="step">
				<app-step-title
					title="To submit a request for a criminal record check, you will need the following"
				></app-step-title>
				<div class="row">
					<div class="offset-lg-2 col-lg-8 col-md-12 col-sm-12 mx-auto">
						<ul *ngIf="payeeType === payerPreferenceTypeCodes.Applicant">
							<li>Your BC Services Card (recommended), or other government issued identification.</li>
							<li *ngIf="isCrrpa">
								A method of payment (Visa, Mastercard, American Express, Visa Debit, Mastercard Debit)
							</li>
							<li>
								Before you submit a request for a criminal record check, if possible, verify your identity by using your
								BC Services Card.
							</li>
						</ul>
						<ul *ngIf="payeeType === payerPreferenceTypeCodes.Organization">
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
export class SaChecklistComponent {
	payerPreferenceTypeCodes = PayerPreferenceTypeCode;

	@Input() payeeType: PayerPreferenceTypeCode | undefined = undefined;
	@Input() isCrrpa = false;
}
