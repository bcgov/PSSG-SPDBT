import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-common-residential-address',
	template: `
		<app-common-address [form]="form" [isWizardStep]="isWizardStep" [isReadOnly]="isReadOnly"></app-common-address>

		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-md-12 col-sm-12 mb-3" [ngClass]="isWizardStep ? 'offset-lg-2 col-lg-8' : ''">
					<mat-checkbox formControlName="isMailingTheSameAsResidential">
						My residential address and mailing address are the same
					</mat-checkbox>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class CommonResidentialAddressComponent implements OnInit {
	@Input() form!: FormGroup;
	@Input() isWizardStep = true;
	@Input() isReadOnly = false;
	@Input() isCheckboxReadOnly = false;

	ngOnInit(): void {
		if (this.isCheckboxReadOnly) {
			this.isMailingTheSameAsResidential.disable({ emitEvent: false });
		} else {
			this.isMailingTheSameAsResidential.enable();
		}
	}

	get isMailingTheSameAsResidential(): FormControl {
		return this.form.get('isMailingTheSameAsResidential') as FormControl;
	}
}
