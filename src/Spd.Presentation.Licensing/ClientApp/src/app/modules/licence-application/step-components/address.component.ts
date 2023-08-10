import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BooleanTypeCode } from 'src/app/api/models';

@Component({
	selector: 'app-address',
	template: `
		<div class="step">
			<app-step-title
				title="Provide your residential address"
				subtitle="This is the address where you currently live"
			></app-step-title>
			<div class="step-container row">
				<div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<form [formGroup]="form" novalidate></form>
				</div>
			</div>
		</div>
	`,
	styles: [],
})
export class AddressComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.formBuilder.group({
		address: new FormControl(''),
	});

	constructor(private formBuilder: FormBuilder) {}
}
