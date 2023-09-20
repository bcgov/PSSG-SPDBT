import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-additional-gov-id',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title title="Provide an additional piece of government-issued photo ID"></app-step-title>
				<div class="step-container"></div>
			</div>
		</section>
	`,
	styles: [],
})
export class AdditionalGovIdComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group({
		hasBcDriversLicence: new FormControl(''),
		bcDriversLicenceNumber: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
