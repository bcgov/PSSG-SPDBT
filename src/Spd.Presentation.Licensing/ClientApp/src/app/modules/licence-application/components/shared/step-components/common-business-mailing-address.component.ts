import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-common-business-mailing-address',
	template: `
		<app-common-address [form]="form" [isWizardStep]="isWizardStep" [isReadonly]="isReadonly"></app-common-address>

		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-md-12 col-sm-12 mb-3" [ngClass]="isWizardStep ? 'offset-lg-2 col-lg-8' : ''">
					<mat-checkbox formControlName="isMailingTheSame">
						The business address and mailing address are the same
					</mat-checkbox>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class CommonBusinessMailingAddressComponent implements OnInit {
	@Input() form!: FormGroup;
	@Input() isWizardStep = true;
	@Input() isReadonly = false;
	@Input() isCheckboxReadOnly = false;

	ngOnInit(): void {
		if (this.isCheckboxReadOnly) {
			this.isMailingTheSame.disable({ emitEvent: false });
		} else {
			this.isMailingTheSame.enable();
		}
	}

	get isMailingTheSame(): FormControl {
		return this.form.get('isMailingTheSame') as FormControl;
	}
}
