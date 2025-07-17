import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-form-address-and-is-same-flag',
	template: `
		<form [formGroup]="form" novalidate>
			<mat-checkbox formControlName="isAddressTheSame">
				{{ isAddressTheSameLabel }}
			</mat-checkbox>
			@if (!isAddressTheSame.value) {
				<mat-divider class="mt-2 mb-3 mat-divider-primary"></mat-divider>
			}
		</form>

		@if (!isAddressTheSame.value) {
			<app-form-address [form]="form" [isReadonly]="isReadonly" [isWideView]="isWideView"></app-form-address>
		}
	`,
	styles: [],
	standalone: false,
})
export class FormAddressAndIsSameFlagComponent implements OnInit {
	@Input() form!: FormGroup;
	@Input() isWideView = false;
	@Input() isReadonly = false;
	@Input() isCheckboxReadOnly = false;
	@Input() isAddressTheSameLabel = 'The address is the same';

	ngOnInit(): void {
		if (this.isCheckboxReadOnly) {
			this.isAddressTheSame.disable({ emitEvent: false });
		} else {
			this.isAddressTheSame.enable();
		}
	}

	get isAddressTheSame(): FormControl {
		return this.form.get('isAddressTheSame') as FormControl;
	}
}
